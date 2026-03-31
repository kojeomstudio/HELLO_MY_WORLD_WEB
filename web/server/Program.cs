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
using WebGameServer.Services;

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
builder.Services.AddSingleton<PrivilegeSystem>();
builder.Services.AddSingleton<ActiveBlockModifierSystem>();
builder.Services.AddSingleton<KnockbackSystem>();
builder.Services.AddSingleton<GameServer>();
builder.Services.AddSingleton<AuthenticationService>();
builder.Services.AddSingleton<ChatCommandManager>(sp =>
{
    var gameServer = sp.GetRequiredService<GameServer>();
    return new ChatCommandManager(
        () => gameServer.GameTime,
        () => gameServer.TickRate,
        (playerName, mode) => { gameServer.SetGameMode(playerName, mode); },
        (playerName, pos) => { gameServer.TeleportPlayer(playerName, pos); },
        (playerName, targetPlayer, itemId, count) => { gameServer.GiveItem(targetPlayer, itemId, count); });
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
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "*")
              .AllowAnyHeader()
              .AllowAnyMethod()
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
app.UseAuthorization();
app.MapControllers();
app.MapHub<GameHub>("/game");

app.MapGet("/api/status", (GameServer server) => new
{
    online = server.OnlinePlayerCount,
    maxPlayers = server.MaxPlayers,
    isRunning = server.IsRunning,
    worldSeed = server.DefaultWorld.Seed
});

var gameServer = app.Services.GetRequiredService<GameServer>();
var hubContext = app.Services.GetRequiredService<IHubContext<GameHub, IGameClient>>();
gameServer.SetHubContext(hubContext);
gameServer.Start();

app.Lifetime.ApplicationStopping.Register(() => gameServer.Stop());

app.Run();
