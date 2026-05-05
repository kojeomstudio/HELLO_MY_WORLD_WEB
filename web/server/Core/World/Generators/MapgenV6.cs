using System.Collections.Concurrent;
using System.Text.Json;
using WebGameServer.Core.World;
using ItemStack = WebGameServer.Core.Player.ItemStack;

namespace WebGameServer.Core.World.Generators;

public class MapgenV6 : IWorldGenerator
{
    public string Name => "v6";

    private int _seed;
    private PerlinNoise _noise = null!;
    private readonly ConcurrentBag<DungeonChestData> _pendingDungeonChests = new();

    [Flags]
    private enum V6Flags
    {
        Jungles = 0x01,
        BiomeBlend = 0x02,
        MudFlow = 0x04,
        SnowBiomes = 0x08,
        Flat = 0x10,
        Trees = 0x20,
        Temples = 0x40
    }

    private const V6Flags DefaultFlags = V6Flags.Jungles | V6Flags.BiomeBlend | V6Flags.MudFlow |
                                          V6Flags.SnowBiomes | V6Flags.Trees | V6Flags.Temples;

    private V6Flags _flags = DefaultFlags;

    private enum BiomeV6Type
    {
        Normal,
        Desert,
        Jungle,
        Tundra,
        Taiga
    }

    private const int MapBlockSize = 16;
    private const int WaterLevel = 1;
    private const int AverageMudAmount = 4;
    private const int DesertStoneBase = -32;

    private const float FreqHot = 0.4f;
    private const float FreqSnow = -0.4f;
    private const float FreqTaiga = 0.5f;
    private const float FreqJungle = 0.5f;
    private const float FreqDesert = 0.45f;
    private const float FreqBeach = 0.15f;

    private record DungeonChestData(int X, int Y, int Z, List<ItemStack> Loot);

    private readonly NoiseParams _npTerrainBase = new(-4f, 20f, 250f, 250f, 250f, 82341, 5, 0.6f, 2f);
    private readonly NoiseParams _npTerrainHigher = new(20f, 16f, 500f, 500f, 500f, 85039, 5, 0.6f, 2f);
    private readonly NoiseParams _npSteepness = new(0.85f, 0.5f, 125f, 125f, 125f, -932, 5, 0.7f, 2f);
    private readonly NoiseParams _npHeightSelect = new(0f, 1f, 250f, 250f, 250f, 4213, 5, 0.69f, 2f);
    private readonly NoiseParams _npMud = new(4f, 2f, 200f, 200f, 200f, 91013, 3, 0.55f, 2f);
    private readonly NoiseParams _npBeach = new(0f, 1f, 250f, 250f, 250f, 59420, 3, 0.5f, 2f);
    private readonly NoiseParams _npBiome = new(0f, 1f, 500f, 500f, 500f, 9130, 3, 0.5f, 2f);
    private readonly NoiseParams _npCave = new(6f, 6f, 250f, 250f, 250f, 34329, 3, 0.5f, 2f);
    private readonly NoiseParams _npHumidity = new(0.5f, 0.5f, 500f, 500f, 500f, 72384, 3, 0.5f, 2f);
    private readonly NoiseParams _npTrees = new(0f, 1f, 125f, 125f, 125f, 2, 4, 0.66f, 2f);
    private readonly NoiseParams _npAppleTrees = new(0f, 1f, 100f, 100f, 100f, 342902, 3, 0.45f, 2f);
    private readonly NoiseParams _npDungeons = new(0.9f, 0.5f, 500f, 500f, 500f, 0, 2, 0.8f, 2f);

    private record TreeSchematic(
        string Name, string TrunkBlock, string LeavesBlock,
        int MinHeight, int MaxHeight, string CanopyShape,
        int CanopyBaseOffset, int CanopyTopOffset, int CanopyRadius,
        string[] Biomes);

    private readonly List<TreeSchematic> _treeSchematics = new();

    public void Initialize(int seed)
    {
        _seed = seed;
        _noise = new PerlinNoise(seed);
    }

