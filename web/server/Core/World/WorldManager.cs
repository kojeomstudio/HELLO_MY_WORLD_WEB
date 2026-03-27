using System.Collections.Concurrent;
using WebGameServer.Core.World;
using WebGameServer.Core.World.Generators;

namespace WebGameServer.Core.World;

public class WorldManager
{
    private readonly ConcurrentDictionary<string, World> _worlds = new();
    private readonly WorldGeneratorFactory _generatorFactory;

    public WorldManager(WorldGeneratorFactory generatorFactory)
    {
        _generatorFactory = generatorFactory;
    }

    public World CreateWorld(string name, int seed, string generatorType)
    {
        var generator = _generatorFactory.Create(generatorType);
        var world = new World(name, seed, generator);
        _worlds.TryAdd(name, world);
        return world;
    }

    public World? GetWorld(string name)
    {
        return _worlds.TryGetValue(name, out var world) ? world : null;
    }

    public bool DeleteWorld(string name)
    {
        return _worlds.TryRemove(name, out _);
    }

    public IEnumerable<string> GetWorldNames() => _worlds.Keys;
}
