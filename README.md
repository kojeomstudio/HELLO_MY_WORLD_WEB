# HelloMyWorld Web Game

A web-based voxel game ported from the minetest_sub_project (Luanti/Minetest engine) to a modern TypeScript/Three.js client + C# ASP.NET Core 8.0/SignalR server architecture.

## Features

- **Voxel World**: Procedurally generated 3D world with noise-based terrain, caves, ores, schematic-based trees (oak, pine, jungle, birch, cactus), rivers, multi-room dungeons, and 10 biomes (grassland, forest, desert, snow, taiga, jungle, savanna, mountains, swamp, ocean) selected via heat/humidity noise
- **161 Block Types**: Including stone variants, 9 ore types (diamond, gold, iron, coal, redstone, emerald, lapis, copper), wood types (oak, jungle, pine), stairs/slabs, fences, walls, glass panes, doors, decorative blocks, flowers, mushrooms, utility blocks, light sources, fire, cobweb, and Nether/End blocks
- **210+ Items**: Tools (wood/stone/iron/diamond/steel/mese), special weapons (fire sword, ice sword, blood sword, heal sword, elemental sword, daggers), steel shears, alchemy ingredients, crafting materials, armor, food, resources, and utility items
- **Crafting System**: 125+ recipes including shaped crafting, tool creation, special weapon recipes, ore block storage, copper processing, decoration recipes, armor, building blocks, food, and tool repair
- **Smelting System**: 25+ smelting recipes via furnace with fuel consumption
- **Bucket System**: Place and pick up water/lava, drink milk for healing
- **Tool Wear/Durability**: Tools degrade with use (minetest-matching 65536 wear scale), repair by combining two same-type tools
- **Player Mechanics**: Health, hunger, breath, fall damage, knockback, swimming, climbing, sprinting, flying, slippery blocks, move resistance
- **Experience System**: XP gains from mining, crafting, smelting, and mob kills with level progression
- **Mob System**: Hostile mobs (Zombie, Skeleton, Spider) and passive mobs (Cow, Pig, Chicken) with full AI state machine and pathfinding support
- **Entity System**: Dropped items with merge behavior, mob entities with AI, physics and lifespan
- **Dungeon Generation**: Multi-room procedural dungeons with corridors, mossy/stone brick walls, torch/lantern lighting, and loot chests
- **World Border**: Configurable size with position clamping
- **Interactive Blocks**: Sign text input, bed spawn point, note block/jukebox procedural audio, crafting table, chest, furnace
- **Day/Night Cycle**: Full 24000-tick day/night cycle with sky brightness transitions
- **Weather**: Rain particle system with day/night color transitions
- **Multiplayer**: Real-time multiplayer via SignalR WebSocket with chat, player list
- **Chat Commands**: 28+ commands with privilege enforcement
- **Privilege System**: 19 privileges fully loaded from JSON with per-command privilege checks
- **Inventory UI**: Hotbar, main inventory, crafting, furnace, chest, creative inventory, armor
- **Minimap**: 3 modes (surface, radar, normal) with player direction indicator
- **Active Block Modifiers**: Sand/gravel falling, farmland decay, grass spreading, dirt-to-grass, ice melting, fire spread, cactus/sugar cane growth, mushroom spreading
- **Agriculture**: Farmable crops (wheat, carrot, potato), farmland hydration
- **Persistence**: Player data, world chunks, block metadata, chest inventories, and node timers saved to disk
- **Server-Authoritative Physics**: Anti-cheat with speed validation, teleport detection, noclip prevention, position correction
- **PvP**: Distance check, weapon damage with Minetest knockback formula
- **Texture Atlas**: 89+ block textures from minetest devtest with nearest-neighbor filtering
- **Block Geometry System**: Custom mesh generation for stairs, slabs, fences, walls, glass panes, doors, ladders, torches, plants, fire
- **Procedural Audio**: Web Audio API generated sounds (no audio files needed)
- **Settings**: Mouse sensitivity, render distance, FOV, volume controls, cloud/AO toggles

## Architecture

