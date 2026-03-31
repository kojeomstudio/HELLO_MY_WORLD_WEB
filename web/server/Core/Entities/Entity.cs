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
    public bool IsInLiquid { get; set; }

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
            return;
        }

        var gravity = 6.0f;
        Velocity = new Vector3(Velocity.X, Velocity.Y - gravity * dt, Velocity.Z);

        var dragFactor = 0.98f;
        Velocity = new Vector3(Velocity.X * dragFactor, Velocity.Y * dragFactor, Velocity.Z * dragFactor);

        Position = Position + Velocity * dt;
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
    private const float MobGravity = 20.0f;

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
            Velocity.Y,
            (Random.Shared.NextSingle() - 0.5f) * Speed);

        moveDir = new Vector3(moveDir.X, moveDir.Y - MobGravity * dt, moveDir.Z);

        Velocity = moveDir;

        Position = Position + Velocity * dt;

        if (Position.Y < 1)
        {
            Position = new Vector3(Position.X, 1, Position.Z);
            Velocity = new Vector3(Velocity.X, 0, Velocity.Z);
        }
    }
}
