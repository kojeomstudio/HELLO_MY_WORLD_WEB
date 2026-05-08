# HelloMyWorld

Web-based voxel game ported from the minetest_sub_project (Luanti engine v5.16.0-dev).
Built with **TypeScript + Three.js** (client) and **C# ASP.NET Core 8.0 + SignalR** (server).

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Client | TypeScript 5.9, Three.js 0.160, Vite 5.0 |
| Server | C# .NET 8.0, ASP.NET Core, SignalR |
| Communication | WebSocket (SignalR) |
| Data | JSON configuration files |
| Textures | 89 PNG textures from Minetest devtest |
| Audio | Web Audio API (procedural, no audio files) |

## Prerequisites

- **Node.js** 18+
- **.NET 8.0 SDK**

## Quick Start

### 1. Start the Server

```bash
cd web/server
dotnet restore
dotnet run
```

Server starts at `http://localhost:5266`

### 2. Start the Client

```bash
cd web/client
npm install
npm run dev
```

Client starts at `http://localhost:5173` (proxies `/game` to server)

### 3. Play

Open `http://localhost:5173` in your browser, enter a player name, and click "Play".

## Production Build

```bash
cd web/client
npm run build
```

Output is in `web/client/dist/`. Serve with any static file server.

## Features

### World
- Procedural terrain generation with Perlin noise (14 biomes, caves, caverns, dungeons, ores)
- Tree generation (oak, pine, birch, jungle with biome-aware placement, snow biome pine trees)
- Desert decorations (cactus, dead bush)
- Surface decorations (flowers, mushrooms, tall grass, pumpkins)
- Gravel veins and clay deposits
- 251 block definitions with groups, sounds, and extended properties
- Block placement/digging with tool wear and durability system
- Texture atlas-based block rendering (89 textures from Minetest DevTest, pixelated style)
- Ambient occlusion in chunk meshing for realistic lighting
- Falling node physics (sand, gravel) via ABM system
- Liquid physics (water/lava flow and spreading with lava-water interaction)
- Day/night cycle with sky rendering
- World persistence (auto-save every 5 minutes to disk)

### Rendering
- Three.js WebGL renderer with perspective camera
- Dynamic sky dome with sun and fog
- Ambient occlusion per-vertex lighting
- Shadow mapping (PCFSoft, 1024 map, sun directional light)
- Player-following point light for local illumination
- Animated water (wave effect, 0.45 opacity, lowered surface)
- Animated lava (wave effect, emissive vertex colors, light level 14)
- Transparent block rendering (water, glass, leaves)
- Custom block geometry: stairs, slabs, fences, walls, glass panes, doors, ladders, torches, plants, fire
- Minimap with 3 modes: surface, radar, normal (click to toggle)
- Block selection highlight wireframe
- Wield item display with tool/block models
- Particle effects (dig, place, damage, smoke)

### Player
- First-person/third-person camera (F5 to cycle) with WASD + mouse controls
- Head bobbing during walk/sprint
- Underwater effects (blue overlay, fog)
- Gravity, jumping, collision detection with step height
- Ladder climbing
- Sprint (Shift) and fly (F) modes
- Fall damage and drowning
- 32-slot inventory with 8-slot hotbar
- Food system (16 food items with health/hunger)
- Tool durability (wooden, stone, iron, diamond, mese)
- 4 game modes: Survival, Creative, Adventure, Spectator

### Multiplayer
- Real-time multiplayer via SignalR/WebSocket
- Player list and position sync
- Chat system with slash commands (`/gamemode`, `/tp`, `/give`, `/giveme`, `/me`, `/msg`, `/mods`, `/days`, `/help`, `/time`, `/tps`, `/setborder`, `/admin`)
- PvP combat with weapon damage and Minetest knockback formula (max 4 block range)
- Rate limiting on chat, dig, place, punch, interact, and join spam
- Server-driven physics parameters (gravity, speed, jump, etc.)
- Server-authoritative physics validation
- Configurable CORS origins from `server_config.json`
- Security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
- Player name regex validation, reserved name check, IP ban enforcement

