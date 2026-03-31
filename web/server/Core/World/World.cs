using System.Collections.Concurrent;
using WebGameServer.Core.Game;

namespace WebGameServer.Core.World;

public class World
{
    private readonly ConcurrentDictionary<ChunkCoord, Chunk> _chunks = new();
    private readonly IWorldGenerator _generator;
    private readonly int _seed;
    private readonly ConcurrentQueue<(ChunkCoord ChunkCoord, Vector3s LocalPos)> _liquidUpdateQueue = new();

    public string Name { get; }
    public int Seed => _seed;
    public int AutoSaveInterval { get; set; } = 300;
    public DateTime LastSaveTime { get; set; } = DateTime.UtcNow;
    public bool NeedsSave { get; set; }
    private int _lastWaterUpdateTick;
    private int _lastLavaUpdateTick;

    public int WaterFlowInterval { get; set; } = 3;
    public int LavaFlowInterval { get; set; } = 5;

    private const byte MaxLiquidLevel = 8;

    private static readonly (short Dx, short Dz)[] HorizontalDirections =
    {
        (0, 1), (0, -1), (1, 0), (-1, 0)
    };

    public World(string name, int seed, IWorldGenerator generator)
    {
        Name = name;
        _seed = seed;
        _generator = generator;
        _generator.Initialize(seed);
    }

    public Chunk GetChunk(ChunkCoord coord)
    {
        return _chunks.GetOrAdd(coord, c =>
        {
            var chunk = new Chunk(c);
            GenerateChunk(chunk);
            LightingEngine.PropagateSunLight(this, chunk);
            LightingEngine.InitializeArtificialLightInChunk(this, chunk);

            var belowCoord = new ChunkCoord(c.X, c.Y - 1, c.Z);
            var belowChunk = GetChunkIfExists(belowCoord);
            if (belowChunk != null)
            {
                LightingEngine.PropagateSunLight(this, belowChunk);
            }

            return chunk;
        });
    }

    public Chunk? GetChunkIfExists(ChunkCoord coord)
    {
        return _chunks.TryGetValue(coord, out var chunk) ? chunk : null;
    }

    public Block GetBlock(Vector3s blockCoord)
    {
        var chunkCoord = ChunkCoord.FromBlockCoord(blockCoord);
        var chunk = GetChunk(chunkCoord);
        var localX = blockCoord.X & (Chunk.Size - 1);
        var localY = blockCoord.Y & (Chunk.Size - 1);
        var localZ = blockCoord.Z & (Chunk.Size - 1);
        return chunk.GetBlock(localX, localY, localZ);
    }

    public void SetBlock(Vector3s blockCoord, Block block)
    {
        var chunkCoord = ChunkCoord.FromBlockCoord(blockCoord);
        var chunk = GetChunk(chunkCoord);
        var localX = blockCoord.X & (Chunk.Size - 1);
        var localY = blockCoord.Y & (Chunk.Size - 1);
        var localZ = blockCoord.Z & (Chunk.Size - 1);

        var oldBlock = chunk.GetBlock(localX, localY, localZ);
        chunk.SetBlock(localX, localY, localZ, block);
        NeedsSave = true;

        LightingEngine.OnBlockChanged(this, blockCoord, oldBlock.Type, block.Type);
    }

    private void GenerateChunk(Chunk chunk)
    {
        var blocks = _generator.GenerateChunk(chunk.Coord.X, chunk.Coord.Y, chunk.Coord.Z);
        for (int x = 0; x < Chunk.Size; x++)
        {
            for (int y = 0; y < Chunk.Size; y++)
            {
                for (int z = 0; z < Chunk.Size; z++)
                {
                    chunk.SetBlock(x, y, z, new Block((BlockType)blocks[x, y, z], 0, 0, 0));
                }
            }
        }
    }

    public int GetGroundHeight(int x, int z)
    {
        return _generator.GetGroundHeight(x, z);
    }

    public List<ChunkCoord> GetLoadedChunks()
    {
        return _chunks.Keys.ToList();
    }

    public void QueueLiquidUpdate(ChunkCoord chunkCoord, Vector3s localPos)
    {
        _liquidUpdateQueue.Enqueue((chunkCoord, localPos));
    }

