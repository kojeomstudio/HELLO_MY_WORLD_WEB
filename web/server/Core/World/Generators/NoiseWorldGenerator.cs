using WebGameServer.Core.World;

namespace WebGameServer.Core.World.Generators;

public class NoiseWorldGenerator : IWorldGenerator
{
    public string Name => "noise";
    private int _seed;
    private Random _random;

    private const int GroundBase = 32;
    private const int TerrainHeight = 16;

    public void Initialize(int seed)
    {
        _seed = seed;
        _random = new Random(seed);
    }

    public ushort[,,] GenerateChunk(int chunkX, int chunkY, int chunkZ)
    {
        var blocks = new ushort[Chunk.Size, Chunk.Size, Chunk.Size];
        var baseX = chunkX * Chunk.Size;
        var baseY = chunkY * Chunk.Size;
        var baseZ = chunkZ * Chunk.Size;

        var heightMap = GenerateHeightMap(baseX, baseZ, Chunk.Size, Chunk.Size);

        for (int x = 0; x < Chunk.Size; x++)
        {
            for (int z = 0; z < Chunk.Size; z++)
            {
                var surfaceHeight = heightMap[x, z];

                for (int y = 0; y < Chunk.Size; y++)
                {
                    var worldY = baseY + y;

                    if (worldY < surfaceHeight - 4)
                    {
                        blocks[x, y, z] = (ushort)BlockType.Stone;
                    }
                    else if (worldY < surfaceHeight - 1)
                    {
                        blocks[x, y, z] = (ushort)BlockType.Dirt;
                    }
                    else if (worldY < surfaceHeight)
                    {
                        blocks[x, y, z] = (ushort)BlockType.Grass;
                    }
                    else if (worldY < GroundBase - 8)
                    {
                        blocks[x, y, z] = (ushort)BlockType.Water;
                    }
                    else
                    {
                        blocks[x, y, z] = (ushort)BlockType.Air;
                    }
                }
            }
        }

        return blocks;
    }

    private int[,] GenerateHeightMap(int baseX, int baseZ, int width, int depth)
    {
        var heightMap = new int[width, depth];

        for (int x = 0; x < width; x++)
        {
            for (int z = 0; z < depth; z++)
            {
                var worldX = baseX + x;
                var worldZ = baseZ + z;

                var noise = GenerateNoise(worldX * 0.1, worldZ * 0.1);
                heightMap[x, z] = GroundBase + (int)(noise * TerrainHeight);
            }
        }

        return heightMap;
    }

    private double GenerateNoise(double x, double z)
    {
        var seed = (int)(x * 374761393 + z * 668265263) ^ _seed;
        var rng = new Random(seed);
        return rng.NextDouble() * 2.0 - 1.0;
    }

    public int GetGroundHeight(int x, int z)
    {
        var noise = GenerateNoise(x * 0.1, z * 0.1);
        return GroundBase + (int)(noise * TerrainHeight);
    }
}
