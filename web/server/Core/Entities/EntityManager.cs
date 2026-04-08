using System.Collections.Concurrent;

namespace WebGameServer.Core.Entities;

public class EntityManager
{
    private readonly ConcurrentDictionary<Guid, Entity> _entities = new();
    private readonly int _maxEntities = 10000;

    public event Action<Entity>? OnEntitySpawned;
    public event Action<Entity>? OnEntityDespawned;
    public event Action<Entity>? OnEntityUpdated;

    public int Count => _entities.Count;

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

        var deadEntities = _entities.Values.Where(e => !e.IsAlive).ToList();
        foreach (var entity in deadEntities)
        {
            OnEntityDespawned?.Invoke(entity);
            _entities.TryRemove(entity.Id, out _);
        }
    }
}
