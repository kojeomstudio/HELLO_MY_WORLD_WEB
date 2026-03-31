using WebGameServer.Core.Game;
using BlockType = WebGameServer.Core.World.BlockType;

namespace WebGameServer.Core.World;

public class AgricultureSystem
{
    private readonly World _world;
    private readonly BlockDefinitionManager _blockDefs;

    public AgricultureSystem(World world, BlockDefinitionManager blockDefs)
    {
        _world = world;
        _blockDefs = blockDefs;
    }

    public bool PlantCrop(int x, int y, int z, BlockType cropType)
    {
        var belowPos = new Vector3s((short)x, (short)(y - 1), (short)z);
        var belowBlock = _world.GetBlock(belowPos);
        if (belowBlock.Type != BlockType.Farmland) return false;

        var pos = new Vector3s((short)x, (short)y, (short)z);
        var currentBlock = _world.GetBlock(pos);
        if (currentBlock.Type != BlockType.Air) return false;

        _world.SetBlock(pos, new Block(cropType, 0, 0, 0));
        return true;
    }

    public bool TryGrowCrop(int x, int y, int z, float dt)
    {
        var pos = new Vector3s((short)x, (short)y, (short)z);
        var block = _world.GetBlock(pos);

        float growTime;

        switch (block.Type)
        {
            case BlockType.WheatCrop:
                growTime = 60.0f;
                break;
            case BlockType.CarrotCrop:
                growTime = 45.0f;
                break;
            case BlockType.PotatoCrop:
                growTime = 45.0f;
                break;
            default:
                return false;
        }

        if (block.Param2 >= 7) return false;

        var hasWaterNearby = false;
        for (int dx = -4; dx <= 4 && !hasWaterNearby; dx++)
        {
            for (int dz = -4; dz <= 4 && !hasWaterNearby; dz++)
            {
                for (int dy = -1; dy <= 1 && !hasWaterNearby; dy++)
                {
                    var checkPos = new Vector3s((short)(x + dx), (short)(y + dy), (short)(z + dz));
                    var checkBlock = _world.GetBlock(checkPos);
                    if (checkBlock.Type is BlockType.Water or BlockType.WaterFlowing)
                        hasWaterNearby = true;
                }
            }
        }

        var growthChance = hasWaterNearby ? dt / growTime * 4f : dt / growTime;

        if (Random.Shared.NextSingle() < growthChance)
        {
            var newStage = (byte)Math.Min(7, block.Param2 + 1);
            _world.SetBlock(pos, new Block(block.Type, block.Param1, newStage, block.Light));
            return true;
        }

        return false;
    }

    public void GrowAllCrops(float dt)
    {
        var chunks = _world.GetLoadedChunks();
        foreach (var chunkCoord in chunks)
        {
            var chunk = _world.GetChunkIfExists(chunkCoord);
            if (chunk == null) continue;

            for (int x = 0; x < Chunk.Size; x++)
            {
                for (int y = 0; y < Chunk.Size; y++)
                {
                    for (int z = 0; z < Chunk.Size; z++)
                    {
                        var block = chunk.GetBlock(x, y, z);
                        if (block.Type is BlockType.WheatCrop or BlockType.CarrotCrop or BlockType.PotatoCrop)
                        {
                            var worldX = chunkCoord.X * Chunk.Size + x;
                            var worldY = chunkCoord.Y * Chunk.Size + y;
                            var worldZ = chunkCoord.Z * Chunk.Size + z;
                            TryGrowCrop(worldX, worldY, worldZ, dt);
                        }
                    }
                }
            }
        }
    }
}
