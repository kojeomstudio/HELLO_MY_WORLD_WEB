using WebGameServer.Core.World;
using WebGameServer.Core.World.Generators;

namespace WebGameServer.Core.World;

public class WorldGeneratorFactory
{
    private readonly Dictionary<string, Func<IWorldGenerator>> _generators = new();

    public WorldGeneratorFactory()
    {
        Register("flat", () => new FlatWorldGenerator());
        Register("noise", () => new NoiseWorldGenerator());
        Register("v5", () => new MapgenV5());
        Register("v7", () => new NoiseWorldGenerator());
        Register("fractal", () => new MapgenFractal());
        Register("singlenode", () => new MapgenSinglenode());
    }

    public void Register(string name, Func<IWorldGenerator> factory)
    {
        _generators[name] = factory;
    }

    public IWorldGenerator Create(string name)
    {
        if (_generators.TryGetValue(name, out var factory))
            return factory();
        return new NoiseWorldGenerator();
    }

    public IEnumerable<string> GetAvailableGenerators() => _generators.Keys;
}
