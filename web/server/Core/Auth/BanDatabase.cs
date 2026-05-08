using System.Text.Json;

namespace WebGameServer.Core.Auth;

public class BanDatabase
{
    private readonly string _filePath;
    private readonly HashSet<string> _bannedNames = new(StringComparer.OrdinalIgnoreCase);
    private readonly HashSet<string> _bannedIps = new(StringComparer.OrdinalIgnoreCase);
    private readonly SemaphoreSlim _saveLock = new(1, 1);

    public BanDatabase(string filePath)
    {
        _filePath = filePath;
        LoadInternal();
    }

    private void LoadInternal()
    {
        try
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
        catch (Exception ex)
        {
            Console.WriteLine($"[BanDatabase] Failed to load: {ex.Message}");
        }
    }

    private async Task SaveAsync()
    {
        await _saveLock.WaitAsync();
        try
        {
            var dir = Path.GetDirectoryName(_filePath);
            if (dir != null) Directory.CreateDirectory(dir);
            var json = JsonSerializer.Serialize(new
            {
                bannedNames = _bannedNames.ToArray(),
                bannedIps = _bannedIps.ToArray()
            });
            var tmpPath = _filePath + ".tmp";
            await File.WriteAllTextAsync(tmpPath, json);
            File.Move(tmpPath, _filePath, overwrite: true);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[BanDatabase] Failed to save: {ex.Message}");
        }
        finally
        {
            _saveLock.Release();
        }
    }

    public async Task BanNameAsync(string name)
    {
        _bannedNames.Add(name);
        await SaveAsync();
    }

    public async Task BanIpAsync(string ip)
    {
        _bannedIps.Add(ip);
        await SaveAsync();
    }

    public async Task UnbanNameAsync(string name)
    {
        _bannedNames.Remove(name);
        await SaveAsync();
    }

    public async Task UnbanIpAsync(string ip)
    {
        _bannedIps.Remove(ip);
        await SaveAsync();
    }

    public bool IsNameBanned(string name) => _bannedNames.Contains(name);
    public bool IsIpBanned(string ip) => _bannedIps.Contains(ip);

    public void Load()
    {
        _bannedNames.Clear();
        _bannedIps.Clear();
        LoadInternal();
    }
}
