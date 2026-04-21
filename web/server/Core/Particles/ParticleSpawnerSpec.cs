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
    private readonly Dictionary<Guid, ParticleSpawnerSpec> _spawners = new();
    private readonly Random _random = new();

    public void CreateSpawner(Guid id, ParticleSpawnerSpec spec)
    {
        _spawners[id] = spec;
    }

    public bool RemoveSpawner(Guid id) => _spawners.Remove(id);

    public IReadOnlyDictionary<Guid, ParticleSpawnerSpec> GetActiveSpawners() => _spawners;

    public ParticleSpec? GenerateParticle(Guid spawnerId)
    {
        if (!_spawners.TryGetValue(spawnerId, out var spec)) return null;
        return CreateParticleFromSpec(spec);
    }

    public List<ParticleSpec> GenerateParticles(Guid spawnerId)
    {
        var particles = new List<ParticleSpec>();
        if (!_spawners.TryGetValue(spawnerId, out var spec)) return particles;

        for (var i = 0; i < spec.Amount; i++)
        {
            var particle = CreateParticleFromSpec(spec);
            particles.Add(particle);
        }

        return particles;
    }

    public Dictionary<Guid, List<ParticleSpec>> GenerateAllParticles()
    {
        var result = new Dictionary<Guid, List<ParticleSpec>>();
        foreach (var (id, spec) in _spawners)
        {
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
