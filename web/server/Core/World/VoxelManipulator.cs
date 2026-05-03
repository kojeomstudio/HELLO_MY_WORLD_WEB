namespace WebGameServer.Core.World;

public class VoxelManipulator
{
    private readonly Block?[, ,] _data;
    private readonly int _minX;
    private readonly int _minY;
    private readonly int _minZ;
    private readonly int _sizeX;
    private readonly int _sizeY;
    private readonly int _sizeZ;
    private bool _modified;

    public int MinX => _minX;
    public int MinY => _minY;
    public int MinZ => _minZ;
    public int MaxX => _minX + _sizeX - 1;
    public int MaxY => _minY + _sizeY - 1;
    public int MaxZ => _minZ + _sizeZ - 1;
    public int SizeX => _sizeX;
    public int SizeY => _sizeY;
    public int SizeZ => _sizeZ;
    public bool Modified => _modified;

    public VoxelManipulator(int minX, int minY, int minZ, int sizeX, int sizeY, int sizeZ)
    {
        _minX = minX;
        _minY = minY;
        _minZ = minZ;
        _sizeX = sizeX;
        _sizeY = sizeY;
        _sizeZ = sizeZ;
        _data = new Block[sizeX, sizeY, sizeZ];
        _modified = false;
    }

    public VoxelManipulator(int sizeX, int sizeY, int sizeZ)
        : this(0, 0, 0, sizeX, sizeY, sizeZ)
    {
    }

    private int IndexX(int worldX) => worldX - _minX;
    private int IndexY(int worldY) => worldY - _minY;
    private int IndexZ(int worldZ) => worldZ - _minZ;

    public bool IsInBounds(int x, int y, int z)
    {
        var ix = x - _minX;
        var iy = y - _minY;
        var iz = z - _minZ;
        return ix >= 0 && ix < _sizeX && iy >= 0 && iy < _sizeY && iz >= 0 && iz < _sizeZ;
    }

    public Block GetBlock(int x, int y, int z)
    {
        if (!IsInBounds(x, y, z))
            return Block.Air;
        return _data[IndexX(x), IndexY(y), IndexZ(z)] ?? Block.Air;
    }

    public BlockType GetBlockType(int x, int y, int z)
    {
        return GetBlock(x, y, z).Type;
    }

    public void SetBlock(int x, int y, int z, Block block)
    {
        if (!IsInBounds(x, y, z)) return;
        _data[IndexX(x), IndexY(y), IndexZ(z)] = block;
        _modified = true;
    }

    public void SetBlock(int x, int y, int z, BlockType type, byte param1 = 0, byte param2 = 0, byte light = 15)
    {
        SetBlock(x, y, z, new Block(type, param1, param2, light));
    }

    public void Fill(BlockType type, byte param1 = 0, byte param2 = 0, byte light = 15)
    {
        for (int x = 0; x < _sizeX; x++)
        {
            for (int y = 0; y < _sizeY; y++)
            {
                for (int z = 0; z < _sizeZ; z++)
                {
                    _data[x, y, z] = new Block(type, param1, param2, light);
                }
            }
        }
        _modified = true;
    }

    public void FillArea(int x0, int y0, int z0, int x1, int y1, int z1, BlockType type, byte param1 = 0, byte param2 = 0)
    {
        var minX = Math.Max(x0, _minX);
        var minY = Math.Max(y0, _minY);
        var minZ = Math.Max(z0, _minZ);
        var maxX = Math.Min(x1, MaxX);
        var maxY = Math.Min(y1, MaxY);
        var maxZ = Math.Min(z1, MaxZ);

        for (int x = minX; x <= maxX; x++)
        {
            for (int y = minY; y <= maxY; y++)
            {
                for (int z = minZ; z <= maxZ; z++)
                {
                    SetBlock(x, y, z, type, param1, param2);
                }
            }
        }
    }

    public void Clear()
    {
        Array.Clear(_data);
        _modified = false;
    }

    public void CopyFrom(World world)
    {
        for (int lx = 0; lx < _sizeX; lx++)
        {
            for (int ly = 0; ly < _sizeY; ly++)
            {
                for (int lz = 0; lz < _sizeZ; lz++)
                {
                    var wx = (short)(_minX + lx);
                    var wy = (short)(_minY + ly);
                    var wz = (short)(_minZ + lz);
                    _data[lx, ly, lz] = world.GetBlock(new Vector3s(wx, wy, wz));
                }
            }
        }
        _modified = false;
    }

    public void CopyTo(World world)
    {
        if (!_modified) return;
        for (int lx = 0; lx < _sizeX; lx++)
        {
            for (int ly = 0; ly < _sizeY; ly++)
            {
                for (int lz = 0; lz < _sizeZ; lz++)
                {
                    var block = _data[lx, ly, lz];
                    if (block != null)
                    {
                        var wx = (short)(_minX + lx);
                        var wy = (short)(_minY + ly);
                        var wz = (short)(_minZ + lz);
                        world.SetBlock(new Vector3s(wx, wy, wz), block);
                    }
                }
            }
        }
    }

    public void Blit(VoxelManipulator source, int srcX, int srcY, int srcZ, int dstX, int dstY, int dstZ, int width, int height, int depth)
    {
        for (int dx = 0; dx < width; dx++)
        {
            for (int dy = 0; dy < height; dy++)
            {
                for (int dz = 0; dz < depth; dz++)
                {
                    var block = source.GetBlock(srcX + dx, srcY + dy, srcZ + dz);
                    SetBlock(dstX + dx, dstY + dy, dstZ + dz, block);
                }
            }
        }
    }

    public int CountBlock(BlockType type)
    {
        var count = 0;
        for (int x = 0; x < _sizeX; x++)
        {
            for (int y = 0; y < _sizeY; y++)
            {
                for (int z = 0; z < _sizeZ; z++)
                {
                    if (_data[x, y, z]?.Type == type) count++;
                }
            }
        }
        return count;
    }

    public void Replace(BlockType from, BlockType to, byte param2 = 0)
    {
        for (int x = 0; x < _sizeX; x++)
        {
            for (int y = 0; y < _sizeY; y++)
            {
                for (int z = 0; z < _sizeZ; z++)
                {
                    if (_data[x, y, z]?.Type == from)
                    {
                        _data[x, y, z] = new Block(to, 0, param2, 15);
                    }
                }
            }
        }
        _modified = true;
    }
}
