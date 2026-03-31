using WebGameServer.Core.World;

namespace WebGameServer.Core.World.Generators;

public class NoiseWorldGenerator : IWorldGenerator
{
    public string Name => "noise";
    private int _seed;
    private int[] _permutationTable = new int[512];
    private bool _generateTrees = true;

    private const int GroundBase = 32;
    private const int TerrainHeight = 20;
    private const int WaterLevel = 28;
    private const int CaveThreshold = 45;
    private const int TreeMinHeight = 5;

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

                if (blocks[x, localSurfaceY, z] != (ushort)BlockType.Grass)
                {
                    continue;
                }

                if (surfaceHeight <= WaterLevel)
                {
                    continue;
                }

                var biomeNoise = PerlinNoise2D(worldX * 0.005f + 1000, worldZ * 0.005f + 1000);
                if (biomeNoise > 0.3f)
                {
                    continue;
                }

                var treeNoise = PerlinNoise2D(worldX * 0.5f + 5000, worldZ * 0.5f + 5000);
                if (treeNoise <= 0.35f)
                {
                    continue;
                }

                GenerateTree(blocks, x, localSurfaceY, z, baseX, baseY, baseZ, worldX, worldZ);
            }
        }
    }

    private void GenerateTree(ushort[,,] blocks, int x, int surfaceY, int z, int baseX, int baseY, int baseZ, int worldX, int worldZ)
    {
        var rng = new Random(_seed + worldX * 73856093 ^ worldZ * 19349663);
        var trunkHeight = rng.Next(4, 7);
        var treeType = rng.Next(3);

        if (treeType == 0)
        {
            GenerateOakTree(blocks, x, surfaceY, z, trunkHeight);
        }
        else if (treeType == 1)
        {
            GeneratePineTree(blocks, x, surfaceY, z, trunkHeight);
        }
        else
        {
            GenerateBirchTree(blocks, x, surfaceY, z, trunkHeight);
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

    private void GenerateDungeons(ushort[,,] blocks, int baseX, int baseY, int baseZ)
    {
        var rng = new Random(_seed + baseX * 73856093 ^ baseZ * 19349663 ^ baseY * 83492791);

        for (int attempt = 0; attempt < 2; attempt++)
        {
            var cx = rng.Next(2, Chunk.Size - 2);
            var cy = rng.Next(1, Chunk.Size - 4);
            var cz = rng.Next(2, Chunk.Size - 2);

            if (blocks[cx, cy, cz] != (ushort)BlockType.Stone) continue;

            var worldCX = baseX + cx;
            var worldCY = baseY + cy;
            if (worldCY > 30) continue;

            var dungeonNoise = PerlinNoise2D(worldCX * 0.02f + 3000, baseZ * 0.02f + 3000);
            if (dungeonNoise < 0.6f) continue;

            var roomW = rng.Next(3, 6);
            var roomH = rng.Next(3, 5);
            var roomD = rng.Next(3, 6);

            for (int dx = 0; dx < roomW; dx++)
            {
                for (int dy = 0; dy < roomH; dy++)
                {
                    for (int dz = 0; dz < roomD; dz++)
                    {
                        var lx = cx + dx;
                        var ly = cy + dy;
                        var lz = cz + dz;
                        if (lx >= Chunk.Size || ly >= Chunk.Size || lz >= Chunk.Size) continue;

                        if (dx == 0 || dx == roomW - 1 || dy == 0 || dy == roomH - 1 || dz == 0 || dz == roomD - 1)
                        {
                            blocks[lx, ly, lz] = rng.NextDouble() > 0.5
                                ? (ushort)BlockType.MossyCobblestone
                                : (ushort)BlockType.Cobblestone;
                        }
                        else
                        {
                            blocks[lx, ly, lz] = (ushort)BlockType.Air;
                        }
                    }
                }
            }

            if (roomW > 3 && roomD > 3 && cy + 1 < Chunk.Size)
            {
                blocks[cx, cy + 1, cz] = (ushort)BlockType.Cobblestone;
                blocks[cx, cy + 2, cz] = (ushort)BlockType.Air;
            }
        }
    }

    private ushort GetBlockAt(int x, int y, int z, int surfaceHeight)
    {
        if (y == 0) return (ushort)BlockType.Bedrock;
        if (y < 0) return (ushort)BlockType.Air;

        var noise2D = PerlinNoise2D(x * 0.01f, z * 0.01f);
        var detailNoise = PerlinNoise2D(x * 0.05f, z * 0.05f) * 0.3f;
        var height = GroundBase + (int)((noise2D + detailNoise) * TerrainHeight);

        var biomeNoise = PerlinNoise2D(x * 0.005f + 1000, z * 0.005f + 1000);
        bool isSandyBiome = biomeNoise > 0.3f;

        if (y > height)
        {
            if (y <= WaterLevel) return (ushort)BlockType.Water;
            return (ushort)BlockType.Air;
        }

        if (y == height)
        {
            if (isSandyBiome) return (ushort)BlockType.Sand;
            if (height <= WaterLevel) return (ushort)BlockType.Sand;
            return (ushort)BlockType.Grass;
        }

        if (y > height - 4)
        {
            if (isSandyBiome) return (ushort)BlockType.Sand;
            return (ushort)BlockType.Dirt;
        }

        if (y > 1)
        {
            if (IsCave(x, y, z)) return (ushort)BlockType.Air;

            var oreNoise = PerlinNoise3D(x * 0.1f, y * 0.1f, z * 0.1f);
            if (y < 16 && oreNoise > 0.85f) return (ushort)BlockType.OreDiamond;
            if (y < 32 && oreNoise > 0.8f) return (ushort)BlockType.OreGold;
            if (y < 48 && oreNoise > 0.75f) return (ushort)BlockType.OreIron;
            if (y < 64 && PerlinNoise3D(x * 0.15f, y * 0.15f, z * 0.15f) > 0.82f) return (ushort)BlockType.Coal;

            var gravelNoise = PerlinNoise3D(x * 0.12f + 2000, y * 0.12f, z * 0.12f + 2000);
            if (gravelNoise > 0.9f && y < 40) return (ushort)BlockType.Gravel;

            var clayNoise = PerlinNoise3D(x * 0.09f + 4000, y * 0.09f, z * 0.09f + 4000);
            if (clayNoise > 0.92f && y < WaterLevel + 5 && y > WaterLevel - 5) return (ushort)BlockType.Clay;

            return (ushort)BlockType.Stone;
        }

        return (ushort)BlockType.Bedrock;
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
