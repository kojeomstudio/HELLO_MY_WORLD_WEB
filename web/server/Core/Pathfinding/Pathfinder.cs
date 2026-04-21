using WebGameServer.Core.Game;
using WorldMap = WebGameServer.Core.World.World;

namespace WebGameServer.Core.Pathfinding;

public class Pathfinder
{
    private readonly WorldMap _world;
    private readonly BlockDefinitionManager _blockDefs;

    private const int MaxSearchDistance = 16;
    private const int MaxWaypoints = 700;

    public Pathfinder(WorldMap world, BlockDefinitionManager blockDefs)
    {
        _world = world;
        _blockDefs = blockDefs;
    }

    public List<Vector3>? FindPath(Vector3 start, Vector3 end, int maxJump = 1, int maxDrop = 3)
    {
        var startBlock = new Vector3s(
            (short)Math.Floor(start.X),
            (short)Math.Floor(start.Y),
            (short)Math.Floor(start.Z));
        var endBlock = new Vector3s(
            (short)Math.Floor(end.X),
            (short)Math.Floor(end.Y),
            (short)Math.Floor(end.Z));

        var midpoint = new Vector3s(
            (short)((startBlock.X + endBlock.X) / 2),
            (short)((startBlock.Y + endBlock.Y) / 2),
            (short)((startBlock.Z + endBlock.Z) / 2));

        var searchRadius = Math.Max(MaxSearchDistance,
            Math.Max(
                Math.Abs(startBlock.X - endBlock.X),
                Math.Max(
                    Math.Abs(startBlock.Y - endBlock.Y),
                    Math.Abs(startBlock.Z - endBlock.Z))) / 2 + 2);

        var openSet = new PriorityQueue<PathNode, float>();
        var nodes = new Dictionary<(short X, short Y, short Z), PathNode>();
        var closedSet = new HashSet<(short X, short Y, short Z)>();

        var startNode = new PathNode(startBlock.X, startBlock.Y, startBlock.Z)
        {
            G = 0,
            H = ManhattanDistance(startBlock, endBlock)
        };
        startNode.F = startNode.G + startNode.H;

        nodes[(startBlock.X, startBlock.Y, startBlock.Z)] = startNode;
        openSet.Enqueue(startNode, startNode.F);

        int waypoints = 0;

        while (openSet.Count > 0 && waypoints < MaxWaypoints)
        {
            var current = openSet.Dequeue();
            var currentKey = (current.X, current.Y, current.Z);

            if (closedSet.Contains(currentKey)) continue;
            closedSet.Add(currentKey);
            waypoints++;

            if (current.X == endBlock.X && current.Y == endBlock.Y && current.Z == endBlock.Z)
            {
                return ReconstructPath(current);
            }

            foreach (var neighbor in GetWalkableNeighbors(current, maxJump, maxDrop))
            {
                var nKey = (neighbor.X, neighbor.Y, neighbor.Z);
                if (closedSet.Contains(nKey)) continue;

                if (Math.Abs(neighbor.X - midpoint.X) > searchRadius ||
                    Math.Abs(neighbor.Y - midpoint.Y) > searchRadius ||
                    Math.Abs(neighbor.Z - midpoint.Z) > searchRadius)
                    continue;

                var moveCost = neighbor.Y != current.Y ? 2 : 1;
                var tentativeG = current.G + moveCost;

                if (!nodes.TryGetValue(nKey, out var existing) || tentativeG < existing.G)
                {
                    var node = new PathNode(neighbor.X, neighbor.Y, neighbor.Z)
                    {
                        G = tentativeG,
                        H = ManhattanDistance(
                            new Vector3s(neighbor.X, neighbor.Y, neighbor.Z),
                            endBlock),
                        Parent = current
                    };
                    node.F = node.G + node.H;
                    nodes[nKey] = node;
                    openSet.Enqueue(node, node.F);
                }
            }
        }

        return null;
    }

    private IEnumerable<(short X, short Y, short Z)> GetWalkableNeighbors(PathNode node, int maxJump, int maxDrop)
    {
        short[] dx = { 0, 0, 1, -1 };
        short[] dz = { 1, -1, 0, 0 };

        for (int i = 0; i < 4; i++)
        {
            var nx = (short)(node.X + dx[i]);
            var nz = (short)(node.Z + dz[i]);

            for (int dy = -maxDrop; dy <= maxJump; dy++)
            {
                var ny = (short)(node.Y + dy);
                if (IsWalkable(nx, ny, nz))
                {
                    yield return (nx, ny, nz);
                    break;
                }
            }
        }
    }

    private bool IsWalkable(short x, short y, short z)
    {
        if (y < 0) return false;

        var feetBlock = _world.GetBlock(new Vector3s(x, y, z));
        var headBlock = _world.GetBlock(new Vector3s(x, (short)(y + 1), z));
        var groundBlock = _world.GetBlock(new Vector3s(x, (short)(y - 1), z));

        var feetDef = _blockDefs.Get((ushort)feetBlock.Type);
        var headDef = _blockDefs.Get((ushort)headBlock.Type);
        var groundDef = _blockDefs.Get((ushort)groundBlock.Type);

        bool feetClear = feetDef == null || !feetDef.Solid;
        bool headClear = headDef == null || !headDef.Solid;
        bool groundSolid = groundDef != null && groundDef.Solid;

        return feetClear && headClear && groundSolid;
    }

    private static int ManhattanDistance(Vector3s a, Vector3s b)
    {
        return Math.Abs(a.X - b.X) + Math.Abs(a.Z - b.Z);
    }

    private static List<Vector3> ReconstructPath(PathNode endNode)
    {
        var path = new List<Vector3>();
        var current = endNode;
        while (current != null)
        {
            path.Add(new Vector3(current.X + 0.5f, current.Y, current.Z + 0.5f));
            current = current.Parent;
        }
        path.Reverse();
        return path;
    }

    private class PathNode
    {
        public short X, Y, Z;
        public float G, H, F;
        public PathNode? Parent;

        public PathNode(short x, short y, short z)
        {
            X = x;
            Y = y;
            Z = z;
        }
    }
}
