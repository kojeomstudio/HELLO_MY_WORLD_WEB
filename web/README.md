# HelloMyWorld

Web-based voxel game ported from the minetest_sub_project (Luanti engine v5.16.0-dev).
Built with **TypeScript + Three.js** (client) and **C# ASP.NET Core 10.0 + SignalR** (server).

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Client | TypeScript 5.9, Three.js 0.160, Vite 5.0 |
| Server | C# .NET 10.0, ASP.NET Core, SignalR |
| Communication | WebSocket (SignalR) |
| Data | JSON configuration files |
| Textures | 89 PNG textures from Minetest devtest |
| Audio | Web Audio API (procedural, no audio files) |

## Prerequisites

- **Node.js** 18+
- **.NET 10.0 SDK**

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
- Procedural terrain generation with Perlin noise (biomes, caves, caverns, dungeons, ores)
- Tree generation (oak, pine, birch, jungle with biome-aware placement, snow biome pine trees)
- Desert decorations (cactus, dead bush)
- Surface decorations (flowers, mushrooms, tall grass, pumpkins)
- Gravel veins and clay deposits
- 161 block types with groups, sounds, and extended properties
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
- Crafting UI with full recipe listing (80+ recipes)
- Furnace smelting with real-time progress bar (15 recipes)
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
- 18 Minetest-compatible privileges (loaded from JSON, enforced on interact/shout/chat commands)
- Active Block Modifier (ABM) system: sand/gravel falling, dirt-to-grass, fire spread, cactus/sugarcane growth, mushroom spreading, ice melting
- Node timer system for time-based block events
- Procedural audio (Web Audio API, 6 sound types)
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
  server/                    # C# .NET 10.0 Backend
    Core/
      GameServer.cs          # Main game server controller
      ServerConfig.cs        # Server configuration models
      DayNightCycle.cs       # Day/night cycle system
      Vector3.cs             # 3D vector math (float)
      Vector3s.cs            # 3D vector math (short, block coords)
      Auth/
        AuthenticationService.cs  # Authentication & ban system
        PrivilegeSystem.cs       # 15 privileges, JSON-loadable
      Chat/
        ChatCommandManager.cs    # Slash command system
      Crafting/
        CraftingSystem.cs        # Shaped/shapeless crafting recipes
      Smelting/
        SmeltingSystem.cs        # Furnace/smelting recipes
      Entities/
        Entity.cs                # Entity base, ItemEntity, MobEntity
        EntityManager.cs         # Thread-safe entity lifecycle
      Game/
        BlockDefinition.cs       # Block definition registry (64 types)
      Physics/
        PhysicsEngine.cs         # Server-authoritative physics simulation
        KnockbackSystem.cs       # Minetest knockback formula
      Player/
        Player.cs                # Player state, health, inventory
        PlayerState.cs           # Enums (PlayerState, GameMode)
        Inventory.cs             # ItemStack record, inventory management
      World/
        World.cs                 # World state, chunk storage, liquid simulation
        Chunk.cs                 # 16x16x16 block container
        Block.cs                 # Single block data
        BlockType.cs             # 64 block type enum
        ChunkCoord.cs            # Chunk coordinate identifier
        IWorldGenerator.cs       # Generator interface
        WorldGeneratorFactory.cs # Generator factory
        WorldPersistence.cs      # Save/load to filesystem
        WorldManager.cs          # Multi-world management
        ActiveBlockModifier.cs   # ABM system for periodic modifications
        NodeTimer.cs             # Node timer for time-based block events
        NodeTimerKey.cs          # Node position key for timers
        NodeTimerSystem.cs       # Timer management system
        Generators/
          NoiseWorldGenerator.cs # Perlin noise terrain with trees/caves/ores/dungeons
          FlatWorldGenerator.cs  # Simple flat terrain
    Services/
      GameHub.cs               # SignalR hub (20+ methods, rate limiting)
      GameLoopService.cs       # Background game loop (20 TPS)
    Program.cs                 # Application entry point & DI
  client/                    # TypeScript Frontend
    src/
      main.ts                  # Entry point, DOM event bridges
      GameClient.ts            # Central orchestrator, 24 server handlers
      rendering/
        Renderer.ts            # Three.js scene, sky, lighting
        SelectionBox.ts        # Block selection wireframe highlight
        WieldItem.ts           # Wield item display with tool/block models
      world/
        WorldManager.ts        # Chunk management, texture atlas, entities
        BlockRegistry.ts       # 64 block definitions with textureName
        ChunkMesh.ts           # Mesh builder with ambient occlusion & UV mapping
        ParticleSystem.ts      # Particle effects (dig, place, damage, smoke)
      player/
        PlayerController.ts    # FPS controller, raycasting, step height
      input/
        InputManager.ts        # Keyboard/mouse state tracking
      ui/
        UIManager.ts           # HUD, chat, crafting, furnace, chest UI
        Minimap.ts             # Minimap overlay (surface/radar/normal modes)
      audio/
        AudioManager.ts        # Procedural Web Audio sound synthesis
    index.html                 # Entry HTML with inline CSS
    public/
      textures/blocks/         # 63 PNG textures from Minetest devtest
  data/                      # Game Data (JSON)
    blocks.json                # 64 block definitions with groups & sounds
    items.json                 # 100+ items, 80+ recipes, 16 food values
    mobs.json                  # 6 mob definitions (health, damage, speed, drops, AI)
    tools.json                 # 8 tool material definitions (durability, mining speed, weapon damage)
    server_config.json         # Server configuration (includes CORS origins, world border)
    smelting.json              # 15 smelting recipes
    privileges.json            # 15 privilege definitions
    physics_constants.json     # Physics constants, interaction ranges, player dimensions
    worlds/default/            # Auto-saved world data (*.chunk files)
  docs/                      # Documentation
    architecture.md            # Full architecture overview
    client-architecture.md     # Client component documentation
    communication.md           # SignalR protocol reference
    server-api.md              # Server API documentation
    data-models.md             # Data model documentation
```

## Configuration

All configuration is done via JSON files in `web/data/`:

| File | Purpose |
|------|---------|
| `server_config.json` | Max players, tick rate, world seed, spawn, physics, CORS origins, world border |
| `blocks.json` | 64 block type definitions (properties, groups, sounds) |
| `items.json` | 100+ items, 80+ crafting recipes, tool tiers |
| `mobs.json` | 6 mob definitions (health, damage, speed, drops, AI params) |
| `tools.json` | 8 tool material definitions (durability, mining speed, weapon damage) |
| `smelting.json` | 15 smelting recipes (input, output, cook time, XP) |
| `privileges.json` | 15 privilege definitions (name, description, default) |
| `physics_constants.json` | Physics constants, interaction ranges, player dimensions |

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
