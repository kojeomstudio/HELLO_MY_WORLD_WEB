namespace WebGameServer.Core.World;

public class MMVManip : VoxelManipulator
{
    private readonly World _world;
    private readonly HashSet<ChunkCoord> _loadedChunks = new();
    private bool _initialEmergeDone;

    public World BoundWorld => _world;

    public MMVManip(World world)
        : base(0, 0, 0, 0, 0, 0)
    {
        _world = world;
    }

    public void InitialEmerge(Vector3s minP, Vector3s maxP)
    {
        var sizeX = maxP.X - minP.X + 1;
        var sizeY = maxP.Y - minP.Y + 1;
        var sizeZ = maxP.Z - minP.Z + 1;

        Resize(minP.X, minP.Y, minP.Z, sizeX, sizeY, sizeZ);

        _loadedChunks.Clear();

        var minCX = minP.X >> 4;
        var minCY = minP.Y >> 4;
        var minCZ = minP.Z >> 4;
        var maxCX = maxP.X >> 4;
        var maxCY = maxP.Y >> 4;
        var maxCZ = maxP.Z >> 4;

        for (int cy = minCY; cy <= maxCY; cy++)
        {
            for (int cz = minCZ; cz <= maxCZ; cz++)
            {
                for (int cx = minCX; cx <= maxCX; cx++)
                {
                    var coord = new ChunkCoord(cx, cy, cz);
                    _loadedChunks.Add(coord);
                }
            }
        }

        CopyFrom(_world);
        _initialEmergeDone = true;
    }

    public void BlitBackAll()
    {
        if (!_initialEmergeDone) return;
        CopyTo(_world);
    }

    public bool IsChunkLoaded(ChunkCoord coord)
    {
        return _loadedChunks.Contains(coord);
    }

    public MMVManip Clone()
    {
        var clone = new MMVManip(_world);
        if (_initialEmergeDone)
        {
            clone.InitialEmerge(
                new Vector3s((short)MinX, (short)MinY, (short)MinZ),
                new Vector3s((short)MaxX, (short)MaxY, (short)MaxZ));
        }
        return clone;
    }
}
