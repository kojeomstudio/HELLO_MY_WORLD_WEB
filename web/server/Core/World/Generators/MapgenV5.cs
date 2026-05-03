using System.Text.Json;
using WebGameServer.Core.World;
using ItemStack = WebGameServer.Core.Player.ItemStack;

namespace WebGameServer.Core.World.Generators;

public class MapgenV5 : IWorldGenerator
{
    public string Name => "v5";

    private int _seed;
    private int[] _permutationTable = new int[512];

    public record NoiseParams(
        int Seed, int Octaves, float Persistence, float SpreadX, float SpreadY, float SpreadZ);

    private NoiseParams _fillerDepthNoise = new(0, 3, 0.5f, 150f, 150f, 150f);
    private NoiseParams _factorNoise = new(0, 2, 0.5f, 150f, 150f, 150f);
    private NoiseParams _groundNoise3D = new(0, 3, 0.5f, 80f, 80f, 80f);

    private readonly List<BiomeDefinition> _biomes = new();

    private const int GroundBase = 32;
    private const int WaterLevel = 28;

    private record BiomeDefinition(
        string Name, int YMin, int YMax, float HeatPoint, float HumidityPoint,
        string TopBlock, string FillerBlock, int FillerDepth,
        string StoneBlock, string WaterBlock,
        string[] Decorations);

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
                        decorations.ToArray()
                    ));
                }
            }
        }

        if (_biomes.Count == 0)
        {
            _biomes.Add(new BiomeDefinition("grassland", 4, 31000, 50, 50, "grass", "dirt", 3, "stone", "water", new[] { "tall_grass" }));
            _biomes.Add(new BiomeDefinition("desert", 4, 31000, 90, 10, "sand", "sand", 3, "desert_stone", "water", Array.Empty<string>()));
            _biomes.Add(new BiomeDefinition("snow", 4, 31000, 10, 40, "snow", "dirt", 1, "stone", "water", new[] { "tall_grass" }));
        }
    }

    public void Configure(NoiseParams fillerDepthNoise, NoiseParams factorNoise, NoiseParams groundNoise3D)
    {
        _fillerDepthNoise = fillerDepthNoise;
        _factorNoise = factorNoise;
        _groundNoise3D = groundNoise3D;
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

                var fillerDepth = GetFillerDepth(worldX, worldZ);
                var factor = GetFactor(worldX, worldZ);
                var surfaceHeight = GetGroundHeight(worldX, worldZ);

                for (int y = 0; y < Chunk.Size; y++)
                {
                    var worldY = baseY + y;
                    blocks[x, y, z] = GetBlockAt(worldX, worldY, worldZ, surfaceHeight, fillerDepth, factor);
                }
            }
        }

        GenerateCaves(blocks, baseX, baseY, baseZ);
        GenerateDecorations(blocks, baseX, baseY, baseZ);

        return blocks;
    }

    public int GetGroundHeight(int x, int z)
    {
        var fillerDepth = GetFillerDepth(x, z);
        var factor = GetFactor(x, z);
        var terrainHeight = GroundBase + (int)(fillerDepth * factor);

        var groundNoise = PerlinNoise3D(
            x / _groundNoise3D.SpreadX,
            terrainHeight / _groundNoise3D.SpreadY,
            z / _groundNoise3D.SpreadZ);

        return terrainHeight + (int)(groundNoise * 4);
    }

    public List<(int X, int Y, int Z, List<ItemStack> Loot)> PopPendingDungeonChests()
    {
        return new();
    }

    private float GetFillerDepth(int x, int z)
    {
        var noise = OctavePerlin2D(
            x / _fillerDepthNoise.SpreadX,
            z / _fillerDepthNoise.SpreadZ,
            _fillerDepthNoise.Octaves,
            _fillerDepthNoise.Persistence,
            _fillerDepthNoise.Seed);
        return (noise + 1) * 10;
    }

    private float GetFactor(int x, int z)
    {
        var noise = OctavePerlin2D(
            x / _factorNoise.SpreadX,
            z / _factorNoise.SpreadZ,
            _factorNoise.Octaves,
            _factorNoise.Persistence,
            _factorNoise.Seed + 1000);
        return Math.Max(0.2f, (noise + 1) * 0.5f);
    }

    private ushort GetBlockAt(int x, int y, int z, int surfaceHeight, float fillerDepth, float factor)
    {
        if (y == 0) return (ushort)BlockType.Bedrock;
        if (y < 0) return (ushort)BlockType.Air;

        if (y > surfaceHeight)
        {
            if (y <= WaterLevel) return (ushort)BlockType.Water;
            return (ushort)BlockType.Air;
        }

        var biome = GetBiomeAt(x, z);

        if (y == surfaceHeight)
        {
            if (surfaceHeight <= WaterLevel && biome.TopBlock == "grass") return (ushort)BlockType.Sand;
            return GetBlockTypeByName(biome.TopBlock);
        }

        var fillerMax = (int)(fillerDepth * factor);
        if (y > surfaceHeight - fillerMax)
        {
            return GetBlockTypeByName(biome.FillerBlock);
        }

        return GetBlockTypeByName(biome.StoneBlock);
    }

    private BiomeDefinition GetBiomeAt(int x, int z)
    {
        if (_biomes.Count == 0)
        {
            return new BiomeDefinition("grassland", 4, 31000, 50, 50, "grass", "dirt", 3, "stone", "water", Array.Empty<string>());
        }

        var biomeNoise = PerlinNoise2D(x * 0.005f + 1000, z * 0.005f + 1000);
        if (biomeNoise > 0.3f) return _biomes.FirstOrDefault(b => b.Name == "desert") ?? _biomes[0];
        if (biomeNoise < -0.4f) return _biomes.FirstOrDefault(b => b.Name == "snow") ?? _biomes[0];
        return _biomes.FirstOrDefault(b => b.Name == "grassland") ?? _biomes[0];
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

                    if (worldY <= 1 || worldY >= GroundBase + 20) continue;

                    var caveNoise = PerlinNoise3D(
                        worldX / _groundNoise3D.SpreadX * 2,
                        worldY / _groundNoise3D.SpreadY * 2,
                        worldZ / _groundNoise3D.SpreadZ * 2);

                    if (caveNoise > 0.6f)
                    {
                        blocks[x, y, z] = (ushort)BlockType.Air;
                    }
                }
            }
        }
    }

    private void GenerateDecorations(ushort[,,] blocks, int baseX, int baseY, int baseZ)
    {
        for (int x = 0; x < Chunk.Size; x++)
        {
            for (int z = 0; z < Chunk.Size; z++)
            {
                var worldX = baseX + x;
                var worldZ = baseZ + z;
                var surfaceHeight = GetGroundHeight(worldX, worldZ);
                var localSurfaceY = surfaceHeight - baseY;

                if (localSurfaceY < 0 || localSurfaceY >= Chunk.Size - 1) continue;
                if (surfaceHeight <= WaterLevel) continue;

                var biome = GetBiomeAt(worldX, worldZ);
                if (biome.Decorations.Length == 0) continue;

                var rng = new Random(_seed + worldX * 73856093 ^ worldZ * 19349663);
                var decoNoise = PerlinNoise2D(worldX * 3.0f + 9000, worldZ * 3.0f + 9000);

                if (decoNoise > 0.3f && blocks[x, localSurfaceY + 1, z] == (ushort)BlockType.Air)
                {
                    var decoIndex = rng.Next(biome.Decorations.Length);
                    var deco = biome.Decorations[decoIndex];
                    var decoType = GetDecorationBlockType(deco);
                    if (decoType != BlockType.Air)
                    {
                        blocks[x, localSurfaceY + 1, z] = (ushort)decoType;
                    }
                }
            }
        }
    }

    private static BlockType GetDecorationBlockType(string name)
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
            "cobblestone" => (ushort)BlockType.Cobblestone,
            "sandstone" => (ushort)BlockType.SandStone,
            "cactus" => (ushort)BlockType.Cactus,
            _ => (ushort)BlockType.Dirt
        };
    }

    private float OctavePerlin2D(float x, float y, int octaves, float persistence, int seedOffset)
    {
        var total = 0f;
        var frequency = 1f;
        var amplitude = 1f;
        var maxValue = 0f;

        for (int i = 0; i < octaves; i++)
        {
            total += PerlinNoise2D(x * frequency + seedOffset * 0.1f, y * frequency + seedOffset * 0.1f) * amplitude;
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= 2;
        }

        return total / maxValue;
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
