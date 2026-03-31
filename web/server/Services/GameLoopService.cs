using Microsoft.AspNetCore.SignalR;
using WebGameServer.Core;
using WebGameServer.Core.Entities;
using WebGameServer.Core.World;

namespace WebGameServer.Services;

public class GameLoopService : BackgroundService
{
    private readonly GameServer _gameServer;
    private readonly EntityManager _entityManager;
    private readonly IHubContext<GameHub, IGameClient> _hub;
    private readonly ILogger<GameLoopService> _logger;

    private int _tickCount;
    private int _previousEntityCount;
    private DateTime _lastTickTime;
    private int _tpsFrameCount;
    private float _currentTps;

    private const int TimeBroadcastInterval = 100;

    public GameLoopService(
        GameServer gameServer,
        EntityManager entityManager,
        IHubContext<GameHub, IGameClient> hub,
        ILogger<GameLoopService> logger)
    {
        _gameServer = gameServer;
        _entityManager = entityManager;
        _hub = hub;
        _logger = logger;
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
            _entityManager.UpdateAll(1.0f / _gameServer.TickRate);

            _tickCount++;

            if (_tickCount % TimeBroadcastInterval == 0)
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

            TrackTps(now);

            await Task.Delay(interval, stoppingToken);
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
