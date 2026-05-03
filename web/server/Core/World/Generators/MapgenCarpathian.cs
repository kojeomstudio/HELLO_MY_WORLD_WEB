using System.Collections.Concurrent;
using System.Text.Json;
using WebGameServer.Core.World;
using ItemStack = WebGameServer.Core.Player.ItemStack;

namespace WebGameServer.Core.World.Generators;

public class MapgenCarpathian : IWorldGenerator
{
    public string Name => "carpathian";

    private int _seed;
    private int[] _permutationTable = new int[512];
    private bool _generateCaves = true;
    private bool _generateDungeons = true;
    private bool _generateTrees = true;
    private bool _generateRivers = true;

    private const int GroundBase = 32;
    private const int TerrainHeight = 20;
    private const int WaterLevel = 28;

    private readonly List<BiomeDefinition> _biomes = new();
    private BiomeNoiseConfig? _biomeNoiseConfig;
    private readonly ConcurrentBag<DungeonChestData> _pendingDungeonChests = new();

    private float _baseTerrainScale = 0.01f;
    private float _ridgeScale = 0.005f;
    private float _stepHeight = 6f;
    private float _ridgeDepth = 0.35f;

    private record DungeonChestData(int X, int Y, int Z, List<ItemStack> Loot);

    private record BiomeDefinition(
        string Name, int YMin, int YMax, float HeatPoint, float HumidityPoint,
        string TopBlock, string FillerBlock, int FillerDepth,
        string StoneBlock, string WaterBlock,
        string TreeType, float TreeChance,
        string[] Decorations, string DungeonBlock, string DungeonAltBlock);

    private record BiomeNoiseConfig(
        float HeatOffset, float HeatScale, float[] HeatSpread,
        float HumidityOffset, float HumidityScale, float[] HumiditySpread);

    public void ConfigureCaves(bool generateCaves) => _generateCaves = generateCaves;
    public void ConfigureDungeons(bool generateDungeons) => _generateDungeons = generateDungeons;
    public void ConfigureTrees(bool generateTrees) => _generateTrees = generateTrees;

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
            _permutationTable[i] = perm[i & 255];
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

        var carpathianPath = Path.Combine(dataPath, "mapgen_carpathian.json");
        if (File.Exists(carpathianPath))
        {
            var json = File.ReadAllText(carpathianPath);
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;
            if (root.TryGetProperty("baseTerrainScale", out var bts))
                _baseTerrainScale = (float)bts.GetDouble();
            if (root.TryGetProperty("ridgeScale", out var rs))
                _ridgeScale = (float)rs.GetDouble();
            if (root.TryGetProperty("stepHeight", out var sh))
                _stepHeight = (float)sh.GetDouble();
            if (root.TryGetProperty("ridgeDepth", out var rd))
                _ridgeDepth = (float)rd.GetDouble();
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
            GenerateCaves(blocks, baseX, baseY, baseZ);

        if (_generateDungeons && baseY >= 0 && baseY < 40)
            GenerateDungeons(blocks, baseX, baseY, baseZ);

        if (_generateRivers)
            GenerateRivers(blocks, baseX, baseY, baseZ, heightMap);

        if (_generateTrees)
            GenerateTrees(blocks, baseX, baseY, baseZ, heightMap);

        GenerateDecorations(blocks, baseX, baseY, baseZ, heightMap);

        return blocks;
    }

    public int GetGroundHeight(int x, int z)
    {
        var baseNoise = PerlinNoise2D(x * _baseTerrainScale, z * _baseTerrainScale);
        var detailNoise = PerlinNoise2D(x * 0.05f, z * 0.05f) * 0.3f;

        var ridgeNoise = PerlinNoise2D(x * _ridgeScale + 4000, z * _ridgeScale + 4000);
        var ridgeFactor = ridgeNoise > _ridgeDepth ? (ridgeNoise - _ridgeDepth) * 40f : 0f;

        var rawHeight = GroundBase + (baseNoise + detailNoise) * TerrainHeight + ridgeFactor;

        var steppedHeight = (int)(MathF.Round(rawHeight / _stepHeight) * _stepHeight);

        var mountainNoise = PerlinNoise2D(x * 0.003f + 5000, z * 0.003f + 5000);
        if (mountainNoise > 0.4f)
            steppedHeight += (int)((mountainNoise - 0.4f) * 50f);

        return steppedHeight;
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
            if (surfaceHeight > WaterLevel + 25) return (ushort)BlockType.Stone;
            return GetBlockTypeByName(biome.TopBlock);
        }

        if (y > surfaceHeight - biome.FillerDepth)
            return GetBlockTypeByName(biome.FillerBlock);

