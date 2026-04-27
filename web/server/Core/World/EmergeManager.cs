using System.Collections.Concurrent;
using System.Diagnostics;
using WebGameServer.Core.Game;

namespace WebGameServer.Core.World;

public enum EmergePriority
{
    Critical = 0,
    High = 1,
    Normal = 2,
    Low = 3,
    Background = 4
}

public readonly record struct EmergeRequest(
    ChunkCoord Coord,
    EmergePriority Priority,
    string? PlayerId);

public readonly record struct EmergeMetrics(
    int TotalGenerated,
    int TotalRequested,
    double AverageGenerationTimeMs,
    double MaxGenerationTimeMs,
    int QueueLength);

public class EmergeManager
{
    private readonly World _world;
    private readonly BlockDefinitionManager _blockDefs;
    private readonly PriorityQueue<EmergeRequest, int> _queue = new();
    private readonly ConcurrentDictionary<ChunkCoord, bool> _queuedOrLoaded = new();
    private readonly ConcurrentDictionary<string, HashSet<ChunkCoord>> _playerChunks = new();
    private readonly ConcurrentDictionary<string, Vector3> _playerPositions = new();

    private int _totalGenerated;
    private int _totalRequested;
    private double _totalGenTimeMs;
    private double _maxGenTimeMs;

    public int MaxConcurrentPerTick { get; set; } = 4;
    public int PregenerationRadius { get; set; } = 4;
    public bool IsPregenerating { get; private set; }
    public int PregenerationProgress { get; private set; }
    public int PregenerationTotal { get; private set; }

    public EmergeManager(World world, BlockDefinitionManager blockDefs)
    {
        _world = world;
        _blockDefs = blockDefs;
    }

    public void RequestChunk(ChunkCoord coord, EmergePriority priority, string? playerId = null)
    {
        if (!_queuedOrLoaded.TryAdd(coord, true)) return;

        _totalRequested++;
        _queue.Enqueue(new EmergeRequest(coord, priority, playerId), (int)priority);
    }

    public void RequestPlayerChunks(string playerId, Vector3 position, int radius)
    {
        _playerPositions[playerId] = position;

        var cx = (int)Math.Floor(position.X / Chunk.Size);
        var cz = (int)Math.Floor(position.Z / Chunk.Size);

        if (!_playerChunks.TryGetValue(playerId, out var chunks))
        {
            chunks = new HashSet<ChunkCoord>();
            _playerChunks[playerId] = chunks;
        }

        for (int dx = -radius; dx <= radius; dx++)
        {
            for (int dz = -radius; dz <= radius; dz++)
            {
                if (dx * dx + dz * dz > radius * radius) continue;

                for (int cy = 0; cy <= 2; cy++)
                {
                    var coord = new ChunkCoord(cx + dx, cy, cz + dz);
                    chunks.Add(coord);

                    if (_world.GetChunkIfExists(coord) == null)
                    {
                        var distance = Math.Abs(dx) + Math.Abs(dz);
                        var priority = distance <= 2 ? EmergePriority.Critical :
                            distance <= radius / 2 ? EmergePriority.High :
                            EmergePriority.Normal;
                        RequestChunk(coord, priority, playerId);
                    }
                }
            }
        }
    }

    public void RemovePlayer(string playerId)
    {
        _playerChunks.TryRemove(playerId, out _);
        _playerPositions.TryRemove(playerId, out _);
    }

    public void UpdatePlayerPosition(string playerId, Vector3 position)
    {
        _playerPositions[playerId] = position;
    }

    public HashSet<ChunkCoord>? GetPlayerLoadedChunks(string playerId)
    {
        return _playerChunks.TryGetValue(playerId, out var chunks) ? chunks : null;
    }

    public void ProcessQueue(int maxChunks = 0)
    {
        var limit = maxChunks > 0 ? maxChunks : MaxConcurrentPerTick;
        var processed = 0;

        while (_queue.Count > 0 && processed < limit)
        {
            if (!_queue.TryDequeue(out var request, out _)) break;

            var sw = Stopwatch.StartNew();
            _world.GetChunk(request.Coord);
            sw.Stop();

            var elapsedMs = sw.Elapsed.TotalMilliseconds;
            _totalGenerated++;
            _totalGenTimeMs += elapsedMs;
            _maxGenTimeMs = Math.Max(_maxGenTimeMs, elapsedMs);

            processed++;
        }
    }

    public void StartPregeneration(int centerX, int centerZ, int radius)
    {
        IsPregenerating = true;
        PregenerationProgress = 0;
        PregenerationTotal = 0;

        for (int dx = -radius; dx <= radius; dx++)
        {
            for (int dz = -radius; dz <= radius; dz++)
            {
                for (int cy = 0; cy <= 2; cy++)
                {
                    var coord = new ChunkCoord(centerX + dx, cy, centerZ + dz);
                    if (_world.GetChunkIfExists(coord) == null)
                    {
                        RequestChunk(coord, EmergePriority.Background);
                        PregenerationTotal++;
                    }
                }
            }
        }
    }

    public void UpdatePregeneration()
    {
        if (!IsPregenerating) return;

        ProcessQueue(MaxConcurrentPerTick);

        PregenerationProgress = _totalGenerated;

        if (_queue.Count == 0)
        {
            IsPregenerating = false;
        }
    }

    public EmergeMetrics GetMetrics()
    {
        return new EmergeMetrics(
            _totalGenerated,
            _totalRequested,
            _totalGenerated > 0 ? _totalGenTimeMs / _totalGenerated : 0,
            _maxGenTimeMs,
            _queue.Count);
    }

    public void CleanupDistantPlayerChunks(string playerId, int maxDistance)
    {
        if (!_playerChunks.TryGetValue(playerId, out var chunks)) return;
        if (!_playerPositions.TryGetValue(playerId, out var pos)) return;

        var cx = (int)Math.Floor(pos.X / Chunk.Size);
        var cz = (int)Math.Floor(pos.Z / Chunk.Size);

        var toRemove = new List<ChunkCoord>();
        foreach (var coord in chunks)
        {
            var dist = Math.Abs(coord.X - cx) + Math.Abs(coord.Z - cz);
            if (dist > maxDistance + 2)
                toRemove.Add(coord);
        }

        foreach (var coord in toRemove)
        {
            chunks.Remove(coord);
        }
    }

    public void ClearQueue()
    {
        while (_queue.Count > 0)
            _queue.TryDequeue(out _, out _);
        _queuedOrLoaded.Clear();
        foreach (var coord in _world.GetLoadedChunks())
            _queuedOrLoaded[coord] = true;
    }
}
