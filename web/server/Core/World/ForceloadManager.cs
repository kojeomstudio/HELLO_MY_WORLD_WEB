using System.Collections.Concurrent;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace WebGameServer.Core.World;

public readonly record struct ForceloadEntry(ChunkCoord Coord, bool Persistent);

public class ForceloadManager
{
    private readonly ConcurrentDictionary<ChunkCoord, int> _transientCounts = new();
    private readonly HashSet<ChunkCoord> _persistentSet = new();
    private readonly object _lock = new();

    public int MaxForceloadedChunks { get; set; } = 256;

    public bool ForceloadBlock(ChunkCoord coord, bool persistent)
    {
        lock (_lock)
        {
            if (persistent)
            {
                if (_persistentSet.Contains(coord)) return true;
                if (GetTotalUniqueCount() >= MaxForceloadedChunks) return false;
                _persistentSet.Add(coord);
                return true;
            }

            if (_transientCounts.TryGetValue(coord, out var count))
            {
                _transientCounts[coord] = count + 1;
                return true;
            }

            if (GetTotalUniqueCount() >= MaxForceloadedChunks) return false;
            _transientCounts[coord] = 1;
            return true;
        }
    }

    public void ForceloadFreeBlock(ChunkCoord coord)
    {
        lock (_lock)
        {
            _persistentSet.Remove(coord);

            if (_transientCounts.TryGetValue(coord, out var count))
            {
                if (count <= 1)
                    _transientCounts.TryRemove(coord, out _);
                else
                    _transientCounts[coord] = count - 1;
            }
        }
    }

    public HashSet<ChunkCoord> GetForceloadedChunks()
    {
        lock (_lock)
        {
            var result = new HashSet<ChunkCoord>(_persistentSet);
            foreach (var coord in _transientCounts.Keys)
                result.Add(coord);
            return result;
        }
    }

    public void Save(string filePath)
    {
        var entries = new List<ForceloadEntry>();
        lock (_lock)
        {
            foreach (var coord in _persistentSet)
                entries.Add(new ForceloadEntry(coord, true));
            foreach (var (coord, _) in _transientCounts)
                entries.Add(new ForceloadEntry(coord, false));
        }

        var json = JsonSerializer.Serialize(entries, ForceloadJsonContext.Default.ListForceloadEntry);
        File.WriteAllText(filePath, json);
    }

    public void Load(string filePath)
    {
        if (!File.Exists(filePath)) return;

        var json = File.ReadAllText(filePath);
        var entries = JsonSerializer.Deserialize(json, ForceloadJsonContext.Default.ListForceloadEntry);
        if (entries == null) return;

        lock (_lock)
        {
            _persistentSet.Clear();
            _transientCounts.Clear();

            foreach (var entry in entries)
            {
                if (entry.Persistent)
                    _persistentSet.Add(entry.Coord);
                else
                    _transientCounts[entry.Coord] = 1;
            }
        }
    }

    private int GetTotalUniqueCount()
    {
        var count = _persistentSet.Count;
        foreach (var coord in _transientCounts.Keys)
        {
            if (!_persistentSet.Contains(coord))
                count++;
        }
        return count;
    }
}

[JsonSourceGenerationOptions(PropertyNamingPolicy = JsonKnownNamingPolicy.CamelCase)]
[JsonSerializable(typeof(List<ForceloadEntry>))]
internal partial class ForceloadJsonContext : JsonSerializerContext
{
}
