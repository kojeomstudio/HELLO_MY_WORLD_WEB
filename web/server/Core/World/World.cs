using System.Collections.Concurrent;

namespace WebGameServer.Core.World;

public class World
{
    private readonly ConcurrentDictionary<ChunkCoord, Chunk> _chunks = new();
    private readonly IWorldGenerator _generator;
    private readonly int _seed;
    private readonly ConcurrentQueue<(ChunkCoord ChunkCoord, Vector3s LocalPos)> _liquidUpdateQueue = new();

    public string Name { get; }
    public int Seed => _seed;
    public int AutoSaveInterval { get; set; } = 300;
    public DateTime LastSaveTime { get; set; } = DateTime.UtcNow;
    public bool NeedsSave { get; set; }
    private int _lastLiquidUpdateTick;

    public World(string name, int seed, IWorldGenerator generator)
    {
        Name = name;
        _seed = seed;
        _generator = generator;
        _generator.Initialize(seed);
    }

    public Chunk GetChunk(ChunkCoord coord)
    {
        return _chunks.GetOrAdd(coord, c =>
        {
            var chunk = new Chunk(c);
            GenerateChunk(chunk);
            return chunk;
        });
    }

    public Chunk? GetChunkIfExists(ChunkCoord coord)
    {
        return _chunks.TryGetValue(coord, out var chunk) ? chunk : null;
    }

    public Block GetBlock(Vector3s blockCoord)
    {
        var chunkCoord = ChunkCoord.FromBlockCoord(blockCoord);
        var chunk = GetChunk(chunkCoord);
        var localX = blockCoord.X & (Chunk.Size - 1);
        var localY = blockCoord.Y & (Chunk.Size - 1);
        var localZ = blockCoord.Z & (Chunk.Size - 1);
        return chunk.GetBlock(localX, localY, localZ);
    }

    public void SetBlock(Vector3s blockCoord, Block block)
    {
        var chunkCoord = ChunkCoord.FromBlockCoord(blockCoord);
        var chunk = GetChunk(chunkCoord);
        var localX = blockCoord.X & (Chunk.Size - 1);
        var localY = blockCoord.Y & (Chunk.Size - 1);
        var localZ = blockCoord.Z & (Chunk.Size - 1);
        chunk.SetBlock(localX, localY, localZ, block);
        NeedsSave = true;
    }

    private void GenerateChunk(Chunk chunk)
    {
        var blocks = _generator.GenerateChunk(chunk.Coord.X, chunk.Coord.Y, chunk.Coord.Z);
        for (int x = 0; x < Chunk.Size; x++)
        {
            for (int y = 0; y < Chunk.Size; y++)
            {
                for (int z = 0; z < Chunk.Size; z++)
                {
                    chunk.SetBlock(x, y, z, new Block((BlockType)blocks[x, y, z]));
                }
            }
        }
    }

    public int GetGroundHeight(int x, int z)
    {
        return _generator.GetGroundHeight(x, z);
    }

    public List<ChunkCoord> GetLoadedChunks()
    {
        return _chunks.Keys.ToList();
    }

    public void QueueLiquidUpdate(ChunkCoord chunkCoord, Vector3s localPos)
    {
        _liquidUpdateQueue.Enqueue((chunkCoord, localPos));
    }

    public void UpdateLiquids(int tickCount)
    {
        if (tickCount - _lastLiquidUpdateTick < 5) return;
        _lastLiquidUpdateTick = tickCount;

        var processed = new HashSet<(short X, short Y, short Z)>();

        foreach (var chunkCoord in _chunks.Keys)
        {
            var chunk = GetChunkIfExists(chunkCoord);
            if (chunk == null) continue;

            for (int x = 0; x < Chunk.Size; x++)
            {
                for (int y = 0; y < Chunk.Size; y++)
                {
                    for (int z = 0; z < Chunk.Size; z++)
                    {
                        var block = chunk.GetBlock(x, y, z);
                        if (block.Type != BlockType.Water && block.Type != BlockType.Lava) continue;

                        var worldX = (short)(chunkCoord.X * Chunk.Size + x);
                        var worldY = (short)(chunkCoord.Y * Chunk.Size + y);
                        var worldZ = (short)(chunkCoord.Z * Chunk.Size + z);

                        if (processed.Contains((worldX, worldY, worldZ))) continue;

                        var flowTarget = FindFlowTarget(worldX, worldY, worldZ);
                        if (flowTarget == null) continue;

                        processed.Add((flowTarget.Value.X, flowTarget.Value.Y, flowTarget.Value.Z));
                        SetBlock(flowTarget.Value, new Block(block.Type));
                    }
                }
            }
        }
    }

    private Vector3s? FindFlowTarget(short x, short y, short z)
    {
        var below = new Vector3s(x, (short)(y - 1), z);
        var belowBlock = GetBlock(below);
        if (belowBlock.Type == BlockType.Air)
        {
            return below;
        }

        var directions = new (short dx, short dz)[]
        {
            (0, 1), (0, -1), (1, 0), (-1, 0)
        };

        var random = Random.Shared;
        var shuffled = directions.OrderBy(_ => random.Next()).ToArray();

        foreach (var (dx, dz) in shuffled)
        {
            var neighbor = new Vector3s((short)(x + dx), y, (short)(z + dz));
            var neighborBlock = GetBlock(neighbor);
            if (neighborBlock.Type == BlockType.Air)
            {
                return neighbor;
            }
        }

        return null;
    }

    public void Save(string directory)
    {
        WorldPersistence.SaveWorld(this, directory);
        NeedsSave = false;
        LastSaveTime = DateTime.UtcNow;
    }

    public void Load(string directory)
    {
        WorldPersistence.LoadWorld(this, directory);
        NeedsSave = false;
        LastSaveTime = DateTime.UtcNow;
    }
}
