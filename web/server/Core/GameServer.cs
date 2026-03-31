using System.Collections.Concurrent;
using Microsoft.AspNetCore.SignalR;
using WebGameServer.Core.Entities;
using WebGameServer.Core.Game;
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

    private readonly ServerConfig _config;
    private readonly BlockDefinitionManager _blockDefinitionManager;
    private readonly WorldGeneratorFactory _generatorFactory;
    private readonly SmeltingSystem _smeltingSystem;

    private IHubContext<GameHub, IGameClient>? _hubContext;
    private int _tickCount;

    public WorldMap DefaultWorld { get; }
    public BlockDefinitionManager BlockDefinitions => _blockDefinitionManager;
    public SmeltingSystem Smelting => _smeltingSystem;
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
        SmeltingSystem smeltingSystem)
    {
        _config = config;
        _blockDefinitionManager = blockDefinitionManager;
        _generatorFactory = generatorFactory;
        _smeltingSystem = smeltingSystem;

        MaxPlayers = config.Server.MaxPlayers;
        TickRate = config.Server.TickRate;
        TimeSpeed = 1.0f;

        DayNight = new DayNightCycle();

        var generator = generatorFactory.Create(config.World.DefaultGenerator);
        var seed = config.World.WorldSeed == 0 ? Random.Shared.Next() : config.World.WorldSeed;
        DefaultWorld = new WorldMap("default", seed, generator);
        _worlds.TryAdd("default", DefaultWorld);
    }

    public void SetHubContext(IHubContext<GameHub, IGameClient> hubContext)
    {
        _hubContext = hubContext;
    }

    public void Start()
    {
        if (IsRunning) return;
        IsRunning = true;
        StartTime = DateTime.UtcNow;
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

        var spawnY = DefaultWorld.GetGroundHeight(0, 0) + 2;
        player.Position = new Vector3(0, spawnY, 0);
        player.LastGroundY = spawnY;

        _players.TryAdd(playerName, player);
        _connectionToPlayer.TryAdd(connectionId, playerName);
        _connectionToPlayerId.TryAdd(playerName, connectionId);

        return true;
    }

    public void PlayerLeave(string connectionId)
    {
        if (_connectionToPlayer.TryRemove(connectionId, out var playerName))
        {
            _players.TryRemove(playerName, out _);
            _connectionToPlayerId.TryRemove(playerName, out _);
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

    public void Update()
    {
        if (!IsRunning) return;

        GameTime = (GameTime + (long)(TimeSpeed * 100)) % 24000;
        DayNight.Update(GameTime);

        foreach (var player in _players.Values)
        {
            if (player.State != PlayerState.Playing) continue;
            UpdatePlayer(player);
        }

        _tickCount++;

        DefaultWorld.UpdateLiquids(_tickCount);

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

        if (standingBlock.Type == BlockType.Lava)
        {
            var lavaDamage = standingDef?.Damage ?? 4;
            DamagePlayer(player, lavaDamage, "lava");
        }
        else if (standingBlock.Type == BlockType.Water)
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
        }
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
}
