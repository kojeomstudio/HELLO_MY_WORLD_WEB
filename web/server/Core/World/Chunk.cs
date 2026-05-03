using System.Buffers;
using WebGameServer.Core.World;

public class Chunk
{
    public const int Size = 16;
    public const int BlockCount = Size * Size * Size;

    private readonly Block[,,] _blocks = new Block[Size, Size, Size];
    private readonly ChunkCoord _coord;
    private bool _isDirty;
    private bool _monoBlockChecked;
    private bool _isMonoBlock;

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
        _isDirty = false;
        _monoBlockChecked = false;
        _isMonoBlock = false;
    }

    public Block GetBlock(int x, int y, int z) => _blocks[x, y, z];

    public void SetBlock(int x, int y, int z, Block block)
    {
        _blocks[x, y, z] = block;
        _isDirty = true;
        _monoBlockChecked = false;
    }

    public ChunkCoord Coord => _coord;
    public bool IsDirty => _isDirty;
    public void MarkClean() => _isDirty = false;

    public bool IsMonoBlock
    {
        get
        {
            if (!_monoBlockChecked)
            {
                _monoBlockChecked = true;
                _isMonoBlock = CheckMonoBlock();
            }
            return _isMonoBlock;
        }
    }

    private bool CheckMonoBlock()
    {
        var first = _blocks[0, 0, 0];
        for (int x = 0; x < Size; x++)
        {
            for (int y = 0; y < Size; y++)
            {
                for (int z = 0; z < Size; z++)
                {
                    var b = _blocks[x, y, z];
                    if (b.Type != first.Type || b.Param1 != first.Param1 ||
                        b.Param2 != first.Param2 || b.Light != first.Light)
                    {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    public byte[] Serialize()
    {
        if (IsMonoBlock)
        {
            var block = _blocks[0, 0, 0];
            return new byte[]
            {
                (byte)block.Type, block.Param1, block.Param2, block.Light,
                0xFF
            };
        }

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
        if (data.Length == 5 && data[4] == 0xFF)
        {
            var block = new Block
            {
                Type = (BlockType)data[0],
                Param1 = data[1],
                Param2 = data[2],
                Light = data[3]
            };
            for (int x = 0; x < Size; x++)
            {
                for (int y = 0; y < Size; y++)
                {
                    for (int z = 0; z < Size; z++)
                    {
                        _blocks[x, y, z] = block;
                    }
                }
            }
            _monoBlockChecked = true;
            _isMonoBlock = true;
            _isDirty = false;
            return;
        }

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
        _monoBlockChecked = false;
        _isDirty = false;
    }
}
