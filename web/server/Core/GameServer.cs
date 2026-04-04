using System.Collections.Concurrent;
using Microsoft.AspNetCore.SignalR;
using WebGameServer.Core.Auth;
using WebGameServer.Core.Entities;
using WebGameServer.Core.Game;
using WebGameServer.Core.Physics;
using WebGameServer.Core.Player;
using WebGameServer.Core.Smelting;
using WebGameServer.Core.World;
using WebGameServer.Core.World.Generators;
using WebGameServer.Services;
using WorldMap = WebGameServer.Core.World.World;
using PlayerEnt = WebGameServer.Core.Player.Player;
using PlayerState = WebGameServer.Core.Player.PlayerState;

namespace WebGameServer.Core;

public class GameServer
{
    private readonly ConcurrentDictionary<string, WorldMap> _worlds = new();
    private readonly ConcurrentDictionary<string, PlayerEnt> _players = new();
    private readonly ConcurrentDictionary<string, string> _connectionToPlayer = new();
    private readonly ConcurrentDictionary<string, string> _connectionToPlayerId = new();
    private readonly ConcurrentDictionary<string, ItemStack?[]> _chestInventories = new();
    private readonly ConcurrentDictionary<string, FurnaceOperation> _activeFurnaces = new();

    private readonly ServerConfig _config;
    private readonly BlockDefinitionManager _blockDefinitionManager;
    private readonly WorldGeneratorFactory _generatorFactory;
    private readonly SmeltingSystem _smeltingSystem;
    private readonly PrivilegeSystem _privilegeSystem;
    private readonly ActiveBlockModifierSystem _abmSystem;
    private readonly KnockbackSystem _knockbackSystem;
    private readonly PhysicsEngine _physicsEngine;
    private readonly EntityManager _entityManager;
    private readonly PlayerDatabase _playerDatabase;
    private readonly BlockMetadataDatabase _blockMetadataDatabase;
    private readonly MobSpawner _mobSpawner;
    private NodeTimerSystem _nodeTimerSystem;
    public AgricultureSystem? Agriculture { get; set; }

    private IHubContext<GameHub, IGameClient>? _hubContext;
    private int _tickCount;

    public WorldMap DefaultWorld { get; }
    public BlockDefinitionManager BlockDefinitions => _blockDefinitionManager;
    public SmeltingSystem Smelting => _smeltingSystem;
    public PrivilegeSystem Privileges => _privilegeSystem;
    public int MaxPlayers { get; private set; }
    public int TickRate { get; private set; }
    public bool IsRunning { get; private set; }
    public DateTime StartTime { get; private set; }
    public long GameTime { get; private set; }
    public float TimeSpeed { get; set; } = 1.0f;
    public DayNightCycle DayNight { get; }
    public ServerConfig Config => _config;

    public int OnlinePlayerCount => _players.Count;
    public IEnumerable<PlayerEnt> OnlinePlayers => _players.Values;

    public GameServer(
        ServerConfig config,
        BlockDefinitionManager blockDefinitionManager,
        WorldGeneratorFactory generatorFactory,
        SmeltingSystem smeltingSystem,
        PrivilegeSystem privilegeSystem,
        ActiveBlockModifierSystem abmSystem,
        KnockbackSystem knockbackSystem,
        PhysicsEngine physicsEngine,
        EntityManager entityManager,
        PlayerDatabase playerDatabase,
        BlockMetadataDatabase blockMetadataDatabase)
    {
        _config = config;
        _blockDefinitionManager = blockDefinitionManager;
        _generatorFactory = generatorFactory;
        _smeltingSystem = smeltingSystem;
        _privilegeSystem = privilegeSystem;
        _abmSystem = abmSystem;
        _knockbackSystem = knockbackSystem;
        _physicsEngine = physicsEngine;
        _entityManager = entityManager;
        _playerDatabase = playerDatabase;
        _blockMetadataDatabase = blockMetadataDatabase;
        _mobSpawner = new MobSpawner(entityManager);

        MaxPlayers = config.Server.MaxPlayers;
        TickRate = config.Server.TickRate;
        TimeSpeed = 1.0f;

        DayNight = new DayNightCycle();

        var generator = generatorFactory.Create(config.World.DefaultGenerator);
        var seed = config.World.WorldSeed == 0 ? Random.Shared.Next() : config.World.WorldSeed;
        DefaultWorld = new WorldMap("default", seed, generator);
        _worlds.TryAdd("default", DefaultWorld);

        _nodeTimerSystem = new NodeTimerSystem(DefaultWorld, OnNodeTimerExpired);
        DefaultWorld.WaterFlowInterval = config.Liquid.WaterFlowInterval;
        DefaultWorld.LavaFlowInterval = config.Liquid.LavaFlowInterval;
    }

