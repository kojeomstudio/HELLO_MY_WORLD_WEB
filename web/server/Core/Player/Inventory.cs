namespace WebGameServer.Core.Player;

public class Inventory
{
    private readonly ItemStack?[] _slots;
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
            return _slots[index];
        }
        set
        {
            if (index < 0 || index >= Size) return;
            _slots[index] = value;
        }
    }

    public bool AddItem(ItemStack item)
    {
        var remaining = item.Count;

        for (int i = 0; i < Size && remaining > 0; i++)
        {
            if (_slots[i] != null && _slots[i]!.ItemId == item.ItemId && _slots[i]!.Count < 64)
            {
                var canAdd = Math.Min(remaining, 64 - _slots[i]!.Count);
                _slots[i] = _slots[i]! with { Count = _slots[i]!.Count + canAdd };
                remaining -= canAdd;
            }
        }

        for (int i = 0; i < Size && remaining > 0; i++)
        {
            if (_slots[i] == null)
            {
                var canAdd = Math.Min(remaining, 64);
                _slots[i] = item with { Count = canAdd };
                remaining -= canAdd;
            }
        }

        return remaining == 0;
    }

    public ItemStack? RemoveItem(int index, int count = 1)
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

    public void Clear()
    {
        for (int i = 0; i < Size; i++)
        {
            _slots[i] = null;
        }
    }

    public ItemStack?[] GetAll()
    {
        return _slots.ToArray();
    }
}

public record ItemStack(string ItemId, int Count, string? Metadata = null);
