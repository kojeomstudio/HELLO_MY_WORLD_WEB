using System.Text.Json;

namespace WebGameServer.Core.World.Generators;

public class LSystemTreeDefinition
{
    public string Name { get; set; } = "";
    public string Axiom { get; set; } = "";
    public Dictionary<char, string> Rules { get; set; } = new();
    public float Angle { get; set; } = 30f;
    public int Iterations { get; set; } = 4;
    public string TrunkType { get; set; } = "single";
    public string TrunkBlock { get; set; } = "wood";
    public string LeavesBlock { get; set; } = "leaves";
    public string FruitBlock { get; set; } = "";
    public float FruitChance { get; set; } = 0.1f;
    public int RandomLevel { get; set; } = 0;
    public string[] Biomes { get; set; } = Array.Empty<string>();
    public int MaxTreeLength { get; set; } = 256;
}

public class LSystemTreeGenerator
{
    private readonly List<LSystemTreeDefinition> _definitions = new();
    private readonly Dictionary<string, ushort> _blockNameCache = new();

    public void LoadDefinitions(string dataPath)
    {
        var filePath = Path.Combine(dataPath, "lsystem_trees.json");
        if (!File.Exists(filePath)) return;

        var json = File.ReadAllText(filePath);
        using var doc = JsonDocument.Parse(json);
        if (!doc.RootElement.TryGetProperty("trees", out var treesEl)) return;

        foreach (var tree in treesEl.EnumerateArray())
        {
            var def = new LSystemTreeDefinition
            {
                Name = tree.GetProperty("name").GetString() ?? "",
                Axiom = tree.GetProperty("axiom").GetString() ?? "",
                Angle = tree.TryGetProperty("angle", out var angleEl) ? (float)angleEl.GetDouble() : 30f,
                Iterations = tree.TryGetProperty("iterations", out var iterEl) ? iterEl.GetInt32() : 4,
                TrunkType = tree.TryGetProperty("trunkType", out var ttEl) ? ttEl.GetString() ?? "single" : "single",
                TrunkBlock = tree.TryGetProperty("trunkBlock", out var tbEl) ? tbEl.GetString() ?? "wood" : "wood",
                LeavesBlock = tree.TryGetProperty("leavesBlock", out var lbEl) ? lbEl.GetString() ?? "leaves" : "leaves",
                FruitBlock = tree.TryGetProperty("fruitBlock", out var fbEl) ? fbEl.GetString() ?? "" : "",
                FruitChance = tree.TryGetProperty("fruitChance", out var fcEl) ? (float)fcEl.GetDouble() : 0.1f,
                RandomLevel = tree.TryGetProperty("randomLevel", out var rlEl) ? rlEl.GetInt32() : 0,
                MaxTreeLength = tree.TryGetProperty("maxTreeLength", out var mlEl) ? mlEl.GetInt32() : 256
            };

            if (tree.TryGetProperty("rules", out var rulesEl))
            {
                foreach (var rule in rulesEl.EnumerateArray())
                {
                    var key = rule.GetProperty("key").GetString();
                    var value = rule.GetProperty("value").GetString();
                    if (key != null && key.Length == 1 && value != null)
                        def.Rules[key[0]] = value;
                }
            }

            if (tree.TryGetProperty("biomes", out var biomesEl))
            {
                var biomes = new List<string>();
                foreach (var b in biomesEl.EnumerateArray())
                    biomes.Add(b.GetString() ?? "");
                def.Biomes = biomes.ToArray();
            }

            _definitions.Add(def);
        }
    }

    public LSystemTreeDefinition? GetDefinitionForBiome(string biomeName)
    {
        foreach (var def in _definitions)
        {
            if (def.Biomes.Length == 0) continue;
            foreach (var b in def.Biomes)
            {
                if (b.Equals(biomeName, StringComparison.OrdinalIgnoreCase))
                    return def;
            }
        }
        return _definitions.FirstOrDefault(d => d.Biomes.Length == 0);
    }

