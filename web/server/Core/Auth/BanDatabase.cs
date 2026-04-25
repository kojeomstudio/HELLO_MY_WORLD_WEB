using System.Text.Json;

namespace WebGameServer.Core.Auth;

public class BanDatabase
{
    private readonly string _filePath;
    private readonly HashSet<string> _bannedNames = new(StringComparer.OrdinalIgnoreCase);
    private readonly HashSet<string> _bannedIps = new(StringComparer.OrdinalIgnoreCase);

    public BanDatabase(string filePath)
    {
        _filePath = filePath;
        Load();
    }

    private void Load()
    {
        if (!File.Exists(_filePath)) return;
        var json = File.ReadAllText(_filePath);
        var doc = JsonDocument.Parse(json);
        if (doc.RootElement.TryGetProperty("bannedNames", out var names))
        {
            foreach (var name in names.EnumerateArray())
            {
                _bannedNames.Add(name.GetString() ?? string.Empty);
            }
        }
        if (doc.RootElement.TryGetProperty("bannedIps", out var ips))
        {
            foreach (var ip in ips.EnumerateArray())
            {
                _bannedIps.Add(ip.GetString() ?? string.Empty);
            }
        }
    }

    private void Save()
    {
        var dir = Path.GetDirectoryName(_filePath);
        if (dir != null) Directory.CreateDirectory(dir);
        var json = JsonSerializer.Serialize(new
        {
            bannedNames = _bannedNames.ToArray(),
            bannedIps = _bannedIps.ToArray()
        });
        File.WriteAllText(_filePath, json);
    }

    public void BanName(string name)
    {
        _bannedNames.Add(name);
        Save();
    }

    public void BanIp(string ip)
    {
        _bannedIps.Add(ip);
        Save();
    }

    public void UnbanName(string name)
    {
        _bannedNames.Remove(name);
        Save();
    }

    public void UnbanIp(string ip)
    {
        _bannedIps.Remove(ip);
        Save();
    }

    public bool IsNameBanned(string name) => _bannedNames.Contains(name);
    public bool IsIpBanned(string ip) => _bannedIps.Contains(ip);
}