    public void SetHubContext(IHubContext<GameHub, IGameClient> hubContext)
    {
        _hubContext = hubContext;
    }

    public void Start()
    {
        if (IsRunning) return;

        MobEntity.FindNearestPlayer = (pos, range) =>
        {
            var nearest = _players.Values
                .Where(p => p.State == PlayerState.Playing && !p.IsDead)
                .OrderBy(p => Vector3.Distance(p.Position, pos))
                .FirstOrDefault(p => Vector3.Distance(p.Position, pos) <= range);
            return nearest;
        };
        MobEntity.DamagePlayer = (player, damage) => { DamagePlayer(player, damage, "mob"); };

        IsRunning = true;
        StartTime = DateTime.UtcNow;

        InitializeNodeTimers();
    }

    public void Stop()
    {
        IsRunning = false;
    }

    public PlayerEnt? GetPlayer(string name)
    {
        return _players.TryGetValue(name, out var player) ? player : null;
    }

    public PlayerEnt? GetPlayerByConnection(string connectionId)
    {
        if (!_connectionToPlayer.TryGetValue(connectionId, out var playerName)) return null;
        return GetPlayer(playerName);
    }

    public string? GetConnectionId(string playerName)
    {
        foreach (var kvp in _connectionToPlayer)
        {
            if (kvp.Value == playerName)
                return kvp.Key;
        }
        return null;
    }

    public string? GetPlayerConnectionId(string playerName)
    {
        return GetConnectionId(playerName);
    }

    public BlockDefinition? GetBlockDefinition(ushort blockType)
    {
        return _blockDefinitionManager.Get(blockType);
    }

    public bool PlayerJoin(string connectionId, string playerName)
    {
        if (_players.ContainsKey(playerName)) return false;
        if (_connectionToPlayer.ContainsKey(connectionId)) return false;
        if (_players.Count >= MaxPlayers) return false;

        var player = new PlayerEnt(playerName)
        {
            ConnectionId = connectionId,
            State = PlayerState.Connected
        };

        if (_playerDatabase.PlayerExists(playerName))
        {
            _playerDatabase.LoadPlayer(player);
            player.ConnectionId = connectionId;
            player.State = PlayerState.Connected;
            player.IsDead = false;
        }
        else
        {
            var spawnY = DefaultWorld.GetGroundHeight(0, 0) + 2;
            player.Position = new Vector3(0, spawnY, 0);
            player.LastGroundY = spawnY;
        }

        _players.TryAdd(playerName, player);
        _connectionToPlayer.TryAdd(connectionId, playerName);
        _connectionToPlayerId.TryAdd(playerName, connectionId);

        _privilegeSystem.GrantDefaultPrivileges(playerName);

        return true;
    }

    public void PlayerLeave(string connectionId)
    {
        if (_connectionToPlayer.TryRemove(connectionId, out var playerName))
        {
            if (_players.TryGetValue(playerName, out var player))
            {
                _playerDatabase.SavePlayer(player);
            }
            _players.TryRemove(playerName, out _);
            _connectionToPlayerId.TryRemove(playerName, out _);
            _privilegeSystem.RemovePlayer(playerName);
        }
    }

