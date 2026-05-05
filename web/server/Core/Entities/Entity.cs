using BlockType = WebGameServer.Core.World.BlockType;
using WorldMap = WebGameServer.Core.World.World;
using PlayerEnt = WebGameServer.Core.Player.Player;
using BlockDefMgr = WebGameServer.Core.Game.BlockDefinitionManager;

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
    public static BlockDefMgr? BlockDefinitions { get; set; }

    public static Action<Entity>? OnEntitySpawn { get; set; }
    public static Action<Entity>? OnEntityDespawn { get; set; }
    public static Action<Entity>? OnEntityStep { get; set; }

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

    public Guid? AttachedTo { get; set; }
    public Vector3 AttachmentOffset { get; set; } = Vector3.Zero;
    public Vector3 AttachmentRotation { get; set; } = Vector3.Zero;
    public List<Guid> AttachedChildren { get; } = new();

    public bool IsAttached => AttachedTo.HasValue;

    public Entity(EntityType type)
    {
        Type = type;
        OnEntitySpawn?.Invoke(this);
    }

    public void AttachTo(Guid parentId, Vector3 offset, Vector3 rotation)
    {
        AttachedTo = parentId;
        AttachmentOffset = offset;
        AttachmentRotation = rotation;
    }

    public void Detach()
    {
        AttachedTo = null;
        AttachmentOffset = Vector3.Zero;
        AttachmentRotation = Vector3.Zero;
    }

    public void AddChild(Guid childId)
    {
        if (!AttachedChildren.Contains(childId))
        {
            AttachedChildren.Add(childId);
        }
    }

    public void RemoveChild(Guid childId)
    {
        AttachedChildren.Remove(childId);
    }

    public virtual void Update(float dt)
    {
        LastUpdate = DateTime.UtcNow;
        OnEntityStep?.Invoke(this);
    }
}

public class ItemEntity : Entity
{
    public string ItemId { get; set; } = "";
    public int Count { get; set; } = 1;
    public string? Metadata { get; set; }
    public DateTime SpawnTime { get; set; } = DateTime.UtcNow;
    public TimeSpan Lifespan { get; set; } = TimeSpan.FromSeconds(DefaultTTLSeconds);
    public const float MergeRadius = 1.0f;
    public const float CollectionRadius = 1.5f;
    public const int MaxStackSize = 64;
    public static int DefaultTTLSeconds { get; set; } = 900;

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
            OnEntityDespawn?.Invoke(this);
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

