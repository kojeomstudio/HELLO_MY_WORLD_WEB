using System.Text.Json;
using WebGameServer.Core.World;

namespace WebGameServer.Core.Game;

public class BlockDefinitionManager
{
    private Dictionary<ushort, BlockDefinition> _definitions = new();

    public BlockDefinitionManager()
    {
        LoadDefaults();
    }

    public void LoadFromFile(string filePath)
    {
        if (!File.Exists(filePath)) return;
        var json = File.ReadAllText(filePath);
        var doc = JsonDocument.Parse(json);
        if (!doc.RootElement.TryGetProperty("blocks", out var blocksEl)) return;

        foreach (var prop in blocksEl.EnumerateObject())
        {
            var id = ushort.Parse(prop.Name);
            var el = prop.Value;
            var def = new BlockDefinition
            {
                Id = id,
                Name = el.GetProperty("name").GetString() ?? "",
                Solid = el.TryGetProperty("solid", out var s) && s.GetBoolean(),
                Transparent = el.TryGetProperty("transparent", out var t) && t.GetBoolean(),
                Color = el.TryGetProperty("color", out var c) ? c.GetString() ?? "#808080" : "#808080",
                Liquid = el.TryGetProperty("liquid", out var l) && l.GetBoolean(),
                Light = el.TryGetProperty("light", out var li) ? li.GetInt32() : 0,
                Damage = el.TryGetProperty("damage", out var d) ? d.GetInt32() : 0,
                Breakable = !el.TryGetProperty("breakable", out var b) || b.GetBoolean(),
                Interactive = el.TryGetProperty("interactive", out var i) && i.GetBoolean(),
                DrawType = el.TryGetProperty("drawType", out var dt) ? dt.GetString() ?? "normal" : "normal",
                Hardness = el.TryGetProperty("hardness", out var h) ? h.GetSingle() : 1.0f,
                Drops = el.TryGetProperty("drops", out var dr) ? dr.GetString() : null,
                Climbable = el.TryGetProperty("climbable", out var cl) && cl.GetBoolean()
            };
            _definitions[id] = def;
        }
    }

