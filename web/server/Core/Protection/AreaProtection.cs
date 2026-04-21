using System.Collections.Concurrent;
using System.Text.Json;
using WebGameServer.Core;

namespace WebGameServer.Core.Protection;

public readonly record struct BlockPos(int X, int Y, int Z);

public record ProtectionArea(
    int Id,
    string OwnerName,
    int MinX,
    int MinY,
    int MinZ,
    int MaxX,
    int MaxY,
    int MaxZ,
    bool IsProtected = true
)
{
    public bool Contains(int x, int y, int z) =>
        x >= MinX && x <= MaxX &&
        y >= MinY && y <= MaxY &&
        z >= MinZ && z <= MaxZ;

    public bool Overlaps(ProtectionArea other) =>
        MinX <= other.MaxX && MaxX >= other.MinX &&
        MinY <= other.MaxY && MaxY >= other.MinY &&
        MinZ <= other.MaxZ && MaxZ >= other.MinZ;

    public int Volume =>
        (MaxX - MinX + 1) * (MaxY - MinY + 1) * (MaxZ - MinZ + 1);
}

public class AreaProtectionSystem
{
    private readonly ConcurrentDictionary<int, ProtectionArea> _areas = new();
    private readonly HashSet<string> _bypassPlayers = new(StringComparer.OrdinalIgnoreCase);
    private readonly GameServer _gameServer;
    private int _nextAreaId = 1;
    private int _maxAreasPerPlayer = 16;
    private int _maxClaimSize = 256;

    public AreaProtectionSystem(GameServer gameServer)
    {
        _gameServer = gameServer;
    }

    public int MaxAreasPerPlayer
    {
        get => _maxAreasPerPlayer;
        set => _maxAreasPerPlayer = value > 0 ? value : 16;
    }

    public int MaxClaimSize
    {
        get => _maxClaimSize;
        set => _maxClaimSize = value > 0 ? value : 256;
    }

    public int AreaCount => _areas.Count;

    public bool IsProtected(int x, int y, int z)
    {
        foreach (var kvp in _areas)
        {
            if (kvp.Value.IsProtected && kvp.Value.Contains(x, y, z))
            {
                return true;
            }
        }

        return false;
    }

