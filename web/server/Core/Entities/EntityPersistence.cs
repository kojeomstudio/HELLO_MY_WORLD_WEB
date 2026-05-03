namespace WebGameServer.Core.Entities;

using System.Text.Json;

public static class EntityPersistence
{
    public static void Save(IEnumerable<Entity> entities, string filePath)
    {
        try
        {
            var data = entities
                .Where(e => e.IsAlive)
                .Select(e => new
                {
                    e.Id,
                    Type = e.Type.ToString(),
                    e.Position,
                    e.Velocity,
                    e.Yaw,
                    e.Pitch,
                    e.Health,
                    e.MaxHealth,
                    MobType = e is MobEntity mob ? mob.MobType : null,
                    IsBaby = e is MobEntity mob2 ? mob2.IsBaby : false,
                    VisualScale = e is MobEntity mob3 ? mob3.VisualScale : 1.0f,
                    ItemId = e is ItemEntity item ? item.ItemId : null,
                    Count = e is ItemEntity item2 ? item2.Count : 0
                })
                .ToList();
            var json = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(filePath, json);
        }
        catch { }
    }

    public static List<Entity>? Load(string filePath, Func<string, Vector3, Entity>? mobFactory = null)
    {
        try
        {
            if (!File.Exists(filePath)) return null;
            var json = File.ReadAllText(filePath);
            var data = JsonSerializer.Deserialize<List<JsonElement>>(json);
            if (data == null) return null;

            var entities = new List<Entity>();
            foreach (var el in data)
            {
                var typeStr = el.GetProperty("Type").GetString();
                var entityType = Enum.Parse<EntityType>(typeStr!);

                var x = el.GetProperty("Position").GetProperty("X").GetSingle();
                var y = el.GetProperty("Position").GetProperty("Y").GetSingle();
                var z = el.GetProperty("Position").GetProperty("Z").GetSingle();
                var pos = new Vector3(x, y, z);

                Entity entity;
                if (entityType == EntityType.Mob && mobFactory != null)
                {
                    var mobType = el.TryGetProperty("MobType", out var mt) ? mt.GetString() ?? "Zombie" : "Zombie";
                    entity = mobFactory(mobType, pos)!;
                    entity.Health = el.GetProperty("Health").GetSingle();
                    entity.MaxHealth = el.GetProperty("MaxHealth").GetSingle();
                    if (entity is MobEntity mob)
                    {
                        mob.Yaw = el.GetProperty("Yaw").GetSingle();
                        mob.Pitch = el.GetProperty("Pitch").GetSingle();
                        mob.IsBaby = el.GetProperty("IsBaby").GetBoolean();
                        mob.VisualScale = el.TryGetProperty("VisualScale", out var vs) ? vs.GetSingle() : 1.0f;
                    }
                }
                else if (entityType == EntityType.Item)
                {
                    var itemId = el.TryGetProperty("ItemId", out var ii) ? ii.GetString() ?? "" : "";
                    var count = el.TryGetProperty("Count", out var c) ? c.GetInt32() : 1;
                    entity = new ItemEntity(itemId, count, pos);
                    entity.Health = el.GetProperty("Health").GetSingle();
                    entity.MaxHealth = el.GetProperty("MaxHealth").GetSingle();
                }
                else continue;

                entities.Add(entity);
            }
            return entities;
        }
        catch { return null; }
    }
}
