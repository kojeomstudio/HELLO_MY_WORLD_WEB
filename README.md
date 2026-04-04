# HelloMyWorld

Web-based voxel game ported from the minetest_sub_project (Luanti engine v5.16.0-dev).

## Features

### World Generation
- Procedural terrain with Perlin noise (multi-octave)
- Biome system (sandy/normal biomes)
- Cave generation (3D noise intersection)
- Dungeon generation (stone/cobblestone rooms below Y=30)
- Ore veins (coal, iron, gold, diamond at depth-based layers)
- Tree generation (oak, pine with deterministic seeded RNG)
- Gravel/clay deposits, flat world generator alternative

### Rendering & Visuals
- Three.js 3D scene with perspective camera (configurable FOV)
- Chunk mesh building with per-face culling (solid vs transparent)
- Ambient occlusion (3-bit per vertex, toggleable via settings)
- Texture atlas system (procedurally generated textures composited into canvas)
- Sky dome with sun mesh and day/night sky brightness
- Dynamic lighting system (sun light + artificial light propagation)
- Cloud system (procedural texture, drift, day/night color response, toggleable via settings)
- Weather system (rain particles with wind effect, fog density changes)
- Post-processing effects (damage flash, cave darkness vignette, lava overlay)
- Waving vegetation animation (leaves, pine needles, sugar cane)
- Block selection wireframe with dig progress overlay
- Minimap (3 modes: surface, radar, normal)
- Particle system (dig, place, damage, smoke effects)
- Wield item display with procedural 3D tool/block meshes and bob/swing animations

### Gameplay
- 68 block types with full property system (solid, transparent, liquid, light, damage, hardness, groups, sounds)
- 4 new agriculture blocks: WheatCrop, CarrotCrop, PotatoCrop, HayBale
- Tool group-based mining speed (cracky, crumbly, choppy, snappy, dig_immediate)
- Tool material multipliers (wooden=2x, stone=4x, iron=6x, diamond=8x)
- Falling node animation (sand, gravel with gravity physics)
- Improved liquid simulation (level-based flow, horizontal spreading, water+lava interaction)
- Fluid bucket interaction (pickup/place water and lava with bucket items)
- Node timer system (farmland drying, grass spreading, ice melting)
- Door mechanics (interactive door_wood blocks with open/close state)
- Crafting system (56+ shaped and shapeless recipes)
- Smelting system (15 recipes with furnace progress tracking)
- Chest inventory system (27-slot per-block storage, persisted to SQLite)
- Food system (nutrition, saturation, healing)
- Tool durability with color-coded durability bars
- Armor equipment (leather/iron/diamond: helmet, chestplate, leggings, boots)
- Experience and leveling system with XP bar display
- Player and mob death drops (inventory scattered as entities)
- Creative mode inventory UI (paginated grid with search/filter)
- Settings panel (mouse sensitivity, render distance, FOV, volumes, clouds/AO toggles — all wired to game systems)
- Player walk animation (multi-part body with limb swinging)

### Multiplayer
- Real-time multiplayer via SignalR WebSocket
- Chat system with message history and slash commands
- Chat commands: /help, /time, /tps, /gamemode, /tp, /give
- Player list panel
- PvP combat with knockback (Minetest formula)
- Privilege system (15 Minetest-compatible privileges)
- Authentication with name validation and IP banning
- Player persistence (position, inventory, armor, XP saved to SQLite across sessions)

### Physics & Entities
- Server-authoritative player physics with previous-position speed validation
- Gravity, collision detection with AABB and step-up
- Flying mode, sprinting, climbing (ladders)
- Liquid physics (swimming, sinking, drag)
- Fall damage with configurable threshold
- Drowning mechanics
- Mob spawning system (zombie, skeleton, spider, cow, pig, chicken)
- Mob AI (chase, attack, wander behaviors)
- Mob death drops (items spawned at death location)
- Item entities with gravity, bounce, and 5-minute lifespan
- Auto item pickup within 2-block range
- Active Block Modifier system (sand/gravel falling)
- Day/night cycle with smooth sky transitions
- Crop agriculture (plant on farmland, water-accelerated growth, harvest)

### Audio
- Procedural Web Audio API sounds (no audio files)
- Volume control via settings panel
- Block break, block place, hurt, pickup, death sound effects

### Server
- 20 TPS BackgroundService game loop
- Auto-save every 300 seconds (world chunks + chest inventories + furnace operations + node timers)
- World persistence (binary chunk files + SQLite metadata)
- Player persistence (SQLite database)
- Rate limiting (chat, dig, place)
- REST API status endpoint
- Swagger UI for development
- Configurable server settings via JSON
- Chunk unloading for distant chunks (memory management)

## Prerequisites

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) 18+ (with npm)

## Installation

```bash
git clone <repository-url>
cd hello-my-world-web
```

### Server Dependencies

```bash
dotnet restore web/server/WebGameServer.csproj
```

### Client Dependencies

```bash
npm install --prefix web/client
```

## Running

### Quick Start (Windows)

```bash
start.bat
```

This launches the server, client dev server, and opens the browser automatically.

### Quick Start (Linux/macOS)

```bash
chmod +x start.sh
./start.sh
```

### Manual Setup

#### 1. Start the Server

```bash
dotnet run --project web/server
```

Server starts at `http://localhost:5266`.

#### 2. Start the Client (in a new terminal)