### Crafting & Smelting
- Crafting UI with full recipe listing (183 recipes)
- Furnace smelting with real-time progress bar (20 recipes)
- Chest inventory UI with 27-slot per-block storage
- Click-to-transfer items between player and chest
- Dye recipes for all wool colors

### Entities
- Item drop entities with gravity and 5-minute lifespan
- Item pickup system (2-block range, auto-collect)
- Mob entities with AI state machine (Idle → Chase → Attack)
- Detailed multi-part mob models (Zombie, Skeleton, Spider, Cow, Pig, Chicken) with name tags
- Hostile mobs (Zombie, Skeleton, Spider) spawn at night with attack damage
- Passive mobs (Cow, Pig, Chicken) spawn on grass during day, flee when hit
- Entity spawn/despawn/position broadcast
- Mob definitions loaded from `mobs.json`

### Systems
- 19 Minetest-compatible privileges (loaded from JSON, enforced on interact/shout/chat commands)
- Active Block Modifier (ABM) system: sand/gravel falling, dirt-to-grass, fire spread, cactus/sugarcane growth, mushroom spreading, ice melting
- Node timer system for time-based block events
- Procedural audio (Web Audio API, 14 sound effects, 12 block sound groups)
- HUD (health hearts, breath bar, hotbar, debug overlay, minimap)
- Death screen with respawn
- Wield item display with tool/block visual models
- World border (configurable size, position clamping)
- Interactive blocks: sign text (persisted), bed spawn point (persisted), note block/jukebox audio
- Torch placement validation (requires adjacent solid block)

## Controls

| Key | Action |
|-----|--------|
| WASD | Move |
| Mouse | Look around |
| Left Click | Dig block |
| Right Click | Place block / Interact |
| Space | Jump / Fly up |
| Shift | Sprint / Fly down |
| F | Toggle fly mode |
| 1-8 | Select hotbar slot |
| T | Open chat |
| E | Open crafting |
| F5 | Cycle camera mode (1st/3rd person) |
| F3 | Debug info |

## Project Structure

