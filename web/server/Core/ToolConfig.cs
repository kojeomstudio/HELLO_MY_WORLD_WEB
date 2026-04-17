using System.Text.Json;

namespace WebGameServer.Core;

public record ToolMaterial(string Name, int Durability, float MiningSpeed);

public static class ToolConfig
{
    public static readonly Dictionary<string, ToolMaterial> Materials = new();
    public static readonly Dictionary<string, int> WeaponDamage = new();

    public static void LoadFromFile(string filePath)
    {
        if (!File.Exists(filePath)) return;

        var json = File.ReadAllText(filePath);
        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;

        if (root.TryGetProperty("materials", out var materialsEl))
        {
            foreach (var prop in materialsEl.EnumerateObject())
            {
                var durability = prop.Value.GetProperty("durability").GetInt32();
                var miningSpeed = prop.Value.GetProperty("miningSpeed").GetSingle();
                Materials[prop.Name] = new ToolMaterial(prop.Name, durability, miningSpeed);
            }
        }

        if (root.TryGetProperty("weaponDamage", out var weaponDamageEl))
        {
            foreach (var prop in weaponDamageEl.EnumerateObject())
            {
                WeaponDamage[prop.Name] = prop.Value.GetInt32();
            }
        }
    }

    public static int GetDurability(string itemName)
    {
        var lower = itemName.ToLowerInvariant();
        foreach (var (prefix, material) in Materials)
        {
            if (lower.StartsWith(prefix + "_"))
            {
                return material.Durability;
            }
        }
        return 60;
    }

    public static float GetMiningSpeed(string itemName)
    {
        var lower = itemName.ToLowerInvariant();
        foreach (var (prefix, material) in Materials)
        {
            if (lower.StartsWith(prefix + "_"))
            {
                return material.MiningSpeed;
            }
        }
        return 1.0f;
    }

    public static int GetWeaponDamage(string itemName) =>
        WeaponDamage.GetValueOrDefault(itemName.ToLowerInvariant(), 1);
}
