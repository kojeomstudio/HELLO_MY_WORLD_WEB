# Server Architecture

## File Structure

```
web/server/
  Program.cs                    DI registration, app startup, shutdown
  Core/
    GameServer.cs               Central game logic (892 lines)
    ServerConfig.cs             Configuration (7 nested settings classes)
    Game/
      BlockDefinition.cs        BlockDefinition + BlockDefinitionManager (202 lines)
    World/
      World.cs                  Chunk storage, liquid sim, persistence (355 lines)
      Chunk.cs                  16^3 block array, serialization
      Block.cs                  Block type + params, packing
      BlockType.cs              Enum, 68 values
      ChunkCoord.cs             Integer chunk coordinate struct
      LightingEngine.cs         Static 4-bit sun + 4-bit artificial light (438 lines)
      LightingSystem.cs         Non-static facade over LightingEngine
      WorldPersistence.cs       Chunk file I/O
      Generators/
        IWorldGenerator.cs      Generator interface
        WorldGeneratorFactory.cs Registry of generators
        NoiseWorldGenerator.cs  Perlin noise terrain + caves + trees + dungeons (428 lines)
        FlatWorldGenerator.cs   Flat terrain generator
      ActiveBlockModifier.cs    ABM system (sand/gravel falling)
      NodeTimerSystem.cs        Timed block changes
      AgricultureSystem.cs      Crop growth (109 lines)
      BlockMetadataDatabase.cs  SQLite for chests/furnaces/timers
    Entities/
      Entity.cs                 Base Entity + ItemEntity + MobEntity (197 lines)
      EntityManager.cs          ConcurrentDictionary storage, max 10000
      MobSpawner.cs             Mob spawning/despawning (6 types)
    Player/
      Player.cs                 Player state (120 lines)
      PlayerState.cs            PlayerState + GameMode enums
      Inventory.cs              32-slot inventory, ItemStack record
      PlayerDatabase.cs         SQLite persistence (169 lines)
    Physics/
      PhysicsEngine.cs          Full physics simulation (274 lines)
      KnockbackSystem.cs        Knockback calculation
    Auth/
      AuthenticationService.cs Name/IP validation, ban check
      PrivilegeSystem.cs       15 built-in privileges
    Chat/
      ChatCommandManager.cs     6 commands (help, time, tps, gm, tp, give)
    Crafting/
      CraftingSystem.cs         Shaped/shapeless crafting (155 lines)
    Smelting/
      SmeltingSystem.cs         Smelting recipes
  Services/
    GameHub.cs                  SignalR hub, all client methods (873 lines)
    GameLoopService.cs          BackgroundService, main game loop (253 lines)
```

## Dependency Injection

All services registered as **Singletons** in `Program.cs`:

| Service | Key Dependencies |
|---------|-----------------|
| ServerConfig | none |
| BlockDefinitionManager | none |
| WorldGeneratorFactory | none |
| SmeltingSystem | none |
| PrivilegeSystem | none |
| ActiveBlockModifierSystem | none |
| KnockbackSystem | none |
| PlayerDatabase | none |
| BlockMetadataDatabase | none |
| GameServer | All above |
| AuthenticationService | none |
| ChatCommandManager | GameServer delegates |
| CraftingSystem | none |
| EntityManager | none |
| GameLoopService | GameServer, EntityManager, HubContext, Logger |
| AgricultureSystem | none |

## Startup Sequence

1. Load configs: `ServerConfig`, `BlockDefinitionManager`, `SmeltingSystem`, `PrivilegeSystem`
2. Register ABMs (sand_falling, gravel_falling)
3. Create SQLite databases in `data/worlds/default/`
4. Create `GameServer` (creates World with generator)
5. Create `AuthenticationService`, `ChatCommandManager`, `CraftingSystem`, `EntityManager`
6. Build app, configure CORS, map SignalR hub at `/game`
7. Set HubContext on GameServer
8. `GameServer.Start()` — sets MobEntity delegates, initializes node timers
9. Create `AgricultureSystem`
10. Load world from disk
11. Register shutdown handler (save metadata + world)

