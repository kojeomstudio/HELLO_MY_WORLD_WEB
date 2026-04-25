namespace WebGameServer.Core.Entities;

public class BreedingSystem
{
    private readonly Dictionary<Guid, DateTime> _lastFedTime = new();

    public Func<MobEntity, MobEntity?>? SpawnMob { get; set; }

    public bool TryFeedMob(MobEntity mob, string itemId)
    {
        var mobType = mob.MobType;
        var isValidFood = mobType switch
        {
            "Cow" or "Pig" => itemId == "wheat",
            "Chicken" => itemId == "seeds",
            _ => false
        };

        if (!isValidFood) return false;

        _lastFedTime[mob.Id] = DateTime.UtcNow;
        return true;
    }

    public MobEntity? CheckBreeding(MobEntity mob1, MobEntity mob2)
    {
        if (mob1.MobType != mob2.MobType) return null;
        if (mob1.IsBaby || mob2.IsBaby) return null;

        if (!_lastFedTime.TryGetValue(mob1.Id, out var fed1)) return null;
        if (!_lastFedTime.TryGetValue(mob2.Id, out var fed2)) return null;

        var now = DateTime.UtcNow;
        if ((now - fed1).TotalSeconds > 30 || (now - fed2).TotalSeconds > 30) return null;

        var midPoint = (mob1.Position + mob2.Position) * 0.5f;
        var baby = new MobEntity(mob1.MobType, midPoint);
        baby.IsBaby = true;
        baby.Speed *= 0.5f;
        baby.GrowTimer = 60.0f;

        _lastFedTime.Remove(mob1.Id);
        _lastFedTime.Remove(mob2.Id);

        if (SpawnMob == null) return null;
        return SpawnMob(baby);
    }
}