    public void UpdatePlayerPosition(string connectionId, Vector3 position, Vector3 velocity, float yaw, float pitch)
    {
        var player = GetPlayerByConnection(connectionId);
        if (player == null) return;
        player.UpdatePosition(position, velocity, yaw, pitch);
    }

    public WorldMap? GetWorld(string name)
    {
        return _worlds.TryGetValue(name, out var world) ? world : null;
    }

    public List<PlayerEnt> GetPlayersInRange(Vector3 position, float range)
    {
        return _players.Values
            .Where(p => p.State == PlayerState.Playing)
            .Where(p => Vector3.Distance(p.Position, position) <= range)
            .ToList();
    }

    public bool PickupItem(Guid playerId, Guid entityId)
    {
        var player = _players.Values.FirstOrDefault(p => p.Id == playerId);
        if (player == null || player.IsDead) return false;

        var entity = _entityManager.Get(entityId);
        if (entity == null || entity is not ItemEntity itemEntity || !itemEntity.IsAlive) return false;

        var distance = Vector3.Distance(itemEntity.Position, player.Position);
        if (distance > 2.0f) return false;

        var stack = new ItemStack(itemEntity.ItemId, itemEntity.Count, itemEntity.Metadata);
        if (!player.Inventory.AddItem(stack)) return false;

        _entityManager.Remove(entityId);
        return true;
    }

    public void Update()
    {
        if (!IsRunning) return;

        GameTime = (GameTime + (long)(TimeSpeed * 100)) % 24000;
        DayNight.Update(GameTime);

        foreach (var player in _players.Values)
        {
            if (player.State != PlayerState.Playing) continue;
            UpdatePlayer(player);
            ValidatePlayerPosition(player, 1f / TickRate);
        }

        _entityManager.UpdateAll(1f / TickRate);

        _nodeTimerSystem.Update(1.0 / TickRate);

        _mobSpawner.Update(
            1f / TickRate,
            DefaultWorld,
            pos =>
            {
                var block = DefaultWorld.GetBlock(new Vector3s(
                    (short)Math.Floor(pos.X),
                    (short)Math.Floor(pos.Y),
                    (short)Math.Floor(pos.Z)));
                return block.Type != BlockType.Air
                    && block.Type != BlockType.Water
                    && block.Type != BlockType.WaterFlowing
                    && block.Type != BlockType.Lava
                    && block.Type != BlockType.LavaFlowing;
            },
            (x, z) => DefaultWorld.GetGroundHeight(x, z));

        _tickCount++;

        DefaultWorld.UpdateLiquids(_tickCount);

        _abmSystem.Process(DefaultWorld, _tickCount, _blockDefinitionManager);

        Agriculture?.GrowAllCrops(1f / TickRate);

        UpdateFurnaces(1f / TickRate);

        if (_tickCount % 600 == 0)
        {
            var playersDict = new Dictionary<string, PlayerEnt>(_players);
            DefaultWorld.UnloadDistantChunks(playersDict, _config.World.RenderDistance);
        }

        if (_tickCount % _config.Network.TimeBroadcastInterval == 0 && _hubContext != null)
        {
            _ = _hubContext.Clients.All.OnTimeUpdate(GameTime, TimeSpeed, DayNight.SkyBrightness);
        }
    }