```
web/
  server/                    # C# .NET 8.0 Backend
    Core/
      GameServer.cs          # Main game server controller
      ServerConfig.cs        # Server configuration models
      DayNightCycle.cs       # Day/night cycle system
      AsyncJobSystem.cs      # Thread-safe async job queue
      ServerProfiler.cs      # Server profiling & metrics
      ToolConfig.cs          # Tool material system
      Vector3.cs             # 3D vector math (float)
      Vector3s.cs            # 3D vector math (short, block coords)
      Auth/
        AuthenticationService.cs  # PBKDF2 authentication & ban system
        BanDatabase.cs            # JSON-based ban persistence
        PrivilegeSystem.cs        # 19 privileges, JSON-loadable
        ProtectionSystem.cs       # In-memory protection zones
      Chat/
        ChatCommandManager.cs    # 40+ slash commands with privilege checks
        ModChannels.cs           # Channel-based pub/sub messaging
      Content/
        ContentPackageManager.cs  # Mod package loading & dependency resolution
      Crafting/
        CraftingSystem.cs        # Shaped/shapeless crafting recipes
        GridCraftingSystem.cs    # Grid-based 3x3 crafting with tool repair
        RecipePriority.cs        # Recipe priority ordering
      Entities/
        Entity.cs                # Entity base, ItemEntity, ProjectileEntity, MobEntity
        EntityManager.cs         # Thread-safe entity lifecycle
        MobSpawner.cs            # Biome-aware mob spawning
        BiomeDetector.cs         # Block-type-based biome detection
        FishingSystem.cs         # Fishing minigame (fish/junk/treasure)
        BreedingSystem.cs        # Mob breeding with food
        EntityPersistence.cs     # Entity save/load
      Game/
        BlockDefinition.cs       # 251 block definitions with full properties
        DigProperties.cs         # Tool dig time & wear calculation
      Inventory/
        DetachedInventoryManager.cs  # Named inventories with access control
      ModStorage/
        ModStorageDatabase.cs    # Per-mod key-value storage
      Particles/
        ParticleSpawnerSpec.cs   # Particle spawner management
      Pathfinding/
        Pathfinder.cs            # A* voxel pathfinding for mob AI
      Physics/
        PhysicsEngine.cs         # Server-authoritative physics simulation
        AntiCheatValidator.cs    # Speed/fly/teleport detection
        KnockbackSystem.cs       # Minetest knockback formula
      Player/
        Player.cs                # Player state, health, food, armor, XP
        PlayerDatabase.cs        # SQLite player persistence
        PlayerState.cs           # Enums (PlayerState, GameMode)
        PlayerStatistics.cs      # Player statistics tracking
        Inventory.cs             # ItemStack record, thread-safe inventory
      Protection/
        AreaProtection.cs        # Area claiming with overlap detection
      Rollback/
        RollbackSystem.cs        # Block change tracking & rollback
      Smelting/
        SmeltingSystem.cs        # Furnace smelting recipes
      Sound/
        SoundSpecManager.cs      # Block sound definitions from JSON
      ToolWear/
        ToolWearSystem.cs        # Tool durability & break detection
      UI/
        FormspecSystem.cs        # Formspec definitions from JSON
        FormspecParser.cs        # Formspec markup parser
      Weather/
        WeatherSystem.cs         # Rain/snow/thunderstorm with lightning
      World/
        World.cs                 # World state, chunk storage, liquid simulation
        WorldManager.cs          # Multi-world management
        WorldPersistence.cs      # Chunk save/load to filesystem
        WorldBackup.cs           # Timestamped ZIP backups
        Chunk.cs                 # 16x16x16 block container
        Block.cs                 # Single block data (4 bytes)
        BlockType.cs             # 200+ block type enum
        ChunkCoord.cs            # Chunk coordinate identifier
        LightingEngine.cs        # Block lighting calculation
        LiquidSimulator.cs       # Water/lava flow simulation
        Raycast.cs               # DDA voxel raycast
        RedstoneSystem.cs        # Redstone power propagation
        AgricultureSystem.cs     # Crop planting & growth
        ExplosionSystem.cs       # Explosion with block/entity damage
        ActiveBlockModifier.cs   # ABM system for periodic modifications
        LoadingBlockModifier.cs  # LBM system
        NodeMetadata.cs          # Block metadata (signs, chests)
        NodeTimer.cs             # Node timer for time-based events
        NodeTimerSystem.cs       # Timer management
        BlockMetadataDatabase.cs # SQLite sign/chest/furnace metadata
        VoxelManipulator.cs      # Bulk voxel operations
        MMVManip.cs              # Map-modified VoxelManipulator
        EmergeManager.cs         # Chunk emergence/area loading
        ForceloadManager.cs      # Force chunk loading
        MapEditEvent.cs          # Map edit event tracking
        IWorldGenerator.cs       # Generator interface
        WorldGeneratorFactory.cs # Generator factory by name
        Generators/
          NoiseWorldGenerator.cs    # Main noise terrain with full features
          FlatWorldGenerator.cs     # Simple flat terrain
          NoiseSystem.cs            # Perlin/Octave noise implementation
          MapgenV5.cs               # Minetest V5 map generator
          MapgenV6.cs               # Minetest V6 map generator (legacy biomes)
          MapgenV7.cs               # Minetest V7 map generator (default)
          MapgenCarpathian.cs       # Carpathian mountains generator
          MapgenValleys.cs          # River valleys generator
          MapgenFractal.cs          # Fractal terrain generator
          MapgenSinglenode.cs       # Single-node generator
          LSystemTree.cs            # L-system tree generation
          SchematicPlacer.cs        # Structure schematic placement
          AdvancedOrePlacer.cs      # Ore vein generation
    Services/
      GameHub.cs               # SignalR hub (40+ methods, rate limiting, security)
      GameLoopService.cs       # Background game loop (configurable TPS)
    Program.cs                 # Application entry point, DI, security headers
  client/                    # TypeScript Frontend
    src/
      main.ts                  # Entry point, DOM event bridges
      GameClient.ts            # Central orchestrator, 50+ server handlers
      rendering/
        Renderer.ts            # Three.js scene, sky, day/night, post-processing
        SelectionBox.ts        # Block selection wireframe with dig progress
        WieldItem.ts           # Wield item display with tool/block/item models
        CloudSystem.ts         # Procedural cloud plane with time-of-day tinting
        CascadeShadowMap.ts    # 3-cascade shadow mapping
        OcclusionCuller.ts     # Software occlusion culling via ray-marching
        AutoExposurePass.ts    # Auto-exposure with ACES tone mapping
      world/
        WorldManager.ts        # Chunk management, texture atlas, 6 entity types
        BlockRegistry.ts       # 251 block definitions with extended properties
        ChunkMesh.ts           # Mesh builder with 18+ draw types, AO, UV mapping
        ItemRegistry.ts        # Item definitions with texture resolution
        WeatherSystem.ts       # Rain/snow/thunderstorm particle weather
        ParticleSystem.ts      # Particle effects with server-driven spawners
      player/
        PlayerController.ts    # FPS controller, physics, collision, raycast, dig/place
      input/
        InputManager.ts        # Keyboard/mouse/gamepad state tracking
        TouchControls.ts       # Mobile touch joystick & action buttons
      ui/
        UIManager.ts           # Full UI: chat, crafting, furnace, chest, creative, HUD
        SettingsPanel.ts       # Settings with localStorage persistence
        Minimap.ts             # 3-mode minimap (surface/radar/normal)
        CraftingGridUI.ts      # 3x3 crafting grid with result slot
        FormspecRenderer.ts    # Minetest formspec renderer (30+ element types)
        EnrichedString.ts      # Minetest color code parsing
      audio/
        AudioManager.ts        # Procedural Web Audio (14 sounds, 12 block groups)
      i18n/
        I18n.ts                # Internationalization (en, ko)
      modding/
        ModLoader.ts           # Client-side mod API with lifecycle hooks
    index.html                 # Entry HTML with inline CSS
    public/
      textures/blocks/         # 89 PNG textures from Minetest devtest
  data/                      # Game Data (JSON)
    blocks.json                # 251 block definitions with groups & sounds
    items.json                 # 247 items, 183 crafting recipes, tool tiers, food values
    mobs.json                  # 6 mob definitions (health, damage, speed, drops, AI)
    tools.json                 # 8 tool material definitions
    server_config.json         # Server configuration (CORS, world border, physics)
    smelting.json              # 20 smelting recipes
    privileges.json            # 19 privilege definitions
    physics_constants.json     # Physics constants, interaction ranges
    biomes.json                # 14 biome definitions
    ores.json                  # 13 ore generation definitions
    decorations.json           # 12 decoration definitions
    mapgen_v7.json             # MapgenV7 noise parameters & features
    mapgen_valleys.json        # MapgenValleys parameters
    mapgen_carpathian.json     # MapgenCarpathian parameters
    tree_schematics.json       # 5 tree schematic definitions
    lsystem_trees.json         # 5 L-system tree definitions
    schematics.json            # Structure schematics (small_house, outpost_tower)
    sounds.json                # 15 block sound groups
    sky_params.json            # Sky rendering parameters
    day_night_ratio.json       # Day/night brightness curve
    game_constants.json        # Game version & protocol constants
    protection.json            # Protection system configuration
    abm_config.json            # 8 ABM modifier configurations
    formspecs.json             # 6 formspec templates
  docs/                      # Documentation
    architecture.md            # Full architecture overview
    client-architecture.md     # Client component documentation
    communication.md           # SignalR protocol reference
    server-api.md              # Server API documentation
    data-models.md             # Data model documentation
    reference/                 # Minetest architecture reference docs
```

