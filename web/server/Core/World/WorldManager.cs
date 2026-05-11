using System.Collections.Concurrent;
using System.Text.Json;
using WebGameServer.Core.World.Generators;

namespace WebGameServer.Core.World;

public class WorldManager
{
    private readonly ConcurrentDictionary<string, World> _worlds = new();
    private readonly WorldGeneratorFactory _generatorFactory;
    private string? _defaultWorldName;

    public WorldManager(WorldGeneratorFactory generatorFactory)
    {
        _generatorFactory = generatorFactory;
    }

    public World CreateWorld(string name, int seed, string generatorType, string? dataPath = null)
    {
        var generator = _generatorFactory.Create(generatorType);
        if (dataPath == null)
        {
            dataPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "data");
            if (!Directory.Exists(dataPath))
                dataPath = Path.Combine(Directory.GetCurrentDirectory(), "data");
        }
        generator.LoadBiomes(dataPath);
        var world = new World(name, seed, generator);
        _worlds.TryAdd(name, world);
        return world;
    }

    public World CreateDefaultWorld(int seed, string generatorType, string? dataPath = null)
    {
        _defaultWorldName = "default";
        var world = CreateWorld("default", seed, generatorType, dataPath);
        return world;
    }

    public World? GetWorld(string name)
    {
        return _worlds.TryGetValue(name, out var world) ? world : null;
    }

    public World? GetDefaultWorld()
    {
        return _defaultWorldName != null ? GetWorld(_defaultWorldName) : null;
    }

    public bool DeleteWorld(string name)
    {
        if (name == _defaultWorldName) return false;
        return _worlds.TryRemove(name, out _);
    }

    public IEnumerable<string> GetWorldNames() => _worlds.Keys;

    public int WorldCount => _worlds.Count;

    public void SaveAll(string basePath)
    {
        foreach (var (name, world) in _worlds)
        {
            var worldPath = Path.Combine(basePath, name);
            Directory.CreateDirectory(worldPath);
            world.Save(worldPath);
        }
    }

    public void LoadWorld(string name, string dataPath)
    {
        var worldPath = Path.Combine(dataPath, name);
        if (!Directory.Exists(worldPath)) return;
        if (_worlds.TryGetValue(name, out var world))
        {
            world.Load(worldPath);
        }
    }
}
