namespace WebGameServer.Core.Entities;

public enum EntityType
{
    Item,
    Mob,
    Projectile,
    Vehicle,
    Particle
}

public class Entity
{
    public Guid Id { get; } = Guid.NewGuid();
    public EntityType Type { get; }
    public Vector3 Position { get; set; } = Vector3.Zero;
    public Vector3 Velocity { get; set; } = Vector3.Zero;
    public float Yaw { get; set; }
    public float Pitch { get; set; }
    public float Health { get; set; } = 20f;
    public float MaxHealth { get; set; } = 20f;
    public bool IsAlive => Health > 0;
    public DateTime LastUpdate { get; set; } = DateTime.UtcNow;

    public Entity(EntityType type)
    {
        Type = type;
    }

    public virtual void Update(float dt)
    {
        LastUpdate = DateTime.UtcNow;
    }
}

public class ItemEntity : Entity
{
    public string ItemId { get; set; } = "";
    public int Count { get; set; } = 1;
    public string? Metadata { get; set; }
    public DateTime SpawnTime { get; set; } = DateTime.UtcNow;
    public TimeSpan Lifespan { get; set; } = TimeSpan.FromMinutes(5);

    public ItemEntity(string itemId, int count, Vector3 position)
        : base(EntityType.Item)
    {
        ItemId = itemId;
        Count = count;
        Position = position;
        Velocity = new Vector3(
            (Random.Shared.NextSingle() - 0.5f) * 2,
            Random.Shared.NextSingle() * 2,
            (Random.Shared.NextSingle() - 0.5f) * 2);
    }

    public override void Update(float dt)
    {
        base.Update(dt);
        if (DateTime.UtcNow - SpawnTime > Lifespan)
        {
            Health = 0;
        }
    }
}

public class MobEntity : Entity
{
    public string MobType { get; set; } = "";
    public float Speed { get; set; } = 2.0f;
    public float AttackDamage { get; set; } = 1.0f;
    public float AttackRange { get; set; } = 2.0f;
    public float DetectionRange { get; set; } = 16.0f;
    public Guid? TargetPlayerId { get; set; }

    public MobEntity(string mobType, Vector3 position)
        : base(EntityType.Mob)
    {
        MobType = mobType;
        Position = position;
    }

    public override void Update(float dt)
    {
        base.Update(dt);
        if (!IsAlive) return;

        var moveDir = new Vector3(
            (Random.Shared.NextSingle() - 0.5f) * Speed,
            0,
            (Random.Shared.NextSingle() - 0.5f) * Speed);

        Velocity = moveDir;
        Position = Position + Velocity * dt;
    }
}
