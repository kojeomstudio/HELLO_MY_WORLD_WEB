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
    public float ClimbSpeed { get; set; } = 2.0f;
    public float PlayerWidth { get; set; } = 0.6f;
    public float PlayerHeight { get; set; } = 1.8f;
    public float Drag { get; set; } = 0.1f;
    public float LiquidDrag { get; set; } = 0.8f;
    public float TerminalVelocity { get; set; } = 50.0f;

    public PhysicsState Simulate(PhysicsState state, PlayerInput input, WorldMap world, float dt)
    {
        var newState = state with { };
        var inLiquid = IsInLiquid(state.Position, world);
        var onLadder = IsClimbable(state.Position, world);

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
        else if (onLadder)
        {
            var speed = WalkSpeed * 0.5f;

            var moveDir = new Vector3(0, 0, 0);
            if (input.Forward) moveDir += new Vector3(-MathF.Sin(state.Yaw), 0, -MathF.Cos(state.Yaw));
            if (input.Backward) moveDir += new Vector3(MathF.Sin(state.Yaw), 0, MathF.Cos(state.Yaw));
            if (input.Left) moveDir += new Vector3(-MathF.Cos(state.Yaw), 0, MathF.Sin(state.Yaw));
            if (input.Right) moveDir += new Vector3(MathF.Cos(state.Yaw), 0, -MathF.Sin(state.Yaw));

            if (moveDir.Length > 0)
            {
                moveDir = moveDir.Normalized * speed;
            }

            newState.Velocity = new Vector3(moveDir.X, 0, moveDir.Z);

            if (input.Jump) newState.Velocity = new Vector3(newState.Velocity.X, ClimbSpeed, newState.Velocity.Z);
            else if (input.Sneak) newState.Velocity = new Vector3(newState.Velocity.X, -ClimbSpeed, newState.Velocity.Z);
        }
        else if (inLiquid)
        {
            var speed = WalkSpeed * 0.5f;

            var moveDir = new Vector3(0, 0, 0);
            if (input.Forward) moveDir += new Vector3(-MathF.Sin(state.Yaw), 0, -MathF.Cos(state.Yaw));
            if (input.Backward) moveDir += new Vector3(MathF.Sin(state.Yaw), 0, MathF.Cos(state.Yaw));
            if (input.Left) moveDir += new Vector3(-MathF.Cos(state.Yaw), 0, MathF.Sin(state.Yaw));
            if (input.Right) moveDir += new Vector3(MathF.Cos(state.Yaw), 0, -MathF.Sin(state.Yaw));

            if (moveDir.Length > 0)
            {
                moveDir = moveDir.Normalized * speed;
            }

            newState.Velocity = new Vector3(
                state.Velocity.X * (1 - LiquidDrag * dt) + moveDir.X,
                state.Velocity.Y * (1 - LiquidDrag * dt) - Gravity * dt * 0.2f,
                state.Velocity.Z * (1 - LiquidDrag * dt) + moveDir.Z);

            if (input.Jump) newState.Velocity = new Vector3(newState.Velocity.X, ClimbSpeed * 0.5f, newState.Velocity.Z);

            if (newState.Velocity.Y < -TerminalVelocity * 0.2f)
            {
                newState.Velocity = new Vector3(newState.Velocity.X, -TerminalVelocity * 0.2f, newState.Velocity.Z);
            }
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
        var wasOnGround = state.IsOnGround;
        newState.IsOnGround = groundBlock.Type != BlockType.Air &&
                              groundBlock.Type != BlockType.Water &&
                              groundBlock.Type != BlockType.Lava &&
                              groundBlock.Type != BlockType.Ladder;

        if (newState.IsOnGround && !wasOnGround && !state.IsFlying)
        {
            var fallDistance = state.LastGroundY - newPos.Y;
            if (fallDistance > 3.0f)
            {
                var fallDamage = fallDistance - 3.0f;
                newState = newState with { Health = Math.Max(0, newState.Health - fallDamage) };
            }
        }

        if (newState.IsOnGround)
        {
            newState = newState with { LastGroundY = newPos.Y };
        }

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
        newState.Health = newState.Health;
        newState.LastGroundY = newState.LastGroundY;

        return newState;
    }

    private bool IsInLiquid(Vector3 position, WorldMap world)
    {
        var feetBlockY = (short)Math.Floor(position.Y - PlayerHeight * 0.5);
        var block = world.GetBlock(new Vector3s((short)position.X, (short)feetBlockY, (short)position.Z));
        return IsLiquid(block.Type);
    }

    private bool IsClimbable(Vector3 position, WorldMap world)
    {
        for (int dx = -1; dx <= 1; dx++)
        {
            for (int dz = -1; dz <= 1; dz++)
            {
                var checkX = (int)Math.Floor(position.X) + dx;
                var checkZ = (int)Math.Floor(position.Z) + dz;
                var block = GetBlockAt(checkX, checkZ, (int)Math.Floor(position.Y), world);
                if (block == BlockType.Ladder)
                {
                    return true;
                }
            }
        }
        return false;
    }

    private BlockType GetBlockAt(int x, int z, int y, WorldMap world)
    {
        return world.GetBlock(new Vector3s((short)x, (short)y, (short)z)).Type;
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

    private static bool IsLiquid(BlockType type)
    {
        return type is BlockType.Water or BlockType.Lava;
    }
}

public record struct PhysicsState(
    Vector3 Position,
    Vector3 Velocity,
    float Yaw,
    float Pitch,
    bool IsOnGround,
    bool IsFlying,
    float Health,
    float LastGroundY);

public record struct PlayerInput(
    bool Forward,
    bool Backward,
    bool Left,
    bool Right,
    bool Jump,
    bool Sneak,
    bool Sprinting);
