# HelloMyWorld Web Game

A web-based voxel game ported from the minetest_sub_project (Luanti/Minetest engine) to a modern TypeScript/Three.js client + C# ASP.NET Core 10.0/SignalR server architecture.

## Features

- **Voxel World**: Procedurally generated 3D world with noise-based terrain, caves, ores, schematic-based trees (oak, pine, jungle, birch, cactus), rivers, multi-room dungeons, and 10 biomes (grassland, forest, desert, snow, taiga, jungle, savanna, mountains, swamp, ocean) selected via heat/humidity noise
- **162 Block Types**: Including stone variants, 9 ore types (diamond, gold, iron, coal, redstone, emerald, lapis, copper), wood types (oak, jungle, pine), stairs/slabs, fences, walls, glass panes, doors, decorative blocks, flowers, mushrooms, utility blocks, light sources, fire, cobweb, vine, Nether/End blocks, redstone components, mud/mud brick blocks, and all wood variants (spruce/birch/jungle/acacia/dark oak doors, fences, planks)
- **226 Block Definitions**: Full block enum (IDs 0-238) with complete defaults in code and JSON data override
- **220+ Items**: Tools (wood/stone/iron/diamond/gold/steel/mese/titanium), special weapons (fire sword, ice sword, blood sword, heal sword, elemental sword, daggers), steel shears, alchemy ingredients, crafting materials, armor (leather/iron/gold/diamond), food, resources, utility items, and fishing/breeding drops
- **Crafting System**: 166+ recipes including shaped crafting, tool creation, special weapon recipes, ore block storage, copper processing, decoration recipes, gold tool recipes, titanium recipes, armor, building blocks, food, and tool repair. Grid-based crafting system with pattern offset matching and item group support.
- **Fuel Registry**: Configurable fuel items with burn times loaded from `items.json` (coal, charcoal, wood, lava bucket, etc.)
- **Smelting System**: 20 smelting recipes via furnace with fuel consumption, correct ore-to-ingot and food mappings
- **Redstone System**: Power propagation through wires, source blocks (torch, lever, button, pressure plate), consumer toggling (lamps), repeaters (4-tick delay, signal boost), comparators (compare/subtract modes)
- **Liquid System**: Viscosity-based flow speed, range-limited horizontal spread, river water support, infinite source renewal, water-lava interaction (obsidian/cobblestone/stone)
- **Fishing System**: Cast, wait, bite, reel phases with catch probabilities (fish/junk/treasure)
- **Breeding System**: Feed animals to breed with baby mob growth
- **Area Protection**: Advanced claim-based area protection with ownership, transfer, bypass grants, and JSON persistence
- **Protection System**: Area-based protection zones with owner/allowed player lists
- **Rollback System**: Block change recording with player/time/area-based rollback support
- **Ban Database**: Persistent ban storage (JSON-backed) with IP and name banning
- **Sound Spec System**: 15 sound groups with procedural audio descriptors, eat/breaks/place_failed/punch_use events
- **Bucket System**: Place and pick up water/lava, drink milk for healing
- **Tool Wear/Durability**: Tools degrade with use via centralized ToolWearSystem (minetest-matching 65536 wear scale), integrated into dig and combat actions, repair by combining two same-type tools
- **Player Mechanics**: Health, hunger (passive drain matching Minetest), breath, fall damage, knockback, swimming, climbing, sprinting, flying, slippery blocks, move resistance
- **Experience System**: XP gains from mining, crafting, smelting, and mob kills with level progression
- **Mob System**: Hostile mobs (Zombie, Skeleton, Spider) and passive mobs (Cow, Pig, Chicken) with full AI state machine and pathfinding support
- **Entity System**: Dropped items with merge behavior, mob entities with AI, physics and lifespan
- **Dungeon Generation**: Multi-room procedural dungeons with corridors, mossy/stone brick walls, torch/lantern lighting, and loot chests
- **CavesRandomWalk**: Random-walk tunnel generation with variable radius (small/large) for natural cave networks
- **Expanded Ore Generation**: Scatter (noise-based), vein (random-walk blob), and sheet (horizontal layer) ore placement for 13 ore/mineral types
- **World Border**: Configurable size with position clamping
- **Interactive Blocks**: Sign text input, bed spawn point, note block/jukebox procedural audio, crafting table, chest, furnace, TNT explosion
- **Day/Night Cycle**: Full 24000-tick day/night cycle with sky brightness transitions
- **Sky Rendering**: Gradient sky dome with sunrise/sunset color transitions, sun positioning, moon, and star field
- **Weather**: Rain and snow particle systems with day/night color transitions, cyclable weather modes, server-driven weather broadcasting
- **Multiplayer**: Real-time multiplayer via SignalR WebSocket with chat, player list
- **Chat Commands**: 55+ commands with privilege enforcement
- **Privilege System**: 19 privileges fully loaded from JSON with per-command privilege checks
- **Password Authentication**: PBKDF2 (100k iterations, SHA-256) with per-user random salts, constant-time comparison, legacy SHA-256 migration support
- **Inventory UI**: Hotbar, main inventory, crafting, furnace, chest, creative inventory, armor
- **Minimap**: 3 modes (surface, radar, normal) with player direction indicator
- **Active Block Modifiers**: Sand/gravel falling, farmland decay, grass spreading (aggressive), dirt-to-grass, ice melting, fire spread, cactus/sugar cane growth, mushroom spreading, snow spread, attached node drop check, vine growth, coral spread/coral death, mud formation
- **Agriculture**: Farmable crops (wheat, carrot, potato), farmland hydration
- **Persistence**: Player data, world chunks, block metadata, chest inventories, node timers, and player privileges saved to disk
- **Server-Authoritative Physics**: Anti-cheat with speed validation, teleport detection, noclip prevention, position correction
- **PvP**: Distance check, weapon damage with Minetest knockback formula
- **PvM**: Player vs mob combat with damage, knockback, and mob death drops
- **Fishing System**: Cast, wait, bite, reel phases with catch probabilities; accessible via hub methods
- **Breeding System**: Feed animals (cow/pig with wheat, chicken with seeds) to breed with baby mobs
- **Texture Atlas**: 89+ block textures from minetest devtest with nearest-neighbor filtering
- **Block Geometry System**: Custom mesh generation for stairs, slabs, fences, walls, glass panes, doors, ladders, torches, plants, fire, glasslike (internal face removal)
- **Particle Spawner**: Configurable particle spawner system with server-side spec management
- **Settings**: Mouse sensitivity, render distance, FOV, volume controls, cloud/AO toggles
- **Mouse Wheel Hotbar**: Scroll to cycle through hotbar slots
- **Sneak Edge Detection**: Prevents falling off edges while sneaking
- **Step-up Collision**: Auto-step 0.6 blocks with ceiling clearance check
- **Server Collision Engine**: Per-axis AABB collision resolution with step-height support and proper ground detection
- **Third Person Camera**: F5 cycles through first-person, third-person rear, and third-person front views
- **Underwater Effects**: Blue overlay and fog when submerged in water
- **Head Bobbing**: Subtle walking/sprinting head bob animation
- **Server-Driven Physics**: Physics parameters (gravity, speed, jump, etc.) sent from server on join
- **Weather**: Server-driven weather system (rain, snow, thunderstorm) with day/night-aware probability and lightning generation
- **Grid Crafting UI**: 3x3 crafting grid interface with real-time recipe matching for crafting table interaction
- **Detailed Mob Models**: Multi-part geometry for each mob type (Zombie, Skeleton, Spider, Cow, Pig, Chicken) with name tags
- **Food Replacement**: Eating container foods (stew, soup) returns empty bowl to inventory
- **Per-Player Physics Override**: `/setphysics` command for custom gravity, jump, walk, sprint, fly per player
- **Bouncy Blocks**: Slime block bounce physics (80% velocity reversal), fall damage negated on bouncy blocks
- **Node Timer System**: Server-side node timers with persistence, used for farmland decay and crop growth
- **Block Damage/Healing**: All blocks with `Damage > 0` deal damage (fire, cactus, campfire, magma); blocks with `healPerSecond > 0` heal standing players
- **Dagger Fast Attack**: Daggers have 250ms punch cooldown (vs 500ms for other weapons)
- **Healing Weapons**: `heal_sword`, `heal_sword_super`, `dagger_heal` deal negative damage to heal players/mobs
- **Detached Inventory**: Shared inventories via `/detached` command and hub methods, with access control
- **Zoom FOV**: C key toggles zoom (50% FOV reduction) with smooth interpolation
- **Per-Player Speed Validation**: Server validates speed against physics overrides and block move resistance
- **HUD Waypoints**: Server-driven waypoints via `/waypoint` command with distance display and customizable colors, updated in real-time game loop
- **Server FOV Control**: Server can set client FOV via SignalR with smooth transition time
- **Detached Inventory UI**: Visual detached inventory panel for shared/trash inventories via `/detached` and `/trash` commands
- **Creative Mode**: No tool wear, no item drops on dig, infinite block placement
- **Lighting Settings**: `/set_lighting` command for runtime shadow intensity, exposure, ambient boost, bloom
- **HUD Flags**: `/hudflag <flag> [on|off]` to toggle HUD elements (hotbar, healthbar, crosshair, breathbar, hungerbar, minimap, debug, chat)
- **Entity Armor Groups**: Per-entity damage absorption (fleshy, fiery, icy) matching minetest armorball; mobs have configurable armor ratings
- **Block Properties**: NoJump (disables jumping), LiquidNoSwim (treats liquid as non-swimmable), BuildableTo (placement replaces block), AttachedNode, FallDamageAddPercent (per-block fall damage modifier)
- **Waving Blocks**: Plants (waving=1), leaves (waving=2), liquids (waving=3) flagged for client-side animation
- **New Blocks**: Mud, packed_mud, mud_bricks, mud_brick_stairs, mud_brick_slab; cobweb now has move resistance
- **Mob Nametags**: Server-defined nametags with configurable colors for all mob types
- **Mob Footstep Sounds**: `makesFootstepSound` flag per mob type for footstep audio
- **New Commands**: `/spawnmob <type> [x y z]`, `/killmobs`, `/getblock <x> <y> <z>`, `/setclouds <param> <value>`, `/setsky <sun|moon|stars|fog|reset>`, `/stats [player]`, `/worldinfo`, `/backup`, `/restore`, `/fov <player> <degrees>`, `/color <item> <hex>`, `/toggleflag <player> <flag>`, `/rollback <player> <seconds>`, `/rollbacktell <area> <seconds>`
- **Waving Animation**: Data-driven plant/leaf/liquid waving via block `waving` property; plantlike blocks sway with height-based X/Z displacement
- **Player Idle Animation**: Per-player breathing/swaying animation when standing still; smooth transitions between idle/walk
- **Entity Attachment**: Parent-child entity relationships with offset/rotation for riders and mounted entities
- **Advanced Mob AI**: Flee with pathfinding, idle look-around behavior, random direction changes during wander
- **Entity Visual Properties**: VisualScale, Infotext labels, AutoRotateSpeed per mob; configurable in mobs.json
- **Entity Persistence**: Mobs and items saved/loaded to disk on world save/load
- **Biome-Aware Mob Spawning**: Passive mobs spawn in biome-appropriate areas; hostile mobs boosted in dark areas
- **Spectator Mode**: No collision, invulnerable, flying; toggle via `/gamemode sp`
- **Player Statistics**: Track blocks mined/placed, distance walked, kills, deaths, crafting, damage (view via `/stats`)
- **Positional Audio**: 3D sound with distance attenuation (16-block max) and stereo panning
- **Security Hardening**: InteractBlock privilege/protection/range checks, UseBucket protection, teleport coordinate validation, inventory slot bounds, NaN validation
- **Raycast API**: Server-side DDA voxel traversal for interaction range validation
- **Sky Parameters**: Server-driven sun/moon/stars/fog color via `/setsky` command
- **World Backup**: Periodic auto-backup every 30 minutes, `/backup` and `/restore` commands
- **Player Flags**: Invisible (hidden from other players), footstep sounds, zoom toggle per player
- **Dungeon Loot Tables**: Tiered loot (common/uncommon/rare/special) with varied items
- **Redstone Repeater/Comparator**: New redstone components with delay and signal comparison
- **Creative Search**: Real-time search by name or block ID with result highlighting
- **Frustum Culling**: Camera frustum-based chunk visibility culling for performance
- **Modding API**: Client-side mod loading system with lifecycle hooks and game API
- **Mod Channels**: Server-side inter-mod communication framework
- **i18n Framework**: Internationalization support with English/Korean translations
- **Formspec Components**: Reusable dropdown and scrollbar UI components
- **Item Color Tinting**: `/color` command to dye inventory items with hex colors
- **Bone Manipulation**: Server-driven entity bone rotation/scale (head tracking)
- **Per-Player FOV**: Server-driven FOV override via `/fov` command

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
│   │   │   ├── ItemRegistry.ts
│   │   │   └── WeatherSystem.ts # Rain, snow, thunderstorm
│   │   ├── player/
│   │   │   └── PlayerController.ts  # FPS controller
│   │   ├── input/
│   │   │   └── InputManager.ts
│   │   ├── ui/
│   │   │   ├── UIManager.ts     # All UI panels
│   │   │   ├── CraftingGridUI.ts # 3x3 crafting grid
│   │   │   ├── Minimap.ts
│   │   │   └── SettingsPanel.ts
│   │   └── audio/
│   │       └── AudioManager.ts  # Procedural audio
│   └── public/
│       └── textures/
│           ├── blocks/              # 89+ block textures from minetest devtest
│           └── ui/                  # 97 base UI textures
│   └── package.json
├── server/              # C# ASP.NET Core 10.0 backend
│   ├── Program.cs                # Entry point, DI setup
│   ├── Core/
│   │   ├── GameServer.cs         # Main game logic
│   │   ├── ServerConfig.cs       # Configuration
│   │   ├── Vector3.cs / Vector3s.cs
│   │   ├── DayNightCycle.cs
│   │   ├── ToolConfig.cs         # Tool material definitions
│   │   ├── Auth/                 # Authentication, privileges, protection, ban DB
│   │   ├── Chat/                 # Chat commands with privilege checks
│   │   ├── Crafting/             # Crafting system
│   │   ├── Entities/             # Entities, mobs (with AI states), spawner, fishing, breeding
│   │   ├── Game/                 # Block definitions
│   │   ├── Inventory/            # Detached inventory manager
│   │   ├── Particles/            # Particle spawner specs
│   │   ├── Pathfinding/          # A* pathfinding for mobs
│   │   ├── Physics/              # Physics, knockback
│   │   ├── Player/               # Player, inventory, DB
│   │   ├── Rollback/             # Block change rollback system
│   │   ├── Sound/                # Sound spec manager
│   │   ├── ToolWear/             # Tool wear/durability system
│   │   ├── Smelting/             # Smelting system
│   │   ├── Weather/              # Server weather system (rain, snow, thunderstorm)
│   │   └── World/                # World, chunks, generators, lighting, ABMs, redstone
│   └── Services/
│       ├── GameHub.cs            # SignalR hub
│       └── GameLoopService.cs    # Background game loop
├── data/                # JSON configuration
│   ├── blocks.json       # 237 block definitions (IDs 0-236, full defaults in code)
│   ├── items.json        # 220+ items, 166+ recipes, food values, tool capabilities
│   ├── mobs.json         # 6 mob definitions
│   ├── tools.json        # 8 tool material definitions
│   ├── biomes.json       # 10 biome definitions with tree types and decorations
│   ├── tree_schematics.json # Tree schematic definitions (oak, pine, jungle, birch, cactus)
│   ├── physics_constants.json
│   ├── privileges.json   # 19 privileges
│   ├── abm_config.json   # ABM modifier parameters (intervals, chances)
│   ├── server_config.json
│   ├── smelting.json     # 20 smelting recipes
│   ├── decorations.json
│   ├── ores.json
│   └── sky_params.json, day_night_ratio.json, sounds.json (15 groups), protection.json, game_constants.json
└── docs/                # Architecture documentation
```

## Quick Start

### Prerequisites
- .NET 10.0 SDK
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
- Game (dev): http://localhost:5173
- Game (prod): http://localhost:5266
- Server API: http://localhost:5266
- API Status: http://localhost:5266/api/status

### Production mode (single server):
```bash
# Builds client, then serves both via the C# server
start-prod.bat
```

## Build

```bash
# Windows - Production build
build.bat

