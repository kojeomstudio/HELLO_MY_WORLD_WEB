namespace WebGameServer.Core.World;

public class NodeTimerSystem
{
    private readonly Dictionary<NodeTimerKey, NodeTimer> _timers = new();
    private readonly object _lock = new();
    private readonly World _world;
    private readonly Action<int, int, int, string>? _onTimerExpired;

    public NodeTimerSystem(World world, Action<int, int, int, string>? onTimerExpired = null)
    {
        _world = world;
        _onTimerExpired = onTimerExpired;
    }

    public void SetTimer(int x, int y, int z, double timeout)
    {
        var key = new NodeTimerKey(x, y, z);
        lock (_lock)
        {
            _timers[key] = new NodeTimer(x, y, z, timeout);
        }
    }

    public void RemoveTimer(int x, int y, int z)
    {
        var key = new NodeTimerKey(x, y, z);
        lock (_lock)
        {
            _timers.Remove(key);
        }
    }

    public NodeTimer? GetTimer(int x, int y, int z)
    {
        var key = new NodeTimerKey(x, y, z);
        lock (_lock)
        {
            return _timers.TryGetValue(key, out var timer) ? timer : null;
        }
    }

    public void Update(double dt)
    {
        List<NodeTimerKey> expiredKeys = new();

        lock (_lock)
        {
            foreach (var kvp in _timers)
            {
                kvp.Value.Elapsed += dt;
                if (kvp.Value.IsExpired)
                {
                    expiredKeys.Add(kvp.Key);
                }
            }
        }

        foreach (var key in expiredKeys)
        {
            lock (_lock)
            {
                _timers.Remove(key);
            }

            var block = _world.GetBlock(new Vector3s((short)key.X, (short)key.Y, (short)key.Z));
            var blockName = block.Type.ToString();
            _onTimerExpired?.Invoke(key.X, key.Y, key.Z, blockName);
        }
    }

    public int GetActiveTimerCount()
    {
        lock (_lock)
        {
            return _timers.Count;
        }
    }
}
