using System.Text.Json;
using WebGameServer.Core.World;

namespace WebGameServer.Core.World.Generators;

public readonly record struct SchematicNode(ushort BlockType, byte Probability, bool ForcePlace);

public class Schematic
{
    public string Name { get; set; } = "";
    public int SizeX { get; set; }
    public int SizeY { get; set; }
    public int SizeZ { get; set; }
    public byte[] YSliceProbabilities { get; set; } = Array.Empty<byte>();
    public SchematicNode[,,] Nodes { get; set; } = new SchematicNode[0, 0, 0];
}

public class SchematicPlacer
{
    private readonly Dictionary<string, Schematic> _schematics = new();
    private readonly Dictionary<string, ushort> _blockNameCache = new();

    public void LoadSchematics(string dataPath)
    {
        var filePath = Path.Combine(dataPath, "schematics.json");
        if (!File.Exists(filePath)) return;

        var json = File.ReadAllText(filePath);
        using var doc = JsonDocument.Parse(json);
        if (!doc.RootElement.TryGetProperty("schematics", out var schemsEl)) return;

        foreach (var schemEl in schemsEl.EnumerateArray())
        {
            var name = schemEl.GetProperty("name").GetString() ?? "";
            var sizeX = schemEl.GetProperty("sizeX").GetInt32();
            var sizeY = schemEl.GetProperty("sizeY").GetInt32();
            var sizeZ = schemEl.GetProperty("sizeZ").GetInt32();

            var schem = new Schematic
            {
                Name = name,
                SizeX = sizeX,
                SizeY = sizeY,
                SizeZ = sizeZ,
                Nodes = new SchematicNode[sizeX, sizeY, sizeZ]
            };

            if (schemEl.TryGetProperty("ySliceProbabilities", out var ySliceEl))
            {
                var probs = new List<byte>();
                foreach (var p in ySliceEl.EnumerateArray())
                    probs.Add((byte)p.GetInt32());
                schem.YSliceProbabilities = probs.ToArray();
            }

            if (schemEl.TryGetProperty("nodes", out var nodesEl))
            {
                foreach (var node in nodesEl.EnumerateArray())
                {
                    var x = node.GetProperty("x").GetInt32();
                    var y = node.GetProperty("y").GetInt32();
                    var z = node.GetProperty("z").GetInt32();
                    var blockName = node.GetProperty("block").GetString() ?? "";
                    var prob = node.TryGetProperty("probability", out var pEl) ? (byte)pEl.GetInt32() : (byte)127;
                    var force = node.TryGetProperty("forcePlace", out var fEl) && fEl.GetBoolean();

                    if (x >= 0 && x < sizeX && y >= 0 && y < sizeY && z >= 0 && z < sizeZ)
                    {
                        schem.Nodes[x, y, z] = new SchematicNode(
                            ResolveBlock(blockName), prob, force);
                    }
                }
            }

            _schematics[name] = schem;
        }
    }

    public bool PlaceSchematic(
        string name,
        ushort[,,] blocks,
        int originX, int originY, int originZ,
        int chunkSize,
        int rotation = 0,
        Random? rng = null)
    {
        if (!_schematics.TryGetValue(name, out var schem))
            return false;

        rng ??= Random.Shared;

        for (int sy = 0; sy < schem.SizeY; sy++)
        {
            var ySliceProb = schem.YSliceProbabilities.Length > sy
                ? schem.YSliceProbabilities[sy]
                : (byte)127;

            if (ySliceProb == 0x00)
                continue;

            if (rng.Next(256) > ySliceProb)
                continue;

            for (int sx = 0; sx < schem.SizeX; sx++)
            {
                for (int sz = 0; sz < schem.SizeZ; sz++)
                {
                    var (rx, rz) = RotateCoord(sx, sz, schem.SizeX, schem.SizeZ, rotation);
                    var node = schem.Nodes[rx, sy, rz];

                    if (node.BlockType == 0) continue;

                    var nodeProb = node.Probability;
                    if (nodeProb == 0x00) continue;
                    if (nodeProb < 127 && rng.Next(256) > nodeProb) continue;

                    var bx = originX + sx;
                    var by = originY + sy;
                    var bz = originZ + sz;

                    if (bx < 0 || bx >= chunkSize || by < 0 || by >= chunkSize || bz < 0 || bz >= chunkSize)
                        continue;

                    if (!node.ForcePlace && blocks[bx, by, bz] != (ushort)BlockType.Air)
                        continue;

                    blocks[bx, by, bz] = node.BlockType;
                }
            }
        }

        return true;
    }

    public bool TryPlaceSchematicOnSurface(
        string name,
        ushort[,,] blocks,
        int surfaceX, int surfaceZ,
        int baseY,
        int chunkSize,
        int[,] heightMap,
        int rotation = 0,
        Random? rng = null)
    {
        var localSurfaceY = heightMap[surfaceX, surfaceZ] - baseY;
        if (localSurfaceY < 0 || localSurfaceY >= chunkSize)
            return false;

        return PlaceSchematic(name, blocks, surfaceX, localSurfaceY + 1, surfaceZ, chunkSize, rotation, rng);
    }

    public Schematic? GetSchematic(string name)
    {
        return _schematics.TryGetValue(name, out var schem) ? schem : null;
    }

    public IEnumerable<string> GetSchematicNames() => _schematics.Keys;

