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
    Task OnKnockback(float vx, float vy, float vz);
    Task OnPrivilegeList(string[] privileges);
    Task OnGameModeChanged(string mode);
    Task OnTeleported(float x, float y, float z);
    Task OnBreathUpdate(float breath, float maxBreath);
    Task OnCraftingRecipes(object[] recipes);
    Task OnSmeltingRecipes(object[] recipes);
    Task OnChestInventory(object[] items);
    Task OnFurnaceUpdate(string input, string fuel, string output, float progress);
    Task OnFallingBlock(int fromX, int fromY, int fromZ, int toX, int toY, int toZ, ushort blockType);
}

public class GameHub : Hub<IGameClient>
{
    private static readonly Dictionary<string, DateTime> _lastActionTimes = new();

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
        if (!CheckRateLimit(Context.ConnectionId, "chat", 500)) return;

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
        if (!CheckRateLimit(Context.ConnectionId, "place", 250)) return;

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
        if (!CheckRateLimit(Context.ConnectionId, "dig", 250)) return;

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

        var toolItem = player.GetSelectedHotbarItem();
        if (toolItem != null)
        {
            var toolName = toolItem.ItemId.ToLowerInvariant();
            var isTool = toolName.Contains("sword") || toolName.Contains("pickaxe") ||
                toolName.Contains("axe") || toolName.Contains("shovel") || toolName.Contains("hoe");

            if (isTool)
            {
                var durabilityStr = toolItem.Metadata;
                int maxDurability = toolName switch
                {
                    var n when n.StartsWith("wooden_") => 59,
                    var n when n.StartsWith("stone_") => 131,
                    var n when n.StartsWith("iron_") => 250,
                    var n when n.StartsWith("diamond_") => 1561,
                    _ => 60
                };
                int currentDurability = maxDurability;
                if (int.TryParse(durabilityStr, out var parsed))
                {
                    currentDurability = parsed;
                }
                currentDurability--;

                if (currentDurability <= 0)
                {
                    player.Inventory.RemoveItem(player.SelectedHotbarSlot, 1);
                    await Clients.Caller.OnChatMessage("Server", $"Your {toolName} broke!");
                }
                else
                {
                    player.Inventory[player.SelectedHotbarSlot] = toolItem with { Metadata = currentDurability.ToString() };
                }

                await SendInventoryUpdate(player);
            }
        }
    }

    public async Task<float> DigBlockStart(int x, int y, int z)
    {
        var player = _gameServer.GetPlayerByConnection(Context.ConnectionId);
        if (player == null) return -1f;
        var blockPos = new Vector3s((short)x, (short)y, (short)z);
        var block = _gameServer.DefaultWorld.GetBlock(blockPos);
        var blockData = block.ToUInt16();
        if (blockData == 0) return -1f;
        var blockDef = _blockDefinitionManager.Get(blockData);
        if (blockDef == null || !blockDef.Breakable) return -1f;

        if (blockDef.Groups.TryGetValue("dig_immediate", out _))
        {
            return 0.15f;
        }

        var hardness = blockDef.Hardness;
        if (hardness <= 0) hardness = 0.1f;

        var toolMultiplier = 1.0f;
        var toolItem = player.GetSelectedHotbarItem();
        if (toolItem != null)
        {
            var toolName = toolItem.ItemId.ToLowerInvariant();
            toolMultiplier = GetToolMultiplier(toolName, blockDef);
        }

        var digTime = hardness / toolMultiplier;
        return Math.Max(digTime, 0.1f);
    }

    private static float GetToolMultiplier(string toolName, BlockDefinition blockDef)
    {
        var materialMultiplier = toolName switch
        {
            var n when n.StartsWith("diamond_") => 8,
            var n when n.StartsWith("iron_") => 6,
            var n when n.StartsWith("stone_") => 4,
            var n when n.StartsWith("wooden_") => 2,
            _ => 1
        };

        string? toolGroup = null;
        if (toolName.Contains("pickaxe")) toolGroup = "cracky";
        else if (toolName.Contains("axe")) toolGroup = "choppy";
        else if (toolName.Contains("shovel")) toolGroup = "crumbly";
        else if (toolName.Contains("sword")) toolGroup = "snappy";
        else if (toolName.Contains("hoe")) toolGroup = "crumbly";

        if (toolGroup != null && blockDef.Groups.TryGetValue(toolGroup, out var groupLevel))
        {
            if (groupLevel > 0)
            {
                return materialMultiplier;
            }
        }

        if (blockDef.Groups.TryGetValue("oddly_breakable_by_hand", out var handLevel) && handLevel > 0)
        {
            return Math.Max(materialMultiplier, 1.0f);
        }

        return 1.0f;
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

    public async Task InteractWithBlock(int x, int y, int z)
    {
        var player = _gameServer.GetPlayerByConnection(Context.ConnectionId);
        if (player == null) return;
        var blockPos = new Vector3s((short)x, (short)y, (short)z);
        var block = _gameServer.DefaultWorld.GetBlock(blockPos);
        var blockDef = _blockDefinitionManager.Get(block.ToUInt16());
        if (blockDef == null) return;
        if (blockDef.Climbable)
        {
        }
        if (blockDef.Interactive)
        {
            var blockName = blockDef.Name;
            if (blockName == "chest")
            {
                var posKey = GameServer.PositionKey(x, y, z);
                var chestInv = _gameServer.GetOrCreateChestInventory(posKey);
                var items = chestInv
                    .Select(i => i == null ? null : (object)new { itemId = i.ItemId, count = i.Count, metadata = i.Metadata })
                    .ToArray();
                await Clients.Caller.OnChestInventory(items!);
            }
            else if (blockName == "furnace")
            {
                var recipes = _smeltingSystem.GetAllRecipes();
                var recipeDtos = recipes.Select(r => new
                {
                    input = r.InputItemId,
                    result = r.ResultItemId,
                    cookTime = r.CookTime,
                    experience = r.Experience
                }).ToArray();
                await Clients.Caller.OnSmeltingRecipes(recipeDtos!);

                var posKey = GameServer.PositionKey(x, y, z);
                var existingOp = _gameServer.GetFurnaceOperation(posKey);
                if (existingOp != null)
                {
                    await Clients.Caller.OnFurnaceUpdate(
                        existingOp.InputItemId,
                        "coal",
                        string.Empty,
                        existingOp.Progress);
                }
            }
            else if (blockName == "crafting_table")
            {
                var recipes = _craftingSystem.GetAllRecipes();
                var recipeDtos = recipes.Select((r, idx) => new
                {
                    result = r.ResultItemId,
                    resultCount = r.ResultCount,
                    ingredients = r.Ingredients.Select(ing => new object[] { ing.ItemId, ing.Count }).ToArray()
                }).ToArray();
                await Clients.Caller.OnCraftingRecipes(recipeDtos!);
            }
        }
    }

    public async Task PunchPlayer(string targetName)
    {
        var attacker = _gameServer.GetPlayerByConnection(Context.ConnectionId);
        if (attacker == null) return;
        var target = _gameServer.GetPlayer(targetName);
        if (target == null || target.IsDead) return;
        var toolItem = attacker.GetSelectedHotbarItem();
        var damage = 1.0f;
        if (toolItem != null)
        {
            var toolName = toolItem.ItemId.ToLowerInvariant();
            damage = toolName switch
            {
                "wooden_sword" => 4, "stone_sword" => 5, "iron_sword" => 6, "diamond_sword" => 7,
                "wooden_axe" => 3, "stone_axe" => 4, "iron_axe" => 5, "diamond_axe" => 6,
                "wooden_pickaxe" => 2, "stone_pickaxe" => 3, "iron_pickaxe" => 4, "diamond_pickaxe" => 5,
                _ => 1
            };
        }
        var knockback = _gameServer.DamagePlayerWithKnockback(target, damage, attacker.Position, "player");
        await Clients.Client(target.ConnectionId).OnKnockback(knockback.X, knockback.Y, knockback.Z);
    }

    public async Task GetPrivileges()
    {
        var player = _gameServer.GetPlayerByConnection(Context.ConnectionId);
        if (player == null) return;
        var privs = _gameServer.Privileges.GetPlayerPrivileges(player.Name);
        await Clients.Caller.OnPrivilegeList(privs);
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

    public async Task GetCraftingRecipes()
    {
        var recipes = _craftingSystem.GetAllRecipes();
        var recipeDtos = recipes.Select(r => new
        {
            result = r.ResultItemId,
            resultCount = r.ResultCount,
            ingredients = r.Ingredients.Select(ing => new object[] { ing.ItemId, ing.Count }).ToArray()
        }).ToArray();
        await Clients.Caller.OnCraftingRecipes(recipeDtos!);
    }

    public async Task CraftRecipe(int recipeIndex)
    {
        var player = _gameServer.GetPlayerByConnection(Context.ConnectionId);
        if (player == null) return;

        var recipes = _craftingSystem.GetAllRecipes();
        if (recipeIndex < 0 || recipeIndex >= recipes.Count)
        {
            await Clients.Caller.OnChatMessage("Server", "Invalid recipe index.");
            return;
        }

        var recipe = recipes[recipeIndex];
        var availableItems = player.Inventory.GetAll()
            .Where(i => i != null)
            .Select(i => (i!.ItemId, i.Count))
            .ToList();

        if (!_craftingSystem.CanCraft(recipe, availableItems))
        {
            await Clients.Caller.OnChatMessage("Server", $"Missing ingredients for {recipe.ResultItemId}.");
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

    public async Task GetSmeltingRecipes()
    {
        var recipes = _smeltingSystem.GetAllRecipes();
        var recipeDtos = recipes.Select(r => new
        {
            input = r.InputItemId,
            result = r.ResultItemId,
            cookTime = r.CookTime,
            experience = r.Experience
        }).ToArray();
        await Clients.Caller.OnSmeltingRecipes(recipeDtos!);
    }

    public async Task StartSmelting(string inputItemId, string resultItemId, int x, int y, int z)
    {
        var player = _gameServer.GetPlayerByConnection(Context.ConnectionId);
        if (player == null) return;

        var posKey = GameServer.PositionKey(x, y, z);
        var started = _gameServer.StartSmelting(player, posKey, inputItemId, resultItemId);

        if (started)
        {
            await SendInventoryUpdate(player);
            await Clients.Caller.OnFurnaceUpdate(inputItemId, "coal", string.Empty, 0f);
            await Clients.Caller.OnChatMessage("Server", $"Smelting {inputItemId}...");
        }
        else
        {
            await Clients.Caller.OnChatMessage("Server", "Cannot start smelting. Check you have the input item and fuel (coal/charcoal).");
        }
    }

    public async Task GetChestInventory(int x, int y, int z)
    {
        var posKey = GameServer.PositionKey(x, y, z);
        var chestInv = _gameServer.GetOrCreateChestInventory(posKey);
        var items = chestInv
            .Select(i => i == null ? null : (object)new { itemId = i.ItemId, count = i.Count, metadata = i.Metadata })
            .ToArray();
        await Clients.Caller.OnChestInventory(items!);
    }

    public async Task MoveItemToChest(int slotIndex, int chestSlot, int x, int y, int z)
    {
        var player = _gameServer.GetPlayerByConnection(Context.ConnectionId);
        if (player == null) return;

        var posKey = GameServer.PositionKey(x, y, z);
        var moved = _gameServer.MoveItemToChest(player, posKey, slotIndex, chestSlot);

        if (moved)
        {
            await SendInventoryUpdate(player);
            var chestInv = _gameServer.GetChestInventory(posKey);
            if (chestInv != null)
            {
                var items = chestInv
                    .Select(i => i == null ? null : (object)new { itemId = i.ItemId, count = i.Count, metadata = i.Metadata })
                    .ToArray();
                await Clients.Caller.OnChestInventory(items!);
            }
        }
    }

    public async Task TakeItemFromChest(int chestSlot, int slotIndex, int x, int y, int z)
    {
        var player = _gameServer.GetPlayerByConnection(Context.ConnectionId);
        if (player == null) return;

        var posKey = GameServer.PositionKey(x, y, z);
        var taken = _gameServer.TakeItemFromChest(player, posKey, chestSlot, slotIndex);

        if (taken)
        {
            await SendInventoryUpdate(player);
            var chestInv = _gameServer.GetChestInventory(posKey);
            if (chestInv != null)
            {
                var items = chestInv
                    .Select(i => i == null ? null : (object)new { itemId = i.ItemId, count = i.Count, metadata = i.Metadata })
                    .ToArray();
                await Clients.Caller.OnChestInventory(items!);
            }
        }
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
            climbable = kvp.Value.Climbable,
            textureName = kvp.Value.TextureName
        });
        var json = JsonSerializer.Serialize(dto);
        await Clients.Caller.OnBlockDefinitions(json);
    }

    private static bool CheckRateLimit(string connectionId, string action, int cooldownMs)
    {
        var key = $"{connectionId}:{action}";
        var now = DateTime.UtcNow;

        if (_lastActionTimes.TryGetValue(key, out var lastTime))
        {
            if ((now - lastTime).TotalMilliseconds < cooldownMs)
                return false;
        }

        _lastActionTimes[key] = now;
        return true;
    }
}