```
web/
├── client/              # TypeScript/Vite/Three.js frontend
│   ├── src/
│   │   ├── main.ts              # Entry point
│   │   ├── GameClient.ts        # Central orchestrator
│   │   ├── rendering/           # Three.js rendering
│   │   │   ├── Renderer.ts      # Scene, camera, lights, sky
│   │   │   ├── CloudSystem.ts   # Procedural clouds
│   │   │   ├── WieldItem.ts     # First-person held item
│   │   │   └── SelectionBox.ts  # Block selection overlay
│   │   ├── world/               # World management
│   │   │   ├── WorldManager.ts  # Chunk load/unload
│   │   │   ├── ChunkMesh.ts     # Greedy mesh with AO
│   │   │   ├── BlockRegistry.ts # Block definitions
│   │   │   ├── ParticleSystem.ts
│   │   │   └── WeatherSystem.ts # Rain
│   │   ├── player/
│   │   │   └── PlayerController.ts  # FPS controller
│   │   ├── input/
│   │   │   └── InputManager.ts
│   │   ├── ui/
│   │   │   ├── UIManager.ts     # All UI panels
│   │   │   ├── Minimap.ts
│   │   │   └── SettingsPanel.ts
│   │   └── audio/
│   │       └── AudioManager.ts  # Procedural audio
│   └── public/
│       └── textures/
│           ├── blocks/              # 89+ block textures from minetest devtest
│           └── ui/                  # 97 base UI textures
│   └── package.json
├── server/              # C# ASP.NET Core 8.0 backend
│   ├── Program.cs                # Entry point, DI setup
│   ├── Core/
│   │   ├── GameServer.cs         # Main game logic
│   │   ├── ServerConfig.cs       # Configuration
│   │   ├── Vector3.cs / Vector3s.cs
│   │   ├── DayNightCycle.cs
│   │   ├── ToolConfig.cs         # Tool material definitions
│   │   ├── Auth/                 # Authentication, privileges
│   │   ├── Chat/                 # Chat commands with privilege checks
│   │   ├── Crafting/             # Crafting system
│   │   ├── Entities/             # Entities, mobs (with AI states), spawner
│   │   ├── Game/                 # Block definitions
│   │   ├── Pathfinding/          # A* pathfinding for mobs
│   │   ├── Physics/              # Physics, knockback
│   │   ├── Player/               # Player, inventory, DB
│   │   ├── ToolWear/             # Tool wear/durability system
│   │   ├── Smelting/             # Smelting system
│   │   └── World/                # World, chunks, generators, lighting, ABMs
│   └── Services/
│       ├── GameHub.cs            # SignalR hub
│       └── GameLoopService.cs    # Background game loop
├── data/                # JSON configuration
│   ├── blocks.json       # 161 block definitions (IDs 0-160)
│   ├── items.json        # 210+ items, 125+ recipes, food values, tool capabilities
│   ├── mobs.json         # 6 mob definitions
│   ├── tools.json        # 8 tool material definitions
│   ├── biomes.json       # 10 biome definitions with tree types and decorations
│   ├── tree_schematics.json # Tree schematic definitions (oak, pine, jungle, birch, cactus)
│   ├── physics_constants.json
│   ├── privileges.json   # 19 privileges
│   ├── server_config.json
│   ├── smelting.json     # 25+ smelting recipes
│   ├── decorations.json
│   ├── ores.json
│   └── sky_params.json, day_night_ratio.json, sounds.json, protection.json, game_constants.json
└── docs/                # Architecture documentation
```

## Quick Start

### Prerequisites
- .NET 8.0 SDK
- Node.js 18+
- npm

### Run both server and client:
```bash
# Windows
start.bat

# Linux/macOS
chmod +x start.sh
./start.sh
```

### Run individually:
```bash
# Server
dotnet run --project web/server/WebGameServer.csproj

# Client
cd web/client && npm install && npm run dev
```

### Access
- Game: http://localhost:5173
- Server API: http://localhost:5266
- API Status: http://localhost:5266/api/status

## Build