    public void GenerateTree(
        LSystemTreeDefinition def,
        ushort[,,] blocks,
        int originX, int originY, int originZ,
        int chunkSize,
        Random rng)
    {
        var trunkType = ResolveBlock(def.TrunkBlock);
        var leavesType = ResolveBlock(def.LeavesBlock);
        var fruitType = def.FruitBlock.Length > 0 ? ResolveBlock(def.FruitBlock) : (ushort)0;

        var expanded = ExpandAxiom(def.Axiom, def.Rules, def.Iterations, def.MaxTreeLength, rng, def.RandomLevel);
        if (expanded.Length == 0) return;

        var angleRad = def.Angle * MathF.PI / 180f;
        var posX = (float)originX;
        var posY = (float)originY;
        var posZ = (float)originZ;
        var yaw = 0f;
        var pitch = 0f;
        var roll = 0f;

        var stack = new Stack<(float X, float Y, float Z, float Yaw, float Pitch, float Roll)>();
        var fruitPositions = new List<(int X, int Y, int Z)>();

        foreach (var ch in expanded)
        {
            switch (ch)
            {
                case 'F':
                    PlaceTrunkAndLeaves(blocks, ref posX, ref posY, ref posZ, ref yaw, ref pitch, ref roll, angleRad, trunkType, leavesType, chunkSize);
                    break;
                case 'T':
                    PlaceTrunk(blocks, ref posX, ref posY, ref posZ, ref yaw, ref pitch, ref roll, angleRad, trunkType, chunkSize);
                    break;
                case 'f':
                    PlaceLeaves(blocks, ref posX, ref posY, ref posZ, ref yaw, ref pitch, ref roll, angleRad, leavesType, chunkSize);
                    break;
                case 'R':
                    if (fruitType != 0)
                        fruitPositions.Add(((int)posX, (int)posY, (int)posZ));
                    MoveForward(ref posX, ref posY, ref posZ, yaw, pitch);
                    break;
                case 'G':
                    MoveForward(ref posX, ref posY, ref posZ, yaw, pitch);
                    break;
                case '+':
                    yaw += angleRad;
                    break;
                case '-':
                    yaw -= angleRad;
                    break;
                case '&':
                    pitch += angleRad;
                    break;
                case '^':
                    pitch -= angleRad;
                    break;
                case '*':
                    roll += angleRad;
                    break;
                case '/':
                    roll -= angleRad;
                    break;
                case '[':
                    stack.Push((posX, posY, posZ, yaw, pitch, roll));
                    break;
                case ']':
                    if (stack.Count > 0)
                    {
                        var s = stack.Pop();
                        posX = s.X; posY = s.Y; posZ = s.Z;
                        yaw = s.Yaw; pitch = s.Pitch; roll = s.Roll;
                    }
                    break;
            }
        }

        if (fruitType != 0)
        {
            foreach (var pos in fruitPositions)
            {
                if (pos.X >= 0 && pos.X < chunkSize && pos.Y >= 0 && pos.Y < chunkSize && pos.Z >= 0 && pos.Z < chunkSize)
                {
                    if (rng.NextDouble() < def.FruitChance && blocks[pos.X, pos.Y, pos.Z] == (ushort)BlockType.Air)
                        blocks[pos.X, pos.Y, pos.Z] = fruitType;
                }
            }
        }
    }

    private static string ExpandAxiom(
        string axiom, Dictionary<char, string> rules, int iterations,
        int maxLength, Random rng, int randomLevel)
    {
        var current = axiom;
        for (int i = 0; i < iterations; i++)
        {
            var next = new System.Text.StringBuilder();
            foreach (var ch in current)
            {
                if (rules.TryGetValue(ch, out var replacement))
                {
                    if (randomLevel > 0 && rng.NextDouble() < randomLevel * 0.1)
                        continue;
                    next.Append(replacement);
                }
                else
                {
                    next.Append(ch);
                }

                if (next.Length > maxLength)
                    return next.ToString(0, maxLength);
            }
            current = next.ToString();
        }
        return current.Length > maxLength ? current[..maxLength] : current;
    }

