using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using System.Text.Json;
using WebGameServer.Core;
using WebGameServer.Core.Auth;
using WebGameServer.Core.Chat;
using WebGameServer.Core.Crafting;
using WebGameServer.Core.Entities;
using WebGameServer.Core.Game;
using WebGameServer.Core.Physics;
using WebGameServer.Core.Player;
using WebGameServer.Core.Protection;
using WebGameServer.Core.Smelting;
using WebGameServer.Core.ToolWear;
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
    Task OnBlockUpdate(int x, int y, int z, uint blockData);
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
    Task OnFoodUpdate(float foodLevel, float maxFood);
    Task OnCraftingRecipes(object[] recipes);
    Task OnSmeltingRecipes(object[] recipes);
    Task OnChestInventory(object[] items);
    Task OnFurnaceUpdate(string input, string fuel, string output, float progress);
    Task OnFallingBlock(int fromX, int fromY, int fromZ, int toX, int toY, int toZ, ushort blockType);
    Task OnArmorUpdate(object[] armorSlots);
    Task OnExperienceUpdate(int level, int totalExp);
    Task OnPositionCorrection(float x, float y, float z);
    Task OnSignEditorOpened(int x, int y, int z, string text);
    Task OnBlockSound(string blockType, int x, int y, int z);
}

public class GameHub : Hub<IGameClient>
{
    private static readonly ConcurrentDictionary<string, DateTime> _lastActionTimes = new();
    private static readonly ConcurrentDictionary<string, int> _joinAttempts = new();

    private readonly GameServer _gameServer;
    private readonly ILogger<GameHub> _logger;
    private readonly ChatCommandManager _chatCommands;
    private readonly AuthenticationService _authService;
    private readonly CraftingSystem _craftingSystem;
    private readonly EntityManager _entityManager;
    private readonly BlockDefinitionManager _blockDefinitionManager;
    private readonly SmeltingSystem _smeltingSystem;
    private readonly IHubContext<GameHub, IGameClient> _hubContext;
    private readonly ServerConfig _config;
    private readonly AreaProtectionSystem _areaProtection;
    private readonly PlayerDatabase _playerDb;

    private static readonly Dictionary<string, int> DefaultStartItemCounts = new(StringComparer.OrdinalIgnoreCase)
    {
        ["torch"] = 16,
        ["bread"] = 5,
        ["coal"] = 8,
        ["oak_planks"] = 16,
        ["planks"] = 16,
        ["stick"] = 8,
        ["apple"] = 5
    };

    public GameHub(
        GameServer gameServer,
        ILogger<GameHub> logger,
        ChatCommandManager chatCommands,
        AuthenticationService authService,
        CraftingSystem craftingSystem,
        EntityManager entityManager,
        BlockDefinitionManager blockDefinitionManager,
        SmeltingSystem smeltingSystem,
        IHubContext<GameHub, IGameClient> hubContext,
        ServerConfig config,
        AreaProtectionSystem areaProtection,
        PlayerDatabase playerDb)
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
        _config = config;
        _areaProtection = areaProtection;
        _playerDb = playerDb;
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

    public async Task Join(string playerName, string? password = null)
    {
        var ipAddress = Context.GetHttpContext()?.Connection?.RemoteIpAddress?.ToString() ?? Context.ConnectionId;
        var currentAttempts = _joinAttempts.AddOrUpdate(ipAddress, 1, (_, old) => old + 1);
        if (currentAttempts >= 5)
        {
            var oldestAttempt = _joinAttempts.TryGetValue(ipAddress + "_time", out var t) ? t : 0;
            if (DateTimeOffset.UtcNow.ToUnixTimeSeconds() - oldestAttempt < 60)
            {
                await Clients.Caller.OnChatMessage("Server", "Too many join attempts. Wait a minute.");
                return;
            }
            _joinAttempts.TryRemove(ipAddress, out _);
            _joinAttempts.TryRemove(ipAddress + "_time", out _);
        }
        if (currentAttempts == 1)
        {
            _joinAttempts[ipAddress + "_time"] = (int)DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        }

        var authResult = _authService.AuthenticateWithPassword(
            playerName, password, Context.ConnectionId,
            _gameServer.OnlinePlayerCount, _gameServer.MaxPlayers, ipAddress, _playerDb);

        if (authResult != AuthResult.Success)
        {
            var msg = authResult switch
            {
                AuthResult.NameInvalid => "Invalid name. Use 1-20 alphanumeric characters, underscores, or hyphens. Reserved names are not allowed.",
                AuthResult.NameTaken => "Name already in use.",
                AuthResult.Banned => "You are banned from this server.",
                AuthResult.ServerFull => "Server is full.",
                AuthResult.PasswordRequired => "This account requires a password.",
                AuthResult.PasswordIncorrect => "Incorrect password.",
                _ => "Failed to join."
            };
            await Clients.Caller.OnChatMessage("Server", msg);
            return;
        }

        var (joinSuccess, isNewPlayer) = _gameServer.PlayerJoin(Context.ConnectionId, playerName);

        if (!joinSuccess)
        {
            await Clients.Caller.OnChatMessage("Server", "Failed to join. Name taken or server full.");
            return;
        }

        _joinAttempts.TryRemove(ipAddress, out _);
        _joinAttempts.TryRemove(ipAddress + "_time", out _);

        var player = _gameServer.GetPlayer(playerName);
        if (player == null) return;

        await Groups.AddToGroupAsync(Context.ConnectionId, "players");
        player.State = PlayerState.Playing;

        if (isNewPlayer)
        {
            foreach (var itemName in _config.Player.StartItems)
            {
                var count = DefaultStartItemCounts.TryGetValue(itemName, out var c) ? c : 1;
                player.Inventory.AddItem(new ItemStack(itemName, count));
            }
        }

        if (isNewPlayer && !string.IsNullOrEmpty(password))
        {
            _playerDb.SetPasswordHash(playerName, AuthenticationService.HashPassword(password));
        }

        await Clients.All.OnPlayerJoined(playerName);
        await Clients.Caller.OnPlayerListUpdate(_gameServer.OnlinePlayers.Select(p => p.Name).ToArray());
        await Clients.Caller.OnHealthUpdate(player.Health, player.MaxHealth);
        await SendInventoryUpdate(player);
        await SendArmorUpdate(player);
        await SendTimeUpdate();
        await Clients.Caller.OnFoodUpdate(player.FoodLevel, 20f);
        await SendBlockDefinitions();
        await SendInitialChunks(player);
    }

