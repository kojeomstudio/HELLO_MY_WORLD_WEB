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
    (string itemId, int count)[] Drops);

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
                    var dropItems = new string[dropsArray.EnumerateArray().Count()];
                    var itemId = dropEl[0].GetString() ?? "";
                    var count = dropEl[1].GetInt32();
                    drops.Add((itemId, count));
                }
            }

            Definitions[type] = new MobDefinition(
                type, health, attackDamage, speed, attackRange,
                attackCooldown, detectionRange, hostile, despawnRange,
                drops.ToArray());
        }
    }

    public static MobDefinition? Get(string mobType) =>
        Definitions.GetValueOrDefault(mobType);
}