    private static void PlaceTrunkAndLeaves(
        ushort[,,] blocks, ref float px, ref float py, ref float pz,
        ref float yaw, ref float pitch, ref float roll, float angleRad,
        ushort trunkType, ushort leavesType, int chunkSize)
    {
        var ix = (int)px;
        var iy = (int)py;
        var iz = (int)pz;
        if (ix >= 0 && ix < chunkSize && iy >= 0 && iy < chunkSize && iz >= 0 && iz < chunkSize)
        {
            if (blocks[ix, iy, iz] == (ushort)BlockType.Air)
                blocks[ix, iy, iz] = trunkType;
        }
        PlaceLeavesAround(blocks, ix, iy, iz, leavesType, chunkSize);
        MoveForward(ref px, ref py, ref pz, yaw, pitch);
    }

    private static void PlaceTrunk(
        ushort[,,] blocks, ref float px, ref float py, ref float pz,
        ref float yaw, ref float pitch, ref float roll, float angleRad,
        ushort trunkType, int chunkSize)
    {
        var ix = (int)px;
        var iy = (int)py;
        var iz = (int)pz;
        if (ix >= 0 && ix < chunkSize && iy >= 0 && iy < chunkSize && iz >= 0 && iz < chunkSize)
        {
            if (blocks[ix, iy, iz] == (ushort)BlockType.Air)
                blocks[ix, iy, iz] = trunkType;
        }
        MoveForward(ref px, ref py, ref pz, yaw, pitch);
    }

    private static void PlaceLeaves(
        ushort[,,] blocks, ref float px, ref float py, ref float pz,
        ref float yaw, ref float pitch, ref float roll, float angleRad,
        ushort leavesType, int chunkSize)
    {
        var ix = (int)px;
        var iy = (int)py;
        var iz = (int)pz;
        if (ix >= 0 && ix < chunkSize && iy >= 0 && iy < chunkSize && iz >= 0 && iz < chunkSize)
        {
            if (blocks[ix, iy, iz] == (ushort)BlockType.Air)
                blocks[ix, iy, iz] = leavesType;
        }
        MoveForward(ref px, ref py, ref pz, yaw, pitch);
    }

    private static void PlaceLeavesAround(
        ushort[,,] blocks, int px, int py, int pz, ushort leavesType, int chunkSize)
    {
        for (int dx = -1; dx <= 1; dx++)
        {
            for (int dy = -1; dy <= 1; dy++)
            {
                for (int dz = -1; dz <= 1; dz++)
                {
                    if (dx == 0 && dy == 0 && dz == 0) continue;
                    var nx = px + dx;
                    var ny = py + dy;
                    var nz = pz + dz;
                    if (nx >= 0 && nx < chunkSize && ny >= 0 && ny < chunkSize && nz >= 0 && nz < chunkSize)
                    {
                        if (blocks[nx, ny, nz] == (ushort)BlockType.Air)
                            blocks[nx, ny, nz] = leavesType;
                    }
                }
            }
        }
    }

    private static void MoveForward(ref float px, ref float py, ref float pz, float yaw, float pitch)
    {
        var step = 1.0f;
        var cosPitch = MathF.Cos(pitch);
        px += step * MathF.Sin(yaw) * cosPitch;
        py += step * MathF.Sin(pitch);
        pz += step * MathF.Cos(yaw) * cosPitch;
    }

    private ushort ResolveBlock(string name)
    {
        if (_blockNameCache.TryGetValue(name, out var blockType))
            return blockType;

        var resolved = name switch
        {
            "wood" => (ushort)BlockType.Wood,
            "leaves" => (ushort)BlockType.Leaves,
            "pine_wood" => (ushort)BlockType.PineWood,
            "pine_needles" => (ushort)BlockType.PineNeedles,
            "jungle_wood" => (ushort)BlockType.JungleWood,
            "jungle_leaves" => (ushort)BlockType.JungleLeaves,
            "apple" => (ushort)BlockType.Apple,
            "snow" => (ushort)BlockType.Snow,
            "cactus" => (ushort)BlockType.Cactus,
            _ => (ushort)BlockType.Wood
        };

        _blockNameCache[name] = resolved;
        return resolved;
    }
}
