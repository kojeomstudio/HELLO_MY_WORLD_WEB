using System.Text.Json;
using WebGameServer.Core.World;

namespace WebGameServer.Core.Game;

public class DigProperties
{
    private readonly Dictionary<string, ToolDigGroup> _toolGroups = new();
    private readonly BlockDefinitionManager _blockDefs;

    public DigProperties(BlockDefinitionManager blockDefs)
    {
        _blockDefs = blockDefs;
        LoadDefaults();
    }

    public void LoadFromFile(string filePath)
    {
        if (!File.Exists(filePath)) return;
        var json = File.ReadAllText(filePath);
        var doc = JsonDocument.Parse(json);
        if (!doc.RootElement.TryGetProperty("toolCapabilities", out var capsEl)) return;

        foreach (var prop in capsEl.EnumerateObject())
        {
            var toolName = prop.Name;
            var el = prop.Value;

            var maxLevel = el.TryGetProperty("maxLevel", out var ml) ? ml.GetInt32() : 1;
            var uses = el.TryGetProperty("uses", out var u) ? u.GetInt32() : 60;
            var speed = el.TryGetProperty("speed", out var s) ? s.GetSingle() : 1.0f;

            var digGroups = new Dictionary<string, float>();
            if (el.TryGetProperty("digGroups", out var dgEl))
            {
                foreach (var dgProp in dgEl.EnumerateObject())
                {
                    digGroups[dgProp.Name] = dgProp.Value.GetSingle();
                }
            }

            _toolGroups[toolName] = new ToolDigGroup(toolName, maxLevel, uses, speed, digGroups);
        }
    }

    public float CalculateDigTime(ushort blockType, string toolItemId)
    {
        var blockDef = _blockDefs.Get(blockType);
        if (blockDef == null || !blockDef.Breakable) return -1f;

        if (blockDef.Groups.Count == 0) return blockDef.Hardness;

        var toolGroup = GetToolGroupForTool(toolItemId);
        if (toolGroup == null) return blockDef.Hardness;

        float bestSpeed = 0f;
        bool matched = false;

        foreach (var (blockGroup, blockLevel) in blockDef.Groups)
        {
            if (blockLevel < 0) return -1f;

            if (toolGroup.DigGroups.TryGetValue(blockGroup, out var toolSpeed))
            {
                if (toolGroup.MaxLevel >= blockLevel)
                {
                    bestSpeed = Math.Max(bestSpeed, toolSpeed);
                    matched = true;
                }
            }
        }

        if (!matched)
        {
            if (blockDef.Groups.ContainsKey("dig_immediate"))
                return 0.1f;
            return blockDef.Hardness;
        }

        if (bestSpeed <= 0) return blockDef.Hardness;

        var digTime = blockDef.Hardness / (toolGroup.Speed * bestSpeed);
        return Math.Max(0.05f, digTime);
    }

    public int CalculateToolWear(ushort blockType, string toolItemId)
    {
        var blockDef = _blockDefs.Get(blockType);
        if (blockDef == null) return 0;

        var toolGroup = GetToolGroupForTool(toolItemId);
        if (toolGroup == null) return 0;

        return toolGroup.Uses;
    }

    public float GetDigSpeed(ushort blockType, string toolItemId)
    {
        var blockDef = _blockDefs.Get(blockType);
        if (blockDef == null) return 1.0f;

        var toolGroup = GetToolGroupForTool(toolItemId);
        if (toolGroup == null) return 1.0f;

        float bestSpeed = 1.0f;
        foreach (var (blockGroup, blockLevel) in blockDef.Groups)
        {
            if (blockLevel < 0) continue;
            if (toolGroup.DigGroups.TryGetValue(blockGroup, out var toolSpeed))
            {
                if (toolGroup.MaxLevel >= blockLevel)
                {
                    bestSpeed = Math.Max(bestSpeed, toolSpeed * toolGroup.Speed);
                }
            }
        }

        return bestSpeed;
    }

    private ToolDigGroup? GetToolGroupForTool(string toolItemId)
    {
        var lower = toolItemId.ToLowerInvariant();
        foreach (var (prefix, group) in _toolGroups)
        {
            if (lower.StartsWith(prefix + "_"))
                return group;
        }
        return null;
    }

    private void LoadDefaults()
    {
        _toolGroups["wooden"] = new ToolDigGroup("wooden", 1, 60, 2.0f,
            new Dictionary<string, float>
            {
                ["cracky"] = 0.5f,
                ["crumbly"] = 1.0f,
                ["choppy"] = 1.0f,
                ["snappy"] = 1.0f
            });

        _toolGroups["stone"] = new ToolDigGroup("stone", 2, 132, 4.0f,
            new Dictionary<string, float>
            {
                ["cracky"] = 1.0f,
                ["crumbly"] = 1.5f,
                ["choppy"] = 1.0f,
                ["snappy"] = 1.0f
            });

        _toolGroups["iron"] = new ToolDigGroup("iron", 3, 251, 6.0f,
            new Dictionary<string, float>
            {
                ["cracky"] = 2.0f,
                ["crumbly"] = 2.0f,
                ["choppy"] = 1.5f,
                ["snappy"] = 1.5f
            });

        _toolGroups["diamond"] = new ToolDigGroup("diamond", 4, 1562, 8.0f,
            new Dictionary<string, float>
            {
                ["cracky"] = 3.0f,
                ["crumbly"] = 3.0f,
                ["choppy"] = 2.0f,
                ["snappy"] = 2.0f
            });

        _toolGroups["gold"] = new ToolDigGroup("gold", 1, 32, 12.0f,
            new Dictionary<string, float>
            {
                ["cracky"] = 1.0f,
                ["crumbly"] = 1.0f,
                ["choppy"] = 1.0f
            });

        _toolGroups["steel"] = new ToolDigGroup("steel", 3, 400, 6.0f,
            new Dictionary<string, float>
            {
                ["cracky"] = 2.0f,
                ["crumbly"] = 2.0f,
                ["choppy"] = 1.5f,
                ["snappy"] = 1.5f
            });

        _toolGroups["mese"] = new ToolDigGroup("mese", 255, 1337, 10.0f,
            new Dictionary<string, float>
            {
                ["cracky"] = 4.0f,
                ["crumbly"] = 4.0f,
                ["choppy"] = 3.0f,
                ["snappy"] = 3.0f
            });

        _toolGroups["titanium"] = new ToolDigGroup("titanium", 4, 2000, 9.0f,
            new Dictionary<string, float>
            {
                ["cracky"] = 3.5f,
                ["crumbly"] = 3.0f,
                ["choppy"] = 2.5f,
                ["snappy"] = 2.5f
            });
    }
}

public record ToolDigGroup(
    string Name,
    int MaxLevel,
    int Uses,
    float Speed,
    Dictionary<string, float> DigGroups);
