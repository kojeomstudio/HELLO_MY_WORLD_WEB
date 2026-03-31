using Microsoft.AspNetCore.SignalR;
using System.Text.Json;
using WebGameServer.Core;
using WebGameServer.Core.Auth;
using WebGameServer.Core.Chat;
using WebGameServer.Core.Crafting;
using WebGameServer.Core.Entities;
using WebGameServer.Core.Game;
using WebGameServer.Core.Physics;
using WebGameServer.Core.Player;
using WebGameServer.Core.Smelting;
using WebGameServer.Core.World;
using PlayerEnt = WebGameServer.Core.Player.Player;
using PlayerState = WebGameServer.Core.Player.PlayerState;

namespace WebGameServer.Services;

public interface IGameClient
{
    Task OnChunkReceived(int chunkX, int chunkY, int chunkZ, byte[] data);
    Task OnPlayerJoined(string playerName);
    Task OnPlayerLeft(string playerName);
    Task OnPlayerListUpdate(string[] players);
    Task OnPlayerPositionUpdate(string playerName, float x, float y, float z, float yaw, float pitch);
    Task OnChatMessage(string sender, string message);
    Task OnBlockUpdate(int x, int y, int z, ushort blockData);
    Task OnHealthUpdate(float health, float maxHealth);
    Task OnInventoryUpdate(object[] items);
    Task OnTimeUpdate(long time, float speed, float skyBrightness);
    Task OnEntitySpawned(Guid entityId, string entityType, float x, float y, float z);
    Task OnEntityDespawned(Guid entityId);
    Task OnEntityUpdate(Guid entityId, float x, float y, float z);
    Task OnCraftResult(string itemId, int count);
    Task OnBlockDefinitions(string definitionsJson);
    Task OnDeath(string message);
}

public class GameHub : Hub<IGameClient>
{
    private readonly GameServer _gameServer;
    private readonly ILogger<GameHub> _logger;
    private readonly ChatCommandManager _chatCommands;
    private readonly AuthenticationService _authService;
    private readonly CraftingSystem _craftingSystem;
    private readonly EntityManager _entityManager;
    private readonly BlockDefinitionManager _blockDefinitionManager;
    private readonly SmeltingSystem _smeltingSystem;
    private readonly IHubContext<GameHub, IGameClient> _hubContext;

    public GameHub(
        GameServer gameServer,
        ILogger<GameHub> logger,
        ChatCommandManager chatCommands,
        AuthenticationService authService,
        CraftingSystem craftingSystem,
        EntityManager entityManager,
        BlockDefinitionManager blockDefinitionManager,
        SmeltingSystem smeltingSystem,
        IHubContext<GameHub, IGameClient> hubContext)
    {
        _gameServer = gameServer;
        _logger = logger;
        _chatCommands = chatCommands;
        _authService = authService;
        _craftingSystem = craftingSystem;
        _entityManager = entityManager;
        _blockDefinitionManager = blockDefinitionManager;
        _smeltingSystem = smeltingSystem;
        _hubContext = hubContext;
    }

