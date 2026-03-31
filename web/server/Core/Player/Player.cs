using WebGameServer.Core;

namespace WebGameServer.Core.Player;

public class Player
{
    public Guid Id { get; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string ConnectionId { get; set; } = string.Empty;
    public PlayerState State { get; set; } = PlayerState.Connecting;
    public GameMode Mode { get; set; } = GameMode.Survival;

    public Vector3 Position { get; set; } = Vector3.Zero;
    public Vector3 Velocity { get; set; } = Vector3.Zero;
    public float Yaw { get; set; } = 0f;
    public float Pitch { get; set; } = 0f;

    public float Health { get; set; } = 20f;
    public float MaxHealth { get; set; } = 20f;
    public float Breath { get; set; } = 10f;
    public float MaxBreath { get; set; } = 10f;

    public bool IsFlying { get; set; } = false;
    public bool IsSprinting { get; set; } = false;
    public bool IsSneaking { get; set; } = false;
    public bool IsOnGround { get; set; } = true;
    public bool IsInLiquid { get; set; }
    public bool IsDead { get; set; }

    public int SelectedHotbarSlot { get; set; } = 0;
    public Inventory Inventory { get; } = new();

    public ItemStack?[] ArmorSlots { get; } = new ItemStack?[4];
    public DateTime LastDamageTime { get; set; }
    public float LastGroundY { get; set; }
    public float FallDistance { get; set; }
    public float FoodLevel { get; set; } = 20f;
    public float FoodSaturation { get; set; } = 5f;
    public int TotalExperience { get; set; }
    public int ExperienceLevel { get; set; }

    public Player(string name)
    {
        Name = name;
    }

    public float EquippedArmorDefense
    {
        get
        {
            var total = 0f;
            foreach (var armor in ArmorSlots)
            {
                total += GetDefenseValue(armor);
            }
            return total;
        }
    }

    public void UpdatePosition(Vector3 position, Vector3 velocity, float yaw, float pitch)
    {
        Position = position;
        Velocity = velocity;
        Yaw = yaw;
        Pitch = pitch;
    }

    public void TakeDamage(float amount)
    {
        var defense = EquippedArmorDefense;
        var reducedAmount = Math.Max(0, amount - defense * 0.04f);
        Health = Math.Max(0, Health - reducedAmount);
        LastDamageTime = DateTime.UtcNow;
    }

    public void Heal(float amount)
    {
        Health = Math.Min(MaxHealth, Health + amount);
    }

    public void ConsumeFood(float amount)
    {
        FoodLevel = Math.Min(20f, FoodLevel + amount);
    }

    public void Respawn()
    {
        Health = MaxHealth;
        Breath = MaxBreath;
        FoodLevel = 20f;
        FoodSaturation = 5f;
        FallDistance = 0f;
        LastGroundY = 0f;
    }

    public ItemStack? GetSelectedHotbarItem()
    {
        return Inventory[SelectedHotbarSlot];
    }

    private static float GetDefenseValue(ItemStack? armor)
    {
        if (armor == null) return 0f;
        return armor.ItemId.ToLowerInvariant() switch
        {
            "leather_helmet" or "leather_chestplate" or "leather_leggings" or "leather_boots" => 1f,
            "iron_helmet" => 2f,
            "iron_chestplate" => 6f,
            "iron_leggings" => 5f,
            "iron_boots" => 2f,
            "diamond_helmet" => 3f,
            "diamond_chestplate" => 8f,
            "diamond_leggings" => 6f,
            "diamond_boots" => 3f,
            _ => 0f
        };
    }
}
