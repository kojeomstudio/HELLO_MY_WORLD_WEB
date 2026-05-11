using Microsoft.AspNetCore.StaticFiles;
using Microsoft.AspNetCore.SignalR;
using System.Text.Json;
using WebGameServer.Core;
using WebGameServer.Core.Auth;
using WebGameServer.Core.Chat;
using WebGameServer.Core.Crafting;
using WebGameServer.Core.Entities;
using WebGameServer.Core.Game;
using WebGameServer.Core.Physics;
using WebGameServer.Core.Smelting;
using WebGameServer.Core.World;
using WebGameServer.Core.Player;
using WebGameServer.Core.Weather;
using WebGameServer.Services;

using WebGameServer.Core.Inventory;
using WebGameServer.Core.Particles;
using WebGameServer.Core.Protection;
using WebGameServer.Core.Rollback;
using WebGameServer.Core.Sound;
using WebGameServer.Core.UI;
using WebGameServer.Core.ModStorage;

static bool IsValidOrigin(string origin)
{
    if (string.IsNullOrWhiteSpace(origin)) return false;
    return Uri.TryCreate(origin, UriKind.Absolute, out var uri)
        && (uri.Scheme == "http" || uri.Scheme == "https")
        && uri.Host.Length > 0
        && uri.Host.All(c => char.IsLetterOrDigit(c) || c == '.' || c == '-' || c == '_')
        && uri.Port > 0 && uri.Port <= 65535;
}

static bool CryptographicOperationsEqual(string a, string b)
{
    var bytesA = System.Text.Encoding.UTF8.GetBytes(a);
    var bytesB = System.Text.Encoding.UTF8.GetBytes(b);
    if (bytesA.Length != bytesB.Length) return false;
    return System.Security.Cryptography.CryptographicOperations.FixedTimeEquals(bytesA, bytesB);
}

var builder = WebApplication.CreateBuilder(args);

var configPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "data", "server_config.json");
if (!File.Exists(configPath))
    configPath = Path.Combine(Directory.GetCurrentDirectory(), "data", "server_config.json");

var serverConfig = new ServerConfig();
if (File.Exists(configPath))
{
    var configJson = File.ReadAllText(configPath);
    serverConfig = JsonSerializer.Deserialize<ServerConfig>(configJson) ?? new ServerConfig();
}

var envSeed = Environment.GetEnvironmentVariable("WORLD_SEED");
if (!string.IsNullOrEmpty(envSeed) && int.TryParse(envSeed, out var seed))
{
    serverConfig.World.WorldSeed = seed;
}

var envMaxConnections = Environment.GetEnvironmentVariable("MAX_CONNECTIONS");
if (!string.IsNullOrEmpty(envMaxConnections) && long.TryParse(envMaxConnections, out var maxConn) && maxConn > 0)
{
    serverConfig.Security.MaxConcurrentConnections = (int)maxConn;
}

var dataPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "data");
if (!Directory.Exists(dataPath))
    dataPath = Path.Combine(Directory.GetCurrentDirectory(), "data");
serverConfig.Physics.LoadFromFile(dataPath);

ItemEntity.DefaultTTLSeconds = serverConfig.ItemEntityTTLSeconds;

var abmConfigPath = Path.Combine(dataPath, "abm_config.json");
using var abmConfigDoc = File.Exists(abmConfigPath) ? JsonDocument.Parse(File.ReadAllText(abmConfigPath)) : null;
var abmModifiers = abmConfigDoc?.RootElement.GetProperty("modifiers");

var mobsPath = Path.Combine(dataPath, "mobs.json");
MobConfig.LoadFromFile(mobsPath);

var toolsPath = Path.Combine(dataPath, "tools.json");
ToolConfig.LoadFromFile(toolsPath);

builder.Services.AddSingleton(serverConfig);