## Configuration

All configuration is done via JSON files in `web/data/`:

| File | Purpose |
|------|---------|
| `server_config.json` | Max players, tick rate, world seed, spawn, physics, CORS origins, world border |
| `blocks.json` | 251 block type definitions (properties, groups, sounds) |
| `items.json` | 247 items, 183 crafting recipes, tool tiers, food values |
| `mobs.json` | 6 mob definitions (health, damage, speed, drops, AI params) |
| `tools.json` | 8 tool material definitions (durability, mining speed, weapon damage) |
| `smelting.json` | 20 smelting recipes (input, output, cook time, XP) |
| `privileges.json` | 19 privilege definitions (name, description, default) |
| `physics_constants.json` | Physics constants, interaction ranges, player dimensions |
| `biomes.json` | 14 biome definitions with block types and tree configs |
| `ores.json` | 13 ore generation definitions (scatter, vein, sheet, blob, puff, stratum) |
| `decorations.json` | 12 surface decoration definitions |
| `mapgen_v7.json` | MapgenV7 noise parameters and feature toggles |
| `mapgen_valleys.json` | MapgenValleys generator parameters |
| `mapgen_carpathian.json` | MapgenCarpathian generator parameters |
| `tree_schematics.json` | 5 tree schematic definitions |
| `lsystem_trees.json` | 5 L-system tree definitions |
| `schematics.json` | Structure schematics (small_house, outpost_tower) |
| `sounds.json` | 15 block sound group definitions |
| `sky_params.json` | Sky rendering parameters (colors, sun, moon, stars) |
| `day_night_ratio.json` | Day/night brightness curve |
| `game_constants.json` | Game version & protocol constants |
| `protection.json` | Area protection configuration |
| `abm_config.json` | 8 ABM modifier configurations |
| `formspecs.json` | 6 formspec UI templates |