    private void LoadDefaults()
    {
        _definitions = new Dictionary<ushort, BlockDefinition>
        {
            [(ushort)BlockType.Air] = new() { Id = 0, Name = "air", Solid = false, Transparent = true, Color = "#000000" },
            [(ushort)BlockType.Stone] = new() { Id = 1, Name = "stone", Solid = true, Color = "#808080", Hardness = 1.5f, Drops = "cobblestone" },
            [(ushort)BlockType.Dirt] = new() { Id = 2, Name = "dirt", Solid = true, Color = "#8B4513", Hardness = 0.5f },
            [(ushort)BlockType.Grass] = new() { Id = 3, Name = "grass", Solid = true, Color = "#228B22", Hardness = 0.6f },
            [(ushort)BlockType.Water] = new() { Id = 4, Name = "water", Solid = false, Transparent = true, Color = "#4169E1", Liquid = true },
            [(ushort)BlockType.Sand] = new() { Id = 5, Name = "sand", Solid = true, Color = "#F4A460", Hardness = 0.5f },
            [(ushort)BlockType.Wood] = new() { Id = 6, Name = "wood", Solid = true, Color = "#DEB887", Hardness = 2.0f },
            [(ushort)BlockType.Leaves] = new() { Id = 7, Name = "leaves", Solid = true, Transparent = true, Color = "#32CD32", Hardness = 0.2f },
            [(ushort)BlockType.Glass] = new() { Id = 8, Name = "glass", Solid = true, Transparent = true, Color = "#ADD8E6", Hardness = 0.3f },
            [(ushort)BlockType.Brick] = new() { Id = 9, Name = "brick", Solid = true, Color = "#B22222", Hardness = 2.0f },
            [(ushort)BlockType.OreIron] = new() { Id = 10, Name = "ore_iron", Solid = true, Color = "#C4A882", Hardness = 3.0f, Drops = "iron_ingot" },
            [(ushort)BlockType.Coal] = new() { Id = 11, Name = "coal", Solid = true, Color = "#2F4F4F", Hardness = 3.0f },
            [(ushort)BlockType.Bedrock] = new() { Id = 12, Name = "bedrock", Solid = true, Color = "#1C1C1C", Breakable = false },
            [(ushort)BlockType.Snow] = new() { Id = 13, Name = "snow", Solid = true, Color = "#FFFAFA", Hardness = 0.2f },
            [(ushort)BlockType.Ice] = new() { Id = 14, Name = "ice", Solid = true, Transparent = true, Color = "#B0E0E6", Hardness = 0.5f },
            [(ushort)BlockType.Lava] = new() { Id = 15, Name = "lava", Solid = false, Transparent = true, Color = "#FF4500", Liquid = true, Damage = 4 },
            [(ushort)BlockType.Torch] = new() { Id = 16, Name = "torch", Solid = false, Transparent = true, Color = "#FFD700", Light = 14 },
            [(ushort)BlockType.Ladder] = new() { Id = 17, Name = "ladder", Solid = false, Transparent = true, Color = "#8B4513", Climbable = true },
            [(ushort)BlockType.Fence] = new() { Id = 18, Name = "fence", Solid = true, Transparent = true, Color = "#8B4513", Hardness = 2.0f },
            [(ushort)BlockType.DoorWood] = new() { Id = 19, Name = "door_wood", Solid = true, Transparent = true, Color = "#8B6914", Interactive = true, Hardness = 3.0f },
            [(ushort)BlockType.Chest] = new() { Id = 20, Name = "chest", Solid = true, Color = "#8B4513", Interactive = true, Hardness = 2.5f },
            [(ushort)BlockType.CraftingTable] = new() { Id = 21, Name = "crafting_table", Solid = true, Color = "#D2691E", Interactive = true, Hardness = 2.5f },
            [(ushort)BlockType.Furnace] = new() { Id = 22, Name = "furnace", Solid = true, Color = "#696969", Interactive = true, Hardness = 3.5f },
            [(ushort)BlockType.OreGold] = new() { Id = 23, Name = "ore_gold", Solid = true, Color = "#FFD700", Hardness = 3.0f, Drops = "gold_ingot" },
            [(ushort)BlockType.OreDiamond] = new() { Id = 24, Name = "ore_diamond", Solid = true, Color = "#00FFFF", Hardness = 3.0f, Drops = "diamond" },
            [(ushort)BlockType.Planks] = new() { Id = 25, Name = "planks", Solid = true, Color = "#BC8F5A", Hardness = 2.0f },
            [(ushort)BlockType.Cobblestone] = new() { Id = 26, Name = "cobblestone", Solid = true, Color = "#6B6B6B", Hardness = 2.0f },
            [(ushort)BlockType.StoneBrick] = new() { Id = 27, Name = "stone_brick", Solid = true, Color = "#777777", Hardness = 1.5f },
            [(ushort)BlockType.WoolWhite] = new() { Id = 28, Name = "wool_white", Solid = true, Color = "#EEEEEE", Hardness = 0.8f },
            [(ushort)BlockType.WoolRed] = new() { Id = 29, Name = "wool_red", Solid = true, Color = "#CC2222", Hardness = 0.8f },
            [(ushort)BlockType.WoolBlue] = new() { Id = 30, Name = "wool_blue", Solid = true, Color = "#2222CC", Hardness = 0.8f },
            [(ushort)BlockType.WoolGreen] = new() { Id = 31, Name = "wool_green", Solid = true, Color = "#22CC22", Hardness = 0.8f },
            [(ushort)BlockType.Bookshelf] = new() { Id = 32, Name = "bookshelf", Solid = true, Color = "#C4A050", Hardness = 1.5f }
        };
    }

    public BlockDefinition? Get(ushort id) => _definitions.TryGetValue(id, out var def) ? def : null;
    public BlockDefinition? GetByName(string name) => _definitions.Values.FirstOrDefault(d => d.Name == name);
    public IReadOnlyDictionary<ushort, BlockDefinition> GetAll() => _definitions;
}

public class BlockDefinition
{
    public ushort Id { get; set; }
    public string Name { get; set; } = "";
    public bool Solid { get; set; }
    public bool Transparent { get; set; }
    public string Color { get; set; } = "#808080";
    public bool Liquid { get; set; }
    public int Light { get; set; }
    public int Damage { get; set; }
    public bool Breakable { get; set; } = true;
    public bool Interactive { get; set; }
    public string DrawType { get; set; } = "normal";
    public float Hardness { get; set; } = 1.0f;
    public string? Drops { get; set; }
    public bool Climbable { get; set; }
}
