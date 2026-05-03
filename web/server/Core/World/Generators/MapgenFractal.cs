using WebGameServer.Core.World;
using ItemStack = WebGameServer.Core.Player.ItemStack;

namespace WebGameServer.Core.World.Generators;

public class MapgenFractal : IWorldGenerator
{
    public string Name => "fractal";

    private int _seed;
    private int _fractalType = 1;
    private int _iterations = 256;
    private double _scale = 40.0;
    private double _offsetX = 0.0;
    private double _offsetY = 0.0;
    private double _juliaX = 0.0;
    private double _juliaY = 0.0;

    private const int GroundBase = 32;

    public void Initialize(int seed)
    {
        _seed = seed;
        var rng = new Random(seed);
        _juliaX = rng.NextDouble() * 2.0 - 1.0;
        _juliaY = rng.NextDouble() * 2.0 - 1.0;
    }

    public void LoadBiomes(string dataPath)
    {
    }

    public void Configure(int fractalType, int iterations, double scale, double offsetX, double offsetY)
    {
        _fractalType = fractalType;
        _iterations = iterations;
        _scale = scale;
        _offsetX = offsetX;
        _offsetY = offsetY;
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
                    blocks[x, y, z] = GetBlockAt(worldY, surfaceHeight);
                }
            }
        }

        return blocks;
    }

    public int GetGroundHeight(int x, int z)
    {
        var nx = (x + _offsetX) / _scale;
        var nz = (z + _offsetY) / _scale;

        var iterations = ComputeFractal(nx, nz);
        var normalizedHeight = (double)iterations / _iterations;

        var height = GroundBase + (int)(normalizedHeight * 40) - 10;

        return Math.Clamp(height, 1, GroundBase + 30);
    }

    public List<(int X, int Y, int Z, List<ItemStack> Loot)> PopPendingDungeonChests()
    {
        return new();
    }

    private int ComputeFractal(double cx, double cz)
    {
        double zx, zy;

        if (_fractalType == 2)
        {
            zx = cx;
            zy = cz;
            cx = _juliaX;
            cz = _juliaY;
        }
        else
        {
            zx = 0;
            zy = 0;
        }

        for (int i = 0; i < _iterations; i++)
        {
            var zx2 = zx * zx;
            var zy2 = zy * zy;

            if (zx2 + zy2 > 4.0) return i;

            zy = 2.0 * zx * zy + cz;
            zx = zx2 - zy2 + cx;
        }

        return _iterations;
    }

    private static ushort GetBlockAt(int y, int surfaceHeight)
    {
        if (y == 0) return (ushort)BlockType.Bedrock;
        if (y < 0) return (ushort)BlockType.Air;

        if (y > surfaceHeight)
        {
            return (ushort)BlockType.Air;
        }

        if (y == surfaceHeight)
        {
            return (ushort)BlockType.Stone;
        }

        if (y > surfaceHeight - 3)
        {
            return (ushort)BlockType.Dirt;
        }

        return (ushort)BlockType.Stone;
    }
}
