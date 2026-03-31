using WebGameServer.Core.Game;

namespace WebGameServer.Core.World;

public class ActiveBlockModifier
{
    public string Name { get; init; } = "";
    public int Interval { get; init; } = 1;
    public float Chance { get; init; } = 1.0f;
    public string? RequiredNeighbor { get; init; }
    public int MinY { get; init; } = -31000;
    public int MaxY { get; init; } = 31000;
    public Func<BlockDefinition, Vector3s, World, bool> Action { get; init; } = (_, _, _) => false;
}

public class ActiveBlockModifierSystem
{
    private readonly List<ActiveBlockModifier> _abms = new();
    private readonly Dictionary<ActiveBlockModifier, int> _lastRun = new();

    private static readonly (short Dx, short Dy, short Dz)[] NeighborOffsets =
    {
        (0, 1, 0), (0, -1, 0),
        (1, 0, 0), (-1, 0, 0),
        (0, 0, 1), (0, 0, -1)
    };

    public void Register(ActiveBlockModifier abm)
    {
        _abms.Add(abm);
        _lastRun[abm] = -abm.Interval;
    }

    public void Process(World world, int tickCount, BlockDefinitionManager blockDefs)
    {
        foreach (var abm in _abms)
        {
            if (tickCount - _lastRun[abm] < abm.Interval)
                continue;

            _lastRun[abm] = tickCount;

            var loadedChunks = world.GetLoadedChunks();
            for (int ci = 0; ci < loadedChunks.Count; ci++)
            {
                var chunkCoord = loadedChunks[ci];
                var chunk = world.GetChunkIfExists(chunkCoord);
                if (chunk == null) continue;

                for (int x = 0; x < Chunk.Size; x++)
                {
                    for (int y = 0; y < Chunk.Size; y++)
                    {
                        var worldY = chunkCoord.Y * Chunk.Size + y;
                        if (worldY < abm.MinY || worldY > abm.MaxY)
                            continue;

                        for (int z = 0; z < Chunk.Size; z++)
                        {
                            var block = chunk.GetBlock(x, y, z);
                            var blockDef = blockDefs.Get((ushort)block.Type);
                            if (blockDef == null) continue;

                            if (abm.RequiredNeighbor != null)
                            {
                                var worldX = chunkCoord.X * Chunk.Size + x;
                                var worldZ = chunkCoord.Z * Chunk.Size + z;
                                bool found = false;

                                for (int n = 0; n < NeighborOffsets.Length; n++)
                                {
                                    var neighborPos = new Vector3s(
                                        (short)(worldX + NeighborOffsets[n].Dx),
                                        (short)(worldY + NeighborOffsets[n].Dy),
                                        (short)(worldZ + NeighborOffsets[n].Dz));
                                    var neighborBlock = world.GetBlock(neighborPos);
                                    var neighborDef = blockDefs.Get((ushort)neighborBlock.Type);
                                    if (neighborDef?.Name == abm.RequiredNeighbor)
                                    {
                                        found = true;
                                        break;
                                    }
                                }

                                if (!found) continue;
                            }

                            if (Random.Shared.NextSingle() >= abm.Chance)
                                continue;

                            var worldPos = new Vector3s(
                                (short)(chunkCoord.X * Chunk.Size + x),
                                (short)(worldY),
                                (short)(chunkCoord.Z * Chunk.Size + z));
                            abm.Action(blockDef, worldPos, world);
                        }
                    }
                }
            }
        }
    }
}
