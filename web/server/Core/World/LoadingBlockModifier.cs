using WebGameServer.Core.Game;

namespace WebGameServer.Core.World;

public class LoadingBlockModifier
{
    public string Name { get; init; } = "";
    public string? TriggerBlockName { get; init; }
    public Func<BlockDefinition, Vector3s, World, bool> Action { get; init; } = (_, _, _) => false;
}

public class LoadingBlockModifierSystem
{
    private readonly List<LoadingBlockModifier> _lbms = new();
    private readonly HashSet<string> _processedChunks = new();

    public void Register(LoadingBlockModifier lbm)
    {
        _lbms.Add(lbm);
    }

    public void ProcessChunk(Chunk chunk, World world, BlockDefinitionManager blockDefs)
    {
        var coord = chunk.Coord;
        var chunkKey = $"{coord.X},{coord.Y},{coord.Z}";
        if (_processedChunks.Contains(chunkKey)) return;
        _processedChunks.Add(chunkKey);

        for (int x = 0; x < Chunk.Size; x++)
        {
            for (int y = 0; y < Chunk.Size; y++)
            {
                for (int z = 0; z < Chunk.Size; z++)
                {
                    var block = chunk.GetBlock(x, y, z);
                    var blockDef = blockDefs.Get((ushort)block.Type);
                    if (blockDef == null) continue;

                    foreach (var lbm in _lbms)
                    {
                        if (lbm.TriggerBlockName != null && blockDef.Name != lbm.TriggerBlockName)
                            continue;

                        var worldPos = new Vector3s(
                            (short)(coord.X * Chunk.Size + x),
                            (short)(coord.Y * Chunk.Size + y),
                            (short)(coord.Z * Chunk.Size + z));
                        lbm.Action(blockDef, worldPos, world);
                    }
                }
            }
        }
    }

    public void ClearProcessed()
    {
        _processedChunks.Clear();
    }
}
