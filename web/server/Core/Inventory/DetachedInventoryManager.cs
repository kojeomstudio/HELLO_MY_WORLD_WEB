using System.Collections.Concurrent;
using ItemStack = WebGameServer.Core.Player.ItemStack;

namespace WebGameServer.Core.Inventory;

public class DetachedInventory
{
    private readonly ItemStack?[] _items;

    public string Name { get; }
    public string Owner { get; }
    public int Size => _items.Length;
    public ItemStack?[] Items => _items.ToArray();
    public bool AllowMove { get; set; } = true;
    public bool AllowPut { get; set; } = true;
    public bool AllowTake { get; set; } = true;
    public Func<string, string, bool>? AllowAccessCallback { get; set; }

    public DetachedInventory(string name, int size, string owner = "server")
    {
        Name = name;
        Owner = owner;
        _items = new ItemStack?[size];
    }

    public bool AllowPlayerAccess(string playerName)
    {
        if (AllowAccessCallback != null) return AllowAccessCallback(Name, playerName);
        if (Owner == "server") return true;
        return Owner == playerName;
    }

    public bool AddItem(ItemStack item)
    {
        for (int i = 0; i < _items.Length; i++)
        {
            if (_items[i] == null)
            {
                _items[i] = item;
                return true;
            }
            if (_items[i]!.ItemId == item.ItemId && _items[i]!.Count < 64)
            {
                _items[i] = _items[i]! with { Count = Math.Min(64, _items[i]!.Count + item.Count) };
                return true;
            }
        }
        return false;
    }

    public ItemStack? RemoveItem(int index, int count = 1)
    {
        if (index < 0 || index >= _items.Length || _items[index] == null) return null;

        var item = _items[index]!;
        if (count >= item.Count)
        {
            _items[index] = null;
            return item;
        }

        _items[index] = item with { Count = item.Count - count };
        return item with { Count = count };
    }

    public ItemStack? GetItem(int index)
    {
        if (index < 0 || index >= _items.Length) return null;
        return _items[index];
    }

    public bool SetItem(int index, ItemStack? item)
    {
        if (index < 0 || index >= _items.Length) return false;
        _items[index] = item;
        return true;
    }

    public void Clear()
    {
        for (int i = 0; i < _items.Length; i++)
        {
            _items[i] = null;
        }
    }

    public ItemStack?[] GetAll()
    {
        return _items.ToArray();
    }
}

public class DetachedInventoryManager
{
    private readonly ConcurrentDictionary<string, DetachedInventory> _inventories = new();

    public DetachedInventory? Create(string name, int size, string owner = "server",
        Func<string, string, bool>? allowAccessCallback = null)
    {
        var inventory = new DetachedInventory(name, size, owner);
        if (allowAccessCallback != null) inventory.AllowAccessCallback = allowAccessCallback;
        if (!_inventories.TryAdd(name, inventory)) return null;
        return inventory;
    }

    public bool Remove(string name)
    {
        return _inventories.TryRemove(name, out _);
    }

    public DetachedInventory? Get(string name)
    {
        return _inventories.TryGetValue(name, out var inventory) ? inventory : null;
    }

    public bool SetItem(string inventoryName, int slot, ItemStack? item, string playerName)
    {
        var inventory = Get(inventoryName);
        if (inventory == null) return false;
        if (!inventory.AllowPlayerAccess(playerName)) return false;
        if (!inventory.AllowPut) return false;
        return inventory.SetItem(slot, item);
    }

    public ItemStack? RemoveItem(string inventoryName, int slot, int count, string playerName)
    {
        var inventory = Get(inventoryName);
        if (inventory == null) return null;
        if (!inventory.AllowPlayerAccess(playerName)) return null;
        if (!inventory.AllowTake) return null;
        return inventory.RemoveItem(slot, count);
    }

    public bool MoveItem(string fromInvName, int fromSlot, string toInvName, int toSlot, string playerName)
    {
        var source = Get(fromInvName);
        var destination = Get(toInvName);
        if (source == null || destination == null) return false;
        if (!source.AllowPlayerAccess(playerName)) return false;
        if (!destination.AllowPlayerAccess(playerName)) return false;
        if (!source.AllowTake) return false;
        if (!destination.AllowPut) return false;
        if (!destination.AllowMove && source.Name != destination.Name) return false;

        var item = source.GetItem(fromSlot);
        if (item == null) return false;

        var existing = destination.GetItem(toSlot);
        if (existing != null)
        {
            if (existing.ItemId != item.ItemId) return false;
            if (existing.Count + item.Count > 64) return false;
            destination.SetItem(toSlot, existing with { Count = existing.Count + item.Count });
        }
        else
        {
            destination.SetItem(toSlot, item);
        }

        source.RemoveItem(fromSlot, item.Count);
        return true;
    }

    public bool CanPlayerAccess(string playerName, string inventoryName)
    {
        var inventory = Get(inventoryName);
        if (inventory == null) return false;
        return inventory.AllowPlayerAccess(playerName);
    }

    public IEnumerable<string> GetAllInventoryNames()
    {
        return _inventories.Keys;
    }

    public bool Exists(string name)
    {
        return _inventories.ContainsKey(name);
    }
}