```bash
# Windows - Production build
build.bat

# Manual build
dotnet build web/server/WebGameServer.csproj --configuration Release
cd web/client && npm install && npm run build
```

## Communication

Client and server communicate via SignalR WebSocket (`/game` endpoint).
The Vite dev server proxies `/game` to the server.

## Controls

| Key | Action |
|-----|--------|
| WASD | Move |
| Mouse | Look |
| Left Click | Dig block / Use bucket |
| Right Click | Place block / Interact / Place liquid |
| Space | Jump |
| Shift | Sprint |
| F | Toggle fly |
| 1-8 | Select hotbar slot |
| T | Open chat |
| E | Open inventory |
| I | Creative inventory |
| O | Settings |
| P | Armor panel |
| F3 | Debug info |
| M | Minimap cycle |
| Esc | Release mouse |

## Chat Commands

| Command | Description |
|---------|-------------|
| /help | Show available commands |
| /status | Server status (TPS, players) |
| /tp x y z | Teleport to coordinates |
| /gamemode [s/c/a/sp] | Set game mode |
| /give player item [count] | Give item |
| /kill [player] | Kill player |
| /list | List online players |
| /time | Show game time |
| /settime 0-24000 | Set time of day |
| /privs [player] | Show privileges |
| /grant player priv | Grant privilege |
| /revoke player priv | Revoke privilege |
| /ban player | Ban player |
| /unban player | Unban player |
| /kick player | Kick player |
| /spawn type x y z | Spawn entity |
| /setborder size | Set world border size |
| /killall | Clear all entities |
| /stop | Shutdown server |
| /me action | Show chat action |
| /mods | List installed mods |
| /days | Show day count |
| /msg player message | Send private message |
| /giveme item [count] | Give item to self |
| /admin | Show server admin |

## Ported from minetest_sub_project

This project is a web port of the Luanti (formerly Minetest) voxel game engine, specifically based on the devtest game and engine features including:

- **Blocks**: All basenodes (stone, dirt, grass, sand, wood variants, ores, liquids, decorations) with full properties
- **Tools**: Full tool tier system (wood/stone/iron/steel/diamond/mese) matching minetest groupcap system
- **Tool Wear**: 65536-scale wear system matching minetest, tool repair via combining
- **Crafting**: Shaped and shapeless recipes with group-based matching
- **Physics**: AABB collision, gravity, liquid physics, knockback formula
- **Privileges**: Complete privilege system matching minetest's builtin definitions
- **Chat Commands**: Full command set matching minetest's builtin chat commands
- **Entities**: Item entities with merge behavior and TTL, mob entities with full AI state machine
- **Mob AI**: 5-state machine (Idle/Wander/Chase/Attack/Flee) with hostile/passive distinction
- **Pathfinding**: A* pathfinding matching minetest's pathfinder.cpp
- **Dungeons**: Multi-room procedural dungeons with corridors matching minetest's dungeongen
- **ABMs**: Falling nodes, grass spreading, farmland decay, ice melting, fire spread, crop growth
- **Liquid Physics**: Water/lava flow with level system, lava-water interaction
- **Day/Night Cycle**: Matching minetest's 24000-tick cycle
- **Textures**: 89+ block textures from minetest devtest with nearest-neighbor filtering
- **World Generation**: 10 biomes (grassland, forest, desert, snow, taiga, jungle, savanna, mountains, swamp, ocean) with heat/humidity noise, schematic-based trees (oak, pine, jungle, birch, cactus), river generation, 9 ore types with realistic depth distribution, multi-room dungeons with corridors and loot chests, cave systems with large caverns
- **Security**: XSS-safe rendering, CORS-restricted origins, player name sanitization, HTML tag stripping, rate limiting (thread-safe ConcurrentDictionary), security headers, anti-cheat physics validation, CI security scanning
- **CI**: GitHub Actions pipeline with Ubuntu + Windows server builds, client typecheck+build, security scan, data integrity verification

## License

This project references the minetest_sub_project submodule which is licensed under LGPL-2.1+.
The web port code is its own project.