builder.Services.AddSignalR(options =>
{
    options.MaximumReceiveMessageSize = 64 * 1024;
});
builder.Services.AddSingleton<BlockDefinitionManager>(sp =>
{
    var manager = new BlockDefinitionManager();
    var dataPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "data", "blocks.json");
    if (!File.Exists(dataPath))
        dataPath = Path.Combine(Directory.GetCurrentDirectory(), "data", "blocks.json");
    manager.LoadFromFile(dataPath);
    return manager;
});
builder.Services.AddSingleton<WorldGeneratorFactory>();
builder.Services.AddSingleton<SmeltingSystem>(sp =>
{
    var smelting = new SmeltingSystem();
    var dataPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "data", "smelting.json");
    if (!File.Exists(dataPath))
        dataPath = Path.Combine(Directory.GetCurrentDirectory(), "data", "smelting.json");
    smelting.LoadRecipes(dataPath);
    return smelting;
});
builder.Services.AddSingleton<PrivilegeSystem>(sp =>
{
    var privilegeSystem = new PrivilegeSystem();
    var dataPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "data", "privileges.json");
    if (!File.Exists(dataPath))
        dataPath = Path.Combine(Directory.GetCurrentDirectory(), "data", "privileges.json");
    privilegeSystem.LoadFromFile(dataPath);
    return privilegeSystem;
});
builder.Services.AddSingleton<ActiveBlockModifierSystem>(sp =>
{
    var system = new ActiveBlockModifierSystem();
    var blockDefinitions = sp.GetRequiredService<BlockDefinitionManager>();
    var entityManager = sp.GetRequiredService<EntityManager>();

    static float GetAbmFloat(JsonElement? mods, string name, string prop, float defaultVal)
    {
        if (mods == null) return defaultVal;
        foreach (var m in mods.Value.EnumerateArray())
        {
            if (m.GetProperty("name").GetString() == name && m.TryGetProperty(prop, out var p))
                return (float)p.GetDouble();
        }
        return defaultVal;
    }

    static int GetAbmInt(JsonElement? mods, string name, string prop, int defaultVal)
    {
        if (mods == null) return defaultVal;
        foreach (var m in mods.Value.EnumerateArray())
        {
            if (m.GetProperty("name").GetString() == name && m.TryGetProperty(prop, out var p))
                return p.GetInt32();
        }
        return defaultVal;
    }

    system.Register(new ActiveBlockModifier
    {
        Name = "sand_falling",
        Interval = GetAbmInt(abmModifiers, "sand_falling", "interval", 2),
        Chance = GetAbmFloat(abmModifiers, "sand_falling", "chance", 1.0f),
        Action = (blockDef, pos, world) =>
        {
            var below = new Vector3s(pos.X, (short)(pos.Y - 1), pos.Z);
            if (world.GetBlock(below).Type == BlockType.Air)
            {
                var fallingBlock = new Block((BlockType)blockDef.Id);
                world.SetBlock(below, fallingBlock);
                world.SetBlock(pos, Block.Air);
                return true;
            }
            return false;
        }
    });

    system.Register(new ActiveBlockModifier
    {
        Name = "gravel_falling",
        Interval = GetAbmInt(abmModifiers, "gravel_falling", "interval", 2),
        Chance = GetAbmFloat(abmModifiers, "gravel_falling", "chance", 1.0f),
        Action = (blockDef, pos, world) =>
        {
            var below = new Vector3s(pos.X, (short)(pos.Y - 1), pos.Z);
            if (world.GetBlock(below).Type == BlockType.Air)
            {
                var fallingBlock = new Block((BlockType)blockDef.Id);
                world.SetBlock(below, fallingBlock);
                world.SetBlock(pos, Block.Air);
                return true;
            }
            return false;
        }
    });

    system.Register(new ActiveBlockModifier
    {
        Name = "dirt_to_grass",
        Interval = GetAbmInt(abmModifiers, "dirt_to_grass", "interval", 20),
        Chance = GetAbmFloat(abmModifiers, "dirt_to_grass", "chance", 0.1f),
        RequiredNeighbor = "air",
        Action = (blockDef, pos, world) =>
        {
            var above = new Vector3s(pos.X, (short)(pos.Y + 1), pos.Z);
            var aboveBlock = world.GetBlock(above);
            if (aboveBlock.Type != BlockType.Air) return false;
            world.SetBlock(pos, new Block(BlockType.Grass));
            return true;
        }
    });

    system.Register(new ActiveBlockModifier
    {
        Name = "ice_melt",
        Interval = GetAbmInt(abmModifiers, "ice_melt", "interval", 30),
        Chance = GetAbmFloat(abmModifiers, "ice_melt", "chance", 0.05f),
        Action = (blockDef, pos, world) =>
        {
            for (int dx = -2; dx <= 2; dx++)
            {
                for (int dz = -2; dz <= 2; dz++)
                {
                    var checkPos = new Vector3s((short)(pos.X + dx), pos.Y, (short)(pos.Z + dz));
                    var check = world.GetBlock(checkPos);
                    if (check.Type is BlockType.Lava or BlockType.LavaFlowing or BlockType.Fire)
                    {
                        world.SetBlock(pos, new Block(BlockType.Water));
                        return true;
                    }
                }
            }
            return false;
        }
    });

    system.Register(new ActiveBlockModifier
    {
        Name = "fire_spread",
        Interval = GetAbmInt(abmModifiers, "fire_spread", "interval", 3),
        Chance = GetAbmFloat(abmModifiers, "fire_spread", "chance", 0.3f),
        Action = (blockDef, pos, world) =>
        {
            if (blockDef.Name != "fire") return false;

            for (int dy = -1; dy <= 1; dy++)
            {
                for (int dx = -1; dx <= 1; dx++)
                {
                    for (int dz = -1; dz <= 1; dz++)
                    {
                        if (dx == 0 && dy == 0 && dz == 0) continue;
                        var nPos = new Vector3s((short)(pos.X + dx), (short)(pos.Y + dy), (short)(pos.Z + dz));
                        var neighbor = world.GetBlock(nPos);
                        if (neighbor.Type is BlockType.Wood or BlockType.Leaves
                            or BlockType.JungleWood or BlockType.JungleLeaves
                            or BlockType.Planks or BlockType.JungleLeaves)
                        {
                            if (Random.Shared.NextSingle() < GetAbmFloat(abmModifiers, "fire_spread", "spreadChance", 0.15f))
                            {
                                world.SetBlock(nPos, new Block(BlockType.Fire));
                            }
                        }
                    }
                }
            }

            if (Random.Shared.NextSingle() < GetAbmFloat(abmModifiers, "fire_spread", "burnoutChance", 0.2f))
            {
                world.SetBlock(pos, Block.Air);
            }
            return true;
        }
    });

    system.Register(new ActiveBlockModifier
    {
        Name = "cactus_growth",
        Interval = GetAbmInt(abmModifiers, "cactus_growth", "interval", 40),
        Chance = GetAbmFloat(abmModifiers, "cactus_growth", "chance", 0.2f),
        Action = (blockDef, pos, world) =>
        {
            if (blockDef.Name != "cactus") return false;
            var above = new Vector3s(pos.X, (short)(pos.Y + 1), pos.Z);
            if (world.GetBlock(above).Type != BlockType.Air) return false;

            int height = 1;
            for (int dy = 1; dy <= 3; dy++)
            {
                var checkPos = new Vector3s(pos.X, (short)(pos.Y - dy), pos.Z);
                if (world.GetBlock(checkPos).Type == BlockType.Cactus)
                    height++;
                else
                    break;
            }

            if (height < GetAbmInt(abmModifiers, "cactus_growth", "maxHeight", 3))
            {
                world.SetBlock(above, new Block(BlockType.Cactus));
                return true;
            }
            return false;
        }
    });

    system.Register(new ActiveBlockModifier
    {
        Name = "sugarcane_growth",
        Interval = GetAbmInt(abmModifiers, "sugarcane_growth", "interval", 40),
        Chance = GetAbmFloat(abmModifiers, "sugarcane_growth", "chance", 0.2f),
        Action = (blockDef, pos, world) =>
        {
            if (blockDef.Name != "sugar_cane") return false;
            var above = new Vector3s(pos.X, (short)(pos.Y + 1), pos.Z);
            if (world.GetBlock(above).Type != BlockType.Air) return false;

            bool hasWater = false;
            var waterRange = GetAbmInt(abmModifiers, "sugarcane_growth", "waterSearchRange", 4);
            for (int dx = -waterRange; dx <= waterRange && !hasWater; dx++)
            {
                for (int dz = -waterRange; dz <= waterRange && !hasWater; dz++)
                {
                    var checkPos = new Vector3s((short)(pos.X + dx), pos.Y, (short)(pos.Z + dz));
                    if (world.GetBlock(checkPos).Type is BlockType.Water or BlockType.WaterFlowing)
                        hasWater = true;
                }
            }

            if (!hasWater) return false;

            int height = 1;
            for (int dy = 1; dy <= 3; dy++)
            {
                var checkPos = new Vector3s(pos.X, (short)(pos.Y - dy), pos.Z);
                if (world.GetBlock(checkPos).Type == BlockType.SugarCane)
                    height++;
                else
                    break;
            }

            if (height < GetAbmInt(abmModifiers, "sugarcane_growth", "maxHeight", 3))
            {
                world.SetBlock(above, new Block(BlockType.SugarCane));
                return true;
            }
            return false;
        }
    });

    system.Register(new ActiveBlockModifier
    {
        Name = "mushroom_spread",
        Interval = GetAbmInt(abmModifiers, "mushroom_spread", "interval", 60),
        Chance = GetAbmFloat(abmModifiers, "mushroom_spread", "chance", 0.05f),
        Action = (blockDef, pos, world) =>
        {
            if (blockDef.Name is not ("mushroom_red_block" or "mushroom_brown_block")) return false;

            var dx = Random.Shared.Next(-1, 2);
            var dz = Random.Shared.Next(-1, 2);
            var spreadPos = new Vector3s((short)(pos.X + dx), pos.Y, (short)(pos.Z + dz));
            var target = world.GetBlock(spreadPos);
            if (target.Type != BlockType.Air) return false;

            var below = new Vector3s(spreadPos.X, (short)(spreadPos.Y - 1), spreadPos.Z);
            var belowBlock = world.GetBlock(below);
            if (belowBlock.Type is BlockType.Stone or BlockType.Dirt or BlockType.Mycelium)
            {
                world.SetBlock(spreadPos, new Block(blockDef.Name == "mushroom_red_block"
                    ? BlockType.MushroomRedBlock : BlockType.MushroomBrownBlock));
                return true;
            }
            return false;
        }
    });

    system.Register(new ActiveBlockModifier
    {
        Name = "snow_spread",
        Interval = GetAbmInt(abmModifiers, "snow_spread", "interval", 120),
        Chance = GetAbmFloat(abmModifiers, "snow_spread", "chance", 0.02f),
        Action = (blockDef, pos, world) =>
        {
            if (blockDef.Name != "snow_layer") return false;
            if (blockDef.Light > 0) return false;

            var above = new Vector3s(pos.X, (short)(pos.Y + 1), pos.Z);
            var aboveBlock = world.GetBlock(above);
            var aboveDef = blockDefinitions.Get((ushort)aboveBlock.Type);
            if (aboveDef != null && aboveDef.Solid && aboveDef.Name != "snow_layer" && aboveDef.Name != "snowblock")
                return false;
            if (aboveBlock.Type != BlockType.Air && aboveBlock.Type != BlockType.SnowLayer) return false;

            var offsets = new (int, int)[]
            {
                (1, 0), (-1, 0), (0, 1), (0, -1)
            };
            var idx = Random.Shared.Next(offsets.Length);
            var (dx, dz) = offsets[idx];
            var spreadPos = new Vector3s((short)(pos.X + dx), pos.Y, (short)(pos.Z + dz));
            var target = world.GetBlock(spreadPos);
            if (target.Type == BlockType.Air)
            {
                world.SetBlock(spreadPos, new Block(BlockType.SnowLayer));
                return true;
            }
            return false;
        }
    });

    system.Register(new ActiveBlockModifier
    {
        Name = "grass_spread_aggressive",
        Interval = GetAbmInt(abmModifiers, "grass_spread_aggressive", "interval", 12),
        Chance = GetAbmFloat(abmModifiers, "grass_spread_aggressive", "chance", 0.15f),
        Action = (blockDef, pos, world) =>
        {
            if (blockDef.Name != "grass") return false;
            var above = new Vector3s(pos.X, (short)(pos.Y + 1), pos.Z);
            if (world.GetBlock(above).Type != BlockType.Air) return false;

            var dx = Random.Shared.Next(-1, 2);
            var dz = Random.Shared.Next(-1, 2);
            var spreadPos = new Vector3s((short)(pos.X + dx), pos.Y, (short)(pos.Z + dz));
            var target = world.GetBlock(spreadPos);
            if (target.Type != BlockType.Dirt) return false;

            var targetAbove = new Vector3s(spreadPos.X, (short)(spreadPos.Y + 1), spreadPos.Z);
            var targetAboveBlock = world.GetBlock(targetAbove);
            if (targetAboveBlock.Type != BlockType.Air) return false;

            world.SetBlock(spreadPos, new Block(BlockType.Grass));
            return true;
        }
    });

    system.Register(new ActiveBlockModifier
    {
        Name = "vine_growth",
        Interval = GetAbmInt(abmModifiers, "vine_growth", "interval", 30),
        Chance = GetAbmFloat(abmModifiers, "vine_growth", "chance", 0.1f),
        Action = (blockDef, pos, world) =>
        {
            if (blockDef.Name != "vine") return false;
            if (Random.Shared.NextSingle() < 0.5f)
            {
                var below = new Vector3s(pos.X, (short)(pos.Y - 1), pos.Z);
                var belowBlock = world.GetBlock(below);
                if (belowBlock.Type == BlockType.Air)
                {
                    int vineLength = 1;
                    for (int dy = 1; dy <= 5; dy++)
                    {
                        var checkPos = new Vector3s(pos.X, (short)(pos.Y - dy), pos.Z);
                        if (world.GetBlock(checkPos).Type == BlockType.Vine)
                            vineLength++;
                        else
                            break;
                    }
                    if (vineLength < 7)
                    {
                        world.SetBlock(below, new Block(BlockType.Vine));
                        return true;
                    }
                }
            }
            else
            {
                var dx = Random.Shared.Next(-1, 2);
                var dz = Random.Shared.Next(-1, 2);
                var spreadPos = new Vector3s((short)(pos.X + dx), pos.Y, (short)(pos.Z + dz));
                var target = world.GetBlock(spreadPos);
                if (target.Type != BlockType.Air) return false;

                var sidePos = new Vector3s((short)(pos.X - dx), pos.Y, (short)(pos.Z - dz));
                var sideBlock = world.GetBlock(sidePos);
                var sideDef = blockDefinitions.Get((ushort)sideBlock.Type);
                if (sideDef != null && sideDef.Solid && !sideDef.BuildableTo)
                {
                    world.SetBlock(spreadPos, new Block(BlockType.Vine));
                    return true;
                }
            }
            return false;
        }
    });

    system.Register(new ActiveBlockModifier
    {
        Name = "coral_spread",
        Interval = GetAbmInt(abmModifiers, "coral_spread", "interval", 60),
        Chance = GetAbmFloat(abmModifiers, "coral_spread", "chance", 0.03f),
        Action = (blockDef, pos, world) =>
        {
            if (blockDef.Name != "coral_block") return false;
            var above = new Vector3s(pos.X, (short)(pos.Y + 1), pos.Z);
            var aboveBlock = world.GetBlock(above);
            if (aboveBlock.Type != BlockType.Water) return false;

            var dx = Random.Shared.Next(-1, 2);
            var dz = Random.Shared.Next(-1, 2);
            var spreadPos = new Vector3s((short)(pos.X + dx), pos.Y, (short)(pos.Z + dz));
            var target = world.GetBlock(spreadPos);
            if (target.Type != BlockType.Air) return false;

            var targetAbove = new Vector3s(spreadPos.X, (short)(spreadPos.Y + 1), spreadPos.Z);
            var targetAboveBlock = world.GetBlock(targetAbove);
            if (targetAboveBlock.Type != BlockType.Water) return false;

            world.SetBlock(spreadPos, new Block(BlockType.CoralBlock));
            return true;
        }
    });

    system.Register(new ActiveBlockModifier
    {
        Name = "coral_death",
        Interval = GetAbmInt(abmModifiers, "coral_death", "interval", 45),
        Chance = GetAbmFloat(abmModifiers, "coral_death", "chance", 0.05f),
        Action = (blockDef, pos, world) =>
        {
            if (blockDef.Name != "coral_block") return false;
            var above = new Vector3s(pos.X, (short)(pos.Y + 1), pos.Z);
            var aboveBlock = world.GetBlock(above);

            if (aboveBlock.Type != BlockType.Water && aboveBlock.Type != BlockType.WaterFlowing && aboveBlock.Type != BlockType.RiverWater)
            {
                world.SetBlock(pos, new Block(BlockType.DeadCoralBlock));
                return true;
            }
            return false;
        }
    });

    system.Register(new ActiveBlockModifier
    {
        Name = "mud_formation",
        Interval = GetAbmInt(abmModifiers, "mud_formation", "interval", 50),
        Chance = GetAbmFloat(abmModifiers, "mud_formation", "chance", 0.04f),
        Action = (blockDef, pos, world) =>
        {
            if (blockDef.Name != "dirt") return false;
            bool hasWater = false;
            for (int dx = -1; dx <= 1 && !hasWater; dx++)
            {
                for (int dz = -1; dz <= 1 && !hasWater; dz++)
                {
                    for (int dy = -1; dy <= 1 && !hasWater; dy++)
                    {
                        if (dx == 0 && dy == 0 && dz == 0) continue;
                        var checkPos = new Vector3s((short)(pos.X + dx), (short)(pos.Y + dy), (short)(pos.Z + dz));
                        var check = world.GetBlock(checkPos);
                        if (check.Type is BlockType.Water or BlockType.WaterFlowing or BlockType.RiverWater)
                            hasWater = true;
                    }
                }
            }
            if (hasWater)
            {
                world.SetBlock(pos, new Block(BlockType.Mud));
                return true;
            }
            return false;
        }
    });

    system.Register(new ActiveBlockModifier
    {
        Name = "attached_node_check",
        Interval = GetAbmInt(abmModifiers, "attached_node_check", "interval", 5),
        Chance = 1.0f,
        Action = (blockDef, pos, world) =>
        {
            if (!blockDef.AttachedNode) return false;

            var below = new Vector3s(pos.X, (short)(pos.Y - 1), pos.Z);
            var belowBlock = world.GetBlock(below);
            var belowDef = blockDefinitions.Get((ushort)belowBlock.Type);
            if (belowDef != null && belowDef.Solid) return false;

            world.SetBlock(pos, Block.Air);
            var itemEnt = new ItemEntity(blockDef.Drops ?? blockDef.Name ?? "", 1,
                new Vector3(pos.X + 0.5f, pos.Y + 0.5f, pos.Z + 0.5f));
            entityManager.Add(itemEnt);
            return true;
        }
    });

    return system;
});
builder.Services.AddSingleton<AntiCheatValidator>(sp =>
{
    var config = sp.GetRequiredService<ServerConfig>();
    return new AntiCheatValidator(
        config.AntiCheat.MaxSpeedBuffer,
        config.AntiCheat.MaxFlySpeedBuffer,
        config.AntiCheat.PositionCorrectionThreshold,
        config.AntiCheat.MaxViolationsBeforeCorrection,
        config.AntiCheat.TeleportDistanceThreshold);
});
builder.Services.AddSingleton<KnockbackSystem>();

