using WebGameServer.Core;

namespace WebGameServer.Core.Physics;

public readonly struct PhysicsOverride
{
    public float Gravity { get; init; }
    public float JumpForce { get; init; }
    public float WalkSpeed { get; init; }
    public float SprintSpeed { get; init; }
    public float FlySpeed { get; init; }
    public float ClimbSpeed { get; init; }
    public float LiquidDrag { get; init; }

    public static PhysicsOverride Default => new()
    {
        Gravity = 9.81f,
        JumpForce = 6.5f,
        WalkSpeed = 4.0f,
        SprintSpeed = 6.5f,
        FlySpeed = 8.0f,
        ClimbSpeed = 2.0f,
        LiquidDrag = 0.5f
    };
}

public class AntiCheatValidator
{
    private const float MaxSpeedBuffer = 1.5f;
    private const float MaxFlySpeedBuffer = 2.0f;
    private const float PositionCorrectionThreshold = 2.0f;
    private const int MaxViolationsBeforeCorrection = 3;
    private const float TeleportDistanceThreshold = 50.0f;

    private readonly Dictionary<string, PlayerAntiCheatState> _playerStates = new();

    public void TrackPlayer(string connectionId)
    {
        _playerStates[connectionId] = new PlayerAntiCheatState();
    }

    public void RemovePlayer(string connectionId)
    {
        _playerStates.Remove(connectionId);
    }

    public void ResetState(string connectionId)
    {
        if (_playerStates.TryGetValue(connectionId, out var state))
        {
            state.ViolationCount = 0;
            state.LastValidPosition = null;
        }
    }

    public bool ValidateMovement(
        string connectionId,
        Vector3 newPosition,
        Vector3 oldPosition,
        float deltaTime,
        PhysicsOverride physics,
        bool isFlying,
        bool isSprinting,
        bool isSneaking,
        bool isInLiquid,
        bool isOnGround,
        bool isClimbing,
        bool isSpectator,
        float moveResistance)
    {
        if (!_playerStates.TryGetValue(connectionId, out var state))
        {
            _playerStates[connectionId] = state = new PlayerAntiCheatState();
        }

        if (deltaTime <= 0 || deltaTime > 1.0f)
            return true;

        if (isSpectator)
        {
            state.LastValidPosition = newPosition;
            state.ViolationCount = 0;
            return true;
        }

        var dx = newPosition.X - oldPosition.X;
        var dy = newPosition.Y - oldPosition.Y;
        var dz = newPosition.Z - oldPosition.Z;
        var horizontalDist = Math.Sqrt(dx * dx + dz * dz);
        var totalDist = Math.Sqrt(dx * dx + dy * dy + dz * dz);

        if (totalDist > TeleportDistanceThreshold)
        {
            state.LastValidPosition = newPosition;
            state.ViolationCount = 0;
            return true;
        }

        float maxAllowedSpeed;
        if (isFlying)
        {
            maxAllowedSpeed = physics.FlySpeed * MaxFlySpeedBuffer;
        }
        else if (isInLiquid)
        {
            maxAllowedSpeed = physics.WalkSpeed * 0.5f * MaxSpeedBuffer;
        }
        else if (isClimbing)
        {
            maxAllowedSpeed = physics.ClimbSpeed * MaxSpeedBuffer;
        }
        else if (isSprinting)
        {
            maxAllowedSpeed = physics.SprintSpeed * MaxSpeedBuffer;
        }
        else if (isSneaking)
        {
            maxAllowedSpeed = physics.WalkSpeed * 0.3f * MaxSpeedBuffer;
        }
        else
        {
            maxAllowedSpeed = physics.WalkSpeed * MaxSpeedBuffer;
        }

        if (moveResistance > 0)
        {
            maxAllowedSpeed *= Math.Max(0.1f, 1.0f - moveResistance);
        }

        var maxAllowedDistance = maxAllowedSpeed * deltaTime;

        if (horizontalDist > maxAllowedDistance)
        {
            state.ViolationCount++;
            if (state.ViolationCount >= MaxViolationsBeforeCorrection)
            {
                state.ViolationCount = 0;
                return false;
            }
            return true;
        }

        if (!isFlying && !isSpectator && dy > 0 && !isOnGround && !isClimbing && !isInLiquid)
        {
            var maxJumpHeight = physics.JumpForce * physics.JumpForce / (2.0f * physics.Gravity);
            if (state.LastValidPosition.HasValue)
            {
                var heightAboveLast = newPosition.Y - state.LastValidPosition.Value.Y;
                if (heightAboveLast > maxJumpHeight * 2.0f)
                {
                    state.ViolationCount++;
                    if (state.ViolationCount >= MaxViolationsBeforeCorrection)
                    {
                        state.ViolationCount = 0;
                        return false;
                    }
                    return true;
                }
            }
        }

        state.ViolationCount = Math.Max(0, state.ViolationCount - 1);
        state.LastValidPosition = newPosition;
        return true;
    }

    private class PlayerAntiCheatState
    {
        public int ViolationCount;
        public Vector3? LastValidPosition;
    }
}
