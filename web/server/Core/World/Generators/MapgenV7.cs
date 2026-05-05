using System.Collections.Concurrent;
using System.Text.Json;
using WebGameServer.Core.World;
using ItemStack = WebGameServer.Core.Player.ItemStack;

namespace WebGameServer.Core.World.Generators;

public class MapgenV7 : IWorldGenerator
{
    public string Name => "v7";

    private int _seed;
    private int[] _permutationTable = new int[512];
    private bool _generateCaves = true;
    private bool _generateDungeons = true;
    private bool _generateTrees = true;
    private bool _generateMountains = true;
    private bool _generateRivers = true;
    private bool _generateCaverns = true;

    private const int ChunkSize = 16;
    private const int WaterLevel = 1;
    private const int GroundBase = 32;
    private const int TerrainHeight = 20;

    private readonly List<BiomeDefinition> _biomes = new();
    private BiomeNoiseConfig? _biomeNoiseConfig;
    private readonly ConcurrentBag<DungeonChestData> _pendingDungeonChests = new();

    private float _caveWidth = 0.09f;
    private float _cavernLimit = -256f;
    private float _cavernTaper = 256f;
    private float _cavernThreshold = 0.7f;
    private float _largeCaveDepth = -33f;
    private int _largeCaveNumMax = 2;
    private int _largeCaveFlooded = 50;
    private float _mountZeroLevel = 0f;

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

    private record NoiseParams(
        float Offset, float Scale, float SpreadX, float SpreadY, float SpreadZ,
        int Seed, int Octaves, float Persistence, float Lacunarity);

    private readonly NoiseParams _npTerrainBase = new(4f, 70f, 600f, 600f, 600f, 82341, 5, 0.6f, 2f);
    private readonly NoiseParams _npTerrainAlt = new(4f, 25f, 600f, 600f, 600f, 5934, 5, 0.6f, 2f);
    private readonly NoiseParams _npTerrainPersist = new(0.6f, 0.1f, 2000f, 2000f, 2000f, 539, 3, 0.6f, 2f);
    private readonly NoiseParams _npHeightSelect = new(-8f, 16f, 500f, 500f, 500f, 4213, 6, 0.7f, 2f);
    private readonly NoiseParams _npFillerDepth = new(0f, 1.2f, 150f, 150f, 150f, 261, 3, 0.7f, 2f);
    private readonly NoiseParams _npMountHeight = new(256f, 112f, 1000f, 1000f, 1000f, 72449, 3, 0.6f, 2f);
    private readonly NoiseParams _npRidgeUwater = new(0f, 1f, 1000f, 1000f, 1000f, 85039, 5, 0.6f, 2f);
    private readonly NoiseParams _npMountain = new(-0.6f, 1f, 250f, 350f, 250f, 5333, 5, 0.63f, 2f);
    private readonly NoiseParams _npRidge = new(0f, 1f, 100f, 100f, 100f, 6467, 4, 0.75f, 2f);
    private readonly NoiseParams _npCave1 = new(0f, 12f, 61f, 61f, 61f, 52534, 3, 0.5f, 2f);
    private readonly NoiseParams _npCave2 = new(0f, 12f, 67f, 67f, 67f, 10325, 3, 0.5f, 2f);
    private readonly NoiseParams _npCavern = new(0f, 1f, 384f, 128f, 384f, 723, 5, 0.63f, 2f);
    private readonly NoiseParams _npDungeons = new(0.9f, 0.5f, 500f, 500f, 500f, 0, 2, 0.8f, 2f);