var dataDir = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "data", "worlds", "default");
if (!Directory.Exists(dataDir))
    dataDir = Path.Combine(Directory.GetCurrentDirectory(), "data", "worlds", "default");
Directory.CreateDirectory(dataDir);

builder.Services.AddSingleton<BanDatabase>(sp =>
{
    var banDbPath = Path.Combine(dataDir, "bans.json");
    return new BanDatabase(banDbPath);
});
builder.Services.AddSingleton<RollbackSystem>(sp =>
{
    var config = sp.GetRequiredService<ServerConfig>();
    return new RollbackSystem(config.Rollback.MaxRecords);
});
builder.Services.AddSingleton<ProtectionSystem>(sp =>
{
    var privilegeSystem = sp.GetRequiredService<PrivilegeSystem>();
    var system = new ProtectionSystem();
    system.SetPrivilegeBypass("protection_bypass", (player, priv) => privilegeSystem.HasPrivilege(player, priv));
    return system;
});
builder.Services.AddSingleton<AreaProtectionSystem>(sp =>
{
    var gameServer = sp.GetRequiredService<GameServer>();
    var config = sp.GetRequiredService<ServerConfig>();
    return new AreaProtectionSystem(gameServer, config.AreaProtection.MaxAreasPerPlayer, config.AreaProtection.MaxClaimSize);
});
builder.Services.AddSingleton<ParticleSpawnerManager>();
builder.Services.AddSingleton<RedstoneSystem>();
builder.Services.AddSingleton<FishingSystem>();
builder.Services.AddSingleton<BreedingSystem>();
builder.Services.AddSingleton<SoundSpecManager>(sp =>
{
    var blockDefs = sp.GetRequiredService<BlockDefinitionManager>();
    var manager = new SoundSpecManager(blockDefs);
    var soundsPath = Path.Combine(dataPath, "sounds.json");
    if (File.Exists(soundsPath))
        manager.LoadFromFile(soundsPath);
    return manager;
});
builder.Services.AddSingleton<DetachedInventoryManager>();
builder.Services.AddSingleton<FormspecSystem>(sp =>
{
    var system = new FormspecSystem();
    var formspecPath = Path.Combine(dataPath, "formspecs.json");
    if (File.Exists(formspecPath))
        system.LoadFromFile(formspecPath);
    return system;
});

