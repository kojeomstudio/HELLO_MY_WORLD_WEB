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

    public int SelectedHotbarSlot { get; set; } = 0;
    public Inventory Inventory { get; } = new();

    public Player(string name)
    {
        Name = name;
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
        Health = Math.Max(0, Health - amount);
    }

    public void Heal(float amount)
    {
        Health = Math.Min(MaxHealth, Health + amount);
    }

    public void Respawn()
    {
        Health = MaxHealth;
        Breath = MaxBreath;
    }
}
