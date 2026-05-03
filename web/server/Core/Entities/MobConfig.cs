using System.Text.Json;

namespace WebGameServer.Core.Entities;

public record MobDefinition(
    string Type,
    float Health,
    float AttackDamage,
    float Speed,
    float AttackRange,
    float AttackCooldown,
    float DetectionRange,
    bool Hostile,
    int DespawnRange,
    (string itemId, int count)[] Drops,
    Dictionary<string, int> ArmorGroups,
    bool MakesFootstepSound,
    string? Nametag,
    string? NametagColor);

public static class MobConfig
{
    public static readonly Dictionary<string, MobDefinition> Definitions = new();

    public static void LoadFromFile(string filePath)
    {
        if (!File.Exists(filePath)) return;

        var json = File.ReadAllText(filePath);
        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;

        if (!root.TryGetProperty("mobs", out var mobsArray)) return;

        foreach (var mobEl in mobsArray.EnumerateArray())
        {
            var type = mobEl.GetProperty("type").GetString() ?? "";
            var health = mobEl.GetProperty("health").GetSingle();
            var attackDamage = mobEl.GetProperty("attackDamage").GetSingle();
            var speed = mobEl.GetProperty("speed").GetSingle();
            var attackRange = mobEl.GetProperty("attackRange").GetSingle();
            var attackCooldown = mobEl.GetProperty("attackCooldown").GetSingle();
            var detectionRange = mobEl.GetProperty("detectionRange").GetSingle();
            var hostile = mobEl.GetProperty("hostile").GetBoolean();
            var despawnRange = mobEl.GetProperty("despawnRange").GetInt32();

            var drops = new List<(string, int)>();
            if (mobEl.TryGetProperty("drops", out var dropsArray))
            {
                foreach (var dropEl in dropsArray.EnumerateArray())
                {
                    var itemId = dropEl[0].GetString() ?? "";
                    var count = dropEl[1].GetInt32();
                    drops.Add((itemId, count));
                }
            }

            var armorGroups = new Dictionary<string, int>();
            if (mobEl.TryGetProperty("armorGroups", out var agEl))
            {
                foreach (var agProp in agEl.EnumerateObject())
                {
                    armorGroups[agProp.Name] = agProp.Value.GetInt32();
                }
            }

            var makesFootstepSound = false;
            if (mobEl.TryGetProperty("makesFootstepSound", out var mfsEl))
            {
                makesFootstepSound = mfsEl.GetBoolean();
            }

            string? nametag = null;
            if (mobEl.TryGetProperty("nametag", out var ntEl))
            {
                nametag = ntEl.GetString();
            }

            string? nametagColor = null;
            if (mobEl.TryGetProperty("nametagColor", out var ntcEl))
            {
                nametagColor = ntcEl.GetString();
            }

            Definitions[type] = new MobDefinition(
                type, health, attackDamage, speed, attackRange,
                attackCooldown, detectionRange, hostile, despawnRange,
                drops.ToArray(), armorGroups, makesFootstepSound, nametag, nametagColor);
        }
    }

    public static MobDefinition? Get(string mobType) =>
        Definitions.GetValueOrDefault(mobType);
}