builder.Services.AddSingleton<ModStorageDatabase>(sp =>
{
    var worldPath = Path.Combine(dataDir, "world");
    Directory.CreateDirectory(worldPath);
    return new ModStorageDatabase(worldPath);
});

var playerDbPath = Path.Combine(dataDir, "players.db");
var blockMetaDbPath = Path.Combine(dataDir, "blockmeta.db");

builder.Services.AddSingleton(new PlayerDatabase(playerDbPath));
builder.Services.AddSingleton(new BlockMetadataDatabase(blockMetaDbPath));
builder.Services.AddSingleton<PhysicsEngine>(sp => new PhysicsEngine());
builder.Services.AddSingleton<GameServer>();
builder.Services.AddSingleton<AuthenticationService>(sp =>
{
    var config = sp.GetRequiredService<ServerConfig>();
    return new AuthenticationService(
        config.Auth.AccountLockoutAttempts,
        config.Auth.AccountLockoutMinutes,
        10);
});
builder.Services.AddSingleton<AsyncJobSystem>();
builder.Services.AddSingleton<ChatCommandManager>(sp =>
{
    var gameServer = sp.GetRequiredService<GameServer>();
    var authService = sp.GetRequiredService<AuthenticationService>();
    var privilegeSystem = sp.GetRequiredService<PrivilegeSystem>();
    var entityManager = sp.GetRequiredService<EntityManager>();
    var areaProtection = sp.GetRequiredService<AreaProtectionSystem>();
    return new ChatCommandManager(
        () => gameServer.GameTime,
        () => gameServer.TickRate,
        (playerName, mode) => { gameServer.SetGameMode(playerName, mode); },
        (playerName, pos) => { gameServer.TeleportPlayer(playerName, pos); },
        (playerName, targetPlayer, itemId, count) => { gameServer.GiveItem(targetPlayer, itemId, count); },
        (playerName) => { gameServer.KillPlayer(playerName); },
        (playerName) => { gameServer.ClearInventory(playerName); },
        () => gameServer.OnlinePlayers.Select(p => p.Name).ToArray(),
        (playerName) => { gameServer.KickPlayer(gameServer.GetPlayerConnectionId(playerName) ?? ""); },
        (playerName) => { authService.BanName(playerName); gameServer.BanPlayer(playerName); },
        (playerName) => { authService.UnbanName(playerName); gameServer.UnbanPlayer(playerName); },
        (playerName) => gameServer.GetPlayerPrivilegeList(playerName),
        (playerName, priv) => { privilegeSystem.GrantPrivilege(playerName, priv); },
        (playerName, priv) => { privilegeSystem.RevokePrivilege(playerName, priv); },
        (time) => { gameServer.SetTimeOfDay(time); },
        () => { gameServer.Stop(); },
        (entityType, pos) => { gameServer.SpawnEntity(entityType, pos); },
        () => { gameServer.ClearAllEntities(); },
        (size) => { gameServer.SetWorldBorder(size); },
        (playerName) => gameServer.Privileges.HasPrivilege(playerName, "server"),
        (from, to, msg) => gameServer.SendPrivateMessage(from, to, msg),
        areaProtection,
        (playerName, newPassword) => {
            try
            {
                var playerDb = sp.GetRequiredService<PlayerDatabase>();
                var hash = AuthenticationService.HashPassword(newPassword);
                playerDb.SetPasswordHash(playerName, hash);
                return true;
            }
            catch { return false; }
        },
        (password, storedHash) => AuthenticationService.VerifyPassword(password, storedHash),
        sp.GetRequiredService<PlayerDatabase>(),
        (itemId) => {
            var blockDefMgr = sp.GetRequiredService<BlockDefinitionManager>();
            if (blockDefMgr.GetByName(itemId) != null) return true;
            var crafting = sp.GetRequiredService<CraftingSystem>();
            return crafting.GetAllRecipes().Any(r => r.ResultItemId.Equals(itemId, StringComparison.OrdinalIgnoreCase));
        },
        (entityType) => MobConfig.Definitions.ContainsKey(entityType),
        (playerName, hp) => { gameServer.SetPlayerHealth(playerName, hp); },
        (playerName, size) => { gameServer.SetPlayerHotbarSize(playerName, size); },
        (playerName, gravity, jump, walk, sprint, fly) => { gameServer.SetPlayerPhysicsOverride(playerName, gravity, jump, walk, sprint, fly); },
        (playerName) => { gameServer.ClearPlayerPhysicsOverride(playerName); },
        (playerName) => { gameServer.SendPhysicsParamsToPlayer(playerName); },
        (targetName, flagName) =>
        {
            var player = gameServer.GetPlayer(targetName);
            if (player == null) return null;
            var flagLabel = flagName switch
            {
                "invisible" => player.IsInvisible = !player.IsInvisible,
                "footstep" => player.MakesFootstepSound = !player.MakesFootstepSound,
                "zoom" => player.CanZoom = !player.CanZoom,
                _ => false
            };
            var stateStr = flagLabel ? "ON" : "OFF";
            var flagDisplayName = flagName switch
            {
                "invisible" => "invisible",
                "footstep" => "footstep sound",
                "zoom" => "zoom",
                _ => flagName
            };
            return $"FLAG_UPDATE:{targetName}:{player.IsInvisible}:{player.MakesFootstepSound}:{player.CanZoom}:{flagDisplayName} is now {stateStr} for {targetName}";
        },
        (playerName, x, y, z, color, name) => { gameServer.BroadcastWaypoint(playerName, x, y, z, name, color); },
        () => { gameServer.ClearMobs(); },
        (playerName) =>
        {
            var player = gameServer.GetPlayer(playerName);
            return player?.Statistics;
        },
        () =>
        {
            var worldDataPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "data", "worlds", "default");
            if (!Directory.Exists(worldDataPath))
                worldDataPath = Path.Combine(Directory.GetCurrentDirectory(), "data", "worlds", "default");
            return worldDataPath;
        },
        (playerName, seconds) => gameServer.PerformRollback(playerName, seconds),
        (x1, y1, z1, x2, y2, z2, seconds) => gameServer.PerformAreaRollback(x1, y1, z1, x2, y2, z2, seconds),
        () => gameServer.DefaultWorld.Seed,
        () => gameServer.DefaultWorld.Name,
        () => gameServer.DefaultWorld.GetLoadedChunks().Count,
        () => entityManager.Count,
        null,
        (playerName) => {
            try
            {
                var playerDb = sp.GetRequiredService<PlayerDatabase>();
                playerDb.SetPasswordHash(playerName, string.Empty);
                return true;
            }
            catch { return false; }
        },
        (playerName) => {
            try
            {
                var playerDb = sp.GetRequiredService<PlayerDatabase>();
                return playerDb.RemovePlayer(playerName);
            }
            catch { return false; }
        },
        () => {
            try
            {
                var authService = sp.GetRequiredService<AuthenticationService>();
                authService.ReloadAuth();
            }
            catch { }
        },
        (playerName) => {
            try
            {
                var playerDb = sp.GetRequiredService<PlayerDatabase>();
                return playerDb.GetLastLogin(playerName);
            }
            catch { return null; }
        },
        (x, y, z, radius) => {
            var rollback = sp.GetRequiredService<RollbackSystem>();
            return rollback.CheckPosition(x, y, z, radius);
        },
        (x1, y1, z1, x2, y2, z2) => {
            var emergeMgr = sp.GetRequiredService<EmergeManager>();
            return emergeMgr.EmergeArea(x1, y1, z1, x2, y2, z2);
        },
        (x1, y1, z1, x2, y2, z2) => {
            gameServer.DeleteBlocks(x1, y1, z1, x2, y2, z2);
            return 0;
        },
        (x1, y1, z1, x2, y2, z2) => {
            var world = gameServer.DefaultWorld;
            world.FixLighting(x1, y1, z1, x2, y2, z2);
            return 0;
        },
        (playerName) => {
            var player = gameServer.GetPlayer(playerName);
            return player?.Position ?? Vector3.Zero;
        },
        (sourceName, targetName) => {
            var source = gameServer.GetPlayer(sourceName);
            var target = gameServer.GetPlayer(targetName);
            if (source == null || target == null) return false;
            gameServer.TeleportPlayer(sourceName, target.Position);
            return true;
        },
        (playerName, group, level, uses) => {
            var player = gameServer.GetPlayer(playerName);
            if (player == null) return;
            var item = player.GetSelectedHotbarItem();
            if (item == null) return;
            var metadata = item.Metadata ?? "";
            var currentWear = 0;
            if (metadata.StartsWith("wear:") && int.TryParse(metadata[5..], out var w))
                currentWear = w;
            var maxWear = 65536;
            var wearPerUse = maxWear / (uses * 4 + 1);
            var newWear = Math.Min(maxWear, currentWear + wearPerUse * uses);
            player.Inventory[player.SelectedHotbarSlot] = item with { Metadata = $"wear:{newWear}" };
        },
        (_playerName, _radius) => 0,
        (playerName) => { gameServer.Weather.SetWeather(WeatherType.None); },
        (playerName) => { gameServer.Weather.SetWeather(WeatherType.Rain); },
        (playerName) => { gameServer.Weather.SetWeather(WeatherType.Snow); },
        (playerName) => { gameServer.Weather.SetWeather(WeatherType.Thunderstorm); });
});
builder.Services.AddSingleton<CraftingSystem>(sp =>
{
    var crafting = new CraftingSystem();
    var dataPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "data", "items.json");
    if (!File.Exists(dataPath))
        dataPath = Path.Combine(Directory.GetCurrentDirectory(), "data", "items.json");
    crafting.LoadRecipes(dataPath);
    return crafting;
});
builder.Services.AddSingleton<GridCraftingSystem>(sp =>
{
    var gridCrafting = new GridCraftingSystem();
    var gridDataPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "data", "items.json");
    if (!File.Exists(gridDataPath))
        gridDataPath = Path.Combine(Directory.GetCurrentDirectory(), "data", "items.json");
    gridCrafting.LoadRecipes(gridDataPath);
    return gridCrafting;
});
builder.Services.AddSingleton<EntityManager>(sp =>
{
    var config = sp.GetRequiredService<ServerConfig>();
    return new EntityManager(config.Entities.MaxEntities);
});
builder.Services.AddSingleton<ServerProfiler>();
builder.Services.AddHostedService<GameLoopService>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(serverConfig.CorsOrigins)
              .WithHeaders("Content-Type", "Authorization", "X-Requested-With")
              .WithMethods("GET", "POST", "OPTIONS")
              .AllowCredentials();
    });
});