# Manual build
dotnet build web/server/WebGameServer.csproj --configuration Release
cd web/client && npm install && npm run build
```

## Protocol Test

Run the integration test script to verify client-server communication:

```bash
# Windows - builds and tests
test-protocol.bat

# Manual - requires server already running
node test-protocol.mjs
```

The test verifies: API status, SignalR connection, join/init protocol, position updates, chat, chunk requests, crafting recipes, and privilege system.

## CLI Test Tool

Comprehensive CLI-based feature testing with 20+ individual test suites:

```bash
# Run all tests (auto-starts server)
cli-test.bat

# Run specific suites
cli-test.bat quick              # Quick smoke test
cli-test.bat protocol           # Full protocol sequence
cli-test.bat crafting smelting  # Specific suites

# Manual - requires server already running
node cli-test.mjs all           # All suites
node cli-test.mjs list          # List available suites
node cli-test.mjs multiplayer   # 2-player test
```

Available test suites: `api-status`, `connection`, `position`, `chat`, `chunk`, `block-ops`, `crafting`, `smelting`, `inventory`, `privileges`, `armor`, `fishing`, `entity`, `gamemode`, `teleport`, `give`, `worldborder`, `daynight`, `interact`, `bucket`, `multiplayer`, `full-protocol`, `privs`, `respawn`, `sign`, `detached`, `waypoint`, `mob-commands`, `block-props`

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
| Scroll Wheel | Cycle hotbar slot |
| Space | Jump |
| Shift | Sprint |
| Left Ctrl | Toggle sneak/crouch |
| F | Toggle fly |
| 1-8 | Select hotbar slot |
| T | Open chat |
| E | Open inventory |
| I | Creative inventory |
| O | Settings |
| P | Armor panel |
| F3 | Debug info |
| B | Toggle weather |
| C | Toggle zoom FOV |
| F5 | Cycle camera mode |
| F12 | Screenshot |
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
| /grant player priv | Grant privilege (no self-grant; basic_privs limited to interact/shout) |
| /revoke player priv | Revoke privilege |
| /password <pw> | Set your account password |
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
| /protect x1 y1 z1 x2 y2 z2 | Claim protection area |
| /unprotect id | Remove protection area |
| /areas | List your protected areas |
| /area_info x y z | Show protection at position |
| /hp value | Set your health |
| /hotbar size | Set hotbar size (1-9) |
| /setphysics player gravity jump walk sprint fly | Override player physics |
| /resetphysics [player] | Reset physics to defaults |
| /waypoint name x y z [color] | Add a waypoint marker |
| /detached name size | Create a detached inventory |
| /trash | Open shared trash inventory |
| /stuff | Give initial starter items to yourself |
| /infplace [on|off] | Toggle infinite block placement |
| /days | Show current day count |
| /mods | List ported game features |
| /whois <player> | Show player info (mode, HP) |
| /ping | Check connection latency |
| /clear | Clear chat history |
| /set_lighting [shadow] [exposure_min] [exposure_max] [ambient] [bloom] | Set lighting params (/set_lighting reset) |
| /hudflag <flag> [on|off] | Toggle HUD element (hotbar, healthbar, crosshair, breathbar, hungerbar, minimap, debug, chat) |
| /spawnmob <type> [x y z] | Spawn mob at location (Zombie, Skeleton, Spider, Cow, Pig, Chicken) |
| /killmobs | Kill all mob entities |
| /getblock <x> <y> <z> | Get block info at coordinates |
| /setclouds <param> <value> | Set cloud params (density, thickness, height, speed, reset) |
| `/setsky <sub> <value>` | Set sky params (sun, moon, stars, fog, reset) |
| `/stats [player]` | Show player statistics |
| `/worldinfo` | Show world seed, chunks, entities, uptime |
| `/backup` | Create world backup |
| `/restore` | Restore recent backup |
| `/fov <player> <deg>` | Set player FOV (30-110) |
| `/color <item> <hex>` | Tint an item color |
| `/toggleflag <p> <flag>` | Toggle player flags (invisible, footstep, zoom) |
| `/rollback <p> <secs>` | Rollback player block changes |
| `/rollbacktell <area> <s>` | Rollback area block changes |
| `/gamemode [s/c/a/sp]` | Set game mode (sp=spectator) |

## Ported from minetest_sub_project

This project is a web port of the Luanti (formerly Minetest) voxel game engine, specifically based on the devtest game and engine features including:

- **Blocks**: All basenodes (stone, dirt, grass, sand, wood variants, ores, liquids, decorations) with full properties
- **Tools**: Full tool tier system (wood/stone/iron/steel/diamond/mese) matching minetest groupcap system
- **Tool Wear**: 65536-scale wear system matching minetest, tool repair via combining
- **Crafting**: Shaped and shapeless recipes with group-based matching
- **Physics**: AABB collision, gravity (9.81 m/s^2), liquid physics, knockback formula
- **Privileges**: Complete privilege system matching minetest's builtin definitions
- **Chat Commands**: Full command set matching minetest's builtin chat commands
- **Entities**: Item entities with merge behavior and TTL, mob entities with full AI state machine
- **Mob AI**: 5-state machine (Idle/Wander/Chase/Attack/Flee) with hostile/passive distinction
- **Pathfinding**: A* pathfinding matching minetest's pathfinder.cpp, wired to mob AI for intelligent navigation
- **Dungeons**: Multi-room procedural dungeons with corridors matching minetest's dungeongen
- **ABMs**: Falling nodes, grass spreading, farmland decay, ice melting, fire spread, crop growth, vine growth, coral spread/death, mud formation (configurable via `data/abm_config.json`)
- **Liquid Physics**: Water/lava flow with level system, lava-water interaction
- **Day/Night Cycle**: Matching minetest's 24000-tick cycle
- **Textures**: 89+ block textures from minetest devtest with nearest-neighbor filtering
- **World Generation**: 10 biomes (grassland, forest, desert, snow, taiga, jungle, savanna, mountains, swamp, ocean) with heat/humidity noise, schematic-based trees (oak, pine, jungle, birch, cactus), river generation, 13 ore/mineral types with scatter, vein, and sheet placement, multi-room dungeons with corridors and loot chests, cave systems with large caverns, random-walk tunnel generation with variable radius
- **Security**: XSS-safe rendering (textContent/DOM APIs, CSS color validation), CORS-restricted origins with scoped headers/methods, CSP headers (no unsafe-eval, no unsafe-inline scripts, frame-ancestors none), HSTS, Cross-Origin-Opener-Policy, Cross-Origin-Resource-Policy, Referrer-Policy, Permissions-Policy, HTML entity encoding for chat, sign text sanitization, player name sanitization, IP-based rate limiting with join cooldown, per-account brute-force lockout (5 failed attempts -> 5-minute lockout, keyed by IP+name to prevent cross-IP DoS), PBKDF2 password hashing (100k iterations, SHA256, random salt), constant-time comparison, privilege escalation protection (no self-grant/self-revoke/server privilege revocation), thread-safe privilege persistence, tiered privilege escalation protection, area protection with ownership checks, chest/furnace proximity validation, rollback recording, persistent ban database, block coordinate range validation, server-authoritative physics with speed hack detection and position correction, input validation on /give (item whitelist) and /spawn (entity type whitelist) commands, rate limiting on all SignalR hub methods, item ID validation on give commands, entity type validation on spawn commands, consistent password policy (8-char minimum), CI security scanning with fail-on-detect, npm audit in CI, minimal permissions for CI workflows, authenticated hub methods, explicit content-type whitelist for static files (no ServeUnknownFileTypes), SignalR max receive message size (256KB), runtime data files excluded from git, detached inventory creation restricted to server privilege, smelting item ID length validation, grid craft size validation
- **CI**: GitHub Actions pipeline with Ubuntu + Windows server builds, client typecheck+build, security scan, data integrity verification (JSON parsing + required file checks)

## License

This project references the minetest_sub_project submodule which is licensed under LGPL-2.1+.
The web port code is its own project.
