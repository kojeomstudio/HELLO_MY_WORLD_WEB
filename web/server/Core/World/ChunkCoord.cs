namespace WebGameServer.Core.World;

public readonly struct ChunkCoord : IEquatable<ChunkCoord>
{
    public int X { get; }
    public int Y { get; }
    public int Z { get; }

    public ChunkCoord(int x, int y, int z)
    {
        X = x;
        Y = y;
        Z = z;
    }

    public bool Equals(ChunkCoord other)
    {
        return X == other.X && Y == other.Y && Z == other.Z;
    }

    public override int GetHashCode() => HashCode.Combine(X, Y, Z);

    public static ChunkCoord operator +(ChunkCoord a, ChunkCoord b) => new(a.X + b.X, a.Y + b.Y, a.Z + b.Z);
    public static ChunkCoord operator -(ChunkCoord a, ChunkCoord b) => new(a.X - b.X, a.Y - b.Y, a.Z - b.Z);

    public static ChunkCoord FromBlockCoord(Vector3s blockCoord)
    {
        return new ChunkCoord(
            blockCoord.X >> 4,
            blockCoord.Y >> 4,
            blockCoord.Z >> 4);
    }

    public override string ToString() => $"({X}, {Y}, {Z})";
}
