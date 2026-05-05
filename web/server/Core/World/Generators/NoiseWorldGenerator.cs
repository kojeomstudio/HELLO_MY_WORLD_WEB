using System.Collections.Concurrent;
using System.Text.Json;
using WebGameServer.Core.World;
using ItemStack = WebGameServer.Core.Player.ItemStack;

namespace WebGameServer.Core.World.Generators;

public class NoiseWorldGenerator : IWorldGenerator
{
    public string Name => "noise";
    private int _seed;
    private int[] _permutationTable = new int[512];
    private bool _generateTrees = true;
    private bool _generateCaves = true;
    private bool _generateOres = true;
    private bool _generateDungeons = true;

    private readonly List<BiomeDefinition> _biomes = new();
    private BiomeNoiseConfig? _biomeNoiseConfig;
    private readonly List<TreeSchematic> _treeSchematics = new();

    private const int GroundBase = 32;
    private const int TerrainHeight = 20;
    private const int WaterLevel = 28;
    private const int TreeMinHeight = 5;

    private readonly ConcurrentBag<DungeonChestData> _pendingDungeonChests = new();

    private record DungeonChestData(int X, int Y, int Z, List<ItemStack> Loot);

    private record BiomeDefinition(
        string Name, int YMin, int YMax, float HeatPoint, float HumidityPoint,
        float Weight, int VerticalBlend,
        string TopBlock, string FillerBlock, int FillerDepth,
        string StoneBlock, string WaterBlock,
        string WaterTopBlock, int DepthWaterTop,
        string RiverWaterBlock, string RiverbedBlock,
        string DustBlock, string CaveLiquid,
        string TreeType, float TreeChance,
        string[] Decorations, string DungeonBlock, string DungeonAltBlock, string DungeonStairBlock);

    private record BiomeNoiseConfig(
        float HeatOffset, float HeatScale, float[] HeatSpread,
        float HeatBlendOffset, float HeatBlendScale, float[] HeatBlendSpread,
        float HumidityOffset, float HumidityScale, float[] HumiditySpread,
        float HumidityBlendOffset, float HumidityBlendScale, float[] HumidityBlendSpread);

    private record TreeSchematic(
        string Name, string TrunkBlock, string LeavesBlock,
        int MinHeight, int MaxHeight, string CanopyShape,
        int CanopyBaseOffset, int CanopyTopOffset, int CanopyRadius,
        string[] Biomes);

    public void ConfigureTrees(bool generateTrees) => _generateTrees = generateTrees;
    public void ConfigureCaves(bool generateCaves) => _generateCaves = generateCaves;
    public void ConfigureOres(bool generateOres) => _generateOres = generateOres;
    public void ConfigureDungeons(bool generateDungeons) => _generateDungeons = generateDungeons;

    public void Initialize(int seed)
    {
        _seed = seed;
        var perm = new int[256];
        for (int i = 0; i < 256; i++) perm[i] = i;

        var rng = new Random(seed);
        for (int i = 255; i > 0; i--)
        {
            var j = rng.Next(i + 1);
            (perm[i], perm[j]) = (perm[j], perm[i]);
        }

        for (int i = 0; i < 512; i++)
        {
            _permutationTable[i] = perm[i & 255];
        }
    }

