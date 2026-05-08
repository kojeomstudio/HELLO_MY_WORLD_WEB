using System.Collections.Concurrent;
using PlayerEnt = WebGameServer.Core.Player.Player;
 
namespace WebGameServer.Core.Entities;
 
public class EntityManager
{
    private readonly ConcurrentDictionary<Guid, Entity> _entities = new();
    private readonly int _maxEntities;

    public Func<IEnumerable<PlayerEnt>>? GetPlayersFunc { get; set; }

    public event Action<Entity>? OnEntitySpawned;
    public event Action<Entity>? OnEntityDespawned;
    public event Action<Entity>? OnEntityUpdated;

    public int Count => _entities.Count;

    public EntityManager(int maxEntities = 10000)
    {
        _maxEntities = maxEntities > 0 ? maxEntities : 10000;
    }

    public T? Add<T>(T entity) where T : Entity
    {
        if (_entities.Count >= _maxEntities) return default;
        if (_entities.TryAdd(entity.Id, entity))
        {
            OnEntitySpawned?.Invoke(entity);
            return entity;
        }
        return default;
    }

    public bool Remove(Guid id)
    {
        if (_entities.TryRemove(id, out var entity))
        {
            OnEntityDespawned?.Invoke(entity);
            return true;
        }
        return false;
    }

    public Entity? Get(Guid id) => _entities.TryGetValue(id, out var e) ? e : null;

    public IEnumerable<Entity> GetInRange(Vector3 position, float range)
    {
        return _entities.Values
            .Where(e => e.IsAlive && Vector3.Distance(e.Position, position) <= range);
    }

    public IEnumerable<T> GetByType<T>() where T : Entity
    {
        return _entities.Values.OfType<T>();
    }

    public IEnumerable<Entity> GetAll() => _entities.Values;

    public int ClearMobs()
    {
        var mobs = _entities.Values.Where(e => e is MobEntity).ToList();
        foreach (var mob in mobs)
        {
            OnEntityDespawned?.Invoke(mob);
            _entities.TryRemove(mob.Id, out _);
        }
        return mobs.Count;
    }

    public void UpdateAll(float dt)
    {
        foreach (var entity in _entities.Values)
        {
            if (entity.IsAlive)
            {
                entity.Update(dt);
                OnEntityUpdated?.Invoke(entity);
            }
        }

        ProcessProjectileCollisions();

        var deadEntities = _entities.Values.Where(e => !e.IsAlive).ToList();
        foreach (var entity in deadEntities)
        {
            OnEntityDespawned?.Invoke(entity);
            _entities.TryRemove(entity.Id, out _);
        }
    }

    private void ProcessProjectileCollisions()
    {
        var players = GetPlayersFunc?.Invoke();
        if (players == null) return;

        var projectiles = _entities.Values
            .OfType<ProjectileEntity>()
            .Where(p => p.IsAlive)
            .ToList();

        foreach (var proj in projectiles)
        {
            var mobs = _entities.Values
                .Where(e => e is MobEntity mob && mob.IsAlive && proj.CanHitEntity(mob))
                .ToList();

            foreach (var entity in mobs)
            {
                if (Vector3.Distance(proj.Position, entity.Position) < 0.8f)
                {
                    if (entity is MobEntity mob)
                    {
                        mob.TakeDamage(proj.Damage, "fleshy");
                        var knockDir = (mob.Position - proj.Position).Normalized;
                        mob.Velocity = mob.Velocity + new Vector3(knockDir.X * 0.5f, 0.3f, knockDir.Z * 0.5f);
                    }
                    proj.OnHit();
                    break;
                }
            }

            if (!proj.IsAlive) continue;

            foreach (var player in players)
            {
                if (player.IsDead || player.Invulnerable) continue;
                if (Vector3.Distance(proj.Position, player.Position) < 0.8f)
                {
                    ProjectileHitPlayer?.Invoke(player, proj);
                    proj.OnHit();
                    break;
                }
            }
        }
    }

    public event Action<PlayerEnt, ProjectileEntity>? ProjectileHitPlayer;
}