        if (WorldReference != null)
        {
            var blockX = (short)Math.Floor(newPos.X);
            var blockY = (short)Math.Floor(newPos.Y);
            var blockZ = (short)Math.Floor(newPos.Z);
            var currentBlock = WorldReference.GetBlock(new Vector3s(blockX, blockY, blockZ));

            if (currentBlock != null
                && currentBlock.Type != BlockType.Air
                && currentBlock.Type != BlockType.Water
                && currentBlock.Type != BlockType.Lava)
            {
                var bestPos = newPos;
                var bestDist = float.MaxValue;
                var offsets = new (short Dx, short Dy, short Dz)[]
                {
                    (1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1),
                    (1, 1, 0), (-1, 1, 0), (0, 1, 1), (0, 1, -1),
                    (1, -1, 0), (-1, -1, 0), (0, -1, 1), (0, -1, -1),
                    (1, 0, 1), (-1, 0, 1), (1, 0, -1), (-1, 0, -1)
                };

                foreach (var (dx, dy, dz) in offsets)
                {
                    var checkPos = new Vector3s((short)(blockX + dx), (short)(blockY + dy), (short)(blockZ + dz));
                    var checkBlock = WorldReference.GetBlock(checkPos);
                    if (checkBlock != null
                        && (checkBlock.Type == BlockType.Air
                        || checkBlock.Type == BlockType.Water
                        || checkBlock.Type == BlockType.Lava))
                    {
                        var candidate = new Vector3(checkPos.X + 0.5f, checkPos.Y + 0.5f, checkPos.Z + 0.5f);
                        var dist = Vector3.Distance(newPos, candidate);
                        if (dist < bestDist)
                        {
                            bestDist = dist;
                            bestPos = candidate;
                        }
                    }
                }

                newPos = bestPos;
                Velocity = Vector3.Zero;
            }

            var groundY = (short)Math.Floor(newPos.Y - 0.1);
            var groundBlockDef = BlockDefinitions?.Get((ushort)WorldReference.GetBlock(new Vector3s(
                (short)Math.Floor(newPos.X), groundY, (short)Math.Floor(newPos.Z))).Type);
            if (groundBlockDef != null && groundBlockDef.Slippery)
            {
                var slipFactor = 0.02f;
                Velocity = new Vector3(
                    Velocity.X + (Random.Shared.NextSingle() - 0.5f) * slipFactor,
                    Velocity.Y,
                    Velocity.Z + (Random.Shared.NextSingle() - 0.5f) * slipFactor);
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

public class ProjectileEntity : Entity
{
    public string ProjectileType { get; set; } = "arrow";
    public string OwnerName { get; set; } = "";
    public Guid OwnerId { get; set; }
    public float Damage { get; set; } = 4.0f;
    public float LifetimeSeconds { get; set; } = 60.0f;
    public DateTime SpawnTime { get; set; } = DateTime.UtcNow;
    public int PierceLevel { get; set; }
    private int _hitCount;

    public ProjectileEntity(string projectileType, Vector3 position, Vector3 velocity, string ownerName, Guid ownerId, float damage)
        : base(EntityType.Projectile)
    {
        ProjectileType = projectileType;
        Position = position;
        Velocity = velocity;
        OwnerName = ownerName;
        OwnerId = ownerId;
        Damage = damage;
        Health = 1;
    }

    public override void Update(float dt)
    {
        base.Update(dt);

        if ((DateTime.UtcNow - SpawnTime).TotalSeconds > LifetimeSeconds || !IsAlive)
        {
            Health = 0;
            OnEntityDespawn?.Invoke(this);
            return;
        }

        Velocity = new Vector3(Velocity.X, Velocity.Y - 9.81f * dt, Velocity.Z);
        var drag = 0.99f;
        Velocity = new Vector3(Velocity.X * drag, Velocity.Y * drag, Velocity.Z * drag);

        var newPos = Position + Velocity * dt;

        if (WorldReference != null)
        {
            var blockX = (short)Math.Floor(newPos.X);
            var blockY = (short)Math.Floor(newPos.Y);
            var blockZ = (short)Math.Floor(newPos.Z);
            var block = WorldReference.GetBlock(new Vector3s(blockX, blockY, blockZ));

            if (block.Type != BlockType.Air
                && block.Type != BlockType.Water
                && block.Type != BlockType.WaterFlowing
                && block.Type != BlockType.Lava
                && block.Type != BlockType.LavaFlowing)
            {
                Health = 0;
                OnEntityDespawn?.Invoke(this);
                return;
            }
        }

        Position = newPos;
    }

    public bool CanHitEntity(Entity entity)
    {
        if (!IsAlive) return false;
        if (entity.Id == OwnerId) return false;
        if (_hitCount > PierceLevel) return false;
        return true;
    }

    public void OnHit()
    {
        _hitCount++;
        if (_hitCount > PierceLevel)
        {
            Health = 0;
            OnEntityDespawn?.Invoke(this);
        }
    }
}

public class MobEntity : Entity
{
    public static Func<Vector3, float, PlayerEnt?>? FindNearestPlayer { get; set; }
    public static Action<PlayerEnt, float>? DamagePlayer { get; set; }
    public static Action<MobEntity>? MobDeathDrops { get; set; }
    public static Func<Vector3, Vector3, List<Vector3>?>? FindPath { get; set; }

    public static Action<MobEntity>? OnMobActivate { get; set; }
    public static Action<MobEntity>? OnMobDeath { get; set; }
    public static Action<MobEntity>? OnMobDamage { get; set; }

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
    public bool MakesFootstepSound { get; set; }
    public float VisualScale { get; set; } = 1.0f;
    public string Infotext { get; set; } = "";
    public float AutoRotateSpeed { get; set; }
    public bool MakesFootstepSoundClient { get; set; }
    public Dictionary<string, int> ArmorGroups { get; set; } = new();
    public string? Nametag { get; set; }
    public string? NametagColor { get; set; }
    public int Glow { get; set; }
    private const float MobGravity = 20.0f;
    private DateTime _lastAttackTime;
    private int AttackCooldownMs = 1000;
    private DateTime _lastHurtTime;
    private const int HurtFlashDurationMs = 300;
    private float _wanderAngle;
    private float _wanderTimer;
    private float _wanderDirChangeTimer;
    private List<Vector3>? _currentPath;
    private float _idleLookTimer;
    private float _idleLookYaw;

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
            MakesFootstepSound = def.MakesFootstepSound;
            VisualScale = def.VisualScale;
            Infotext = def.Infotext;
            AutoRotateSpeed = def.AutoRotateSpeed;
            MakesFootstepSoundClient = def.MakesFootstepSound;
            ArmorGroups = new Dictionary<string, int>(def.ArmorGroups);
            Nametag = def.Nametag;
            NametagColor = def.NametagColor;
        }

        OnMobActivate?.Invoke(this);
    }

    public void Heal(float amount)
    {
        Health = Math.Min(MaxHealth, Health + amount);
    }

    public float CalculateArmorReduction(string damageGroup, float rawDamage)
    {
        if (ArmorGroups.Count == 0) return rawDamage;

        if (ArmorGroups.TryGetValue(damageGroup, out var groupRating))
        {
            if (groupRating <= 0) return rawDamage;
            var multiplier = Math.Max(0f, 1.0f - groupRating * 0.05f);
            return rawDamage * multiplier;
        }

        if (ArmorGroups.TryGetValue("fleshy", out var fleshyRating))
        {
            if (fleshyRating <= 0) return rawDamage;
            var multiplier = Math.Max(0f, 1.0f - fleshyRating * 0.05f);
            return rawDamage * multiplier * 0.5f;
        }

        return rawDamage;
    }

    public void TakeDamage(float amount, string damageGroup = "fleshy")
    {
        var actualDamage = CalculateArmorReduction(damageGroup, amount);
        if (actualDamage <= 0 && ArmorGroups.ContainsKey("immortal")) return;
        Health -= Math.Abs(actualDamage);
        _lastHurtTime = DateTime.UtcNow;
        IsHurt = true;
        OnMobDamage?.Invoke(this);

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
                Speed *= 2.0f;
            }
        }

