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
            [(ushort)BlockType.Pumpkin] = new() { Id = 39, Name = "pumpkin", Solid = true, Color = "#FF8C00", Hardness = 1.0f, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
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
            [(ushort)BlockType.WheatCrop] = new() { Id = 64, Name = "wheat_crop", Solid = false, Transparent = true, Color = "#9ACD32", Hardness = 0.0f, Drops = "wheat", Groups = new() { ["snappy"] = 3, ["dig_immediate"] = 3 }, SoundGroup = "grass" },
            [(ushort)BlockType.CarrotCrop] = new() { Id = 65, Name = "carrot_crop", Solid = false, Transparent = true, Color = "#FF8C00", Hardness = 0.0f, Drops = "carrot", Groups = new() { ["snappy"] = 3, ["dig_immediate"] = 3 }, SoundGroup = "grass" },
            [(ushort)BlockType.PotatoCrop] = new() { Id = 66, Name = "potato_crop", Solid = false, Transparent = true, Color = "#DAA520", Hardness = 0.0f, Drops = "potato", Groups = new() { ["snappy"] = 3, ["dig_immediate"] = 3 }, SoundGroup = "grass" },
            [(ushort)BlockType.HayBale] = new() { Id = 67, Name = "hay_bale", Solid = true, Color = "#DAA520", Hardness = 0.5f, Groups = new() { ["snappy"] = 3 }, SoundGroup = "grass" },
            [(ushort)BlockType.DesertStone] = new() { Id = 68, Name = "desert_stone", Solid = true, Color = "#A0926B", Hardness = 1.5f, Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.DirtWithSnow] = new() { Id = 69, Name = "dirt_with_snow", Solid = true, Color = "#8B8B8B", Hardness = 0.6f, Drops = "dirt", Groups = new() { ["crumbly"] = 3 }, SoundGroup = "dirt" },
            [(ushort)BlockType.JungleGrass] = new() { Id = 70, Name = "junglegrass", Solid = false, Transparent = true, Color = "#00AA00", Hardness = 0.0f, Groups = new() { ["dig_immediate"] = 3 }, SoundGroup = "grass" },
            [(ushort)BlockType.JungleWood] = new() { Id = 71, Name = "jungle_wood", Solid = true, Color = "#6B5030", Hardness = 2.0f, Groups = new() { ["choppy"] = 3 }, SoundGroup = "wood" },
            [(ushort)BlockType.JungleLeaves] = new() { Id = 72, Name = "jungle_leaves", Solid = true, Transparent = true, Color = "#1A8C1A", Hardness = 0.2f, Groups = new() { ["snappy"] = 3 }, SoundGroup = "leaves" },
            [(ushort)BlockType.PineWood] = new() { Id = 73, Name = "pine_wood", Solid = true, Color = "#5C3D1E", Hardness = 2.0f, Groups = new() { ["choppy"] = 3 }, SoundGroup = "wood" },
            [(ushort)BlockType.PineNeedles] = new() { Id = 74, Name = "pine_needles", Solid = true, Transparent = true, Color = "#1A5C1A", Hardness = 0.2f, Groups = new() { ["snappy"] = 3 }, SoundGroup = "leaves" },
            [(ushort)BlockType.RiverWater] = new() { Id = 75, Name = "river_water", Solid = false, Transparent = true, Color = "#3060C0", Liquid = true, Drowning = true, LiquidRange = 7, LiquidViscosity = 1, LiquidRenewable = true, Level = 8, SoundGroup = "water" },
            [(ushort)BlockType.CobblestoneSlab] = new() { Id = 76, Name = "cobblestone_slab", Solid = true, Color = "#6B6B6B", Hardness = 2.0f, DrawType = "slab", Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.WoodSlab] = new() { Id = 77, Name = "wood_slab", Solid = true, Color = "#BC8F5A", Hardness = 2.0f, DrawType = "slab", Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.StoneSlab] = new() { Id = 78, Name = "stone_slab", Solid = true, Color = "#808080", Hardness = 2.0f, DrawType = "slab", Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.BrickBlock] = new() { Id = 79, Name = "brick_block", Solid = true, Color = "#B22222", Hardness = 2.0f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.ClayBlock] = new() { Id = 80, Name = "clay_block", Solid = true, Color = "#9BA5B0", Hardness = 0.6f, Groups = new() { ["crumbly"] = 3 }, SoundGroup = "dirt" },
            [(ushort)BlockType.SnowLayer] = new() { Id = 81, Name = "snow_layer", Solid = true, Transparent = true, Color = "#FFFAFA", Hardness = 0.2f, DrawType = "slab", Groups = new() { ["crumbly"] = 3, ["oddly_breakable_by_hand"] = 3 }, SoundGroup = "snow" },
            [(ushort)BlockType.MossyStone] = new() { Id = 82, Name = "mossy_stone", Solid = true, Color = "#5E6E5E", Hardness = 1.5f, Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.CrackedStone] = new() { Id = 83, Name = "cracked_stone", Solid = true, Color = "#777070", Hardness = 1.5f, Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.ChiseledStone] = new() { Id = 84, Name = "chiseled_stone", Solid = true, Color = "#999999", Hardness = 1.5f, Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.DarkPrismarine] = new() { Id = 85, Name = "dark_prismarine", Solid = true, Color = "#0E4A5C", Hardness = 1.5f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.Prismarine] = new() { Id = 86, Name = "prismarine", Solid = true, Color = "#4E8CA8", Hardness = 1.5f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.PrismarineBricks] = new() { Id = 87, Name = "prismarine_bricks", Solid = true, Color = "#3B7A94", Hardness = 1.5f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.SeaLantern] = new() { Id = 88, Name = "sea_lantern", Solid = true, Transparent = true, Color = "#BCC9C2", Hardness = 0.3f, Light = 15, Groups = new() { ["cracky"] = 3 }, SoundGroup = "glass" },
            [(ushort)BlockType.Glowstone] = new() { Id = 89, Name = "glowstone", Solid = true, Transparent = true, Color = "#FFC040", Hardness = 0.3f, Light = 15, Groups = new() { ["cracky"] = 2 }, SoundGroup = "glass" },
            [(ushort)BlockType.RedstoneLamp] = new() { Id = 90, Name = "redstone_lamp", Solid = true, Color = "#7A2020", Hardness = 0.3f, Groups = new() { ["cracky"] = 3, ["oddly_breakable_by_hand"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.RedstoneLampOn] = new() { Id = 91, Name = "redstone_lamp_on", Solid = true, Transparent = true, Color = "#FF6040", Hardness = 0.3f, Light = 12, Groups = new() { ["cracky"] = 3, ["oddly_breakable_by_hand"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.Netherrack] = new() { Id = 92, Name = "netherrack", Solid = true, Color = "#6B2A2A", Hardness = 0.4f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.SoulSand] = new() { Id = 93, Name = "soul_sand", Solid = true, Color = "#5C4827", Hardness = 0.5f, MoveResistance = 0.5f, Groups = new() { ["crumbly"] = 3 }, SoundGroup = "sand" },
            [(ushort)BlockType.NetherBrick] = new() { Id = 94, Name = "nether_brick", Solid = true, Color = "#2A1A1A", Hardness = 2.0f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.EndStone] = new() { Id = 95, Name = "end_stone", Solid = true, Color = "#E8E0B8", Hardness = 3.0f, Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.PurpurBlock] = new() { Id = 96, Name = "purpur_block", Solid = true, Color = "#A86FCF", Hardness = 1.5f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.PurpurPillar] = new() { Id = 97, Name = "purpur_pillar", Solid = true, Color = "#8B5CBF", Hardness = 1.5f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.Mycelium2] = new() { Id = 98, Name = "mycelium2", Solid = true, Color = "#6B5A8A", Hardness = 0.6f, Drops = "dirt", Groups = new() { ["crumbly"] = 3 }, SoundGroup = "dirt" },
            [(ushort)BlockType.Podzol] = new() { Id = 99, Name = "podzol", Solid = true, Color = "#5C4827", Hardness = 0.5f, Drops = "dirt", Groups = new() { ["crumbly"] = 3 }, SoundGroup = "dirt" },
            [(ushort)BlockType.CoarseDirt] = new() { Id = 100, Name = "coarse_dirt", Solid = true, Color = "#6B5C48", Hardness = 0.5f, Groups = new() { ["crumbly"] = 3 }, SoundGroup = "dirt" },
            [(ushort)BlockType.DesertSand] = new() { Id = 101, Name = "desert_sand", Solid = true, Color = "#E8D5A3", Hardness = 0.5f, Falling = true, Groups = new() { ["crumbly"] = 3 }, SoundGroup = "sand" },
            [(ushort)BlockType.RiverWaterFlowing] = new() { Id = 102, Name = "river_water_flowing", Solid = false, Transparent = true, Color = "#3060C0", Liquid = true, Drowning = true, LiquidRange = 7, LiquidViscosity = 1, LiquidRenewable = true, Level = 7, MaxLevel = 8, SoundGroup = "water" },
            [(ushort)BlockType.DesertStoneSlab] = new() { Id = 103, Name = "desert_stone_slab", Solid = true, Color = "#A0926B", Hardness = 1.5f, DrawType = "slab", Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.JungleWoodSlab] = new() { Id = 104, Name = "jungle_wood_slab", Solid = true, Color = "#6B5030", Hardness = 2.0f, DrawType = "slab", Groups = new() { ["choppy"] = 3 }, SoundGroup = "wood" },
            [(ushort)BlockType.PineWoodSlab] = new() { Id = 105, Name = "pine_wood_slab", Solid = true, Color = "#5C3D1E", Hardness = 2.0f, DrawType = "slab", Groups = new() { ["choppy"] = 3 }, SoundGroup = "wood" },
            [(ushort)BlockType.CoalBlock] = new() { Id = 106, Name = "coal_block", Solid = true, Color = "#2F2F2F", Hardness = 5.0f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.LapisBlock] = new() { Id = 107, Name = "lapis_block", Solid = true, Color = "#1A3A8A", Hardness = 5.0f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.EmeraldBlock] = new() { Id = 108, Name = "emerald_block", Solid = true, Color = "#1A8A3A", Hardness = 5.0f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.RedstoneBlock] = new() { Id = 109, Name = "redstone_block", Solid = true, Color = "#AA0000", Hardness = 5.0f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.BrickStairs] = new() { Id = 110, Name = "brick_stairs", Solid = true, Color = "#B22222", Hardness = 2.0f, DrawType = "stair", Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.SandstoneStairs] = new() { Id = 111, Name = "sandstone_stairs", Solid = true, Color = "#E8D5A3", Hardness = 0.8f, DrawType = "stair", Groups = new() { ["cracky"] = 3 }, SoundGroup = "sand" },
            [(ushort)BlockType.WoodStairs] = new() { Id = 112, Name = "wood_stairs", Solid = true, Color = "#BC8F5A", Hardness = 2.0f, DrawType = "stair", Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.CobblestoneStairs] = new() { Id = 113, Name = "cobblestone_stairs", Solid = true, Color = "#6B6B6B", Hardness = 2.0f, DrawType = "stair", Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.DesertStoneStairs] = new() { Id = 114, Name = "desert_stone_stairs", Solid = true, Color = "#A0926B", Hardness = 1.5f, DrawType = "stair", Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.NetherBrickStairs] = new() { Id = 115, Name = "nether_brick_stairs", Solid = true, Color = "#2A1A1A", Hardness = 2.0f, DrawType = "stair", Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.PumpkinBlock] = new() { Id = 116, Name = "pumpkin_block", Solid = true, Color = "#FF8C00", Hardness = 1.0f, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.LitPumpkin] = new() { Id = 117, Name = "jack_o_lantern", Solid = true, Color = "#FF8C00", Hardness = 1.0f, Light = 15, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.CactusBlock] = new() { Id = 118, Name = "cactus_block", Solid = true, Color = "#0A5C0A", Hardness = 0.4f, Damage = 1, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.SugarCaneBlock] = new() { Id = 119, Name = "sugar_cane_block", Solid = false, Transparent = true, Color = "#90EE90", Hardness = 0.2f, Groups = new() { ["dig_immediate"] = 3 }, SoundGroup = "grass" },
            [(ushort)BlockType.DeadBush] = new() { Id = 120, Name = "dead_bush", Solid = false, Transparent = true, Color = "#8B7355", Hardness = 0.0f, DrawType = "plantlike", Groups = new() { ["dig_immediate"] = 3 }, SoundGroup = "grass" },
            [(ushort)BlockType.TallGrass] = new() { Id = 121, Name = "tall_grass", Solid = false, Transparent = true, Color = "#4A8C3A", Hardness = 0.0f, DrawType = "plantlike", Groups = new() { ["dig_immediate"] = 3 }, SoundGroup = "grass" },
            [(ushort)BlockType.FlowerRed] = new() { Id = 122, Name = "flower_red", Solid = false, Transparent = true, Color = "#FF3333", Hardness = 0.0f, DrawType = "plantlike", Groups = new() { ["dig_immediate"] = 3, ["flower"] = 1 }, SoundGroup = "grass" },
            [(ushort)BlockType.FlowerYellow] = new() { Id = 123, Name = "flower_yellow", Solid = false, Transparent = true, Color = "#FFFF33", Hardness = 0.0f, DrawType = "plantlike", Groups = new() { ["dig_immediate"] = 3, ["flower"] = 1 }, SoundGroup = "grass" },
            [(ushort)BlockType.FlowerRose] = new() { Id = 124, Name = "flower_rose", Solid = false, Transparent = true, Color = "#CC0000", Hardness = 0.0f, DrawType = "plantlike", Groups = new() { ["dig_immediate"] = 3, ["flower"] = 1 }, SoundGroup = "grass" },
            [(ushort)BlockType.FlowerTulip] = new() { Id = 125, Name = "flower_tulip", Solid = false, Transparent = true, Color = "#FF6699", Hardness = 0.0f, DrawType = "plantlike", Groups = new() { ["dig_immediate"] = 3, ["flower"] = 1 }, SoundGroup = "grass" },
            [(ushort)BlockType.MushroomRedBlock] = new() { Id = 126, Name = "mushroom_red_block", Solid = false, Transparent = true, Color = "#CC2222", Hardness = 0.0f, DrawType = "plantlike", Groups = new() { ["dig_immediate"] = 3 }, SoundGroup = "grass" },
            [(ushort)BlockType.MushroomBrownBlock] = new() { Id = 127, Name = "mushroom_brown_block", Solid = false, Transparent = true, Color = "#8B6B4A", Hardness = 0.0f, DrawType = "plantlike", Groups = new() { ["dig_immediate"] = 3 }, SoundGroup = "grass" },
            [(ushort)BlockType.GoldOre] = new() { Id = 128, Name = "gold_ore", Solid = true, Color = "#FFD700", Hardness = 3.0f, Drops = "gold_ingot", Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.LapisOre] = new() { Id = 129, Name = "lapis_ore", Solid = true, Color = "#1A3A8A", Hardness = 3.0f, Drops = "lapis_lazuli", Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.EmeraldOre] = new() { Id = 130, Name = "emerald_ore", Solid = true, Color = "#1A8A3A", Hardness = 3.0f, Drops = "emerald", Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.RedstoneOre] = new() { Id = 131, Name = "redstone_ore", Solid = true, Color = "#AA0000", Hardness = 3.0f, Drops = "redstone", Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.CopperOre] = new() { Id = 132, Name = "copper_ore", Solid = true, Color = "#B87333", Hardness = 3.0f, Drops = "raw_copper", Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.CopperBlock] = new() { Id = 133, Name = "copper_block", Solid = true, Color = "#B87333", Hardness = 5.0f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "metal" },
            [(ushort)BlockType.RawCopper] = new() { Id = 134, Name = "raw_copper_block", Solid = true, Color = "#C4895A", Hardness = 3.0f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.Tuff] = new() { Id = 135, Name = "tuff", Solid = true, Color = "#6B6B6B", Hardness = 1.5f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.Dripstone] = new() { Id = 136, Name = "dripstone", Solid = true, Color = "#8B7D6B", Hardness = 1.5f, Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.Calcite] = new() { Id = 137, Name = "calcite", Solid = true, Color = "#D4CDC4", Hardness = 0.75f, Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.Deepslate] = new() { Id = 138, Name = "deepslate", Solid = true, Color = "#4A4A4A", Hardness = 3.0f, Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.Cobweb] = new() { Id = 139, Name = "cobweb", Solid = false, Transparent = true, Color = "#DDDDDD", Hardness = 0.4f, Groups = new() { ["snappy"] = 2 }, SoundGroup = "cloth" },
            [(ushort)BlockType.Fire] = new() { Id = 140, Name = "fire", Solid = false, Transparent = true, Color = "#FF6600", Damage = 1, Light = 15, DrawType = "firelike", Groups = new() { ["dig_immediate"] = 3 }, SoundGroup = "default" },
            [(ushort)BlockType.SoulTorch] = new() { Id = 141, Name = "soul_torch", Solid = false, Transparent = true, Color = "#6699FF", Light = 10, DrawType = "torch", Groups = new() { ["dig_immediate"] = 3 }, SoundGroup = "default" },
            [(ushort)BlockType.Lantern] = new() { Id = 142, Name = "lantern", Solid = true, Transparent = true, Color = "#FFCC66", Hardness = 3.5f, Light = 15, Groups = new() { ["cracky"] = 3 }, SoundGroup = "metal" },
            [(ushort)BlockType.Campfire] = new() { Id = 143, Name = "campfire", Solid = true, Transparent = true, Color = "#8B4513", Hardness = 2.0f, Light = 15, Damage = 1, Interactive = true, Groups = new() { ["cracky"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.SoulCampfire] = new() { Id = 144, Name = "soul_campfire", Solid = true, Transparent = true, Color = "#4169E1", Hardness = 2.0f, Light = 10, Damage = 2, Interactive = true, Groups = new() { ["cracky"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.BlastFurnace] = new() { Id = 145, Name = "blast_furnace", Solid = true, Color = "#4A4A4A", Interactive = true, Hardness = 3.5f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.Smoker] = new() { Id = 146, Name = "smoker", Solid = true, Color = "#696969", Interactive = true, Hardness = 3.5f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.Barrel] = new() { Id = 147, Name = "barrel", Solid = true, Color = "#8B6914", Interactive = true, Hardness = 2.5f, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.Loom] = new() { Id = 148, Name = "loom", Solid = true, Color = "#BC8F5A", Interactive = true, Hardness = 2.5f, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.CartographyTable] = new() { Id = 149, Name = "cartography_table", Solid = true, Color = "#BC8F5A", Interactive = true, Hardness = 2.5f, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.FletchingTable] = new() { Id = 150, Name = "fletching_table", Solid = true, Color = "#BC8F5A", Interactive = true, Hardness = 2.5f, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.SmithingTable] = new() { Id = 151, Name = "smithing_table", Solid = true, Color = "#696969", Interactive = true, Hardness = 2.5f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.Grindstone] = new() { Id = 152, Name = "grindstone", Solid = true, Color = "#808080", Interactive = true, Hardness = 2.0f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.Stonecutter] = new() { Id = 153, Name = "stonecutter", Solid = true, Color = "#696969", Interactive = true, Hardness = 3.5f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.Bell] = new() { Id = 154, Name = "bell", Solid = true, Transparent = true, Color = "#DAA520", Hardness = 5.0f, Interactive = true, Groups = new() { ["cracky"] = 2 }, SoundGroup = "metal" },
            [(ushort)BlockType.IronBars] = new() { Id = 155, Name = "iron_bars", Solid = true, Transparent = true, Color = "#C0C0C0", Hardness = 5.0f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "metal" },
            [(ushort)BlockType.Chain] = new() { Id = 156, Name = "chain", Solid = false, Transparent = true, Color = "#808080", Hardness = 5.0f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "metal" },
            [(ushort)BlockType.NoteBlock] = new() { Id = 157, Name = "note_block", Solid = true, Color = "#8B4513", Interactive = true, Hardness = 2.0f, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.Jukebox] = new() { Id = 158, Name = "jukebox", Solid = true, Color = "#8B4513", Interactive = true, Hardness = 2.0f, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.TargetBlock] = new() { Id = 159, Name = "target_block", Solid = true, Color = "#FFEEEE", Hardness = 0.5f, Groups = new() { ["cracky"] = 3 }, SoundGroup = "cloth" },
            [(ushort)BlockType.PointedDripstone] = new() { Id = 160, Name = "pointed_dripstone", Solid = true, Color = "#8B7D6B", Hardness = 1.5f, Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.Sign] = new() { Id = 161, Name = "sign", Solid = false, Transparent = true, Color = "#8B6914", Interactive = true, Hardness = 1.0f, Groups = new() { ["choppy"] = 3, ["oddly_breakable_by_hand"] = 3 }, SoundGroup = "wood" },
            [(ushort)BlockType.Bed] = new() { Id = 162, Name = "bed", Solid = true, Color = "#CC3333", Interactive = true, Hardness = 0.2f, Groups = new() { ["choppy"] = 2, ["oddly_breakable_by_hand"] = 3 }, SoundGroup = "cloth" },
            [(ushort)BlockType.IronDoor] = new() { Id = 163, Name = "iron_door", Solid = true, Transparent = true, Color = "#C8C8C8", Interactive = true, Hardness = 5.0f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "metal" },
            [(ushort)BlockType.RedstoneWire] = new() { Id = 164, Name = "redstone_wire", Solid = false, Transparent = true, Color = "#CC0000", Hardness = 0.0f, Groups = new() { ["dig_immediate"] = 3 }, SoundGroup = "default" },
            [(ushort)BlockType.RedstoneTorch] = new() { Id = 165, Name = "redstone_torch", Solid = false, Transparent = true, Color = "#FF3300", Light = 7, Hardness = 0.0f, Groups = new() { ["dig_immediate"] = 3 }, SoundGroup = "default" },
            [(ushort)BlockType.Lever] = new() { Id = 166, Name = "lever", Solid = false, Transparent = true, Color = "#6B6B6B", Interactive = true, Hardness = 0.5f, Groups = new() { ["dig_immediate"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.Button] = new() { Id = 167, Name = "button", Solid = false, Transparent = true, Color = "#808080", Interactive = true, Hardness = 0.5f, Groups = new() { ["dig_immediate"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.PressurePlate] = new() { Id = 168, Name = "pressure_plate", Solid = false, Transparent = true, Color = "#808080", Hardness = 0.5f, Groups = new() { ["dig_immediate"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.Piston] = new() { Id = 169, Name = "piston", Solid = true, Color = "#888068", Hardness = 1.5f, Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.PistonSticky] = new() { Id = 170, Name = "piston_sticky", Solid = true, Color = "#4A8A30", Hardness = 1.5f, Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.Observer] = new() { Id = 171, Name = "observer", Solid = true, Color = "#6B6B5E", Hardness = 3.5f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.Repeater] = new() { Id = 172, Name = "repeater", Solid = true, Transparent = true, Color = "#808080", Interactive = true, Hardness = 0.0f, Groups = new() { ["dig_immediate"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.Comparator] = new() { Id = 173, Name = "comparator", Solid = true, Transparent = true, Color = "#F0E0C0", Interactive = true, Hardness = 0.0f, Groups = new() { ["dig_immediate"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.Trapdoor] = new() { Id = 174, Name = "trapdoor", Solid = true, Transparent = true, Color = "#8B6914", Interactive = true, Hardness = 3.0f, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.IronTrapdoor] = new() { Id = 175, Name = "iron_trapdoor", Solid = true, Transparent = true, Color = "#C8C8C8", Interactive = true, Hardness = 5.0f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "metal" },
            [(ushort)BlockType.SpruceDoor] = new() { Id = 176, Name = "spruce_door", Solid = true, Transparent = true, Color = "#5C3A1E", Interactive = true, Hardness = 3.0f, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.BirchDoor] = new() { Id = 177, Name = "birch_door", Solid = true, Transparent = true, Color = "#D4C8A0", Interactive = true, Hardness = 3.0f, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.JungleDoor] = new() { Id = 178, Name = "jungle_door", Solid = true, Transparent = true, Color = "#7A5C30", Interactive = true, Hardness = 3.0f, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.AcaciaDoor] = new() { Id = 179, Name = "acacia_door", Solid = true, Transparent = true, Color = "#B3622A", Interactive = true, Hardness = 3.0f, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.DarkOakDoor] = new() { Id = 180, Name = "dark_oak_door", Solid = true, Transparent = true, Color = "#3E2A14", Interactive = true, Hardness = 3.0f, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.SpruceFence] = new() { Id = 181, Name = "spruce_fence", Solid = true, Transparent = true, Color = "#5C3A1E", Hardness = 2.0f, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.BirchFence] = new() { Id = 182, Name = "birch_fence", Solid = true, Transparent = true, Color = "#D4C8A0", Hardness = 2.0f, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.JungleFence] = new() { Id = 183, Name = "jungle_fence", Solid = true, Transparent = true, Color = "#7A5C30", Hardness = 2.0f, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.AcaciaFence] = new() { Id = 184, Name = "acacia_fence", Solid = true, Transparent = true, Color = "#B3622A", Hardness = 2.0f, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.DarkOakFence] = new() { Id = 185, Name = "dark_oak_fence", Solid = true, Transparent = true, Color = "#3E2A14", Hardness = 2.0f, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.SprucePlanks] = new() { Id = 186, Name = "spruce_planks", Solid = true, Color = "#5C3A1E", Hardness = 2.0f, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.BirchPlanks] = new() { Id = 187, Name = "birch_planks", Solid = true, Color = "#D4C8A0", Hardness = 2.0f, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.JunglePlanks] = new() { Id = 188, Name = "jungle_planks", Solid = true, Color = "#7A5C30", Hardness = 2.0f, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.AcaciaPlanks] = new() { Id = 189, Name = "acacia_planks", Solid = true, Color = "#B3622A", Hardness = 2.0f, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.DarkOakPlanks] = new() { Id = 190, Name = "dark_oak_planks", Solid = true, Color = "#3E2A14", Hardness = 2.0f, Groups = new() { ["choppy"] = 2 }, SoundGroup = "wood" },
            [(ushort)BlockType.StrippedOakLog] = new() { Id = 191, Name = "stripped_oak_log", Solid = true, Color = "#C4A050", Hardness = 2.0f, Groups = new() { ["choppy"] = 3 }, SoundGroup = "wood" },
            [(ushort)BlockType.StrippedBirchLog] = new() { Id = 192, Name = "stripped_birch_log", Solid = true, Color = "#E8DCC0", Hardness = 2.0f, Groups = new() { ["choppy"] = 3 }, SoundGroup = "wood" },
            [(ushort)BlockType.StrippedSpruceLog] = new() { Id = 193, Name = "stripped_spruce_log", Solid = true, Color = "#A07850", Hardness = 2.0f, Groups = new() { ["choppy"] = 3 }, SoundGroup = "wood" },
            [(ushort)BlockType.StrippedJungleLog] = new() { Id = 194, Name = "stripped_jungle_log", Solid = true, Color = "#9A7A44", Hardness = 2.0f, Groups = new() { ["choppy"] = 3 }, SoundGroup = "wood" },
            [(ushort)BlockType.MushroomStem] = new() { Id = 195, Name = "mushroom_stem", Solid = true, Color = "#C8BAA0", Hardness = 0.2f, Groups = new() { ["choppy"] = 2, ["oddly_breakable_by_hand"] = 3 }, SoundGroup = "wood" },
            [(ushort)BlockType.MushroomBlock] = new() { Id = 196, Name = "mushroom_block", Solid = true, Color = "#8B0000", Hardness = 0.2f, Groups = new() { ["choppy"] = 2, ["oddly_breakable_by_hand"] = 3 }, SoundGroup = "wood" },
            [(ushort)BlockType.Sponge] = new() { Id = 197, Name = "sponge", Solid = true, Color = "#C8C878", Hardness = 0.6f, Groups = new() { ["crumbly"] = 3 }, SoundGroup = "sand" },
            [(ushort)BlockType.WetSponge] = new() { Id = 198, Name = "wet_sponge", Solid = true, Color = "#8A9A60", Hardness = 0.6f, Groups = new() { ["crumbly"] = 3 }, SoundGroup = "sand" },
            [(ushort)BlockType.WoolLight] = new() { Id = 199, Name = "wool_light", Solid = true, Color = "#E8E8D0", Hardness = 0.8f, Groups = new() { ["snappy"] = 2 }, SoundGroup = "cloth" },
            [(ushort)BlockType.BoneBlock] = new() { Id = 200, Name = "bone_block", Solid = true, Color = "#E8DCC8", Hardness = 2.0f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.Magma] = new() { Id = 201, Name = "magma", Solid = true, Color = "#4A2A1E", Hardness = 0.5f, Light = 3, Damage = 1, Groups = new() { ["cracky"] = 3, ["hot"] = 1 }, SoundGroup = "stone" },
            [(ushort)BlockType.NetherGoldOre] = new() { Id = 202, Name = "nether_gold_ore", Solid = true, Color = "#8A7048", Hardness = 3.0f, Drops = "gold_nugget", Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.NetherQuartzOre] = new() { Id = 203, Name = "nether_quartz_ore", Solid = true, Color = "#B8A888", Hardness = 3.0f, Drops = "quartz", Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.QuartzBlock] = new() { Id = 204, Name = "quartz_block", Solid = true, Color = "#ECE8E0", Hardness = 0.8f, Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.QuartzPillar] = new() { Id = 205, Name = "quartz_pillar", Solid = true, Color = "#E8E4DC", Hardness = 0.8f, Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.SmoothQuartz] = new() { Id = 206, Name = "smooth_quartz", Solid = true, Color = "#D0CCC4", Hardness = 2.0f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.CryingObsidian] = new() { Id = 207, Name = "crying_obsidian", Solid = true, Color = "#2A0A4E", Hardness = 50.0f, Light = 10, Groups = new() { ["cracky"] = 5 }, SoundGroup = "stone" },
            [(ushort)BlockType.RespawnAnchor] = new() { Id = 208, Name = "respawn_anchor", Solid = true, Color = "#1A1A3A", Interactive = true, Hardness = 50.0f, Light = 15, Groups = new() { ["cracky"] = 5 }, SoundGroup = "stone" },
            [(ushort)BlockType.Lodestone] = new() { Id = 209, Name = "lodestone", Solid = true, Color = "#5A5A5A", Hardness = 3.5f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "metal" },
            [(ushort)BlockType.HoneyBlock] = new() { Id = 210, Name = "honey_block", Solid = true, Color = "#E8A020", Hardness = 0.0f, MoveResistance = 1.0f, Groups = new() { ["snappy"] = 3 }, SoundGroup = "default" },
            [(ushort)BlockType.SlimeBlock] = new() { Id = 211, Name = "slime_block", Solid = true, Color = "#40C840", Hardness = 0.0f, Bouncy = 80, Groups = new() { ["snappy"] = 3, ["oddly_breakable_by_hand"] = 3 }, SoundGroup = "default" },
            [(ushort)BlockType.TNT] = new() { Id = 213, Name = "tnt", Solid = true, Color = "#CC2222", Interactive = true, Hardness = 0.0f, Groups = new() { ["dig_immediate"] = 3, ["oddly_breakable_by_hand"] = 3 }, SoundGroup = "default" },
            [(ushort)BlockType.Andesite] = new() { Id = 214, Name = "andesite", Solid = true, Color = "#8A8A80", Hardness = 1.5f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.Diorite] = new() { Id = 215, Name = "diorite", Solid = true, Color = "#C8C4BE", Hardness = 1.5f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.Granite] = new() { Id = 216, Name = "granite", Solid = true, Color = "#8A6A58", Hardness = 1.5f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.PolishedAndesite] = new() { Id = 217, Name = "polished_andesite", Solid = true, Color = "#909088", Hardness = 1.5f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.PolishedDiorite] = new() { Id = 218, Name = "polished_diorite", Solid = true, Color = "#D4D0CA", Hardness = 1.5f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.PolishedGranite] = new() { Id = 219, Name = "polished_granite", Solid = true, Color = "#9A7A68", Hardness = 1.5f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.CoralBlock] = new() { Id = 220, Name = "coral_block", Solid = true, Color = "#E85080", Hardness = 1.5f, Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.DeadCoralBlock] = new() { Id = 221, Name = "dead_coral_block", Solid = true, Color = "#8A8A8A", Hardness = 1.5f, Groups = new() { ["cracky"] = 3 }, SoundGroup = "stone" },
            [(ushort)BlockType.Kelp] = new() { Id = 222, Name = "kelp", Solid = false, Transparent = true, Color = "#2A8A2A", Hardness = 0.0f, Groups = new() { ["snappy"] = 3, ["dig_immediate"] = 3 }, SoundGroup = "grass" },
            [(ushort)BlockType.SeaGrass] = new() { Id = 223, Name = "sea_grass", Solid = false, Transparent = true, Color = "#2A7A3A", Hardness = 0.0f, Groups = new() { ["snappy"] = 3, ["dig_immediate"] = 3 }, SoundGroup = "grass" },
            [(ushort)BlockType.SeaPickle] = new() { Id = 224, Name = "sea_pickle", Solid = false, Transparent = true, Color = "#80CC30", Light = 6, Hardness = 0.0f, Groups = new() { ["dig_immediate"] = 3 }, SoundGroup = "grass" },
            [(ushort)BlockType.Conduit] = new() { Id = 225, Name = "conduit", Solid = true, Transparent = true, Color = "#40A0CC", Light = 15, Hardness = 3.0f, Groups = new() { ["cracky"] = 2 }, SoundGroup = "stone" },
            [(ushort)BlockType.TurtleEgg] = new() { Id = 226, Name = "turtle_egg", Solid = true, Color = "#D8D0B8", Hardness = 0.5f, Groups = new() { ["crumbly"] = 3, ["oddly_breakable_by_hand"] = 3 }, SoundGroup = "sand" },
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
        "sign" => "default_sign_wall",
        "bed" => "beds_bed_top",
        "iron_door" => "doors_door_iron",
        "redstone_wire" => "default_redstone",
        "redstone_torch" => "default_torch_on",
        "lever" => "default_lever",
        "button" => "default_button",
        "pressure_plate" => "default_pressure_plate_stone",
        "piston" => "default_piston_top",
        "piston_sticky" => "default_piston_top_sticky",
        "observer" => "default_observer",
        "repeater" => "default_repeater",
        "comparator" => "default_comparator",
        "trapdoor" => "doors_trapdoor",
        "iron_trapdoor" => "doors_trapdoor_iron",
        "spruce_door" => "doors_door_spruce",
        "birch_door" => "doors_door_birch",
        "jungle_door" => "doors_door_jungle",
        "acacia_door" => "doors_door_acacia",
        "dark_oak_door" => "doors_door_dark_oak",
        "spruce_fence" => "default_fence_spruce_wood",
        "birch_fence" => "default_fence_birch_wood",
        "jungle_fence" => "default_fence_jungle_wood",
        "acacia_fence" => "default_fence_acacia_wood",
        "dark_oak_fence" => "default_fence_dark_oak_wood",
        "spruce_planks" => "default_spruce_wood",
        "birch_planks" => "default_birch_wood",
        "jungle_planks" => "default_jungle_wood",
        "acacia_planks" => "default_acacia_wood",
        "dark_oak_planks" => "default_dark_oak_wood",
        "stripped_oak_log" => "default_tree_top",
        "stripped_birch_log" => "default_tree_top",
        "stripped_spruce_log" => "default_tree_top",
        "stripped_jungle_log" => "default_tree_top",
        "mushroom_stem" => "mushrooms_mushroom_stem",
        "mushroom_block" => "mushrooms_mushroom_block",
        "sponge" => "default_sponge",
        "wet_sponge" => "default_sponge_wet",
        "wool_light" => "wool_light",
        "bone_block" => "default_bone_block",
        "magma" => "default_magma",
        "nether_gold_ore" => "default_nether_gold_ore",
        "nether_quartz_ore" => "default_quartz_ore",
        "quartz_block" => "default_quartz_block",
        "quartz_pillar" => "default_quartz_pillar_top",
        "smooth_quartz" => "default_quartz_block_smooth",
        "crying_obsidian" => "default_crying_obsidian",
        "respawn_anchor" => "default_respawn_anchor",
        "lodestone" => "default_lodestone",
        "honey_block" => "default_honey_block",
        "slime_block" => "default_slime_block",
        "tnt" => "default_tnt",
        "andesite" => "default_andesite",
        "diorite" => "default_diorite",
        "granite" => "default_granite",
        "polished_andesite" => "default_andesite_smooth",
        "polished_diorite" => "default_diorite_smooth",
        "polished_granite" => "default_granite_smooth",
        "coral_block" => "default_coral_block",
        "dead_coral_block" => "default_coral_block_dead",
        "kelp" => "default_kelp",
        "sea_grass" => "default_seagrass",
        "sea_pickle" => "default_sea_pickle",
        "conduit" => "default_conduit",
        "turtle_egg" => "default_turtle_egg",
        _ => null
    };
}
