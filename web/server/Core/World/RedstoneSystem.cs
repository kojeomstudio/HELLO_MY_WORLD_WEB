using WebGameServer.Core;

namespace WebGameServer.Core.World;

public class RedstoneSystem
{
    private const int MaxPower = 15;

    private static readonly (short Dx, short Dy, short Dz)[] Directions =
    {
        (1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1)
    };

    private static readonly (short Dx, short Dz)[] HorizontalDirections =
    {
        (1, 0), (-1, 0), (0, 1), (0, -1)
    };

    private static (short Dx, short Dz) GetFacingOffset(int facing)
    {
        return facing switch
        {
            0 => (0, 1),
            1 => (0, -1),
            2 => (-1, 0),
            3 => (1, 0),
            _ => (0, 1)
        };
    }

    private static (short Dx, short Dz) GetBackOffset(int facing)
    {
        var (dx, dz) = GetFacingOffset(facing);
        return ((short)-dx, (short)-dz);
    }

    private static List<(short Dx, short Dz)> GetSideOffsets(int facing)
    {
        var (fdx, fdz) = GetFacingOffset(facing);
        var sides = new List<(short Dx, short Dz)>();
        foreach (var (dx, dz) in HorizontalDirections)
        {
            if (dx == fdx && dz == fdz) continue;
            if (dx == -fdx && dz == -fdz) continue;
            sides.Add((dx, dz));
        }
        return sides;
    }

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
        UpdateRepeatersAndComparators(world, powerMap);
    }

    private void UpdateRepeatersAndComparators(World world, Dictionary<Vector3s, int> powerMap)
    {
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

                        if (block.Type == BlockType.RedstoneRepeater)
                        {
                            ProcessRepeater(world, pos, block, powerMap);
                        }
                        else if (block.Type == BlockType.RedstoneComparator)
                        {
                            ProcessComparator(world, pos, block, powerMap);
                        }
                    }
                }
            }
        }
    }

    private void ProcessRepeater(World world, Vector3s pos, Block block, Dictionary<Vector3s, int> powerMap)
    {
        var facing = block.Param1 % 4;
        var back = GetBackOffset(facing);
        var front = GetFacingOffset(facing);
        var backPos = new Vector3s((short)(pos.X + back.Dx), pos.Y, (short)(pos.Z + back.Dz));
        var frontPos = new Vector3s((short)(pos.X + front.Dx), pos.Y, (short)(pos.Z + front.Dz));

        var backPower = 0;
        if (powerMap.TryGetValue(backPos, out var wirePower) && wirePower > 0)
        {
            backPower = wirePower;
        }
        var backBlock = world.GetBlock(backPos);
        var backSourcePower = GetSourcePower(backBlock);
        if (backSourcePower > backPower)
        {
            backPower = backSourcePower;
        }

        var delay = (block.Param2 & 0x3) + 1;
        var isPowered = (block.Param2 & 0x8) != 0;

        if (backPower > 0 && !isPowered)
        {
            var newParam2 = (byte)((block.Param2 & 0x3) | 0x8);
            world.SetBlock(pos, new Block(BlockType.RedstoneRepeater, block.Param1, newParam2, (byte)7));
            powerMap[frontPos] = MaxPower;
        }
        else if (backPower == 0 && isPowered)
        {
            var newParam2 = (byte)(block.Param2 & 0x3);
            world.SetBlock(pos, new Block(BlockType.RedstoneRepeater, block.Param1, newParam2, 0));
            powerMap.Remove(frontPos);
        }
        else if (isPowered)
        {
            powerMap[frontPos] = MaxPower;
        }
    }

    private void ProcessComparator(World world, Vector3s pos, Block block, Dictionary<Vector3s, int> powerMap)
    {
        var facing = block.Param1 % 4;
        var back = GetBackOffset(facing);
        var front = GetFacingOffset(facing);
        var sides = GetSideOffsets(facing);

        var backPos = new Vector3s((short)(pos.X + back.Dx), pos.Y, (short)(pos.Z + back.Dz));
        var frontPos = new Vector3s((short)(pos.X + front.Dx), pos.Y, (short)(pos.Z + front.Dz));

        var backPower = 0;
        if (powerMap.TryGetValue(backPos, out var wirePower) && wirePower > 0)
        {
            backPower = wirePower;
        }
        var backBlock = world.GetBlock(backPos);
        var backSourcePower = GetSourcePower(backBlock);
        if (backSourcePower > backPower)
        {
            backPower = backSourcePower;
        }

        var maxSidePower = 0;
        foreach (var side in sides)
        {
            var sidePos = new Vector3s((short)(pos.X + side.Dx), pos.Y, (short)(pos.Z + side.Dz));
            if (powerMap.TryGetValue(sidePos, out var sideWirePower) && sideWirePower > maxSidePower)
            {
                maxSidePower = sideWirePower;
            }
            var sideBlock = world.GetBlock(sidePos);
            var sideSourcePower = GetSourcePower(sideBlock);
            if (sideSourcePower > maxSidePower)
            {
                maxSidePower = sideSourcePower;
            }
        }

        var outputPower = Math.Max(backPower, maxSidePower);
        var isSubtractMode = (block.Param2 & 0x4) != 0;

        if (isSubtractMode)
        {
            outputPower = Math.Max(backPower - maxSidePower, 0);
        }

        var isCurrentlyPowered = (block.Param2 & 0x8) != 0;

        if (outputPower > 0 && !isCurrentlyPowered)
        {
            var newParam2 = (byte)(block.Param2 | 0x8);
            world.SetBlock(pos, new Block(BlockType.RedstoneComparator, block.Param1, newParam2, 0));
            if (!powerMap.TryGetValue(frontPos, out var existing) || outputPower > existing)
            {
                powerMap[frontPos] = outputPower;
            }
        }
        else if (outputPower == 0 && isCurrentlyPowered)
        {
            var newParam2 = (byte)(block.Param2 & ~0x8);
            world.SetBlock(pos, new Block(BlockType.RedstoneComparator, block.Param1, newParam2, 0));
            powerMap.Remove(frontPos);
        }
        else if (outputPower > 0 && isCurrentlyPowered)
        {
            if (!powerMap.TryGetValue(frontPos, out var existing) || outputPower > existing)
            {
                powerMap[frontPos] = outputPower;
            }
        }
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
                                ProcessPistonExtend(world, pos, block);
                                toUpdate.Add((pos, BlockType.Piston));
                                break;
                            case BlockType.Piston when !powered && (block.Param2 & 1) == 1:
                                ProcessPistonRetract(world, pos, block);
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

    private const int MaxPushDistance = 12;

    private static readonly HashSet<BlockType> UnpushableBlocks = new()
    {
        BlockType.Obsidian,
        BlockType.Bedrock,
        BlockType.Chest,
        BlockType.Furnace
    };

    private void ProcessPistonExtend(World world, Vector3s pos, Block block)
    {
        var facing = block.Param1 % 4;
        var (fdx, fdz) = GetFacingOffset(facing);

        var pushChain = new List<Vector3s>();
        var checkPos = new Vector3s((short)(pos.X + fdx), pos.Y, (short)(pos.Z + fdz));

        for (int i = 0; i < MaxPushDistance; i++)
        {
            var checkBlock = world.GetBlock(checkPos);
            if (checkBlock.Type == BlockType.Air)
            {
                break;
            }
            if (UnpushableBlocks.Contains(checkBlock.Type))
            {
                return;
            }
            pushChain.Add(checkPos);
            checkPos = new Vector3s((short)(checkPos.X + fdx), checkPos.Y, (short)(checkPos.Z + fdz));
        }

        for (int i = pushChain.Count - 1; i >= 0; i--)
        {
            var fromPos = pushChain[i];
            var toPos = new Vector3s((short)(fromPos.X + fdx), fromPos.Y, (short)(fromPos.Z + fdz));
            var fromBlock = world.GetBlock(fromPos);
            world.SetBlock(toPos, new Block(fromBlock.Type, fromBlock.Param1, fromBlock.Param2, fromBlock.Light));
        }

        var armPos = new Vector3s((short)(pos.X + fdx), pos.Y, (short)(pos.Z + fdz));
        world.SetBlock(armPos, new Block(BlockType.Piston, block.Param1, 1, 0));
    }

    private void ProcessPistonRetract(World world, Vector3s pos, Block block)
    {
        var facing = block.Param1 % 4;
        var (fdx, fdz) = GetFacingOffset(facing);
        var armPos = new Vector3s((short)(pos.X + fdx), pos.Y, (short)(pos.Z + fdz));
        var armBlock = world.GetBlock(armPos);

        if (armBlock.Type == BlockType.Piston)
        {
            world.SetBlock(armPos, Block.Air);
        }
    }
}
