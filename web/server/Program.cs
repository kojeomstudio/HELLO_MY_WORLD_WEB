using WebGameServer.Core;
using WebGameServer.Core.Auth;
using WebGameServer.Core.Chat;
using WebGameServer.Core.Crafting;
using WebGameServer.Core.Entities;
using WebGameServer.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();
builder.Services.AddSingleton<GameServer>();
builder.Services.AddSingleton<AuthenticationService>();
builder.Services.AddSingleton<ChatCommandManager>();
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
gameServer.Start();

app.Lifetime.ApplicationStopping.Register(() => gameServer.Stop());

app.Run();
