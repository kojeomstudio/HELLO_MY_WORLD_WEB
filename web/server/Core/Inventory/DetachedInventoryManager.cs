using System.Collections.Concurrent;
using ItemStack = WebGameServer.Core.Player.ItemStack;

namespace WebGameServer.Core.Inventory;

public class DetachedInventory
{
    private readonly ItemStack?[] _items;

    public string Name { get; }
    public string? Owner { get; }
    public int Size => _items.Length;

    public DetachedInventory(string name, int size, string? owner)
    {
        Name = name;
        Owner = owner;
        _items = new ItemStack?[size];
    }

    public bool AllowPlayerAccess(string playerName)
    {
        return Owner == null || Owner == playerName;
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

    public DetachedInventory? CreateInventory(string name, int size, string? owner)
    {
        var inventory = new DetachedInventory(name, size, owner);
        if (!_inventories.TryAdd(name, inventory)) return null;
        return inventory;
    }

    public DetachedInventory? GetInventory(string name)
    {
        return _inventories.TryGetValue(name, out var inventory) ? inventory : null;
    }

    public bool RemoveInventory(string name)
    {
        return _inventories.TryRemove(name, out _);
    }

    public bool CanPlayerAccess(string playerName, string inventoryName)
    {
        var inventory = GetInventory(inventoryName);
        if (inventory == null) return false;
        return inventory.AllowPlayerAccess(playerName);
    }

    public IEnumerable<string> GetAllInventoryNames()
    {
        return _inventories.Keys;
    }

    public bool MoveItemBetweenInventories(string fromInv, int fromSlot, string toInv, int toSlot)
    {
        var source = GetInventory(fromInv);
        var destination = GetInventory(toInv);
        if (source == null || destination == null) return false;

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
}
