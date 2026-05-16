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
    private readonly BlockDefinitionManager _blockDefs;
    private readonly Dictionary<Vector3s, byte> _flowDistances = new();
    private int _lastWaterUpdateTick;
    private int _lastLavaUpdateTick;

    public LiquidSimulator(World world, BlockDefinitionManager blockDefs)
    {
        _world = world;
        _blockDefs = blockDefs;
    }

    public void Update(int tickCount)
    {
        var waterViscosity = _blockDefs.Get((ushort)BlockType.Water)?.LiquidViscosity ?? 1;
        var lavaViscosity = _blockDefs.Get((ushort)BlockType.Lava)?.LiquidViscosity ?? 7;
        var waterInterval = Math.Max(1, waterViscosity * 3);
        var lavaInterval = Math.Max(1, lavaViscosity * 3);

        if (tickCount - _lastWaterUpdateTick >= waterInterval)
        {
            _lastWaterUpdateTick = tickCount;
            ProcessLiquidFamily(BlockType.Water, BlockType.WaterFlowing);
            ProcessLiquidFamily(BlockType.RiverWater, BlockType.RiverWaterFlowing);
        }

        if (tickCount - _lastLavaUpdateTick >= lavaInterval)
        {
            _lastLavaUpdateTick = tickCount;
            ProcessLiquidFamily(BlockType.Lava, BlockType.LavaFlowing);
        }

        ProcessWaterLavaInteraction();

        if (_flowDistances.Count > 10000)
        {
            _flowDistances.Clear();
        }
    }

    private static byte GetLiquidLevel(Block block)
    {
        return block.Type is BlockType.Water or BlockType.Lava or BlockType.RiverWater
            ? MaxLiquidLevel
            : block.Param2;
    }

    private static bool IsWater(BlockType type) =>
        type is BlockType.Water or BlockType.WaterFlowing or BlockType.RiverWater or BlockType.RiverWaterFlowing;

    private static bool IsLava(BlockType type) =>
        type is BlockType.Lava or BlockType.LavaFlowing;

    private void ProcessLiquidFamily(BlockType sourceType, BlockType flowingType)
    {
        var processed = new HashSet<(short X, short Y, short Z)>();
        var toRemove = new List<Vector3s>();
        var flowRange = _blockDefs.Get((ushort)sourceType)?.LiquidRange ?? 7;

        foreach (var chunkCoord in _world.GetLoadedChunks())
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
                            _flowDistances.Remove(new Vector3s(worldX, worldY, worldZ));
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
                            _flowDistances[belowPos] = 1;
                            continue;
                        }

                        if (belowBlock.Type == sourceType || belowBlock.Type == flowingType)
                        {
                            continue;
                        }

                        if (block.Type == flowingType && TryRegenerateSource(worldX, worldY, worldZ, sourceType, flowingType))
                        {
                            continue;
                        }

                        var currentPos = new Vector3s(worldX, worldY, worldZ);
                        var currentDist = _flowDistances.TryGetValue(currentPos, out var cd) ? cd : (byte)0;

                        if (currentDist >= flowRange) continue;

                        var shuffled = HorizontalDirections
                            .OrderBy(_ => Random.Shared.Next()).ToArray();

                        foreach (var (dx, dz) in shuffled)
                        {
                            var nx = (short)(worldX + dx);
                            var nz = (short)(worldZ + dz);

                            if (processed.Contains((nx, worldY, nz))) continue;

                            var neighborPos = new Vector3s(nx, worldY, nz);
                            var neighbor = _world.GetBlock(neighborPos);
                            var newDist = (byte)(currentDist + 1);

                            if (newDist > flowRange) continue;

                            if (neighbor.Type == BlockType.Air && level > 1)
                            {
                                _world.SetBlock(neighborPos, new Block(flowingType, 0, (byte)(level - 1)));
                                processed.Add((nx, worldY, nz));
                                _flowDistances[neighborPos] = newDist;
                            }
                            else if (neighbor.Type == flowingType && neighbor.Param2 < level)
                            {
                                var avg = (byte)((level + neighbor.Param2) / 2);
                                _world.SetBlock(neighborPos, new Block(flowingType, 0, avg));
                                processed.Add((nx, worldY, nz));
                                if (newDist < (_flowDistances.TryGetValue(neighborPos, out var ed) ? ed : byte.MaxValue))
                                {
                                    _flowDistances[neighborPos] = newDist;
                                }
                            }
                        }
                    }
                }
            }
        }

        foreach (var pos in toRemove)
        {
            _world.SetBlock(pos, Block.Air);
        }
    }

    private bool TryRegenerateSource(short wx, short wy, short wz, BlockType sourceType, BlockType flowingType)
    {
        var belowPos = new Vector3s(wx, (short)(wy - 1), wz);
        var belowBlock = _world.GetBlock(belowPos);
        if (belowBlock.Type == sourceType || belowBlock.Type == flowingType || belowBlock.Type == BlockType.Air)
            return false;

        int sourceOrFlowingNeighborCount = 0;
        foreach (var (dx, dz) in HorizontalDirections)
        {
            var neighborPos = new Vector3s((short)(wx + dx), wy, (short)(wz + dz));
            var neighbor = _world.GetBlock(neighborPos);
            if (neighbor.Type == sourceType || (neighbor.Type == flowingType && neighbor.Param2 >= MaxLiquidLevel - 1))
            {
                sourceOrFlowingNeighborCount++;
            }
        }

        if (sourceOrFlowingNeighborCount >= 2)
        {
            _world.SetBlock(new Vector3s(wx, wy, wz), new Block(sourceType));
            return true;
        }

        return false;
    }

    private void ProcessWaterLavaInteraction()
    {
        var processed = new HashSet<(short X, short Y, short Z)>();

        foreach (var chunkCoord in _world.GetLoadedChunks())
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
                        var isWaterSource = block.Type is BlockType.Water or BlockType.RiverWater;

                        foreach (var (dx, dz) in HorizontalDirections)
                        {
                            var nx = (short)(worldX + dx);
                            var nz = (short)(worldZ + dz);

                            if (processed.Contains((nx, worldY, nz))) continue;

                            var neighborPos = new Vector3s(nx, worldY, nz);
                            var neighbor = _world.GetBlock(neighborPos);

                            if (isWater && neighbor.Type is BlockType.Lava or BlockType.LavaFlowing)
                            {
                                var resultType = isWaterSource && neighbor.Type == BlockType.Lava
                                    ? BlockType.Obsidian
                                    : BlockType.Cobblestone;

                                _world.SetBlock(neighborPos, new Block(resultType));
                                _world.SetBlock(new Vector3s(worldX, worldY, worldZ), Block.Air);
                                _flowDistances.Remove(new Vector3s(worldX, worldY, worldZ));
                                _flowDistances.Remove(neighborPos);
                                processed.Add((worldX, worldY, worldZ));
                                processed.Add((nx, worldY, nz));
                                break;
                            }

                            if (!isWater && neighbor.Type is BlockType.Water or BlockType.WaterFlowing or BlockType.RiverWater or BlockType.RiverWaterFlowing)
                            {
                                var isNeighborSource = neighbor.Type is BlockType.Water or BlockType.RiverWater;
                                var resultType = block.Type == BlockType.Lava && isNeighborSource
                                    ? BlockType.Obsidian
                                    : BlockType.Stone;

                                _world.SetBlock(new Vector3s(worldX, worldY, worldZ), new Block(resultType));
                                _world.SetBlock(neighborPos, Block.Air);
                                _flowDistances.Remove(new Vector3s(worldX, worldY, worldZ));
                                _flowDistances.Remove(neighborPos);
                                processed.Add((worldX, worldY, worldZ));
                                processed.Add((nx, worldY, nz));
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
}
