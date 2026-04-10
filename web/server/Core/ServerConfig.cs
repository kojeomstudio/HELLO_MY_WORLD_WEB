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
    public float Gravity { get; set; } = 20.0f;
    public float JumpForce { get; set; } = 8.0f;
    public float WalkSpeed { get; set; } = 5.0f;
    public float SprintSpeed { get; set; } = 8.0f;
    public float FlySpeed { get; set; } = 12.0f;
    public float TerminalVelocity { get; set; } = 50.0f;
    public float Drag { get; set; } = 0.1f;
    public float LiquidDrag { get; set; } = 0.8f;
    public float ClimbSpeed { get; set; } = 2.0f;

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
