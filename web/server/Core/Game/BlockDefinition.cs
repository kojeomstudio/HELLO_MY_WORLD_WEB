using System.Text.Json;
using System.Text.Json.Serialization;

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
                DrawType = el.TryGetProperty("drawType", out var dt) ? dt.GetString() ?? "normal" : "normal"
            };
            _definitions[id] = def;
        }
    }

    private void LoadDefaults()
    {
        _definitions = new Dictionary<ushort, BlockDefinition>
        {
            [(ushort)World.BlockType.Air] = new() { Id = 0, Name = "air", Solid = false, Transparent = true, Color = "#000000" },
            [(ushort)World.BlockType.Stone] = new() { Id = 1, Name = "stone", Solid = true, Color = "#808080" },
            [(ushort)World.BlockType.Dirt] = new() { Id = 2, Name = "dirt", Solid = true, Color = "#8B4513" },
            [(ushort)World.BlockType.Grass] = new() { Id = 3, Name = "grass", Solid = true, Color = "#228B22" },
            [(ushort)World.BlockType.Water] = new() { Id = 4, Name = "water", Solid = false, Transparent = true, Color = "#4169E1", Liquid = true },
            [(ushort)World.BlockType.Sand] = new() { Id = 5, Name = "sand", Solid = true, Color = "#F4A460" },
            [(ushort)World.BlockType.Wood] = new() { Id = 6, Name = "wood", Solid = true, Color = "#DEB887" },
            [(ushort)World.BlockType.Leaves] = new() { Id = 7, Name = "leaves", Solid = true, Transparent = true, Color = "#32CD32" },
            [(ushort)World.BlockType.Glass] = new() { Id = 8, Name = "glass", Solid = true, Transparent = true, Color = "#ADD8E6" },
            [(ushort)World.BlockType.Brick] = new() { Id = 9, Name = "brick", Solid = true, Color = "#B22222" },
            [(ushort)World.BlockType.Ore] = new() { Id = 10, Name = "ore", Solid = true, Color = "#8B8989" },
            [(ushort)World.BlockType.Coal] = new() { Id = 11, Name = "coal", Solid = true, Color = "#2F4F4F" },
            [(ushort)World.BlockType.Bedrock] = new() { Id = 12, Name = "bedrock", Solid = true, Color = "#1C1C1C", Breakable = false },
            [(ushort)World.BlockType.Snow] = new() { Id = 13, Name = "snow", Solid = true, Color = "#FFFAFA" },
            [(ushort)World.BlockType.Ice] = new() { Id = 14, Name = "ice", Solid = true, Transparent = true, Color = "#B0E0E6" },
            [(ushort)World.BlockType.Lava] = new() { Id = 15, Name = "lava", Solid = false, Transparent = true, Color = "#FF4500", Liquid = true, Damage = 4 },
            [(ushort)World.BlockType.Torch] = new() { Id = 16, Name = "torch", Solid = false, Transparent = true, Color = "#FFD700", Light = 14 },
            [(ushort)World.BlockType.Ladder] = new() { Id = 17, Name = "ladder", Solid = false, Transparent = true, Color = "#8B4513" },
            [(ushort)World.BlockType.Fence] = new() { Id = 18, Name = "fence", Solid = true, Transparent = true, Color = "#8B4513" },
            [(ushort)World.BlockType.Door] = new() { Id = 19, Name = "door", Solid = true, Transparent = true, Color = "#8B4513", Interactive = true },
            [(ushort)World.BlockType.Chest] = new() { Id = 20, Name = "chest", Solid = true, Color = "#8B4513", Interactive = true },
            [(ushort)World.BlockType.CraftingTable] = new() { Id = 21, Name = "crafting_table", Solid = true, Color = "#D2691E", Interactive = true },
            [(ushort)World.BlockType.Furnace] = new() { Id = 22, Name = "furnace", Solid = true, Color = "#696969", Interactive = true }
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
}