    public async Task UpdatePosition(float x, float y, float z, float vx, float vy, float vz, float yaw, float pitch)
    {
        if (!CheckRateLimit(Context.ConnectionId, "position", 50)) return;

        if (float.IsNaN(x) || float.IsInfinity(x) || float.IsNaN(y) || float.IsInfinity(y) ||
            float.IsNaN(z) || float.IsInfinity(z) || float.IsNaN(vx) || float.IsInfinity(vx) ||
            float.IsNaN(vy) || float.IsInfinity(vy) || float.IsNaN(vz) || float.IsInfinity(vz))
            return;

        const float maxBound = 100000f;
        if (Math.Abs(x) > maxBound || Math.Abs(y) > maxBound || Math.Abs(z) > maxBound) return;

        var player = GetAuthenticatedPlayer();
        if (player == null) return;

        var border = _gameServer.WorldBorderSize;
        if (Math.Abs(x) > border || Math.Abs(z) > border) return;

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

        var player = GetAuthenticatedPlayer();
        if (player == null) return;

        if (string.IsNullOrEmpty(message) || message.Length > 256) return;

        message = SanitizeChatMessage(message);

        if (!string.IsNullOrEmpty(message) && message[0] == '/')
        {
            var result = await _chatCommands.TryExecute(player.Name, message);
            if (result != null)
            {
                await Clients.Caller.OnChatMessage("Server", result);
            }
            return;
        }

        if (!_gameServer.Privileges.HasPrivilege(player.Name, "shout")) return;

        await Clients.All.OnChatMessage(player.Name, message);
    }

    public async Task PlaceBlock(int x, int y, int z, ushort blockType)
    {
        if (!IsValidBlockCoord(x, y, z)) return;
        if (!CheckRateLimit(Context.ConnectionId, "place", 250)) return;

        var player = GetAuthenticatedPlayer();
        if (player == null) return;

        if (!_gameServer.Privileges.HasPrivilege(player.Name, "interact")) return;

        if (!_areaProtection.CanInteract(player.Name, x, y, z)
            && !_gameServer.Privileges.HasPrivilege(player.Name, "protection_bypass")) return;

        if (!_gameServer.Protection.CanInteract(player.Name, new Vector3s((short)x, (short)y, (short)z))
            && !_gameServer.Privileges.HasPrivilege(player.Name, "protection_bypass")) return;

        var maxBlockId = (ushort)Enum.GetValues<BlockType>().Cast<ushort>().Max();
        if (blockType > maxBlockId) return;

        var blockCenter = new Vector3(x + 0.5f, y + 0.5f, z + 0.5f);
        var distance = Vector3.Distance(player.Position, blockCenter);
        if (distance > _gameServer.Config.Physics.PlaceRange) return;

        var playerHalfWidth = _gameServer.Config.Physics.PlayerDepth;
        var playerHeight = _gameServer.Config.Physics.PlayerHeight;
        foreach (var otherPlayer in _gameServer.OnlinePlayers)
        {
            if (otherPlayer.ConnectionId == Context.ConnectionId || otherPlayer.IsDead) continue;
            var otherCenter = otherPlayer.Position;
            if (Math.Abs(blockCenter.X - otherCenter.X) < playerHalfWidth &&
                Math.Abs(blockCenter.Y - otherCenter.Y) < playerHeight &&
                Math.Abs(blockCenter.Z - otherCenter.Z) < playerHalfWidth)
            {
                return;
            }
        }

        var cropType = blockType switch
        {
            64 => BlockType.WheatCrop,
            65 => BlockType.CarrotCrop,
            66 => BlockType.PotatoCrop,
            _ => (BlockType?)null
        };

        if (cropType != null)
        {
            if (_gameServer.Agriculture == null) return;
            if (!_gameServer.Agriculture.PlantCrop(x, y, z, cropType.Value))
            {
                return;
            }
            var plantedBlock = _gameServer.DefaultWorld.GetBlock(new Vector3s((short)x, (short)y, (short)z));
            await Clients.All.OnBlockUpdate(x, y, z, plantedBlock.ToPacked());
            return;
        }

        var blockDef = _blockDefinitionManager.Get(blockType);
        if (blockDef == null || blockDef.Id == (ushort)BlockType.Air)
        {
            return;
        }

        if (blockDef.Name == "torch")
        {
            var directions = new (int dx, int dy, int dz)[]
            {
                (1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1)
            };
            var hasSolidNeighbor = false;
            foreach (var (dx, dy, dz) in directions)
            {
                var neighborPos = new Vector3s((short)(x + dx), (short)(y + dy), (short)(z + dz));
                var neighborBlock = _gameServer.DefaultWorld.GetBlock(neighborPos);
                var neighborDef = _blockDefinitionManager.Get((ushort)neighborBlock.Type);
                if (neighborDef != null && neighborDef.Solid)
                {
                    hasSolidNeighbor = true;
                    break;
                }
            }
            if (!hasSolidNeighbor)
            {
                await Clients.Caller.OnChatMessage("Server", "Torch must be placed next to a solid block");
                return;
            }
        }

        var newBlock = new Block((BlockType)blockType);
        _gameServer.Rollback.RecordChange(x, y, z,
            _gameServer.DefaultWorld.GetBlock(new Vector3s((short)x, (short)y, (short)z)).ToPacked(),
            newBlock.ToPacked(), player.Name, "PLACE");
        _gameServer.DefaultWorld.SetBlock(new Vector3s((short)x, (short)y, (short)z), newBlock);
        await Clients.All.OnBlockUpdate(x, y, z, newBlock.ToPacked());
    }

