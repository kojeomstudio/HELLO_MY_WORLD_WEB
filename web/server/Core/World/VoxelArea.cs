namespace WebGameServer.Core.World;

public class VoxelArea
{
    private readonly int _minX;
    private readonly int _minY;
    private readonly int _minZ;
    private readonly int _sizeX;
    private readonly int _sizeY;
    private readonly int _sizeZ;

    public int MinX => _minX;
    public int MinY => _minY;
    public int MinZ => _minZ;
    public int MaxX => _minX + _sizeX - 1;
    public int MaxY => _minY + _sizeY - 1;
    public int MaxZ => _minZ + _sizeZ - 1;
    public int Volume => _sizeX * _sizeY * _sizeZ;

    public VoxelArea(Vector3s minP, Vector3s maxP)
    {
        _minX = minP.X;
        _minY = minP.Y;
        _minZ = minP.Z;
        _sizeX = maxP.X - minP.X + 1;
        _sizeY = maxP.Y - minP.Y + 1;
        _sizeZ = maxP.Z - minP.Z + 1;
    }

    public VoxelArea(int minX, int minY, int minZ, int maxX, int maxY, int maxZ)
        : this(new Vector3s((short)minX, (short)minY, (short)minZ),
               new Vector3s((short)maxX, (short)maxY, (short)maxZ))
    {
    }

    public int Index(int x, int y, int z)
    {
        var ix = x - _minX;
        var iy = y - _minY;
        var iz = z - _minZ;
        return ix + iy * _sizeX + iz * _sizeX * _sizeY;
    }

    public Vector3s Position(int index)
    {
        var areaXY = _sizeX * _sizeY;
        var iz = index / areaXY;
        var remainder = index % areaXY;
        var iy = remainder / _sizeX;
        var ix = remainder % _sizeX;
        return new Vector3s(
            (short)(_minX + ix),
            (short)(_minY + iy),
            (short)(_minZ + iz));
    }

    public bool Contains(int x, int y, int z)
    {
        return x >= _minX && x <= MaxX &&
               y >= _minY && y <= MaxY &&
               z >= _minZ && z <= MaxZ;
    }

    public void Iterate(Action<int, int, int> action)
    {
        for (int z = _minZ; z <= MaxZ; z++)
        {
            for (int y = _minY; y <= MaxY; y++)
            {
                for (int x = _minX; x <= MaxX; x++)
                {
                    action(x, y, z);
                }
            }
        }
    }
}
