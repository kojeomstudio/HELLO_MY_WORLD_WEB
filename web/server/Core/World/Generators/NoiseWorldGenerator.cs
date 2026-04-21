using System.Text.Json;
using WebGameServer.Core.World;

namespace WebGameServer.Core.World.Generators;

public class NoiseWorldGenerator : IWorldGenerator
{
    public string Name => "noise";
    private int _seed;
    private int[] _permutationTable = new int[512];
    private bool _generateTrees = true;

    private readonly List<BiomeDefinition> _biomes = new();
    private BiomeNoiseConfig? _biomeNoiseConfig;

    private const int GroundBase = 32;
    private const int TerrainHeight = 20;
    private const int WaterLevel = 28;
    private const int CaveThreshold = 45;
    private const int TreeMinHeight = 5;

    private record BiomeDefinition(
        string Name, int YMin, int YMax, float HeatPoint, float HumidityPoint,
        string TopBlock, string FillerBlock, int FillerDepth,
        string StoneBlock, string WaterBlock);

    private record BiomeNoiseConfig(
        float HeatOffset, float HeatScale, float[] HeatSpread,
        float HumidityOffset, float HumidityScale, float[] HumiditySpread);

    public void ConfigureTrees(bool generateTrees)
    {
        _generateTrees = generateTrees;
    }

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
        if (!File.Exists(biomesPath)) return;

        var json = File.ReadAllText(biomesPath);
        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;

