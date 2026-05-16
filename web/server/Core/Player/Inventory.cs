namespace WebGameServer.Core.Player;

public class Inventory
{
    private readonly ItemStack?[] _slots;
    private readonly object _lock = new();
    public int Size { get; }
    public int HotbarSize { get; } = 8;

    public Inventory(int size = 32)
    {
        Size = size;
        _slots = new ItemStack[size];
    }

    public ItemStack? this[int index]
    {
        get
        {
            if (index < 0 || index >= Size) return null;
            lock (_lock) { return _slots[index]; }
        }
        set
        {
            if (index < 0 || index >= Size) return;
            lock (_lock) { _slots[index] = value; }
        }
    }

    public bool AddItem(ItemStack item)
    {
        lock (_lock)
        {
            var remaining = item.Count;
            var maxStack = GetMaxStack(item.ItemId);

            for (int i = 0; i < Size && remaining > 0; i++)
            {
                if (_slots[i] != null && _slots[i]!.ItemId == item.ItemId && _slots[i]!.Count < maxStack)
                {
                    var canAdd = Math.Min(remaining, maxStack - _slots[i]!.Count);
                    _slots[i] = _slots[i]! with { Count = _slots[i]!.Count + canAdd };
                    remaining -= canAdd;
                }
            }

            for (int i = 0; i < Size && remaining > 0; i++)
            {
                if (_slots[i] == null)
                {
                    var canAdd = Math.Min(remaining, maxStack);
                    _slots[i] = item with { Count = canAdd };
                    remaining -= canAdd;
                }
            }

            return remaining == 0;
        }
    }

    public ItemStack? RemoveItem(int index, int count = 1)
    {
        lock (_lock)
        {
            if (index < 0 || index >= Size || _slots[index] == null) return null;

            var item = _slots[index]!;
            if (count >= item.Count)
            {
                _slots[index] = null;
                return item;
            }

            _slots[index] = item with { Count = item.Count - count };
            return item with { Count = count };
        }
    }

    public void Clear()
    {
        lock (_lock)
        {
            for (int i = 0; i < Size; i++)
            {
                _slots[i] = null;
            }
        }
    }

    public ItemStack?[] GetAll()
    {
        lock (_lock) { return _slots.ToArray(); }
    }

    public bool ContainsItem(string itemId, int count = 1)
    {
        lock (_lock)
        {
            var total = 0;
            for (int i = 0; i < Size; i++)
            {
                if (_slots[i] != null && _slots[i]!.ItemId == itemId)
                    total += _slots[i]!.Count;
            }
            return total >= count;
        }
    }

    public int CountItem(string itemId)
    {
        lock (_lock)
        {
            var total = 0;
            for (int i = 0; i < Size; i++)
            {
                if (_slots[i] != null && _slots[i]!.ItemId == itemId)
                    total += _slots[i]!.Count;
            }
            return total;
        }
    }

    public bool RemoveItemById(string itemId, int count = 1)
    {
        lock (_lock)
        {
            var remaining = count;
            for (int i = 0; i < Size && remaining > 0; i++)
            {
                if (_slots[i] == null || _slots[i]!.ItemId != itemId) continue;

                if (_slots[i]!.Count <= remaining)
                {
                    remaining -= _slots[i]!.Count;
                    _slots[i] = null;
                }
                else
                {
                    _slots[i] = _slots[i]! with { Count = _slots[i]!.Count - remaining };
                    remaining = 0;
                }
            }
            return remaining == 0;
        }
    }

    public int GetSlotForItem(string itemId)
    {
        lock (_lock)
        {
            for (int i = 0; i < Size; i++)
            {
                if (_slots[i] != null && _slots[i]!.ItemId == itemId)
                    return i;
            }
            return -1;
        }
    }

    public bool SwapSlots(int a, int b)
    {
        lock (_lock)
        {
            if (a < 0 || a >= Size || b < 0 || b >= Size) return false;
            (_slots[a], _slots[b]) = (_slots[b], _slots[a]);
            return true;
        }
    }

    private static int GetMaxStack(string itemId)
    {
        return itemId switch
        {
            "diamond" or "iron_ingot" or "gold_ingot" or "emerald" or "coal" => 64,
            "diamond_sword" or "iron_sword" or "gold_sword" or "steel_sword"
                or "diamond_pickaxe" or "iron_pickaxe" or "gold_pickaxe" or "steel_pickaxe"
                or "diamond_axe" or "iron_axe" or "gold_axe" or "steel_axe"
                or "diamond_shovel" or "iron_shovel" or "gold_shovel" or "steel_shovel"
                or "diamond_hoe" or "iron_hoe" or "gold_hoe" or "steel_hoe"
                or "wooden_sword" or "stone_sword" or "mese_sword" or "titanium_sword"
                or "wooden_pickaxe" or "stone_pickaxe" or "mese_pickaxe" or "titanium_pickaxe"
                or "fire_sword" or "ice_sword" or "blood_sword" or "heal_sword"
                or "elemental_sword" => 1,
            "bucket" or "water_bucket" or "lava_bucket" or "milk_bucket" => 1,
            "wooden_door" or "steel_door" or "glass_door" => 1,
            _ => 64
        };
    }
}

public record ItemStack(string ItemId, int Count, string? Metadata = null);
