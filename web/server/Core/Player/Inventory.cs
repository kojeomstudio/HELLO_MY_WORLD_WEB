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
        for (int i = 0; i < Size; i++)
        {
            if (_slots[i] == null)
            {
                _slots[i] = item;
                return true;
            }
            if (_slots[i]!.ItemId == item.ItemId && _slots[i]!.Count < 64)
            {
                _slots[i] = _slots[i]! with { Count = Math.Min(64, _slots[i]!.Count + item.Count) };
                return true;
            }
        }
        return false;
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
