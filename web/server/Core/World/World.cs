using System.Collections.Concurrent;

namespace WebGameServer.Core.World;

public class World
{
    private readonly ConcurrentDictionary<ChunkCoord, Chunk> _chunks = new();
    private readonly IWorldGenerator _generator;
    private readonly int _seed;

    public string Name { get; }
    public int Seed => _seed;

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
}
