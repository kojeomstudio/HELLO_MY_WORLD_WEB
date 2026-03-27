using WebGameServer.Core;
using WebGameServer.Core.Entities;
using WorldMap = WebGameServer.Core.World.World;
using WebGameServer.Core.World;

namespace WebGameServer.Core.Physics;

public class PhysicsEngine
{
    public float Gravity { get; set; } = 9.8f;
    public float JumpForce { get; set; } = 8.0f;
    public float WalkSpeed { get; set; } = 4.317f;
    public float SprintSpeed { get; set; } = 8.0f;
    public float FlySpeed { get; set; } = 12.0f;
    public float PlayerWidth { get; set; } = 0.6f;
    public float PlayerHeight { get; set; } = 1.8f;
    public float Drag { get; set; } = 0.1f;
    public float TerminalVelocity { get; set; } = 50.0f;

    public PhysicsState Simulate(PhysicsState state, PlayerInput input, WorldMap world, float dt)
    {
        var newState = state with { };

        if (state.IsFlying)
        {
            newState.Velocity = Vector3.Zero;
            var speed = FlySpeed;

            if (input.Forward) newState.Velocity += new Vector3(-MathF.Sin(state.Yaw), 0, -MathF.Cos(state.Yaw)) * speed;
            if (input.Backward) newState.Velocity += new Vector3(MathF.Sin(state.Yaw), 0, MathF.Cos(state.Yaw)) * speed;
            if (input.Left) newState.Velocity += new Vector3(-MathF.Cos(state.Yaw), 0, MathF.Sin(state.Yaw)) * speed;
            if (input.Right) newState.Velocity += new Vector3(MathF.Cos(state.Yaw), 0, -MathF.Sin(state.Yaw)) * speed;
            if (input.Jump) newState.Velocity += new Vector3(0, speed, 0);
            if (input.Sneak) newState.Velocity += new Vector3(0, -speed, 0);
        }
        else
        {
            var speed = input.Sprinting ? SprintSpeed : WalkSpeed;

            var moveDir = new Vector3(0, 0, 0);
            if (input.Forward) moveDir += new Vector3(-MathF.Sin(state.Yaw), 0, -MathF.Cos(state.Yaw));
            if (input.Backward) moveDir += new Vector3(MathF.Sin(state.Yaw), 0, MathF.Cos(state.Yaw));
            if (input.Left) moveDir += new Vector3(-MathF.Cos(state.Yaw), 0, MathF.Sin(state.Yaw));
            if (input.Right) moveDir += new Vector3(MathF.Cos(state.Yaw), 0, -MathF.Sin(state.Yaw));

            if (moveDir.Length > 0)
            {
                moveDir = moveDir.Normalized * speed;
            }

            newState.Velocity = new Vector3(moveDir.X, state.Velocity.Y, moveDir.Z);

            if (state.IsOnGround && input.Jump)
            {
                newState.Velocity = new Vector3(newState.Velocity.X, JumpForce, newState.Velocity.Z);
                newState.IsOnGround = false;
            }

            newState.Velocity = new Vector3(
                newState.Velocity.X * (1 - Drag),
                newState.Velocity.Y - Gravity * dt,
                newState.Velocity.Z * (1 - Drag));

            if (newState.Velocity.Y < -TerminalVelocity)
            {
                newState.Velocity = new Vector3(newState.Velocity.X, -TerminalVelocity, newState.Velocity.Z);
            }
        }

        var newPos = new Vector3(
            state.Position.X + newState.Velocity.X * dt,
            state.Position.Y + newState.Velocity.Y * dt,
            state.Position.Z + newState.Velocity.Z * dt);

        newPos = ResolveCollisions(newPos, state, world);

        var feetBlockY = (short)Math.Floor(newPos.Y - PlayerHeight);
        var groundBlock = world.GetBlock(new Vector3s((short)newPos.X, (short)feetBlockY, (short)newPos.Z));
        newState.IsOnGround = groundBlock.Type != BlockType.Air &&
                              groundBlock.Type != BlockType.Water &&
                              groundBlock.Type != BlockType.Lava;

        if (newPos.Y < -64)
        {
            newState.Position = new Vector3(0, 80, 0);
            newState.Velocity = Vector3.Zero;
            newState.Health = 0;
        }
        else
        {
            newState.Position = newPos;
        }

        newState.Yaw = state.Yaw;
        newState.Pitch = state.Pitch;
        newState.IsFlying = state.IsFlying;
        newState.Health = state.Health;

        return newState;
    }

    private Vector3 ResolveCollisions(Vector3 pos, PhysicsState state, WorldMap world)
    {
        var halfW = PlayerWidth / 2;
        var minX = (short)Math.Floor(pos.X - halfW);
        var maxX = (short)Math.Floor(pos.X + halfW);
        var minY = (short)Math.Floor(pos.Y - PlayerHeight);
        var maxY = (short)Math.Floor(pos.Y);
        var minZ = (short)Math.Floor(pos.Z - halfW);
        var maxZ = (short)Math.Floor(pos.Z + halfW);

        for (int bx = minX; bx <= maxX; bx++)
        {
            for (int by = minY; by <= maxY; by++)
            {
                for (int bz = minZ; bz <= maxZ; bz++)
                {
                    var block = world.GetBlock(new Vector3s((short)bx, (short)by, (short)bz));
                    if (!IsSolid(block.Type)) continue;

                    var closestX = Math.Clamp(pos.X, bx, bx + 1f);
                    var closestY = Math.Clamp(pos.Y - PlayerHeight / 2, by, by + 1f);
                    var closestZ = Math.Clamp(pos.Z, bz, bz + 1f);

                    var dx = pos.X - closestX;
                    var dy = (pos.Y - PlayerHeight / 2) - closestY;
                    var dz = pos.Z - closestZ;
                    var dist = MathF.Sqrt(dx * dx + dy * dy + dz * dz);

                    if (dist < halfW && dist > 0)
                    {
                        var overlap = halfW - dist;
                        var pushDir = new Vector3(dx, dy, dz).Normalized;
                        pos = pos + pushDir * overlap;
                    }
                }
            }
        }

        return pos;
    }

    private bool IsSolid(BlockType type)
    {
        return type != BlockType.Air &&
               type != BlockType.Water &&
               type != BlockType.Lava &&
               type != BlockType.Torch &&
               type != BlockType.Ladder;
    }
}

public record struct PhysicsState(
    Vector3 Position,
    Vector3 Velocity,
    float Yaw,
    float Pitch,
    bool IsOnGround,
    bool IsFlying,
    float Health);

public record struct PlayerInput(
    bool Forward,
    bool Backward,
    bool Left,
    bool Right,
    bool Jump,
    bool Sneak,
    bool Sprinting);
