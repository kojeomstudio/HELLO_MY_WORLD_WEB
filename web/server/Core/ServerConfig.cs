using System.Text.Json;
using System.Text.Json.Serialization;

namespace WebGameServer.Core;

public class ServerConfig
{
    public ServerSettings Server { get; set; } = new();
    public WorldSettings World { get; set; } = new();
    public PlayerSettings Player { get; set; } = new();
    public PhysicsSettings Physics { get; set; } = new();
    public DayNightSettings DayNight { get; set; } = new();
    public NetworkSettings Network { get; set; } = new();
    public LiquidSettings Liquid { get; set; } = new();
    public string[] CorsOrigins { get; set; } = ["http://localhost:5173", "http://localhost:3000"];
    public int ChatMessageLimitPer10Sec { get; set; } = 8;
    public int ChatMaxLength { get; set; } = 256;
    public int ItemEntityTTLSeconds { get; set; } = 900;
    public int AutoSaveIntervalTicks { get; set; } = 1200;
    public AuthSettings Auth { get; set; } = new();
    public SecuritySettings Security { get; set; } = new();
    public GameLoopSettings GameLoop { get; set; } = new();
    public EntitySettings Entities { get; set; } = new();
    public MobSettings Mobs { get; set; } = new();
    public WeatherSettings Weather { get; set; } = new();
    public RollbackSettings Rollback { get; set; } = new();
    public AreaProtectionSettings AreaProtection { get; set; } = new();
    public AntiCheatSettings AntiCheat { get; set; } = new();
    public PlayerDamageSettings PlayerDamage { get; set; } = new();
    public GameplaySettings Gameplay { get; set; } = new();
}

public class LiquidSettings
{
    public int WaterFlowInterval { get; set; } = 3;
    public int LavaFlowInterval { get; set; } = 5;
}

public class ServerSettings
{
    public string Name { get; set; } = "HelloMyWorld Web Game Server";
    public string Version { get; set; } = "1.0.0";
    public string Description { get; set; } = "";
    public int MaxPlayers { get; set; } = 100;
    public int TickRate { get; set; } = 20;
    public int Port { get; set; } = 5000;
}

public class WorldSettings
{
    public string DefaultGenerator { get; set; } = "noise";
    public int ChunkSize { get; set; } = 16;
    public int RenderDistance { get; set; } = 4;
    public int WorldSeed { get; set; } = 12345;
    public string[] Generators { get; set; } = ["noise", "flat"];
    public bool GenerateTrees { get; set; } = true;
    public bool GenerateCaves { get; set; } = true;
    public bool GenerateOres { get; set; } = true;
    public float TreeDensity { get; set; } = 0.02f;
    public float CaveDensity { get; set; } = 0.5f;
    public float OreDensity { get; set; } = 0.3f;
    public int WorldBorderSize { get; set; } = 1000;
    public float? StaticSpawnX { get; set; }
    public float? StaticSpawnY { get; set; }
    public float? StaticSpawnZ { get; set; }
}

public class PlayerSettings
{
    public int DefaultHealth { get; set; } = 20;
    public int DefaultBreath { get; set; } = 10;
    public int RespawnHealth { get; set; } = 20;
    public int InventorySize { get; set; } = 32;
    public int HotbarSize { get; set; } = 8;
    public float FallDamageThreshold { get; set; } = 3.0f;
    public float FallDamageMultiplier { get; set; } = 1.0f;
    public string[] StartItems { get; set; } = ["wooden_pickaxe", "wooden_sword", "torch", "bread"];
}

public class PhysicsSettings
{
    public float Gravity { get; set; } = 9.81f;
    public float JumpForce { get; set; } = 6.5f;
    public float WalkSpeed { get; set; } = 4.0f;
    public float SprintSpeed { get; set; } = 8.0f;
    public float FlySpeed { get; set; } = 12.0f;
    public float TerminalVelocity { get; set; } = 50.0f;
    public float Drag { get; set; } = 0.1f;
    public float LiquidDrag { get; set; } = 0.8f;
    public float ClimbSpeed { get; set; } = 3.0f;
    public float DigRange { get; set; } = 6.0f;
    public float PlaceRange { get; set; } = 6.0f;
    public float PunchRange { get; set; } = 4.0f;
    public float PickupRange { get; set; } = 2.0f;
    public float EyeHeight { get; set; } = 0.6f;
    public float PlayerDepth { get; set; } = 0.9f;
    public float PlayerHeight { get; set; } = 1.8f;

    public void LoadFromFile(string dataPath)
    {
        var filePath = Path.Combine(dataPath, "physics_constants.json");
        if (!File.Exists(filePath)) return;

        var json = File.ReadAllText(filePath);
        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;

        if (root.TryGetProperty("gravity", out var gravity))
            Gravity = (float)gravity.GetDouble();
        if (root.TryGetProperty("jumpForce", out var jumpForce))
            JumpForce = (float)jumpForce.GetDouble();
        if (root.TryGetProperty("walkSpeed", out var walkSpeed))
            WalkSpeed = (float)walkSpeed.GetDouble();
        if (root.TryGetProperty("sprintSpeed", out var sprintSpeed))
            SprintSpeed = (float)sprintSpeed.GetDouble();
        if (root.TryGetProperty("flySpeed", out var flySpeed))
            FlySpeed = (float)flySpeed.GetDouble();
        if (root.TryGetProperty("terminalVelocity", out var terminalVelocity))
            TerminalVelocity = (float)terminalVelocity.GetDouble();
        if (root.TryGetProperty("liquidDrag", out var liquidDrag))
            LiquidDrag = (float)liquidDrag.GetDouble();
        if (root.TryGetProperty("climbSpeed", out var climbSpeed))
            ClimbSpeed = (float)climbSpeed.GetDouble();
        if (root.TryGetProperty("digRange", out var digRange))
            DigRange = (float)digRange.GetDouble();
        if (root.TryGetProperty("placeRange", out var placeRange))
            PlaceRange = (float)placeRange.GetDouble();
        if (root.TryGetProperty("punchRange", out var punchRange))
            PunchRange = (float)punchRange.GetDouble();
        if (root.TryGetProperty("pickupRange", out var pickupRange))
            PickupRange = (float)pickupRange.GetDouble();
        if (root.TryGetProperty("eyeHeight", out var eyeHeight))
            EyeHeight = (float)eyeHeight.GetDouble();
        if (root.TryGetProperty("playerDepth", out var playerDepth))
            PlayerDepth = (float)playerDepth.GetDouble();
        if (root.TryGetProperty("playerHeight", out var playerHeight))
            PlayerHeight = (float)playerHeight.GetDouble();
    }
}

