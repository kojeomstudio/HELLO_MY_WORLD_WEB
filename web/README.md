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
| Textures | 63 PNG textures from Minetest devtest |
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
- Procedural terrain generation with Perlin noise (biomes, caves, ores, sandy biomes)
- Tree generation (trunk + canopy, biome-aware placement)
- 64 block types with groups, sounds, and extended properties
- Block placement/digging with tool wear and durability system
- Texture atlas-based block rendering (32 textures, pixelated style)
- Falling node physics (sand, gravel) via ABM system
- Liquid physics (water/lava flow and spreading)
- Day/night cycle with sky rendering
- World persistence (auto-save every 5 minutes to disk)

### Player
- First-person camera with WASD + mouse controls
- Gravity, jumping, collision detection
- Ladder climbing
- Sprint (Shift) and fly (F) modes
- Fall damage and drowning
- 32-slot inventory with 8-slot hotbar
- Food system (16 food items with health/hunger)
- Tool durability (wooden, stone, iron, diamond)
- 4 game modes: Survival, Creative, Adventure, Spectator

### Multiplayer
- Real-time multiplayer via SignalR/WebSocket
- Player list and position sync
- Chat system with slash commands (`/gamemode`, `/tp`, `/give`, etc.)
- PvP combat with weapon damage and Minetest knockback formula
- Rate limiting on chat, dig, and place actions
- Server-authoritative physics validation

### Crafting & Smelting
- Crafting UI with full recipe listing (56 recipes)
- Furnace smelting with real-time progress bar (15 recipes)
- Chest inventory UI with 27-slot per-block storage
- Click-to-transfer items between player and chest

### Entities
- Item drop entities with gravity and 5-minute lifespan
- Item pickup system (2-block range, auto-collect)
- Mob entities with AI (chase, attack, wander states)
- Entity spawn/despawn/position broadcast

### Systems
- 15 Minetest-compatible privileges (loaded from JSON)
- Active Block Modifier (ABM) system for periodic block changes
- Procedural audio (Web Audio API, no audio files)
- HUD (health hearts, breath bar, hotbar, debug overlay)
- Death screen with respawn

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
| F3 | Debug info |

## Project Structure

```
web/
  server/                    # C# .NET 8.0 Backend
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
        Generators/
          NoiseWorldGenerator.cs # Perlin noise terrain with trees/caves/ores
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
      world/
        WorldManager.ts        # Chunk management, texture atlas, entities
        BlockRegistry.ts       # 64 block definitions with textureName
        ChunkMesh.ts           # Mesh builder with UV mapping support
      player/
        PlayerController.ts    # FPS controller, raycasting, interactive blocks
      input/
        InputManager.ts        # Keyboard/mouse state tracking
      ui/
        UIManager.ts           # HUD, chat, crafting, furnace, chest UI
      audio/
        AudioManager.ts        # Procedural Web Audio sound synthesis
    index.html                 # Entry HTML with inline CSS
    public/
      textures/blocks/         # 63 PNG textures from Minetest devtest
  data/                      # Game Data (JSON)
    blocks.json                # 64 block definitions with groups & sounds
    items.json                 # 68 items, 56 recipes, 16 food values
    server_config.json         # Server configuration
    smelting.json              # 15 smelting recipes
    privileges.json            # 15 privilege definitions
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
| `server_config.json` | Max players, tick rate, world seed, spawn, physics |
| `blocks.json` | 64 block type definitions (properties, groups, sounds) |
| `items.json` | 68 items, 56 crafting recipes, tool tiers |
| `smelting.json` | 15 smelting recipes (input, output, cook time, XP) |
| `privileges.json` | 15 privilege definitions (name, description, default) |

## Documentation

| Document | Description |
|----------|-------------|
| [architecture.md](docs/architecture.md) | Full system architecture, Luanti mapping, all components |
| [client-architecture.md](docs/client-architecture.md) | Client components, texture atlas, UI panels, events |
| [communication.md](docs/communication.md) | SignalR protocol, wire formats, rate limiting |
| [server-api.md](docs/server-api.md) | Complete Hub method and event reference |
| [data-models.md](docs/data-models.md) | C# records, TypeScript interfaces, config schemas |

## Screenshots

<!-- TODO: Add screenshots -->
<!-- ![Gameplay](screenshots/gameplay.png) -->
<!-- ![Crafting UI](screenshots/crafting.png) -->
<!-- ![Furnace UI](screenshots/furnace.png) -->

## License

This project is a web port of the [Luanti](https://luanti.org/) (formerly Minetest) voxel engine.
Original textures from the Minetest devtest texture pack.
