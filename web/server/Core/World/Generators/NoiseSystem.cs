namespace WebGameServer.Core.World.Generators;

public readonly record struct NoiseParams(
    float Offset, float Scale,
    float SpreadX, float SpreadY, float SpreadZ,
    int Seed, int Octaves, float Persistence, float Lacunarity,
    NoiseFlags Flags = NoiseFlags.Default);

[Flags]
public enum NoiseFlags
{
    None = 0,
    Eased = 1,
    AbsValue = 2,
    Default = Eased
}

public sealed class PerlinNoise
{
    private readonly int[] _perm = new int[512];
    private readonly int _seed;

    public PerlinNoise(int seed)
    {
        _seed = seed;
        var p = new int[256];
        for (int i = 0; i < 256; i++) p[i] = i;

        var rng = new PcgRandom((uint)seed);
        for (int i = 255; i > 0; i--)
        {
            var j = (int)(rng.Next() % (uint)(i + 1));
            (p[i], p[j]) = (p[j], p[i]);
        }

        for (int i = 0; i < 512; i++)
            _perm[i] = p[i & 255];
    }

    public float Noise2D(float x, float y)
    {
        return Noise3D(x, y, 0f);
    }

    public float Noise3D(float x, float y, float z)
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

        var aaa = _perm[_perm[_perm[xi] + yi] + zi];
        var aba = _perm[_perm[_perm[xi] + Inc(yi)] + zi];
        var aab = _perm[_perm[_perm[xi] + yi] + Inc(zi)];
        var abb = _perm[_perm[_perm[xi] + Inc(yi)] + Inc(zi)];
        var baa = _perm[_perm[_perm[Inc(xi)] + yi] + zi];
        var bba = _perm[_perm[_perm[Inc(xi)] + Inc(yi)] + zi];
        var bab = _perm[_perm[_perm[Inc(xi)] + yi] + Inc(zi)];
        var bbb = _perm[_perm[_perm[Inc(xi)] + Inc(yi)] + Inc(zi)];

        var x1 = Lerp(Grad(aaa, xf, yf, zf), Grad(baa, xf - 1, yf, zf), u);
        var x2 = Lerp(Grad(aba, xf, yf - 1, zf), Grad(bba, xf - 1, yf - 1, zf), u);
        var y1 = Lerp(x1, x2, v);
        var x3 = Lerp(Grad(aab, xf, yf, zf - 1), Grad(bab, xf - 1, yf, zf - 1), u);
        var x4 = Lerp(Grad(abb, xf, yf - 1, zf - 1), Grad(bbb, xf - 1, yf - 1, zf - 1), u);
        var y2 = Lerp(x3, x4, v);