```bash
npm run dev --prefix web/client
```

Client starts at `http://localhost:5173`. The Vite dev server proxies `/game` to the server.

#### 3. Open in Browser

Navigate to `http://localhost:5173` and enter a player name to join.

## Project Structure

```
hello-my-world-web/
  start.bat                          - Windows launcher (server + client + browser)
  start.sh                           - Linux/macOS launcher
  web/
    client/
      src/
        main.ts                      - Bootstrap, DOM event bridges
        GameClient.ts                - Central orchestrator, game loop
        rendering/
          Renderer.ts                - Three.js scene, camera, lighting, sky
          CloudSystem.ts             - Procedural cloud layer
          SelectionBox.ts            - Block selection wireframe
          WieldItem.ts               - Hand-held item display
        world/
          WorldManager.ts            - Chunk storage, texture atlas, entities, chunk unloading
          BlockRegistry.ts           - Block type definitions
          ChunkMesh.ts               - Chunk mesh builder with UV mapping + AO toggle
          WeatherSystem.ts           - Rain particle system
          ParticleSystem.ts          - Dig/place/damage particles
        player/
          PlayerController.ts        - FPS camera, physics, raycasting
        input/
          InputManager.ts            - Keyboard state, pointer lock
        ui/
          UIManager.ts               - HUD, chat, hotbar, panels
          SettingsPanel.ts           - Settings with localStorage persistence
          Minimap.ts                 - In-game minimap
        audio/
          AudioManager.ts            - Procedural Web Audio sounds with volume control
      public/
        textures/blocks/             - Block textures (PNG)
    server/
      Core/
        GameServer.cs                - Central game controller + chunk unloading
        ServerConfig.cs              - JSON config model
        DayNightCycle.cs             - Time/sky management
        Auth/
          AuthenticationService.cs  - Name validation, banning
          PrivilegeSystem.cs         - 15 privileges
        Chat/
          ChatCommandManager.cs      - /gamemode, /tp, /give
        Crafting/
          CraftingSystem.cs          - Recipe matching
        Smelting/
          SmeltingSystem.cs          - Furnace recipes
        Entities/
          Entity.cs                  - Item + Mob entity types
          EntityManager.cs           - Entity lifecycle
          MobSpawner.cs              - Mob spawning logic
        Game/
          BlockDefinition.cs         - Block property model
          BlockDefinitionManager.cs  - Block registry
        Physics/
          PhysicsEngine.cs           - Movement simulation
          KnockbackSystem.cs         - PvP knockback
        Player/
          Player.cs                  - Player state + armor + XP
          PlayerDatabase.cs          - SQLite player persistence
          Inventory.cs               - 32-slot inventory
        World/
          World.cs                   - Chunk storage, block ops, chunk unloading
          Chunk.cs                   - 16^3 block container
          BlockType.cs               - Block enum (68 types)
          Block.cs                   - Block data struct
          WorldPersistence.cs        - Chunk save/load
          BlockMetadataDatabase.cs   - SQLite chest/furnace/timer persistence
          AgricultureSystem.cs       - Crop growth
          ActiveBlockModifier.cs     - Periodic block changes
          NodeTimerSystem.cs         - Timed block events
          LightingEngine.cs          - BFS light propagation
          LightingSystem.cs          - Light wrapper
          Generators/
            NoiseWorldGenerator.cs   - Perlin terrain + trees
            FlatWorldGenerator.cs    - Flat test world
      Services/
        GameHub.cs                   - SignalR hub
        GameLoopService.cs           - 20 TPS background service
      Program.cs                      - DI setup, startup
    data/
      server_config.json             - Server settings (all categories)
      blocks.json                    - 68 block definitions
      items.json                     - Items, tools, recipes
      smelting.json                  - Smelting recipes
      privileges.json                - Privilege definitions
      worlds/default/                - World save data + SQLite DBs
    docs/
      architecture.md
      client-architecture.md
      communication.md
      data-models.md
      server-api.md
  README.md
  AGENTS.md
```

## Architecture Highlights

- **Client-server architecture**: TypeScript/Three.js browser client communicates with C# ASP.NET Core server via SignalR WebSocket
- **Server-authoritative physics**: Server validates player positions with previous-position tracking to prevent speed exploits
- **Texture atlas**: Procedurally generated textures composited into a single canvas for GPU-efficient rendering
- **Per-chunk meshing**: 16x16x16 meshes with per-face culling, configurable ambient occlusion, and UV mapping
- **Chunk unloading**: Both server and client unload distant chunks to manage memory
- **SQLite persistence**: Player data, chest inventories, furnace operations, and node timers survive server restarts
- **Luanti port**: Faithful reimplementation of core Minetest/Luanti systems (ABMs, node timers, tool groups, privileges)
- **Settings persistence**: Client settings saved to localStorage and wired to all game systems

## Controls

| Key | Action |
|-----|--------|
| WASD | Move |
| Mouse | Look |
| Left Click | Break block / Attack |
| Right Click | Place block / Interact |
| Space | Jump / Fly up |
| Shift | Sprint / Fly down |
| 1-8 | Select hotbar slot |
| E | Open crafting |
| F | Toggle fly mode |
| I | Creative inventory |
| O | Settings |
| P | Armor panel |
| T | Open chat |
| F3 | Debug overlay |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with both server and client running
5. Submit a pull request

## License

See LICENSE file for details.
