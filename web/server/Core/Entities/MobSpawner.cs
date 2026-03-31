using BlockType = WebGameServer.Core.World.BlockType;
using WorldMap = WebGameServer.Core.World.World;

namespace WebGameServer.Core.Entities;

public class MobSpawner
{
    private readonly EntityManager _entityManager;
    private readonly int _maxMobs;
    private readonly float _spawnInterval;
    private readonly float _despawnDistance;
    private float _spawnTimer;
    private readonly Random _random = new();

    private static readonly (string Type, string Name, float MinY, float MaxY, float Weight)[] MobTypes =
    {
        ("Mob", "Zombie", -20, 40, 3.0f),
        ("Mob", "Skeleton", -20, 40, 2.0f),
        ("Mob", "Spider", -10, 50, 2.0f),
        ("Mob", "Cow", 30, 60, 3.0f),
        ("Mob", "Pig", 30, 60, 3.0f),
        ("Mob", "Chicken", 30, 60, 2.0f),
    };

    public MobSpawner(EntityManager entityManager, int maxMobs = 50, float spawnInterval = 10.0f, float despawnDistance = 128.0f)
    {
        _entityManager = entityManager;
        _maxMobs = maxMobs;
        _spawnInterval = spawnInterval;
        _despawnDistance = despawnDistance;
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

    private void TrySpawnMob(WorldMap world, Func<Vector3, bool> isSolid, Func<int, int, int> getGroundHeight)
    {
        if (_entityManager.Count >= _maxMobs) return;

        var totalWeight = MobTypes.Sum(m => m.Weight);
        var roll = _random.NextSingle() * totalWeight;
        var chosen = MobTypes[0];
        var cumulative = 0f;
        foreach (var mob in MobTypes)
        {
            cumulative += mob.Weight;
            if (roll <= cumulative) { chosen = mob; break; }
        }

        var nearestPlayer = MobEntity.FindNearestPlayer?.Invoke(Vector3.Zero, 9999);
        if (nearestPlayer == null) return;

        var angle = _random.NextSingle() * MathF.PI * 2;
        var distance = 24 + _random.NextSingle() * 24;
        var spawnX = nearestPlayer.Position.X + MathF.Cos(angle) * distance;
        var spawnZ = nearestPlayer.Position.Z + MathF.Sin(angle) * distance;
        var blockX = (int)Math.Floor(spawnX);
        var blockZ = (int)Math.Floor(spawnZ);

        var groundY = getGroundHeight(blockX, blockZ);

        if (groundY < chosen.MinY || groundY > chosen.MaxY) return;

        var spawnPos = new Vector3(blockX + 0.5f, groundY + 1, blockZ + 0.5f);

        if (isSolid(spawnPos)) return;

        var mobEntity = new MobEntity(chosen.Name, spawnPos);
        _entityManager.Add(mobEntity);
    }

    private void DespawnDistantMobs()
    {
        var nearestPlayer = MobEntity.FindNearestPlayer?.Invoke(Vector3.Zero, 9999);
        if (nearestPlayer == null) return;

        var mobs = _entityManager.GetByType<MobEntity>().ToList();
        foreach (var mob in mobs)
        {
            var dist = Vector3.Distance(mob.Position, nearestPlayer.Position);
            if (dist > _despawnDistance)
            {
                mob.Health = 0;
            }
        }
    }

    public int MobCount => _entityManager.Count;
}
