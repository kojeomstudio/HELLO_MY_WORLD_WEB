using WebGameServer.Core.Game;

namespace WebGameServer.Core.World;

public class LightingSystem
{
    private readonly BlockDefinitionManager _blockDefinitions;

    public LightingSystem(BlockDefinitionManager blockDefinitions)
    {
        _blockDefinitions = blockDefinitions;
    }

    public void InitializeChunkLighting(World world, Chunk chunk)
    {
        LightingEngine.PropagateSunLight(world, chunk);
        LightingEngine.InitializeArtificialLightInChunk(world, chunk);
    }

    public void PropagateSunLight(World world, Chunk chunk)
    {
        LightingEngine.PropagateSunLight(world, chunk);
    }

    public void PropagateArtificialLight(World world, ChunkCoord coord, Vector3s position, int lightLevel)
    {
        LightingEngine.PropagateArtificialLight(world, coord, position, lightLevel);
    }

    public void RemoveLight(World world, Vector3s position)
    {
        LightingEngine.RemoveLight(world, position);
    }

    public byte CalculateLight(World world, Vector3s position)
    {
        return LightingEngine.CalculateLight(world, position);
    }

    public int GetBlockEmission(BlockType type)
    {
        var def = _blockDefinitions.Get((ushort)type);
        if (def != null && def.Light > 0)
        {
            return def.Light;
        }
        return LightingEngine.GetEmissionLevel(type);
    }

    public void OnBlockChanged(World world, Vector3s position, BlockType oldType, BlockType newType)
    {
        var oldEmission = GetBlockEmission(oldType);
        var newEmission = GetBlockEmission(newType);

        if (oldEmission > 0)
        {
            LightingEngine.RemoveLight(world, position);
        }

        var chunkCoord = ChunkCoord.FromBlockCoord(position);
        var chunk = world.GetChunkIfExists(chunkCoord);
        if (chunk != null)
        {
            LightingEngine.PropagateSunLight(world, chunk);
        }

        if (newEmission > 0)
        {
            LightingEngine.PropagateArtificialLight(world, chunkCoord, position, newEmission);
        }
        else if (oldEmission > 0 && newEmission == 0)
        {
            foreach (var (dx, dy, dz) in new (short, short, short)[]
            {
                (1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1)
            })
            {
                var nPos = new Vector3s(
                    (short)(position.X + dx),
                    (short)(position.Y + dy),
                    (short)(position.Z + dz));
                var nBlock = LightingEngine.GetBlockSafe(world, nPos);
                if (nBlock == null) continue;
                var emission = GetBlockEmission(nBlock.Type);
                if (emission > 0)
                {
                    var nCoord = ChunkCoord.FromBlockCoord(nPos);
                    LightingEngine.PropagateArtificialLight(world, nCoord, nPos, emission);
                }
            }
        }
    }
}
