using WebGameServer.Core;
using WebGameServer.Core.Entities;
using WebGameServer.Core.Game;
using WorldMap = WebGameServer.Core.World.World;
using WebGameServer.Core.World;

namespace WebGameServer.Core.Physics;

public class PhysicsEngine
{
    public float Gravity { get; set; } = 9.81f;
    public float JumpForce { get; set; } = 6.5f;
    public float WalkSpeed { get; set; } = 4.0f;
    public float SprintSpeed { get; set; } = 8.0f;
    public float FlySpeed { get; set; } = 12.0f;
    public float ClimbSpeed { get; set; } = 3.0f;
    public float PlayerWidth { get; set; } = 0.6f;
    public float PlayerHeight { get; set; } = 1.8f;
    public float Drag { get; set; } = 0.1f;
    public float LiquidDrag { get; set; } = 0.8f;
    public float TerminalVelocity { get; set; } = 50.0f;
    public float StepHeight { get; set; } = 0.6f;
    public BlockDefinitionManager? BlockDefs { get; set; }

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

            var ladderDef = BlockDefs?.Get((ushort)BlockType.Ladder);
            var noJumpOnLadder = ladderDef != null && ladderDef.NoJump;

            if (input.Jump && !noJumpOnLadder) newState.Velocity = new Vector3(newState.Velocity.X, ClimbSpeed, newState.Velocity.Z);
            else if (input.Sneak) newState.Velocity = new Vector3(newState.Velocity.X, -ClimbSpeed, newState.Velocity.Z);
        }
        else if (inLiquid)
        {
            var liquidBlock = GetLiquidBlock(state.Position, world);
            var liquidDef = liquidBlock.HasValue ? BlockDefs?.Get((ushort)liquidBlock.Value) : null;
            var noSwim = liquidDef != null && liquidDef.LiquidNoSwim;

            if (noSwim)
            {
                var speed = WalkSpeed;
                var moveDir = new Vector3(0, 0, 0);
                if (input.Forward) moveDir += new Vector3(-MathF.Sin(state.Yaw), 0, -MathF.Cos(state.Yaw));
                if (input.Backward) moveDir += new Vector3(MathF.Sin(state.Yaw), 0, MathF.Cos(state.Yaw));
                if (input.Left) moveDir += new Vector3(-MathF.Cos(state.Yaw), 0, MathF.Sin(state.Yaw));
                if (input.Right) moveDir += new Vector3(MathF.Cos(state.Yaw), 0, -MathF.Sin(state.Yaw));
                if (moveDir.Length > 0) moveDir = moveDir.Normalized * speed;

                newState.Velocity = new Vector3(
                    state.Velocity.X * (1 - LiquidDrag * dt) + moveDir.X,
                    state.Velocity.Y * (1 - LiquidDrag * dt) - Gravity * dt,
                    state.Velocity.Z * (1 - LiquidDrag * dt) + moveDir.Z);

                if (newState.Velocity.Y < -TerminalVelocity * 0.2f)
                {
                    newState.Velocity = new Vector3(newState.Velocity.X, -TerminalVelocity * 0.2f, newState.Velocity.Z);
                }
            }
            else
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

            var groundBlockForJump = GetBlockAt(
                (int)Math.Floor(newState.Position.X),
                (int)Math.Floor(newState.Position.Z),
                (int)Math.Floor(newState.Position.Y - PlayerHeight - 0.1), world);
            var groundJumpDef = BlockDefs?.Get((ushort)groundBlockForJump);
            var noJump = groundJumpDef != null && groundJumpDef.NoJump;
            var isSlippery = groundJumpDef != null && groundJumpDef.Slippery;
            var effectiveDrag = isSlippery ? Drag * 0.05f : Drag;

            if (state.IsOnGround && input.Jump && !noJump)
            {
                newState.Velocity = new Vector3(newState.Velocity.X, JumpForce, newState.Velocity.Z);
                newState.IsOnGround = false;
            }

            newState.Velocity = new Vector3(
                newState.Velocity.X * (1 - effectiveDrag),
                newState.Velocity.Y - Gravity * dt,
                newState.Velocity.Z * (1 - effectiveDrag));

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
        var groundBlock = world.GetBlock(new Vector3s((short)Math.Floor(newPos.X), (short)feetBlockY, (short)Math.Floor(newPos.Z)));
        var wasOnGround = state.IsOnGround;
        newState.IsOnGround = groundBlock.Type != BlockType.Air &&
                              groundBlock.Type != BlockType.Water &&
                              groundBlock.Type != BlockType.Lava &&
                              groundBlock.Type != BlockType.Ladder;

        if (newState.IsOnGround && !wasOnGround && !state.IsFlying)
        {
            var groundBlockDef = BlockDefs?.Get((ushort)groundBlock.Type);
            var isBouncy = groundBlockDef != null && groundBlockDef.Bouncy > 0;
            if (isBouncy)
            {
                var bouncePercent = groundBlockDef!.Bouncy / 100.0f;
                newState = newState with
                {
                    Velocity = new Vector3(newState.Velocity.X, Math.Abs(state.Velocity.Y) * bouncePercent, newState.Velocity.Z),
                    IsOnGround = false
                };
            }
            else
            {
                var fallDistance = state.LastGroundY - newPos.Y;
                if (fallDistance > 3.0f)
                {
                    var fallDamage = fallDistance - 3.0f;
                    var fallDamagePercent = groundBlockDef?.FallDamageAddPercent ?? 0;
                    fallDamage *= (1.0f + fallDamagePercent / 100.0f);
                    newState = newState with { Health = Math.Max(0, newState.Health - fallDamage) };
                }
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
        var block = world.GetBlock(new Vector3s((short)Math.Floor(position.X), (short)feetBlockY, (short)Math.Floor(position.Z)));
        return IsLiquid(block.Type);
    }

    private BlockType? GetLiquidBlock(Vector3 position, WorldMap world)
    {
        var feetBlockY = (short)Math.Floor(position.Y - PlayerHeight * 0.5);
        var block = world.GetBlock(new Vector3s((short)Math.Floor(position.X), (short)feetBlockY, (short)Math.Floor(position.Z)));
        return IsLiquid(block.Type) ? block.Type : null;
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

        var resultX = ResolveCollisionX(pos.X, state.Position.X, state.Position.Y, state.Position.Z, world, halfW);
        var resultZ = ResolveCollisionZ(resultX, state.Position.Y, pos.Z, state.Position.Z, world, halfW);
        var (resultY, onGround) = ResolveCollisionY(resultX, pos.Y, state.Position.Y, resultZ, world, halfW, state.IsOnGround);

        return new Vector3(resultX, resultY, resultZ);
    }

    private float ResolveCollisionX(float desiredX, float origX, float currentY, float currentZ, WorldMap world, float halfW)
    {
        var startBX = (short)Math.Floor(desiredX - halfW);
        var endBX = (short)Math.Floor(desiredX + halfW - 0.001f);
        var startBZ = (short)Math.Floor(currentZ - halfW);
        var endBZ = (short)Math.Floor(currentZ + halfW - 0.001f);
        var startBY = (short)Math.Floor(currentY - PlayerHeight);
        var endBY = (short)Math.Floor(currentY - 0.01f);

        for (int bx = startBX; bx <= endBX; bx++)
        {
            for (int bz = startBZ; bz <= endBZ; bz++)
            {
                for (int by = startBY; by <= endBY; by++)
                {
                    if (!IsSolid(world.GetBlock(new Vector3s((short)bx, (short)by, (short)bz)).Type)) continue;
                    desiredX = desiredX < origX ? bx + 1 + halfW : bx - halfW;
                }
            }
        }

        return desiredX;
    }

    private float ResolveCollisionZ(float currentX, float currentY, float desiredZ, float origZ, WorldMap world, float halfW)
    {
        var startBX = (short)Math.Floor(currentX - halfW);
        var endBX = (short)Math.Floor(currentX + halfW - 0.001f);
        var startBZ = (short)Math.Floor(desiredZ - halfW);
        var endBZ = (short)Math.Floor(desiredZ + halfW - 0.001f);
        var startBY = (short)Math.Floor(currentY - PlayerHeight);
        var endBY = (short)Math.Floor(currentY - 0.01f);

        for (int bx = startBX; bx <= endBX; bx++)
        {
            for (int bz = startBZ; bz <= endBZ; bz++)
            {
                for (int by = startBY; by <= endBY; by++)
                {
                    if (!IsSolid(world.GetBlock(new Vector3s((short)bx, (short)by, (short)bz)).Type)) continue;
                    desiredZ = desiredZ < origZ ? bz + 1 + halfW : bz - halfW;
                }
            }
        }

        return desiredZ;
    }

    private (float resultY, bool onGround) ResolveCollisionY(float x, float desiredY, float currentY, float z, WorldMap world, float halfW, bool wasOnGround)
    {
        var onGround = false;
        var startBX = (short)Math.Floor(x - halfW);
        var endBX = (short)Math.Floor(x + halfW - 0.001f);
        var startBZ = (short)Math.Floor(z - halfW);
        var endBZ = (short)Math.Floor(z + halfW - 0.001f);

        var isFalling = desiredY < currentY;

        for (int bx = startBX; bx <= endBX; bx++)
        {
            for (int bz = startBZ; bz <= endBZ; bz++)
            {
                var startBY = (short)Math.Floor(desiredY - PlayerHeight);
                var endBY = (short)Math.Floor(desiredY - 0.01f);

                for (int by = startBY; by <= endBY; by++)
                {
                    if (!IsSolid(world.GetBlock(new Vector3s((short)bx, (short)by, (short)bz)).Type)) continue;

                    if (isFalling)
                    {
                        desiredY = by + 1 + PlayerHeight;
                        onGround = true;
                    }
                    else
                    {
                        desiredY = by + 1;
                    }
                }
            }
        }

        if (!onGround && wasOnGround && !isFalling)
        {
            var stepY = desiredY + StepHeight;
            var canStep = true;

            for (int bx = startBX; bx <= endBX && canStep; bx++)
            {
                for (int bz = startBZ; bz <= endBZ && canStep; bz++)
                {
                    var stepFeetBY = (short)Math.Floor(stepY - PlayerHeight);
                    var stepHeadBY = (short)Math.Floor(stepY - 0.01f);

                    for (int by = stepFeetBY; by <= stepHeadBY && canStep; by++)
                    {
                        if (IsSolid(world.GetBlock(new Vector3s((short)bx, (short)by, (short)bz)).Type))
                        {
                            canStep = false;
                        }
                    }

                    var currentHeadBY = (short)Math.Floor(desiredY - 0.01f);
                    var stepTopBY = (short)Math.Floor(stepY + 0.01f);
                    for (int by = currentHeadBY; by <= stepTopBY && canStep; by++)
                    {
                        if (IsSolid(world.GetBlock(new Vector3s((short)bx, (short)by, (short)bz)).Type))
                        {
                            canStep = false;
                        }
                    }
                }
            }

            if (canStep)
            {
                desiredY = stepY;
            }
        }

        return (desiredY, onGround);
    }

    private bool IsSolid(BlockType type)
    {
        if (BlockDefs != null)
        {
            var def = BlockDefs.Get((ushort)type);
            return def != null && def.Solid;
        }
        return type != BlockType.Air &&
               type != BlockType.Water && type != BlockType.WaterFlowing &&
               type != BlockType.Lava && type != BlockType.LavaFlowing &&
               type != BlockType.RiverWater &&
               type != BlockType.Torch &&
               type != BlockType.Ladder;
    }

    private static bool IsLiquid(BlockType type)
    {
        return type is BlockType.Water or BlockType.WaterFlowing
            or BlockType.Lava or BlockType.LavaFlowing
            or BlockType.RiverWater;
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
