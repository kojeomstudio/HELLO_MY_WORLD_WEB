using BlockType = WebGameServer.Core.World.BlockType;
using WorldMap = WebGameServer.Core.World.World;
using PlayerEnt = WebGameServer.Core.Player.Player;

namespace WebGameServer.Core.Entities;

public class VehicleEntity : Entity
{
    public string VehicleType { get; set; } = "boat";
    public float Speed { get; set; } = 6.0f;
    public float TurnSpeed { get; set; } = 2.0f;
    public float Buoyancy { get; set; } = 0.8f;
    public bool FloatsOnWater { get; set; } = true;
    public Guid? DriverId { get; set; }
    public string? DriverName { get; set; }
    public float SteeringInput { get; set; }
    public float ForwardInput { get; set; }

    private const float VehicleGravity = 9.81f;
    private const float VehicleDrag = 0.95f;
    private const float VehicleWidth = 0.6f;
    private const float VehicleHeight = 0.6f;

    public VehicleEntity(string vehicleType, Vector3 position)
        : base(EntityType.Vehicle)
    {
        VehicleType = vehicleType;
        Position = position;

        switch (vehicleType)
        {
            case "boat":
                Speed = 6.0f;
                Buoyancy = 0.9f;
                FloatsOnWater = true;
                MaxHealth = 40f;
                break;
            case "minecart":
                Speed = 8.0f;
                Buoyancy = 0f;
                FloatsOnWater = false;
                MaxHealth = 60f;
                break;
            default:
                Speed = 4.0f;
                Buoyancy = 0.5f;
                MaxHealth = 30f;
                break;
        }

        Health = MaxHealth;    }

    public bool Mount(PlayerEnt player)
    {
        if (DriverId.HasValue) return false;
        DriverId = player.Id;
        DriverName = player.Name;
        AddChild(player.Id);
        player.AttachedToEntityId = Id;
        player.AttachmentOffset = new Vector3(0, 0.5f, 0);
        return true;
    }

    public bool Dismount(PlayerEnt player)
    {
        if (DriverId != player.Id) return false;
        DriverId = null;
        DriverName = null;
        RemoveChild(player.Id);
        player.AttachedToEntityId = null;
        player.AttachmentOffset = Vector3.Zero;
        return true;
    }

    public void SetInput(float steering, float forward)
    {
        SteeringInput = Math.Clamp(steering, -1f, 1f);
        ForwardInput = Math.Clamp(forward, -1f, 1f);
    }

    public override void Update(float dt)
    {
        base.Update(dt);
        if (!IsAlive) return;

        Yaw += SteeringInput * TurnSpeed * dt;

        var forwardX = MathF.Sin(Yaw);
        var forwardZ = MathF.Cos(Yaw);

        var targetVelX = forwardX * ForwardInput * Speed;
        var targetVelZ = forwardZ * ForwardInput * Speed;

        Velocity = new Vector3(
            Velocity.X * VehicleDrag + targetVelX * (1 - VehicleDrag),
            Velocity.Y,
            Velocity.Z * VehicleDrag + targetVelZ * (1 - VehicleDrag));

        if (WorldReference != null && FloatsOnWater)
        {
            var blockBelow = WorldReference.GetBlock(new Vector3s(
                (short)Math.Floor(Position.X),
                (short)Math.Floor(Position.Y - 0.3),
                (short)Math.Floor(Position.Z)));

            if (IsWaterBlock(blockBelow.Type))
            {
                Velocity = new Vector3(Velocity.X, Math.Max(Velocity.Y, Buoyancy), Velocity.Z);
            }
        }

        Velocity = new Vector3(Velocity.X, Velocity.Y - VehicleGravity * dt, Velocity.Z);

        var newPos = Position + Velocity * dt;

        if (WorldReference != null)
        {
            newPos = ResolveVehicleCollision(newPos, VehicleWidth, VehicleHeight);
        }

        if (Position.Y < -64)
        {
            Health = 0;
            OnEntityDespawn?.Invoke(this);
            return;
        }

        Position = newPos;
    }

