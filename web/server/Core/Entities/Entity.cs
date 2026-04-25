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
    public const float MergeRadius = 1.0f;
    public const int MaxStackSize = 64;

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

    public bool CanMergeWith(ItemEntity other)
    {
        if (other == this) return false;
        if (ItemId != other.ItemId) return false;
        if (Metadata != other.Metadata) return false;
        if (Count + other.Count > MaxStackSize) return false;
        return (DateTime.UtcNow - SpawnTime).TotalSeconds > 0.5;
    }

    public void MergeWith(ItemEntity other)
    {
        Count += other.Count;
        other.Health = 0;
    }

    public static void ProcessMerges(IEnumerable<Entity> entities)
    {
        var items = entities
            .Where(e => e is ItemEntity { IsAlive: true })
            .Cast<ItemEntity>()
            .ToList();

        for (int i = 0; i < items.Count; i++)
        {
            if (!items[i].IsAlive) continue;
            for (int j = i + 1; j < items.Count; j++)
            {
                if (!items[j].IsAlive) continue;
                if (Vector3.Distance(items[i].Position, items[j].Position) > MergeRadius) continue;
                if (!items[i].CanMergeWith(items[j])) continue;
                items[i].MergeWith(items[j]);
            }
        }
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

public enum MobState
{
    Idle,
    Wander,
    Chase,
    Flee,
    Attack
}

public class MobEntity : Entity
{
    public static Func<Vector3, float, PlayerEnt?>? FindNearestPlayer { get; set; }
    public static Action<PlayerEnt, float>? DamagePlayer { get; set; }
    public static Action<MobEntity>? MobDeathDrops { get; set; }
    public static Func<Vector3, Vector3, List<Vector3>?>? FindPath { get; set; }

    public string MobType { get; set; } = "";
    public float Speed { get; set; } = 2.0f;
    public float AttackDamage { get; set; } = 1.0f;
    public float AttackRange { get; set; } = 1.5f;
    public float DetectionRange { get; set; } = 16.0f;
    public bool IsHostile { get; set; } = true;
    public bool IsBaby { get; set; }
    public float GrowTimer { get; set; }
    public Guid? TargetPlayerId { get; set; }
    public MobState State { get; set; } = MobState.Wander;
    public bool IsHurt { get; private set; }
    private const float MobGravity = 20.0f;
    private DateTime _lastAttackTime;
    private int AttackCooldownMs = 1000;
    private DateTime _lastHurtTime;
    private const int HurtFlashDurationMs = 300;
    private float _wanderAngle;
    private float _wanderTimer;
    private List<Vector3>? _currentPath;

    public MobEntity(string mobType, Vector3 position)
        : base(EntityType.Mob)
    {
        MobType = mobType;
        Position = position;

        var def = MobConfig.Get(mobType);
        if (def != null)
        {
            Health = def.Health;
            MaxHealth = def.Health;
            AttackDamage = def.AttackDamage;
            Speed = def.Speed;
            AttackRange = def.AttackRange;
            DetectionRange = def.DetectionRange;
            AttackCooldownMs = (int)(def.AttackCooldown * 1000);
            IsHostile = def.Hostile;
        }
    }

    public void TakeDamage(float amount)
    {
        Health -= amount;
        _lastHurtTime = DateTime.UtcNow;
        IsHurt = true;

        if (!IsHostile)
        {
            State = MobState.Flee;
        }
        else if (State is MobState.Idle or MobState.Wander)
        {
            State = MobState.Chase;
        }
    }

    public override void Update(float dt)
    {
        base.Update(dt);
        if (!IsAlive) return;

        if (IsBaby)
        {
            GrowTimer -= dt;
            if (GrowTimer <= 0)
            {
                IsBaby = false;
                Speed /= 0.5f;
            }
        }

        if (Health <= 0)
        {
            MobDeathDrops?.Invoke(this);
            return;
        }

        if (IsHurt && DateTime.UtcNow - _lastHurtTime > TimeSpan.FromMilliseconds(HurtFlashDurationMs))
        {
            IsHurt = false;
        }

        var target = FindNearestPlayer?.Invoke(Position, DetectionRange);

        switch (State)
        {
            case MobState.Idle:
                if (IsHostile && target != null)
                {
                    State = MobState.Chase;
                    break;
                }
                _wanderTimer -= dt;
                if (_wanderTimer <= 0)
                {
                    State = MobState.Wander;
                    _wanderAngle = Random.Shared.NextSingle() * MathF.PI * 2;
                    _wanderTimer = 2.0f + Random.Shared.NextSingle() * 3.0f;
                }
                Velocity = new Vector3(0, Velocity.Y, 0);
                break;

            case MobState.Wander:
                if (IsHostile && target != null)
                {
                    State = MobState.Chase;
                    break;
                }
                _wanderTimer -= dt;
                if (_wanderTimer <= 0)
                {
                    State = MobState.Idle;
                    _wanderTimer = 1.0f + Random.Shared.NextSingle() * 2.0f;
                }
                Velocity = new Vector3(
                    MathF.Cos(_wanderAngle) * Speed * 0.5f,
                    Velocity.Y,
                    MathF.Sin(_wanderAngle) * Speed * 0.5f);
                break;

            case MobState.Chase:
                if (target == null)
                {
                    State = MobState.Wander;
                    _wanderTimer = 2.0f + Random.Shared.NextSingle() * 3.0f;
                    _currentPath = null;
                    break;
                }

                TargetPlayerId = target.Id;
                var direction = target.Position - Position;
                var distance = direction.Length;
                direction = direction.Normalized;

                Yaw = MathF.Atan2(direction.X, direction.Z);

                if (distance > AttackRange)
                {
                    _currentPath = FindPath?.Invoke(Position, target.Position);

                    if (_currentPath != null && _currentPath.Count > 1)
                    {
                        var pathDir = _currentPath[1] - Position;
                        pathDir = pathDir.Normalized;
                        Velocity = new Vector3(
                            pathDir.X * Speed,
                            Velocity.Y,
                            pathDir.Z * Speed);
                    }
                    else
                    {
                        Velocity = new Vector3(
                            direction.X * Speed,
                            Velocity.Y,
                            direction.Z * Speed);
                    }
                }
                else
                {
                    State = MobState.Attack;
                    Velocity = new Vector3(0, Velocity.Y, 0);
                }
                break;

            case MobState.Attack:
                if (target == null)
                {
                    State = MobState.Wander;
                    _wanderTimer = 2.0f + Random.Shared.NextSingle() * 3.0f;
                    break;
                }

                var attackDist = Vector3.Distance(Position, target.Position);
                if (attackDist > AttackRange * 1.5f)
                {
                    State = MobState.Chase;
                    break;
                }

                Velocity = new Vector3(0, Velocity.Y, 0);
                Yaw = MathF.Atan2(target.Position.X - Position.X, target.Position.Z - Position.Z);

                if (DateTime.UtcNow - _lastAttackTime > TimeSpan.FromMilliseconds(AttackCooldownMs))
                {
                    DamagePlayer?.Invoke(target, AttackDamage);
                    _lastAttackTime = DateTime.UtcNow;
                }
                break;

            case MobState.Flee:
                if (target == null || (DateTime.UtcNow - _lastHurtTime).TotalSeconds > 5)
                {
                    State = MobState.Wander;
                    _wanderTimer = 2.0f;
                    break;
                }

                var fleeDir = Position - target.Position;
                var fleeLen = fleeDir.Length;
                if (fleeLen > 0)
                {
                    fleeDir = fleeDir.Normalized;
                    Yaw = MathF.Atan2(fleeDir.X, fleeDir.Z);
                    Velocity = new Vector3(
                        fleeDir.X * Speed * 1.2f,
                        Velocity.Y,
                        fleeDir.Z * Speed * 1.2f);
                }
                break;
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
