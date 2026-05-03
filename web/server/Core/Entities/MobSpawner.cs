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

    private record struct MobSpawnEntry(
        string Type,
        string Name,
        float MinY,
        float MaxY,
        float Weight,
        bool Hostile,
        BiomeType[] PreferredBiomes,
        float UniversalWeight,
        float DarkWeightMultiplier
    );

    private record struct EligibleMob(string Name, float MinY, float MaxY, float EffectiveWeight);

    private static readonly MobSpawnEntry[] MobSpawnDefinitions =
    {
        new("Mob", "Zombie", -20, 40, 3.0f, true, Array.Empty<BiomeType>(), 1.5f, 2.0f),
        new("Mob", "Skeleton", -20, 40, 2.0f, true, Array.Empty<BiomeType>(), 1.0f, 2.5f),
        new("Mob", "Spider", -10, 50, 2.0f, true, Array.Empty<BiomeType>(), 1.5f, 2.0f),
        new("Mob", "Cow", 30, 60, 3.0f, false, new[] { BiomeType.Grassland, BiomeType.Forest, BiomeType.Savanna }, 0f, 1f),
        new("Mob", "Pig", 30, 60, 3.0f, false, new[] { BiomeType.Grassland, BiomeType.Forest, BiomeType.Taiga }, 0f, 1f),
        new("Mob", "Chicken", 30, 60, 2.0f, false, new[] { BiomeType.Grassland, BiomeType.Forest, BiomeType.Jungle }, 0f, 1f)
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

    private void TrySpawnMob(WorldMap world, Func<Vector3, bool> isSolid, Func<int, int, int> getGroundHeight)
    {
        if (_entityManager.Count >= _maxMobs) return;

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
        var biome = BiomeDetector.Detect(world, blockX, groundY, blockZ);
        var isDark = IsSpawnPositionDark(world, blockX, groundY, blockZ);
        var isNight = IsNight();

        var eligibleMobs = FilterEligibleMobs(biome, isDark, isNight);
        if (eligibleMobs.Length == 0) return;

        var totalWeight = eligibleMobs.Sum(m => m.EffectiveWeight);
        var roll = _random.NextSingle() * totalWeight;
        var chosen = eligibleMobs[0];
        var cumulative = 0f;
        foreach (var mob in eligibleMobs)
        {
            cumulative += mob.EffectiveWeight;
            if (roll <= cumulative)
            {
                chosen = mob;
                break;
            }
        }

        if (groundY < chosen.MinY || groundY > chosen.MaxY) return;

        var spawnPos = new Vector3(blockX + 0.5f, groundY + 1, blockZ + 0.5f);

        if (isSolid(spawnPos)) return;

        var mobEntity = new MobEntity(chosen.Name, spawnPos);
        _entityManager.Add(mobEntity);
    }

    private EligibleMob[] FilterEligibleMobs(BiomeType biome, bool isDark, bool isNight)
    {
        var result = new List<EligibleMob>();

        foreach (var mob in MobSpawnDefinitions)
        {
            if (!mob.Hostile && isNight) continue;
            if (mob.Hostile && !isNight && !isDark) continue;

            var isInPreferredBiome = mob.PreferredBiomes.Contains(biome);
            var weight = isInPreferredBiome ? mob.Weight : mob.UniversalWeight;
            if (weight <= 0) continue;

            if (mob.Hostile && isDark)
            {
                weight *= mob.DarkWeightMultiplier;
            }

            result.Add(new EligibleMob(mob.Name, mob.MinY, mob.MaxY, weight));
        }

        return result.ToArray();
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
