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
                Damage = el.TryGetProperty("damage", out var d) ? d.GetSingle() : 0f,
                Breakable = !el.TryGetProperty("breakable", out var b) || b.GetBoolean(),
                Interactive = el.TryGetProperty("interactive", out var i) && i.GetBoolean(),
                DrawType = el.TryGetProperty("drawType", out var dt) ? dt.GetString() ?? "normal" : "normal",
                Hardness = el.TryGetProperty("hardness", out var h) ? h.GetSingle() : 1.0f,
                Drops = el.TryGetProperty("drops", out var dr) ? dr.GetString() : null,
                Climbable = el.TryGetProperty("climbable", out var cl) && cl.GetBoolean(),
                Drowning = el.TryGetProperty("drowning", out var dn) && dn.GetBoolean(),
                Falling = el.TryGetProperty("falling", out var fl) && fl.GetBoolean(),
                Bouncy = el.TryGetProperty("bouncy", out var bn) ? bn.GetInt32() : 0,
                Slippery = el.TryGetProperty("slippery", out var sl) && sl.GetBoolean(),
                LiquidRange = el.TryGetProperty("liquidRange", out var lr) ? lr.GetInt32() : 0,
                LiquidViscosity = el.TryGetProperty("liquidViscosity", out var lv) ? lv.GetInt32() : 0,
                LiquidRenewable = el.TryGetProperty("liquidRenewable", out var lre) && lre.GetBoolean(),
                MoveResistance = el.TryGetProperty("moveResistance", out var mr) ? mr.GetSingle() : 0f,
                PostEffectColor = el.TryGetProperty("postEffectColor", out var pec) ? pec.GetString() : null,
                Level = el.TryGetProperty("level", out var le) ? le.GetInt32() : 8,
                MaxLevel = el.TryGetProperty("maxLevel", out var ml) ? ml.GetInt32() : 8,
            };

            if (el.TryGetProperty("groups", out var groupsEl))
            {
                def.Groups = new Dictionary<string, int>();
                foreach (var groupProp in groupsEl.EnumerateObject())
                {
                    def.Groups[groupProp.Name] = groupProp.Value.GetInt32();
                }
            }

            if (el.TryGetProperty("sounds", out var soundsEl))
            {
                def.SoundGroup = soundsEl.GetString() ?? "default";
            }

            _definitions[id] = def;
        }
    }

    private void LoadDefaults()
    {
        _definitions = new Dictionary<ushort, BlockDefinition>
        {
            [(ushort)BlockType.Air] = new() { Id = 0, Name = "air", Solid = false, Transparent = true, Color = "#000000" },
            [(ushort)BlockType.Stone] = new() { Id = 1, Name = "stone", Solid = true, Color = "#808080", Hardness = 1.5f, Drops = "cobblestone", Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.Dirt] = new() { Id = 2, Name = "dirt", Solid = true, Color = "#8B4513", Hardness = 0.5f, Groups = new() { ["crumbly"] = 3 }, SoundGroup = "dirt" },
            [(ushort)BlockType.Grass] = new() { Id = 3, Name = "grass", Solid = true, Color = "#228B22", Hardness = 0.6f, Drops = "dirt", Groups = new() { ["crumbly"] = 3 }, SoundGroup = "grass" },
            [(ushort)BlockType.Water] = new() { Id = 4, Name = "water", Solid = false, Transparent = true, Color = "#4169E1", Liquid = true, Drowning = true, LiquidRange = 7, LiquidViscosity = 1, LiquidRenewable = true, Level = 8, SoundGroup = "water" },
            [(ushort)BlockType.Sand] = new() { Id = 5, Name = "sand", Solid = true, Color = "#F4A460", Hardness = 0.5f, Falling = true, Groups = new() { ["crumbly"] = 3 }, SoundGroup = "sand" },
            [(ushort)BlockType.Wood] = new() { Id = 6, Name = "wood", Solid = true, Color = "#DEB887", Hardness = 2.0f, Groups = new() { ["choppy"] = 3 }, SoundGroup = "wood" },
            [(ushort)BlockType.Leaves] = new() { Id = 7, Name = "leaves", Solid = true, Transparent = true, Color = "#32CD32", Hardness = 0.2f, Groups = new() { ["snappy"] = 3 }, SoundGroup = "leaves" },
            [(ushort)BlockType.Glass] = new() { Id = 8, Name = "glass", Solid = true, Transparent = true, Color = "#ADD8E6", Hardness = 0.3f, Groups = new() { ["cracky"] = 3, ["oddly_breakable_by_hand"] = 3 }, SoundGroup = "glass" },
            [(ushort)BlockType.Brick] = new() { Id = 9, Name = "brick", Solid = true, Color = "#B22222", Hardness = 2.0f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.OreIron] = new() { Id = 10, Name = "ore_iron", Solid = true, Color = "#C4A882", Hardness = 3.0f, Drops = "iron_ingot", Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.Coal] = new() { Id = 11, Name = "coal", Solid = true, Color = "#2F4F4F", Hardness = 3.0f, Drops = "coal", Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.Bedrock] = new() { Id = 12, Name = "bedrock", Solid = true, Color = "#1C1C1C", Breakable = false, Groups = new() { ["cracky"] = -1 }, SoundGroup = "stone" },
            [(ushort)BlockType.Snow] = new() { Id = 13, Name = "snow", Solid = true, Color = "#FFFAFA", Hardness = 0.2f, Groups = new() { ["crumbly"] = 3, ["oddly_breakable_by_hand"] = 3 }, SoundGroup = "snow" },
            [(ushort)BlockType.Ice] = new() { Id = 14, Name = "ice", Solid = true, Transparent = true, Color = "#B0E0E6", Hardness = 0.5f, Slippery = true, Groups = new() { ["cracky"] = 3 }, SoundGroup = "glass" },
            [(ushort)BlockType.Lava] = new() { Id = 15, Name = "lava", Solid = false, Transparent = true, Color = "#FF4500", Liquid = true, Damage = 4, LiquidRange = 7, LiquidViscosity = 7, LiquidRenewable = false, Level = 8, PostEffectColor = "#FF4400", SoundGroup = "lava" },
            [(ushort)BlockType.Torch] = new() { Id = 16, Name = "torch", Solid = false, Transparent = true, Color = "#FFD700", Light = 14, Groups = new() { ["dig_immediate"] = 3 }, SoundGroup = "default" },
            [(ushort)BlockType.Ladder] = new() { Id = 17, Name = "ladder", Solid = false, Transparent = true, Color = "#8B4513", Climbable = true, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.Fence] = new() { Id = 18, Name = "fence", Solid = true, Transparent = true, Color = "#8B4513", Hardness = 2.0f, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.DoorWood] = new() { Id = 19, Name = "door_wood", Solid = true, Transparent = true, Color = "#8B6914", Interactive = true, Hardness = 3.0f, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.Chest] = new() { Id = 20, Name = "chest", Solid = true, Color = "#8B4513", Interactive = true, Hardness = 2.5f, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.CraftingTable] = new() { Id = 21, Name = "crafting_table", Solid = true, Color = "#D2691E", Interactive = true, Hardness = 2.5f, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.Furnace] = new() { Id = 22, Name = "furnace", Solid = true, Color = "#696969", Interactive = true, Hardness = 3.5f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.OreGold] = new() { Id = 23, Name = "ore_gold", Solid = true, Color = "#FFD700", Hardness = 3.0f, Drops = "gold_ingot", Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.OreDiamond] = new() { Id = 24, Name = "ore_diamond", Solid = true, Color = "#00FFFF", Hardness = 3.0f, Drops = "diamond", Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.Planks] = new() { Id = 25, Name = "planks", Solid = true, Color = "#BC8F5A", Hardness = 2.0f, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.Cobblestone] = new() { Id = 26, Name = "cobblestone", Solid = true, Color = "#6B6B6B", Hardness = 2.0f, Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.StoneBrick] = new() { Id = 27, Name = "stone_brick", Solid = true, Color = "#777777", Hardness = 1.5f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.WoolWhite] = new() { Id = 28, Name = "wool_white", Solid = true, Color = "#EEEEEE", Hardness = 0.8f, Groups = new() { ["snappy"] = 2 }, SoundGroup = "cloth" },
            [(ushort)BlockType.WoolRed] = new() { Id = 29, Name = "wool_red", Solid = true, Color = "#CC2222", Hardness = 0.8f, Groups = new() { ["snappy"] = 2 }, SoundGroup = "cloth" },
            [(ushort)BlockType.WoolBlue] = new() { Id = 30, Name = "wool_blue", Solid = true, Color = "#2222CC", Hardness = 0.8f, Groups = new() { ["snappy"] = 2 }, SoundGroup = "cloth" },
            [(ushort)BlockType.WoolGreen] = new() { Id = 31, Name = "wool_green", Solid = true, Color = "#22CC22", Hardness = 0.8f, Groups = new() { ["snappy"] = 2 }, SoundGroup = "cloth" },
            [(ushort)BlockType.Bookshelf] = new() { Id = 32, Name = "bookshelf", Solid = true, Color = "#C4A050", Hardness = 1.5f, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.Gravel] = new() { Id = 33, Name = "gravel", Solid = true, Color = "#888078", Hardness = 0.6f, Falling = true, Groups = new() { ["crumbly"] = 3 }, SoundGroup = "gravel" },
            [(ushort)BlockType.Clay] = new() { Id = 34, Name = "clay", Solid = true, Color = "#9BA5B0", Hardness = 0.6f, Groups = new() { ["crumbly"] = 3 }, SoundGroup = "dirt" },
            [(ushort)BlockType.SandStone] = new() { Id = 35, Name = "sandstone", Solid = true, Color = "#E8D5A3", Hardness = 0.8f, Groups = new() { ["cracky"] = 3 }, SoundGroup = "sand" },
            [(ushort)BlockType.Obsidian] = new() { Id = 36, Name = "obsidian", Solid = true, Color = "#1A0A2E", Hardness = 50.0f, Groups = new() { ["cracky"] = 5, ["oddly_breakable_by_hand"] = 5 }, SoundGroup = "stone" },
            [(ushort)BlockType.Cactus] = new() { Id = 37, Name = "cactus", Solid = true, Color = "#0A5C0A", Hardness = 0.4f, Damage = 1, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.SugarCane] = new() { Id = 38, Name = "sugar_cane", Solid = false, Transparent = true, Color = "#90EE90", Hardness = 0.2f, Groups = new() { ["dig_immediate"] = 3 }, SoundGroup = "grass" },
            [(ushort)BlockType.Pumpking] = new() { Id = 39, Name = "pumpkin", Solid = true, Color = "#FF8C00", Hardness = 1.0f, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.Melon] = new() { Id = 40, Name = "melon", Solid = true, Color = "#5C8A1E", Hardness = 1.0f, Drops = "melon_slice", Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.Mycelium] = new() { Id = 41, Name = "mycelium", Solid = true, Color = "#6B5A8A", Hardness = 0.6f, Drops = "dirt", Groups = new() { ["crumbly"] = 3 }, SoundGroup = "dirt" },
            [(ushort)BlockType.Farmland] = new() { Id = 42, Name = "farmland", Solid = true, Color = "#6B4E2A", Hardness = 0.6f, Groups = new() { ["crumbly"] = 3 }, SoundGroup = "dirt" },
            [(ushort)BlockType.WaterFlowing] = new() { Id = 43, Name = "water_flowing", Solid = false, Transparent = true, Color = "#4169E1", Liquid = true, Drowning = true, LiquidRange = 7, LiquidViscosity = 1, LiquidRenewable = true, Level = 7, MaxLevel = 8, SoundGroup = "water" },
            [(ushort)BlockType.LavaFlowing] = new() { Id = 44, Name = "lava_flowing", Solid = false, Transparent = true, Color = "#FF4500", Liquid = true, Damage = 4, LiquidRange = 4, LiquidViscosity = 7, LiquidRenewable = false, Level = 7, MaxLevel = 8, PostEffectColor = "#FF4400", SoundGroup = "lava" },
            [(ushort)BlockType.CoalOre] = new() { Id = 45, Name = "coal_ore", Solid = true, Color = "#3A3A3A", Hardness = 3.0f, Drops = "coal", Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.MossyCobblestone] = new() { Id = 46, Name = "mossy_cobblestone", Solid = true, Color = "#5E6E5E", Hardness = 2.0f, Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.IronBlock] = new() { Id = 47, Name = "iron_block", Solid = true, Color = "#D8D8D8", Hardness = 5.0f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "metal" },
            [(ushort)BlockType.GoldBlock] = new() { Id = 48, Name = "gold_block", Solid = true, Color = "#FFD700", Hardness = 3.0f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "metal" },
            [(ushort)BlockType.DiamondBlock] = new() { Id = 49, Name = "diamond_block", Solid = true, Color = "#4AEDD9", Hardness = 5.0f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "metal" },
            [(ushort)BlockType.WoolOrange] = new() { Id = 50, Name = "wool_orange", Solid = true, Color = "#E8821C", Hardness = 0.8f, Groups = new() { ["snappy"] = 2 }, SoundGroup = "cloth" },
            [(ushort)BlockType.WoolYellow] = new() { Id = 51, Name = "wool_yellow", Solid = true, Color = "#F2E63C", Hardness = 0.8f, Groups = new() { ["snappy"] = 2 }, SoundGroup = "cloth" },
            [(ushort)BlockType.WoolCyan] = new() { Id = 52, Name = "wool_cyan", Solid = true, Color = "#2CC4AD", Hardness = 0.8f, Groups = new() { ["snappy"] = 2 }, SoundGroup = "cloth" },
            [(ushort)BlockType.WoolPurple] = new() { Id = 53, Name = "wool_purple", Solid = true, Color = "#7B2FBE", Hardness = 0.8f, Groups = new() { ["snappy"] = 2 }, SoundGroup = "cloth" },
            [(ushort)BlockType.WoolBlack] = new() { Id = 54, Name = "wool_black", Solid = true, Color = "#1D1D1D", Hardness = 0.8f, Groups = new() { ["snappy"] = 2 }, SoundGroup = "cloth" },
            [(ushort)BlockType.WoolBrown] = new() { Id = 55, Name = "wool_brown", Solid = true, Color = "#724528", Hardness = 0.8f, Groups = new() { ["snappy"] = 2 }, SoundGroup = "cloth" },
            [(ushort)BlockType.WoolPink] = new() { Id = 56, Name = "wool_pink", Solid = true, Color = "#F2A5C4", Hardness = 0.8f, Groups = new() { ["snappy"] = 2 }, SoundGroup = "cloth" },
            [(ushort)BlockType.WoolLime] = new() { Id = 57, Name = "wool_lime", Solid = true, Color = "#52B248", Hardness = 0.8f, Groups = new() { ["snappy"] = 2 }, SoundGroup = "cloth" },
            [(ushort)BlockType.WoolLightBlue] = new() { Id = 58, Name = "wool_light_blue", Solid = true, Color = "#6689D3", Hardness = 0.8f, Groups = new() { ["snappy"] = 2 }, SoundGroup = "cloth" },
            [(ushort)BlockType.WoolMagenta] = new() { Id = 59, Name = "wool_magenta", Solid = true, Color = "#B24CBF", Hardness = 0.8f, Groups = new() { ["snappy"] = 2 }, SoundGroup = "cloth" },
            [(ushort)BlockType.WoolGray] = new() { Id = 60, Name = "wool_gray", Solid = true, Color = "#6B6B6B", Hardness = 0.8f, Groups = new() { ["snappy"] = 2 }, SoundGroup = "cloth" },
            [(ushort)BlockType.WoolLightGray] = new() { Id = 61, Name = "wool_light_gray", Solid = true, Color = "#A0A0A0", Hardness = 0.8f, Groups = new() { ["snappy"] = 2 }, SoundGroup = "cloth" },
            [(ushort)BlockType.GlowingObsidian] = new() { Id = 62, Name = "glowing_obsidian", Solid = true, Color = "#3A1A5E", Hardness = 50.0f, Light = 14, Groups = new() { ["cracky"] = 5 }, SoundGroup = "stone" },
            [(ushort)BlockType.Apple] = new() { Id = 63, Name = "apple_block", Solid = true, Color = "#CC2222", Hardness = 0.8f, Drops = "apple", Groups = new() { ["snappy"] = 3, ["oddly_breakable_by_hand"] = 3 }, SoundGroup = "grass" },
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
    public float Damage { get; set; }
    public bool Breakable { get; set; } = true;
    public bool Interactive { get; set; }
    public string DrawType { get; set; } = "normal";
    public float Hardness { get; set; } = 1.0f;
    public string? Drops { get; set; }
    public bool Climbable { get; set; }
    public bool Drowning { get; set; }
    public bool Falling { get; set; }
    public int Bouncy { get; set; }
    public bool Slippery { get; set; }
    public int LiquidRange { get; set; }
    public int LiquidViscosity { get; set; }
    public bool LiquidRenewable { get; set; }
    public float MoveResistance { get; set; }
    public string? PostEffectColor { get; set; }
    public int Level { get; set; } = 8;
    public int MaxLevel { get; set; } = 8;
    public Dictionary<string, int> Groups { get; set; } = new();
    public string SoundGroup { get; set; } = "default";

    public string? TextureName => Name switch
    {
        "stone" => "default_stone",
        "dirt" => "default_dirt",
        "grass" => "default_grass",
        "water" => "default_water",
        "sand" => "default_sand",
        "wood" => "default_tree",
        "leaves" => "default_leaves",
        "snow" => "default_snow",
        "ice" => "default_ice",
        "lava" => "default_lava",
        "cobblestone" => "default_cobble",
        "gravel" => "default_gravel",
        "water_flowing" => "default_water_flowing",
        "lava_flowing" => "default_lava_flowing",
        "mossy_cobblestone" => "default_mossycobble",
        _ => null
    };
}