    public void UpdateLiquids(int tickCount)
    {
        if (tickCount - _lastWaterUpdateTick >= WaterFlowInterval)
        {
            _lastWaterUpdateTick = tickCount;
            ProcessLiquidFamily(BlockType.Water, BlockType.WaterFlowing);
        }

        if (tickCount - _lastLavaUpdateTick >= LavaFlowInterval)
        {
            _lastLavaUpdateTick = tickCount;
            ProcessLiquidFamily(BlockType.Lava, BlockType.LavaFlowing);
        }

        ProcessWaterLavaInteraction();
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

        foreach (var chunkCoord in _chunks.Keys)
        {
            var chunk = GetChunkIfExists(chunkCoord);
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
                        var belowBlock = GetBlock(belowPos);

                        if (belowBlock.Type == BlockType.Air)
                        {
                            var newLevel = level == MaxLiquidLevel
                                ? (byte)(MaxLiquidLevel - 1)
                                : (byte)Math.Max(1, level - 1);
                            SetBlock(belowPos, new Block(flowingType, 0, newLevel));
                            processed.Add((worldX, (short)(worldY - 1), worldZ));
                            continue;
                        }

                        if (belowBlock.Type == sourceType || belowBlock.Type == flowingType)
                        {
                            continue;
                        }

                        var shuffled = HorizontalDirections
                            .OrderBy(_ => Random.Shared.Next()).ToArray();

                        foreach (var (dx, dz) in shuffled)
                        {
                            var nx = (short)(worldX + dx);
                            var nz = (short)(worldZ + dz);

                            if (processed.Contains((nx, worldY, nz))) continue;

                            var neighborPos = new Vector3s(nx, worldY, nz);
                            var neighbor = GetBlock(neighborPos);

                            if (neighbor.Type == BlockType.Air && level > 1)
                            {
                                SetBlock(neighborPos, new Block(flowingType, 0, (byte)(level - 1)));
                                processed.Add((nx, worldY, nz));
                            }
                            else if (neighbor.Type == flowingType && neighbor.Param2 < level)
                            {
                                var avg = (byte)((level + neighbor.Param2) / 2);
                                SetBlock(neighborPos, new Block(flowingType, 0, avg));
                                processed.Add((nx, worldY, nz));
                            }
                        }
                    }
                }
            }
        }

        foreach (var pos in toRemove)
        {
            SetBlock(pos, Block.Air);
        }
    }

    private void ProcessWaterLavaInteraction()
    {
        var processed = new HashSet<(short X, short Y, short Z)>();

        foreach (var chunkCoord in _chunks.Keys)
        {
            var chunk = GetChunkIfExists(chunkCoord);
            if (chunk == null) continue;

            for (int x = 0; x < Chunk.Size; x++)
            {
                for (int y = 0; y < Chunk.Size; y++)
                {
                    for (int z = 0; z < Chunk.Size; z++)
                    {
                        var block = chunk.GetBlock(x, y, z);
                        if (!IsWater(block.Type)) continue;

                        var worldX = (short)(chunkCoord.X * Chunk.Size + x);
                        var worldY = (short)(chunkCoord.Y * Chunk.Size + y);
                        var worldZ = (short)(chunkCoord.Z * Chunk.Size + z);

                        if (processed.Contains((worldX, worldY, worldZ))) continue;

                        foreach (var (dx, dz) in HorizontalDirections)
                        {
                            var nx = (short)(worldX + dx);
                            var nz = (short)(worldZ + dz);

                            if (processed.Contains((nx, worldY, nz))) continue;

                            var neighborPos = new Vector3s(nx, worldY, nz);
                            var neighbor = GetBlock(neighborPos);

                            if (neighbor.Type is BlockType.Lava or BlockType.LavaFlowing)
                            {
                                var resultType = (block.Type == BlockType.Water && neighbor.Type == BlockType.Lava)
                                    ? BlockType.Obsidian
                                    : BlockType.Cobblestone;

                                SetBlock(neighborPos, new Block(resultType));
                                SetBlock(new Vector3s(worldX, worldY, worldZ), Block.Air);
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

    public void Save(string directory)
    {
        WorldPersistence.SaveWorld(this, directory);
        NeedsSave = false;
        LastSaveTime = DateTime.UtcNow;
    }

    public void Load(string directory)
    {
        WorldPersistence.LoadWorld(this, directory);
        NeedsSave = false;
        LastSaveTime = DateTime.UtcNow;
    }

    public List<(Vector3s From, Vector3s To, BlockType Type)> GetPendingFallingBlocks(BlockDefinitionManager blockDefs)
    {
        var results = new List<(Vector3s From, Vector3s To, BlockType Type)>();
        var processed = new HashSet<(short X, short Y, short Z)>();

        foreach (var chunkCoord in _chunks.Keys)
        {
            var chunk = GetChunkIfExists(chunkCoord);
            if (chunk == null) continue;

            for (int x = 0; x < Chunk.Size; x++)
            {
                for (int y = 0; y < Chunk.Size; y++)
                {
                    for (int z = 0; z < Chunk.Size; z++)
                    {
                        var block = chunk.GetBlock(x, y, z);
                        var blockData = block.ToUInt16();
                        if (blockData == 0) continue;

                        var def = blockDefs.Get(blockData);
                        if (def == null || !def.Falling) continue;

                        var worldX = (short)(chunkCoord.X * Chunk.Size + x);
                        var worldY = (short)(chunkCoord.Y * Chunk.Size + y);
                        var worldZ = (short)(chunkCoord.Z * Chunk.Size + z);

                        if (processed.Contains((worldX, worldY, worldZ))) continue;

                        var belowPos = new Vector3s(worldX, (short)(worldY - 1), worldZ);
                        var belowBlock = GetBlock(belowPos);
                        var belowData = belowBlock.ToUInt16();

                        if (belowData == 0)
                        {
                            results.Add((new Vector3s(worldX, worldY, worldZ), belowPos, block.Type));
                            processed.Add((worldX, worldY, worldZ));
                            processed.Add((worldX, (short)(worldY - 1), worldZ));
                        }
                        else
                        {
                            var belowDef = blockDefs.Get(belowData);
                            if (belowDef != null && belowDef.Liquid)
                            {
                                results.Add((new Vector3s(worldX, worldY, worldZ), belowPos, block.Type));
                                processed.Add((worldX, worldY, worldZ));
                                processed.Add((worldX, (short)(worldY - 1), worldZ));
                            }
                        }
                    }
                }
            }
        }

        return results;
    }
}
