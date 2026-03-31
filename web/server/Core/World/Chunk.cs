using System.Buffers;
using WebGameServer.Core.World;

public class Chunk
{
    public const int Size = 16;
    public const int BlockCount = Size * Size * Size;

    private readonly Block[,,] _blocks = new Block[Size, Size, Size];
    private readonly ChunkCoord _coord;

    public Chunk(ChunkCoord coord)
    {
        _coord = coord;
        Initialize();
    }

    private void Initialize()
    {
        for (int x = 0; x < Size; x++)
        {
            for (int y = 0; y < Size; y++)
            {
                for (int z = 0; z < Size; z++)
                {
                    _blocks[x, y, z] = new Block(BlockType.Air, 0, 0, 0);
                }
            }
        }
    }

    public Block GetBlock(int x, int y, int z) => _blocks[x, y, z];
    public void SetBlock(int x, int y, int z, Block block) => _blocks[x, y, z] = block;

    public ChunkCoord Coord => _coord;

    public byte[] Serialize()
    {
        var size = Size * Size * Size * 4;
        var buffer = new byte[size];
        var offset = 0;

        for (int x = 0; x < Size; x++)
        {
            for (int y = 0; y < Size; y++)
            {
                for (int z = 0; z < Size; z++)
                {
                    var block = _blocks[x, y, z];
                    buffer[offset++] = (byte)block.Type;
                    buffer[offset++] = block.Param1;
                    buffer[offset++] = block.Param2;
                    buffer[offset++] = block.Light;
                }
            }
        }

        return buffer;
    }

    public void Deserialize(byte[] data)
    {
        if (data.Length != Size * Size * Size * 4)
            throw new ArgumentException("Invalid chunk data size");

        var offset = 0;
        for (int x = 0; x < Size; x++)
        {
            for (int y = 0; y < Size; y++)
            {
                for (int z = 0; z < Size; z++)
                {
                    _blocks[x, y, z] = new Block
                    {
                        Type = (BlockType)data[offset++],
                        Param1 = data[offset++],
                        Param2 = data[offset++],
                        Light = data[offset++]
                    };
                }
            }
        }
    }
}
