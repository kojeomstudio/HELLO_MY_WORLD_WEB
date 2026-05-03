using WebGameServer.Core.Game;

namespace WebGameServer.Core.World;

public class LiquidSimulator
{
    private const byte MaxLiquidLevel = 8;

    private static readonly (short Dx, short Dz)[] HorizontalDirections =
    {
        (0, 1), (0, -1), (1, 0), (-1, 0)
    };

    private readonly World _world;
    private readonly BlockDefinitionManager _blockDefs;

    public LiquidSimulator(World world, BlockDefinitionManager blockDefs)
    {
        _world = world;
        _blockDefs = blockDefs;
    }

    public void Update(int tickCount)
    {
    }
}