    public bool CanInteract(string playerName, int x, int y, int z)
    {
        if (string.IsNullOrEmpty(playerName))
        {
            return false;
        }

        if (_bypassPlayers.Contains(playerName))
        {
            return true;
        }

        foreach (var kvp in _areas)
        {
            var area = kvp.Value;
            if (!area.Contains(x, y, z))
            {
                continue;
            }

            if (!area.IsProtected)
            {
                continue;
            }

            if (string.Equals(area.OwnerName, playerName, StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }

            return false;
        }

        return true;
    }

    public (bool Success, int AreaId, string? Error) ClaimArea(
        string owner,
        int x1, int y1, int z1,
        int x2, int y2, int z2
    )
    {
        if (string.IsNullOrWhiteSpace(owner))
        {
            return (false, -1, "Owner name cannot be empty.");
        }

        var minX = Math.Min(x1, x2);
        var minY = Math.Min(y1, y2);
        var minZ = Math.Min(z1, z2);
        var maxX = Math.Max(x1, x2);
        var maxY = Math.Max(y1, y2);
        var maxZ = Math.Max(z1, z2);

        var deltaX = maxX - minX + 1;
        var deltaY = maxY - minY + 1;
        var deltaZ = maxZ - minZ + 1;

        if (deltaX > _maxClaimSize || deltaY > _maxClaimSize || deltaZ > _maxClaimSize)
        {
            return (false, -1, $"Claim dimensions exceed maximum size of {_maxClaimSize}.");
        }

        var ownedCount = 0;
        foreach (var kvp in _areas)
        {
            if (string.Equals(kvp.Value.OwnerName, owner, StringComparison.OrdinalIgnoreCase))
            {
                ownedCount++;
            }
        }

        if (ownedCount >= _maxAreasPerPlayer)
        {
            return (false, -1, $"Player '{owner}' already owns the maximum of {_maxAreasPerPlayer} areas.");
        }

        var candidate = new ProtectionArea(0, owner, minX, minY, minZ, maxX, maxY, maxZ);

        foreach (var kvp in _areas)
        {
            if (kvp.Value.Overlaps(candidate))
            {
                return (false, -1, $"Area overlaps with existing area #{kvp.Key} owned by '{kvp.Value.OwnerName}'.");
            }
        }

        var areaId = Interlocked.Increment(ref _nextAreaId) - 1;
        var area = candidate with { Id = areaId };

        if (!_areas.TryAdd(areaId, area))
        {
            return (false, -1, "Failed to claim area due to a concurrent conflict.");
        }

        return (true, areaId, null);
    }

    public (bool Success, string? Error) RemoveArea(int areaId)
    {
        if (_areas.TryRemove(areaId, out var removed))
        {
            return (true, null);
        }

        return (false, $"Area {areaId} not found.");
    }

    public (bool Success, string? Error) TransferArea(int areaId, string newOwner)
    {
        if (string.IsNullOrWhiteSpace(newOwner))
        {
            return (false, "New owner name cannot be empty.");
        }

        if (!_areas.TryGetValue(areaId, out var existing))
        {
            return (false, $"Area {areaId} not found.");
        }

        var ownedCount = 0;
        foreach (var kvp in _areas)
        {
            if (kvp.Key != areaId &&
                string.Equals(kvp.Value.OwnerName, newOwner, StringComparison.OrdinalIgnoreCase))
            {
                ownedCount++;
            }
        }

        if (ownedCount >= _maxAreasPerPlayer)
        {
            return (false, $"Player '{newOwner}' already owns the maximum of {_maxAreasPerPlayer} areas.");
        }

        var transferred = existing with { OwnerName = newOwner };

        if (!_areas.TryUpdate(areaId, transferred, existing))
        {
            return (false, "Failed to transfer area due to a concurrent modification.");
        }

        return (true, null);
    }

    public IReadOnlyList<ProtectionArea> GetAreasOwnedBy(string owner)
    {
        var result = new List<ProtectionArea>();

        foreach (var kvp in _areas)
        {
            if (string.Equals(kvp.Value.OwnerName, owner, StringComparison.OrdinalIgnoreCase))
            {
                result.Add(kvp.Value);
            }
        }

        return result;
    }

    public IReadOnlyList<ProtectionArea> GetAllAreas()
    {
        var result = new List<ProtectionArea>(_areas.Count);

        foreach (var kvp in _areas)
        {
            result.Add(kvp.Value);
        }

        return result;
    }

    public IReadOnlyList<ProtectionArea> GetAreasAt(int x, int y, int z)
    {
        var result = new List<ProtectionArea>();

        foreach (var kvp in _areas)
        {
            if (kvp.Value.Contains(x, y, z))
            {
                result.Add(kvp.Value);
            }
        }

        return result;
    }

    public void GrantBypass(string playerName)
    {
        if (!string.IsNullOrEmpty(playerName))
        {
            _bypassPlayers.Add(playerName);
        }
    }

    public void RevokeBypass(string playerName)
    {
        _bypassPlayers.Remove(playerName ?? string.Empty);
    }

    public bool HasBypass(string playerName) =>
        !string.IsNullOrEmpty(playerName) && _bypassPlayers.Contains(playerName);

    public async Task<(bool Success, string? Error)> LoadProtection(string dataPath)
    {
        var filePath = Path.Combine(dataPath, "protection.json");

        if (!File.Exists(filePath))
        {
            return (true, null);
        }

        try
        {
            var json = await File.ReadAllTextAsync(filePath);
            var data = JsonSerializer.Deserialize<ProtectionData>(json);

            if (data == null)
            {
                return (true, null);
            }

            _areas.Clear();

            var maxId = 0;

            foreach (var area in data.Areas)
            {
                _areas[area.Id] = area;

                if (area.Id > maxId)
                {
                    maxId = area.Id;
                }
            }

            Interlocked.Exchange(ref _nextAreaId, maxId + 1);

            _bypassPlayers.Clear();
            if (data.BypassPlayers != null)
            {
                foreach (var player in data.BypassPlayers)
                {
                    if (!string.IsNullOrEmpty(player))
                    {
                        _bypassPlayers.Add(player);
                    }
                }
            }

            if (data.MaxAreasPerPlayer.HasValue)
            {
                _maxAreasPerPlayer = data.MaxAreasPerPlayer.Value > 0
                    ? data.MaxAreasPerPlayer.Value
                    : 16;
            }

            if (data.MaxClaimSize.HasValue)
            {
                _maxClaimSize = data.MaxClaimSize.Value > 0
                    ? data.MaxClaimSize.Value
                    : 256;
            }

            return (true, null);
        }
        catch (Exception ex)
        {
            return (false, $"Failed to load protection data: {ex.Message}");
        }
    }

    public async Task<(bool Success, string? Error)> SaveProtection(string dataPath)
    {
        try
        {
            if (!Directory.Exists(dataPath))
            {
                Directory.CreateDirectory(dataPath);
            }

            var data = new ProtectionData
            {
                Areas = _areas.Values.ToList(),
                BypassPlayers = _bypassPlayers.ToList(),
                MaxAreasPerPlayer = _maxAreasPerPlayer,
                MaxClaimSize = _maxClaimSize
            };

            var options = new JsonSerializerOptions
            {
                WriteIndented = true
            };

            var json = JsonSerializer.Serialize(data, options);
            var filePath = Path.Combine(dataPath, "protection.json");
            await File.WriteAllTextAsync(filePath, json);

            return (true, null);
        }
        catch (Exception ex)
        {
            return (false, $"Failed to save protection data: {ex.Message}");
        }
    }

    private class ProtectionData
    {
        public List<ProtectionArea> Areas { get; set; } = new();
        public List<string> BypassPlayers { get; set; } = new();
        public int? MaxAreasPerPlayer { get; set; }
        public int? MaxClaimSize { get; set; }
    }
}
