using BlockType = WebGameServer.Core.World.BlockType;
using WorldMap = WebGameServer.Core.World.World;
using WebGameServer.Core.World;

namespace WebGameServer.Core.Entities;

public static class BiomeDetector
{
    public static BiomeType Detect(WorldMap world, int x, int groundY, int z)
    {
        var surfaceBlock = world.GetBlock(new Vector3s((short)x, (short)groundY, (short)z));
        if (surfaceBlock == null) return BiomeType.Unknown;

        return surfaceBlock.Type switch
        {
            BlockType.DesertSand => BiomeType.Desert,
            BlockType.Sand => ClassifySandBiome(world, x, groundY, z),
            BlockType.Snow or BlockType.SnowLayer or BlockType.Ice => BiomeType.Snow,
            BlockType.DirtWithSnow => BiomeType.Taiga,
            BlockType.JungleGrass or BlockType.JungleWood or BlockType.JungleLeaves => BiomeType.Jungle,
            BlockType.Stone when groundY >= 40 => BiomeType.Mountains,
            BlockType.Grass => ClassifyGrassBiome(world, x, groundY, z),
            BlockType.Dirt => BiomeType.Grassland,
            _ => BiomeType.Unknown
        };
    }

    private static BiomeType ClassifySandBiome(WorldMap world, int x, int groundY, int z)
    {
        for (var dx = -2; dx <= 2; dx++)
        {
            for (var dz = -2; dz <= 2; dz++)
            {
                var block = world.GetBlock(new Vector3s((short)(x + dx), (short)(groundY + 1), (short)(z + dz)));
                if (block != null && (block.Type == BlockType.Water || block.Type == BlockType.RiverWater))
                {
                    return BiomeType.Ocean;
                }
            }
        }
        return BiomeType.Desert;
    }

    private static BiomeType ClassifyGrassBiome(WorldMap world, int x, int groundY, int z)
    {
        var jungleBlocks = 0;
        var treeBlocks = 0;
        var waterNearby = false;

        for (var dx = -2; dx <= 2; dx++)
        {
            for (var dz = -2; dz <= 2; dz++)
            {
                for (var dy = 1; dy <= 4; dy++)
                {
                    var block = world.GetBlock(new Vector3s((short)(x + dx), (short)(groundY + dy), (short)(z + dz)));
                    if (block == null) continue;

                    switch (block.Type)
                    {
                        case BlockType.JungleWood or BlockType.JungleLeaves:
                            jungleBlocks++;
                            break;
                        case BlockType.Wood or BlockType.Leaves:
                            treeBlocks++;
                            break;
                        case BlockType.Water or BlockType.RiverWater:
                            waterNearby = true;
                            break;
                    }
                }
            }
        }

        if (jungleBlocks > 1) return BiomeType.Jungle;
        if (waterNearby && treeBlocks > 0) return BiomeType.Swamp;
        if (treeBlocks > 2) return BiomeType.Forest;

        var hash = ((x * 73856093) ^ (z * 19349663)) & 0xFFFF;
        return hash < 0x8000 ? BiomeType.Grassland : BiomeType.Savanna;
    }
}
