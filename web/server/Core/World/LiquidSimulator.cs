using WebGameServer.Core.Game;

namespace WebGameServer.Core.World;

public class LiquidSimulator
{
    private const byte MaxLiquidLevel = 8;

    private static readonly (short Dx, short Dz)[] HorizontalDirections =
    {
        (0, 1), (0, -1), (1, 0), (-1, 0)
    };

    private readonly World _world;

    public int WaterFlowInterval { get; set; } = 3;
    public int LavaFlowInterval { get; set; } = 5;

    private int _lastWaterUpdateTick;
    private int _lastLavaUpdateTick;

    public LiquidSimulator(World world)
    {
        _world = world;
    }

    public void Update(int tickCount)
    {
        if (tickCount - _lastWaterUpdateTick >= WaterFlowInterval)
        {
            _lastWaterUpdateTick = tickCount;
            ProcessLiquidFamily(BlockType.Water, BlockType.WaterFlowing);
            CheckInfiniteSources(BlockType.Water, BlockType.WaterFlowing);
        }

        if (tickCount - _lastLavaUpdateTick >= LavaFlowInterval)
        {
            _lastLavaUpdateTick = tickCount;
            ProcessLiquidFamily(BlockType.Lava, BlockType.LavaFlowing);
        }

        ProcessLiquidInteractions();
    }

    private static byte GetLiquidLevel(Block block)
    {
        return block.Type is BlockType.Water or BlockType.Lava ? MaxLiquidLevel : block.Param2;
    }

    private static bool IsWater(BlockType type) => type is BlockType.Water or BlockType.WaterFlowing;
    private static bool IsLava(BlockType type) => type is BlockType.Lava or BlockType.LavaFlowing;