    private void UpdatePlayer(PlayerEnt player)
    {
        if (player.IsDead)
        {
            return;
        }

        var playerBlockPos = new Vector3s(
            (short)Math.Floor(player.Position.X),
            (short)Math.Floor(player.Position.Y),
            (short)Math.Floor(player.Position.Z));
        var standingBlock = DefaultWorld.GetBlock(playerBlockPos);
        var standingDef = _blockDefinitionManager.Get(standingBlock.ToUInt16());

        if (standingBlock.Type is BlockType.Lava or BlockType.LavaFlowing)
        {
            var lavaDamage = standingDef?.Damage ?? 4;
            DamagePlayer(player, lavaDamage, "lava");
        }
        else if (standingBlock.Type is BlockType.Water or BlockType.WaterFlowing)
        {
            player.Velocity = new Vector3(player.Velocity.X, player.Velocity.Y * 0.8f, player.Velocity.Z);
        }

        if (!player.IsOnGround)
        {
            var fallDist = player.LastGroundY - player.Position.Y;
            if (fallDist > _config.Player.FallDamageThreshold)
            {
                var damage = (fallDist - _config.Player.FallDamageThreshold) * _config.Player.FallDamageMultiplier;
                DamagePlayer(player, damage, "fall");
                player.LastGroundY = player.Position.Y;
                player.FallDistance = 0;
            }
        }
        else
        {
            if (player.FallDistance > _config.Player.FallDamageThreshold)
            {
                var damage = (player.FallDistance - _config.Player.FallDamageThreshold) * _config.Player.FallDamageMultiplier;
                DamagePlayer(player, damage, "fall");
            }
            player.LastGroundY = player.Position.Y;
            player.FallDistance = 0;
        }

        if (player.FoodLevel > 18 && player.Health < player.MaxHealth && player.Health > 0)
        {
            HealPlayer(player, 0.2f);
            player.FoodSaturation = Math.Max(0, player.FoodSaturation - 0.5f);
        }
        else if (player.FoodLevel <= 0)
        {
            DamagePlayer(player, 0.5f, "starvation");
        }

        var headBlockPos = new Vector3s(
            (short)Math.Floor(player.Position.X),
            (short)Math.Floor(player.Position.Y + 0.6f),
            (short)Math.Floor(player.Position.Z));
        var headBlock = DefaultWorld.GetBlock(headBlockPos);
        var headDef = _blockDefinitionManager.Get(headBlock.ToUInt16());

        if (headDef != null && headDef.Drowning)
        {
            player.Breath -= 0.05f;
            if (player.Breath <= 0)
            {
                player.Breath = 0;
                DamagePlayer(player, 1f, "drowning");
            }
        }
        else
        {
            player.Breath = Math.Min(player.MaxBreath, player.Breath + 0.2f);
        }
    }

    public void DamagePlayer(PlayerEnt player, float amount, string source)
    {
        if (player.IsDead || player.Mode == GameMode.Creative) return;

        player.TakeDamage(amount);

        if (_hubContext != null)
        {
            _ = _hubContext.Clients.Client(player.ConnectionId)
                .OnHealthUpdate(player.Health, player.MaxHealth);
        }

        if (player.IsDead)
        {
            var deathMessage = $"{player.Name} died from {source}";
            if (_hubContext != null)
            {
                _ = _hubContext.Clients.All.OnDeath(deathMessage);
            }
            DropPlayerInventory(player);
        }
    }

    public Vector3 DamagePlayerWithKnockback(PlayerEnt target, float amount, Vector3 attackerPosition, string source)
    {
        DamagePlayer(target, amount, source);
        var distance = Vector3.Distance(attackerPosition, target.Position);
        return _knockbackSystem.CalculateKnockback(attackerPosition, target.Position, amount, distance);
    }

    public void HealPlayer(PlayerEnt player, float amount)
    {
        if (player.IsDead) return;
        player.Heal(amount);

        if (_hubContext != null)
        {
            _ = _hubContext.Clients.Client(player.ConnectionId)
                .OnHealthUpdate(player.Health, player.MaxHealth);
        }
    }

    public void FeedPlayer(PlayerEnt player, float amount)
    {
        if (player.IsDead) return;
        player.ConsumeFood(amount);
    }