    public void LoadBiomes(string dataPath)
    {
        var schematicsPath = Path.Combine(dataPath, "tree_schematics.json");
        if (File.Exists(schematicsPath))
        {
            var json = File.ReadAllText(schematicsPath);
            using var doc = JsonDocument.Parse(json);
            if (doc.RootElement.TryGetProperty("schematics", out var schemEl))
            {
                foreach (var s in schemEl.EnumerateArray())
                {
                    var biomeList = new List<string>();
                    if (s.TryGetProperty("biomes", out var bEl))
                    {
                        foreach (var b in bEl.EnumerateArray())
                            biomeList.Add(b.GetString() ?? "");
                    }

                    _treeSchematics.Add(new TreeSchematic(
                        s.GetProperty("name").GetString() ?? "",
                        s.GetProperty("trunkBlock").GetString() ?? "wood",
                        s.GetProperty("leavesBlock").GetString() ?? "leaves",
                        s.GetProperty("minHeight").GetInt32(),
                        s.GetProperty("maxHeight").GetInt32(),
                        s.GetProperty("canopyShape").GetString() ?? "sphere",
                        s.GetProperty("canopyBaseOffset").GetInt32(),
                        s.GetProperty("canopyTopOffset").GetInt32(),
                        s.GetProperty("canopyRadius").GetInt32(),
                        biomeList.ToArray()
                    ));
                }
            }
        }

        if (_treeSchematics.Count == 0)
        {
            _treeSchematics.Add(new TreeSchematic("oak_tree", "wood", "leaves", 4, 6, "sphere", -1, 3, 2, new[] { "normal", "grassland", "forest" }));
            _treeSchematics.Add(new TreeSchematic("pine_tree", "pine_wood", "pine_needles", 5, 8, "cone", -2, 0, 2, new[] { "taiga", "snow" }));
            _treeSchematics.Add(new TreeSchematic("jungle_tree", "jungle_wood", "jungle_leaves", 6, 10, "sphere", -2, 4, 3, new[] { "jungle" }));
        }
    }

    public ushort[,,] GenerateChunk(int chunkX, int chunkY, int chunkZ)
    {
        var blocks = new ushort[Chunk.Size, Chunk.Size, Chunk.Size];
        var baseX = chunkX * Chunk.Size;
        var baseY = chunkY * Chunk.Size;
        var baseZ = chunkZ * Chunk.Size;

        var heightMap = new int[Chunk.Size, Chunk.Size];
        var biomeMap = new BiomeV6Type[Chunk.Size, Chunk.Size];

        for (int x = 0; x < Chunk.Size; x++)
        {
            for (int z = 0; z < Chunk.Size; z++)
            {
                var worldX = baseX + x;
                var worldZ = baseZ + z;

                var terrainLevel = BaseTerrainLevel(worldX + 0.5f, worldZ + 0.5f);
                var surfaceY = (int)(terrainLevel + AverageMudAmount);

                heightMap[x, z] = surfaceY;
                biomeMap[x, z] = GetBiome(worldX, worldZ);

                for (int y = 0; y < Chunk.Size; y++)
                {
                    var worldY = baseY + y;
                    blocks[x, y, z] = GenerateGroundNode(worldX, worldY, worldZ, (float)surfaceY, biomeMap[x, z]);
                }
            }
        }

        AddMud(blocks, baseX, baseY, baseZ, heightMap, biomeMap);

        GenerateCaves(blocks, baseX, baseY, baseZ, heightMap);

        if (_flags.HasFlag(V6Flags.MudFlow))
        {
            FlowMud(blocks, baseX, baseY, baseZ, heightMap, biomeMap);
        }

        if (baseY < 40 && baseY >= -20)
        {
            GenerateDungeons(blocks, baseX, baseY, baseZ, heightMap, biomeMap);
        }

        GrowGrass(blocks, baseX, baseY, baseZ, heightMap, biomeMap);

        if (_flags.HasFlag(V6Flags.Trees))
        {
            PlaceTrees(blocks, baseX, baseY, baseZ, heightMap, biomeMap);
        }

        return blocks;
    }

    private float BaseTerrainLevel(float x, float z)
    {
        if (_flags.HasFlag(V6Flags.Flat))
            return WaterLevel;

        var terrainBase = _noise.Noise2DEx(_npTerrainBase, x, z);
        var terrainHigher = _noise.Noise2DEx(_npTerrainHigher, x, z);
        var steepness = _noise.Noise2DEx(_npSteepness, x, z);
        var heightSelect = _noise.Noise2DEx(_npHeightSelect, x, z);

        var baseVal = 1f + terrainBase;
        var higher = 1f + terrainHigher;

        if (higher < baseVal)
            higher = baseVal;

        var b = Math.Clamp(steepness, 0f, 1000f);
        b = 5f * b * b * b * b * b * b * b;
        b = Math.Clamp(b, 0.5f, 1000f);

        if (b > 1.5f && b < 100f)
            b = b < 10f ? 1.5f : 100f;

        var a = 0.5f + b * (-0.2f + heightSelect);
        a = Math.Clamp(a, 0f, 1f);

        return baseVal * (1f - a) + higher * a;
    }