    private void ProcessLiquidFamily(BlockType sourceType, BlockType flowingType)
    {
        var processed = new HashSet<(short X, short Y, short Z)>();
        var toRemove = new List<Vector3s>();
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
                        if (block.Type != sourceType && block.Type != flowingType) continue;

                        var worldX = (short)(chunkCoord.X * Chunk.Size + x);
                        var worldY = (short)(chunkCoord.Y * Chunk.Size + y);
                        var worldZ = (short)(chunkCoord.Z * Chunk.Size + z);

                        if (processed.Contains((worldX, worldY, worldZ))) continue;
                        processed.Add((worldX, worldY, worldZ));

                        var level = GetLiquidLevel(block);

                        if (level == 0)
                        {
                            toRemove.Add(new Vector3s(worldX, worldY, worldZ));
                            continue;
                        }

                        var belowPos = new Vector3s(worldX, (short)(worldY - 1), worldZ);
                        var belowBlock = _world.GetBlock(belowPos);

                        if (belowBlock.Type == BlockType.Air)
                        {
                            var newLevel = level == MaxLiquidLevel
                                ? (byte)(MaxLiquidLevel - 1)
                                : (byte)Math.Max(1, level - 1);
                            _world.SetBlock(belowPos, new Block(flowingType, 0, newLevel));
                            processed.Add((worldX, (short)(worldY - 1), worldZ));
                            continue;
                        }

                        if (belowBlock.Type == sourceType || belowBlock.Type == flowingType)
                        {
                            continue;
                        }

                        FlowHorizontally(worldX, worldY, worldZ, level, flowingType, processed);
                    }
                }
            }
        }

        foreach (var pos in toRemove)
        {
            _world.SetBlock(pos, Block.Air);
        }
    }

    private void FlowHorizontally(short worldX, short worldY, short worldZ, byte level, BlockType flowingType, HashSet<(short, short, short)> processed)
    {
        var shuffled = HorizontalDirections
            .OrderBy(_ => Random.Shared.Next()).ToArray();

        foreach (var (dx, dz) in shuffled)
        {
            var nx = (short)(worldX + dx);
            var nz = (short)(worldZ + dz);

            if (processed.Contains((nx, worldY, nz))) continue;

            var neighborPos = new Vector3s(nx, worldY, nz);
            var neighbor = _world.GetBlock(neighborPos);

            if (neighbor.Type == BlockType.Air && level > 1)
            {
                _world.SetBlock(neighborPos, new Block(flowingType, 0, (byte)(level - 1)));
                processed.Add((nx, worldY, nz));
            }
            else if (neighbor.Type == flowingType && neighbor.Param2 < level - 1)
            {
                var newLevel = (byte)(level - 1);
                _world.SetBlock(neighborPos, new Block(flowingType, 0, newLevel));
                processed.Add((nx, worldY, nz));
            }
        }
    }

    private void CheckInfiniteSources(BlockType sourceType, BlockType flowingType)
    {
        var chunks = _world.GetLoadedChunks();
        var sources = new List<Vector3s>();

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
                        if (block.Type != flowingType) continue;
                        if (block.Param2 < MaxLiquidLevel - 1) continue;

                        var worldX = (short)(chunkCoord.X * Chunk.Size + x);
                        var worldY = (short)(chunkCoord.Y * Chunk.Size + y);
                        var worldZ = (short)(chunkCoord.Z * Chunk.Size + z);

                        var sourceCount = 0;
                        foreach (var (dx, dz) in HorizontalDirections)
                        {
                            var neighborPos = new Vector3s((short)(worldX + dx), worldY, (short)(worldZ + dz));
                            var neighbor = _world.GetBlock(neighborPos);
                            if (neighbor.Type == sourceType)
                                sourceCount++;
                        }

                        if (sourceCount >= 2)
                        {
                            sources.Add(new Vector3s(worldX, worldY, worldZ));
                        }
                    }
                }
            }
        }

        foreach (var pos in sources)
        {
            _world.SetBlock(pos, new Block(sourceType, 0, 0));
        }
    }

    private void ProcessLiquidInteractions()
    {
        var processed = new HashSet<(short X, short Y, short Z)>();
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
                        if (!IsWater(block.Type) && !IsLava(block.Type)) continue;

                        var worldX = (short)(chunkCoord.X * Chunk.Size + x);
                        var worldY = (short)(chunkCoord.Y * Chunk.Size + y);
                        var worldZ = (short)(chunkCoord.Z * Chunk.Size + z);

                        if (processed.Contains((worldX, worldY, worldZ))) continue;

                        var isWater = IsWater(block.Type);
                        var targetLava = isWater;

                        foreach (var (dx, dy, dz) in GetInteractionDirections())
                        {
                            var nx = (short)(worldX + dx);
                            var ny = (short)(worldY + dy);
                            var nz = (short)(worldZ + dz);

                            if (processed.Contains((nx, ny, nz))) continue;

                            var neighborPos = new Vector3s(nx, ny, nz);
                            var neighbor = _world.GetBlock(neighborPos);

                            if (isWater && IsLava(neighbor.Type))
                            {
                                var resultType = (block.Type == BlockType.Water && neighbor.Type == BlockType.Lava)
                                    ? BlockType.Obsidian
                                    : BlockType.Cobblestone;

                                _world.SetBlock(neighborPos, new Block(resultType));
                                _world.SetBlock(new Vector3s(worldX, worldY, worldZ), Block.Air);
                                processed.Add((worldX, worldY, worldZ));
                                processed.Add((nx, ny, nz));
                                break;
                            }

                            if (!isWater && IsWater(neighbor.Type))
                            {
                                var resultType = (block.Type == BlockType.Lava && neighbor.Type == BlockType.Water)
                                    ? BlockType.Obsidian
                                    : BlockType.Stone;

                                _world.SetBlock(new Vector3s(worldX, worldY, worldZ), new Block(resultType));
                                _world.SetBlock(neighborPos, Block.Air);
                                processed.Add((worldX, worldY, worldZ));
                                processed.Add((nx, ny, nz));
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    private static (short dx, short dy, short dz)[] GetInteractionDirections()
    {
        return new (short, short, short)[]
        {
            (1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1)
        };
    }
}