    public void LoadBiomes(string dataPath)
    {
        var biomesPath = Path.Combine(dataPath, "biomes.json");
        if (File.Exists(biomesPath))
        {
            var json = File.ReadAllText(biomesPath);
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;

            if (root.TryGetProperty("biomes", out var biomesEl))
            {
                foreach (var biome in biomesEl.EnumerateArray())
                {
                    var decorations = new List<string>();
                    if (biome.TryGetProperty("decorations", out var decEl))
                    {
                        foreach (var d in decEl.EnumerateArray())
                            decorations.Add(d.GetString() ?? "");
                    }

                    _biomes.Add(new BiomeDefinition(
                        biome.GetProperty("name").GetString() ?? "",
                        biome.GetProperty("yMin").GetInt32(),
                        biome.TryGetProperty("yMax", out var yMaxEl) ? yMaxEl.GetInt32() : 31000,
                        (float)biome.GetProperty("heatPoint").GetDouble(),
                        (float)biome.GetProperty("humidityPoint").GetDouble(),
                        biome.TryGetProperty("weight", out var wEl) ? (float)wEl.GetDouble() : 1.0f,
                        biome.TryGetProperty("verticalBlend", out var vbEl) ? vbEl.GetInt32() : 0,
                        biome.GetProperty("topBlock").GetString() ?? "grass",
                        biome.GetProperty("fillerBlock").GetString() ?? "dirt",
                        biome.GetProperty("fillerDepth").GetInt32(),
                        biome.GetProperty("stoneBlock").GetString() ?? "stone",
                        biome.GetProperty("waterBlock").GetString() ?? "water",
                        biome.TryGetProperty("waterTopBlock", out var wtEl) ? wtEl.GetString() ?? "water" : "water",
                        biome.TryGetProperty("depthWaterTop", out var dwEl) ? dwEl.GetInt32() : 0,
                        biome.TryGetProperty("riverWaterBlock", out var rwEl) ? rwEl.GetString() ?? "river_water" : "river_water",
                        biome.TryGetProperty("riverbedBlock", out var rbEl) ? rbEl.GetString() ?? "sand" : "sand",
                        biome.TryGetProperty("dustBlock", out var dustEl) ? dustEl.GetString() ?? "none" : "none",
                        biome.TryGetProperty("caveLiquid", out var clEl) ? clEl.GetString() ?? "none" : "none",
                        biome.TryGetProperty("treeType", out var ttEl) ? ttEl.GetString() ?? "none" : "none",
                        biome.TryGetProperty("treeChance", out var tcEl) ? (float)tcEl.GetDouble() : 0f,
                        decorations.ToArray(),
                        biome.TryGetProperty("dungeonBlock", out var dbEl) ? dbEl.GetString() ?? "cobblestone" : "cobblestone",
                        biome.TryGetProperty("dungeonAltBlock", out var daEl) ? daEl.GetString() ?? "mossy_cobblestone" : "mossy_cobblestone",
                        biome.TryGetProperty("dungeonStairBlock", out var dsEl) ? dsEl.GetString() ?? "stone_brick" : "stone_brick"
                    ));
                }
            }

            if (root.TryGetProperty("noise", out var noiseEl))
            {
                _biomeNoiseConfig = new BiomeNoiseConfig(
                    (float)noiseEl.GetProperty("heatOffset").GetDouble(),
                    (float)noiseEl.GetProperty("heatScale").GetDouble(),
                    noiseEl.GetProperty("heatSpread").EnumerateArray().Select(e => (float)e.GetDouble()).ToArray(),
                    noiseEl.TryGetProperty("heatBlendOffset", out var hboEl) ? (float)hboEl.GetDouble() : 0f,
                    noiseEl.TryGetProperty("heatBlendScale", out var hbsEl) ? (float)hbsEl.GetDouble() : 3f,
                    noiseEl.TryGetProperty("heatBlendSpread", out var hbspEl)
                        ? hbspEl.EnumerateArray().Select(e => (float)e.GetDouble()).ToArray()
                        : new[] { 8f, 8f, 8f },
                    (float)noiseEl.GetProperty("humidityOffset").GetDouble(),
                    (float)noiseEl.GetProperty("humidityScale").GetDouble(),
                    noiseEl.GetProperty("humiditySpread").EnumerateArray().Select(e => (float)e.GetDouble()).ToArray(),
                    noiseEl.TryGetProperty("humidityBlendOffset", out var huoEl) ? (float)huoEl.GetDouble() : 0f,
                    noiseEl.TryGetProperty("humidityBlendScale", out var husEl) ? (float)husEl.GetDouble() : 3f,
                    noiseEl.TryGetProperty("humidityBlendSpread", out var huspEl)
                        ? huspEl.EnumerateArray().Select(e => (float)e.GetDouble()).ToArray()
                        : new[] { 8f, 8f, 8f }
                );
            }
        }

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
            _treeSchematics.Add(new TreeSchematic("oak_tree", "wood", "leaves", 4, 6, "sphere", -1, 3, 2, new[] { "grassland", "forest", "savanna", "swamp" }));
            _treeSchematics.Add(new TreeSchematic("pine_tree", "pine_wood", "pine_needles", 5, 8, "cone", -2, 0, 2, new[] { "snow", "taiga" }));
            _treeSchematics.Add(new TreeSchematic("jungle_tree", "jungle_wood", "jungle_leaves", 6, 10, "sphere", -2, 4, 3, new[] { "jungle" }));
            _treeSchematics.Add(new TreeSchematic("birch_tree", "wood", "leaves", 5, 7, "cylinder", -1, 1, 2, new[] { "forest" }));
        }
    }

    public ushort[,,] GenerateChunk(int chunkX, int chunkY, int chunkZ)
    {
        var blocks = new ushort[Chunk.Size, Chunk.Size, Chunk.Size];
        var baseX = chunkX * Chunk.Size;
        var baseY = chunkY * Chunk.Size;
        var baseZ = chunkZ * Chunk.Size;

        var heightMap = new int[Chunk.Size, Chunk.Size];

        for (int x = 0; x < Chunk.Size; x++)
        {
            for (int z = 0; z < Chunk.Size; z++)
            {
                var worldX = baseX + x;
                var worldZ = baseZ + z;
                heightMap[x, z] = GetGroundHeight(worldX, worldZ);

                for (int y = 0; y < Chunk.Size; y++)
                {
                    var worldY = baseY + y;
                    blocks[x, y, z] = GetBlockAt(worldX, worldY, worldZ, heightMap[x, z]);
                }
            }
        }

        if (_generateCaves)
        {
            GenerateCaves(blocks, baseX, baseY, baseZ);
        }

        if (_generateOres)
        {
            GenerateOres(blocks, baseX, baseY, baseZ);
        }

        if (_generateDungeons && baseY >= 0 && baseY < 40)
        {
            GenerateDungeons(blocks, baseX, baseY, baseZ);
        }

        GenerateRivers(blocks, baseX, baseY, baseZ, heightMap);

        if (_generateTrees)
        {
            GenerateTrees(blocks, baseX, baseY, baseZ, heightMap);
        }

        GenerateDecorations(blocks, baseX, baseY, baseZ, heightMap);

        GenerateDustNodes(blocks, baseX, baseY, baseZ, heightMap);

        return blocks;
    }

    private void GenerateCaves(ushort[,,] blocks, int baseX, int baseY, int baseZ)
    {
        for (int x = 0; x < Chunk.Size; x++)
        {
            for (int z = 0; z < Chunk.Size; z++)
            {
                for (int y = 0; y < Chunk.Size; y++)
                {
                    var worldX = baseX + x;
                    var worldY = baseY + y;
                    var worldZ = baseZ + z;

                    if (worldY <= 1 || worldY >= GroundBase + TerrainHeight) continue;

                    if (IsCave(worldX, worldY, worldZ))
                    {
                        var biome = GetBiomeAt(worldX, worldY, worldZ, GroundBase);
                        if (biome.CaveLiquid != "none" && worldY <= WaterLevel && worldY > 5)
                        {
                            blocks[x, y, z] = GetCaveLiquidBlock(biome.CaveLiquid);
                        }
                        else
                        {
                            blocks[x, y, z] = (ushort)BlockType.Air;
                        }
                    }
                }
            }
        }

        GenerateRandomWalkCaves(blocks, baseX, baseY, baseZ);
    }

    private void GenerateRandomWalkCaves(ushort[,,] blocks, int baseX, int baseY, int baseZ)
    {
        var rng = new Random(_seed + baseX * 1664525 + baseZ * 1013904223 + baseY * 4567890);

        var numWalks = 3;
        for (int w = 0; w < numWalks; w++)
        {
            if (rng.NextDouble() > 0.35) continue;

            var startX = rng.Next(2, Chunk.Size - 2);
            var startZ = rng.Next(2, Chunk.Size - 2);
            var startY = rng.Next(2, Chunk.Size - 4);
            var worldStartY = baseY + startY;

            if (worldStartY > GroundBase + TerrainHeight - 5 || worldStartY < 3) continue;

            var isLarge = worldStartY < 20 && rng.NextDouble() < 0.2;
            var tunnelRadius = isLarge ? rng.Next(2, 5) : rng.Next(1, 3);
            var length = isLarge ? rng.Next(20, 60) : rng.Next(10, 40);

            var cx = startX;
            var cy = startY;
            var cz = startZ;
            var dx = rng.Next(-1, 2);
            var dz = rng.Next(-1, 2);
            var dy = 0;

            for (int step = 0; step < length; step++)
            {
                CarveTunnelSphere(blocks, cx, cy, cz, tunnelRadius);

                if (rng.NextDouble() < 0.25)
                {
                    dx = rng.Next(-1, 2);
                    dz = rng.Next(-1, 2);
                }

                if (rng.NextDouble() < 0.15)
                {
                    dy = rng.Next(-1, 2);
                }

                cx += dx;
                cy += dy;
                cz += dz;

                if (cx < tunnelRadius || cx >= Chunk.Size - tunnelRadius ||
                    cz < tunnelRadius || cz >= Chunk.Size - tunnelRadius ||
                    cy < tunnelRadius || cy >= Chunk.Size - tunnelRadius)
                {
                    break;
                }

                if (baseY + cy > GroundBase + TerrainHeight - 2) dy = -Math.Abs(dy) - 1;
                if (baseY + cy < 2) dy = Math.Abs(dy) + 1;
            }
        }
    }

    private static void CarveTunnelSphere(ushort[,,] blocks, int cx, int cy, int cz, int radius)
    {
        for (int dx = -radius; dx <= radius; dx++)
        {
            for (int dy = -radius; dy <= radius; dy++)
            {
                for (int dz = -radius; dz <= radius; dz++)
                {
                    if (dx * dx + dy * dy + dz * dz > radius * radius) continue;

                    var lx = cx + dx;
                    var ly = cy + dy;
                    var lz = cz + dz;

                    if (lx < 0 || lx >= Chunk.Size || ly < 1 || ly >= Chunk.Size - 1 || lz < 0 || lz >= Chunk.Size) continue;

                    if (blocks[lx, ly, lz] != (ushort)BlockType.Bedrock)
                    {
                        blocks[lx, ly, lz] = (ushort)BlockType.Air;
                    }
                }
            }
        }
    }

    private void GenerateOres(ushort[,,] blocks, int baseX, int baseY, int baseZ)
    {
        var oreRng = new Random(unchecked((int)(_seed + baseX * 6364136223846793005L ^ baseZ * 6364136223846793005L)));

        GenerateOreVeins(blocks, baseX, baseY, baseZ, oreRng);

        for (int x = 0; x < Chunk.Size; x++)
        {
            for (int z = 0; z < Chunk.Size; z++)
            {
                for (int y = 0; y < Chunk.Size; y++)
                {
                    var worldX = baseX + x;
                    var worldY = baseY + y;
                    var worldZ = baseZ + z;

                    if (blocks[x, y, z] != (ushort)BlockType.Stone &&
                        blocks[x, y, z] != (ushort)BlockType.DesertStone) continue;

                    var oreType = GetOreAt(worldX, worldY, worldZ);
                    if (oreType != (ushort)BlockType.Air)
                    {
                        blocks[x, y, z] = oreType;
                    }
                }
            }
        }
    }

    private void GenerateOreVeins(ushort[,,] blocks, int baseX, int baseY, int baseZ, Random rng)
    {
        var veinDefinitions = new (BlockType Type, int YMin, int YMax, float Chance, int MinSize, int MaxSize)[]
        {
            ((BlockType)BlockType.OreIron, 0, 64, 0.02f, 3, 8),
            ((BlockType)BlockType.Coal, 0, 96, 0.025f, 4, 10),
            ((BlockType)BlockType.GoldOre, 0, 32, 0.008f, 2, 5),
            ((BlockType)BlockType.OreDiamond, 0, 16, 0.004f, 2, 4),
            ((BlockType)BlockType.RedstoneOre, 0, 16, 0.006f, 2, 6),
            ((BlockType)BlockType.LapisOre, 0, 32, 0.005f, 2, 5),
            ((BlockType)BlockType.CopperOre, 0, 96, 0.012f, 3, 7),
            ((BlockType)BlockType.EmeraldOre, 4, 32, 0.002f, 1, 1),
            ((BlockType)BlockType.Dirt, 0, 80, 0.01f, 4, 12),
            ((BlockType)BlockType.Gravel, 0, 80, 0.01f, 4, 12),
            ((BlockType)BlockType.Granite, 0, 80, 0.008f, 3, 8),
            ((BlockType)BlockType.Diorite, 0, 80, 0.008f, 3, 8),
            ((BlockType)BlockType.Andesite, 0, 80, 0.008f, 3, 8)
        };

        foreach (var (oreType, yMin, yMax, chance, minSize, maxSize) in veinDefinitions)
        {
            var numVeins = (int)(Chunk.Size * Chunk.Size * Chunk.Size * chance);
            for (int v = 0; v < numVeins; v++)
            {
                var vx = rng.Next(0, Chunk.Size);
                var vy = rng.Next(0, Chunk.Size);
                var vz = rng.Next(0, Chunk.Size);
                var worldY = baseY + vy;

                if (worldY < yMin || worldY > yMax) continue;
                if (blocks[vx, vy, vz] != (ushort)BlockType.Stone &&
                    blocks[vx, vy, vz] != (ushort)BlockType.DesertStone) continue;

                var veinSize = rng.Next(minSize, maxSize + 1);
                var cx = vx;
                var cy = vy;
                var cz = vz;

                for (int i = 0; i < veinSize; i++)
                {
                    if (cx >= 0 && cx < Chunk.Size && cy >= 0 && cy < Chunk.Size && cz >= 0 && cz < Chunk.Size)
                    {
                        if (blocks[cx, cy, cz] == (ushort)BlockType.Stone ||
                            blocks[cx, cy, cz] == (ushort)BlockType.DesertStone)
                        {
                            blocks[cx, cy, cz] = (ushort)oreType;
                        }
                    }

                    var dir = rng.Next(6);
                    cx += dir == 0 ? 1 : dir == 1 ? -1 : 0;
                    cy += dir == 2 ? 1 : dir == 3 ? -1 : 0;
                    cz += dir == 4 ? 1 : dir == 5 ? -1 : 0;
                }
            }
        }

        GenerateOreSheet(blocks, baseX, baseY, baseZ, rng);
        GenerateOreBlob(blocks, baseX, baseY, baseZ, rng);
        GenerateOrePuff(blocks, baseX, baseY, baseZ, rng);
        GenerateOreStratum(blocks, baseX, baseY, baseZ, rng);
        GenerateOreVein(blocks, baseX, baseY, baseZ, rng);
    }

    private void GenerateOreBlob(ushort[,,] blocks, int baseX, int baseY, int baseZ, Random rng)
    {
        var blobDefinitions = new (BlockType Type, int YMin, int YMax, float Chance, int Radius)[]
        {
            (BlockType.Diorite, 0, 80, 0.004f, 3),
            (BlockType.Granite, 0, 80, 0.004f, 3),
            (BlockType.Andesite, 0, 80, 0.004f, 3)
        };

        foreach (var (oreType, yMin, yMax, chance, radius) in blobDefinitions)
        {
            var numBlobs = (int)(Chunk.Size * Chunk.Size * Chunk.Size * chance);
            for (int b = 0; b < numBlobs; b++)
            {
                var cx = rng.Next(0, Chunk.Size);
                var cy = rng.Next(0, Chunk.Size);
                var cz = rng.Next(0, Chunk.Size);
                var worldY = baseY + cy;
                if (worldY < yMin || worldY > yMax) continue;
                if (blocks[cx, cy, cz] != (ushort)BlockType.Stone &&
                    blocks[cx, cy, cz] != (ushort)BlockType.DesertStone) continue;

                for (int dx = -radius; dx <= radius; dx++)
                {
                    for (int dy = -radius; dy <= radius; dy++)
                    {
                        for (int dz = -radius; dz <= radius; dz++)
                        {
                            var distSq = dx * dx + dy * dy + dz * dz;
                            if (distSq > radius * radius) continue;

                            var nx = cx + dx;
                            var ny = cy + dy;
                            var nz = cz + dz;
                            if (nx < 0 || nx >= Chunk.Size || ny < 0 || ny >= Chunk.Size || nz < 0 || nz >= Chunk.Size) continue;

                            if (blocks[nx, ny, nz] == (ushort)BlockType.Stone ||
                                blocks[nx, ny, nz] == (ushort)BlockType.DesertStone)
                            {
                                blocks[nx, ny, nz] = (ushort)oreType;
                            }
                        }
                    }
                }
            }
        }
    }

    private void GenerateOrePuff(ushort[,,] blocks, int baseX, int baseY, int baseZ, Random rng)
    {
        var puffDefinitions = new (BlockType Type, int YMin, int YMax, float Chance, int Radius, float NoiseThreshold)[]
        {
            (BlockType.Tuff, 0, 40, 0.003f, 4, 0.6f),
            (BlockType.Calcite, 0, 40, 0.002f, 3, 0.65f)
        };

        foreach (var (oreType, yMin, yMax, chance, radius, noiseThreshold) in puffDefinitions)
        {
            var numPuffs = (int)(Chunk.Size * Chunk.Size * Chunk.Size * chance);
            for (int p = 0; p < numPuffs; p++)
            {
                var cx = rng.Next(0, Chunk.Size);
                var cy = rng.Next(0, Chunk.Size);
                var cz = rng.Next(0, Chunk.Size);
                var worldY = baseY + cy;
                if (worldY < yMin || worldY > yMax) continue;
                if (blocks[cx, cy, cz] != (ushort)BlockType.Stone) continue;

                var worldCX = baseX + cx;
                var worldCZ = baseZ + cz;

                for (int dx = -radius; dx <= radius; dx++)
                {
                    for (int dy = -radius; dy <= radius; dy++)
                    {
                        for (int dz = -radius; dz <= radius; dz++)
                        {
                            var distSq = dx * dx + dy * dy + dz * dz;
                            if (distSq > radius * radius) continue;

                            var nx = cx + dx;
                            var ny = cy + dy;
                            var nz = cz + dz;
                            if (nx < 0 || nx >= Chunk.Size || ny < 0 || ny >= Chunk.Size || nz < 0 || nz >= Chunk.Size) continue;

                            var thicknessNoise = PerlinNoise3D(
                                (worldCX + dx) * 0.2f + 5000,
                                (worldY + dy) * 0.2f + 5000,
                                (worldCZ + dz) * 0.2f + 5000);

                            if (thicknessNoise > noiseThreshold &&
                                (blocks[nx, ny, nz] == (ushort)BlockType.Stone ||
                                 blocks[nx, ny, nz] == (ushort)BlockType.DesertStone))
                            {
                                blocks[nx, ny, nz] = (ushort)oreType;
                            }
                        }
                    }
                }
            }
        }
    }

    private void GenerateOreStratum(ushort[,,] blocks, int baseX, int baseY, int baseZ, Random rng)
    {
        var stratumDefinitions = new (BlockType Type, int YMin, int YMax, float Chance, int MinThickness, int MaxThickness)[]
        {
            (BlockType.Deepslate, 0, 16, 0.005f, 3, 8),
            (BlockType.Tuff, 0, 30, 0.003f, 2, 5)
        };

        foreach (var (oreType, yMin, yMax, chance, minThickness, maxThickness) in stratumDefinitions)
        {
            if (rng.NextDouble() > chance) continue;

            var stratumY = rng.Next(0, Chunk.Size);
            var worldY = baseY + stratumY;
            if (worldY < yMin || worldY > yMax) continue;

            var thickness = rng.Next(minThickness, maxThickness + 1);
            var noiseScale = 0.05f + rng.NextSingle() * 0.1f;
            var noiseOffset = rng.Next(0, 10000);

            for (int x = 0; x < Chunk.Size; x++)
            {
                for (int z = 0; z < Chunk.Size; z++)
                {
                    var worldX = baseX + x;
                    var worldZ = baseZ + z;
                    var stratumNoise = PerlinNoise3D(
                        worldX * noiseScale + noiseOffset,
                        worldY * noiseScale + noiseOffset,
                        worldZ * noiseScale + noiseOffset);

                    if (stratumNoise < -0.2f) continue;

                    for (int t = 0; t < thickness; t++)
                    {
                        var ly = stratumY + t;
                        if (ly >= Chunk.Size) break;
                        if (blocks[x, ly, z] == (ushort)BlockType.Stone)
                        {
                            blocks[x, ly, z] = (ushort)oreType;
                        }
                    }
                }
            }
        }
    }

    private void GenerateOreSheet(ushort[,,] blocks, int baseX, int baseY, int baseZ, Random rng)
    {
        var sheetDefinitions = new (BlockType Type, int YMin, int YMax, float Chance, int MinThickness, int MaxThickness)[]
        {
            (BlockType.Sand, 0, 60, 0.003f, 1, 4),
            (BlockType.Clay, 0, 40, 0.002f, 1, 3)
        };

        foreach (var (oreType, yMin, yMax, chance, minThickness, maxThickness) in sheetDefinitions)
        {
            if (rng.NextDouble() > chance * Chunk.Size * Chunk.Size) continue;

            var sheetY = rng.Next(0, Chunk.Size);
            var worldY = baseY + sheetY;
            if (worldY < yMin || worldY > yMax) continue;

            var thickness = rng.Next(minThickness, maxThickness + 1);
            var centerZ = rng.Next(0, Chunk.Size);
            var radius = rng.Next(2, Chunk.Size / 2);

            for (int x = 0; x < Chunk.Size; x++)
            {
                for (int z = 0; z < Chunk.Size; z++)
                {
                    var dist = Math.Abs(z - centerZ);
                    if (dist > radius) continue;

                    for (int t = 0; t < thickness; t++)
                    {
                        var ly = sheetY + t;
                        if (ly >= Chunk.Size) break;
                        if (blocks[x, ly, z] == (ushort)BlockType.Stone)
                        {
                            blocks[x, ly, z] = (ushort)oreType;
                        }
                    }
                }
            }
        }
    }

    private ushort GetOreAt(int x, int y, int z)
    {
        var oreNoise = PerlinNoise3D(x * 0.1f, y * 0.1f, z * 0.1f);
        if (y < 16 && oreNoise > 0.85f) return (ushort)BlockType.OreDiamond;
        if (y < 16 && PerlinNoise3D(x * 0.13f + 8000, y * 0.13f, z * 0.13f + 8000) > 0.88f) return (ushort)BlockType.EmeraldOre;
        if (y < 32 && oreNoise > 0.8f) return (ushort)BlockType.OreGold;
        if (y < 32 && PerlinNoise3D(x * 0.11f + 7000, y * 0.11f, z * 0.11f + 7000) > 0.87f) return (ushort)BlockType.RedstoneOre;
        if (y < 32 && PerlinNoise3D(x * 0.1f + 9500, y * 0.1f, z * 0.1f + 9500) > 0.86f) return (ushort)BlockType.LapisOre;
        if (y < 48 && oreNoise > 0.75f) return (ushort)BlockType.OreIron;
        if (y < 48 && PerlinNoise3D(x * 0.12f + 6000, y * 0.12f, z * 0.12f + 6000) > 0.85f) return (ushort)BlockType.GoldOre;
        if (y < 64 && PerlinNoise3D(x * 0.15f, y * 0.15f, z * 0.15f) > 0.82f) return (ushort)BlockType.Coal;
        if (y < 96 && PerlinNoise3D(x * 0.14f + 9000, y * 0.14f, z * 0.14f + 9000) > 0.84f) return (ushort)BlockType.CopperOre;

        var gravelNoise = PerlinNoise3D(x * 0.12f + 2000, y * 0.12f, z * 0.12f + 2000);
        if (gravelNoise > 0.9f && y < 40) return (ushort)BlockType.Gravel;

        var clayNoise = PerlinNoise3D(x * 0.09f + 4000, y * 0.09f, z * 0.09f + 4000);
        if (clayNoise > 0.92f && y < WaterLevel + 5 && y > WaterLevel - 5) return (ushort)BlockType.Clay;

        return (ushort)BlockType.Air;
    }

    private void GenerateRivers(ushort[,,] blocks, int baseX, int baseY, int baseZ, int[,] heightMap)
    {
        var riverNoise = PerlinNoise2D(baseX * 0.005f + 15000, baseZ * 0.005f + 15000);
        if (Math.Abs(riverNoise) > 0.03f) return;

        for (int x = 0; x < Chunk.Size; x++)
        {
            for (int z = 0; z < Chunk.Size; z++)
            {
                var worldX = baseX + x;
                var worldZ = baseZ + z;
                var localRiverNoise = PerlinNoise2D(worldX * 0.008f + 15000, worldZ * 0.008f + 15000);

                if (Math.Abs(localRiverNoise) < 0.025f)
                {
                    var surfaceY = heightMap[x, z];
                    if (surfaceY < WaterLevel + 2 && surfaceY > WaterLevel - 2)
                    {
                        var localSurfaceY = surfaceY - baseY;
                        if (localSurfaceY >= 0 && localSurfaceY < Chunk.Size)
                        {
                            blocks[x, localSurfaceY, z] = (ushort)BlockType.RiverWater;
                        }
                    }
                }
            }
        }
    }

    private void GenerateTrees(ushort[,,] blocks, int baseX, int baseY, int baseZ, int[,] heightMap)
    {
        for (int x = 0; x < Chunk.Size; x++)
        {
            for (int z = 0; z < Chunk.Size; z++)
            {
                var worldX = baseX + x;
                var worldZ = baseZ + z;
                var surfaceY = heightMap[x, z];
                var localSurfaceY = surfaceY - baseY;

                if (localSurfaceY < 0 || localSurfaceY >= Chunk.Size) continue;
                if (surfaceY <= WaterLevel) continue;

                var biome = GetBiomeAt(worldX, surfaceY, worldZ, surfaceY);
                if (biome.TreeType == "none" || biome.TreeChance <= 0) continue;

                var surfaceBlock = blocks[x, localSurfaceY, z];

                var treeRng = new Random(_seed + worldX * 73856093 ^ worldZ * 19349663);
                var treeRoll = treeRng.NextDouble();
                if (treeRoll > biome.TreeChance) continue;

                var schematic = GetSchematicForBiome(biome.TreeType);
                if (schematic == null) continue;

                var trunkType = GetBlockTypeByName(schematic.TrunkBlock);
                var leavesType = schematic.LeavesBlock == "none" ? (ushort)BlockType.Air : GetBlockTypeByName(schematic.LeavesBlock);
                if (trunkType == (ushort)BlockType.Air) continue;

                var height = treeRng.Next(schematic.MinHeight, schematic.MaxHeight + 1);

                switch (schematic.CanopyShape)
                {
                    case "sphere":
                        GenerateSphereCanopyTree(blocks, x, localSurfaceY, z, height, trunkType, leavesType,
                            schematic.CanopyBaseOffset, schematic.CanopyTopOffset, schematic.CanopyRadius);
                        break;
                    case "cone":
                        GenerateConeCanopyTree(blocks, x, localSurfaceY, z, height, trunkType, leavesType);
                        break;
                    case "cylinder":
                        GenerateCylinderCanopyTree(blocks, x, localSurfaceY, z, height, trunkType, leavesType,
                            schematic.CanopyBaseOffset, schematic.CanopyTopOffset, schematic.CanopyRadius);
                        break;
                    case "none":
                        GenerateTrunkOnly(blocks, x, localSurfaceY, z, height, trunkType);
                        break;
                    default:
                        GenerateSphereCanopyTree(blocks, x, localSurfaceY, z, height, trunkType, leavesType,
                            schematic.CanopyBaseOffset, schematic.CanopyTopOffset, schematic.CanopyRadius);
                        break;
                }
            }
        }
    }

    private TreeSchematic? GetSchematicForBiome(string treeType)
    {
        foreach (var s in _treeSchematics)
        {
            if (s.Name.StartsWith(treeType)) return s;
        }
        return _treeSchematics.FirstOrDefault();
    }

    private static void GenerateSphereCanopyTree(ushort[,,] blocks, int x, int surfaceY, int z,
        int height, ushort trunkType, ushort leavesType, int canopyBaseOffset, int canopyTopOffset, int canopyRadius)
    {
        for (int ty = 1; ty <= height; ty++)
        {
            var ly = surfaceY + ty;
            if (ly >= 0 && ly < Chunk.Size)
                blocks[x, ly, z] = trunkType;
        }

        var canopyBase = surfaceY + height + canopyBaseOffset;
        for (int dy = 0; dy <= canopyTopOffset; dy++)
        {
            var ly = canopyBase + dy;
            if (ly < 0 || ly >= Chunk.Size) continue;

            var radius = dy <= canopyTopOffset / 2 ? canopyRadius : canopyRadius - 1;
            for (int dx = -radius; dx <= radius; dx++)
            {
                for (int dz = -radius; dz <= radius; dz++)
                {
                    if (dx * dx + dz * dz > radius * radius + 1) continue;
                    var lx = x + dx;
                    var lz = z + dz;
                    if (lx < 0 || lx >= Chunk.Size || lz < 0 || lz >= Chunk.Size) continue;
                    if (blocks[lx, ly, lz] == (ushort)BlockType.Air)
                        blocks[lx, ly, lz] = leavesType;
                }
            }
        }
    }

    private static void GenerateConeCanopyTree(ushort[,,] blocks, int x, int surfaceY, int z,
        int height, ushort trunkType, ushort leavesType)
    {
        var totalHeight = height + 2;
        for (int ty = 1; ty <= totalHeight; ty++)
        {
            var ly = surfaceY + ty;
            if (ly >= 0 && ly < Chunk.Size)
                blocks[x, ly, z] = trunkType;
        }

        for (int ty = height - 2; ty <= totalHeight; ty++)
        {
            var ly = surfaceY + ty;
            if (ly < 0 || ly >= Chunk.Size) continue;

            var distFromTop = totalHeight - ty;
            var radius = distFromTop <= 1 ? 1 : 2;
            for (int dx = -radius; dx <= radius; dx++)
            {
                for (int dz = -radius; dz <= radius; dz++)
                {
                    if (dx * dx + dz * dz > radius * radius) continue;
                    var lx = x + dx;
                    var lz = z + dz;
                    if (lx < 0 || lx >= Chunk.Size || lz < 0 || lz >= Chunk.Size) continue;
                    if (blocks[lx, ly, lz] == (ushort)BlockType.Air)
                        blocks[lx, ly, lz] = leavesType;
                }
            }
        }
    }

    private static void GenerateTrunkOnly(ushort[,,] blocks, int x, int surfaceY, int z, int height, ushort trunkType)
    {
        for (int dy = 1; dy <= height; dy++)
        {
            var ly = surfaceY + dy;
            if (ly >= 0 && ly < Chunk.Size)
            {
                blocks[x, ly, z] = trunkType;
            }
        }
    }

    private static void GenerateCylinderCanopyTree(ushort[,,] blocks, int x, int surfaceY, int z,
        int height, ushort trunkType, ushort leavesType, int canopyBaseOffset, int canopyTopOffset, int canopyRadius)
    {
        for (int ty = 1; ty <= height; ty++)
        {
            var ly = surfaceY + ty;
            if (ly >= 0 && ly < Chunk.Size)
                blocks[x, ly, z] = trunkType;
        }

        var canopyBase = surfaceY + height + canopyBaseOffset;
        for (int dy = 0; dy <= canopyTopOffset; dy++)
        {
            var ly = canopyBase + dy;
            if (ly < 0 || ly >= Chunk.Size) continue;

            var radius = dy == canopyTopOffset / 2 ? canopyRadius : canopyRadius - 1;
            for (int dx = -radius; dx <= radius; dx++)
            {
                for (int dz = -radius; dz <= radius; dz++)
                {
                    if (Math.Abs(dx) + Math.Abs(dz) > radius + 1) continue;
                    var lx = x + dx;
                    var lz = z + dz;
                    if (lx < 0 || lx >= Chunk.Size || lz < 0 || lz >= Chunk.Size) continue;
                    if (blocks[lx, ly, lz] == (ushort)BlockType.Air)
                        blocks[lx, ly, lz] = leavesType;
                }
            }
        }
    }

    private void GenerateDecorations(ushort[,,] blocks, int baseX, int baseY, int baseZ, int[,] heightMap)
    {
        for (int x = 0; x < Chunk.Size; x++)
        {
            for (int z = 0; z < Chunk.Size; z++)
            {
                var worldX = baseX + x;
                var worldZ = baseZ + z;
                var surfaceY = heightMap[x, z];
                var localSurfaceY = surfaceY - baseY;

                if (localSurfaceY < 0 || localSurfaceY >= Chunk.Size - 1) continue;
                if (surfaceY <= WaterLevel) continue;

                var biome = GetBiomeAt(worldX, surfaceY, worldZ, surfaceY);
                if (biome.Decorations.Length == 0) continue;

                var rng = new Random(_seed + worldX * 73856093 ^ worldZ * 19349663);
                var decoNoise = PerlinNoise2D(worldX * 3.0f + 9000, worldZ * 3.0f + 9000);

                if (decoNoise > 0.3f && blocks[x, localSurfaceY + 1, z] == (ushort)BlockType.Air)
                {
                    var decoIndex = rng.Next(biome.Decorations.Length);
                    var deco = biome.Decorations[decoIndex];
                    var decoType = GetDecorationBlockType(deco, decoNoise);
                    if (decoType != BlockType.Air)
                    {
                        blocks[x, localSurfaceY + 1, z] = (ushort)decoType;
                    }
                }
            }
        }
    }

    private static BlockType GetDecorationBlockType(string name, float noise)
    {
        return name switch
        {
            "tall_grass" => BlockType.TallGrass,
            "flower_red" => BlockType.FlowerRed,
            "flower_yellow" => BlockType.FlowerYellow,
            "flower_rose" => BlockType.FlowerRose,
            "flower_tulip" => BlockType.FlowerTulip,
            "mushroom_red" => BlockType.MushroomRedBlock,
            "mushroom_brown" => BlockType.MushroomBrownBlock,
            "dead_bush" => BlockType.DeadBush,
            "junglegrass" => BlockType.JungleGrass,
            "cactus" => BlockType.Cactus,
            _ => BlockType.Air
        };
    }

    private void GenerateDungeons(ushort[,,] blocks, int baseX, int baseY, int baseZ)
    {
        var rng = new Random(_seed + baseX * 73856093 ^ baseZ * 19349663 ^ baseY * 83492791);

        var numDungeons = rng.Next(1, 3);
        for (int d = 0; d < numDungeons; d++)
        {
            var startCX = rng.Next(4, Chunk.Size - 4);
            var startCY = rng.Next(2, Chunk.Size / 2 - 2);
            var startCZ = rng.Next(4, Chunk.Size - 4);

            if (blocks[startCX, startCY, startCZ] == (ushort)BlockType.Air) continue;

            var worldCY = baseY + startCY;
            if (worldCY > 28 || worldCY < 2) continue;

            var worldCX = baseX + startCX;
            var dungeonNoise = PerlinNoise2D(worldCX * 0.02f + 3000, baseZ * 0.02f + 3000);
            if (dungeonNoise < 0.55f) continue;

            var numRooms = rng.Next(2, 5);
            var curX = startCX;
            var curY = startCY;
            var curZ = startCZ;
            var placedChest = false;

            for (int room = 0; room < numRooms; room++)
            {
                var isLarge = rng.NextDouble() < 0.25;
                var roomW = isLarge ? rng.Next(5, 8) : rng.Next(3, 5);
                var roomH = rng.Next(3, 5);
                var roomD = isLarge ? rng.Next(5, 8) : rng.Next(3, 5);

                var placed = CarveRoom(blocks, curX, curY, curZ, roomW, roomH, roomD, rng);
                if (placed && !placedChest && room > 0 && rng.NextDouble() < 0.4)
                {
                    var chestX = curX + roomW / 2;
                    var chestZ = curZ + roomD / 2;
                    if (chestX > 0 && chestX < Chunk.Size - 1 && chestZ > 0 && chestZ < Chunk.Size - 1
                        && curY + 1 < Chunk.Size && blocks[chestX, curY + 1, chestZ] == (ushort)BlockType.Air)
                    {
                        blocks[chestX, curY + 1, chestZ] = (ushort)BlockType.Chest;
                        var loot = GenerateDungeonLoot(rng);
                        _pendingDungeonChests.Add(new DungeonChestData(
                            baseX + chestX, baseY + curY + 1, baseZ + chestZ, loot));
                        placedChest = true;
                    }
                }

                if (room < numRooms - 1)
                {
                    var dir = rng.Next(4);
                    var corridorLen = rng.Next(3, 8);
                    for (int c = 0; c < corridorLen; c++)
                    {
                        curX += dir == 2 ? 1 : dir == 3 ? -1 : 0;
                        curZ += dir == 0 ? 1 : dir == 1 ? -1 : 0;

                        if (curX < 1 || curX >= Chunk.Size - 1 || curZ < 1 || curZ >= Chunk.Size - 1
                            || curY < 1 || curY + 2 >= Chunk.Size) break;

                        CarveCorridor(blocks, curX, curY, curZ, rng);
                    }
                }
            }
        }
    }

    private static bool CarveRoom(ushort[,,] blocks, int cx, int cy, int cz, int w, int h, int d, Random rng)
    {
        if (cx + w >= Chunk.Size || cy + h >= Chunk.Size || cz + d >= Chunk.Size) return false;
        if (cx < 1 || cy < 1 || cz < 1) return false;

        for (int dx = 0; dx < w; dx++)
        {
            for (int dy = 0; dy < h; dy++)
            {
                for (int dz = 0; dz < d; dz++)
                {
                    var lx = cx + dx;
                    var ly = cy + dy;
                    var lz = cz + dz;

                    if (dx == 0 || dx == w - 1 || dy == 0 || dy == h - 1 || dz == 0 || dz == d - 1)
                    {
                        var altNoise = rng.NextDouble();
                        blocks[lx, ly, lz] = altNoise > 0.7
                            ? (ushort)BlockType.MossyCobblestone
                            : altNoise > 0.5
                                ? (ushort)BlockType.StoneBrick
                                : (ushort)BlockType.Cobblestone;
                    }
                    else
                    {
                        blocks[lx, ly, lz] = (ushort)BlockType.Air;
                    }
                }
            }
        }
        return true;
    }

    private static void CarveCorridor(ushort[,,] blocks, int x, int y, int z, Random rng)
    {
        for (int dy = 0; dy < 3; dy++)
        {
            if (y + dy >= Chunk.Size) break;
            blocks[x, y + dy, z] = (ushort)BlockType.Air;
        }

        if (rng.NextDouble() < 0.15 && y + 2 < Chunk.Size)
        {
            blocks[x, y + 2, z] = rng.NextDouble() > 0.5
                ? (ushort)BlockType.Torch
                : (ushort)BlockType.Lantern;
        }
    }

    public List<(int X, int Y, int Z, List<ItemStack> Loot)> PopPendingDungeonChests()
    {
        var results = new List<(int X, int Y, int Z, List<ItemStack> Loot)>();
        while (_pendingDungeonChests.TryTake(out var chest))
        {
            results.Add((chest.X, chest.Y, chest.Z, chest.Loot));
        }
        return results;
    }

    private List<ItemStack> GenerateDungeonLoot(Random rng)
    {
        var loot = new List<ItemStack>();
        var numStacks = rng.Next(3, 9);

        for (int i = 0; i < numStacks; i++)
        {
            var roll = rng.NextDouble();
            if (roll < 0.02)
            {
                loot.Add(GenerateSpecialLoot(rng));
            }
            else if (roll < 0.10)
            {
                loot.Add(GenerateRareLoot(rng));
            }
            else if (roll < 0.30)
            {
                loot.Add(GenerateUncommonLoot(rng));
            }
            else
            {
                loot.Add(GenerateCommonLoot(rng));
            }
        }

        return loot;
    }

    private static ItemStack GenerateCommonLoot(Random rng)
    {
        var items = new (string ItemId, int Min, int Max)[]
        {
            ("coal", 1, 8),
            ("iron_ingot", 1, 5),
            ("bread", 1, 3),
            ("wheat", 1, 4),
            ("torch", 1, 6),
            ("string", 1, 4),
            ("bone", 1, 4)
        };
        var (itemId, min, max) = items[rng.Next(items.Length)];
        return new ItemStack(itemId, rng.Next(min, max + 1));
    }

    private static ItemStack GenerateUncommonLoot(Random rng)
    {
        var stackItems = new (string ItemId, int Min, int Max)[]
        {
            ("gold_ingot", 1, 3),
            ("diamond", 1, 2),
            ("redstone", 1, 5)
        };
        var singleItems = new string[]
        {
            "iron_sword",
            "iron_pickaxe",
            "bucket",
            "saddle"
        };

        if (rng.NextDouble() < 0.6)
        {
            var (itemId, min, max) = stackItems[rng.Next(stackItems.Length)];
            return new ItemStack(itemId, rng.Next(min, max + 1));
        }

        return new ItemStack(singleItems[rng.Next(singleItems.Length)], 1);
    }

    private static ItemStack GenerateRareLoot(Random rng)
    {
        var items = new string[]
        {
            "golden_apple",
            "diamond_sword",
            "diamond_pickaxe",
            "book",
            "music_disc"
        };
        return new ItemStack(items[rng.Next(items.Length)], 1);
    }

    private static ItemStack GenerateSpecialLoot(Random rng)
    {
        var items = new (string ItemId, int Min, int Max)[]
        {
            ("ender_pearl", 1, 1),
            ("blaze_rod", 1, 1),
            ("obsidian", 1, 3)
        };
        var (itemId, min, max) = items[rng.Next(items.Length)];
        return new ItemStack(itemId, rng.Next(min, max + 1));
    }

    private ushort GetBlockAt(int x, int y, int z, int surfaceHeight)
    {
        if (y == 0) return (ushort)BlockType.Bedrock;
        if (y < 0) return (ushort)BlockType.Air;

        if (y > surfaceHeight)
        {
            if (y <= WaterLevel) return (ushort)BlockType.Water;
            return (ushort)BlockType.Air;
        }

        var biome = GetBiomeAt(x, y, z, surfaceHeight);

        if (y == surfaceHeight)
        {
            if (surfaceHeight <= WaterLevel && biome.TopBlock == "grass") return (ushort)BlockType.Sand;
            return GetBlockTypeByName(biome.TopBlock);
        }

        if (y > surfaceHeight - biome.FillerDepth)
        {
            return GetBlockTypeByName(biome.FillerBlock);
        }

        if (y > 1)
        {
            return GetBlockTypeByName(biome.StoneBlock);
        }

        return (ushort)BlockType.Bedrock;
    }

    private BiomeDefinition GetBiomeAt(int x, int y, int z, int surfaceHeight)
    {
        if (_biomes.Count == 0)
        {
            var biomeNoise = PerlinNoise2D(x * 0.005f + 1000, z * 0.005f + 1000);
            if (biomeNoise > 0.3f) return new BiomeDefinition("desert", 4, 31000, 90, 10, 1f, 1, "sand", "sand", 3, "desert_stone", "water", "water", 0, "river_water", "sand", "none", "none", "none", 0, Array.Empty<string>(), "cobblestone", "mossy_cobblestone", "stone_brick");
            if (biomeNoise < -0.4f) return new BiomeDefinition("snow", 4, 31000, 10, 40, 1f, 2, "snow", "dirt", 1, "stone", "water", "ice", 2, "ice", "dirt", "snow", "none", "pine", 0.006f, new[] { "tall_grass" }, "cobblestone", "mossy_cobblestone", "stone_brick");
            return new BiomeDefinition("grassland", 4, 31000, 50, 50, 1f, 2, "grass", "dirt", 1, "stone", "water", "water", 0, "river_water", "sand", "none", "none", "oak", 0.003f, new[] { "tall_grass", "flower_red" }, "cobblestone", "mossy_cobblestone", "stone_brick");
        }

        float heat = 50f;
        float humidity = 50f;

        if (_biomeNoiseConfig != null)
        {
            var hSpread = _biomeNoiseConfig.HeatSpread;
            heat = _biomeNoiseConfig.HeatOffset + _biomeNoiseConfig.HeatScale * PerlinNoise2D(
                x / Math.Max(hSpread[0], 1f),
                z / Math.Max(hSpread[2], 1f));

            var hbSpread = _biomeNoiseConfig.HeatBlendSpread;
            heat += _biomeNoiseConfig.HeatBlendOffset + _biomeNoiseConfig.HeatBlendScale * PerlinNoise2D(
                x / Math.Max(hbSpread[0], 1f) + 500,
                z / Math.Max(hbSpread[2], 1f) + 500);

            var huSpread = _biomeNoiseConfig.HumiditySpread;
            humidity = _biomeNoiseConfig.HumidityOffset + _biomeNoiseConfig.HumidityScale * PerlinNoise2D(
                x / Math.Max(huSpread[0], 1f) + 100,
                z / Math.Max(huSpread[2], 1f) + 100);

            var hubSpread = _biomeNoiseConfig.HumidityBlendSpread;
            humidity += _biomeNoiseConfig.HumidityBlendOffset + _biomeNoiseConfig.HumidityBlendScale * PerlinNoise2D(
                x / Math.Max(hubSpread[0], 1f) + 600,
                z / Math.Max(hubSpread[2], 1f) + 600);
        }

        BiomeDefinition bestBiome = _biomes[0];
        float bestDist = float.MaxValue;

        foreach (var biome in _biomes)
        {
            if (y < biome.YMin || y > biome.YMax) continue;

            var dx = heat - biome.HeatPoint;
            var dz = humidity - biome.HumidityPoint;
            var dist = (dx * dx + dz * dz) / Math.Max(biome.Weight, 0.01f);

            if (biome.VerticalBlend > 0 && surfaceHeight > 0)
            {
                var vertDist = Math.Abs(y - surfaceHeight);
                if (vertDist < biome.VerticalBlend)
                    dist *= (float)vertDist / biome.VerticalBlend;
            }

            if (dist < bestDist)
            {
                bestDist = dist;
                bestBiome = biome;
            }
        }

        return bestBiome;
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
            "water" => (ushort)BlockType.Water,
            "wood" => (ushort)BlockType.Wood,
            "leaves" => (ushort)BlockType.Leaves,
            "pine_wood" => (ushort)BlockType.PineWood,
            "pine_needles" => (ushort)BlockType.PineNeedles,
            "jungle_wood" => (ushort)BlockType.JungleWood,
            "jungle_leaves" => (ushort)BlockType.JungleLeaves,
            "cobblestone" => (ushort)BlockType.Cobblestone,
            "mossy_cobblestone" => (ushort)BlockType.MossyCobblestone,
            "sandstone" => (ushort)BlockType.SandStone,
            "stone_brick" => (ushort)BlockType.StoneBrick,
            "cactus" => (ushort)BlockType.Cactus,
            _ => (ushort)BlockType.Dirt
        };
    }

    private bool IsCave(int x, int y, int z)
    {
        var caveNoise = PerlinNoise3D(x * 0.05f, y * 0.07f, z * 0.05f);
        var caveNoise2 = PerlinNoise3D(x * 0.08f + 500, y * 0.08f, z * 0.08f + 500);
        if ((caveNoise * caveNoise + caveNoise2 * caveNoise2) < 0.015f) return true;

        if (y < 20)
        {
            var cavernNoise = PerlinNoise3D(x * 0.02f + 9999, y * 0.02f + 9999, z * 0.02f + 9999);
            if (cavernNoise > 0.65f) return true;
        }

        return false;
    }

    private float PerlinNoise2D(float x, float y) => PerlinNoise3D(x, y, 0);

    private float PerlinNoise3D(float x, float y, float z)
    {
        var xi = (int)MathF.Floor(x) & 255;
        var yi = (int)MathF.Floor(y) & 255;
        var zi = (int)MathF.Floor(z) & 255;

        var xf = x - MathF.Floor(x);
        var yf = y - MathF.Floor(y);
        var zf = z - MathF.Floor(z);

        var u = Fade(xf);
        var v = Fade(yf);
        var w = Fade(zf);

        var aaa = _permutationTable[_permutationTable[_permutationTable[xi] + yi] + zi];
        var aba = _permutationTable[_permutationTable[_permutationTable[xi] + Inc(yi)] + zi];
        var aab = _permutationTable[_permutationTable[_permutationTable[xi] + yi] + Inc(zi)];
        var abb = _permutationTable[_permutationTable[_permutationTable[xi] + Inc(yi)] + Inc(zi)];
        var baa = _permutationTable[_permutationTable[_permutationTable[Inc(xi)] + yi] + zi];
        var bba = _permutationTable[_permutationTable[_permutationTable[Inc(xi)] + Inc(yi)] + zi];
        var bab = _permutationTable[_permutationTable[_permutationTable[Inc(xi)] + yi] + Inc(zi)];
        var bbb = _permutationTable[_permutationTable[_permutationTable[Inc(xi)] + Inc(yi)] + Inc(zi)];

        var x1 = Lerp(Grad(aaa, xf, yf, zf), Grad(baa, xf - 1, yf, zf), u);
        var x2 = Lerp(Grad(aba, xf, yf - 1, zf), Grad(bba, xf - 1, yf - 1, zf), u);
        var y1 = Lerp(x1, x2, v);

        var x3 = Lerp(Grad(aab, xf, yf, zf - 1), Grad(bab, xf - 1, yf, zf - 1), u);
        var x4 = Lerp(Grad(abb, xf, yf - 1, zf - 1), Grad(bbb, xf - 1, yf - 1, zf - 1), u);
        var y2 = Lerp(x3, x4, v);

        return Lerp(y1, y2, w);
    }

    private static int Inc(int n) => (n + 1) & 255;
    private static float Fade(float t) => t * t * t * (t * (t * 6 - 15) + 10);
    private static float Lerp(float a, float b, float t) => a + t * (b - a);

    private static float Grad(int hash, float x, float y, float z)
    {
        var h = hash & 15;
        var u = h < 8 ? x : y;
        var v = h < 4 ? y : (h == 12 || h == 14 ? x : z);
        return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
    }

    public int GetGroundHeight(int x, int z)
    {
        var noise2D = PerlinNoise2D(x * 0.01f, z * 0.01f);
        var detailNoise = PerlinNoise2D(x * 0.05f, z * 0.05f) * 0.3f;
        var mountainNoise = PerlinNoise2D(x * 0.003f + 5000, z * 0.003f + 5000);
        var mountainFactor = mountainNoise > 0.4f ? (mountainNoise - 0.4f) * 60f : 0f;
        return GroundBase + (int)((noise2D + detailNoise) * TerrainHeight + mountainFactor);
    }

    private void GenerateDustNodes(ushort[,,] blocks, int baseX, int baseY, int baseZ, int[,] heightMap)
    {
        for (int x = 0; x < Chunk.Size; x++)
        {
            for (int z = 0; z < Chunk.Size; z++)
            {
                var worldX = baseX + x;
                var worldZ = baseZ + z;
                var surfaceY = heightMap[x, z];
                var localSurfaceY = surfaceY - baseY;

                if (localSurfaceY < 0 || localSurfaceY >= Chunk.Size - 1) continue;

                var biome = GetBiomeAt(worldX, surfaceY, worldZ, surfaceY);
                if (biome.DustBlock == "none") continue;

                var dustType = GetBlockTypeByName(biome.DustBlock);
                if (dustType != (ushort)BlockType.Air && blocks[x, localSurfaceY + 1, z] == (ushort)BlockType.Air)
                {
                    blocks[x, localSurfaceY + 1, z] = dustType;
                }
            }
        }
    }

    private static ushort GetCaveLiquidBlock(string liquid)
    {
        return liquid switch
        {
            "water" => (ushort)BlockType.Water,
            "lava" => (ushort)BlockType.Lava,
            _ => (ushort)BlockType.Air
        };
    }

    private void GenerateOreVein(ushort[,,] blocks, int baseX, int baseY, int baseZ, Random rng)
    {
        var veinDefinitions = new (BlockType Type, int YMin, int YMax, float Chance, int MinLength, int MaxLength, float NoiseThreshold)[]
        {
            (BlockType.OreDiamond, 0, 16, 0.001f, 8, 30, 0.5f),
            (BlockType.OreIron, 0, 48, 0.002f, 10, 40, 0.4f),
            (BlockType.GoldOre, 0, 32, 0.0015f, 6, 25, 0.45f)
        };

        foreach (var (oreType, yMin, yMax, chance, minLen, maxLen, noiseThreshold) in veinDefinitions)
        {
            if (rng.NextDouble() > chance * Chunk.Size) continue;

            var startX = rng.Next(2, Chunk.Size - 2);
            var startY = rng.Next(2, Chunk.Size - 2);
            var startZ = rng.Next(2, Chunk.Size - 2);

            if (baseY + startY < yMin || baseY + startY > yMax) continue;
            if (blocks[startX, startY, startZ] != (ushort)BlockType.Stone &&
                blocks[startX, startY, startZ] != (ushort)BlockType.DesertStone) continue;

            var length = rng.Next(minLen, maxLen + 1);
            var cx = startX;
            var cy = startY;
            var cz = startZ;
            var stepAngle = (float)(rng.NextDouble() * Math.PI * 2);

            for (int i = 0; i < length; i++)
            {
                var worldX = baseX + cx;
                var worldY = baseY + cy;
                var worldZ = baseZ + cz;

                var veinNoise = PerlinNoise3D(worldX * 0.15f + 12000, worldY * 0.15f + 12000, worldZ * 0.15f + 12000);
                if (veinNoise > noiseThreshold)
                {
                    for (int dx = -1; dx <= 1; dx++)
                    {
                        for (int dy = -1; dy <= 1; dy++)
                        {
                            for (int dz = -1; dz <= 1; dz++)
                            {
                                var nx = cx + dx;
                                var ny = cy + dy;
                                var nz = cz + dz;
                                if (nx < 0 || nx >= Chunk.Size || ny < 0 || ny >= Chunk.Size || nz < 0 || nz >= Chunk.Size) continue;

                                var noiseAtPoint = PerlinNoise3D(
                                    (baseX + nx) * 0.15f + 12000,
                                    (baseY + ny) * 0.15f + 12000,
                                    (baseZ + nz) * 0.15f + 12000);

                                if (noiseAtPoint > noiseThreshold &&
                                    (blocks[nx, ny, nz] == (ushort)BlockType.Stone ||
                                     blocks[nx, ny, nz] == (ushort)BlockType.DesertStone))
                                {
                                    blocks[nx, ny, nz] = (ushort)oreType;
                                }
                            }
                        }
                    }
                }

                stepAngle += (float)(rng.NextDouble() - 0.5) * 0.5f;
                cx += (int)Math.Round(Math.Cos(stepAngle));
                cy += rng.Next(-1, 2);
                cz += (int)Math.Round(Math.Sin(stepAngle));

                if (cx < 1 || cx >= Chunk.Size - 1 || cy < 1 || cy >= Chunk.Size - 1 || cz < 1 || cz >= Chunk.Size - 1)
                    break;
            }
        }
    }
}