    private BiomeV6Type GetBiome(int x, int z)
    {
        var d = _noise.Noise2DEx(_npBiome, x + 0.6f, z + 0.2f);
        var h = _noise.Noise2DEx(_npHumidity, x, z);

        if (_flags.HasFlag(V6Flags.SnowBiomes))
        {
            float blend = 0f;
            if (_flags.HasFlag(V6Flags.BiomeBlend))
                blend = IntegerNoise2D(x, z) / 40f;

            if (d > FreqHot + blend)
            {
                return h > FreqJungle + blend ? BiomeV6Type.Jungle : BiomeV6Type.Desert;
            }

            if (d < FreqSnow + blend)
            {
                return h > FreqTaiga + blend ? BiomeV6Type.Taiga : BiomeV6Type.Tundra;
            }

            return BiomeV6Type.Normal;
        }

        if (d > FreqDesert)
            return BiomeV6Type.Desert;

        if (_flags.HasFlag(V6Flags.BiomeBlend) && d > FreqDesert - 0.1f)
        {
            var blendNoise = (IntegerNoise2D(x, z) + 1f);
            if (blendNoise > (FreqDesert - d) * 20f)
                return BiomeV6Type.Desert;
        }

        if (_flags.HasFlag(V6Flags.Jungles) && h > 0.75f)
            return BiomeV6Type.Jungle;

        return BiomeV6Type.Normal;
    }

    private float IntegerNoise2D(int x, int y)
    {
        const uint MagicX = 1619;
        const uint MagicY = 31337;
        const uint MagicSeed = 1013;

        uint n = (uint)((MagicX * x + MagicY * y + MagicSeed * _seed) & 0x7FFFFFFF);
        n = (n >> 13) ^ n;
        n = (n * (n * n * 60493 + 19990303) + 1376312589) & 0x7FFFFFFF;
        return 1f - (float)(int)n / 0x40000000;
    }

    private ushort GenerateGroundNode(int x, int y, int z, float surfaceYFloat, BiomeV6Type biome)
    {
        var surfaceY = (int)surfaceYFloat;
        if (y == 0) return (ushort)BlockType.Bedrock;
        if (y < 0) return (ushort)BlockType.Air;

        if (y > surfaceY)
        {
            if (y <= WaterLevel)
            {
                if (biome == BiomeV6Type.Tundra && y >= 0)
                    return (ushort)BlockType.Ice;
                return (ushort)BlockType.Water;
            }
            return (ushort)BlockType.Air;
        }

        if (biome == BiomeV6Type.Desert)
        {
            if (y >= DesertStoneBase)
                return (ushort)BlockType.DesertStone;
            return (ushort)BlockType.Stone;
        }

        return (ushort)BlockType.Stone;
    }

    private void AddMud(ushort[,,] blocks, int baseX, int baseY, int baseZ,
        int[,] heightMap, BiomeV6Type[,] biomeMap)
    {
        for (int x = 0; x < Chunk.Size; x++)
        {
            for (int z = 0; z < Chunk.Size; z++)
            {
                var worldX = baseX + x;
                var worldZ = baseZ + z;
                var surfaceY = heightMap[x, z];
                var biome = biomeMap[x, z];

                var mudAmount = (int)(_noise.Noise2DEx(_npMud, worldX + 0.5f, worldZ + 0.5f) / 2f + 0.5f);

                if (biome == BiomeV6Type.Desert || biome == BiomeV6Type.Tundra)
                {
                    if (surfaceY > 20)
                        mudAmount = Math.Max(0, mudAmount - (surfaceY - 20) / 5);
                }

                var beachNoise = _noise.Noise2DEx(_npBeach, worldX + 0.2f, worldZ + 0.7f);
                var hasBeach = beachNoise > (1f - FreqBeach);

                for (int m = 0; m < mudAmount; m++)
                {
                    var worldY = surfaceY - m;
                    var localY = worldY - baseY;
                    if (localY < 0 || localY >= Chunk.Size) continue;

                    ushort mudBlock;
                    if (biome == BiomeV6Type.Desert)
                    {
                        if (surfaceY + m <= WaterLevel + 1)
                            mudBlock = (ushort)BlockType.Sand;
                        else if (mudAmount <= 0)
                            mudBlock = (ushort)BlockType.Gravel;
                        else
                            mudBlock = (ushort)BlockType.DesertSand;
                    }
                    else
                    {
                        if (mudAmount <= 0)
                            mudBlock = (ushort)BlockType.Gravel;
                        else if (hasBeach && surfaceY + m <= WaterLevel + 2)
                            mudBlock = (ushort)BlockType.Sand;
                        else
                            mudBlock = (ushort)BlockType.Dirt;
                    }

                    blocks[x, localY, z] = mudBlock;
                }
            }
        }
    }

