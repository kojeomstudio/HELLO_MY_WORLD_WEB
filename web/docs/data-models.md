# Data Models

## Block Types

| ID | Name | Properties |
|----|------|------------|
| 0 | Air | Transparent, Non-solid |
| 1 | Stone | Solid, cracky=3, drops cobblestone |
| 2 | Dirt | Solid, crumbly=3 |
| 3 | Grass | Solid, crumbly=3 |
| 4 | Water | Transparent, Liquid, Drowning |
| 5 | Sand | Solid, Falling, crumbly=3 |
| 6 | Wood | Solid, choppy=3 |
| 7 | Leaves | Transparent, Solid, snappy=3 |
| 8 | Glass | Transparent, Solid |
| 9 | Brick | Solid |
| 10 | Ore Iron | Solid, drops iron_ingot |
| 11 | Coal | Solid |
| 12 | Bedrock | Solid, Unbreakable |
| 13 | Snow | Solid |
| 14 | Ice | Transparent, Solid, Slippery |
| 15 | Lava | Transparent, Liquid, Damage: 4 |
| 16 | Torch | Transparent, Light: 14 |
| 17 | Ladder | Transparent, Climbable |
| 18 | Fence | Transparent, Solid |
| 19 | Door Wood | Transparent, Interactive |
| 20 | Chest | Interactive |
| 21 | Crafting Table | Interactive |
| 22 | Furnace | Interactive |
| 23 | Ore Gold | Solid, drops gold_ingot |
| 24 | Ore Diamond | Solid, drops diamond |
| 25 | Planks | Solid |
| 26 | Cobblestone | Solid |
| 27 | Stone Brick | Solid |
| 28-63 | Wool variants, ores, plants, etc. | Various |

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
    string? Metadata   // Optional data (tool durability as string)
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

## Chest Inventory

### Storage Format
Chest inventories are stored per-block in `GameServer._chestInventories`:

```csharp
ConcurrentDictionary<string, ItemStack?[]> _chestInventories
```

| Property | Value |
|----------|-------|
| Key format | `"x,y,z"` via `GameServer.PositionKey(x, y, z)` |
| Array size | 27 slots |
| Max stack per slot | 64 |
| Default value | Array of 27 nulls (created by `GetOrCreateChestInventory()`) |
| Persistence | In-memory only (lost on server restart) |

### Serialization Format (wire)
Chest inventory items are serialized as anonymous objects for `OnChestInventory`:

```json
[
    { "itemId": "cobblestone", "count": 32, "metadata": null },
    null,
    { "itemId": "wooden_sword", "count": 1, "metadata": "45" },
    null,
    ... (27 slots total)
]
```

### Operations

**MoveItemToChest(player, posKey, slotIndex, chestSlot):**
- If `chestSlot >= 0`: target specific slot
- If `chestSlot < 0`: auto-find empty or stackable slot
- Combines stacks if same item type (up to max 64)
- Returns `true` if item moved successfully

**TakeItemFromChest(player, posKey, chestSlot, slotIndex):**
- If `slotIndex >= 0`: target specific player slot
- If `slotIndex < 0`: auto-find empty or stackable slot
- Combines stacks if same item type (up to max 64)
- Returns `true` if item taken successfully

## Furnace Operation

### FurnaceOperation Record
Tracks an active smelting operation on the server.

```csharp
public record FurnaceOperation(
    string InputItemId,   // Item being smelted (e.g. "iron_ore")
    string ResultItemId,  // Expected output (e.g. "iron_ingot")
    float CookTime,       // Total cook time in seconds (from recipe)
    float Progress,       // Current progress 0.0 to 1.0
    string ConnectionId   // Owner player's connection ID
);
```

### Storage Format
Active furnace operations stored in `GameServer._activeFurnaces`:

```csharp
ConcurrentDictionary<string, FurnaceOperation> _activeFurnaces
```

| Property | Value |
|----------|-------|
| Key format | `"x,y,z"` (same as chest inventories) |
| Lifecycle | Created by `StartSmelting()`, removed on completion |
| Progress increment | `dt / CookTime` per game tick |
| Update frequency | Every 10 ticks (~0.5s) sends `OnFurnaceUpdate` |
| Completion | At progress >= 1.0, adds result to player inventory |

### Wire Format (OnFurnaceUpdate)
```typescript
connection.on("OnFurnaceUpdate", (
    input: string,    // Input item name or "" if empty
    fuel: string,     // Fuel name ("coal") or "" if empty
    output: string,   // Output item name or "" if not complete
    progress: number  // 0.0 to 1.0
) => void)
```

**In-progress example:**
```json
["iron_ore", "coal", "", 0.65]
```

**Completed example:**
```json
["", "", "iron_ingot", 1.0]
```

### Smelting Validation (StartSmelting)
1. No existing furnace operation at position
2. Valid `SmeltingRecipe` exists for `InputItemId`
3. Player inventory contains at least 1 input item
4. Player inventory contains at least 1 fuel item (coal or charcoal)
5. Consumes 1 input + 1 fuel from inventory on success

## Texture Atlas UV Coordinate System

### Atlas Layout
The client texture atlas is a dynamically generated canvas texture:

