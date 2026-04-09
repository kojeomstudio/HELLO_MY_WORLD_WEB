# HelloMyWorld Web Game

A web-based voxel game ported from the minetest_sub_project (Luanti engine) to a modern TypeScript/Three.js client + C# ASP.NET Core 8.0/SignalR server architecture.

## Features

- **Voxel World**: Procedurally generated 3D world with noise-based terrain, caves, ores, trees, and biomes
- **101 Block Types**: Including stone variants, ores, wood types, decorations, liquids, light sources, and Nether/End blocks
- **120+ Items**: Tools (wood/stone/iron/diamond/steel/mese), weapons, armor, food, resources, and utility items
- **Crafting System**: 122+ recipes including shaped crafting, tool creation, armor, building blocks, food, and tool repair
- **Smelting System**: 25+ smelting recipes via furnace with fuel consumption
- **Bucket System**: Place and pick up water/lava, drink milk for healing
- **Player Mechanics**: Health, hunger, breath, fall damage, knockback, swimming (liquid physics), climbing, sprinting, flying, slippery blocks (ice), move resistance (soul sand)
- **Experience System**: XP gains from mining, crafting, smelting, and mob kills with level progression
- **Mob System**: Hostile mobs (Zombie, Skeleton, Spider) and passive mobs (Cow, Pig, Chicken) with AI and death drops
- **Entity System**: Dropped items, mob entities, with physics and lifespan
- **Day/Night Cycle**: Full day/night cycle with sky brightness transitions
- **Weather**: Rain particle system with day/night color transitions
- **Multiplayer**: Real-time multiplayer via SignalR WebSocket with chat, player list
- **Chat Commands**: 18+ commands (/help, /tp, /gamemode, /give, /status, /kill, /ban, /kick, /privs, /grant, /revoke, /settime, /spawn, etc.)
- **Privilege System**: 19 privileges (interact, shout, fly, fast, teleport, give, ban, kick, server, etc.)
- **Inventory UI**: Hotbar, main inventory, crafting, furnace, chest, creative inventory, armor
- **Minimap**: 3 modes (surface, radar, normal) with player direction indicator
- **Physics**: AABB collision, gravity, liquid physics, falling nodes
- **Active Block Modifiers**: Sand/gravel falling, farmland decay, grass spreading, ice melting
- **Agriculture**: Farmable crops (wheat, carrot, potato), farmland hydration from nearby water
- **Node Timers**: Timed block transformations with persistence
- **Persistence**: Player data, world chunks, block metadata, chest inventories, and node timers saved to disk
- **Crop Planting**: Plant wheat, carrot, and potato seeds on farmland via block placement
- **Server-Authoritative Physics**: Speed validation, teleport detection, noclip prevention, anti-hover gravity, and position correction
- **Tool Repair**: Combine two damaged tools of the same type to repair them
- **Texture Atlas**: 89 block textures from minetest devtest, served via Vite and rendered with nearest-neighbor filtering
- **Position Correction**: Server sends position corrections to clients when physics violations are detected
- **Mob Rendering**: Type-specific colors, sizes, and animations for all 6 mob types
- **Procedural Audio**: Web Audio API generated sounds (no audio files needed)
- **Settings**: Mouse sensitivity, render distance, FOV, volume controls, cloud/AO toggles
- **Debug Info**: FPS counter, position display, chunk count

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
│           ├── blocks/              # 89 block textures from minetest devtest
│           └── ui/                  # 97 base UI textures
│   └── package.json
├── server/              # C# ASP.NET Core 8.0 backend
│   ├── Program.cs                # Entry point, DI setup
│   ├── Core/
│   │   ├── GameServer.cs         # Main game logic
│   │   ├── ServerConfig.cs       # Configuration
│   │   ├── Vector3.cs / Vector3s.cs
│   │   ├── DayNightCycle.cs
│   │   ├── Auth/                 # Authentication, privileges
│   │   ├── Chat/                 # Chat commands
│   │   ├── Crafting/             # Crafting system
│   │   ├── Entities/             # Entities, mobs, spawner
│   │   ├── Game/                 # Block definitions
│   │   ├── Physics/              # Physics, knockback
│   │   ├── Player/               # Player, inventory, DB
│   │   ├── Smelting/             # Smelting system
│   │   └── World/                # World, chunks, generators, lighting, ABMs
│   └── Services/
│       ├── GameHub.cs            # SignalR hub
│       └── GameLoopService.cs    # Background game loop
├── data/                # JSON configuration
│   ├── blocks.json       # 101 block definitions
│   ├── items.json        # 120+ items, 112+ recipes, food values, tool capabilities
│   ├── biomes.json       # Biome definitions and noise parameters
│   ├── physics_constants.json  # Physics constants
│   ├── privileges.json   # 19 privileges
│   ├── server_config.json
│   └── smelting.json     # 25+ smelting recipes
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
# Server
dotnet build web/server/WebGameServer.csproj

# Client
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
| /killall | Clear all entities |
| /stop | Shutdown server |

## Ported from minetest_sub_project

This project is a web port of the Luanti (formerly Minetest) voxel game engine, specifically based on the devtest game and engine features including:

- **Blocks**: All basenodes (stone, dirt, grass, sand, wood variants, ores, liquids, decorations)
- **Tools**: Full tool tier system (wood/stone/iron/steel/diamond/mese) matching minetest groupcap system
- **Crafting**: Shaped and shapeless recipes with group-based matching
- **Physics**: AABB collision, gravity, liquid physics, knockback formula (m - m*e^(k*damage))
- **Privileges**: Complete privilege system matching minetest's builtin definitions
- **Chat Commands**: Full command set matching minetest's builtin chat commands
- **Entities**: Item entities with TTL and merge behavior, mob entities with AI
- **ABMs**: Falling nodes, grass spreading, farmland decay, ice melting
- **Node Timers**: Timed block transformations
- **Day/Night Cycle**: Matching minetest's 24000-tick cycle
- **Ported Textures**: 89 block textures from minetest devtest (basenodes + wool colors) with nearest-neighbor filtering
- **World Generation**: Noise-based terrain with caves, ores, and trees
- **Tool Repair**: Matching minetest's tool repair system (combine two same-type tools)
- **Server Physics Validation**: Anti-cheat with teleport detection, noclip prevention, and hover detection

## License

This project references the minetest_sub_project submodule which is licensed under LGPL-2.1+.
The web port code is its own project.
