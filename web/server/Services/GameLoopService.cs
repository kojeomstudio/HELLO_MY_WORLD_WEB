using Microsoft.AspNetCore.SignalR;
using WebGameServer.Core;
using WebGameServer.Core.Entities;
using WebGameServer.Core.Game;
using WebGameServer.Core.Player;
using WebGameServer.Core.World;
using PlayerEnt = WebGameServer.Core.Player.Player;

namespace WebGameServer.Services;

public class GameLoopService : BackgroundService
{
    private readonly GameServer _gameServer;
    private readonly EntityManager _entityManager;
    private readonly IHubContext<GameHub, IGameClient> _hub;
    private readonly ILogger<GameLoopService> _logger;
    private readonly BlockDefinitionManager _blockDefinitionManager;
    private readonly ServerConfig _config;

    private int _tickCount;
    private int _previousEntityCount;
    private DateTime _lastTickTime;
    private int _tpsFrameCount;
    private float _currentTps;
    private const int AutoSaveIntervalSeconds = 300;
    private const int FallingBlockInterval = 10;

    public GameLoopService(
        GameServer gameServer,
        EntityManager entityManager,
        IHubContext<GameHub, IGameClient> hub,
        ILogger<GameLoopService> logger,
        BlockDefinitionManager blockDefinitionManager,
        ServerConfig config)
    {
        _gameServer = gameServer;
        _entityManager = entityManager;
        _hub = hub;
        _logger = logger;
        _blockDefinitionManager = blockDefinitionManager;
        _config = config;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Game loop service started");
        Entity.WorldReference = _gameServer.DefaultWorld;
        var interval = TimeSpan.FromMilliseconds(1000.0 / _gameServer.TickRate);
        _lastTickTime = DateTime.UtcNow;

        while (!stoppingToken.IsCancellationRequested)
        {
            var now = DateTime.UtcNow;

            _gameServer.Update();

            await ProcessItemPickups();

            _tickCount++;

            if (_tickCount % _config.Network.TimeBroadcastInterval == 0)
            {
                try
                {
                    await _hub.Clients.All.OnTimeUpdate(
                        _gameServer.GameTime,
                        _gameServer.TimeSpeed,
                        _gameServer.DayNight.SkyBrightness);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to broadcast time update");
                }
            }

            await BroadcastEntityEvents();

            if (_tickCount % FallingBlockInterval == 0)
            {
                await ProcessFallingBlocks();
            }

            CheckAutoSave();

            TrackTps(now);

            await Task.Delay(interval, stoppingToken);
        }
    }

    private async Task ProcessItemPickups()
    {
        var itemEntities = _entityManager.GetByType<ItemEntity>()
            .Where(e => e.IsAlive)
            .ToList();

        var players = _gameServer.OnlinePlayers.ToList();

        foreach (var item in itemEntities)
        {
            foreach (var player in players)
            {
                if (player.IsDead) continue;

                var distance = Vector3.Distance(item.Position, player.Position);
                if (distance > _config.Physics.PickupRange) continue;

                var stack = new ItemStack(item.ItemId, item.Count, item.Metadata);
                if (!player.Inventory.AddItem(stack)) continue;

                _entityManager.Remove(item.Id);

                try
                {
                    await _hub.Clients.Client(player.ConnectionId).OnEntityDespawned(item.Id);
                    await _hub.Clients.Client(player.ConnectionId).OnInventoryUpdate(
                        player.Inventory.GetAll()
                            .Select(i => i == null ? null : (object)new { itemId = i.ItemId, count = i.Count, metadata = i.Metadata })
                            .ToArray()!);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to send pickup update to player {PlayerName}", player.Name);
                }

                break;
            }
        }
    }

    private async Task BroadcastEntityEvents()
    {
        var currentCount = _entityManager.Count;
        var newEntities = new List<Entity>();

        if (currentCount > _previousEntityCount)
        {
            try
            {
                var allEntities = _entityManager.GetByType<Entity>()
                    .Where(e => e.IsAlive)
                    .ToList();

                newEntities = allEntities
                    .Skip(Math.Max(0, allEntities.Count - (currentCount - _previousEntityCount)))
                    .ToList();

                if (newEntities.Count > 0)
                {
                    foreach (var entity in newEntities)
                    {
                        await _hub.Clients.All.OnEntitySpawned(
                            entity.Id,
                            entity.Type.ToString().ToLowerInvariant(),
                            entity.Position.X,
                            entity.Position.Y,
                            entity.Position.Z);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to broadcast entity spawn events");
            }
        }

        try
        {
            var updatedEntities = _entityManager.GetByType<Entity>()
                .Where(e => e.IsAlive && newEntities.All(ne => ne.Id != e.Id))
                .ToList();

            foreach (var entity in updatedEntities)
            {
                await _hub.Clients.All.OnEntityUpdate(
                    entity.Id,
                    entity.Position.X,
                    entity.Position.Y,
                    entity.Position.Z);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to broadcast entity update events");
        }

        _previousEntityCount = currentCount;
    }

    private async Task ProcessFallingBlocks()
    {
        var world = _gameServer.DefaultWorld;
        var fallingBlocks = world.GetPendingFallingBlocks(_blockDefinitionManager);

        foreach (var (from, to, blockType) in fallingBlocks)
        {
            world.SetBlock(from, Block.Air);
            world.SetBlock(to, new Block(blockType));

            try
            {
                await _hub.Clients.All.OnFallingBlock(
                    from.X, from.Y, from.Z,
                    to.X, to.Y, to.Z,
                    (ushort)blockType);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to broadcast falling block");
            }
        }
    }

    private void CheckAutoSave()
    {
        var world = _gameServer.DefaultWorld;
        if (world.NeedsSave && DateTime.UtcNow - world.LastSaveTime > TimeSpan.FromSeconds(AutoSaveIntervalSeconds))
        {
            try
            {
                var worldDataPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "data", "worlds", "default");
                if (!Directory.Exists(worldDataPath))
                    worldDataPath = Path.Combine(Directory.GetCurrentDirectory(), "data", "worlds", "default");
                world.Save(worldDataPath);
                _logger.LogInformation("World auto-saved successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to auto-save world");
            }
        }
    }

    private void TrackTps(DateTime now)
    {
        _tpsFrameCount++;
        var elapsed = (float)(now - _lastTickTime).TotalSeconds;

        if (elapsed >= 1.0f)
        {
            _currentTps = _tpsFrameCount / elapsed;
            _tpsFrameCount = 0;
            _lastTickTime = now;

            if (_currentTps < _gameServer.TickRate - 2)
            {
                _logger.LogWarning("Server running behind: {Tps:F1} TPS (target: {Target})",
                    _currentTps, _gameServer.TickRate);
            }
        }
    }
}