if (serverConfig.Security.MaxConcurrentConnections > 0)
{
    builder.WebHost.ConfigureKestrel(options =>
    {
        options.Limits.MaxConcurrentConnections = (long)serverConfig.Security.MaxConcurrentConnections;
    });
}

var app = builder.Build();

if (!app.Environment.IsDevelopment() && serverConfig.Security.EnableHttpsRedirection)
{
    app.UseHttpsRedirection();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.Use(async (context, next) =>
{
    var authService = context.RequestServices.GetRequiredService<AuthenticationService>();
    var ip = context.Connection.RemoteIpAddress?.ToString();
    if (ip != null && authService.IsConnectionRateLimited(ip))
    {
        context.Response.StatusCode = 429;
        return;
    }
    await next();
});

var clientDistPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "client", "dist");
if (!Directory.Exists(clientDistPath))
    clientDistPath = Path.Combine(Directory.GetCurrentDirectory(), "client", "dist");
if (Directory.Exists(clientDistPath))
{
    var fileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(clientDistPath);
    var contentTypeProvider = new FileExtensionContentTypeProvider();
    contentTypeProvider.Mappings[".wasm"] = "application/wasm";
    contentTypeProvider.Mappings[".json"] = "application/json";
    contentTypeProvider.Mappings[".png"] = "image/png";
    contentTypeProvider.Mappings[".jpg"] = "image/jpeg";
    contentTypeProvider.Mappings[".svg"] = "image/svg+xml";
    app.UseDefaultFiles(new DefaultFilesOptions { FileProvider = fileProvider });
    app.UseStaticFiles(new StaticFileOptions { FileProvider = fileProvider, ContentTypeProvider = contentTypeProvider });
}
app.Use(async (context, next) =>
{
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    context.Response.Headers["X-Frame-Options"] = "DENY";
    context.Response.Headers["X-XSS-Protection"] = "1; mode=block";
    context.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    context.Response.Headers["Cross-Origin-Opener-Policy"] = "same-origin";
    context.Response.Headers["Cross-Origin-Resource-Policy"] = "same-origin";
    if (!app.Environment.IsDevelopment())
        context.Response.Headers["Strict-Transport-Security"] = $"max-age={serverConfig.Security.HstsMaxAge}; includeSubDomains";
    var cspNonce = Convert.ToBase64String(System.Security.Cryptography.RandomNumberGenerator.GetBytes(serverConfig.Security.CspNonceSize));
    context.Items["CspNonce"] = cspNonce;
    context.Response.Headers["Content-Security-Policy"] =
        "default-src 'self'; " +
        "script-src 'self'; " +
        $"style-src 'self' 'nonce-{cspNonce}'; " +
        "img-src 'self' data: blob:; " +
        $"connect-src 'self' wss: {string.Join(' ', serverConfig.CorsOrigins.Where(o => IsValidOrigin(o)))}; " +
        "media-src 'self' blob:; " +
        "font-src 'self'; " +
        "object-src 'none'; " +
        "frame-ancestors 'none'; " +
        "base-uri 'self'";
    context.Response.Headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()";
    await next();
});
app.MapControllers();
app.MapHub<GameHub>("/game");