| Property | Value |
|----------|-------|
| Columns | 8 (`ATLAS_COLS`) |
| Tile size | 16x16 pixels |
| Rows | `ceil(totalTiles / 8)` |
| Filtering | `NearestFilter` (pixelated) |

### UV Mapping
Each tile is mapped to normalized UV coordinates within the atlas:

```
u_min = col / ATLAS_COLS
v_min = 1 - (row + 1) / atlasRows
u_max = (col + 1) / ATLAS_COLS
v_max = 1 - row / atlasRows
```

### Per-Face UV Layout
Each block face is a quad with 4 corners mapped to UV space:

| Corner | U | V |
|--------|---|---|
| Bottom-left | u_min | v_min |
| Bottom-right | u_max | v_min |
| Top-right | u_max | v_max |
| Top-left | u_min | v_max |

### Block-to-Tile Mapping
The `TextureAtlas.getUV(blockId)` function looks up the block's `textureName` field and maps it to its tile position in the atlas. Blocks without a matching texture return a default white tile UV.

### Supported Texture Names
32 textures loaded from `public/textures/blocks/`:

| Texture Name | Block(s) |
|-------------|----------|
| `default_stone` | stone |
| `default_dirt` | dirt |
| `default_grass` | grass |
| `default_water` | water |
| `default_sand` | sand |
| `default_tree` | wood |
| `default_leaves` | leaves |
| `default_snow` | snow |
| `default_ice` | ice |
| `default_lava` | lava |
| `default_cobble` | cobblestone |
| `default_gravel` | gravel |
| `default_water_flowing` | water_flowing |
| `default_lava_flowing` | lava_flowing |
| `default_mossycobble` | mossy_cobblestone |
| `default_desert_sand` | (available) |
| `default_desert_stone` | (available) |
| `default_tree_top` | (available) |
| `default_pine_tree` | (available) |
| `default_pine_tree_top` | (available) |
| `default_pine_needles` | (available) |
| `default_jungletree` | (available) |
| `default_jungletree_top` | (available) |
| `default_jungleleaves` | (available) |
| `default_junglegrass` | (available) |
| `default_river_water` | (available) |
| `default_river_water_flowing` | (available) |
| `default_apple` | (available) |
| `basenodes_snow_sheet` | (available) |
| `basenodes_dirt_with_snow` | (available) |
| `basenodes_dirt_with_snow_bottom` | (available) |
| `basenodes_dirt_with_grass_bottom` | (available) |

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
16^3 block container.

```csharp
public class Chunk {
    const int Size = 16;           // 16 blocks per axis
    const int BlockCount = 4096;   // 16^3 total blocks

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

## Entity Types

```csharp
public enum EntityType {
    Item,
    Mob,
    Projectile,
    Vehicle,
    Particle
}
```

## Physics State

```csharp
public record struct PhysicsState(
    Vector3 Position,
    Vector3 Velocity,
    float Yaw,
    float Pitch,
    bool IsOnGround,
    bool IsFlying,
    float Health,
    float LastGroundY
);
```

## Player Input

```csharp
public record struct PlayerInput(
    bool Forward,
    bool Backward,
    bool Left,
    bool Right,
    bool Jump,
    bool Sneak,
    bool Sprinting
);
```

## Active Block Modifier

```csharp
public class ActiveBlockModifier {
    public string Name { get; init; }
    public int Interval { get; init; }          // Ticks between runs
    public float Chance { get; init; }          // 0.0-1.0 probability
    public string? RequiredNeighbor { get; init; }
    public int MinY { get; init; }
    public int MaxY { get; init; }
    public Func<BlockDefinition, Vector3s, World, bool> Action { get; init; }
}
```

## Smelting Recipe

```csharp
public record SmeltingRecipe(
    string InputItemId,   // Item to smelt (e.g. "iron_ore")
    string ResultItemId,  // Output item (e.g. "iron_ingot")
    float CookTime,       // Seconds to smelt
    float Experience      // XP reward
);
```

## Privilege

```csharp
public record Privilege(
    string Name,         // e.g. "interact", "fly", "server"
    string Description,
    bool Default         // Granted to new players by default
);
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
    network: {
        timeBroadcastInterval: number;
    };
}
```

### blocks.json
```typescript
interface BlockDefinition {
    name: string;
    solid: boolean;
    transparent: boolean;
    color: string;
    textureName?: string;
    liquid?: boolean;
    breakable?: boolean;
    damage?: number;
    light?: number;
    interactive?: boolean;
    climbable?: boolean;
    drowning?: boolean;
    falling?: boolean;
    bouncy?: number;
    slippery?: boolean;
    moveResistance?: number;
    postEffectColor?: string;
    hardness?: number;
    drops?: string;
    drawType?: string;
    liquidRange?: number;
    liquidViscosity?: number;
    liquidRenewable?: boolean;
    level?: number;
    maxLevel?: number;
    groups?: Record<string, number>;
    soundGroup?: string;
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

### smelting.json
```typescript
interface SmeltingRecipeFile {
    smeltingRecipes: {
        input: string;
        result: string;
        cookTime?: number;
        experience?: number;
    }[];
}
```

### privileges.json
```typescript
interface PrivilegesFile {
    privileges: Record<string, {
        description: string;
        default: boolean;
    }>;
}
```