    public bool SetGameMode(string playerName, GameMode mode)
    {
        var player = GetPlayer(playerName);
        if (player == null) return false;
        player.Mode = mode;
        return true;
    }

    public bool TeleportPlayer(string playerName, Vector3 position)
    {
        var player = GetPlayer(playerName);
        if (player == null) return false;
        player.Position = position;
        player.Velocity = Vector3.Zero;
        player.FallDistance = 0;
        player.LastGroundY = position.Y;
        return true;
    }

    private void ValidatePlayerPosition(PlayerEnt player, float dt)
    {
        var maxSpeed = player.IsFlying
            ? _physicsEngine.FlySpeed
            : player.IsSprinting
                ? _physicsEngine.SprintSpeed
                : _physicsEngine.WalkSpeed;

        var maxDistance = maxSpeed * dt * 1.5f;
        var distance = Vector3.Distance(player.Position, player.PreviousPosition);

        if (distance > maxDistance && distance > 0 && player.PreviousPosition.Length > 0)
        {
            var direction = (player.Position - player.PreviousPosition).Normalized;
            var correctedPos = player.PreviousPosition + direction * maxDistance;
            player.Position = correctedPos;
        }

        var feetBlockY = (short)Math.Floor(player.Position.Y - _physicsEngine.PlayerHeight);
        var groundBlock = DefaultWorld.GetBlock(
            new Vector3s((short)player.Position.X, feetBlockY, (short)player.Position.Z));
        player.IsOnGround = groundBlock.Type != BlockType.Air &&
                            groundBlock.Type != BlockType.Water &&
                            groundBlock.Type != BlockType.WaterFlowing &&
                            groundBlock.Type != BlockType.Lava &&
                            groundBlock.Type != BlockType.LavaFlowing &&
                            groundBlock.Type != BlockType.Ladder;

        var liquidCheckY = (short)Math.Floor(player.Position.Y - _physicsEngine.PlayerHeight * 0.5);
        var liquidBlock = DefaultWorld.GetBlock(
            new Vector3s((short)player.Position.X, liquidCheckY, (short)player.Position.Z));
        player.IsInLiquid = liquidBlock.Type is BlockType.Water or BlockType.WaterFlowing or BlockType.Lava or BlockType.LavaFlowing;
    }

    public bool GiveItem(string playerName, string itemId, int count)
    {
        var player = GetPlayer(playerName);
        if (player == null) return false;
        player.Inventory.AddItem(new ItemStack(itemId, count));
        return true;
    }

    public ItemStack?[] GetOrCreateChestInventory(string posKey)
    {
        if (_chestInventories.TryGetValue(posKey, out var existing))
            return existing;

        var loaded = _blockMetadataDatabase.LoadChestInventory(posKey);
        _chestInventories[posKey] = loaded;
        return loaded;
    }

    public ItemStack?[]? GetChestInventory(string posKey)
    {
        return _chestInventories.TryGetValue(posKey, out var inv) ? inv : null;
    }

    public FurnaceOperation? GetFurnaceOperation(string posKey)
    {
        return _activeFurnaces.TryGetValue(posKey, out var op) ? op : null;
    }

    public bool MoveItemToChest(PlayerEnt player, string posKey, int slotIndex, int chestSlot)
    {
        var item = player.Inventory[slotIndex];
        if (item == null) return false;

        var chestInv = GetOrCreateChestInventory(posKey);
        var targetSlot = chestSlot >= 0 ? chestSlot : -1;

        if (targetSlot < 0)
        {
            for (int i = 0; i < 27; i++)
            {
                if (chestInv[i] == null)
                {
                    targetSlot = i;
                    break;
                }
                if (chestInv[i]!.ItemId == item.ItemId && chestInv[i]!.Count + item.Count <= 64)
                {
                    targetSlot = i;
                    break;
                }
            }
        }

        if (targetSlot < 0 || targetSlot >= 27) return false;

        if (chestInv[targetSlot] != null && chestInv[targetSlot]!.ItemId == item.ItemId)
        {
            var combined = Math.Min(64, chestInv[targetSlot]!.Count + item.Count);
            var leftover = chestInv[targetSlot]!.Count + item.Count - combined;
            chestInv[targetSlot] = chestInv[targetSlot]! with { Count = combined };
            if (leftover > 0)
            {
                player.Inventory[slotIndex] = item with { Count = leftover };
            }
            else
            {
                player.Inventory[slotIndex] = null;
            }
        }
        else if (chestInv[targetSlot] == null)
        {
            chestInv[targetSlot] = item;
            player.Inventory[slotIndex] = null;
        }
        else
        {
            return false;
        }

        return true;
    }