    public void ConfigureCaves(bool generateCaves) => _generateCaves = generateCaves;
    public void ConfigureDungeons(bool generateDungeons) => _generateDungeons = generateDungeons;
    public void ConfigureTrees(bool generateTrees) => _generateTrees = generateTrees;
    public void ConfigureMountains(bool generateMountains) => _generateMountains = generateMountains;
    public void ConfigureRivers(bool generateRivers) => _generateRivers = generateRivers;
    public void ConfigureCaverns(bool generateCaverns) => _generateCaverns = generateCaverns;

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
    }

    public ushort[,,] GenerateChunk(int chunkX, int chunkY, int chunkZ)
    {
        var blocks = new ushort[ChunkSize, ChunkSize, ChunkSize];
        var baseX = chunkX * ChunkSize;
        var baseY = chunkY * ChunkSize;
        var baseZ = chunkZ * ChunkSize;

        var surfaceYMap = new float[ChunkSize, ChunkSize];
        var heightMap = new int[ChunkSize, ChunkSize];

        for (int x = 0; x < ChunkSize; x++)
        {
            for (int z = 0; z < ChunkSize; z++)
            {
                var worldX = baseX + x;
                var worldZ = baseZ + z;
                surfaceYMap[x, z] = CalculateBaseTerrainLevel(worldX, worldZ);
                heightMap[x, z] = (int)surfaceYMap[x, z];

                for (int y = 0; y < ChunkSize; y++)
                {
                    var worldY = baseY + y;
                    blocks[x, y, z] = DetermineBlock(worldX, worldY, worldZ, surfaceYMap[x, z]);
                }
            }
        }

        if (_generateMountains)
            ApplyMountains(blocks, baseX, baseY, baseZ, surfaceYMap, heightMap);

        if (_generateRivers)
            ApplyRivers(blocks, baseX, baseY, baseZ, surfaceYMap, heightMap);

        if (_generateCaves)
            CarveCaves(blocks, baseX, baseY, baseZ);

        if (_generateCaverns && baseY <= _cavernLimit)
            CarveCaverns(blocks, baseX, baseY, baseZ);

        if (_generateDungeons && baseY >= 0 && baseY < GroundBase)
            GenerateDungeons(blocks, baseX, baseY, baseZ);

        if (_generateTrees)
            GenerateTrees(blocks, baseX, baseY, baseZ, heightMap);

        GenerateDecorations(blocks, baseX, baseY, baseZ, heightMap);

        return blocks;
    }

    public int GetGroundHeight(int x, int z)
    {
        var surfaceY = CalculateBaseTerrainLevel(x, z);

        if (_generateMountains)
        {
            var mountH = OctaveNoise2D(_npMountHeight, x, z);
            var clampedMountH = MathF.Max(mountH, 1f);

            for (int y = (int)surfaceY; y < (int)surfaceY + 128; y++)
            {
                var densityGradient = -(y - _mountZeroLevel) / clampedMountH;
                var mountNoise = OctaveNoise3D(_npMountain, x, y, z);
                if (mountNoise + densityGradient < 0f)
                    return y;
            }
            return (int)surfaceY + 64;
        }

        return (int)surfaceY + 2;
    }

    private float CalculateBaseTerrainLevel(int x, int z)
    {
        var persistNoise = OctaveNoise2D(_npTerrainPersist, x, z);
        var persistModulated = _npTerrainPersist.Offset + _npTerrainPersist.Scale * persistNoise;

        var baseVal = OctaveNoise2DWithPersistence(_npTerrainBase, x, z, persistModulated);
        var altVal = OctaveNoise2DWithPersistence(_npTerrainAlt, x, z, persistModulated);
        var heightSelect = OctaveNoise2D(_npHeightSelect, x, z);
        var hSelect = Math.Clamp(heightSelect, 0f, 1f);

        if (altVal > baseVal)
            return GroundBase + altVal;
        return GroundBase + baseVal * hSelect + altVal * (1f - hSelect);
    }

    private ushort DetermineBlock(int x, int y, int z, float surfaceY)
    {
        if (y == 0) return (ushort)BlockType.Bedrock;
        if (y < 0) return (ushort)BlockType.Air;

        if (y > surfaceY)
        {
            if (y <= WaterLevel) return (ushort)BlockType.Water;
            return (ushort)BlockType.Air;
        }

        var biome = GetBiomeAt(x, y, z, (int)surfaceY);

        if (y == (int)surfaceY)
        {
            if (surfaceY <= WaterLevel && biome.TopBlock == "grass") return (ushort)BlockType.Sand;
            if (surfaceY > GroundBase + TerrainHeight + 10) return GetBlockTypeByName(biome.StoneBlock);
            return GetBlockTypeByName(biome.TopBlock);
        }

        if (y > (int)surfaceY - biome.FillerDepth)
            return GetBlockTypeByName(biome.FillerBlock);

        if (y > 1)
            return GetBlockTypeByName(biome.StoneBlock);

        return (ushort)BlockType.Bedrock;
    }

    private void ApplyMountains(ushort[,,] blocks, int baseX, int baseY, int baseZ,
        float[,] surfaceYMap, int[,] heightMap)
    {
        for (int x = 0; x < ChunkSize; x++)
        {
            for (int z = 0; z < ChunkSize; z++)
            {
                var worldX = baseX + x;
                var worldZ = baseZ + z;

                var mountH = OctaveNoise2D(_npMountHeight, worldX, worldZ);
                var clampedMountH = MathF.Max(mountH, 1f);

                for (int y = 0; y < ChunkSize; y++)
                {
                    var worldY = baseY + y;
                    var densityGradient = -(worldY - _mountZeroLevel) / clampedMountH;
                    var mountNoise = OctaveNoise3D(_npMountain, worldX, worldY, worldZ);

                    if (mountNoise + densityGradient >= 0f)
                    {
                        if (blocks[x, y, z] == (ushort)BlockType.Air || blocks[x, y, z] == (ushort)BlockType.Water)
                        {
                            blocks[x, y, z] = (ushort)BlockType.Stone;
                            if (worldY > heightMap[x, z])
                                heightMap[x, z] = worldY;
                        }
                    }
                }
            }
        }
    }

    private void ApplyRivers(ushort[,,] blocks, int baseX, int baseY, int baseZ,
        float[,] surfaceYMap, int[,] heightMap)
    {
        var riverWidth = 0.2f;

        for (int x = 0; x < ChunkSize; x++)
        {
            for (int z = 0; z < ChunkSize; z++)
            {
                var worldX = baseX + x;
                var worldZ = baseZ + z;

                var absUwaterN = MathF.Abs(OctaveNoise2D(_npRidgeUwater, worldX, worldZ)) * 2f;

                if (absUwaterN > riverWidth) continue;

                for (int y = 0; y < ChunkSize; y++)
                {
                    var worldY = baseY + y;
                    if (worldY > heightMap[x, z] || worldY <= WaterLevel) continue;

                    var altitude = worldY - WaterLevel;
                    var heightMod = (altitude + 17f) / 2.5f;
                    var widthMod = riverWidth - absUwaterN;
                    var ridgeNoise = OctaveNoise3D(_npRidge, worldX, worldY, worldZ);
                    var nridge = ridgeNoise * MathF.Max(altitude, 0f) / 7f;

                    if (nridge + widthMod * heightMod >= 0.6f)
                    {
                        if (blocks[x, y, z] != (ushort)BlockType.Bedrock)
                        {
                            if (worldY <= WaterLevel)
                                blocks[x, y, z] = (ushort)BlockType.Water;
                            else
                                blocks[x, y, z] = (ushort)BlockType.Water;
                        }
                    }
                }
            }
        }
    }

    private void CarveCaves(ushort[,,] blocks, int baseX, int baseY, int baseZ)
    {
        for (int x = 0; x < ChunkSize; x++)
        {
            for (int z = 0; z < ChunkSize; z++)
            {
                for (int y = 0; y < ChunkSize; y++)
                {
                    var worldX = baseX + x;
                    var worldY = baseY + y;
                    var worldZ = baseZ + z;

                    if (worldY <= 1 || worldY >= GroundBase + TerrainHeight + 20) continue;

                    var d1 = OctaveNoise3D(_npCave1, worldX, worldY, worldZ);
                    var d2 = OctaveNoise3D(_npCave2, worldX, worldY, worldZ);

                    if (d1 * d2 > _caveWidth)
                    {
                        var bt = blocks[x, y, z];
                        if (bt != (ushort)BlockType.Air && bt != (ushort)BlockType.Water
                            && bt != (ushort)BlockType.Bedrock)
                        {
                            blocks[x, y, z] = (ushort)BlockType.Air;
                        }
                    }
                }
            }
        }
    }

    private void CarveCaverns(ushort[,,] blocks, int baseX, int baseY, int baseZ)
    {
        for (int x = 0; x < ChunkSize; x++)
        {
            for (int z = 0; z < ChunkSize; z++)
            {
                for (int y = 0; y < ChunkSize; y++)
                {
                    var worldX = baseX + x;
                    var worldY = baseY + y;
                    var worldZ = baseZ + z;

                    var cavernAmp = MathF.Min((baseY + y - _cavernLimit) / _cavernTaper, 1f);
                    if (cavernAmp <= 0f) continue;

                    var noiseVal = MathF.Abs(OctaveNoise3D(_npCavern, worldX, worldY, worldZ)) * cavernAmp;
                    if (noiseVal > _cavernThreshold)
                    {
                        var bt = blocks[x, y, z];
                        if (bt != (ushort)BlockType.Air && bt != (ushort)BlockType.Water
                            && bt != (ushort)BlockType.Bedrock)
                        {
                            blocks[x, y, z] = worldY <= WaterLevel
                                ? (ushort)BlockType.Water
                                : (ushort)BlockType.Air;
                        }
                    }
                }
            }
        }
    }

    private void GenerateDungeons(ushort[,,] blocks, int baseX, int baseY, int baseZ)
    {
        var rng = new Random(_seed + baseX * 73856093 ^ baseZ * 19349663 ^ baseY * 83492791);

        var numDungeons = Math.Max((int)MathF.Floor(OctaveNoise3D(_npDungeons, baseX, baseY, baseZ)), 0);
        numDungeons = Math.Clamp(numDungeons, 0, 2);

        for (int d = 0; d < numDungeons; d++)
        {
            var startCX = rng.Next(4, ChunkSize - 4);
            var startCY = rng.Next(2, ChunkSize / 2 - 2);
            var startCZ = rng.Next(4, ChunkSize - 4);

            if (blocks[startCX, startCY, startCZ] == (ushort)BlockType.Air) continue;
            var worldCY = baseY + startCY;
            if (worldCY > WaterLevel + 30 || worldCY < 2) continue;

            var numRooms = rng.Next(2, 8);
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

                if (curX + roomW >= ChunkSize || curY + roomH >= ChunkSize || curZ + roomD >= ChunkSize
                    || curX < 1 || curY < 1 || curZ < 1)
                    break;

                var biome = GetBiomeAt(baseX + curX, baseY + curY, baseZ + curZ, baseY + curY);
                var wallBlock = GetBlockTypeByName(biome.DungeonBlock);
                var altWallBlock = GetBlockTypeByName(biome.DungeonAltBlock);

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
                                blocks[lx, ly, lz] = altNoise > 0.7 ? altWallBlock : wallBlock;
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
                    if (chestX > 0 && chestX < ChunkSize - 1 && chestZ > 0 && chestZ < ChunkSize - 1
                        && curY + 1 < ChunkSize && blocks[chestX, curY + 1, chestZ] == (ushort)BlockType.Air)
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

                        if (curX < 1 || curX >= ChunkSize - 1 || curZ < 1 || curZ >= ChunkSize - 1
                            || curY < 1 || curY + 2 >= ChunkSize)
                            break;

                        for (int dy = 0; dy < 3; dy++)
                        {
                            if (curY + dy < ChunkSize)
                                blocks[curX, curY + dy, curZ] = (ushort)BlockType.Air;
                        }
                    }
                }
            }
        }
    }

    private void GenerateTrees(ushort[,,] blocks, int baseX, int baseY, int baseZ, int[,] heightMap)
    {
        for (int x = 2; x < ChunkSize - 2; x++)
        {
            for (int z = 2; z < ChunkSize - 2; z++)
            {
                var worldX = baseX + x;
                var worldZ = baseZ + z;
                var surfaceY = heightMap[x, z];
                var localSurfaceY = surfaceY - baseY;

                if (localSurfaceY < 2 || localSurfaceY >= ChunkSize - 8) continue;
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
                    if (ly >= 0 && ly < ChunkSize)
                        blocks[x, ly, z] = trunkType;
                }

                var canopyBase = localSurfaceY + height - 1;
                for (int dy = 0; dy <= 3; dy++)
                {
                    var ly = canopyBase + dy;
                    if (ly < 0 || ly >= ChunkSize) continue;

                    var radius = dy <= 1 ? 2 : 1;
                    for (int dx = -radius; dx <= radius; dx++)
                    {
                        for (int dz = -radius; dz <= radius; dz++)
                        {
                            if (dx * dx + dz * dz > radius * radius + 1) continue;
                            var lx = x + dx;
                            var lz = z + dz;
                            if (lx < 0 || lx >= ChunkSize || lz < 0 || lz >= ChunkSize) continue;
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
        for (int x = 0; x < ChunkSize; x++)
        {
            for (int z = 0; z < ChunkSize; z++)
            {
                var worldX = baseX + x;
                var worldZ = baseZ + z;
                var surfaceY = heightMap[x, z];
                var localSurfaceY = surfaceY - baseY;

                if (localSurfaceY < 0 || localSurfaceY >= ChunkSize - 1) continue;
                if (surfaceY <= WaterLevel) continue;

                var biome = GetBiomeAt(worldX, surfaceY, worldZ, surfaceY);
                if (biome.Decorations.Length == 0) continue;

                var rng = new Random(_seed + worldX * 73856093 ^ worldZ * 19349663);
                var fillerDepthNoise = OctaveNoise2D(_npFillerDepth, worldX, worldZ);
                var decoChance = 0.3f + fillerDepthNoise * 0.2f;

                if (rng.NextDouble() < decoChance && blocks[x, localSurfaceY + 1, z] == (ushort)BlockType.Air)
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

    private float OctaveNoise2D(NoiseParams np, float x, float z)
    {
        var result = 0f;
        var amplitude = 1f;
        var frequency = 1f;
        var maxAmplitude = 0f;

        for (int i = 0; i < np.Octaves; i++)
        {
            var nx = x * frequency / np.SpreadX + np.Seed * (i + 1);
            var nz = z * frequency / np.SpreadZ + np.Seed * (i + 1) * 0.7f;
            result += PerlinNoise2D(nx, nz) * amplitude;
            maxAmplitude += amplitude;
            amplitude *= np.Persistence;
            frequency *= np.Lacunarity;
        }

        return np.Offset + np.Scale * (result / maxAmplitude);
    }

    private float OctaveNoise2DWithPersistence(NoiseParams np, float x, float z, float persistence)
    {
        var result = 0f;
        var amplitude = 1f;
        var frequency = 1f;
        var maxAmplitude = 0f;

        for (int i = 0; i < np.Octaves; i++)
        {
            var nx = x * frequency / np.SpreadX + np.Seed * (i + 1);
            var nz = z * frequency / np.SpreadZ + np.Seed * (i + 1) * 0.7f;
            result += PerlinNoise2D(nx, nz) * amplitude;
            maxAmplitude += amplitude;
            amplitude *= persistence;
            frequency *= np.Lacunarity;
        }

        return np.Offset + np.Scale * (result / maxAmplitude);
    }

    private float OctaveNoise3D(NoiseParams np, float x, float y, float z)
    {
        var result = 0f;
        var amplitude = 1f;
        var frequency = 1f;
        var maxAmplitude = 0f;

        for (int i = 0; i < np.Octaves; i++)
        {
            var nx = x * frequency / np.SpreadX + np.Seed * (i + 1);
            var ny = y * frequency / np.SpreadY + np.Seed * (i + 1) * 0.5f;
            var nz = z * frequency / np.SpreadZ + np.Seed * (i + 1) * 0.7f;
            result += PerlinNoise3D(nx, ny, nz) * amplitude;
            maxAmplitude += amplitude;
            amplitude *= np.Persistence;
            frequency *= np.Lacunarity;
        }

        return np.Offset + np.Scale * (result / maxAmplitude);
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