    private static (int X, int Z) RotateCoord(int x, int z, int sizeX, int sizeZ, int rotation)
    {
        return rotation switch
        {
            0 => (x, z),
            1 => (sizeZ - 1 - z, x),
            2 => (sizeX - 1 - x, sizeZ - 1 - z),
            3 => (z, sizeX - 1 - x),
            _ => (x, z)
        };
    }

    private ushort ResolveBlock(string name)
    {
        if (_blockNameCache.TryGetValue(name, out var blockType))
            return blockType;

        var resolved = name switch
        {
            "stone" => (ushort)BlockType.Stone,
            "dirt" => (ushort)BlockType.Dirt,
            "grass" => (ushort)BlockType.Grass,
            "cobblestone" => (ushort)BlockType.Cobblestone,
            "mossy_cobblestone" => (ushort)BlockType.MossyCobblestone,
            "stone_brick" => (ushort)BlockType.StoneBrick,
            "wood" => (ushort)BlockType.Wood,
            "leaves" => (ushort)BlockType.Leaves,
            "pine_wood" => (ushort)BlockType.PineWood,
            "pine_needles" => (ushort)BlockType.PineNeedles,
            "jungle_wood" => (ushort)BlockType.JungleWood,
            "jungle_leaves" => (ushort)BlockType.JungleLeaves,
            "sand" => (ushort)BlockType.Sand,
            "sandstone" => (ushort)BlockType.SandStone,
            "water" => (ushort)BlockType.Water,
            "torch" => (ushort)BlockType.Torch,
            "lantern" => (ushort)BlockType.Lantern,
            "chest" => (ushort)BlockType.Chest,
            "air" => (ushort)BlockType.Air,
            "glass" => (ushort)BlockType.Glass,
            "ice" => (ushort)BlockType.Ice,
            "snow" => (ushort)BlockType.Snow,
            "snowblock" => (ushort)BlockType.SnowLayer,
            "flower_red" => (ushort)BlockType.FlowerRed,
            "flower_yellow" => (ushort)BlockType.FlowerYellow,
            "flower_rose" => (ushort)BlockType.FlowerRose,
            "flower_tulip" => (ushort)BlockType.FlowerTulip,
            "tall_grass" => (ushort)BlockType.TallGrass,
            "dead_bush" => (ushort)BlockType.DeadBush,
            "apple" => (ushort)BlockType.Apple,
            "bedrock" => (ushort)BlockType.Bedrock,
            "gravel" => (ushort)BlockType.Gravel,
            "coal_ore" => (ushort)BlockType.CoalOre,
            "iron_ore" => (ushort)BlockType.OreIron,
            "gold_ore" => (ushort)BlockType.GoldOre,
            "diamond_ore" => (ushort)BlockType.OreDiamond,
            "ladder" => (ushort)BlockType.Ladder,
            "planks" => (ushort)BlockType.Planks,
            "door" => (ushort)BlockType.DoorWood,
            "fence" => (ushort)BlockType.Fence,
            "sign" => (ushort)BlockType.Sign,
            "bookshelf" => (ushort)BlockType.Bookshelf,
            "obsidian" => (ushort)BlockType.Obsidian,
            "clay" => (ushort)BlockType.Clay,
            "brick" => (ushort)BlockType.Brick,
            "wool_white" => (ushort)BlockType.WoolWhite,
            "wool_red" => (ushort)BlockType.WoolRed,
            "wool_blue" => (ushort)BlockType.WoolBlue,
            "wool_green" => (ushort)BlockType.WoolGreen,
            "wool_yellow" => (ushort)BlockType.WoolYellow,
            "wool_black" => (ushort)BlockType.WoolBlack,
            "nether_brick" => (ushort)BlockType.NetherBrick,
            "stone_slab" => (ushort)BlockType.StoneSlab,
            "wood_slab" => (ushort)BlockType.WoodSlab,
            "farmland" => (ushort)BlockType.Farmland,
            "wheat" => (ushort)BlockType.WheatCrop,
            "carrot" => (ushort)BlockType.CarrotCrop,
            "potato" => (ushort)BlockType.PotatoCrop,
            "pumpkin" => (ushort)BlockType.Pumpkin,
            "melon" => (ushort)BlockType.Melon,
            "cactus" => (ushort)BlockType.Cactus,
            "sugar_cane" => (ushort)BlockType.SugarCane,
            "vine" => (ushort)BlockType.Vine,
            "mushroom_red" => (ushort)BlockType.MushroomRedBlock,
            "mushroom_brown" => (ushort)BlockType.MushroomBrownBlock,
            "mycelium" => (ushort)BlockType.Mycelium,
            "netherrack" => (ushort)BlockType.Netherrack,
            "soul_sand" => (ushort)BlockType.SoulSand,
            "glowstone" => (ushort)BlockType.Glowstone,
            "redstone_ore" => (ushort)BlockType.RedstoneOre,
            "lapis_ore" => (ushort)BlockType.LapisOre,
            "emerald_ore" => (ushort)BlockType.EmeraldOre,
            "crafting_table" => (ushort)BlockType.CraftingTable,
            "furnace" => (ushort)BlockType.Furnace,
            "end_stone" => (ushort)BlockType.EndStone,
            "purpur_block" => (ushort)BlockType.PurpurBlock,
            "prismarine" => (ushort)BlockType.Prismarine,
            "sea_lantern" => (ushort)BlockType.SeaLantern,
            "magma" => (ushort)BlockType.Magma,
            _ => (ushort)BlockType.Stone
        };

        _blockNameCache[name] = resolved;
        return resolved;
    }
}
