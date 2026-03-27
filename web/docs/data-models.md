# Data Models

## Block Types

| ID | Name | Properties |
|----|------|------------|
| 0 | Air | Transparent, Non-solid |
| 1 | Stone | Solid |
| 2 | Dirt | Solid |
| 3 | Grass | Solid |
| 4 | Water | Transparent, Liquid |
| 5 | Sand | Solid |
| 6 | Wood | Solid |
| 7 | Leaves | Transparent, Solid |
| 8 | Glass | Transparent, Solid |
| 9 | Brick | Solid |
| 10 | Ore | Solid |
| 11 | Coal | Solid |
| 12 | Bedrock | Solid, Unbreakable |
| 13 | Snow | Solid |
| 14 | Ice | Transparent, Solid |
| 15 | Lava | Transparent, Liquid, Damage: 4 |
| 16 | Torch | Transparent, Light: 14 |
| 17 | Ladder | Transparent |
| 18 | Fence | Transparent, Solid |
| 19 | Door | Transparent, Interactive |
| 20 | Chest | Interactive |
| 21 | Crafting Table | Interactive |
| 22 | Furnace | Interactive |

## Player States

```csharp
public enum PlayerState {
    Connecting,    // Initial connection
    Connected,     // Authenticated
    Playing,       // Active in world
    Disconnected   // Connection closed
}
```

## Game Modes

```csharp
public enum GameMode {
    Survival,    // Standard gameplay
    Creative,    // Unlimited resources
    Adventure,   // Restricted interactions
    Spectator    // Observer only
}
```

## Vector Types

### Vector3 (Float)
3D floating-point vector for positions and velocities.

```csharp
public readonly struct Vector3 {
    float X, Y, Z;
    
    // Static values
    static Vector3 Zero   => (0, 0, 0)
    static Vector3 One    => (1, 1, 1)
    static Vector3 UnitX  => (1, 0, 0)
    static Vector3 UnitY  => (0, 1, 0)
    static Vector3 UnitZ  => (0, 0, 1)
    
    // Operations
    float Length
    Vector3 Normalized
    static float Distance(Vector3 a, Vector3 b)
    static float Dot(Vector3 a, Vector3 b)
    static Vector3 Cross(Vector3 a, Vector3 b)
}
```

### Vector3s (Short)
3D short vector for block coordinates.

```csharp
public readonly struct Vector3s {
    short X, Y, Z;
}
```

## Inventory System

### ItemStack
Represents a stackable item instance.

```csharp
public record ItemStack(
    string ItemId,     // Item identifier
    int Count,         // Stack count (max 64)
    string? Metadata   // Optional NBT-like data
);
```

### Inventory
Player inventory container.

```csharp
public class Inventory {
    int Size { get; }         // Total slots (default: 32)
    int HotbarSize { get; }   // Hotbar slots (8)
    
    ItemStack? this[int index] { get; set; }
    
    bool AddItem(ItemStack item);
    ItemStack? RemoveItem(int index, int count = 1);
    void Clear();
    ItemStack?[] GetAll();
}
```

## Chunk Data

### ChunkCoord
Chunk coordinate identifier.

```csharp
public struct ChunkCoord {
    int X, Y, Z;
    
    static ChunkCoord FromBlockCoord(Vector3s blockCoord);
}
```

### Chunk
16³ block container.

```csharp
public class Chunk {
    const int Size = 16;           // 16 blocks per axis
    const int BlockCount = 4096;   // 16³ total blocks
    
    ChunkCoord Coord { get; }
    
    Block GetBlock(int x, int y, int z);
    void SetBlock(int x, int y, int z, Block block);
    
    byte[] Serialize();     // 16384 bytes
    void Deserialize(byte[] data);
}
```

### Block
Single block data.

```csharp
public class Block {
    BlockType Type;    // Block identifier
    byte Param1;       // Metadata 1
    byte Param2;       // Metadata 2
    byte Light;        // Light level (0-15)
    
    ushort ToUInt16(); // (Type << 8) | Param1
    
    // Presets
    static Block Air;
    static Block Stone;
    static Block Dirt;
    static Block Grass;
    static Block Water;
}
```

## Configuration Schema

### server_config.json
```typescript
interface ServerConfig {
    server: {
        name: string;
        version: string;
        maxPlayers: number;
        tickRate: number;
        port: number;
    };
    world: {
        defaultGenerator: string;
        chunkSize: number;
        renderDistance: number;
        worldSeed: number;
    };
    player: {
        defaultHealth: number;
        defaultBreath: number;
        respawnHealth: number;
        inventorySize: number;
        hotbarSize: number;
    };
    physics: {
        gravity: number;
        jumpForce: number;
        walkSpeed: number;
        sprintSpeed: number;
        flySpeed: number;
    };
}
```

### blocks.json
```typescript
interface BlockDefinition {
    name: string;
    solid: boolean;
    transparent: boolean;
    color: string;        // Hex color
    liquid?: boolean;
    breakable?: boolean;
    damage?: number;
    light?: number;
    interactive?: boolean;
}
```

### items.json
```typescript
interface ItemDefinition {
    name: string;
    type: "tool" | "weapon" | "food" | "resource" | "material" | "block";
    durability?: number;
    damage?: number;
    miningSpeed?: number;
    stackable?: boolean;
    maxStack?: number;
    nutrition?: number;
    blockId?: number;
}

interface CraftingRecipe {
    result: string;
    resultCount: number;
    ingredients: [string, number][];
}
```