    public bool TakeItemFromChest(PlayerEnt player, string posKey, int chestSlot, int slotIndex)
    {
        if (!_chestInventories.TryGetValue(posKey, out var chestInv)) return false;
        if (chestSlot < 0 || chestSlot >= 27) return false;

        var item = chestInv[chestSlot];
        if (item == null) return false;

        var targetSlot = slotIndex >= 0 ? slotIndex : -1;

        if (targetSlot < 0)
        {
            for (int i = 0; i < player.Inventory.Size; i++)
            {
                if (player.Inventory[i] == null)
                {
                    targetSlot = i;
                    break;
                }
                if (player.Inventory[i]!.ItemId == item.ItemId && player.Inventory[i]!.Count + item.Count <= 64)
                {
                    targetSlot = i;
                    break;
                }
            }
        }

        if (targetSlot < 0) return false;

        if (player.Inventory[targetSlot] != null && player.Inventory[targetSlot]!.ItemId == item.ItemId)
        {
            var combined = Math.Min(64, player.Inventory[targetSlot]!.Count + item.Count);
            var leftover = player.Inventory[targetSlot]!.Count + item.Count - combined;
            player.Inventory[targetSlot] = player.Inventory[targetSlot]! with { Count = combined };
            if (leftover > 0)
            {
                chestInv[chestSlot] = item with { Count = leftover };
            }
            else
            {
                chestInv[chestSlot] = null;
            }
        }
        else if (player.Inventory[targetSlot] == null)
        {
            player.Inventory[targetSlot] = item;
            chestInv[chestSlot] = null;
        }
        else
        {
            return false;
        }

        return true;
    }

    public bool StartSmelting(PlayerEnt player, string posKey, string inputItemId, string resultItemId)
    {
        if (_activeFurnaces.ContainsKey(posKey)) return false;

        var recipe = _smeltingSystem.GetRecipe(inputItemId);
        if (recipe == null) return false;

        var availableItems = player.Inventory.GetAll()
            .Where(i => i != null)
            .Select(i => (i!.ItemId, i.Count))
            .ToList();

        var hasInput = availableItems
            .Where(i => i.ItemId.Equals(inputItemId, StringComparison.OrdinalIgnoreCase))
            .Sum(i => i.Count) >= 1;

        var hasFuel = availableItems
            .Where(i => i.ItemId is "coal" or "charcoal")
            .Sum(i => i.Count) >= 1;

        if (!hasInput || !hasFuel) return false;

        bool removedInput = false;
        bool removedFuel = false;

        for (int i = 0; i < player.Inventory.Size && !removedInput; i++)
        {
            if (player.Inventory[i] != null &&
                player.Inventory[i]!.ItemId.Equals(inputItemId, StringComparison.OrdinalIgnoreCase))
            {
                var removed = player.Inventory.RemoveItem(i, 1);
                removedInput = removed != null;
            }
        }

        for (int i = 0; i < player.Inventory.Size && !removedFuel; i++)
        {
            if (player.Inventory[i] != null &&
                (player.Inventory[i]!.ItemId == "coal" || player.Inventory[i]!.ItemId == "charcoal"))
            {
                var removed = player.Inventory.RemoveItem(i, 1);
                removedFuel = removed != null;
            }
        }

        if (!removedInput || !removedFuel) return false;

        var operation = new FurnaceOperation(
            inputItemId,
            resultItemId,
            recipe.CookTime,
            0f,
            player.ConnectionId);

        _activeFurnaces[posKey] = operation;
        return true;
    }

