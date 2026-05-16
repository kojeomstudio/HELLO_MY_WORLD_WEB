using WebGameServer.Core.Game;

namespace WebGameServer.Core.World;

public class ActiveBlockModifier
{
    public string Name { get; init; } = "";
    public int Interval { get; init; } = 1;
    public float Chance { get; init; } = 1.0f;
    public string[] NodeNames { get; init; } = Array.Empty<string>();
    public string[] WithoutNeighbors { get; init; } = Array.Empty<string>();
    public string? RequiredNeighbor { get; init; }
    public int MinY { get; init; } = -31000;
    public int MaxY { get; init; } = 31000;
    public int ActiveBlockRange { get; init; } = 3;
    public bool CatchUp { get; init; } = false;
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

    public void Process(World world, int tickCount, BlockDefinitionManager blockDefs, IEnumerable<Vector3> playerPositions)
    {
        var playerChunks = new HashSet<ChunkCoord>();
        foreach (var pos in playerPositions)
        {
            var cx = (int)Math.Floor(pos.X / Chunk.Size);
            var cy = (int)Math.Floor(pos.Y / Chunk.Size);
            var cz = (int)Math.Floor(pos.Z / Chunk.Size);
            var range = 3;

            for (int dx = -range; dx <= range; dx++)
            {
                for (int dy = -range; dy <= range; dy++)
                {
                    for (int dz = -range; dz <= range; dz++)
                    {
                        playerChunks.Add(new ChunkCoord(cx + dx, cy + dy, cz + dz));
                    }
                }
            }
        }

        if (playerChunks.Count == 0) return;

        foreach (var abm in _abms)
        {
            if (tickCount - _lastRun[abm] < abm.Interval)
                continue;

            _lastRun[abm] = tickCount;

            foreach (var chunkCoord in playerChunks)
            {
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

                            if (abm.NodeNames.Length > 0)
                            {
                                var match = false;
                                for (int n = 0; n < abm.NodeNames.Length; n++)
                                {
                                    if (blockDef.Name == abm.NodeNames[n])
                                    {
                                        match = true;
                                        break;
                                    }
                                }
                                if (!match) continue;
                            }

                            var worldX = chunkCoord.X * Chunk.Size + x;
                            var worldZ = chunkCoord.Z * Chunk.Size + z;

                            if (abm.WithoutNeighbors.Length > 0)
                            {
                                var hasExcluded = false;
                                for (int n = 0; n < NeighborOffsets.Length && !hasExcluded; n++)
                                {
                                    var nPos = new Vector3s(
                                        (short)(worldX + NeighborOffsets[n].Dx),
                                        (short)(worldY + NeighborOffsets[n].Dy),
                                        (short)(worldZ + NeighborOffsets[n].Dz));
                                    var nBlock = world.GetBlock(nPos);
                                    var nDef = blockDefs.Get((ushort)nBlock.Type);
                                    if (nDef == null) continue;
                                    for (int w = 0; w < abm.WithoutNeighbors.Length; w++)
                                    {
                                        if (nDef.Name == abm.WithoutNeighbors[w])
                                        {
                                            hasExcluded = true;
                                            break;
                                        }
                                    }
                                }
                                if (hasExcluded) continue;
                            }

                            if (abm.RequiredNeighbor != null)
                            {
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
                                (short)(worldX),
                                (short)(worldY),
                                (short)(worldZ));
                            abm.Action(blockDef, worldPos, world);
                        }
                    }
                }
            }
        }
    }
}
