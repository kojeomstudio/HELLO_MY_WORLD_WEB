using BlockType = WebGameServer.Core.World.BlockType;
using WorldMap = WebGameServer.Core.World.World;
using WebGameServer.Core.World;
using PlayerEnt = WebGameServer.Core.Player.Player;
using PlayerState = WebGameServer.Core.Player.PlayerState;

namespace WebGameServer.Core.Entities;

public class MobSpawner
{
    private readonly EntityManager _entityManager;
    private readonly int _maxMobs;
    private readonly float _spawnInterval;
    private readonly float _despawnDistance;
    private float _spawnTimer;
    private readonly Random _random = new();
    private Func<long>? _getGameTime;

    private static readonly (string Type, string Name, float MinY, float MaxY, float Weight, bool Hostile)[] MobTypes =
    {
        ("Mob", "Zombie", -20, 40, 3.0f, true),
        ("Mob", "Skeleton", -20, 40, 2.0f, true),
        ("Mob", "Spider", -10, 50, 2.0f, true),
        ("Mob", "Cow", 30, 60, 3.0f, false),
        ("Mob", "Pig", 30, 60, 3.0f, false),
        ("Mob", "Chicken", 30, 60, 2.0f, false),
    };

    private const int NightStart = 13000;
    private const int NightEnd = 23000;
    private const int DarkLightThreshold = 7;

    public MobSpawner(EntityManager entityManager, int maxMobs = 50, float spawnInterval = 10.0f, float despawnDistance = 128.0f)
    {
        _entityManager = entityManager;
        _maxMobs = maxMobs;
        _spawnInterval = spawnInterval;
        _despawnDistance = despawnDistance;
    }

    public void SetGameTimeProvider(Func<long> getGameTime)
    {
        _getGameTime = getGameTime;
    }

    public void Update(float dt, WorldMap world, Func<Vector3, bool> isSolid, Func<int, int, int> getGroundHeight)
    {
        _spawnTimer += dt;
        if (_spawnTimer >= _spawnInterval)
        {
            _spawnTimer = 0;
            TrySpawnMob(world, isSolid, getGroundHeight);
        }

        DespawnDistantMobs();
    }

    private bool IsNight()
    {
        var gameTime = _getGameTime?.Invoke() ?? 0;
        return gameTime >= NightStart && gameTime < NightEnd;
    }

    private bool IsSpawnPositionDark(WorldMap world, int x, int y, int z)
    {
        var pos = new Vector3s((short)x, (short)(y + 1), (short)z);
        var light = LightingEngine.CalculateLight(world, pos);
        return light < DarkLightThreshold;
    }

    private bool IsOnGrass(WorldMap world, int x, int y, int z)
    {
        var block = world.GetBlock(new Vector3s((short)x, (short)y, (short)z));
        return block.Type == BlockType.Grass;
    }

    private void TrySpawnMob(WorldMap world, Func<Vector3, bool> isSolid, Func<int, int, int> getGroundHeight)
    {
        if (_entityManager.Count >= _maxMobs) return;

        var eligibleMobs = MobTypes.Where(m =>
        {
            if (m.Hostile)
            {
                return IsNight();
            }
            return !IsNight();
        }).ToArray();

        if (eligibleMobs.Length == 0) return;

        var totalWeight = eligibleMobs.Sum(m => m.Weight);
        var roll = _random.NextSingle() * totalWeight;
        var chosen = eligibleMobs[0];
        var cumulative = 0f;
        foreach (var mob in eligibleMobs)
        {
            cumulative += mob.Weight;
            if (roll <= cumulative) { chosen = mob; break; }
        }

        var players = _entityManager.GetPlayersFunc?.Invoke() ?? Enumerable.Empty<PlayerEnt>();
        var playerList = players.Where(p => p.State == PlayerState.Playing && !p.IsDead).ToList();
        if (playerList.Count == 0) return;

        var spawnPlayer = playerList[_random.Next(playerList.Count)];

        var angle = _random.NextSingle() * MathF.PI * 2;
        var distance = 24 + _random.NextSingle() * 24;
        var spawnX = spawnPlayer.Position.X + MathF.Cos(angle) * distance;
        var spawnZ = spawnPlayer.Position.Z + MathF.Sin(angle) * distance;
        var blockX = (int)Math.Floor(spawnX);
        var blockZ = (int)Math.Floor(spawnZ);

        var groundY = getGroundHeight(blockX, blockZ);

        if (groundY < chosen.MinY || groundY > chosen.MaxY) return;

        var spawnPos = new Vector3(blockX + 0.5f, groundY + 1, blockZ + 0.5f);

        if (isSolid(spawnPos)) return;

        if (chosen.Hostile && !IsNight())
        {
            if (!IsSpawnPositionDark(world, blockX, groundY, blockZ))
                return;
        }

        if (!chosen.Hostile && !IsOnGrass(world, blockX, groundY, blockZ))
            return;

        var mobEntity = new MobEntity(chosen.Name, spawnPos);
        _entityManager.Add(mobEntity);
    }

    private void DespawnDistantMobs()
    {
        var players = _entityManager.GetPlayersFunc?.Invoke() ?? Enumerable.Empty<PlayerEnt>();
        var activePlayers = players.Where(p => !p.IsDead).ToList();
        if (activePlayers.Count == 0) return;

        var mobs = _entityManager.GetByType<MobEntity>().ToList();
        foreach (var mob in mobs)
        {
            var nearestDist = activePlayers.Min(p => Vector3.Distance(mob.Position, p.Position));
            if (nearestDist > _despawnDistance)
            {
                mob.Health = 0;
            }
        }
    }

    public int MobCount => _entityManager.Count;
}