app.MapGet("/api/status", (GameServer server) => new
{
    online = server.OnlinePlayerCount,
    maxPlayers = server.MaxPlayers,
    isRunning = server.IsRunning
});

app.MapGet("/api/profiler", (ServerProfiler profiler, ServerConfig cfg, HttpContext context) =>
{
    var secret = context.Request.Headers["X-Profiler-Secret"].FirstOrDefault() ?? string.Empty;
    if (string.IsNullOrEmpty(cfg.Security.ProfilerSecret)
        || string.IsNullOrEmpty(secret)
        || !CryptographicOperationsEqual(secret, cfg.Security.ProfilerSecret))
        return Results.Unauthorized();
    return Results.Ok(profiler.GetSnapshot());
});
app.MapGet("/api/profiler/report", (ServerProfiler profiler, ServerConfig cfg, HttpContext context) =>
{
    var secret = context.Request.Headers["X-Profiler-Secret"].FirstOrDefault() ?? string.Empty;
    if (string.IsNullOrEmpty(cfg.Security.ProfilerSecret)
        || string.IsNullOrEmpty(secret)
        || !CryptographicOperationsEqual(secret, cfg.Security.ProfilerSecret))
        return Results.Unauthorized();
    return Results.Ok(profiler.FormatReport());
});