## Documentation

| Document | Description |
|----------|-------------|
| [architecture.md](docs/architecture.md) | Full system architecture, Luanti mapping, all components |
| [client-architecture.md](docs/client-architecture.md) | Client components, texture atlas, UI panels, events |
| [communication.md](docs/communication.md) | SignalR protocol, wire formats, rate limiting |
| [server-api.md](docs/server-api.md) | Complete Hub method and event reference |
| [data-models.md](docs/data-models.md) | C# records, TypeScript interfaces, config schemas |

## Luanti Compatibility Mapping

This project faithfully ports core Luanti/Minetest engine features:

| Luanti Feature | Web Implementation |
|----------------|-------------------|
| Map (16x16x16 chunks) | `World.cs` / `Chunk.cs` / `ChunkMesh.ts` |
| MapNode (4 bytes per node) | `Block.cs` (Type + Param1 + Param2 + Light) |
| ContentFeatures (859 fields) | `BlockDefinition.cs` / `BlockRegistry.ts` |
| NodeDefManager / ItemDefManager | `BlockDefinitionManager` |
| Server/Client architecture | SignalR Hub + TypeScript client |
| Network protocol (MTP/UDP) | WebSocket (SignalR) |
| Perlin noise terrain | `NoiseWorldGenerator.cs` (full 3D Perlin) |
| Biome system | Noise-based biome selection (grassland/sand) |
| Cave generation (noise intersection) | Cave + cavern noise |
| Dungeon generation | Random room placement with corridors |
| Ore distribution | Noise-based vein clustering |
| Tree generation | Oak, pine, birch procedural trees |
| Crafting system | `CraftingSystem.cs` (shaped/shapeless) |
| ABM system | `ActiveBlockModifierSystem.cs` |
| Node timers | `NodeTimerSystem.cs` |
| Physics (AABB collision) | `PhysicsEngine.cs` |
| Knockback formula | `KnockbackSystem.cs` (Minetest formula) |
| Minimap | `Minimap.ts` (surface/radar/normal) |
| Ambient occlusion | Per-vertex AO in `ChunkMesh.ts` |
| Particle system | `ParticleSystem.ts` |
| HUD elements | Health, breath, hotbar, debug, minimap |
| Privilege system | `PrivilegeSystem.cs` (15 privileges) |
| Inventory (32-slot) | `Inventory.cs` / `UIManager.ts` |

## License

This project is a web port of the [Luanti](https://luanti.org/) (formerly Minetest) voxel engine.
Original textures from the Minetest devtest texture pack.