    public async Task DigBlock(int x, int y, int z)
    {
        if (!IsValidBlockCoord(x, y, z)) return;
        if (!CheckRateLimit(Context.ConnectionId, "dig", 250)) return;

        var player = GetAuthenticatedPlayer();
        if (player == null) return;

        if (!_gameServer.Privileges.HasPrivilege(player.Name, "interact")) return;

        if (!_areaProtection.CanInteract(player.Name, x, y, z)
            && !_gameServer.Privileges.HasPrivilege(player.Name, "protection_bypass")) return;

        if (!_gameServer.Protection.CanInteract(player.Name, new Vector3s((short)x, (short)y, (short)z))
            && !_gameServer.Privileges.HasPrivilege(player.Name, "protection_bypass")) return;

        var blockCenter = new Vector3(x + 0.5f, y + 0.5f, z + 0.5f);
        var distance = Vector3.Distance(player.Position, blockCenter);
        if (distance > _gameServer.Config.Physics.DigRange) return;

        var blockPos = new Vector3s((short)x, (short)y, (short)z);
        var oldBlock = _gameServer.DefaultWorld.GetBlock(blockPos);
        var blockData = oldBlock.ToPacked();

        if (blockData == 0) return;

        var toolItem = player.GetSelectedHotbarItem();
        if (toolItem != null && toolItem.ItemId == "bucket")
        {
            if (oldBlock.Type == BlockType.Water)
            {
                _gameServer.DefaultWorld.SetBlock(blockPos, Block.Air);
                await Clients.All.OnBlockUpdate(x, y, z, 0);
                player.Inventory[player.SelectedHotbarSlot] = new ItemStack("water_bucket", 1);
                await SendInventoryUpdate(player);
                return;
            }
            else if (oldBlock.Type == BlockType.Lava)
            {
                _gameServer.DefaultWorld.SetBlock(blockPos, Block.Air);
                await Clients.All.OnBlockUpdate(x, y, z, 0);
                player.Inventory[player.SelectedHotbarSlot] = new ItemStack("lava_bucket", 1);
                await SendInventoryUpdate(player);
                return;
            }
        }

        var blockDef = _blockDefinitionManager.Get((ushort)oldBlock.Type);
        if (blockDef != null && !blockDef.Breakable)
        {
            return;
        }

        _gameServer.Rollback.RecordChange(x, y, z, oldBlock.ToPacked(), 0, player.Name, "DIG");
        _gameServer.DefaultWorld.SetBlock(blockPos, Block.Air);
        await Clients.All.OnBlockUpdate(x, y, z, 0);

        var dropName = blockDef?.Drops ?? blockDef?.Name ?? oldBlock.Type.ToString().ToLowerInvariant();
        var itemEntity = new ItemEntity(dropName, 1, new Vector3(x + 0.5f, y + 0.5f, z + 0.5f));
        _entityManager.Add(itemEntity);

        var heldItem = player.GetSelectedHotbarItem();
        if (heldItem != null)
        {
            var toolName = heldItem.ItemId.ToLowerInvariant();
            var isTool = toolName.Contains("sword") || toolName.Contains("pickaxe") ||
                toolName.Contains("axe") || toolName.Contains("shovel") || toolName.Contains("hoe") ||
                toolName.Contains("shears") || toolName.Contains("dagger");

            if (isTool)
            {
                var wornTool = ToolWearSystem.ApplyDigWear(heldItem);
                if (wornTool == null)
                {
                    player.Inventory.RemoveItem(player.SelectedHotbarSlot, 1);
                    await Clients.Caller.OnChatMessage("Server", $"Your {toolName} broke!");
                }
                else
                {
                    player.Inventory[player.SelectedHotbarSlot] = wornTool;
                }

                await SendInventoryUpdate(player);
            }
        }

        _gameServer.AwardExperience(player, 1);
    }

