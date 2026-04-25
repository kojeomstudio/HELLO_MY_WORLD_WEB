namespace WebGameServer.Core.Auth;

public class ProtectionZone
{
    public string Owner { get; set; } = string.Empty;
    public Vector3 Min { get; set; }
    public Vector3 Max { get; set; }
    public HashSet<string> AllowedPlayers { get; set; } = new();
    public string Name { get; set; } = string.Empty;
}

public class ProtectionSystem
{
    private readonly List<ProtectionZone> _zones = new();

    public bool IsProtected(Vector3 position, string playerName, string action)
    {
        foreach (var zone in _zones)
        {
            if (position.X < zone.Min.X || position.X > zone.Max.X) continue;
            if (position.Y < zone.Min.Y || position.Y > zone.Max.Y) continue;
            if (position.Z < zone.Min.Z || position.Z > zone.Max.Z) continue;

            if (zone.Owner == playerName) return false;
            if (zone.AllowedPlayers.Contains(playerName)) return false;

            if (action == "interact") return true;
            if (action == "build") return true;
        }

        return false;
    }

    public bool CreateZone(string owner, Vector3 min, Vector3 max, string name)
    {
        if (_zones.Any(z => z.Name == name)) return false;

        _zones.Add(new ProtectionZone
        {
            Owner = owner,
            Min = min,
            Max = max,
            Name = name
        });

        return true;
    }

    public bool RemoveZone(string name, string requester)
    {
        var zone = _zones.FirstOrDefault(z => z.Name == name);
        if (zone == null) return false;
        if (zone.Owner != requester) return false;

        _zones.Remove(zone);
        return true;
    }

    public bool AddPlayerToZone(string zoneName, string playerName, string requester)
    {
        var zone = _zones.FirstOrDefault(z => z.Name == zoneName);
        if (zone == null) return false;
        if (zone.Owner != requester) return false;

        zone.AllowedPlayers.Add(playerName);
        return true;
    }

    public bool CanInteract(string playerName, Vector3s position)
    {
        var pos = new Vector3(position.X, position.Y, position.Z);
        return !IsProtected(pos, playerName, "interact") && !IsProtected(pos, playerName, "build");
    }

    public IReadOnlyList<ProtectionZone> GetZones() => _zones.AsReadOnly();
}
