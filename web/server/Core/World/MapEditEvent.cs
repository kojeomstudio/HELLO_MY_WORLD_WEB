namespace WebGameServer.Core.World;

public enum MapEditEventType
{
    AddNode,
    RemoveNode,
    SwapNode,
    BlockNodeMetadataChanged,
    Other
}

public record MapEditEvent(
    MapEditEventType Type,
    int X, int Y, int Z,
    BlockType OldBlock,
    BlockType NewBlock,
    string? ModifiedBy
);

public class MapEditEventReceiver
{
    private readonly Queue<MapEditEvent> _events = new();
    private readonly object _lock = new();
    private readonly int _maxQueueSize;

    public MapEditEventReceiver(int maxQueueSize = 1024)
    {
        _maxQueueSize = maxQueueSize;
    }

    public void OnMapEditEvent(MapEditEvent editEvent)
    {
        lock (_lock)
        {
            if (_events.Count >= _maxQueueSize)
                _events.Dequeue();
            _events.Enqueue(editEvent);
        }
    }

    public bool TryDequeue(out MapEditEvent? editEvent)
    {
        lock (_lock)
        {
            if (_events.Count > 0)
            {
                editEvent = _events.Dequeue();
                return true;
            }
            editEvent = default;
            return false;
        }
    }

    public List<MapEditEvent> DequeueAll()
    {
        lock (_lock)
        {
            var result = new List<MapEditEvent>(_events.Count);
            while (_events.Count > 0)
                result.Add(_events.Dequeue());
            return result;
        }
    }

    public void Clear()
    {
        lock (_lock)
        {
            _events.Clear();
        }
    }
}

public class MapEditEventManager
{
    private readonly List<MapEditEventReceiver> _receivers = new();
    private readonly object _lock = new();

    public void RegisterReceiver(MapEditEventReceiver receiver)
    {
        lock (_lock)
        {
            _receivers.Add(receiver);
        }
    }

    public void UnregisterReceiver(MapEditEventReceiver receiver)
    {
        lock (_lock)
        {
            _receivers.Remove(receiver);
        }
    }

    public void DispatchEvent(MapEditEvent editEvent)
    {
        List<MapEditEventReceiver> snapshot;
        lock (_lock)
        {
            snapshot = new List<MapEditEventReceiver>(_receivers);
        }

        foreach (var receiver in snapshot)
        {
            receiver.OnMapEditEvent(editEvent);
        }
    }

    public void DispatchNodeChange(int x, int y, int z, BlockType oldBlock, BlockType newBlock, string? modifiedBy = null)
    {
        var eventType = newBlock == BlockType.Air ? MapEditEventType.RemoveNode
            : oldBlock == BlockType.Air ? MapEditEventType.AddNode
            : MapEditEventType.SwapNode;

        DispatchEvent(new MapEditEvent(eventType, x, y, z, oldBlock, newBlock, modifiedBy));
    }
}
