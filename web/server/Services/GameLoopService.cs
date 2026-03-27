using WebGameServer.Core;
using WebGameServer.Core.Entities;

namespace WebGameServer.Services;

public class GameLoopService : BackgroundService
{
    private readonly GameServer _gameServer;
    private readonly EntityManager _entityManager;
    private readonly ILogger<GameLoopService> _logger;

    public GameLoopService(GameServer gameServer, EntityManager entityManager, ILogger<GameLoopService> logger)
    {
        _gameServer = gameServer;
        _entityManager = entityManager;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Game loop service started");
        var interval = TimeSpan.FromMilliseconds(1000.0 / _gameServer.TickRate);

        while (!stoppingToken.IsCancellationRequested)
        {
            var now = DateTime.UtcNow;

            _gameServer.Update();
            _entityManager.UpdateAll(1.0f / _gameServer.TickRate);

            await Task.Delay(interval, stoppingToken);
        }
    }
}
