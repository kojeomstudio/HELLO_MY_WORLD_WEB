using System.Collections.Concurrent;

namespace WebGameServer.Core.Entities;

public class EntityManager
{
    private readonly ConcurrentDictionary<Guid, Entity> _entities = new();
    private readonly int _maxEntities = 10000;

    public int Count => _entities.Count;

    public T? Add<T>(T entity) where T : Entity
    {
        if (_entities.Count >= _maxEntities) return default;
        _entities.TryAdd(entity.Id, entity);
        return entity;
    }

    public bool Remove(Guid id) => _entities.TryRemove(id, out _);

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

    public void UpdateAll(float dt)
    {
        foreach (var entity in _entities.Values)
        {
            entity.Update(dt);
        }

        var deadEntities = _entities.Values.Where(e => !e.IsAlive).Select(e => e.Id).ToList();
        foreach (var id in deadEntities)
        {
            _entities.TryRemove(id, out _);
        }
    }
}