if (Directory.Exists(clientDistPath))
{
    var fileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(clientDistPath);
    app.MapFallbackToFile("index.html", new Microsoft.AspNetCore.Builder.StaticFileOptions
    {
        FileProvider = fileProvider
    });
}

var gameServer = app.Services.GetRequiredService<GameServer>();
var hubContext = app.Services.GetRequiredService<IHubContext<GameHub, IGameClient>>();
gameServer.SetHubContext(hubContext);
gameServer.Start();

var areaProtection = app.Services.GetRequiredService<AreaProtectionSystem>();
var protectionLoadPath = Path.Combine(dataDir, "protection");
await areaProtection.LoadProtection(protectionLoadPath);

var authService = app.Services.GetRequiredService<AuthenticationService>();
var banDatabase = app.Services.GetRequiredService<BanDatabase>();
authService.SetBanDatabase(banDatabase);

var privilegeSystem = app.Services.GetRequiredService<PrivilegeSystem>();
var privilegeSavePath = Path.Combine(dataDir, "player_privileges.json");
privilegeSystem.SetSavePath(privilegeSavePath);

var itemsDataPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "data", "items.json");
if (!File.Exists(itemsDataPath))
    itemsDataPath = Path.Combine(Directory.GetCurrentDirectory(), "data", "items.json");