    public void UpdateFurnaces(float dt)
    {
        if (_hubContext == null) return;

        var completed = new List<string>();

        foreach (var kvp in _activeFurnaces)
        {
            var posKey = kvp.Key;
            var op = kvp.Value;
            var updated = op with { Progress = op.Progress + dt / op.CookTime };

            if (updated.Progress >= 1.0f)
            {
                completed.Add(posKey);
                var player = GetPlayerByConnection(op.ConnectionId);
                if (player != null)
                {
                    player.Inventory.AddItem(new ItemStack(updated.ResultItemId, 1));
                    _ = _hubContext.Clients.Client(op.ConnectionId)
                        .OnInventoryUpdate(player.Inventory.GetAll()
                            .Select(i => i == null ? null : (object)new { itemId = i.ItemId, count = i.Count, metadata = i.Metadata })
                            .ToArray()!);
                }
                _ = _hubContext.Clients.Client(op.ConnectionId)
                    .OnFurnaceUpdate(string.Empty, string.Empty, updated.ResultItemId, 1.0f);
            }
            else
            {
                _activeFurnaces[posKey] = updated;
                if (_tickCount % 10 == 0)
                {
                    _ = _hubContext.Clients.Client(op.ConnectionId)
                        .OnFurnaceUpdate(updated.InputItemId, "coal", string.Empty, updated.Progress);
                }
            }
        }

        foreach (var key in completed)
        {
            _activeFurnaces.TryRemove(key, out _);
        }
    }

    public static string PositionKey(int x, int y, int z) => $"{x},{y},{z}";

    public void SaveAllMetadata()
    {
        foreach (var kvp in _chestInventories)
        {
            _blockMetadataDatabase.SaveChestInventory(kvp.Key, kvp.Value);
        }
        foreach (var kvp in _activeFurnaces)
        {
            _blockMetadataDatabase.SaveFurnaceOperation(kvp.Key, kvp.Value);
        }
        var timers = _nodeTimerSystem.GetAllTimers();
        _blockMetadataDatabase.SaveAllNodeTimers(timers);
    }

    public void DropPlayerInventory(PlayerEnt player)
    {
        for (int i = 0; i < player.Inventory.Size; i++)
        {
            var item = player.Inventory[i];
            if (item == null) continue;
            var entity = new ItemEntity(item.ItemId, item.Count, player.Position);
            _entityManager.Add(entity);
            player.Inventory[i] = null;
        }
        for (int i = 0; i < player.ArmorSlots.Length; i++)
        {
            var item = player.ArmorSlots[i];
            if (item == null) continue;
            var entity = new ItemEntity(item.ItemId, item.Count, player.Position);
            _entityManager.Add(entity);
            player.ArmorSlots[i] = null;
        }
    }

    private void OnNodeTimerExpired(int x, int y, int z, string blockName)
    {
        var pos = new Vector3s((short)x, (short)y, (short)z);
        var block = DefaultWorld.GetBlock(pos);

        switch (blockName)
        {
            case "Farmland":
                if (block.Type == BlockType.Farmland && !HasWaterNearby(x, y, z))
                {
                    DefaultWorld.SetBlock(pos, new Block(BlockType.Dirt));
                }
                else if (block.Type == BlockType.Farmland)
                {
                    _nodeTimerSystem.SetTimer(x, y, z, 30.0);
                }
                break;

            case "Dirt":
                if (block.Type == BlockType.Dirt && HasAdjacentBlock(x, y, z, BlockType.Grass) && Random.Shared.NextDouble() < 0.1)
                {
                    DefaultWorld.SetBlock(pos, new Block(BlockType.Grass));
                }
                else if (block.Type == BlockType.Dirt && HasAdjacentBlock(x, y, z, BlockType.Grass))
                {
                    _nodeTimerSystem.SetTimer(x, y, z, 10.0 + Random.Shared.NextDouble() * 20.0);
                }
                break;

            case "Ice":
                if (block.Type == BlockType.Ice && HasLightSourceNearby(x, y, z))
                {
                    DefaultWorld.SetBlock(pos, new Block(BlockType.Water, 0, 8));
                }
                break;
        }
    }