    public override async Task OnConnectedAsync()
    {
        _logger.LogInformation("Client connected: {ConnectionId}", Context.ConnectionId);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        _logger.LogInformation("Client disconnected: {ConnectionId}", Context.ConnectionId);
        var player = _gameServer.GetPlayerByConnection(Context.ConnectionId);
        if (player != null)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "players");
            _gameServer.PlayerLeave(Context.ConnectionId);
            await Clients.All.OnPlayerLeft(player.Name);
            await SendPlayerList();
        }
        await base.OnDisconnectedAsync(exception);
    }

    public async Task Join(string playerName)
    {
        var authResult = _authService.AuthenticatePlayer(
            playerName, Context.ConnectionId,
            _gameServer.OnlinePlayerCount, _gameServer.MaxPlayers);

        if (authResult != AuthResult.Success)
        {
            var msg = authResult switch
            {
                AuthResult.NameInvalid => "Invalid name. Use 1-20 characters.",
                AuthResult.NameTaken => "Name already in use.",
                AuthResult.Banned => "You are banned from this server.",
                AuthResult.ServerFull => "Server is full.",
                _ => "Failed to join."
            };
            await Clients.Caller.OnChatMessage("Server", msg);
            return;
        }

        if (!_gameServer.PlayerJoin(Context.ConnectionId, playerName))
        {
            await Clients.Caller.OnChatMessage("Server", "Failed to join. Name taken or server full.");
            return;
        }

        var player = _gameServer.GetPlayer(playerName);
        if (player == null) return;

        await Groups.AddToGroupAsync(Context.ConnectionId, "players");
        player.State = PlayerState.Playing;

        player.Inventory.AddItem(new ItemStack("wooden_pickaxe", 1));
        player.Inventory.AddItem(new ItemStack("wooden_sword", 1));
        player.Inventory.AddItem(new ItemStack("torch", 16));
        player.Inventory.AddItem(new ItemStack("bread", 5));

        await Clients.All.OnPlayerJoined(playerName);
        await Clients.Caller.OnPlayerListUpdate(_gameServer.OnlinePlayers.Select(p => p.Name).ToArray());
        await Clients.Caller.OnHealthUpdate(player.Health, player.MaxHealth);
        await SendInventoryUpdate(player);
        await SendTimeUpdate();
        await SendBlockDefinitions();
        await SendInitialChunks(player);
    }

    public async Task UpdatePosition(float x, float y, float z, float vx, float vy, float vz, float yaw, float pitch)
    {
        var player = _gameServer.GetPlayerByConnection(Context.ConnectionId);
        if (player == null) return;

        _gameServer.UpdatePlayerPosition(Context.ConnectionId, new Vector3(x, y, z), new Vector3(vx, vy, vz), yaw, pitch);

        var nearbyPlayers = _gameServer.GetPlayersInRange(player.Position, 64);
        foreach (var nearby in nearbyPlayers)
        {
            if (nearby.ConnectionId != Context.ConnectionId)
            {
                await Clients.Client(nearby.ConnectionId)
                    .OnPlayerPositionUpdate(player.Name, x, y, z, yaw, pitch);
            }
        }
    }

    public async Task SendChat(string message)
    {
        var player = _gameServer.GetPlayerByConnection(Context.ConnectionId);
        if (player == null) return;

        if (!string.IsNullOrEmpty(message) && message[0] == '/')
        {
            var result = await _chatCommands.TryExecute(player.Name, message);
            if (result != null)
            {
                await Clients.Caller.OnChatMessage("Server", result);
            }
            return;
        }

        await Clients.All.OnChatMessage(player.Name, message);
    }

    public async Task PlaceBlock(int x, int y, int z, ushort blockType)
    {
        var player = _gameServer.GetPlayerByConnection(Context.ConnectionId);
        if (player == null) return;

        var blockDef = _blockDefinitionManager.Get(blockType);
        if (blockDef == null || blockDef.Id == (ushort)BlockType.Air)
        {
            return;
        }

        var newBlock = new Block((BlockType)blockType);
        _gameServer.DefaultWorld.SetBlock(new Vector3s((short)x, (short)y, (short)z), newBlock);
        await Clients.All.OnBlockUpdate(x, y, z, newBlock.ToUInt16());
    }

    public async Task DigBlock(int x, int y, int z)
    {
        var player = _gameServer.GetPlayerByConnection(Context.ConnectionId);
        if (player == null) return;

        var blockPos = new Vector3s((short)x, (short)y, (short)z);
        var oldBlock = _gameServer.DefaultWorld.GetBlock(blockPos);
        var blockData = oldBlock.ToUInt16();

        if (blockData == 0) return;

        var blockDef = _blockDefinitionManager.Get(blockData);
        if (blockDef != null && !blockDef.Breakable)
        {
            return;
        }

        _gameServer.DefaultWorld.SetBlock(blockPos, Block.Air);
        await Clients.All.OnBlockUpdate(x, y, z, 0);

        var dropName = blockDef?.Drops ?? blockDef?.Name ?? ((BlockType)(blockData & 0xFF)).ToString().ToLowerInvariant();
        var itemEntity = new ItemEntity(dropName, 1, new Vector3(x + 0.5f, y + 0.5f, z + 0.5f));
        _entityManager.Add(itemEntity);
    }

    public async Task UseItem(int slotIndex)
    {
        var player = _gameServer.GetPlayerByConnection(Context.ConnectionId);
        if (player == null) return;
        if (player.IsDead) return;

        var item = player.Inventory[slotIndex];
        if (item == null) return;

        var itemId = item.ItemId.ToLowerInvariant();
        var isFood = itemId is "bread" or "apple" or "cooked_beef" or "cooked_pork" or
            "raw_beef" or "raw_pork" or "carrot" or "potato" or "baked_potato" or
            "mushroom_stew" or "melon_slice" or "cookie" or "cake";

        if (isFood)
        {
            var removed = player.Inventory.RemoveItem(slotIndex, 1);
            if (removed != null)
            {
                _gameServer.FeedPlayer(player, 4.0f);
                _gameServer.HealPlayer(player, 2.0f);
                await SendInventoryUpdate(player);
            }
        }
    }

    public async Task Respawn()
    {
        var player = _gameServer.GetPlayerByConnection(Context.ConnectionId);
        if (player == null) return;
        if (!player.IsDead) return;

        player.Respawn();

        var spawnY = _gameServer.DefaultWorld.GetGroundHeight(0, 0) + 2;
        player.Position = new Vector3(0, spawnY, 0);
        player.LastGroundY = spawnY;
        player.FallDistance = 0;

        await Clients.Caller.OnHealthUpdate(player.Health, player.MaxHealth);
        await SendInitialChunks(player);
    }

    public async Task RequestChunk(int chunkX, int chunkY, int chunkZ)
    {
        var player = _gameServer.GetPlayerByConnection(Context.ConnectionId);
        if (player == null) return;

        var chunk = _gameServer.DefaultWorld.GetChunk(new ChunkCoord(chunkX, chunkY, chunkZ));
        var data = chunk.Serialize();
        await Clients.Caller.OnChunkReceived(chunkX, chunkY, chunkZ, data);
    }

    public async Task SelectSlot(int slot)
    {
        var player = _gameServer.GetPlayerByConnection(Context.ConnectionId);
        if (player == null) return;
        player.SelectedHotbarSlot = slot;
    }

    public async Task InteractBlock(int x, int y, int z)
    {
        var player = _gameServer.GetPlayerByConnection(Context.ConnectionId);
        if (player == null) return;
    }

    public async Task Craft(string recipeId)
    {
        var player = _gameServer.GetPlayerByConnection(Context.ConnectionId);
        if (player == null) return;

        var availableItems = player.Inventory.GetAll()
            .Where(i => i != null)
            .Select(i => (i!.ItemId, i.Count))
            .ToList();

        var recipe = _craftingSystem.FindRecipe(availableItems);
        if (recipe == null)
        {
            await Clients.Caller.OnChatMessage("Server", "No matching crafting recipe.");
            return;
        }

        var result = _craftingSystem.Craft(recipe, availableItems);
        player.Inventory.Clear();
        foreach (var (itemId, count) in result)
        {
            player.Inventory.AddItem(new ItemStack(itemId, count));
        }
        player.Inventory.AddItem(new ItemStack(recipe.ResultItemId, recipe.ResultCount));

        await SendInventoryUpdate(player);
        await Clients.Caller.OnCraftResult(recipe.ResultItemId, recipe.ResultCount);
    }

    public async Task RequestInventory()
    {
        var player = _gameServer.GetPlayerByConnection(Context.ConnectionId);
        if (player == null) return;
        await SendInventoryUpdate(player);
    }

    public async Task DropItem(int slotIndex, int count)
    {
        var player = _gameServer.GetPlayerByConnection(Context.ConnectionId);
        if (player == null) return;

        var item = player.Inventory.RemoveItem(slotIndex, count);
        if (item != null)
        {
            var entity = new ItemEntity(item.ItemId, item.Count, player.Position);
            _entityManager.Add(entity);
            await SendInventoryUpdate(player);
        }
    }

    private async Task SendInitialChunks(PlayerEnt player)
    {
        var chunkX = (int)Math.Floor(player.Position.X / Chunk.Size);
        var chunkY = (int)Math.Floor(player.Position.Y / Chunk.Size);
        var chunkZ = (int)Math.Floor(player.Position.Z / Chunk.Size);

        for (int dx = -3; dx <= 3; dx++)
        {
            for (int dy = -1; dy <= 2; dy++)
            {
                for (int dz = -3; dz <= 3; dz++)
                {
                    var chunk = _gameServer.DefaultWorld.GetChunk(new ChunkCoord(chunkX + dx, chunkY + dy, chunkZ + dz));
                    var data = chunk.Serialize();
                    await Clients.Caller.OnChunkReceived(chunkX + dx, chunkY + dy, chunkZ + dz, data);
                }
            }
        }
    }

    private async Task SendPlayerList()
    {
        await Clients.All.OnPlayerListUpdate(_gameServer.OnlinePlayers.Select(p => p.Name).ToArray());
    }

    private async Task SendInventoryUpdate(PlayerEnt player)
    {
        var items = player.Inventory.GetAll()
            .Select(i => i == null ? null : (object)new { itemId = i.ItemId, count = i.Count, metadata = i.Metadata })
            .ToArray();
        await Clients.Caller.OnInventoryUpdate(items!);
    }

    private async Task SendTimeUpdate()
    {
        await Clients.Caller.OnTimeUpdate(
            _gameServer.GameTime,
            _gameServer.TimeSpeed,
            _gameServer.DayNight.SkyBrightness);
    }

    private async Task SendBlockDefinitions()
    {
        var definitions = _blockDefinitionManager.GetAll();
        var dto = definitions.Select(kvp => new
        {
            id = kvp.Key,
            name = kvp.Value.Name,
            solid = kvp.Value.Solid,
            transparent = kvp.Value.Transparent,
            color = kvp.Value.Color,
            liquid = kvp.Value.Liquid,
            light = kvp.Value.Light,
            damage = kvp.Value.Damage,
            breakable = kvp.Value.Breakable,
            interactive = kvp.Value.Interactive,
            drawType = kvp.Value.DrawType,
            hardness = kvp.Value.Hardness,
            drops = kvp.Value.Drops,
            climbable = kvp.Value.Climbable
        });
        var json = JsonSerializer.Serialize(dto);
        await Clients.Caller.OnBlockDefinitions(json);
    }
}