    private void FlowMud(ushort[,,] blocks, int baseX, int baseY, int baseZ,
        int[,] heightMap, BiomeV6Type[,] biomeMap)
    {
        for (int pass = 0; pass < 2; pass++)
        {
            for (int x = 1; x < Chunk.Size - 1; x++)
            {
                for (int z = 1; z < Chunk.Size - 1; z++)
                {
                    int iterX = pass == 1 ? Chunk.Size - 1 - x : x;
                    int iterZ = pass == 1 ? Chunk.Size - 1 - z : z;

                    for (int y = Chunk.Size - 1; y >= 1; y--)
                    {
                        var block = blocks[iterX, y, iterZ];
                        if (block != (ushort)BlockType.Dirt &&
                            block != (ushort)BlockType.Grass &&
                            block != (ushort)BlockType.Gravel)
                            continue;

                    if (block == (ushort)BlockType.Grass)
                        blocks[iterX, y, iterZ] = (ushort)BlockType.Dirt;
                        if (y > 0 && IsSolid(blocks[iterX, y - 1, iterZ]))
                            continue;

                        if (y + 1 < Chunk.Size && IsSolid(blocks[iterX, y + 1, iterZ]))
                            continue;

                        int[][] dirs = { new[] { 0, 1 }, new[] { 1, 0 }, new[] { 0, -1 }, new[] { -1, 0 } };
                        foreach (var dir in dirs)
                        {
                            var nx = iterX + dir[0];
                            var nz = iterZ + dir[1];
                            if (nx < 0 || nx >= Chunk.Size || nz < 0 || nz >= Chunk.Size) continue;
                            if (IsSolid(blocks[nx, y, nz])) continue;

                            var fallY = y;
                            while (fallY > 0 && !IsSolid(blocks[nx, fallY - 1, nz]))
                                fallY--;

                            if (fallY < y)
                            {
                                blocks[nx, fallY, nz] = block;
                                blocks[iterX, y, iterZ] = (ushort)BlockType.Air;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    private void GenerateCaves(ushort[,,] blocks, int baseX, int baseY, int baseZ, int[,] heightMap)
    {
        var caveAmount = _noise.Noise2DEx(_npCave, baseX, baseZ);
        caveAmount = Math.Max(0f, caveAmount);
        var volume = Chunk.Size * Chunk.Size * MapBlockSize;
        var cavesCount = (int)(caveAmount * volume / 50000f);

        var blockSeed = (uint)((long)baseX * 38839137 ^ (long)baseY * 5760967 ^ (long)baseZ * 5174933);
        var ps = new PcgRandom(blockSeed + 21343);
        var ps2 = new PcgRandom(blockSeed + 1032);

        var bruisesCount = 1;
        if (ps.NextInt(1, 7) == 1)
            bruisesCount = ps.NextInt(0, ps.NextInt(0, 3));

        var biome = GetBiome(baseX + 8, baseZ + 8);
        if (biome == BiomeV6Type.Desert)
        {
            cavesCount /= 3;
            bruisesCount /= 3;
        }

        for (int i = 0; i < cavesCount + bruisesCount; i++)
        {
            var isLarge = i >= cavesCount;
            MakeCaveV6(blocks, baseX, baseY, baseZ, heightMap, ps, ps2, isLarge);
        }
    }

    private void MakeCaveV6(ushort[,,] blocks, int baseX, int baseY, int baseZ,
        int[,] heightMap, PcgRandom ps, PcgRandom ps2, bool isLarge)
    {
        var minDiam = isLarge ? 5 : 2;
        var maxDiam = isLarge ? ps.NextInt(7, ps.NextInt(8, 25)) : ps.NextInt(2, 7);
        var partMaxLen = ps.NextInt(2, isLarge ? 5 : 10);
        var routePoints = ps.NextInt(5, ps.NextInt(15, 31));
        var dswitchint = ps.NextInt(1, 15);

        var startX = ps.NextFloat() * Chunk.Size;
        var startY = ps.NextFloat() * Chunk.Size;
        var startZ = ps.NextFloat() * Chunk.Size;

        float mainDirX = 0, mainDirY = 0, mainDirZ = 0;

        var orpX = startX;
        var orpY = startY;
        var orpZ = startZ;

        for (int j = 0; j < routePoints; j++)
        {
            var rs = ps.NextInt(minDiam, maxDiam + 1);

            if (j % dswitchint == 0 && !isLarge)
            {
                mainDirX = (ps.NextFloat() * 2f - 1f) * (ps.NextInt(0, 11) / 10f);
                mainDirY = (ps.NextFloat() * 0.66f - 0.33f) * (ps.NextInt(0, 11) / 10f);
                mainDirZ = (ps.NextFloat() * 2f - 1f) * (ps.NextInt(0, 11) / 10f);
            }

            var vecX = mainDirX * partMaxLen + ps.NextFloat() * 2f - 1f;
            var vecY = mainDirY * partMaxLen + ps.NextFloat() * 2f - 1f;
            var vecZ = mainDirZ * partMaxLen + ps.NextFloat() * 2f - 1f;

            if (!isLarge && ps.NextInt(0, 13) == 0)
                vecY = -Math.Abs(vecY) * 2f;

            var rpX = orpX + vecX;
            var rpY = Math.Clamp(orpY + vecY, 0, Chunk.Size - 1);
            var rpZ = orpZ + vecZ;

            rpX = Math.Clamp(rpX, rs, Chunk.Size - rs - 1);
            rpZ = Math.Clamp(rpZ, rs, Chunk.Size - rs - 1);

            var steps = (int)Math.Max(1, Math.Ceiling(Math.Sqrt(vecX * vecX + vecY * vecY + vecZ * vecZ)));
            var stepX = (rpX - orpX) / steps;
            var stepY = (rpY - orpY) / steps;
            var stepZ = (rpZ - orpZ) / steps;

            for (int s = 0; s < steps; s++)
            {
                var cx = (int)(orpX + stepX * s + ps.NextInt(-10, 11) * 0.1f);
                var cy = (int)(orpY + stepY * s);
                var cz = (int)(orpZ + stepZ * s + ps.NextInt(-10, 11) * 0.1f);

                CarveTunnel(blocks, cx, cy, cz, rs, isLarge, baseY);
            }

            orpX = rpX;
            orpY = rpY;
            orpZ = rpZ;
        }
    }

    private void CarveTunnel(ushort[,,] blocks, int cx, int cy, int cz, int rs, bool isLarge, int baseY)
    {
        for (int z0 = -rs / 2; z0 <= rs / 2; z0++)
        {
            var si = rs / 2 - Math.Max(0, Math.Abs(z0) - rs / 7 - 1);
            for (int x0 = -si; x0 <= si; x0++)
            {
                var si2 = rs / 2 - Math.Max(0, Math.Max(Math.Abs(x0), Math.Abs(z0)) - rs / 7 - 1);
                for (int y0 = -si2; y0 <= si2; y0++)
                {
                    if (isLarge && rs > 7 && Math.Abs(y0) >= rs / 3)
                        continue;

                    var lx = cx + x0;
                    var ly = cy + y0;
                    var lz = cz + z0;

                    if (lx < 0 || lx >= Chunk.Size || ly < 0 || ly >= Chunk.Size || lz < 0 || lz >= Chunk.Size)
                        continue;

                    var block = blocks[lx, ly, lz];
                    if (block == (ushort)BlockType.Bedrock ||
                        block == (ushort)BlockType.Air ||
                        block == (ushort)BlockType.Water)
                        continue;

                    if (isGroundContent(block))
                    {
                        var worldY = baseY + ly;
                        if (isLarge && worldY <= WaterLevel)
                            blocks[lx, ly, lz] = (ushort)BlockType.Water;
                        else
                            blocks[lx, ly, lz] = (ushort)BlockType.Air;
                    }
                }
            }
        }
    }

    private void GenerateDungeons(ushort[,,] blocks, int baseX, int baseY, int baseZ,
        int[,] heightMap, BiomeV6Type[,] biomeMap)
    {
        var rng = new PcgRandom((uint)((long)baseX * 73856093 ^ (long)baseZ * 19349663 ^ (long)baseY * 83492791));

        var dungeonNoise = _noise.Noise3DEx(_npDungeons, baseX, baseY, baseZ);
        var numDungeons = Math.Max(0, (int)MathF.Floor(dungeonNoise));
        if (numDungeons == 0) return;

        var cornerBiome = biomeMap[0, 0];
        var isTemple = _flags.HasFlag(V6Flags.Temples) && cornerBiome == BiomeV6Type.Desert;

        var numRooms = rng.NextInt(2, isTemple ? 8 : 5);
        var startCX = rng.NextInt(4, Chunk.Size - 4);
        var startCY = rng.NextInt(2, Chunk.Size / 2 - 2);
        var startCZ = rng.NextInt(4, Chunk.Size - 4);

        if (blocks[startCX, startCY, startCZ] == (ushort)BlockType.Air) return;

        ushort wallBlock = isTemple ? (ushort)BlockType.DesertStone : (ushort)BlockType.Cobblestone;
        ushort altWallBlock = isTemple ? (ushort)BlockType.DesertStone : (ushort)BlockType.MossyCobblestone;

        var curX = startCX;
        var curY = startCY;
        var curZ = startCZ;
        var placedChest = false;

        for (int room = 0; room < numRooms; room++)
        {
            var isLarge = room == 0 || rng.NextFloat() < 0.3f;
            var roomW = isLarge ? rng.NextInt(6, isTemple ? 11 : 9) : rng.NextInt(3, 6);
            var roomH = rng.NextInt(3, 5);
            var roomD = isLarge ? rng.NextInt(6, isTemple ? 11 : 9) : rng.NextInt(3, 6);

            if (curX + roomW >= Chunk.Size || curY + roomH >= Chunk.Size || curZ + roomD >= Chunk.Size)
                break;

            for (int dx = 0; dx < roomW; dx++)
            {
                for (int dy = 0; dy < roomH; dy++)
                {
                    for (int dz = 0; dz < roomD; dz++)
                    {
                        var lx = curX + dx;
                        var ly = curY + dy;
                        var lz = curZ + dz;

                        if (dx == 0 || dx == roomW - 1 || dy == 0 || dy == roomH - 1 || dz == 0 || dz == roomD - 1)
                        {
                            blocks[lx, ly, lz] = rng.NextFloat() > 0.7f ? altWallBlock : wallBlock;
                        }
                        else
                        {
                            blocks[lx, ly, lz] = (ushort)BlockType.Air;
                        }
                    }
                }
            }

            if (!placedChest && room > 0 && rng.NextFloat() < 0.4f)
            {
                var chestX = curX + roomW / 2;
                var chestZ = curZ + roomD / 2;
                if (chestX > 0 && chestX < Chunk.Size - 1 && chestZ > 0 && chestZ < Chunk.Size - 1
                    && curY + 1 < Chunk.Size && blocks[chestX, curY + 1, chestZ] == (ushort)BlockType.Air)
                {
                    blocks[chestX, curY + 1, chestZ] = (ushort)BlockType.Chest;
                    _pendingDungeonChests.Add(new DungeonChestData(
                        baseX + chestX, baseY + curY + 1, baseZ + chestZ,
                        GenerateDungeonLoot(rng)));
                    placedChest = true;
                }
            }

            if (room < numRooms - 1)
            {
                var dir = rng.NextInt(0, 4);
                var corridorLen = rng.NextInt(3, 8);
                for (int c = 0; c < corridorLen; c++)
                {
                    curX += dir == 2 ? 1 : dir == 3 ? -1 : 0;
                    curZ += dir == 0 ? 1 : dir == 1 ? -1 : 0;

                    if (curX < 1 || curX >= Chunk.Size - 1 || curZ < 1 || curZ >= Chunk.Size - 1
                        || curY < 1 || curY + 2 >= Chunk.Size) break;

                    for (int dy = 0; dy < 3; dy++)
                    {
                        if (curY + dy >= Chunk.Size) break;
                        blocks[curX, curY + dy, curZ] = (ushort)BlockType.Air;
                    }

                    if (rng.NextFloat() < 0.15f && curY + 2 < Chunk.Size)
                    {
                        blocks[curX, curY + 2, curZ] = rng.NextFloat() > 0.5f
                            ? (ushort)BlockType.Torch
                            : (ushort)BlockType.Lantern;
                    }
                }
            }
        }
    }

    private void GrowGrass(ushort[,,] blocks, int baseX, int baseY, int baseZ,
        int[,] heightMap, BiomeV6Type[,] biomeMap)
    {
        for (int x = 0; x < Chunk.Size; x++)
        {
            for (int z = 0; z < Chunk.Size; z++)
            {
                var biome = biomeMap[x, z];

                for (int y = Chunk.Size - 1; y >= 1; y--)
                {
                    var block = blocks[x, y, z];
                    if (block == (ushort)BlockType.Air || block == (ushort)BlockType.Water)
                        continue;

                    var worldY = baseY + y;

                    if (biome == BiomeV6Type.Taiga && block == (ushort)BlockType.Dirt)
                    {
                        blocks[x, y, z] = (ushort)BlockType.DirtWithSnow;
                        break;
                    }

                    if (biome == BiomeV6Type.Tundra)
                    {
                        if (block == (ushort)BlockType.Dirt)
                        {
                            blocks[x, y, z] = (ushort)BlockType.Snow;
                            if (y - 1 >= 0 && blocks[x, y - 1, z] == (ushort)BlockType.Dirt)
                                blocks[x, y - 1, z] = (ushort)BlockType.DirtWithSnow;
                        }
                        else if (block == (ushort)BlockType.Stone && y + 1 < Chunk.Size &&
                                 blocks[x, y + 1, z] == (ushort)BlockType.Air)
                        {
                            blocks[x, y + 1, z] = (ushort)BlockType.Snow;
                        }
                        break;
                    }

                    if (block == (ushort)BlockType.Dirt && worldY >= WaterLevel - 20)
                    {
                        blocks[x, y, z] = (ushort)BlockType.Grass;
                        break;
                    }

                    break;
                }
            }
        }
    }

    private void PlaceTrees(ushort[,,] blocks, int baseX, int baseY, int baseZ,
        int[,] heightMap, BiomeV6Type[,] biomeMap)
    {
        var rng = new PcgRandom((uint)((long)baseX * 73856093 ^ (long)baseZ * 19349663 + (uint)_seed));

        for (int x = 2; x < Chunk.Size - 2; x++)
        {
            for (int z = 2; z < Chunk.Size - 2; z++)
            {
                var worldX = baseX + x;
                var worldZ = baseZ + z;
                var surfaceY = heightMap[x, z];
                var localY = surfaceY - baseY;

                if (localY < 1 || localY >= Chunk.Size - 7) continue;
                if (surfaceY <= WaterLevel) continue;

                var biome = biomeMap[x, z];
                if (biome == BiomeV6Type.Desert) continue;

                var treeNoise = _noise.Noise2DEx(_npTrees, worldX, worldZ);
                var zeroVal = -0.39f;
                if (treeNoise < zeroVal) continue;

                var treeDensity = 0.04f * (treeNoise - zeroVal) / (1f - zeroVal);
                if (biome == BiomeV6Type.Jungle) treeDensity *= 4f;

                if (rng.NextFloat() > treeDensity * 10f) continue;

                var surfaceBlock = blocks[x, localY, z];
                if (surfaceBlock != (ushort)BlockType.Grass &&
                    surfaceBlock != (ushort)BlockType.Dirt &&
                    surfaceBlock != (ushort)BlockType.DirtWithSnow)
                    continue;

                var schematic = GetTreeSchematicForBiome(biome);
                if (schematic == null) continue;

                var trunkType = GetBlockTypeByName(schematic.TrunkBlock);
                var leavesType = schematic.LeavesBlock == "none" ? (ushort)BlockType.Air : GetBlockTypeByName(schematic.LeavesBlock);
                var height = rng.NextInt(schematic.MinHeight, schematic.MaxHeight + 1);

                if (biome == BiomeV6Type.Taiga)
                {
                    localY = Math.Max(0, localY - 1);
                    height += 2;
                }

                PlaceTreeCanopy(blocks, x, localY, z, height, trunkType, leavesType, schematic);

                if (biome == BiomeV6Type.Normal && localY + 1 < Chunk.Size)
                {
                    var appleNoise = _noise.Noise2DEx(_npAppleTrees, worldX, worldZ);
                    if (appleNoise > 0.2f && height > 3)
                    {
                        for (int dx = -1; dx <= 1; dx++)
                        {
                            for (int dz = -1; dz <= 1; dz++)
                            {
                                var lx = x + dx;
                                var lz = z + dz;
                                var ly = localY + height - 1;
                                if (lx >= 0 && lx < Chunk.Size && lz >= 0 && lz < Chunk.Size && ly < Chunk.Size)
                                {
                                    if (blocks[lx, ly, lz] == (ushort)BlockType.Air && rng.NextFloat() < 0.3f)
                                        blocks[lx, ly, lz] = (ushort)BlockType.Apple;
                                }
                            }
                        }
                    }
                }

                if (biome == BiomeV6Type.Jungle)
                {
                    for (int dx = -1; dx <= 1; dx++)
                    {
                        for (int dz = -1; dz <= 1; dz++)
                        {
                            var lx = x + dx;
                            var lz = z + dz;
                            if (lx < 0 || lx >= Chunk.Size || lz < 0 || lz >= Chunk.Size) continue;

                            for (int ty = localY; ty <= localY + 2; ty++)
                            {
                                if (ty >= Chunk.Size) break;
                                if (blocks[lx, ty, lz] == (ushort)BlockType.Air && rng.NextFloat() < 0.15f)
                                {
                                    blocks[lx, ty, lz] = (ushort)BlockType.JungleGrass;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private TreeSchematic? GetTreeSchematicForBiome(BiomeV6Type biome)
    {
        var targetName = biome switch
        {
            BiomeV6Type.Jungle => "jungle",
            BiomeV6Type.Taiga => "pine",
            _ => "oak"
        };

        foreach (var s in _treeSchematics)
        {
            if (s.Name.StartsWith(targetName)) return s;
        }
        return _treeSchematics.FirstOrDefault();
    }

    private static void PlaceTreeCanopy(ushort[,,] blocks, int x, int surfaceY, int z,
        int height, ushort trunkType, ushort leavesType, TreeSchematic schematic)
    {
        for (int ty = 1; ty <= height; ty++)
        {
            var ly = surfaceY + ty;
            if (ly >= 0 && ly < Chunk.Size)
                blocks[x, ly, z] = trunkType;
        }

        var canopyBase = surfaceY + height + schematic.CanopyBaseOffset;
        for (int dy = 0; dy <= schematic.CanopyTopOffset; dy++)
        {
            var ly = canopyBase + dy;
            if (ly < 0 || ly >= Chunk.Size) continue;

            var radius = schematic.CanopyRadius;
            if (dy > schematic.CanopyTopOffset / 2)
                radius = Math.Max(1, radius - 1);

            for (int dx = -radius; dx <= radius; dx++)
            {
                for (int dz = -radius; dz <= radius; dz++)
                {
                    if (schematic.CanopyShape == "cone")
                    {
                        var distFromTop = schematic.CanopyTopOffset - dy;
                        var coneRadius = Math.Max(1, distFromTop <= 1 ? 1 : radius);
                        if (dx * dx + dz * dz > coneRadius * coneRadius) continue;
                    }
                    else
                    {
                        if (dx * dx + dz * dz > radius * radius + 1) continue;
                    }

                    var lx = x + dx;
                    var lz = z + dz;
                    if (lx < 0 || lx >= Chunk.Size || lz < 0 || lz >= Chunk.Size) continue;
                    if (blocks[lx, ly, lz] == (ushort)BlockType.Air)
                        blocks[lx, ly, lz] = leavesType;
                }
            }
        }
    }

    private static bool isGroundContent(ushort block)
    {
        return block != (ushort)BlockType.Air &&
               block != (ushort)BlockType.Water &&
               block != (ushort)BlockType.Ice &&
               block != (ushort)BlockType.Bedrock;
    }

    private static bool IsSolid(ushort block)
    {
        return block != (ushort)BlockType.Air &&
               block != (ushort)BlockType.Water &&
               block != (ushort)BlockType.RiverWater &&
               block != (ushort)BlockType.WaterFlowing;
    }

    private static ushort GetBlockTypeByName(string name)
    {
        return name switch
        {
            "grass" => (ushort)BlockType.Grass,
            "dirt" => (ushort)BlockType.Dirt,
            "dirt_with_snow" => (ushort)BlockType.DirtWithSnow,
            "sand" => (ushort)BlockType.Sand,
            "desert_sand" => (ushort)BlockType.DesertSand,
            "snow" => (ushort)BlockType.Snow,
            "stone" => (ushort)BlockType.Stone,
            "desert_stone" => (ushort)BlockType.DesertStone,
            "wood" => (ushort)BlockType.Wood,
            "leaves" => (ushort)BlockType.Leaves,
            "pine_wood" => (ushort)BlockType.PineWood,
            "pine_needles" => (ushort)BlockType.PineNeedles,
            "jungle_wood" => (ushort)BlockType.JungleWood,
            "jungle_leaves" => (ushort)BlockType.JungleLeaves,
            "cobblestone" => (ushort)BlockType.Cobblestone,
            "mossy_cobblestone" => (ushort)BlockType.MossyCobblestone,
            "sandstone" => (ushort)BlockType.SandStone,
            _ => (ushort)BlockType.Dirt
        };
    }

    private List<ItemStack> GenerateDungeonLoot(PcgRandom rng)
    {
        var loot = new List<ItemStack>();
        var numStacks = rng.NextInt(3, 9);

        for (int i = 0; i < numStacks; i++)
        {
            var roll = rng.NextFloat();
            if (roll < 0.02f)
                loot.Add(GenerateSpecialLoot(rng));
            else if (roll < 0.10f)
                loot.Add(GenerateRareLoot(rng));
            else if (roll < 0.30f)
                loot.Add(GenerateUncommonLoot(rng));
            else
                loot.Add(GenerateCommonLoot(rng));
        }
        return loot;
    }

    private static ItemStack GenerateCommonLoot(PcgRandom rng)
    {
        var items = new (string ItemId, int Min, int Max)[]
        {
            ("coal", 1, 8), ("iron_ingot", 1, 5), ("bread", 1, 3),
            ("wheat", 1, 4), ("torch", 1, 6), ("string", 1, 4), ("bone", 1, 4)
        };
        var (itemId, min, max) = items[rng.NextInt(items.Length)];
        return new ItemStack(itemId, rng.NextInt(min, max + 1));
    }

    private static ItemStack GenerateUncommonLoot(PcgRandom rng)
    {
        var items = new (string ItemId, int Min, int Max)[]
        {
            ("gold_ingot", 1, 3), ("diamond", 1, 2), ("redstone", 1, 5)
        };
        var singleItems = new[] { "iron_sword", "iron_pickaxe", "bucket", "saddle" };
        if (rng.NextFloat() < 0.6f)
        {
            var (itemId, min, max) = items[rng.NextInt(items.Length)];
            return new ItemStack(itemId, rng.NextInt(min, max + 1));
        }
        return new ItemStack(singleItems[rng.NextInt(singleItems.Length)], 1);
    }

    private static ItemStack GenerateRareLoot(PcgRandom rng)
    {
        var items = new[] { "golden_apple", "diamond_sword", "diamond_pickaxe", "book", "music_disc" };
        return new ItemStack(items[rng.NextInt(items.Length)], 1);
    }

    private static ItemStack GenerateSpecialLoot(PcgRandom rng)
    {
        var items = new (string ItemId, int Min, int Max)[]
        {
            ("ender_pearl", 1, 1), ("blaze_rod", 1, 1), ("obsidian", 1, 3)
        };
        var (itemId, min, max) = items[rng.NextInt(items.Length)];
        return new ItemStack(itemId, rng.NextInt(min, max + 1));
    }

    public int GetGroundHeight(int x, int z)
    {
        var terrainLevel = BaseTerrainLevel(x + 0.5f, z + 0.5f);
        return (int)(terrainLevel + AverageMudAmount);
    }

    public List<(int X, int Y, int Z, List<ItemStack> Loot)> PopPendingDungeonChests()
    {
        var results = new List<(int X, int Y, int Z, List<ItemStack> Loot)>();
        while (_pendingDungeonChests.TryTake(out var chest))
            results.Add((chest.X, chest.Y, chest.Z, chest.Loot));
        return results;
    }
}