    private bool HasWaterNearby(int x, int y, int z)
    {
        for (int dx = -4; dx <= 4; dx++)
        {
            for (int dz = -4; dz <= 4; dz++)
            {
                for (int dy = -1; dy <= 1; dy++)
                {
                    var checkPos = new Vector3s((short)(x + dx), (short)(y + dy), (short)(z + dz));
                    var checkBlock = DefaultWorld.GetBlock(checkPos);
                    if (checkBlock.Type is BlockType.Water or BlockType.WaterFlowing)
                    {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private bool HasAdjacentBlock(int x, int y, int z, BlockType type)
    {
        var directions = new (int dx, int dy, int dz)[]
        {
            (1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1)
        };

        foreach (var (dx, dy, dz) in directions)
        {
            var neighbor = DefaultWorld.GetBlock(new Vector3s((short)(x + dx), (short)(y + dy), (short)(z + dz)));
            if (neighbor.Type == type) return true;
        }

        return false;
    }

    private bool HasLightSourceNearby(int x, int y, int z)
    {
        var directions = new (int dx, int dy, int dz)[]
        {
            (1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1)
        };

        foreach (var (dx, dy, dz) in directions)
        {
            var neighbor = DefaultWorld.GetBlock(new Vector3s((short)(x + dx), (short)(y + dy), (short)(z + dz)));
            var emission = LightingEngine.GetEmissionLevel(neighbor.Type);
            if (emission > 12) return true;
        }

        return false;
    }

    private void InitializeNodeTimers()
    {
        var loadedChunks = DefaultWorld.GetLoadedChunks();

        foreach (var chunkCoord in loadedChunks)
        {
            var chunk = DefaultWorld.GetChunkIfExists(chunkCoord);
            if (chunk == null) continue;

            for (int x = 0; x < Chunk.Size; x++)
            {
                for (int y = 0; y < Chunk.Size; y++)
                {
                    for (int z = 0; z < Chunk.Size; z++)
                    {
                        var block = chunk.GetBlock(x, y, z);
                        var worldX = chunkCoord.X * Chunk.Size + x;
                        var worldY = chunkCoord.Y * Chunk.Size + y;
                        var worldZ = chunkCoord.Z * Chunk.Size + z;

                        if (block.Type == BlockType.Farmland && !HasWaterNearby(worldX, worldY, worldZ))
                        {
                            _nodeTimerSystem.SetTimer(worldX, worldY, worldZ, 30.0);
                        }
                        else if (block.Type == BlockType.Dirt && HasAdjacentBlock(worldX, worldY, worldZ, BlockType.Grass))
                        {
                            _nodeTimerSystem.SetTimer(worldX, worldY, worldZ, 10.0 + Random.Shared.NextDouble() * 20.0);
                        }
                        else if (block.Type == BlockType.Ice && HasLightSourceNearby(worldX, worldY, worldZ))
                        {
                            _nodeTimerSystem.SetTimer(worldX, worldY, worldZ, 5.0 + Random.Shared.NextDouble() * 5.0);
                        }
                    }
                }
            }
        }
    }
}

public record FurnaceOperation(
    string InputItemId,
    string ResultItemId,
    float CookTime,
    float Progress,
    string ConnectionId);
