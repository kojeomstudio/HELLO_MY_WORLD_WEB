# HelloMyWorld

Web-based voxel game ported from the minetest_sub_project (Luanti engine v5.16.0-dev).

## Quick Start

See [web/README.md](web/README.md) for full documentation.

```bash
# Server (C# .NET 8.0)
dotnet run --project web/server

# Client (TypeScript/Vite)
npm run dev --prefix web/client
```

## Architecture

- **Client**: TypeScript 5.3 + Three.js 0.160 + Vite 5.0
- **Server**: C# .NET 8.0 + ASP.NET Core + SignalR
- **Communication**: WebSocket (SignalR)
- **Data**: JSON configuration files in `web/data/`

## Features

### World Generation
- Procedural terrain with Perlin noise (multi-octave)
- Biome system (sandy/normal biomes)
- Cave generation (3D noise intersection)
- Dungeon generation (stone/cobblestone rooms below Y=30)
- Ore veins (coal, iron, gold, diamond at depth-based layers)
- Tree generation (oak, pine, birch with deterministic seeded RNG)
- Gravel/clay deposits, flat world generator alternative

### Rendering & Visuals
- Three.js 3D scene with perspective camera (70 FOV)
- Chunk mesh building with per-face culling (solid vs transparent)
- Ambient occlusion (3-bit per vertex)
- Texture atlas system (32 PNG textures composited into canvas)
- Sky dome with sun mesh and day/night sky brightness
- Dynamic lighting system (sun light + artificial light propagation)
- Cloud system (procedural texture, drift, day/night color response)
- Weather system (rain particles with wind effect, fog density changes)
- Post-processing effects (damage flash, cave darkness vignette, lava overlay)
- Waving vegetation animation (leaves, pine needles, sugar cane)
- Block selection wireframe with dig progress overlay
- Minimap (3 modes: surface, radar, normal)
- Particle system (dig, place, damage, smoke effects)
- Wield item display with procedural 3D tool/block meshes and bob/swing animations

### Gameplay
- 64 block types with full property system (solid, transparent, liquid, light, damage, hardness, groups, sounds)
- Tool group-based mining speed (cracky, crumbly, choppy, snappy, dig_immediate)
- Tool material multipliers (wooden=2x, stone=4x, iron=6x, diamond=8x)
- Falling node animation (sand, gravel with gravity physics)
- Improved liquid simulation (level-based flow, horizontal spreading, water+lava interaction)
- Node timer system (farmland drying, grass spreading, ice melting)
- Crafting system (56+ shaped and shapeless recipes)
- Smelting system (15 recipes with furnace progress tracking)
- Chest inventory system (27-slot per-block storage)
- Food system (nutrition, saturation, healing)
- Tool durability with wear tracking
- Creative mode inventory UI (paginated grid with search/filter)
- Settings panel (mouse sensitivity, render distance, FOV, volumes, toggles)
- Player walk animation (multi-part body with limb swinging)

### Multiplayer
- Real-time multiplayer via SignalR WebSocket
- Chat system with message history and slash commands
- Chat commands: /help, /time, /tps, /gamemode, /tp, /give
- Player list panel
- PvP combat with knockback (Minetest formula)
- Privilege system (15 Minetest-compatible privileges)
- Authentication with name validation and IP banning

### Physics & Entities
- Server-authoritative player physics
- Gravity, collision detection with AABB and step-up
- Flying mode, sprinting, climbing (ladders)
- Liquid physics (swimming, sinking, drag)
- Fall damage with configurable threshold
- Drowning mechanics
- Mob spawning system (zombie, skeleton, spider, cow, pig, chicken)
- Mob AI (chase, attack, wander behaviors)
- Item entities with gravity, bounce, and 5-minute lifespan
- Auto item pickup within 2-block range
- Active Block Modifier system (sand/gravel falling)
- Day/night cycle with smooth sky transitions

### Server
- 20 TPS BackgroundService game loop
- Auto-save every 300 seconds
- World persistence (binary chunk files)
- Rate limiting (chat, dig, place)
- REST API status endpoint
- Swagger UI for development
- Configurable server settings via JSON
