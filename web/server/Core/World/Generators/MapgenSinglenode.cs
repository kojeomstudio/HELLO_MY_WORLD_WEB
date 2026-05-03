using WebGameServer.Core.World;
using ItemStack = WebGameServer.Core.Player.ItemStack;

namespace WebGameServer.Core.World.Generators;

public class MapgenSinglenode : IWorldGenerator
{
    public string Name => "singlenode";

    private int _seed;
    private ushort _blockType = (ushort)BlockType.Air;

    public void Initialize(int seed)
    {
        _seed = seed;
    }

    public void LoadBiomes(string dataPath)
    {
    }

    public void Configure(ushort blockType)
    {
        _blockType = blockType;
    }

    public ushort[,,] GenerateChunk(int chunkX, int chunkY, int chunkZ)
    {
        var blocks = new ushort[Chunk.Size, Chunk.Size, Chunk.Size];

        for (int x = 0; x < Chunk.Size; x++)
        {
            for (int y = 0; y < Chunk.Size; y++)
            {
                for (int z = 0; z < Chunk.Size; z++)
                {
                    blocks[x, y, z] = _blockType;
                }
            }
        }

        return blocks;
    }

    public int GetGroundHeight(int x, int z)
    {
        return _blockType == (ushort)BlockType.Air ? 0 : int.MaxValue;
    }

    public List<(int X, int Y, int Z, List<ItemStack> Loot)> PopPendingDungeonChests()
    {
        return new();
    }
}