## Game Loop (GameLoopService)

`BackgroundService` running at configured tick rate (default 20 TPS):

```
Each tick:
1. gameServer.Update()
   - Advance game time (mod 24000)
   - Update each player (damage, lava, water, fall, food, breath, drowning)
   - Validate player positions (speed cap, ground check)
   - Update entity manager
   - Update node timers
   - Update mob spawner
   - Update liquids
   - Process ABMs
   - Grow crops
   - Update furnaces
2. Process item pickups (2.0 range)
3. Broadcast entity events (spawn/update/despawn)
4. Process falling blocks (every 10 ticks)
5. Auto-save (every 5 minutes)
6. Broadcast time update (every 100 ticks)
```

## Key Components

### GameServer (892 lines)

Central game logic:
- **Players:** `ConcurrentDictionary<string, Player>`, connection-to-player mapping
- **Worlds:** `ConcurrentDictionary<string, World>`
- **Chests:** `ConcurrentDictionary<string, ItemStack?[]>`
- **Furnaces:** `ConcurrentDictionary<string, FurnaceOperation>`
- **Game time:** Long (0-24000 cycle), configurable speed

### GameHub (873 lines)

SignalR hub with rate limiting:
- 25+ client-to-server methods
- Per-connection per-action cooldowns (DigBlock/PlaceBlock: 250ms, SendChat: 500ms)
- Tool durability system (wooden=59, stone=131, iron=250, diamond=1561)
- Start items on join: wooden_pickaxe(1), wooden_sword(1), torch(16), bread(5)
- Sends 7x4x7 initial chunks around spawn

### World (355 lines)

Chunk storage with lazy generation:
- `ConcurrentDictionary<ChunkCoord, Chunk>` with `GetOrAdd` for lazy gen
- Liquid simulation: water every 3 ticks, lava every 5 ticks
- Water-lava interaction: Water+Lava=Obsidian, Flowing+Flowing=Cobblestone
- Falling block detection

### LightingEngine (438 lines)

Static lighting with 4-bit packing:
- `PackLight(sun, artificial)` — `(sun << 4) | artificial`
- BFS propagation for both sun and artificial light
- Emission: Torch/Lava/GlowingObsidian = 14
- Handles block placement/removal light updates

### NoiseWorldGenerator (428 lines)

Procedural terrain generation:
- **Perlin noise** with 512-entry permutation table
- **Terrain:** Base Y=32, Height=20, WaterLevel=28
- **Biomes:** Sandy (desert) when noise > 0.3
- **Caves:** Dual-noise worm (`c1^2 + c2^2 < 0.015`), caverns below Y=20
- **Ores:** Diamond (Y<16), Gold (Y<32), Iron (Y<48), Coal (Y<64)
- **Trees:** Oak, Pine, Birch (noise threshold > 0.35)
- **Dungeons:** Below Y=30, 3-6 size rooms, mossy_cobblestone walls

### PhysicsEngine (274 lines)

Server-side physics validation:
- 4 modes: Flying, Ladder, Liquid, Normal
- AABB collision resolution
- Fall damage threshold (configurable, default 3.0)
- Void kill at Y < -64

## Data Persistence

### SQLite Databases

**players.db:**
| Column | Type |
|--------|------|
| name | TEXT PK |
| position_xyz | TEXT |
| yaw, pitch | REAL |
| health, max_health, breath | INTEGER |
| food_level, food_saturation | REAL |
| total_experience, experience_level | INTEGER |
| game_mode | TEXT |
| inventory_json, armor_json | TEXT |
| selected_hotbar_slot | INTEGER |
| last_ground_y | REAL |
| last_login, last_save | TEXT |

**blockmeta.db:**
| Table | Columns |
|-------|---------|
| chest_inventories | pos_key PK, items_json |
| furnace_operations | pos_key PK, input_item_id, result_item_id, cook_time, progress, connection_id |
| node_timers | (x,y,z) PK, block_name, expiration |

**World chunks:** Binary files `{x}_{y}_{z}.chunk` (16KB each, 4 bytes per block)
