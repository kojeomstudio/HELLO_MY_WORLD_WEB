using System.Collections.Concurrent;

namespace WebGameServer.Core.Rollback;

public enum ChangeType
{
    Place,
    Dig,
    Interact
}

public readonly record struct BlockChangeRecord(
    int X,
    int Y,
    int Z,
    uint OldBlockData,
    uint NewBlockData,
    string PlayerName,
    DateTime Timestamp,
    ChangeType ChangeType
);

public class RollbackSystem
{
    private const int MaxRecords = 10000;

    private readonly ConcurrentQueue<BlockChangeRecord> _changes = new();
    private readonly object _rollbackLock = new();
    private int _count;

    public void RecordChange(int x, int y, int z, uint oldData, uint newData, string playerName, string changeType)
    {
        var type = changeType.ToUpperInvariant() switch
        {
            "PLACE" => ChangeType.Place,
            "DIG" => ChangeType.Dig,
            "INTERACT" => ChangeType.Interact,
            _ => ChangeType.Place
        };

        var record = new BlockChangeRecord(x, y, z, oldData, newData, playerName, DateTime.UtcNow, type);
        _changes.Enqueue(record);
        Interlocked.Increment(ref _count);

        while (_count > MaxRecords && _changes.TryDequeue(out _))
        {
            Interlocked.Decrement(ref _count);
        }
    }

    public List<BlockChangeRecord> Rollback(string playerName, int seconds)
    {
        var cutoff = DateTime.UtcNow.AddSeconds(-seconds);
        var rolledBack = new List<BlockChangeRecord>();

        lock (_rollbackLock)
        {
            var remaining = new List<BlockChangeRecord>();

            while (_changes.TryDequeue(out var record))
            {
                Interlocked.Decrement(ref _count);

                if (string.Equals(record.PlayerName, playerName, StringComparison.OrdinalIgnoreCase)
                    && record.Timestamp >= cutoff)
                {
                    rolledBack.Add(record);
                }
                else
                {
                    remaining.Add(record);
                }
            }

            foreach (var record in remaining)
            {
                _changes.Enqueue(record);
                Interlocked.Increment(ref _count);
            }
        }

        return rolledBack;
    }

    public List<BlockChangeRecord> RollbackArea(int x1, int y1, int z1, int x2, int y2, int z2)
    {
        var minX = Math.Min(x1, x2);
        var maxX = Math.Max(x1, x2);
        var minY = Math.Min(y1, y2);
        var maxY = Math.Max(y1, y2);
        var minZ = Math.Min(z1, z2);
        var maxZ = Math.Max(z1, z2);

        var rolledBack = new List<BlockChangeRecord>();

        lock (_rollbackLock)
        {
            var remaining = new List<BlockChangeRecord>();

            while (_changes.TryDequeue(out var record))
            {
                Interlocked.Decrement(ref _count);

                if (record.X >= minX && record.X <= maxX
                    && record.Y >= minY && record.Y <= maxY
                    && record.Z >= minZ && record.Z <= maxZ)
                {
                    rolledBack.Add(record);
                }
                else
                {
                    remaining.Add(record);
                }
            }

            foreach (var record in remaining)
            {
                _changes.Enqueue(record);
                Interlocked.Increment(ref _count);
            }
        }

        return rolledBack;
    }

    public List<BlockChangeRecord> GetRecentChanges(int count)
    {
        return _changes
            .Reverse()
            .Take(count)
            .ToList();
    }

    public List<BlockChangeRecord> GetChangesBy(string playerName, int count)
    {
        return _changes
            .Where(r => string.Equals(r.PlayerName, playerName, StringComparison.OrdinalIgnoreCase))
            .Reverse()
            .Take(count)
            .ToList();
    }
}