        return Lerp(y1, y2, w);
    }

    public float FractalNoise2D(float x, float y, int octaves, float persistence, float lacunarity)
    {
        float result = 0f;
        float amplitude = 1f;
        float frequency = 1f;
        float maxAmplitude = 0f;

        for (int i = 0; i < octaves; i++)
        {
            result += amplitude * Noise2D(x * frequency, y * frequency);
            maxAmplitude += amplitude;
            amplitude *= persistence;
            frequency *= lacunarity;
        }

        return result / maxAmplitude;
    }

    public float FractalNoise3D(float x, float y, float z, int octaves, float persistence, float lacunarity)
    {
        float result = 0f;
        float amplitude = 1f;
        float frequency = 1f;
        float maxAmplitude = 0f;

        for (int i = 0; i < octaves; i++)
        {
            result += amplitude * Noise3D(x * frequency, y * frequency, z * frequency);
            maxAmplitude += amplitude;
            amplitude *= persistence;
            frequency *= lacunarity;
        }

        return result / maxAmplitude;
    }

    public float Noise2DEx(NoiseParams np, float x, float y, int seedOffset = 0)
    {
        var nx = x / Math.Max(np.SpreadX, 0.001f);
        var ny = y / Math.Max(np.SpreadY, 0.001f);
        var seededX = nx + np.Seed + seedOffset;
        var seededY = ny + np.Seed * 0.5f + seedOffset;

        var value = FractalNoise2D(seededX, seededY, np.Octaves, np.Persistence, np.Lacunarity);
        value = np.Scale * value + np.Offset;

        if (np.Flags.HasFlag(NoiseFlags.AbsValue))
            value = MathF.Abs(value);

        return value;
    }

    public float Noise3DEx(NoiseParams np, float x, float y, float z, int seedOffset = 0)
    {
        var nx = x / Math.Max(np.SpreadX, 0.001f);
        var ny = y / Math.Max(np.SpreadY, 0.001f);
        var nz = z / Math.Max(np.SpreadZ, 0.001f);
        var seededX = nx + np.Seed + seedOffset;
        var seededY = ny + np.Seed * 0.5f + seedOffset;
        var seededZ = nz + np.Seed * 0.3f + seedOffset;

        var value = FractalNoise3D(seededX, seededY, seededZ, np.Octaves, np.Persistence, np.Lacunarity);
        value = np.Scale * value + np.Offset;

        if (np.Flags.HasFlag(NoiseFlags.AbsValue))
            value = MathF.Abs(value);

        return value;
    }

    public float[] NoiseGrid2D(NoiseParams np, float startX, float startZ, int sizeX, int sizeZ, float stepX, float stepZ)
    {
        var result = new float[sizeX * sizeZ];
        for (int x = 0; x < sizeX; x++)
        {
            for (int z = 0; z < sizeZ; z++)
            {
                result[x * sizeZ + z] = Noise2DEx(np, startX + x * stepX, startZ + z * stepZ);
            }
        }
        return result;
    }

    public float[] NoiseGrid3D(NoiseParams np, float startX, float startY, float startZ,
        int sizeX, int sizeY, int sizeZ, float stepX, float stepY, float stepZ)
    {
        var result = new float[sizeX * sizeY * sizeZ];
        for (int x = 0; x < sizeX; x++)
        {
            for (int y = 0; y < sizeY; y++)
            {
                for (int z = 0; z < sizeZ; z++)
                {
                    result[x * sizeY * sizeZ + y * sizeZ + z] =
                        Noise3DEx(np, startX + x * stepX, startY + y * stepY, startZ + z * stepZ);
                }
            }
        }
        return result;
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

public sealed class PcgRandom
{
    private ulong _state;
    private readonly ulong _inc;

    public PcgRandom(uint seed)
    {
        _state = seed;
        _inc = (ulong)(seed | 1) * 6364136223846793005UL + 1442695040888963407UL;
        Next();
    }

    public uint Next()
    {
        var oldState = _state;
        _state = oldState * 6364136223846793005UL + _inc;
        var xorShifted = (uint)(((oldState >> 18) ^ oldState) >> 27);
        var rot = (int)(oldState >> 59);
        return (xorShifted >> rot) | (xorShifted << ((-rot) & 31));
    }

    public int NextInt(int max)
    {
        return (int)(Next() % (uint)max);
    }

    public int NextInt(int min, int max)
    {
        return min + (int)(Next() % (uint)(max - min));
    }

    public float NextFloat()
    {
        return (float)(Next() >> 1) / (float)int.MaxValue;
    }

    public float NextFloat(float min, float max)
    {
        return min + NextFloat() * (max - min);
    }

    public double NextDouble()
    {
        return (double)(Next() >> 1) / (double)uint.MaxValue;
    }

    public uint Range(uint min, uint max)
    {
        return min + Next() % (max - min);
    }
}

public sealed class NoiseBuffer2D
{
    private readonly float[] _data;
    public int SizeX { get; }
    public int SizeZ { get; }

    public NoiseBuffer2D(int sizeX, int sizeZ)
    {
        SizeX = sizeX;
        SizeZ = sizeZ;
        _data = new float[sizeX * sizeZ];
    }

    public float this[int x, int z]
    {
        get => _data[x * SizeZ + z];
        set => _data[x * SizeZ + z] = value;
    }

    public static NoiseBuffer2D Generate(PerlinNoise noise, NoiseParams np,
        float startX, float startZ, int sizeX, int sizeZ, float stepX, float stepZ)
    {
        var buffer = new NoiseBuffer2D(sizeX, sizeZ);
        for (int x = 0; x < sizeX; x++)
            for (int z = 0; z < sizeZ; z++)
                buffer[x, z] = noise.Noise2DEx(np, startX + x * stepX, startZ + z * stepZ);
        return buffer;
    }
}

public sealed class NoiseBuffer3D
{
    private readonly float[] _data;
    public int SizeX { get; }
    public int SizeY { get; }
    public int SizeZ { get; }

    public NoiseBuffer3D(int sizeX, int sizeY, int sizeZ)
    {
        SizeX = sizeX;
        SizeY = sizeY;
        SizeZ = sizeZ;
        _data = new float[sizeX * sizeY * sizeZ];
    }

    public float this[int x, int y, int z]
    {
        get => _data[x * SizeY * SizeZ + y * SizeZ + z];
        set => _data[x * SizeY * SizeZ + y * SizeZ + z] = value;
    }

    public static NoiseBuffer3D Generate(PerlinNoise noise, NoiseParams np,
        float startX, float startY, float startZ,
        int sizeX, int sizeY, int sizeZ, float stepX, float stepY, float stepZ)
    {
        var buffer = new NoiseBuffer3D(sizeX, sizeY, sizeZ);
        for (int x = 0; x < sizeX; x++)
            for (int y = 0; y < sizeY; y++)
                for (int z = 0; z < sizeZ; z++)
                    buffer[x, y, z] = noise.Noise3DEx(np,
                        startX + x * stepX, startY + y * stepY, startZ + z * stepZ);
        return buffer;
    }
}
