namespace WebGameServer.Core;

public interface IWorldGenerator
{
    string Name { get; }
    void Initialize(int seed);
    ushort[,,] GenerateChunk(int chunkX, int chunkY, int chunkZ);
    int GetGroundHeight(int x, int z);
}
