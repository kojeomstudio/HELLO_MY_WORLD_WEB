namespace WebGameServer.Core.Entities;

public static class Pathfinder
{
    private struct PathNode
    {
        public Vector3 Position;
        public Vector3 Parent;
        public float G;
        public float H;
        public float F;
        public bool HasParent;
    }

    private static readonly (int dx, int dy, int dz)[] Directions = CreateDirections();

    private static (int dx, int dy, int dz)[] CreateDirections()
    {
        var dirs = new List<(int, int, int)>();
        for (int dx = -1; dx <= 1; dx++)
        {
            for (int dy = -1; dy <= 1; dy++)
            {
                for (int dz = -1; dz <= 1; dz++)
                {
                    if (dx == 0 && dy == 0 && dz == 0) continue;
                    dirs.Add((dx, dy, dz));
                }
            }
        }
        return dirs.ToArray();
    }

    public static List<Vector3> FindPath(Vector3 start, Vector3 end, Func<int, int, int, bool> isWalkable, int maxSteps = 50)
    {
        var result = new List<Vector3>();
        var sx = (int)Math.Floor(start.X);
        var sy = (int)Math.Floor(start.Y);
        var sz = (int)Math.Floor(start.Z);
        var ex = (int)Math.Floor(end.X);
        var ey = (int)Math.Floor(end.Y);
        var ez = (int)Math.Floor(end.Z);

        var startNode = new PathNode
        {
            Position = new Vector3(sx, sy, sz),
            HasParent = false,
            G = 0,
            H = ManhattanHeuristic(sx, sy, sz, ex, ey, ez)
        };
        startNode.F = startNode.G + startNode.H;

        var open = new List<PathNode> { startNode };
        var closed = new HashSet<string>();
        var nodes = new Dictionary<string, PathNode>();

        var startKey = NodeKey(sx, sy, sz);
        nodes[startKey] = startNode;

        var steps = 0;

        while (open.Count > 0 && steps < maxSteps)
        {
            steps++;

            open.Sort((a, b) => a.F.CompareTo(b.F));
            var current = open[0];
            open.RemoveAt(0);

            var currentKey = NodeKey((int)current.Position.X, (int)current.Position.Y, (int)current.Position.Z);
            if (closed.Contains(currentKey)) continue;
            closed.Add(currentKey);

            var cx = (int)current.Position.X;
            var cy = (int)current.Position.Y;
            var cz = (int)current.Position.Z;

            if (cx == ex && cy == ey && cz == ez)
            {
                return ReconstructPath(nodes, currentKey, startKey);
            }

            foreach (var (ddx, ddy, ddz) in Directions)
            {
                var nx = cx + ddx;
                var ny = cy + ddy;
                var nz = cz + ddz;
                var neighborKey = NodeKey(nx, ny, nz);

                if (closed.Contains(neighborKey)) continue;
                if (!isWalkable(nx, ny, nz)) continue;

                var moveCost = MathF.Sqrt(ddx * ddx + ddy * ddy + ddz * ddz);
                var newG = current.G + moveCost;

                if (nodes.TryGetValue(neighborKey, out var existing))
                {
                    if (newG < existing.G)
                    {
                        var updated = new PathNode
                        {
                            Position = new Vector3(nx, ny, nz),
                            Parent = current.Position,
                            HasParent = true,
                            G = newG,
                            H = ManhattanHeuristic(nx, ny, nz, ex, ey, ez)
                        };
                        updated.F = updated.G + updated.H;
                        nodes[neighborKey] = updated;
                        open.Add(updated);
                    }
                }
                else
                {
                    var neighbor = new PathNode
                    {
                        Position = new Vector3(nx, ny, nz),
                        Parent = current.Position,
                        HasParent = true,
                        G = newG,
                        H = ManhattanHeuristic(nx, ny, nz, ex, ey, ez)
                    };
                    neighbor.F = neighbor.G + neighbor.H;
                    nodes[neighborKey] = neighbor;
                    open.Add(neighbor);
                }
            }
        }

        return result;
    }

    private static float ManhattanHeuristic(int x1, int y1, int z1, int x2, int y2, int z2)
    {
        return Math.Abs(x1 - x2) + Math.Abs(y1 - y2) + Math.Abs(z1 - z2);
    }

    private static string NodeKey(int x, int y, int z) => $"{x},{y},{z}";

    private static List<Vector3> ReconstructPath(Dictionary<string, PathNode> nodes, string endKey, string startKey)
    {
        var path = new List<Vector3>();
        var currentKey = endKey;

        while (currentKey != startKey)
        {
            if (!nodes.TryGetValue(currentKey, out var node)) break;
            path.Add(node.Position + new Vector3(0.5f, 0, 0.5f));
            if (!node.HasParent) break;
            currentKey = NodeKey((int)node.Parent.X, (int)node.Parent.Y, (int)node.Parent.Z);
        }

        path.Reverse();
        return path;
    }
}
