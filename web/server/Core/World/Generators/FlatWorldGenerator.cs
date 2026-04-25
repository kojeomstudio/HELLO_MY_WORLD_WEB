using WebGameServer.Core.World;

namespace WebGameServer.Core.World.Generators;

public class FlatWorldGenerator : IWorldGenerator
{
    public string Name => "flat";
    private int _groundLevel = 32;

    public void Initialize(int seed)
    {
    }

    public void LoadBiomes(string dataPath)
    {
    }

    public ushort[,,] GenerateChunk(int chunkX, int chunkY, int chunkZ)
    {
        var blocks = new ushort[Chunk.Size, Chunk.Size, Chunk.Size];
        var baseY = chunkY * Chunk.Size;

        for (int x = 0; x < Chunk.Size; x++)
        {
            for (int y = 0; y < Chunk.Size; y++)
            {
                for (int z = 0; z < Chunk.Size; z++)
                {
                    var worldY = baseY + y;

                    if (worldY < _groundLevel - 4)
                    {
                        blocks[x, y, z] = (ushort)BlockType.Stone;
                    }
                    else if (worldY < _groundLevel - 1)
                    {
                        blocks[x, y, z] = (ushort)BlockType.Dirt;
                    }
                    else if (worldY < _groundLevel)
                    {
                        blocks[x, y, z] = (ushort)BlockType.Grass;
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

    public int GetGroundHeight(int x, int z)
    {
        return _groundLevel - 1;
    }
}
