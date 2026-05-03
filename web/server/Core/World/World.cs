using System.Collections.Concurrent;
using WebGameServer.Core.Game;
using PlayerEnt = WebGameServer.Core.Player.Player;
using ItemStack = WebGameServer.Core.Player.ItemStack;

namespace WebGameServer.Core.World;

public class World
{
    private readonly ConcurrentDictionary<ChunkCoord, Chunk> _chunks = new();
    private readonly ConcurrentQueue<(int X, int Y, int Z, List<ItemStack> Loot)> _pendingDungeonChests = new();
    private readonly IWorldGenerator _generator;
    private readonly int _seed;
    private readonly ConcurrentQueue<(ChunkCoord ChunkCoord, Vector3s LocalPos)> _liquidUpdateQueue = new();
    private readonly BlockDefinitionManager? _blockDefs;
    private readonly Dictionary<Vector3s, byte> _flowDistances = new();

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

    public World(string name, int seed, IWorldGenerator generator, BlockDefinitionManager? blockDefs = null)
    {
        Name = name;
        _seed = seed;
        _generator = generator;
        _generator.Initialize(seed);
        _blockDefs = blockDefs;
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

            foreach (var chest in _generator.PopPendingDungeonChests())
            {
                _pendingDungeonChests.Enqueue((chest.X, chest.Y, chest.Z, chest.Loot));
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

    public List<(int X, int Y, int Z, List<ItemStack> Loot)> PopPendingDungeonChests()
    {
        var results = new List<(int X, int Y, int Z, List<ItemStack> Loot)>();
        while (_pendingDungeonChests.TryDequeue(out var chest))
        {
            results.Add(chest);
        }
        return results;
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
        var waterViscosity = _blockDefs?.Get((ushort)BlockType.Water)?.LiquidViscosity ?? 1;
        var lavaViscosity = _blockDefs?.Get((ushort)BlockType.Lava)?.LiquidViscosity ?? 7;
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
        return block.Type is BlockType.Water or BlockType.Lava or BlockType.RiverWater ? MaxLiquidLevel : block.Param2;
    }

    private static bool IsWater(BlockType type) => type is BlockType.Water or BlockType.WaterFlowing or BlockType.RiverWater or BlockType.RiverWaterFlowing;
    private static bool IsLava(BlockType type) => type is BlockType.Lava or BlockType.LavaFlowing;

    private void ProcessLiquidFamily(BlockType sourceType, BlockType flowingType)
    {
        var processed = new HashSet<(short X, short Y, short Z)>();
        var toRemove = new List<Vector3s>();
        var flowRange = _blockDefs?.Get((ushort)sourceType)?.LiquidRange ?? 7;

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
                            _flowDistances.Remove(new Vector3s(worldX, worldY, worldZ));
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
                            _flowDistances[belowPos] = 1;
                            continue;
                        }

                        if (belowBlock.Type == sourceType || belowBlock.Type == flowingType)
                        {
                            continue;
                        }

                        var currentPos = new Vector3s(worldX, worldY, worldZ);
                        var currentDist = _flowDistances.TryGetValue(currentPos, out var cd) ? cd : (byte)0;

                        if (currentDist >= 8) continue;

                        var shuffled = HorizontalDirections
                            .OrderBy(_ => Random.Shared.Next()).ToArray();

                        foreach (var (dx, dz) in shuffled)
                        {
                            var nx = (short)(worldX + dx);
                            var nz = (short)(worldZ + dz);

                            if (processed.Contains((nx, worldY, nz))) continue;

                            var neighborPos = new Vector3s(nx, worldY, nz);
                            var neighbor = GetBlock(neighborPos);
                            var newDist = (byte)(currentDist + 1);

                            if (newDist > flowRange) continue;

                            if (neighbor.Type == BlockType.Air && level > 1)
                            {
                                SetBlock(neighborPos, new Block(flowingType, 0, (byte)(level - 1)));
                                processed.Add((nx, worldY, nz));
                                _flowDistances[neighborPos] = newDist;
                            }
                            else if (neighbor.Type == flowingType && neighbor.Param2 < level)
                            {
                                var avg = (byte)((level + neighbor.Param2) / 2);
                                SetBlock(neighborPos, new Block(flowingType, 0, avg));
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
                            var neighbor = GetBlock(neighborPos);

                            if (isWater && neighbor.Type is BlockType.Lava or BlockType.LavaFlowing)
                            {
                                var resultType = isWaterSource && neighbor.Type == BlockType.Lava
                                    ? BlockType.Obsidian
                                    : BlockType.Cobblestone;

                                SetBlock(neighborPos, new Block(resultType));
                                SetBlock(new Vector3s(worldX, worldY, worldZ), Block.Air);
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

                                SetBlock(new Vector3s(worldX, worldY, worldZ), new Block(resultType));
                                SetBlock(neighborPos, Block.Air);
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

    public void UnloadDistantChunks(Dictionary<string, PlayerEnt> players, int maxChunkDistance)
    {
        var playerChunkPositions = new List<(int X, int Z)>();
        foreach (var player in players.Values)
        {
            var cx = (int)Math.Floor(player.Position.X / Chunk.Size);
            var cz = (int)Math.Floor(player.Position.Z / Chunk.Size);
            playerChunkPositions.Add((cx, cz));
        }

        var chunksToUnload = new List<ChunkCoord>();
        foreach (var kvp in _chunks)
        {
            var coord = kvp.Key;
            var isNearPlayer = false;
            foreach (var (pcx, pcz) in playerChunkPositions)
            {
                if (Math.Abs(coord.X - pcx) <= maxChunkDistance + 2 && Math.Abs(coord.Z - pcz) <= maxChunkDistance + 2)
                {
                    isNearPlayer = true;
                    break;
                }
            }
            if (!isNearPlayer && coord.Y >= 0 && coord.Y <= 3)
            {
                chunksToUnload.Add(coord);
            }
        }

        foreach (var coord in chunksToUnload)
        {
            _chunks.TryRemove(coord, out _);
        }
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
                        var blockData = (ushort)block.Type;
                        if (blockData == 0) continue;

                        var def = blockDefs.Get(blockData);
                        if (def == null || !def.Falling) continue;

                        var worldX = (short)(chunkCoord.X * Chunk.Size + x);
                        var worldY = (short)(chunkCoord.Y * Chunk.Size + y);
                        var worldZ = (short)(chunkCoord.Z * Chunk.Size + z);

                        if (processed.Contains((worldX, worldY, worldZ))) continue;

                        var belowPos = new Vector3s(worldX, (short)(worldY - 1), worldZ);
                        var belowBlock = GetBlock(belowPos);
                        var belowData = (ushort)belowBlock.Type;

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