    public async Task<float> DigBlockStart(int x, int y, int z)
    {
        if (!IsValidBlockCoord(x, y, z)) return -1f;
        var player = GetAuthenticatedPlayer();
        if (player == null) return -1f;
        var blockPos = new Vector3s((short)x, (short)y, (short)z);
        var block = _gameServer.DefaultWorld.GetBlock(blockPos);
        var blockData = (ushort)block.Type;
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

    public async Task<bool> UseBucket(int x, int y, int z, bool place)
    {
        if (!IsValidBlockCoord(x, y, z)) return false;
        if (!CheckRateLimit(Context.ConnectionId, "bucket", 500)) return false;

        var player = GetAuthenticatedPlayer();
        if (player == null) return false;

        var hotbarItem = player.GetSelectedHotbarItem();
        if (hotbarItem == null) return false;

        var blockPos = new Vector3s((short)x, (short)y, (short)z);

        if (place)
        {
            if (hotbarItem.ItemId == "water_bucket")
            {
                var targetBlock = _gameServer.DefaultWorld.GetBlock(blockPos);
                if (targetBlock.Type == BlockType.Air || targetBlock.Type == BlockType.WaterFlowing)
                {
                    _gameServer.DefaultWorld.SetBlock(blockPos, new Block(BlockType.Water));
                    await Clients.All.OnBlockUpdate(x, y, z, (ushort)BlockType.Water);
                    player.Inventory[player.SelectedHotbarSlot] = new ItemStack("bucket", 1);
                    await SendInventoryUpdate(player);
                    return true;
                }
            }
            else if (hotbarItem.ItemId == "lava_bucket")
            {
                var targetBlock = _gameServer.DefaultWorld.GetBlock(blockPos);
                if (targetBlock.Type == BlockType.Air || targetBlock.Type == BlockType.LavaFlowing)
                {
                    _gameServer.DefaultWorld.SetBlock(blockPos, new Block(BlockType.Lava));
                    await Clients.All.OnBlockUpdate(x, y, z, (ushort)BlockType.Lava);
                    player.Inventory[player.SelectedHotbarSlot] = new ItemStack("bucket", 1);
                    await SendInventoryUpdate(player);
                    return true;
                }
            }
        }
        else
        {
            if (hotbarItem.ItemId == "bucket")
            {
                var targetBlock = _gameServer.DefaultWorld.GetBlock(blockPos);
                if (targetBlock.Type == BlockType.Water)
                {
                    _gameServer.DefaultWorld.SetBlock(blockPos, Block.Air);
                    await Clients.All.OnBlockUpdate(x, y, z, 0);
                    player.Inventory[player.SelectedHotbarSlot] = new ItemStack("water_bucket", 1);
                    await SendInventoryUpdate(player);
                    return true;
                }
                else if (targetBlock.Type == BlockType.Lava)
                {
                    _gameServer.DefaultWorld.SetBlock(blockPos, Block.Air);
                    await Clients.All.OnBlockUpdate(x, y, z, 0);
                    player.Inventory[player.SelectedHotbarSlot] = new ItemStack("lava_bucket", 1);
                    await SendInventoryUpdate(player);
                    return true;
                }
            }
            else if (hotbarItem.ItemId == "milk_bucket")
            {
                _gameServer.FeedPlayer(player, 8.0f);
                player.Inventory[player.SelectedHotbarSlot] = new ItemStack("bucket", 1);
                await SendInventoryUpdate(player);
                await Clients.Caller.OnHealthUpdate(player.Health, player.MaxHealth);
                return true;
            }
        }

        return false;
    }

    private static float GetToolMultiplier(string toolName, BlockDefinition blockDef)
    {
        var materialMultiplier = ToolConfig.GetMiningSpeed(toolName);

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
        var player = GetAuthenticatedPlayer();
        if (player == null) return;
        if (player.IsDead) return;
        if (slotIndex < 0 || slotIndex >= player.Inventory.Size) return;

        var item = player.Inventory[slotIndex];
        if (item == null) return;

        var itemId = item.ItemId.ToLowerInvariant();

        var foodInfo = _gameServer.GetFoodValue(itemId);
        if (foodInfo != null)
        {
            var removed = player.Inventory.RemoveItem(slotIndex, 1);
            if (removed != null)
            {
                _gameServer.FeedPlayer(player, foodInfo.Nutrition, foodInfo.Saturation);
                await SendInventoryUpdate(player);
            }
        }
        else if (itemId == "water_bucket")
        {
            var removed = player.Inventory.RemoveItem(slotIndex, 1);
            if (removed != null)
            {
                player.Inventory.AddItem(new ItemStack("bucket", 1));
                await SendInventoryUpdate(player);
            }
        }
        else if (itemId == "lava_bucket")
        {
            var removed = player.Inventory.RemoveItem(slotIndex, 1);
            if (removed != null)
            {
                player.Inventory.AddItem(new ItemStack("bucket", 1));
                await SendInventoryUpdate(player);
            }
        }
        else if (itemId == "milk_bucket")
        {
            var removed = player.Inventory.RemoveItem(slotIndex, 1);
            if (removed != null)
            {
                player.Inventory.AddItem(new ItemStack("bucket", 1));
                _gameServer.HealPlayer(player, 4.0f);
                await SendInventoryUpdate(player);
            }
        }
    }

    public async Task Respawn()
    {
        var player = GetAuthenticatedPlayer();
        if (player == null) return;
        if (!player.IsDead) return;

        player.Respawn();

        Vector3 spawnPos;
        if (player.HasSpawnPoint)
        {
            spawnPos = player.SpawnPoint;
        }
        else
        {
            var spawnY = _gameServer.DefaultWorld.GetGroundHeight(0, 0) + 2;
            spawnPos = new Vector3(0, spawnY, 0);
        }
        player.Position = spawnPos;
        player.LastGroundY = spawnPos.Y;
        player.FallDistance = 0;

        await Clients.Caller.OnHealthUpdate(player.Health, player.MaxHealth);
        await SendInitialChunks(player);
    }

    public async Task RequestChunk(int chunkX, int chunkY, int chunkZ)
    {
        if (!CheckRateLimit(Context.ConnectionId, "chunk", 100)) return;

        var player = GetAuthenticatedPlayer();
        if (player == null) return;

        var dx = Math.Abs(chunkX * 16 + 8 - player.Position.X);
        var dy = Math.Abs(chunkY * 16 + 8 - player.Position.Y);
        var dz = Math.Abs(chunkZ * 16 + 8 - player.Position.Z);
        if (dx > 256 || dy > 256 || dz > 256) return;

        var chunk = _gameServer.DefaultWorld.GetChunk(new ChunkCoord(chunkX, chunkY, chunkZ));
        var data = chunk.Serialize();
        await Clients.Caller.OnChunkReceived(chunkX, chunkY, chunkZ, data);
    }

    public async Task SelectSlot(int slot)
    {
        var player = GetAuthenticatedPlayer();
        if (player == null) return;
        if (slot < 0 || slot >= player.Inventory.HotbarSize) return;
        player.SelectedHotbarSlot = slot;
    }

    public async Task InteractBlock(int x, int y, int z)
    {
        if (!IsValidBlockCoord(x, y, z)) return;
        var player = GetAuthenticatedPlayer();
        if (player == null) return;

        var blockPos = new Vector3s((short)x, (short)y, (short)z);
        var block = _gameServer.DefaultWorld.GetBlock(blockPos);
        var blockData = (ushort)block.Type;
        if (blockData == 0) return;

        var blockDef = _blockDefinitionManager.Get(blockData);
        if (blockDef == null) return;

        var blockName = blockDef.Name;

        if (blockName == "sign")
        {
            var posKey = GameServer.PositionKey(x, y, z);
            var existingText = _gameServer.BlockMetadataDatabase.LoadSignText(posKey) ?? string.Empty;
            await Clients.Caller.OnSignEditorOpened(x, y, z, existingText);
        }
        else if (blockName == "bed")
        {
            player.SpawnPoint = new Vector3(x + 0.5f, y + 0.5f, z + 0.5f);
            await Clients.Caller.OnChatMessage("Server", "Spawn point set");
        }
        else if (blockName == "note_block" || blockName == "jukebox")
        {
            await Clients.Caller.OnBlockSound(blockName, x, y, z);
        }
    }

    public async Task SetSignText(int x, int y, int z, string text)
    {
        if (!IsValidBlockCoord(x, y, z)) return;
        if (!CheckRateLimit(Context.ConnectionId, "sign", 300)) return;

        var player = GetAuthenticatedPlayer();
        if (player == null) return;

        if (string.IsNullOrEmpty(text) || text.Length > 100) return;

        text = SanitizeSignText(text);

        var blockPos = new Vector3s((short)x, (short)y, (short)z);
        var block = _gameServer.DefaultWorld.GetBlock(blockPos);
        var blockDef = _blockDefinitionManager.Get((ushort)block.Type);
        if (blockDef == null || blockDef.Name != "sign") return;

        var blockCenter = new Vector3(x + 0.5f, y + 0.5f, z + 0.5f);
        var distance = Vector3.Distance(player.Position, blockCenter);
        if (distance > 6.0f) return;

        var posKey = GameServer.PositionKey(x, y, z);
        _gameServer.BlockMetadataDatabase.SaveSignText(posKey, text);
    }

    public async Task InteractWithBlock(int x, int y, int z)
    {
        if (!IsValidBlockCoord(x, y, z)) return;
        if (!CheckRateLimit(Context.ConnectionId, "interact", 300)) return;

        var player = GetAuthenticatedPlayer();
        if (player == null) return;
        var blockPos = new Vector3s((short)x, (short)y, (short)z);
        var block = _gameServer.DefaultWorld.GetBlock(blockPos);
        var blockDef = _blockDefinitionManager.Get((ushort)block.Type);
        if (blockDef == null) return;
        if (blockDef.Climbable)
        {
            await Clients.Caller.OnChatMessage("Server", "Climbing...");
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
            else if (blockName == "door_wood")
            {
                var doorBlock = _gameServer.DefaultWorld.GetBlock(blockPos);
                var isOpen = (doorBlock.Param2 & 1) == 1;
                var newBlock = new Block(doorBlock.Type, doorBlock.Param1, (byte)(isOpen ? 0 : 1), doorBlock.Light);
                _gameServer.DefaultWorld.SetBlock(blockPos, newBlock);
                await Clients.All.OnBlockUpdate(x, y, z, newBlock.ToPacked());
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
            else if (blockName == "sign")
            {
                var posKey = GameServer.PositionKey(x, y, z);
                var existingText = _gameServer.BlockMetadataDatabase.LoadSignText(posKey) ?? string.Empty;
                await Clients.Caller.OnSignEditorOpened(x, y, z, existingText);
            }
            else if (blockName == "bed")
            {
                player.SpawnPoint = new Vector3(x + 0.5f, y + 0.5f, z + 0.5f);
                player.HasSpawnPoint = true;
                await Clients.Caller.OnChatMessage("Server", "Spawn point set");
            }
            else if (blockName == "note_block" || blockName == "jukebox")
            {
                await Clients.Caller.OnBlockSound(blockName, x, y, z);
            }
            else if (blockName == "tnt")
            {
                var tntPos = new Vector3s((short)x, (short)y, (short)z);
                _gameServer.DefaultWorld.SetBlock(tntPos, Block.Air);
                await Clients.All.OnBlockUpdate(x, y, z, 0);

                const int explosionRadius = 3;
                for (int dx = -explosionRadius; dx <= explosionRadius; dx++)
                {
                    for (int dy = -explosionRadius; dy <= explosionRadius; dy++)
                    {
                        for (int dz = -explosionRadius; dz <= explosionRadius; dz++)
                        {
                            if (dx * dx + dy * dy + dz * dz > explosionRadius * explosionRadius) continue;
                            var targetPos = new Vector3s((short)(x + dx), (short)(y + dy), (short)(z + dz));
                            var targetBlock = _gameServer.DefaultWorld.GetBlock(targetPos);
                            if (targetBlock.Type == BlockType.Air) continue;
                            var targetDef = _blockDefinitionManager.Get((ushort)targetBlock.Type);
                            if (targetDef != null && !targetDef.Breakable) continue;
                            if (targetBlock.Type == BlockType.Bedrock) continue;

                            _gameServer.Rollback.RecordChange(x + dx, y + dy, z + dz,
                                targetBlock.ToPacked(), 0, player.Name, "TNT");
                            _gameServer.DefaultWorld.SetBlock(targetPos, Block.Air);
                            await Clients.All.OnBlockUpdate(x + dx, y + dy, z + dz, 0);

                            if (targetDef != null)
                            {
                                var dropName = targetDef.Drops ?? targetDef.Name;
                                var dropEntity = new ItemEntity(dropName, 1,
                                    new Vector3(x + dx + 0.5f, y + dy + 0.5f, z + dz + 0.5f));
                                _entityManager.Add(dropEntity);
                            }
                        }
                    }
                }

                var nearbyPlayers = _gameServer.GetPlayersInRange(new Vector3(x, y, z), explosionRadius * 2);
                foreach (var nearby in nearbyPlayers)
                {
                    var dist = Vector3.Distance(nearby.Position, new Vector3(x + 0.5f, y + 0.5f, z + 0.5f));
                    if (dist < explosionRadius * 2)
                    {
                        var explosionDamage = Math.Max(1, 20 * (1 - dist / (explosionRadius * 2)));
                        _gameServer.DamagePlayer(nearby, explosionDamage, "tnt");
                    }
                }

                await Clients.Caller.OnChatMessage("Server", "TNT exploded!");
            }
        }

        var playerItem = player.GetSelectedHotbarItem();
        if (playerItem != null)
        {
            var itemId = playerItem.ItemId.ToLowerInvariant();
            if (itemId == "bucket")
            {
                if (block.Type is BlockType.Water or BlockType.WaterFlowing)
                {
                    player.Inventory[player.SelectedHotbarSlot] = playerItem with { ItemId = "water_bucket" };
                    _gameServer.DefaultWorld.SetBlock(blockPos, Block.Air);
                    await Clients.All.OnBlockUpdate(x, y, z, 0);
                    await SendInventoryUpdate(player);
                }
                else if (block.Type is BlockType.Lava or BlockType.LavaFlowing)
                {
                    player.Inventory[player.SelectedHotbarSlot] = playerItem with { ItemId = "lava_bucket" };
                    _gameServer.DefaultWorld.SetBlock(blockPos, Block.Air);
                    await Clients.All.OnBlockUpdate(x, y, z, 0);
                    await SendInventoryUpdate(player);
                }
            }
        }
    }

    public async Task PunchPlayer(string targetName)
    {
        if (!CheckRateLimit(Context.ConnectionId, "punch", 500)) return;

        var attacker = GetAuthenticatedPlayer();
        if (attacker == null) return;
        var target = _gameServer.GetPlayer(targetName);
        if (target == null || target.IsDead) return;

        var distance = Vector3.Distance(attacker.Position, target.Position);
        if (distance > _gameServer.Config.Physics.PunchRange)
        {
            await Clients.Caller.OnChatMessage("Server", "Too far away");
            return;
        }

        var toolItem = attacker.GetSelectedHotbarItem();
        var damage = 1.0f;
        if (toolItem != null)
        {
            var toolName = toolItem.ItemId.ToLowerInvariant();
            damage = ToolConfig.GetWeaponDamage(toolName);
        }
        var knockback = _gameServer.DamagePlayerWithKnockback(target, damage, attacker.Position, "player");
        await Clients.Client(target.ConnectionId).OnKnockback(knockback.X, knockback.Y, knockback.Z);

        if (toolItem != null)
        {
            var toolName = toolItem.ItemId.ToLowerInvariant();
            var isTool = toolName.Contains("sword") || toolName.Contains("axe") ||
                toolName.Contains("dagger") || toolName.Contains("shears");
            if (isTool)
            {
                var wornTool = ToolWearSystem.ApplyAttackWear(toolItem);
                if (wornTool == null)
                {
                    attacker.Inventory.RemoveItem(attacker.SelectedHotbarSlot, 1);
                    await Clients.Caller.OnChatMessage("Server", $"Your {toolName} broke!");
                }
                else
                {
                    attacker.Inventory[attacker.SelectedHotbarSlot] = wornTool;
                }
                await SendInventoryUpdate(attacker);
            }
        }
    }

    public async Task PunchEntity(Guid entityId)
    {
        if (!CheckRateLimit(Context.ConnectionId, "punch", 500)) return;

        var player = GetAuthenticatedPlayer();
        if (player == null || player.IsDead) return;

        var entity = _entityManager.Get(entityId);
        if (entity == null || !entity.IsAlive) return;

        var distance = Vector3.Distance(player.Position, entity.Position);
        if (distance > _gameServer.Config.Physics.PunchRange) return;

        var toolItem = player.GetSelectedHotbarItem();
        var damage = 1.0f;
        if (toolItem != null)
        {
            var toolName = toolItem.ItemId.ToLowerInvariant();
            damage = ToolConfig.GetWeaponDamage(toolName);
        }

        if (entity is MobEntity mob)
        {
            mob.TakeDamage(damage);
        }
    }

    public async Task StartFishing(float x, float y, float z)
    {
        if (!CheckRateLimit(Context.ConnectionId, "fish", 1000)) return;

        var player = GetAuthenticatedPlayer();
        if (player == null || player.IsDead) return;

        var fishingSystem = _gameServer.FishingSystem;
        if (fishingSystem == null) return;

        var bobberPos = new Vector3(x, y, z);
        var started = fishingSystem.StartFishing(player.Name, player.Position, bobberPos, _gameServer.DefaultWorld);
        if (!started)
        {
            await Clients.Caller.OnChatMessage("Server", "Cannot fish here. Need water nearby and be within range.");
        }
    }

    public async Task ReelIn()
    {
        var player = GetAuthenticatedPlayer();
        if (player == null || player.IsDead) return;

        var fishingSystem = _gameServer.FishingSystem;
        if (fishingSystem == null) return;

        var caught = fishingSystem.ReelIn(player.Name);
        if (caught != null)
        {
            player.Inventory.AddItem(new ItemStack(caught.ItemId, caught.Count));
            await SendInventoryUpdate(player);
            _gameServer.AwardExperience(player, 2);
            await Clients.Caller.OnChatMessage("Server", $"Caught: {caught.ItemId} x{caught.Count}");
        }
    }

    public async Task CancelFishing()
    {
        var player = GetAuthenticatedPlayer();
        if (player == null) return;

        var fishingSystem = _gameServer.FishingSystem;
        fishingSystem?.CancelFishing(player.Name);
    }

    public async Task FeedMob(Guid entityId)
    {
        if (!CheckRateLimit(Context.ConnectionId, "feed", 500)) return;

        var player = GetAuthenticatedPlayer();
        if (player == null || player.IsDead) return;

        var entity = _entityManager.Get(entityId);
        if (entity is not MobEntity mob || !mob.IsAlive) return;

        var distance = Vector3.Distance(player.Position, mob.Position);
        if (distance > 6.0f) return;

        var heldItem = player.GetSelectedHotbarItem();
        if (heldItem == null) return;

        var breedingSystem = _gameServer.Breeding;
        if (breedingSystem == null) return;

        if (!breedingSystem.TryFeedMob(mob, heldItem.ItemId)) return;

        var consumed = player.Inventory.RemoveItem(player.SelectedHotbarSlot, 1);
        if (consumed == null) return;
        await SendInventoryUpdate(player);

        var nearbyMobs = _entityManager.GetByType<MobEntity>()
            .Where(m => m.IsAlive && !m.IsBaby && m.MobType == mob.MobType && m.Id != mob.Id)
            .Where(m => Vector3.Distance(m.Position, mob.Position) < 8.0f)
            .ToList();

        var partner = nearbyMobs.FirstOrDefault(m =>
        {
            var session = _gameServer.Breeding;
            return session != null;
        });

        if (partner != null)
        {
            var baby = breedingSystem.CheckBreeding(mob, partner);
            if (baby != null)
            {
                _entityManager.Add(baby);
                await Clients.Caller.OnChatMessage("Server", "Animals bred successfully!");
            }
        }
    }

    public async Task GetPrivileges()
    {
        var player = GetAuthenticatedPlayer();
        if (player == null) return;
        var privs = _gameServer.Privileges.GetPlayerPrivileges(player.Name);
        await Clients.Caller.OnPrivilegeList(privs);
    }

    public async Task ToggleFlight()
    {
        var player = GetAuthenticatedPlayer();
        if (player == null || player.IsDead) return;

        if (player.Mode != GameMode.Creative && !_gameServer.Privileges.HasPrivilege(player.Name, "fly"))
            return;

        player.IsFlying = !player.IsFlying;
        if (player.IsFlying)
        {
            player.Velocity = Vector3.Zero;
        }
    }

    public async Task Craft(string recipeId)
    {
        var player = GetAuthenticatedPlayer();
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
        foreach (var ingredient in recipe.Ingredients)
        {
            var remaining = ingredient.Count;
            for (int i = 0; i < player.Inventory.Size && remaining > 0; i++)
            {
                var slot = player.Inventory[i];
                if (slot != null && slot.ItemId.Equals(ingredient.ItemId, StringComparison.OrdinalIgnoreCase))
                {
                    var take = Math.Min(remaining, slot.Count);
                    player.Inventory.RemoveItem(i, take);
                    remaining -= take;
                }
            }
        }
        player.Inventory.AddItem(new ItemStack(recipe.ResultItemId, recipe.ResultCount));

        _gameServer.AwardExperience(player, 1);

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
        var player = GetAuthenticatedPlayer();
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
        foreach (var ingredient in recipe.Ingredients)
        {
            var remaining = ingredient.Count;
            for (int i = 0; i < player.Inventory.Size && remaining > 0; i++)
            {
                var slot = player.Inventory[i];
                if (slot != null && slot.ItemId.Equals(ingredient.ItemId, StringComparison.OrdinalIgnoreCase))
                {
                    var take = Math.Min(remaining, slot.Count);
                    player.Inventory.RemoveItem(i, take);
                    remaining -= take;
                }
            }
        }
        player.Inventory.AddItem(new ItemStack(recipe.ResultItemId, recipe.ResultCount));

        _gameServer.AwardExperience(player, 1);

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
        if (!IsValidBlockCoord(x, y, z)) return;
        var player = GetAuthenticatedPlayer();
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
        if (!IsValidBlockCoord(x, y, z)) return;
        var posKey = GameServer.PositionKey(x, y, z);
        var chestInv = _gameServer.GetOrCreateChestInventory(posKey);
        var items = chestInv
            .Select(i => i == null ? null : (object)new { itemId = i.ItemId, count = i.Count, metadata = i.Metadata })
            .ToArray();
        await Clients.Caller.OnChestInventory(items!);
    }

    public async Task MoveItemToChest(int slotIndex, int chestSlot, int x, int y, int z)
    {
        if (!IsValidBlockCoord(x, y, z)) return;
        var player = GetAuthenticatedPlayer();
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
        if (!IsValidBlockCoord(x, y, z)) return;
        var player = GetAuthenticatedPlayer();
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
        var player = GetAuthenticatedPlayer();
        if (player == null) return;
        await SendInventoryUpdate(player);
    }

    public async Task DropItem(int slotIndex, int count)
    {
        var player = GetAuthenticatedPlayer();
        if (player == null) return;
        if (slotIndex < 0 || slotIndex >= player.Inventory.Size) return;
        if (count <= 0 || count > 64) return;

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

    private async Task SendArmorUpdate(PlayerEnt player)
    {
        var items = player.ArmorSlots
            .Select(i => i == null ? null : (object)new { itemId = i.ItemId, count = i.Count, metadata = i.Metadata })
            .ToArray();
        await Clients.Caller.OnArmorUpdate(items!);
    }

    public async Task EquipArmor(int slotIndex, int armorSlot)
    {
        var player = GetAuthenticatedPlayer();
        if (player == null) return;
        if (slotIndex < 0 || slotIndex >= player.Inventory.Size) return;
        if (armorSlot < 0 || armorSlot >= player.ArmorSlots.Length) return;
        var item = player.Inventory[slotIndex];
        if (item == null) return;
        var itemId = item.ItemId.ToLowerInvariant();
        bool isArmor = itemId.Contains("helmet") || itemId.Contains("chestplate") ||
                       itemId.Contains("leggings") || itemId.Contains("boots");
        if (!isArmor) return;

        int targetSlot = itemId switch
        {
            var n when n.Contains("helmet") => 0,
            var n when n.Contains("chestplate") => 1,
            var n when n.Contains("leggings") => 2,
            var n when n.Contains("boots") => 3,
            _ => -1
        };
        if (targetSlot < 0) return;

        var currentArmor = player.ArmorSlots[targetSlot];
        player.ArmorSlots[targetSlot] = item;
        player.Inventory[slotIndex] = currentArmor;

        await SendInventoryUpdate(player);
        await SendArmorUpdate(player);
    }

    public async Task UnequipArmor(int armorSlot)
    {
        var player = GetAuthenticatedPlayer();
        if (player == null) return;
        if (armorSlot < 0 || armorSlot >= player.ArmorSlots.Length) return;
        var armor = player.ArmorSlots[armorSlot];
        if (armor == null) return;

        if (player.Inventory.AddItem(armor))
        {
            player.ArmorSlots[armorSlot] = null;
            await SendInventoryUpdate(player);
            await SendArmorUpdate(player);
        }
    }

    private PlayerEnt? GetAuthenticatedPlayer()
    {
        return _gameServer.GetPlayerByConnection(Context.ConnectionId);
    }

    private static string SanitizeChatMessage(string message)
    {
        var sb = new System.Text.StringBuilder(message.Length);
        foreach (char c in message)
        {
            if (c == '\r') continue;
            if (c == '\n') { sb.Append(' '); continue; }
            if (char.IsControl(c)) continue;
            sb.Append(c);
        }
        var result = sb.ToString();
        if (result.Length > 256) result = result[..256];
        return result;
    }

    private static string SanitizeSignText(string text)
    {
        var sb = new System.Text.StringBuilder(text.Length);
        foreach (char c in text)
        {
            if (char.IsControl(c) && c != ' ') continue;
            switch (c)
            {
                case '<': sb.Append(' '); break;
                case '>': sb.Append(' '); break;
                case '&': sb.Append(' '); break;
                case '"': sb.Append(' '); break;
                case '\'': sb.Append(' '); break;
                default: sb.Append(c); break;
            }
        }
        return sb.ToString();
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

        if (_lastActionTimes.Count > 5000)
        {
            var cutoff = now.AddMinutes(-5);
            foreach (var kvp in _lastActionTimes)
            {
                if (kvp.Value < cutoff)
                    _lastActionTimes.TryRemove(kvp.Key, out _);
            }
        }

        if (_joinAttempts.Count > 1000)
        {
            foreach (var kvp in _joinAttempts.ToList())
            {
                if (kvp.Key.EndsWith("_time"))
                {
                    var timestamp = DateTimeOffset.FromUnixTimeSeconds(kvp.Value).UtcDateTime;
                    if ((now - timestamp).TotalMinutes > 5)
                    {
                        var baseKey = kvp.Key[..^5];
                        _joinAttempts.TryRemove(baseKey, out _);
                        _joinAttempts.TryRemove(kvp.Key, out _);
                    }
                }
            }
        }

        return true;
    }

    private static bool IsValidBlockCoord(int x, int y, int z)
    {
        return x >= short.MinValue && x <= short.MaxValue &&
               y >= short.MinValue && y <= short.MaxValue &&
               z >= short.MinValue && z <= short.MaxValue;
    }
}
