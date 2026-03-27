namespace WebGameServer.Core.World;

public class Block
{
    public static Block Air => new(BlockType.Air);
    public static Block Stone => new(BlockType.Stone);
    public static Block Dirt => new(BlockType.Dirt);
    public static Block Grass => new(BlockType.Grass);
    public static Block Water => new(BlockType.Water);

    public BlockType Type { get; set; }
    public byte Param1 { get; set; }
    public byte Param2 { get; set; }
    public byte Light { get; set; }

    public Block()
    {
        Type = BlockType.Air;
        Param1 = 0;
        Param2 = 0;
        Light = 15;
    }

    public Block(BlockType type, byte param1 = 0, byte param2 = 0, byte light = 15)
    {
        Type = type;
        Param1 = param1;
        Param2 = param2;
        Light = light;
    }

    public ushort ToUInt16()
    {
        return (ushort)((ushort)Type << 8 | Param1);
    }
}