        if (root.TryGetProperty("biomes", out var biomesEl))
        {
            foreach (var biome in biomesEl.EnumerateArray())
            {
                _biomes.Add(new BiomeDefinition(
                    biome.GetProperty("name").GetString() ?? "",
                    biome.GetProperty("yMin").GetInt32(),
                    biome.GetProperty("yMax").GetInt32(),
                    (float)biome.GetProperty("heatPoint").GetDouble(),
                    (float)biome.GetProperty("humidityPoint").GetDouble(),
                    biome.GetProperty("topBlock").GetString() ?? "grass",
                    biome.GetProperty("fillerBlock").GetString() ?? "dirt",
                    biome.GetProperty("fillerDepth").GetInt32(),
                    biome.GetProperty("stoneBlock").GetString() ?? "stone",
                    biome.GetProperty("waterBlock").GetString() ?? "water"
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

    public ushort[,,] GenerateChunk(int chunkX, int chunkY, int chunkZ)
    {
        var blocks = new ushort[Chunk.Size, Chunk.Size, Chunk.Size];
        var baseX = chunkX * Chunk.Size;
        var baseY = chunkY * Chunk.Size;
        var baseZ = chunkZ * Chunk.Size;

        for (int x = 0; x < Chunk.Size; x++)
        {
            for (int z = 0; z < Chunk.Size; z++)
            {
                var worldX = baseX + x;
                var worldZ = baseZ + z;
                var surfaceHeight = GetGroundHeight(worldX, worldZ);

                for (int y = 0; y < Chunk.Size; y++)
                {
                    var worldY = baseY + y;
                    blocks[x, y, z] = GetBlockAt(worldX, worldY, worldZ, surfaceHeight);
                }
            }
        }

        if (baseY >= 0 && baseY < 50)
        {
            GenerateDungeons(blocks, baseX, baseY, baseZ);
        }

        if (_generateTrees)
        {
            GenerateTrees(blocks, baseX, baseY, baseZ);
        }

        return blocks;
    }

    private void GenerateTrees(ushort[,,] blocks, int baseX, int baseY, int baseZ)
    {
        for (int x = 0; x < Chunk.Size; x++)
        {
            for (int z = 0; z < Chunk.Size; z++)
            {
                var worldX = baseX + x;
                var worldZ = baseZ + z;
                var surfaceHeight = GetGroundHeight(worldX, worldZ);
                var localSurfaceY = surfaceHeight - baseY;

                if (localSurfaceY < 0 || localSurfaceY >= Chunk.Size)
                {
                    continue;
                }

                if (surfaceHeight <= WaterLevel)
                {
                    continue;
                }

                var biome = GetBiomeAt(worldX, surfaceHeight, worldZ, surfaceHeight);
                var surfaceBlock = blocks[x, localSurfaceY, z];

                if (biome.Name == "desert")
                {
                    if (surfaceBlock == (ushort)BlockType.DesertSand)
                    {
                        var cactusNoise = PerlinNoise2D(worldX * 0.8f + 7000, worldZ * 0.8f + 7000);
                        if (cactusNoise > 0.7f)
                        {
                            GenerateCactus(blocks, x, localSurfaceY, z);
                        }
                        var deadBushNoise = PerlinNoise2D(worldX * 1.2f + 7500, worldZ * 1.2f + 7500);
                        if (deadBushNoise > 0.6f && localSurfaceY + 1 < Chunk.Size)
                        {
                            blocks[x, localSurfaceY + 1, z] = (ushort)BlockType.DeadBush;
                        }
                    }
                    continue;
                }

                if (biome.Name == "snow")
                {
                    if (surfaceBlock == (ushort)BlockType.Snow)
                    {
                        var pineNoise = PerlinNoise2D(worldX * 0.5f + 5000, worldZ * 0.5f + 5000);
                        if (pineNoise > 0.45f)
                        {
                            var rng = new Random(_seed + worldX * 73856093 ^ worldZ * 19349663);
                            GeneratePineTree(blocks, x, localSurfaceY, z, rng.Next(5, 8));
                        }
                    }
                    continue;
                }

                if (biome.Name == "grassland_ocean")
                {
                    continue;
                }

                var treeNoise = PerlinNoise2D(worldX * 0.5f + 5000, worldZ * 0.5f + 5000);
                if (treeNoise <= 0.35f)
                {
                    continue;
                }

                if (surfaceBlock != (ushort)BlockType.Grass)
                {
                    continue;
                }

                var rng2 = new Random(_seed + worldX * 73856093 ^ worldZ * 19349663);
                var tempNoise = PerlinNoise2D(worldX * 0.005f + 1000, worldZ * 0.005f + 1000);
                if (tempNoise > 0.25f)
                {
                    GenerateJungleTree(blocks, x, localSurfaceY, z, rng2.Next(6, 10));
                }
                else
                {
                    GenerateTree(blocks, x, localSurfaceY, z, baseX, baseY, baseZ, worldX, worldZ);
                }

                var flowerNoise = PerlinNoise2D(worldX * 2.0f + 8000, worldZ * 2.0f + 8000);
                if (flowerNoise > 0.6f && localSurfaceY + 1 < Chunk.Size
                    && blocks[x, localSurfaceY + 1, z] == (ushort)BlockType.Air)
                {
                    blocks[x, localSurfaceY + 1, z] = flowerNoise > 0.8
                        ? (ushort)BlockType.FlowerRed
                        : (ushort)BlockType.FlowerYellow;
                }

                var mushroomNoise = PerlinNoise2D(worldX * 1.5f + 8500, worldZ * 1.5f + 8500);
                if (mushroomNoise > 0.8f && localSurfaceY + 1 < Chunk.Size
                    && blocks[x, localSurfaceY + 1, z] == (ushort)BlockType.Air)
                {
                    blocks[x, localSurfaceY + 1, z] = rng2.Next(2) == 0
                        ? (ushort)BlockType.MushroomRedBlock
                        : (ushort)BlockType.MushroomBrownBlock;
                }

                var grassNoise = PerlinNoise2D(worldX * 3.0f + 9000, worldZ * 3.0f + 9000);
                if (grassNoise > 0.3f && localSurfaceY + 1 < Chunk.Size
                    && blocks[x, localSurfaceY + 1, z] == (ushort)BlockType.Air)
                {
                    blocks[x, localSurfaceY + 1, z] = (ushort)BlockType.TallGrass;
                }

                var pumpkinNoise = PerlinNoise2D(worldX * 0.3f + 9500, worldZ * 0.3f + 9500);
                if (pumpkinNoise > 0.85f)
                {
                    var px = x + rng2.Next(-2, 3);
                    var pz = z + rng2.Next(-2, 3);
                    if (px >= 0 && px < Chunk.Size && pz >= 0 && pz < Chunk.Size
                        && localSurfaceY + 1 < Chunk.Size
                        && blocks[px, localSurfaceY + 1, pz] == (ushort)BlockType.Air)
                    {
                        blocks[px, localSurfaceY + 1, pz] = (ushort)BlockType.PumpkinBlock;
                    }
                }
            }
        }
    }

    private void GenerateTree(ushort[,,] blocks, int x, int surfaceY, int z, int baseX, int baseY, int baseZ, int worldX, int worldZ)
    {
        var rng = new Random(_seed + worldX * 73856093 ^ worldZ * 19349663);
        var trunkHeight = rng.Next(4, 7);
        var treeType = rng.Next(4);

        if (treeType == 0)
        {
            GenerateOakTree(blocks, x, surfaceY, z, trunkHeight);
        }
        else if (treeType == 1)
        {
            GeneratePineTree(blocks, x, surfaceY, z, trunkHeight);
        }
        else if (treeType == 2)
        {
            GenerateBirchTree(blocks, x, surfaceY, z, trunkHeight);
        }
        else
        {
            GenerateJungleTree(blocks, x, surfaceY, z, trunkHeight + 2);
        }
    }

    private static void GenerateCactus(ushort[,,] blocks, int x, int surfaceY, int z)
    {
        var height = Random.Shared.Next(1, 4);
        for (int dy = 1; dy <= height; dy++)
        {
            var ly = surfaceY + dy;
            if (ly >= 0 && ly < Chunk.Size)
            {
                blocks[x, ly, z] = (ushort)BlockType.Cactus;
            }
        }
    }

    private void GenerateOakTree(ushort[,,] blocks, int x, int surfaceY, int z, int trunkHeight)
    {
        for (int ty = 1; ty <= trunkHeight; ty++)
        {
            var ly = surfaceY + ty;
            if (ly >= 0 && ly < Chunk.Size)
            {
                blocks[x, ly, z] = (ushort)BlockType.Wood;
            }
        }

        var canopyBase = surfaceY + trunkHeight - 1;
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
                    {
                        blocks[lx, ly, lz] = (ushort)BlockType.Leaves;
                    }
                }
            }
        }
    }

    private void GeneratePineTree(ushort[,,] blocks, int x, int surfaceY, int z, int trunkHeight)
    {
        var height = trunkHeight + 2;
        for (int ty = 1; ty <= height; ty++)
        {
            var ly = surfaceY + ty;
            if (ly >= 0 && ly < Chunk.Size)
            {
                blocks[x, ly, z] = (ushort)BlockType.Wood;
            }
        }

        for (int ty = trunkHeight - 2; ty <= height; ty++)
        {
            var ly = surfaceY + ty;
            if (ly < 0 || ly >= Chunk.Size) continue;

            var distFromTop = height - ty;
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
                    {
                        blocks[lx, ly, lz] = (ushort)BlockType.Leaves;
                    }
                }
            }
        }
    }

    private void GenerateBirchTree(ushort[,,] blocks, int x, int surfaceY, int z, int trunkHeight)
    {
        for (int ty = 1; ty <= trunkHeight; ty++)
        {
            var ly = surfaceY + ty;
            if (ly >= 0 && ly < Chunk.Size)
            {
                blocks[x, ly, z] = (ushort)BlockType.Wood;
            }
        }

        var canopyBase = surfaceY + trunkHeight;
        for (int dy = -1; dy <= 1; dy++)
        {
            var ly = canopyBase + dy;
            if (ly < 0 || ly >= Chunk.Size) continue;

            var radius = dy == 0 ? 2 : 1;
            for (int dx = -radius; dx <= radius; dx++)
            {
                for (int dz = -radius; dz <= radius; dz++)
                {
                    if (Math.Abs(dx) + Math.Abs(dz) > radius + 1) continue;
                    var lx = x + dx;
                    var lz = z + dz;
                    if (lx < 0 || lx >= Chunk.Size || lz < 0 || lz >= Chunk.Size) continue;
                    if (blocks[lx, ly, lz] == (ushort)BlockType.Air)
                    {
                        blocks[lx, ly, lz] = (ushort)BlockType.Leaves;
                    }
                }
            }
        }
    }

    private static void GenerateJungleTree(ushort[,,] blocks, int x, int surfaceY, int z, int trunkHeight)
    {
        for (int ty = 1; ty <= trunkHeight; ty++)
        {
            var ly = surfaceY + ty;
            if (ly >= 0 && ly < Chunk.Size)
            {
                blocks[x, ly, z] = (ushort)BlockType.JungleWood;

                if (ty > 2 && ty < trunkHeight - 1)
                {
                    if (Random.Shared.Next(3) == 0)
                    {
                        var sideDx = Random.Shared.Next(2) == 0 ? -1 : 1;
                        var sx = x + sideDx;
                        if (sx >= 0 && sx < Chunk.Size)
                        {
                            blocks[sx, ly, z] = (ushort)BlockType.JungleWood;
                        }
                    }
                }
            }
        }

        var canopyBase = surfaceY + trunkHeight - 2;
        for (int dy = 0; dy <= 4; dy++)
        {
            var ly = canopyBase + dy;
            if (ly < 0 || ly >= Chunk.Size) continue;

            var radius = dy <= 1 ? 3 : dy <= 3 ? 2 : 1;
            for (int dx = -radius; dx <= radius; dx++)
            {
                for (int dz = -radius; dz <= radius; dz++)
                {
                    if (dx * dx + dz * dz > radius * radius + 2) continue;
                    var lx = x + dx;
                    var lz = z + dz;
                    if (lx < 0 || lx >= Chunk.Size || lz < 0 || lz >= Chunk.Size) continue;
                    if (blocks[lx, ly, lz] == (ushort)BlockType.Air)
                    {
                        blocks[lx, ly, lz] = (ushort)BlockType.JungleLeaves;
                    }
                }
            }
        }

        for (int vineTry = 0; vineTry < 4; vineTry++)
        {
            var vx = x + Random.Shared.Next(-2, 3);
            var vz = z + Random.Shared.Next(-2, 3);
            if (vx < 0 || vx >= Chunk.Size || vz < 0 || vz >= Chunk.Size) continue;

            for (int vy = surfaceY + 1; vy < canopyBase; vy++)
            {
                if (blocks[vx, vy, vz] == (ushort)BlockType.Air)
                {
                    blocks[vx, vy, vz] = (ushort)BlockType.JungleLeaves;
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

        var noise2D = PerlinNoise2D(x * 0.01f, z * 0.01f);
        var detailNoise = PerlinNoise2D(x * 0.05f, z * 0.05f) * 0.3f;
        var height = GroundBase + (int)((noise2D + detailNoise) * TerrainHeight);

        if (y > height)
        {
            if (y <= WaterLevel) return (ushort)BlockType.Water;
            return (ushort)BlockType.Air;
        }

        var biome = GetBiomeAt(x, y, z, surfaceHeight);

        if (y == height)
        {
            if (height <= WaterLevel && biome.TopBlock == "grass") return (ushort)BlockType.Sand;
            return GetBlockTypeByName(biome.TopBlock);
        }

        if (y > height - biome.FillerDepth)
        {
            return GetBlockTypeByName(biome.FillerBlock);
        }

        if (y > 1)
        {
            if (IsCave(x, y, z)) return (ushort)BlockType.Air;

            var oreNoise = PerlinNoise3D(x * 0.1f, y * 0.1f, z * 0.1f);
            if (y < 16 && oreNoise > 0.85f) return (ushort)BlockType.OreDiamond;
            if (y < 32 && oreNoise > 0.8f) return (ushort)BlockType.OreGold;
            if (y < 48 && oreNoise > 0.75f) return (ushort)BlockType.OreIron;
            if (y < 64 && PerlinNoise3D(x * 0.15f, y * 0.15f, z * 0.15f) > 0.82f) return (ushort)BlockType.Coal;
            if (y < 48 && PerlinNoise3D(x * 0.12f + 6000, y * 0.12f, z * 0.12f + 6000) > 0.85f) return (ushort)BlockType.GoldOre;
            if (y < 32 && PerlinNoise3D(x * 0.11f + 7000, y * 0.11f, z * 0.11f + 7000) > 0.87f) return (ushort)BlockType.RedstoneOre;
            if (y < 16 && PerlinNoise3D(x * 0.13f + 8000, y * 0.13f, z * 0.13f + 8000) > 0.88f) return (ushort)BlockType.EmeraldOre;
            if (y < 96 && PerlinNoise3D(x * 0.14f + 9000, y * 0.14f, z * 0.14f + 9000) > 0.84f) return (ushort)BlockType.CopperOre;
            if (y < 48 && PerlinNoise3D(x * 0.1f + 9500, y * 0.1f, z * 0.1f + 9500) > 0.86f) return (ushort)BlockType.LapisOre;

            var gravelNoise = PerlinNoise3D(x * 0.12f + 2000, y * 0.12f, z * 0.12f + 2000);
            if (gravelNoise > 0.9f && y < 40) return (ushort)BlockType.Gravel;

            var clayNoise = PerlinNoise3D(x * 0.09f + 4000, y * 0.09f, z * 0.09f + 4000);
            if (clayNoise > 0.92f && y < WaterLevel + 5 && y > WaterLevel - 5) return (ushort)BlockType.Clay;

            return GetBlockTypeByName(biome.StoneBlock);
        }

        return (ushort)BlockType.Bedrock;
    }

    private BiomeDefinition GetBiomeAt(int x, int y, int z, int surfaceHeight)
    {
        if (_biomes.Count == 0)
        {
            var biomeNoise = PerlinNoise2D(x * 0.005f + 1000, z * 0.005f + 1000);
            if (biomeNoise > 0.3f) return new BiomeDefinition("desert", 4, 31000, 90, 10, "sand", "sand", 3, "stone", "water");
            if (biomeNoise < -0.4f) return new BiomeDefinition("snow", 4, 31000, 10, 40, "snow", "dirt", 1, "stone", "water");
            return new BiomeDefinition("grassland", 4, 31000, 50, 50, "grass", "dirt", 1, "stone", "water");
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
            "sand" => (ushort)BlockType.Sand,
            "desert_sand" => (ushort)BlockType.DesertSand,
            "snow" => (ushort)BlockType.Snow,
            "stone" => (ushort)BlockType.Stone,
            "desert_stone" => (ushort)BlockType.DesertStone,
            "water" => (ushort)BlockType.Water,
            "grassland_ocean" => (ushort)BlockType.Sand,
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

    private float PerlinNoise2D(float x, float y)
    {
        return PerlinNoise3D(x, y, 0);
    }

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
        return GroundBase + (int)((noise2D + detailNoise) * TerrainHeight);
    }
}
