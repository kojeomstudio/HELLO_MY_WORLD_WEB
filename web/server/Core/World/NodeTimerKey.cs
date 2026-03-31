namespace WebGameServer.Core.World;

public readonly struct NodeTimerKey
{
    public int X { get; }
    public int Y { get; }
    public int Z { get; }

    public NodeTimerKey(int x, int y, int z)
    {
        X = x;
        Y = y;
        Z = z;
    }

    public bool Equals(NodeTimerKey other) => X == other.X && Y == other.Y && Z == other.Z;
    public override int GetHashCode() => HashCode.Combine(X, Y, Z);
}