        if (Health <= 0)
        {
            OnMobDeath?.Invoke(this);
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
                _idleLookTimer -= dt;
                if (_idleLookTimer <= 0)
                {
                    _idleLookYaw = Yaw + (Random.Shared.NextSingle() - 0.5f) * 1.0f;
                    _idleLookTimer = 2.0f + Random.Shared.NextSingle() * 4.0f;
                }
                Yaw += (_idleLookYaw - Yaw) * Math.Min(1.0f, dt * 2.0f);
                _wanderTimer -= dt;
                if (_wanderTimer <= 0)
                {
                    State = MobState.Wander;
                    _wanderAngle = Random.Shared.NextSingle() * MathF.PI * 2;
                    _wanderDirChangeTimer = 1.0f + Random.Shared.NextSingle() * 2.0f;
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
                _wanderDirChangeTimer -= dt;
                if (_wanderDirChangeTimer <= 0)
                {
                    _wanderAngle += (Random.Shared.NextSingle() - 0.5f) * 1.5f;
                    _wanderDirChangeTimer = 1.5f + Random.Shared.NextSingle() * 2.0f;
                }
                _wanderTimer -= dt;
                if (_wanderTimer <= 0)
                {
                    State = MobState.Idle;
                    _wanderTimer = 1.0f + Random.Shared.NextSingle() * 2.0f;
                    _idleLookTimer = 0;
                }
                Yaw += (_wanderAngle - Yaw) * Math.Min(1.0f, dt * 3.0f);
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
                    var fleeTarget = Position + fleeDir * 8.0f;
                    var fleePath = FindPath?.Invoke(Position, fleeTarget);

                    if (fleePath != null && fleePath.Count > 1)
                    {
                        var pathDir = fleePath[1] - Position;
                        pathDir = pathDir.Normalized;
                        Velocity = new Vector3(
                            pathDir.X * Speed * 1.3f,
                            Velocity.Y,
                            pathDir.Z * Speed * 1.3f);
                        Yaw = MathF.Atan2(pathDir.X, pathDir.Z);
                    }
                    else
                    {
                        Yaw = MathF.Atan2(fleeDir.X, fleeDir.Z);
                        Velocity = new Vector3(
                            fleeDir.X * Speed * 1.3f,
                            Velocity.Y,
                            fleeDir.Z * Speed * 1.3f);
                    }
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
