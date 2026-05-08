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
    private readonly float _maxSpeedBuffer;
    private readonly float _maxFlySpeedBuffer;
    private readonly float _positionCorrectionThreshold;
    private readonly int _maxViolationsBeforeCorrection;
    private readonly float _teleportDistanceThreshold;

    private readonly Dictionary<string, PlayerAntiCheatState> _playerStates = new();

    public AntiCheatValidator(
        float maxSpeedBuffer = 1.5f,
        float maxFlySpeedBuffer = 2.0f,
        float positionCorrectionThreshold = 2.0f,
        int maxViolationsBeforeCorrection = 3,
        float teleportDistanceThreshold = 50.0f)
    {
        _maxSpeedBuffer = maxSpeedBuffer;
        _maxFlySpeedBuffer = maxFlySpeedBuffer;
        _positionCorrectionThreshold = positionCorrectionThreshold;
        _maxViolationsBeforeCorrection = maxViolationsBeforeCorrection;
        _teleportDistanceThreshold = teleportDistanceThreshold;
    }

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

        if (totalDist > _teleportDistanceThreshold)
        {
            state.LastValidPosition = newPosition;
            state.ViolationCount = 0;
            return true;
        }

        float maxAllowedSpeed;
        if (isFlying)
        {
            maxAllowedSpeed = physics.FlySpeed * _maxFlySpeedBuffer;
        }
        else if (isInLiquid)
        {
            maxAllowedSpeed = physics.WalkSpeed * 0.5f * _maxSpeedBuffer;
        }
        else if (isClimbing)
        {
            maxAllowedSpeed = physics.ClimbSpeed * _maxSpeedBuffer;
        }
        else if (isSprinting)
        {
            maxAllowedSpeed = physics.SprintSpeed * _maxSpeedBuffer;
        }
        else if (isSneaking)
        {
            maxAllowedSpeed = physics.WalkSpeed * 0.3f * _maxSpeedBuffer;
        }
        else
        {
            maxAllowedSpeed = physics.WalkSpeed * _maxSpeedBuffer;
        }

        if (moveResistance > 0)
        {
            maxAllowedSpeed *= Math.Max(0.1f, 1.0f - moveResistance);
        }

        var maxAllowedDistance = maxAllowedSpeed * deltaTime;

        if (horizontalDist > maxAllowedDistance)
        {
            state.ViolationCount++;
            if (state.ViolationCount >= _maxViolationsBeforeCorrection)
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
                    if (state.ViolationCount >= _maxViolationsBeforeCorrection)
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
