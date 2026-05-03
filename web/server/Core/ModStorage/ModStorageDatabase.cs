using System.Text.Json;

namespace WebGameServer.Core.ModStorage;

public class ModStorageDatabase
{
    private readonly string _storagePath;
    private Dictionary<string, Dictionary<string, string>> _modData = new();

    public ModStorageDatabase(string worldPath)
    {
        _storagePath = Path.Combine(worldPath, "mod_storage.json");
        Load();
    }

    public string? Get(string modName, string key)
    {
        if (_modData.TryGetValue(modName, out var modEntries))
        {
            return modEntries.TryGetValue(key, out var value) ? value : null;
        }
        return null;
    }

    public void Set(string modName, string key, string value)
    {
        if (!_modData.ContainsKey(modName))
        {
            _modData[modName] = new Dictionary<string, string>();
        }
        _modData[modName][key] = value;
    }

    public bool Remove(string modName, string key)
    {
        if (_modData.TryGetValue(modName, out var modEntries))
        {
            return modEntries.Remove(key);
        }
        return false;
    }

    public bool RemoveMod(string modName)
    {
        return _modData.Remove(modName);
    }

    public Dictionary<string, string>? GetModEntries(string modName)
    {
        return _modData.TryGetValue(modName, out var entries) ? entries : null;
    }

    public void Save()
    {
        try
        {
            var json = JsonSerializer.Serialize(_modData, new JsonSerializerOptions { WriteIndented = true });
            var dir = Path.GetDirectoryName(_storagePath);
            if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }
            File.WriteAllText(_storagePath, json);
        }
        catch { }
    }

    private void Load()
    {
        if (!File.Exists(_storagePath)) return;
        try
        {
            var json = File.ReadAllText(_storagePath);
            var data = JsonSerializer.Deserialize<Dictionary<string, Dictionary<string, string>>>(json);
            if (data != null)
            {
                _modData = data;
            }
        }
        catch { }
    }
}
