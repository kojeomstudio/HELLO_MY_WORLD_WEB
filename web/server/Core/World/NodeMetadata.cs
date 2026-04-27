using System.Collections.Concurrent;
using System.Text.Json;
using WebGameServer.Core.Player;

namespace WebGameServer.Core.World;

public class NodeMetadata
{
    private readonly Dictionary<string, string> _fields = new();
    private readonly Dictionary<string, ItemStack?[]> _inventories = new();

    public string? GetField(string key)
    {
        return _fields.TryGetValue(key, out var value) ? value : null;
    }

    public void SetField(string key, string value)
    {
        _fields[key] = value;
    }

    public bool RemoveField(string key)
    {
        return _fields.Remove(key);
    }

    public IReadOnlyDictionary<string, string> GetAllFields() => _fields;

    public ItemStack?[] GetInventory(string name, int size = 27)
    {
        if (!_inventories.TryGetValue(name, out var inv))
        {
            inv = new ItemStack?[size];
            _inventories[name] = inv;
        }
        return inv;
    }

    public void SetInventory(string name, ItemStack?[] items)
    {
        _inventories[name] = items;
    }

    public bool HasInventory(string name) => _inventories.ContainsKey(name);

    public string ToJson()
    {
        var data = new Dictionary<string, object>();
        if (_fields.Count > 0)
            data["fields"] = _fields;

        if (_inventories.Count > 0)
        {
            var invDict = new Dictionary<string, object>();
            foreach (var (name, items) in _inventories)
            {
                invDict[name] = items.Select(i =>
                    i == null ? null : new { i.ItemId, i.Count, i.Metadata }).ToArray();
            }
            data["inventories"] = invDict;
        }

        return JsonSerializer.Serialize(data);
    }

    public static NodeMetadata FromJson(string json)
    {
        var meta = new NodeMetadata();
        if (string.IsNullOrEmpty(json)) return meta;

        var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;

        if (root.TryGetProperty("fields", out var fieldsEl))
        {
            foreach (var prop in fieldsEl.EnumerateObject())
            {
                meta._fields[prop.Name] = prop.Value.GetString() ?? "";
            }
        }

        if (root.TryGetProperty("inventories", out var invsEl))
        {
            foreach (var invProp in invsEl.EnumerateObject())
            {
                var items = new ItemStack?[27];
                var arr = invProp.Value.EnumerateArray().ToArray();
                for (int i = 0; i < Math.Min(arr.Length, 27); i++)
                {
                    if (arr[i].ValueKind == JsonValueKind.Null) continue;
                    var itemId = arr[i].TryGetProperty("ItemId", out var id) ? id.GetString() ?? "" :
                                 arr[i].TryGetProperty("itemId", out var id2) ? id2.GetString() ?? "" : "";
                    var count = arr[i].TryGetProperty("Count", out var c) ? c.GetInt32() :
                                arr[i].TryGetProperty("count", out var c2) ? c2.GetInt32() : 1;
                    var metadata = arr[i].TryGetProperty("Metadata", out var m) ? m.GetString() :
                                   arr[i].TryGetProperty("metadata", out var m2) ? m2.GetString() : null;
                    items[i] = new ItemStack(itemId, count, metadata);
                }
                meta._inventories[invProp.Name] = items;
            }
        }

        return meta;
    }
}

public class NodeMetadataManager
{
    private readonly ConcurrentDictionary<string, NodeMetadata> _metadata = new();
    private readonly BlockMetadataDatabase _database;

    public NodeMetadataManager(BlockMetadataDatabase database)
    {
        _database = database;
    }

    public NodeMetadata GetMetadata(int x, int y, int z)
    {
        var key = PositionKey(x, y, z);
        return _metadata.GetOrAdd(key, _ => LoadFromDatabase(key));
    }

    public NodeMetadata? GetMetadataIfExists(int x, int y, int z)
    {
        var key = PositionKey(x, y, z);
        return _metadata.TryGetValue(key, out var meta) ? meta : null;
    }

    public void SetMetadata(int x, int y, int z, NodeMetadata metadata)
    {
        var key = PositionKey(x, y, z);
        _metadata[key] = metadata;
    }

    public bool RemoveMetadata(int x, int y, int z)
    {
        var key = PositionKey(x, y, z);
        return _metadata.TryRemove(key, out _);
    }

    public void SetSignText(int x, int y, int z, string text)
    {
        var meta = GetMetadata(x, y, z);
        meta.SetField("sign_text", text);
        _database.SaveSignText(PositionKey(x, y, z), text);
    }

    public string? GetSignText(int x, int y, int z)
    {
        var meta = GetMetadataIfExists(x, y, z);
        if (meta != null)
        {
            var text = meta.GetField("sign_text");
            if (text != null) return text;
        }
        return _database.LoadSignText(PositionKey(x, y, z));
    }

    public void SetFurnaceState(int x, int y, int z, string state)
    {
        var meta = GetMetadata(x, y, z);
        meta.SetField("furnace_state", state);
    }

    public string? GetFurnaceState(int x, int y, int z)
    {
        return GetMetadata(x, y, z).GetField("furnace_state");
    }

    public void SaveAll()
    {
        foreach (var (key, meta) in _metadata)
        {
            var signText = meta.GetField("sign_text");
            if (signText != null)
            {
                _database.SaveSignText(key, signText);
            }
        }
    }

    public int Count => _metadata.Count;

    private NodeMetadata LoadFromDatabase(string posKey)
    {
        var signText = _database.LoadSignText(posKey);
        if (signText != null)
        {
            var meta = new NodeMetadata();
            meta.SetField("sign_text", signText);
            return meta;
        }
        return new NodeMetadata();
    }

    private static string PositionKey(int x, int y, int z) => $"{x},{y},{z}";
}