gameServer.LoadFoodValues(itemsDataPath);

var worldDataPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "data", "worlds", "default");
if (!Directory.Exists(worldDataPath))
    worldDataPath = Path.Combine(Directory.GetCurrentDirectory(), "data", "worlds", "default");
Directory.CreateDirectory(worldDataPath);
gameServer.DefaultWorld.Load(worldDataPath);
gameServer.LoadEntities(worldDataPath);

var shutdownCts = new CancellationTokenSource();
app.Lifetime.ApplicationStopping.Register(() =>
{
    shutdownCts.Cancel();
    gameServer.SaveAllMetadata();
    foreach (var player in gameServer.OnlinePlayers)
    {
        var playerDb = app.Services.GetRequiredService<PlayerDatabase>();
        playerDb.SavePlayer(player);
    }
    gameServer.DefaultWorld.Save(worldDataPath);
    gameServer.SaveEntities(worldDataPath);
    privilegeSystem.Save();
    var areaProtection = app.Services.GetRequiredService<AreaProtectionSystem>();
    var protectionSavePath = Path.Combine(dataDir, "protection");
    try
    {
        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(10));
        areaProtection.SaveProtection(protectionSavePath).GetAwaiter().GetResult();
    }
    catch (OperationCanceledException) { }
    catch (AggregateException) { }
    catch (Exception) { }
    gameServer.Stop();
});

app.Run();
