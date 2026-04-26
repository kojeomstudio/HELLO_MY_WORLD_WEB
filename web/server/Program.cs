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
using WebGameServer.Services;

using WebGameServer.Core.Inventory;
using WebGameServer.Core.Particles;
using WebGameServer.Core.Rollback;
using WebGameServer.Core.Sound;

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

var dataPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "data");
if (!Directory.Exists(dataPath))
    dataPath = Path.Combine(Directory.GetCurrentDirectory(), "data");
serverConfig.Physics.LoadFromFile(dataPath);

var mobsPath = Path.Combine(dataPath, "mobs.json");
MobConfig.LoadFromFile(mobsPath);

var toolsPath = Path.Combine(dataPath, "tools.json");
ToolConfig.LoadFromFile(toolsPath);

builder.Services.AddSingleton(serverConfig);

builder.Services.AddSignalR();
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

    system.Register(new ActiveBlockModifier
    {
        Name = "sand_falling",
        Interval = 2,
        Chance = 1.0f,
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
        Interval = 2,
        Chance = 1.0f,
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
        Interval = 20,
        Chance = 0.1f,
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
        Interval = 30,
        Chance = 0.05f,
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
        Interval = 3,
        Chance = 0.3f,
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
                            if (Random.Shared.NextSingle() < 0.15f)
                            {
                                world.SetBlock(nPos, new Block(BlockType.Fire));
                            }
                        }
                    }
                }
            }

            if (Random.Shared.NextSingle() < 0.2f)
            {
                world.SetBlock(pos, Block.Air);
            }
            return true;
        }
    });

    system.Register(new ActiveBlockModifier
    {
        Name = "cactus_growth",
        Interval = 40,
        Chance = 0.2f,
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

            if (height < 3)
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
        Interval = 40,
        Chance = 0.2f,
        Action = (blockDef, pos, world) =>
        {
            if (blockDef.Name != "sugar_cane") return false;
            var above = new Vector3s(pos.X, (short)(pos.Y + 1), pos.Z);
            if (world.GetBlock(above).Type != BlockType.Air) return false;

            bool hasWater = false;
            for (int dx = -4; dx <= 4 && !hasWater; dx++)
            {
                for (int dz = -4; dz <= 4 && !hasWater; dz++)
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

            if (height < 3)
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
        Interval = 60,
        Chance = 0.05f,
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

    return system;
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
builder.Services.AddSingleton<RollbackSystem>();
builder.Services.AddSingleton<ProtectionSystem>();
builder.Services.AddSingleton<RedstoneSystem>();
builder.Services.AddSingleton<FishingSystem>();
builder.Services.AddSingleton<BreedingSystem>();
builder.Services.AddSingleton<SoundSpecManager>();
builder.Services.AddSingleton<DetachedInventoryManager>();

var playerDbPath = Path.Combine(dataDir, "players.db");
var blockMetaDbPath = Path.Combine(dataDir, "blockmeta.db");

builder.Services.AddSingleton(new PlayerDatabase(playerDbPath));
builder.Services.AddSingleton(new BlockMetadataDatabase(blockMetaDbPath));
builder.Services.AddSingleton<GameServer>();
builder.Services.AddSingleton<AuthenticationService>();
builder.Services.AddSingleton<ChatCommandManager>(sp =>
{
    var gameServer = sp.GetRequiredService<GameServer>();
    var authService = sp.GetRequiredService<AuthenticationService>();
    var privilegeSystem = sp.GetRequiredService<PrivilegeSystem>();
    var entityManager = sp.GetRequiredService<EntityManager>();
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
        (from, to, msg) => gameServer.SendPrivateMessage(from, to, msg));
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
builder.Services.AddSingleton<EntityManager>();
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

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

var clientDistPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "client", "dist");
if (!Directory.Exists(clientDistPath))
    clientDistPath = Path.Combine(Directory.GetCurrentDirectory(), "client", "dist");
if (Directory.Exists(clientDistPath))
{
    var fileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(clientDistPath);
    app.UseDefaultFiles(new DefaultFilesOptions { FileProvider = fileProvider });
    app.UseStaticFiles(new StaticFileOptions { FileProvider = fileProvider, ServeUnknownFileTypes = true });
}
app.Use(async (context, next) =>
{
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    context.Response.Headers["X-Frame-Options"] = "DENY";
    context.Response.Headers["X-XSS-Protection"] = "1; mode=block";
    context.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
    context.Response.Headers["Content-Security-Policy"] =
        "default-src 'self'; " +
        "script-src 'self'; " +
        "style-src 'self' 'unsafe-inline'; " +
        "img-src 'self' data: blob:; " +
        $"connect-src 'self' ws: wss: {string.Join(' ', serverConfig.CorsOrigins)}; " +
        "media-src 'self' blob:; " +
        "font-src 'self'; " +
        "object-src 'none'; " +
        "base-uri 'self'";
    context.Response.Headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()";
    await next();
});
app.UseAuthorization();
app.MapControllers();
app.MapHub<GameHub>("/game");

app.MapGet("/api/status", (GameServer server) => new
{
    online = server.OnlinePlayerCount,
    maxPlayers = server.MaxPlayers,
    isRunning = server.IsRunning
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

app.Lifetime.ApplicationStopping.Register(() =>
{
    gameServer.SaveAllMetadata();
    gameServer.DefaultWorld.Save(worldDataPath);
    privilegeSystem.Save();
    gameServer.Stop();
});

app.Run();
