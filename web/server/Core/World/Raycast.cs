using WebGameServer.Core;

namespace WebGameServer.Core.World;

public readonly struct RaycastResult
{
    public Vector3s Position { get; init; }
    public Vector3 Normal { get; init; }
    public ushort BlockType { get; init; }
    public float Distance { get; init; }
}

public static class Raycast
{
    private const float MaxDistanceClamp = 8f;

    public static RaycastResult? Cast(World world, Vector3 origin, Vector3 direction, float maxDistance)
    {
        maxDistance = Math.Min(maxDistance, MaxDistanceClamp);

        var dirLength = direction.Length;
        if (dirLength < 1e-6f) return null;
        direction = direction / dirLength;

        var x = MathF.Floor(origin.X);
        var y = MathF.Floor(origin.Y);
        var z = MathF.Floor(origin.Z);

        var stepX = direction.X >= 0 ? 1 : -1;
        var stepY = direction.Y >= 0 ? 1 : -1;
        var stepZ = direction.Z >= 0 ? 1 : -1;

        var tDeltaX = direction.X != 0 ? MathF.Abs(1f / direction.X) : float.MaxValue;
        var tDeltaY = direction.Y != 0 ? MathF.Abs(1f / direction.Y) : float.MaxValue;
        var tDeltaZ = direction.Z != 0 ? MathF.Abs(1f / direction.Z) : float.MaxValue;

        var tMaxX = direction.X != 0
            ? ((direction.X > 0 ? (x + 1f) : x) - origin.X) / direction.X
            : float.MaxValue;
        var tMaxY = direction.Y != 0
            ? ((direction.Y > 0 ? (y + 1f) : y) - origin.Y) / direction.Y
            : float.MaxValue;
        var tMaxZ = direction.Z != 0
            ? ((direction.Z > 0 ? (z + 1f) : z) - origin.Z) / direction.Z
            : float.MaxValue;

        var bx = (short)x;
        var by = (short)y;
        var bz = (short)z;

        var normal = Vector3.Zero;

        for (var i = 0; i < (int)maxDistance * 3 + 3; i++)
        {
            var blockPos = new Vector3s(bx, by, bz);
            var block = world.GetBlock(blockPos);

            if (block.Type != BlockType.Air)
            {
                var hitDist = MathF.Sqrt(
                    (bx + 0.5f - origin.X) * (bx + 0.5f - origin.X) +
                    (by + 0.5f - origin.Y) * (by + 0.5f - origin.Y) +
                    (bz + 0.5f - origin.Z) * (bz + 0.5f - origin.Z));

                if (hitDist > maxDistance) return null;

                return new RaycastResult
                {
                    Position = blockPos,
                    Normal = normal,
                    BlockType = (ushort)block.Type,
                    Distance = hitDist
                };
            }

            if (tMaxX < tMaxY)
            {
                if (tMaxX < tMaxZ)
                {
                    if (tMaxX > maxDistance) return null;
                    x += stepX;
                    bx = (short)x;
                    tMaxX += tDeltaX;
                    normal = new Vector3(-stepX, 0, 0);
                }
                else
                {
                    if (tMaxZ > maxDistance) return null;
                    z += stepZ;
                    bz = (short)z;
                    tMaxZ += tDeltaZ;
                    normal = new Vector3(0, 0, -stepZ);
                }
            }
            else
            {
                if (tMaxY < tMaxZ)
                {
                    if (tMaxY > maxDistance) return null;
                    y += stepY;
                    by = (short)y;
                    tMaxY += tDeltaY;
                    normal = new Vector3(0, -stepY, 0);
                }
                else
                {
                    if (tMaxZ > maxDistance) return null;
                    z += stepZ;
                    bz = (short)z;
                    tMaxZ += tDeltaZ;
                    normal = new Vector3(0, 0, -stepZ);
                }
            }
        }

        return null;
    }
}