public class DayNightSettings
{
    public int CycleLength { get; set; } = 24000;
    public int DawnStart { get; set; } = 4500;
    public int DayStart { get; set; } = 6000;
    public int DuskStart { get; set; } = 16500;
    public int NightStart { get; set; } = 18000;
}

public class NetworkSettings
{
    public int ProtocolVersion { get; set; } = 1;
    public int PositionUpdateInterval { get; set; } = 50;
    public bool ChunkCompression { get; set; } = true;
    public int TimeBroadcastInterval { get; set; } = 100;
}

public class AuthSettings
{
    public int Pbkdf2Iterations { get; set; } = 100000;
    public int SaltSize { get; set; } = 16;
    public int HashSize { get; set; } = 32;
    public int MinPasswordLength { get; set; } = 8;
    public int MaxPasswordLength { get; set; } = 128;
    public int AccountLockoutAttempts { get; set; } = 5;
    public int AccountLockoutMinutes { get; set; } = 5;
    public string NamePattern { get; set; } = @"^[a-zA-Z0-9_-]{1,20}$";
    public string[] ReservedNames { get; set; } = ["server", "admin", "system", "console", "root", "moderator", "administrator", "owner", "staff"];
}

public class SecuritySettings
{
    public bool EnableHttpsRedirection { get; set; } = false;
    public int HstsMaxAge { get; set; } = 31536000;
    public int CspNonceSize { get; set; } = 16;
    public int MaxConcurrentConnections { get; set; } = 0;
    public string? ProfilerSecret { get; set; }

    public string? GetEffectiveProfilerSecret()
    {
        return Environment.GetEnvironmentVariable("PROFILER_SECRET") ?? ProfilerSecret;
    }
}

public class GameLoopSettings
{
    public int AutoSaveIntervalSeconds { get; set; } = 300;
    public int AutoBackupIntervalSeconds { get; set; } = 1800;
    public int FallingBlockInterval { get; set; } = 10;
}

public class EntitySettings
{
    public int MaxEntities { get; set; } = 10000;
}

public class MobSettings
{
    public int MaxMobs { get; set; } = 50;
    public float SpawnInterval { get; set; } = 10.0f;
    public float DespawnDistance { get; set; } = 128.0f;
    public int NightStart { get; set; } = 13000;
    public int NightEnd { get; set; } = 23000;
    public int DarkLightThreshold { get; set; } = 7;
}

public class WeatherSettings
{
    public int MinIntervalSeconds { get; set; } = 300;
    public int MaxIntervalSeconds { get; set; } = 600;
}

public class RollbackSettings
{
    public int MaxRecords { get; set; } = 10000;
}

public class AreaProtectionSettings
{
    public int MaxAreasPerPlayer { get; set; } = 16;
    public int MaxClaimSize { get; set; } = 256;
}

public class AntiCheatSettings
{
    public float MaxSpeedBuffer { get; set; } = 1.5f;
    public float MaxFlySpeedBuffer { get; set; } = 2.0f;
    public float PositionCorrectionThreshold { get; set; } = 2.0f;
    public int MaxViolationsBeforeCorrection { get; set; } = 3;
    public float TeleportDistanceThreshold { get; set; } = 50.0f;
}

public class PlayerDamageSettings
{
    public int LavaDamageIntervalMs { get; set; } = 500;
    public int BlockDamageIntervalMs { get; set; } = 500;
    public float SaturationDrainPerTick { get; set; } = 0.01f;
    public float FoodDrainPerTick { get; set; } = 0.05f;
    public int HealthRegenThreshold { get; set; } = 18;
    public float HealthRegenPerTick { get; set; } = 0.2f;
    public float SaturationCostPerHealTick { get; set; } = 0.5f;
    public float StarvationDamagePerTick { get; set; } = 0.5f;
    public float DrowningBreathDrain { get; set; } = 0.05f;
    public float DrowningDamage { get; set; } = 1.0f;
    public float BreathRecoveryRate { get; set; } = 0.2f;
    public float VoidDeathY { get; set; } = -64;
    public float RespawnY { get; set; } = 80;
}

public class GameplaySettings
{
    public float ExperienceFormulaBase { get; set; } = 10;
    public float ExperienceFormulaPerLevel { get; set; } = 5;
    public float RaycastMaxDistance { get; set; } = 8.0f;
    public float BlockInteractDistance { get; set; } = 6.0f;
    public float PositionBroadcastRange { get; set; } = 64;
    public float ChunkRequestDistanceLimit { get; set; } = 256;
}
