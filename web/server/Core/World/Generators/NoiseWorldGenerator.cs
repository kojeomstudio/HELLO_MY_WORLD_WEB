using System.Text.Json;
using WebGameServer.Core.World;

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

    private record BiomeDefinition(
        string Name, int YMin, int YMax, float HeatPoint, float HumidityPoint,
        string TopBlock, string FillerBlock, int FillerDepth,
        string StoneBlock, string WaterBlock,
        string TreeType, float TreeChance,
        string[] Decorations, string DungeonBlock, string DungeonAltBlock);

    private record BiomeNoiseConfig(
        float HeatOffset, float HeatScale, float[] HeatSpread,
        float HumidityOffset, float HumidityScale, float[] HumiditySpread);

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
                        biome.GetProperty("topBlock").GetString() ?? "grass",
                        biome.GetProperty("fillerBlock").GetString() ?? "dirt",
                        biome.GetProperty("fillerDepth").GetInt32(),
                        biome.GetProperty("stoneBlock").GetString() ?? "stone",
                        biome.GetProperty("waterBlock").GetString() ?? "water",
                        biome.TryGetProperty("treeType", out var ttEl) ? ttEl.GetString() ?? "none" : "none",
                        biome.TryGetProperty("treeChance", out var tcEl) ? (float)tcEl.GetDouble() : 0f,
                        decorations.ToArray(),
                        biome.TryGetProperty("dungeonBlock", out var dbEl) ? dbEl.GetString() ?? "cobblestone" : "cobblestone",
                        biome.TryGetProperty("dungeonAltBlock", out var daEl) ? daEl.GetString() ?? "mossy_cobblestone" : "mossy_cobblestone"
                    ));
                }
            }

            if (root.TryGetProperty("noise", out var noiseEl))
            {
                _biomeNoiseConfig = new BiomeNoiseConfig(
                    (float)noiseEl.GetProperty("heatOffset").GetDouble(),
                    (float)noiseEl.GetProperty("heatScale").GetDouble(),
                    noiseEl.GetProperty("heatSpread").EnumerateArray().Select(e => (float)e.GetDouble()).ToArray(),
                    (float)noiseEl.GetProperty("humidityOffset").GetDouble(),
                    (float)noiseEl.GetProperty("humidityScale").GetDouble(),
                    noiseEl.GetProperty("humiditySpread").EnumerateArray().Select(e => (float)e.GetDouble()).ToArray()
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
                        blocks[x, y, z] = (ushort)BlockType.Air;
                    }
                }
            }
        }
    }

    private void GenerateOres(ushort[,,] blocks, int baseX, int baseY, int baseZ)
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
            if (biomeNoise > 0.3f) return new BiomeDefinition("desert", 4, 31000, 90, 10, "sand", "sand", 3, "desert_stone", "water", "none", 0, Array.Empty<string>(), "cobblestone", "mossy_cobblestone");
            if (biomeNoise < -0.4f) return new BiomeDefinition("snow", 4, 31000, 10, 40, "snow", "dirt", 1, "stone", "water", "pine", 0.006f, new[] { "tall_grass" }, "cobblestone", "mossy_cobblestone");
            return new BiomeDefinition("grassland", 4, 31000, 50, 50, "grass", "dirt", 1, "stone", "water", "oak", 0.003f, new[] { "tall_grass", "flower_red" }, "cobblestone", "mossy_cobblestone");
        }

        float heat = 50f;
        float humidity = 50f;

        if (_biomeNoiseConfig != null)
        {
            var hSpread = _biomeNoiseConfig.HeatSpread;
            heat = _biomeNoiseConfig.HeatOffset + _biomeNoiseConfig.HeatScale * PerlinNoise2D(
                x / Math.Max(hSpread[0], 1f),
                z / Math.Max(hSpread[2], 1f));
            var huSpread = _biomeNoiseConfig.HumiditySpread;
            humidity = _biomeNoiseConfig.HumidityOffset + _biomeNoiseConfig.HumidityScale * PerlinNoise2D(
                x / Math.Max(huSpread[0], 1f) + 100,
                z / Math.Max(huSpread[2], 1f) + 100);
        }

        BiomeDefinition bestBiome = _biomes[0];
        float bestDist = float.MaxValue;

        foreach (var biome in _biomes)
        {
            if (y < biome.YMin || y > biome.YMax) continue;
            var dx = heat - biome.HeatPoint;
            var dz = humidity - biome.HumidityPoint;
            var dist = dx * dx + dz * dz;
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
}