    private Vector3 ResolveVehicleCollision(Vector3 newPos, float halfW, float height)
    {
        if (WorldReference == null) return newPos;

        var origX = Position.X;
        var origZ = Position.Z;

        var startBX = (short)Math.Floor(newPos.X - halfW);
        var endBX = (short)Math.Floor(newPos.X + halfW - 0.001f);
        var startBZ = (short)Math.Floor(origZ - halfW);
        var endBZ = (short)Math.Floor(origZ + halfW - 0.001f);
        var startBY = (short)Math.Floor(Position.Y - height);
        var endBY = (short)Math.Floor(Position.Y + height - 0.01f);

        for (int bx = startBX; bx <= endBX; bx++)
        {
            for (int bz = startBZ; bz <= endBZ; bz++)
            {
                for (int by = startBY; by <= endBY; by++)
                {
                    var block = WorldReference.GetBlock(new Vector3s((short)bx, (short)by, (short)bz));
                    if (!IsVehicleSolidBlock(block.Type)) continue;
                    newPos = new Vector3(
                        newPos.X < origX ? bx + 1 + halfW : bx - halfW,
                        newPos.Y,
                        newPos.Z);
                    Velocity = new Vector3(0, Velocity.Y, Velocity.Z);
                }
            }
        }

        startBX = (short)Math.Floor(newPos.X - halfW);
        endBX = (short)Math.Floor(newPos.X + halfW - 0.001f);
        startBZ = (short)Math.Floor(newPos.Z - halfW);
        endBZ = (short)Math.Floor(newPos.Z + halfW - 0.001f);

        for (int bx = startBX; bx <= endBX; bx++)
        {
            for (int bz = startBZ; bz <= endBZ; bz++)
            {
                for (int by = startBY; by <= endBY; by++)
                {
                    var block = WorldReference.GetBlock(new Vector3s((short)bx, (short)by, (short)bz));
                    if (!IsVehicleSolidBlock(block.Type)) continue;
                    newPos = new Vector3(
                        newPos.X,
                        newPos.Y,
                        newPos.Z < origZ ? bz + 1 + halfW : bz - halfW);
                    Velocity = new Vector3(Velocity.X, Velocity.Y, 0);
                }
            }
        }

        var isFalling = Velocity.Y <= 0;
        startBX = (short)Math.Floor(newPos.X - halfW);
        endBX = (short)Math.Floor(newPos.X + halfW - 0.001f);
        startBZ = (short)Math.Floor(newPos.Z - halfW);
        endBZ = (short)Math.Floor(newPos.Z + halfW - 0.001f);

        if (isFalling)
        {
            var feetBY = (short)Math.Floor(newPos.Y - height);
            for (int bx = startBX; bx <= endBX; bx++)
            {
                for (int bz = startBZ; bz <= endBZ; bz++)
                {
                    var block = WorldReference.GetBlock(new Vector3s((short)bx, feetBY, (short)bz));
                    if (!IsVehicleSolidBlock(block.Type)) continue;
                    newPos = new Vector3(newPos.X, feetBY + 1 + height, newPos.Z);
                    Velocity = new Vector3(Velocity.X, 0, Velocity.Z);
                    return newPos;
                }
            }
        }

        return newPos;
    }

    private static bool IsWaterBlock(BlockType type)
    {
        return type is BlockType.Water or BlockType.WaterFlowing
            or BlockType.RiverWater or BlockType.RiverWaterFlowing;
    }

    private static bool IsVehicleSolidBlock(BlockType type)
    {
        return type != BlockType.Air
            && type != BlockType.Water && type != BlockType.WaterFlowing
            && type != BlockType.Lava && type != BlockType.LavaFlowing
            && type != BlockType.RiverWater && type != BlockType.RiverWaterFlowing
            && type != BlockType.Torch
            && type != BlockType.Ladder
            && type != BlockType.FlowerRed && type != BlockType.FlowerYellow
            && type != BlockType.FlowerRose && type != BlockType.FlowerTulip
            && type != BlockType.TallGrass
            && type != BlockType.SugarCane;
    }
}
