using ItemStack = WebGameServer.Core.Player.ItemStack;

namespace WebGameServer.Core;

public interface IWorldGenerator
{
    string Name { get; }
    void Initialize(int seed);
    void LoadBiomes(string dataPath);
    ushort[,,] GenerateChunk(int chunkX, int chunkY, int chunkZ);
    int GetGroundHeight(int x, int z);
    List<(int X, int Y, int Z, List<ItemStack> Loot)> PopPendingDungeonChests();
}
