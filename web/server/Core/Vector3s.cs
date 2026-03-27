namespace WebGameServer.Core;

public readonly struct Vector3s : IEquatable<Vector3s>
{
    public short X { get; }
    public short Y { get; }
    public short Z { get; }

    public Vector3s(short x, short y, short z)
    {
        X = x;
        Y = y;
        Z = z;
    }

    public Vector3s() : this(0, 0, 0) { }

    public static Vector3s Zero => new(0, 0, 0);
    public static Vector3s One => new(1, 1, 1);

    public static Vector3s operator +(Vector3s a, Vector3s b) => new((short)(a.X + b.X), (short)(a.Y + b.Y), (short)(a.Z + b.Z));
    public static Vector3s operator -(Vector3s a, Vector3s b) => new((short)(a.X - b.X), (short)(a.Y - b.Y), (short)(a.Z - b.Z));
    public static bool operator ==(Vector3s a, Vector3s b) => a.X == b.X && a.Y == b.Y && a.Z == b.Z;
    public static bool operator !=(Vector3s a, Vector3s b) => !(a == b);

    public bool Equals(Vector3s other) => X == other.X && Y == other.Y && Z == other.Z;
    public override bool Equals(object? obj) => obj is Vector3s v && Equals(v);
    public override int GetHashCode() => HashCode.Combine(X, Y, Z);
}
