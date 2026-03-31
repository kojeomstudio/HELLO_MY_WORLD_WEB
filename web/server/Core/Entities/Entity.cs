using BlockType = WebGameServer.Core.World.BlockType;
using WorldMap = WebGameServer.Core.World.World;
using PlayerEnt = WebGameServer.Core.Player.Player;

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
    public static WorldMap? WorldReference { get; set; }

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

        var newPos = Position + Velocity * dt;

        var groundBlock = WorldReference?.GetBlock(new Vector3s(
            (short)Math.Floor(newPos.X),
            (short)Math.Floor(newPos.Y - 0.1),
            (short)Math.Floor(newPos.Z)));
        if (groundBlock != null
            && groundBlock.Type != BlockType.Air
            && groundBlock.Type != BlockType.Water
            && groundBlock.Type != BlockType.Lava)
        {
            newPos = new Vector3(newPos.X, (float)Math.Floor(newPos.Y - 0.1) + 0.15f, newPos.Z);
            Velocity = new Vector3(Velocity.X * 0.5f, -Velocity.Y * 0.3f, Velocity.Z * 0.5f);
            if (Math.Abs(Velocity.Y) < 0.5f)
            {
                Velocity = new Vector3(0, 0, 0);
            }
        }

        Position = newPos;
    }
}

public class MobEntity : Entity
{
    public static Func<Vector3, float, PlayerEnt?>? FindNearestPlayer { get; set; }
    public static Action<PlayerEnt, float>? DamagePlayer { get; set; }
    public static Action<MobEntity>? MobDeathDrops { get; set; }

    public string MobType { get; set; } = "";
    public float Speed { get; set; } = 2.0f;
    public float AttackDamage { get; set; } = 1.0f;
    public float AttackRange { get; set; } = 2.0f;
    public float DetectionRange { get; set; } = 16.0f;
    public Guid? TargetPlayerId { get; set; }
    private const float MobGravity = 20.0f;
    private DateTime _lastAttackTime;
    private const int AttackCooldownMs = 1000;

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

        if (Health <= 0)
        {
            MobDeathDrops?.Invoke(this);
            return;
        }

        var target = FindNearestPlayer?.Invoke(Position, DetectionRange);

        if (target != null)
        {
            var direction = target.Position - Position;
            var distance = direction.Length;
            direction = direction.Normalized;

            if (distance > AttackRange)
            {
                Velocity = new Vector3(
                    direction.X * Speed,
                    Velocity.Y,
                    direction.Z * Speed);
            }
            else
            {
                Velocity = new Vector3(0, Velocity.Y, 0);

                if (DateTime.UtcNow - _lastAttackTime > TimeSpan.FromMilliseconds(AttackCooldownMs))
                {
                    DamagePlayer?.Invoke(target, AttackDamage);
                    _lastAttackTime = DateTime.UtcNow;
                }
            }
        }
        else
        {
            var moveDir = new Vector3(
                (Random.Shared.NextSingle() - 0.5f) * Speed,
                Velocity.Y,
                (Random.Shared.NextSingle() - 0.5f) * Speed);
            Velocity = moveDir;
        }

        Velocity = new Vector3(Velocity.X, Velocity.Y - MobGravity * dt, Velocity.Z);

        var newPos = Position + Velocity * dt;

        var groundBlock = WorldReference?.GetBlock(new Vector3s(
            (short)Math.Floor(newPos.X),
            (short)Math.Floor(newPos.Y - 0.1),
            (short)Math.Floor(newPos.Z)));

        if (groundBlock != null
            && groundBlock.Type != BlockType.Air
            && groundBlock.Type != BlockType.Water
            && groundBlock.Type != BlockType.Lava)
        {
            var groundY = (float)Math.Floor(newPos.Y - 0.1) + 1.0f;
            newPos = new Vector3(newPos.X, groundY, newPos.Z);
            Velocity = new Vector3(Velocity.X, 0, Velocity.Z);
        }

        Position = newPos;

        if (Position.Y < 1)
        {
            Position = new Vector3(Position.X, 1, Position.Z);
            Velocity = new Vector3(Velocity.X, 0, Velocity.Z);
        }
    }
}
