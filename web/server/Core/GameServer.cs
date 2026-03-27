using System.Collections.Concurrent;
using WorldMap = WebGameServer.Core.World.World;
using PlayerEnt = WebGameServer.Core.Player.Player;
using PlayerState = WebGameServer.Core.Player.PlayerState;
using WebGameServer.Core.World;

namespace WebGameServer.Core;

public class GameServer
{
    private readonly ConcurrentDictionary<string, WorldMap> _worlds = new();
    private readonly ConcurrentDictionary<string, PlayerEnt> _players = new();
    private readonly ConcurrentDictionary<string, string> _connectionToPlayer = new();
    private readonly System.Timers.Timer _gameLoopTimer;

    public WorldMap DefaultWorld { get; }
    public int MaxPlayers { get; set; } = 100;
    public int TickRate { get; set; } = 20;
    public bool IsRunning { get; private set; }
    public DateTime StartTime { get; private set; }
    public long GameTime { get; private set; }
    public float TimeSpeed { get; set; } = 1.0f;
    public DayNightCycle DayNight { get; } = new();

    public int OnlinePlayerCount => _players.Count;
    public IEnumerable<PlayerEnt> OnlinePlayers => _players.Values;

    public GameServer(int seed = 0)
    {
        DefaultWorld = new WorldMap("default", seed == 0 ? Random.Shared.Next() : seed, new World.Generators.NoiseWorldGenerator());
        _worlds.TryAdd("default", DefaultWorld);

        _gameLoopTimer = new System.Timers.Timer(1000.0 / TickRate)
        {
            AutoReset = true,
            Enabled = false
        };
        _gameLoopTimer.Elapsed += OnGameTick;
    }

    public void Start()
    {
        if (IsRunning) return;
        IsRunning = true;
        StartTime = DateTime.UtcNow;
        _gameLoopTimer.Start();
    }

    public void Stop()
    {
        IsRunning = false;
        _gameLoopTimer.Stop();
    }

    private void OnGameTick(object? sender, System.Timers.ElapsedEventArgs e)
    {
        Update();
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

        _players.TryAdd(playerName, player);
        _connectionToPlayer.TryAdd(connectionId, playerName);

        return true;
    }

    public void PlayerLeave(string connectionId)
    {
        if (_connectionToPlayer.TryRemove(connectionId, out var playerName))
        {
            _players.TryRemove(playerName, out _);
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
    }

    private void UpdatePlayer(PlayerEnt player)
    {
        if (player.Health <= 0)
        {
            player.Respawn();
            var spawnY = DefaultWorld.GetGroundHeight(0, 0) + 2;
            player.Position = new Vector3(0, spawnY, 0);
        }
    }
}
