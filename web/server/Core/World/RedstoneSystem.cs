using WebGameServer.Core;

namespace WebGameServer.Core.World;

public class RedstoneSystem
{
    private const int MaxPower = 15;

    private static readonly (short Dx, short Dy, short Dz)[] Directions =
    {
        (1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1)
    };

    public void Update(World world)
    {
        var powerMap = new Dictionary<Vector3s, int>();
        var sourcePositions = new List<(Vector3s Pos, int Power)>();

        foreach (var chunkCoord in world.GetLoadedChunks())
        {
            var chunk = world.GetChunkIfExists(chunkCoord);
            if (chunk == null) continue;

            for (int x = 0; x < Chunk.Size; x++)
            {
                for (int y = 0; y < Chunk.Size; y++)
                {
                    for (int z = 0; z < Chunk.Size; z++)
                    {
                        var block = chunk.GetBlock(x, y, z);
                        if (block.Type == BlockType.RedstoneWire)
                        {
                            var worldX = (short)(chunkCoord.X * Chunk.Size + x);
                            var worldY = (short)(chunkCoord.Y * Chunk.Size + y);
                            var worldZ = (short)(chunkCoord.Z * Chunk.Size + z);
                            powerMap[new Vector3s(worldX, worldY, worldZ)] = 0;
                        }
                    }
                }
            }
        }

        foreach (var chunkCoord in world.GetLoadedChunks())
        {
            var chunk = world.GetChunkIfExists(chunkCoord);
            if (chunk == null) continue;

            for (int x = 0; x < Chunk.Size; x++)
            {
                for (int y = 0; y < Chunk.Size; y++)
                {
                    for (int z = 0; z < Chunk.Size; z++)
                    {
                        var block = chunk.GetBlock(x, y, z);
                        var power = GetSourcePower(block);
                        if (power <= 0) continue;

                        var worldX = (short)(chunkCoord.X * Chunk.Size + x);
                        var worldY = (short)(chunkCoord.Y * Chunk.Size + y);
                        var worldZ = (short)(chunkCoord.Z * Chunk.Size + z);
                        sourcePositions.Add((new Vector3s(worldX, worldY, worldZ), power));
                    }
                }
            }
        }

        foreach (var (sourcePos, power) in sourcePositions)
        {
            PropagatePower(world, sourcePos, power, powerMap);
        }

        foreach (var kvp in powerMap)
        {
            var block = world.GetBlock(kvp.Key);
            if (block.Type == BlockType.RedstoneWire && block.Param2 != kvp.Value)
            {
                world.SetBlock(kvp.Key, new Block(BlockType.RedstoneWire, block.Param1, (byte)kvp.Value, block.Light));
            }
        }

        ToggleConsumers(world, powerMap);
    }

    private void PropagatePower(World world, Vector3s source, int initialPower, Dictionary<Vector3s, int> powerMap)
    {
        var queue = new Queue<(Vector3s Pos, int Power)>();
        queue.Enqueue((source, initialPower));

        while (queue.Count > 0)
        {
            var (pos, power) = queue.Dequeue();

            if (power <= 0) continue;

            foreach (var (dx, dy, dz) in Directions)
            {
                var neighborPos = new Vector3s((short)(pos.X + dx), (short)(pos.Y + dy), (short)(pos.Z + dz));
                var neighborBlock = world.GetBlock(neighborPos);

                if (neighborBlock.Type == BlockType.RedstoneWire)
                {
                    var newPower = power - 1;
                    if (newPower > 0 && (!powerMap.TryGetValue(neighborPos, out var existing) || newPower > existing))
                    {
                        powerMap[neighborPos] = newPower;
                        queue.Enqueue((neighborPos, newPower));
                    }
                }
            }
        }
    }

    private void ToggleConsumers(World world, Dictionary<Vector3s, int> powerMap)
    {
        var toUpdate = new List<(Vector3s Pos, BlockType NewType)>();

        foreach (var chunkCoord in world.GetLoadedChunks())
        {
            var chunk = world.GetChunkIfExists(chunkCoord);
            if (chunk == null) continue;

            for (int x = 0; x < Chunk.Size; x++)
            {
                for (int y = 0; y < Chunk.Size; y++)
                {
                    for (int z = 0; z < Chunk.Size; z++)
                    {
                        var block = chunk.GetBlock(x, y, z);
                        var worldX = (short)(chunkCoord.X * Chunk.Size + x);
                        var worldY = (short)(chunkCoord.Y * Chunk.Size + y);
                        var worldZ = (short)(chunkCoord.Z * Chunk.Size + z);
                        var pos = new Vector3s(worldX, worldY, worldZ);

                        var powered = IsPowered(world, pos, powerMap);

                        switch (block.Type)
                        {
                            case BlockType.RedstoneLamp when powered:
                                toUpdate.Add((pos, BlockType.RedstoneLampOn));
                                break;
                            case BlockType.RedstoneLampOn when !powered:
                                toUpdate.Add((pos, BlockType.RedstoneLamp));
                                break;
                            case BlockType.Piston when powered && (block.Param2 & 1) == 0:
                                toUpdate.Add((pos, BlockType.Piston));
                                break;
                        }
                    }
                }
            }
        }

        foreach (var (pos, newType) in toUpdate)
        {
            var oldBlock = world.GetBlock(pos);
            if (newType == BlockType.Piston)
            {
                world.SetBlock(pos, new Block(BlockType.Piston, oldBlock.Param1, (byte)(oldBlock.Param2 | 1), oldBlock.Light));
            }
            else
            {
                world.SetBlock(pos, new Block(newType, oldBlock.Param1, oldBlock.Param2, oldBlock.Light));
            }
        }
    }

    private bool IsPowered(World world, Vector3s pos, Dictionary<Vector3s, int> powerMap)
    {
        foreach (var (dx, dy, dz) in Directions)
        {
            var neighborPos = new Vector3s((short)(pos.X + dx), (short)(pos.Y + dy), (short)(pos.Z + dz));
            if (powerMap.TryGetValue(neighborPos, out var power) && power > 0)
            {
                return true;
            }

            var neighbor = world.GetBlock(neighborPos);
            if (GetSourcePower(neighbor) > 0)
            {
                return true;
            }
        }

        return false;
    }

    private static int GetSourcePower(Block block)
    {
        return block.Type switch
        {
            BlockType.RedstoneBlock => MaxPower,
            BlockType.RedstoneTorch => MaxPower,
            BlockType.Lever when (block.Param2 & 1) == 1 => MaxPower,
            BlockType.Button when (block.Param2 & 1) == 1 => MaxPower,
            BlockType.PressurePlate when (block.Param2 & 1) == 1 => MaxPower,
            _ => 0
        };
    }
}