        if (y > 1)
            return GetBlockTypeByName(biome.StoneBlock);

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
                x / Math.Max(hSpread[0], 1f), z / Math.Max(hSpread[2], 1f));
            var huSpread = _biomeNoiseConfig.HumiditySpread;
            humidity = _biomeNoiseConfig.HumidityOffset + _biomeNoiseConfig.HumidityScale * PerlinNoise2D(
                x / Math.Max(huSpread[0], 1f) + 100, z / Math.Max(huSpread[2], 1f) + 100);
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

    private void GenerateRivers(ushort[,,] blocks, int baseX, int baseY, int baseZ, int[,] heightMap)
    {
        var riverNoise = PerlinNoise2D(baseX * 0.008f + 6000, baseZ * 0.008f + 6000);
        var riverWidth = 0.12f;

        for (int x = 0; x < Chunk.Size; x++)
        {
            for (int z = 0; z < Chunk.Size; z++)
            {
                var worldX = baseX + x;
                var worldZ = baseZ + z;
                var absRiver = MathF.Abs(PerlinNoise2D(worldX * 0.008f + 6000, worldZ * 0.008f + 6000));

                if (absRiver < riverWidth)
                {
                    var surfaceY = heightMap[x, z];
                    var localSurfaceY = surfaceY - baseY;
                    var depth = (int)((riverWidth - absRiver) / riverWidth * 3);

                    for (int dy = 0; dy <= depth; dy++)
                    {
                        var ly = localSurfaceY - dy;
                        if (ly >= 0 && ly < Chunk.Size && blocks[x, ly, z] != (ushort)BlockType.Bedrock)
                            blocks[x, ly, z] = (ushort)BlockType.Water;
                    }
                }
            }
        }
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

                    var caveNoise = PerlinNoise3D(worldX * 0.05f, worldY * 0.07f, worldZ * 0.05f);
                    var caveNoise2 = PerlinNoise3D(worldX * 0.08f + 500, worldY * 0.08f, worldZ * 0.08f + 500);
                    if (caveNoise * caveNoise + caveNoise2 * caveNoise2 < 0.015f)
                        blocks[x, y, z] = (ushort)BlockType.Air;
                }
            }
        }
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

                if (curX + roomW >= Chunk.Size || curY + roomH >= Chunk.Size || curZ + roomD >= Chunk.Size || curX < 1 || curY < 1 || curZ < 1)
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

                if (!placedChest && room > 0 && rng.NextDouble() < 0.4)
                {
                    var chestX = curX + roomW / 2;
                    var chestZ = curZ + roomD / 2;
                    if (chestX > 0 && chestX < Chunk.Size - 1 && chestZ > 0 && chestZ < Chunk.Size - 1
                        && curY + 1 < Chunk.Size && blocks[chestX, curY + 1, chestZ] == (ushort)BlockType.Air)
                    {
                        blocks[chestX, curY + 1, chestZ] = (ushort)BlockType.Chest;
                        var loot = GenerateDungeonLoot(rng);
                        _pendingDungeonChests.Add(new DungeonChestData(baseX + chestX, baseY + curY + 1, baseZ + chestZ, loot));
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

                        if (curX < 1 || curX >= Chunk.Size - 1 || curZ < 1 || curZ >= Chunk.Size - 1 || curY < 1 || curY + 2 >= Chunk.Size)
                            break;

                        for (int dy = 0; dy < 3; dy++)
                        {
                            if (curY + dy < Chunk.Size)
                                blocks[curX, curY + dy, curZ] = (ushort)BlockType.Air;
                        }
                    }
                }
            }
        }
    }

    private void GenerateTrees(ushort[,,] blocks, int baseX, int baseY, int baseZ, int[,] heightMap)
    {
        for (int x = 2; x < Chunk.Size - 2; x++)
        {
            for (int z = 2; z < Chunk.Size - 2; z++)
            {
                var worldX = baseX + x;
                var worldZ = baseZ + z;
                var surfaceY = heightMap[x, z];
                var localSurfaceY = surfaceY - baseY;

                if (localSurfaceY < 2 || localSurfaceY >= Chunk.Size - 8) continue;
                if (surfaceY <= WaterLevel) continue;

                var biome = GetBiomeAt(worldX, surfaceY, worldZ, surfaceY);
                if (biome.TreeChance <= 0) continue;

                var treeRng = new Random(_seed + worldX * 73856093 ^ worldZ * 19349663);
                if (treeRng.NextDouble() > biome.TreeChance) continue;

                var treeType = biome.TreeType;
                var height = treeRng.Next(4, 7);
                var trunkType = GetBlockTypeByName(treeType switch
                {
                    "pine" => "pine_wood",
                    "jungle" => "jungle_wood",
                    _ => "wood"
                });
                var leavesType = GetBlockTypeByName(treeType switch
                {
                    "pine" => "pine_needles",
                    "jungle" => "jungle_leaves",
                    _ => "leaves"
                });

                for (int ty = 1; ty <= height; ty++)
                {
                    var ly = localSurfaceY + ty;
                    if (ly >= 0 && ly < Chunk.Size)
                        blocks[x, ly, z] = trunkType;
                }

                var canopyBase = localSurfaceY + height - 1;
                for (int dy = 0; dy <= 3; dy++)
                {
                    var ly = canopyBase + dy;
                    if (ly < 0 || ly >= Chunk.Size) continue;

                    var radius = dy <= 1 ? 2 : 1;
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
                    var decoType = GetDecorationBlockType(deco);
                    if (decoType != BlockType.Air)
                        blocks[x, localSurfaceY + 1, z] = (ushort)decoType;
                }
            }
        }
    }

    private static BlockType GetDecorationBlockType(string name) => name switch
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

    private static ushort GetBlockTypeByName(string name) => name switch
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

    private List<ItemStack> GenerateDungeonLoot(Random rng)
    {
        var loot = new List<ItemStack>();
        var numStacks = rng.Next(3, 9);
        for (int i = 0; i < numStacks; i++)
        {
            var roll = rng.NextDouble();
            if (roll < 0.02)
                loot.Add(new ItemStack("ender_pearl", 1));
            else if (roll < 0.10)
                loot.Add(new ItemStack(rng.Next(2) == 0 ? "diamond_sword" : "diamond_pickaxe", 1));
            else if (roll < 0.30)
                loot.Add(new ItemStack("gold_ingot", rng.Next(1, 4)));
            else
                loot.Add(new ItemStack("coal", rng.Next(1, 9)));
        }
        return loot;
    }

    public List<(int X, int Y, int Z, List<ItemStack> Loot)> PopPendingDungeonChests()
    {
        var results = new List<(int X, int Y, int Z, List<ItemStack> Loot)>();
        while (_pendingDungeonChests.TryTake(out var chest))
            results.Add((chest.X, chest.Y, chest.Z, chest.Loot));
        return results;
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
}
