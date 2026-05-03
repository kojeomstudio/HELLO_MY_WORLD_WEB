namespace WebGameServer.Core.Particles;

public readonly record struct ParticleSpec(
    string Texture,
    float ExpireTime,
    float Size,
    float[] Color,
    bool Collision,
    float Gravity
);

public readonly record struct ParticleSpawnerSpec(
    int Amount,
    float Time,
    string Texture,
    Vector3 MinPos,
    Vector3 MaxPos,
    Vector3 MinVel,
    Vector3 MaxVel,
    Vector3 MinAccel,
    Vector3 MaxAccel,
    float MinExptime,
    float MaxExptime,
    float MinSize,
    float MaxSize,
    bool Collision,
    bool CollisionRemoval,
    Guid? AttachedTo = null
);

public class ParticleSpawnerManager
{
    private readonly Dictionary<Guid, (ParticleSpawnerSpec Spec, DateTime CreatedAt)> _spawners = new();
    private readonly Random _random = new();

    public void CreateSpawner(Guid id, ParticleSpawnerSpec spec)
    {
        _spawners[id] = (spec, DateTime.UtcNow);
    }

    public bool RemoveSpawner(Guid id) => _spawners.Remove(id);

    public IReadOnlyDictionary<Guid, ParticleSpawnerSpec> GetActiveSpawners()
    {
        var result = new Dictionary<Guid, ParticleSpawnerSpec>();
        foreach (var (id, (spec, _)) in _spawners)
        {
            result[id] = spec;
        }
        return result;
    }

    public void Update(float deltaTime)
    {
        var expired = new List<Guid>();
        foreach (var (id, (spec, createdAt)) in _spawners)
        {
            var elapsed = (DateTime.UtcNow - createdAt).TotalSeconds;
            if (spec.Time > 0 && elapsed >= spec.Time)
            {
                expired.Add(id);
            }
        }
        foreach (var id in expired)
        {
            _spawners.Remove(id);
        }
    }

    public int ActiveCount => _spawners.Count;

    public ParticleSpec? GenerateParticle(Guid spawnerId)
    {
        if (!_spawners.TryGetValue(spawnerId, out var entry)) return null;
        return CreateParticleFromSpec(entry.Spec);
    }

    public List<ParticleSpec> GenerateParticles(Guid spawnerId)
    {
        var particles = new List<ParticleSpec>();
        if (!_spawners.TryGetValue(spawnerId, out var entry)) return particles;

        for (var i = 0; i < entry.Spec.Amount; i++)
        {
            var particle = CreateParticleFromSpec(entry.Spec);
            particles.Add(particle);
        }

        return particles;
    }

    public Dictionary<Guid, List<ParticleSpec>> GenerateAllParticles()
    {
        var result = new Dictionary<Guid, List<ParticleSpec>>();
        foreach (var (id, (spec, createdAt)) in _spawners)
        {
            var elapsed = (DateTime.UtcNow - createdAt).TotalSeconds;
            if (spec.Time > 0 && elapsed >= spec.Time) continue;

            var particles = new List<ParticleSpec>(spec.Amount);
            for (var i = 0; i < spec.Amount; i++)
            {
                particles.Add(CreateParticleFromSpec(spec));
            }
            result[id] = particles;
        }
        return result;
    }

    private ParticleSpec CreateParticleFromSpec(ParticleSpawnerSpec spawner)
    {
        var expireTime = Lerp(spawner.MinExptime, spawner.MaxExptime);
        var size = Lerp(spawner.MinSize, spawner.MaxSize);

        var color = new float[]
        {
            (float)_random.NextDouble(),
            (float)_random.NextDouble(),
            (float)_random.NextDouble(),
            1.0f
        };

        return new ParticleSpec(
            Texture: spawner.Texture,
            ExpireTime: expireTime,
            Size: size,
            Color: color,
            Collision: spawner.Collision,
            Gravity: 9.81f
        );
    }

    private float Lerp(float min, float max)
    {
        return min + (max - min) * (float)_random.NextDouble();
    }
}
