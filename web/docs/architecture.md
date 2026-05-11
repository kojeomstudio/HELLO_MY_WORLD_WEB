# Architecture Overview

HelloMyWorld is a web-based voxel game with a **TypeScript/Three.js client** and **C# ASP.NET Core 8.0/SignalR server**.

## System Overview

```
Browser (Client)                    Server
+------------------+    WebSocket    +------------------+
|  Vite Dev Server | -- /game -->    | ASP.NET Core 10 |
|  (localhost:5173)| -- proxy -->    | (localhost:5266) |
+------------------+                +------------------+
       |                                   |
  Three.js                          GameLoopService
  Renderer                         (BackgroundService)
       |                             20 TPS tick
  SignalR Client  <----SignalR--->   GameServer
```

The Vite dev server proxies `/game` WebSocket connections to the backend. In production, a reverse proxy (nginx/Caddy) handles routing.

## Communication Protocol

All client-server communication uses **SignalR** over WebSocket at the `/game` endpoint.

- **Hub methods**: Client invokes server (`connection.invoke('Method', args)`)
- **Client events**: Server pushes to client (`Clients.Caller.OnEvent(args)`)
- Rate limiting: Dig/place actions throttled to 250ms, chat to 500ms

See [server-api.md](server-api.md) for full method/event signatures.

## Server Architecture

### Core Components (`web/server/Core/`)

**GameServer** (`GameServer.cs`) — Central game state manager (Singleton). Holds:
- Player registry (`ConcurrentDictionary<string, Player>`)
- World instances (`ConcurrentDictionary<string, World>`)
- Chest inventories, active furnaces
- Game time, day/night cycle, mob spawner
- Per-tick updates: physics validation, entity updates, node timers, liquid flow, ABMs, agriculture, furnaces, mob spawning

**GameHub** (`Services/GameHub.cs`) — SignalR hub (`Hub<IGameClient>`). Handles:
- Player join/leave lifecycle
- Block interaction (dig/place/bucket/interact)
- Inventory management, crafting, smelting
- Chest UI, furnace UI, armor equip/unequip
- Chat messages and command dispatch

**GameLoopService** (`Services/GameLoopService.cs`) — `BackgroundService` running at 20 TPS. Per tick:
1. Calls `GameServer.Update()`
2. Processes item entity pickups (range: 2 blocks)
3. Broadcasts entity spawn/update/despawn events
4. Processes falling blocks (every 10 ticks)
5. Auto-saves player data and metadata every 60 seconds (1200 ticks)
6. Tracks TPS and logs warnings when behind

### World Management

**World** (`World/World.cs`) — Chunk storage and generation:
- `ConcurrentDictionary<ChunkCoord, Chunk>` — chunks generated on access via `GetChunk()`
- Liquid simulation: water flows every 3 ticks, lava every 5 ticks
- Water-lava interaction: water+source_lava -> obsidian, water+flowing_lava -> cobblestone
- Falling block detection, distant chunk unloading

**Chunk** (`World/Chunk.cs`) — 16x16x16 block volume:
- Each block stored as `Block(Type, Param1, Param2, Light)` — 4 bytes per block
- Serialized as 16,384-byte array (16^3 * 4 bytes)

- **WorldGenerator** (`World/Generators/`) — Nine generators:
- `NoiseWorldGenerator`: Perlin noise terrain with caves, ores, trees (default)
- `FlatWorldGenerator`: Flat grass world
- `MapgenV5`: 3D noise based terrain
- `MapgenV7`: Advanced terrain with mountains, rivers, floatlands (default in Minetest)
- `MapgenValleys`: River valley terrain with altitude-chill system
- `MapgenCarpathian`: Stepped mountain terrain
- `MapgenFractal`: Fractal-based terrain (Mandelbrot/Julia)
- `MapgenSinglenode`: Single block type world
- `MapgenV6`: Legacy terrain with 5 biome types, mud flow, desert temples

**LightingEngine** (`World/LightingEngine.cs`) — Static class:
- Sun light propagation from sky (flood fill downward)
- Artificial light propagation from emissive blocks (BFS)
- Packed light: 4 bits sun + 4 bits artificial = 1 byte
- Max light level: 15

### Player Management

**Player** (`Player/Player.cs`) — Player state:
- Position, velocity, yaw, pitch
- Health (20 max), breath (10 max), food level, saturation
- Inventory (32 slots), armor (4 slots: helmet/chestplate/leggings/boots)
- Game mode (Survival/Creative/Spectator)
- Experience, fall distance tracking

**Inventory** (`Player/Inventory.cs`) — Fixed-size slot array with add/remove/get operations.

**PlayerDatabase** (`Player/PlayerDatabase.cs`) — SQLite persistence for player data.

### Entity System

**EntityManager** (`Entities/EntityManager.cs`) — Tracks all entities:
- `ItemEntity`: Dropped items with position, lifetime, magnet range
- `MobEntity`: Hostile (Zombie, Skeleton, Spider) and passive (Cow, Pig, Chicken) mobs with AI pathfinding, attack, and mob-specific render properties (color, size)
- `ProjectileEntity`: Arrow/snowball entities with gravity, drag, block collision, and entity hit detection. Supports piercing (multishot) with configurable hit counts

**MobSpawner** (`Entities/MobSpawner.cs`) — Spawns mobs every 10s (max 50), weighted random selection with spawn height validation, despawns distant mobs (>128 blocks). Hostile mobs only spawn at night (ticks 13000–23000); passive mobs only spawn on grass during day.

**Mob Combat** — AI state machine (Idle → Chase → Attack) with 1s cooldown. Passive mobs flee when hit. PvP distance check (max 6 blocks). Mob definitions loaded from `web/data/mobs.json`.

**ExplosionSystem** (`World/ExplosionSystem.cs`) — Block destruction within radius with per-block resistance, item drops, entity/player damage with knockback, rollback integration for undo support. Triggered via `/explode` command or TNT blocks.

### Crafting & Smelting

**CraftingSystem** (`Crafting/CraftingSystem.cs`) — Recipe matching from inventory contents. 183 recipes loaded from `items.json`.

**GridCraftingSystem** (`Crafting/GridCraftingSystem.cs`) — Grid-based crafting with pattern offset matching and group support. Loaded from `gridRecipes` section in `items.json`. Integrated into `GetCraftingRecipes` hub method alongside `CraftingSystem`.

**SmeltingSystem** (`Smelting/SmeltingSystem.cs`) — Furnace operations with cook time and experience. 20 recipes from `smelting.json`. Fuel registry loaded from `fuels` section in `items.json` with configurable burn times.

### Other Systems

- **AgricultureSystem** (`World/AgricultureSystem.cs`) — Crop growth (wheat, carrot, potato)
- **NodeTimerSystem** (`World/NodeTimerSystem.cs`) — Scheduled block actions (farmland dehydration, grass spread, ice melting)
- **ActiveBlockModifierSystem** (`World/ActiveBlockModifier.cs`) — 14 registered ABMs: sand/gravel falling, dirt-to-grass, ice melt, fire spread, cactus/sugarcane growth, mushroom spread, snow spread, vine growth, coral spread/death, mud formation, attached node check, grass aggressive spread
- **ChatCommandManager** (`Chat/ChatCommandManager.cs`) — 70+ commands: /time, /gamemode, /tp, /give, /kill, /clear, /kick, /ban, /spawn, /privs, /setborder, /protect, /unprotect, /areas, /area_info, /setsky, /lighting, /hud, /fov, /weather, /spawnentity, /killall, /settime, /rollback, /emergeblocks, /fixlight, /setpassword, /deleteplayer, /reloadauth, /lastlogin, /mobs, /sethotbar, /physics, /invisible, /waypoint, /statistics, /deletewaypoint
- **PrivilegeSystem** (`Auth/PrivilegeSystem.cs`) — Permission management (interact, shout, fly, etc.)
- **AreaProtectionSystem** (`Protection/AreaProtection.cs`) — Advanced area protection with claim system, overlap detection, ownership transfer, bypass grants, JSON persistence
- **AuthenticationService** (`Auth/AuthenticationService.cs`) — Name validation (regex + reserved names including administrator, owner, staff, operator), ban checks, IP ban enforcement, server capacity, PBKDF2 (100k iterations, SHA256) password hashing with per-user random salt, constant-time comparison
- **PhysicsEngine** (`Physics/PhysicsEngine.cs`) — Server-authoritative movement validation with position correction, NaN/Infinity checks, block type range validation, player AABB overlap checks on placement
- **KnockbackSystem** (`Physics/KnockbackSystem.cs`) — Damage knockback calculation
- **ToolWearSystem** (`ToolWear/ToolWearSystem.cs`) — 65536-scale tool wear matching Minetest's wear system, integrated into dig and combat actions
- **SoundSpecManager** (`Sound/SoundSpecManager.cs`) — Block sound group definitions loaded from `sounds.json`, positional sound events
- **ExplosionSystem** (`World/ExplosionSystem.cs`) — Radius-based block destruction with resistance values, item drops, entity/player damage, rollback recording
- **Lightning System** — Thunderstorm weather generates lightning strikes that damage nearby players (8 damage at impact, falloff over 5 blocks) and can set fires on exposed blocks
- **PvP Combat** — Players can attack each other within 6 blocks using `AttackPlayer` hub method, requires `pvp` privilege, applies knockback and tracks damage statistics
- **Projectile System** — `ProjectileEntity` with gravity, drag, and collision. Supports arrows and snowballs with configurable damage and piercing
- **Security**: HTML/XML tag stripping in chat, security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, CSP with nonce, Referrer-Policy, Permissions-Policy, HSTS in production), configurable CORS origins from `server_config.json`, enhanced rate limiting (join spam, punch, interact), privilege escalation protection (no self-grant/self-revoke/server privilege protection), HTTPS redirection (configurable), periodic auto-save (player data + metadata every 60s)

## Client Architecture

### Entry Point (`main.ts`)
Creates `UIManager`, then `GameClient`, connects to server.

### GameClient (`GameClient.ts`) — Composition root / orchestrator
- Creates and wires all subsystems
- Manages SignalR connection and server event handlers
- Runs `requestAnimationFrame` game loop
- Periodic chunk requests (every 2s), distant chunk unloads (every 10s)
- Weather system (rain when sky brightness < 0.3, 20% chance otherwise)

### PlayerController (`player/PlayerController.ts`) — First-person controls
- Pointer lock camera with yaw/pitch
- WASD movement, space jump, shift sneak, ctrl sprint
- Client-side physics: gravity (20 m/s^2), collision detection, stepping
- Server-authoritative position correction: server validates movement and sends corrected positions when client deviates
- Client-side prediction/reconciliation: smooth interpolation for small corrections (<2 blocks), hard snap for large corrections
- Block raycasting (DDA algorithm) for dig/place targeting
- Dig timing with server-confirmed duration
- Flying mode toggle (double-space)

### WorldManager (`world/WorldManager.ts`) — Chunk management
- Stores loaded chunk meshes
- Requests chunks from server, rebuilds meshes on load
- Block/neighbor lookups across chunk boundaries
- Player entity tracking (remote players)
- Render distance culling

### ChunkMesh (`world/ChunkMesh.ts`) — Mesh generation
- Generates Three.js geometry per chunk
- Separates solid and transparent meshes
- Ambient occlusion per vertex (configurable)
- Smooth per-face lighting from 4 neighbor light samples (improves visual quality over flat lighting)
- Param2 color palette support for wool and colorable blocks (32 wool colors + generic RGB palette)
- Vegetation wind animation (leaves, pine needles, sugar cane)
- Texture atlas UV mapping (89 textures from Minetest DevTest, packed into atlas)
- Animated textures for water and lava (wave vertex displacement + frame cycling)
- Custom block geometry: stairs, slabs, fences, walls, glass panes, doors, ladders, torches, plant-like (cross), fire-like blocks

### Renderer (`rendering/Renderer.ts`) — Three.js scene management
- Scene, camera, WebGL renderer
- Sky color/brightness from day/night cycle
- Cloud system, weather effects
- Cave darkness overlay
- Lava proximity glow effect
- Damage flash effect
- Selection box rendering
- Shadow mapping (PCFSoft, 1024 map, sun directional light)
- Cascade Shadow Maps (3-cascade CSM) — renders shadow depth for near/mid/far cascade, merges into combined shadow texture. Wired into main render pipeline.
- Auto Exposure Pass — luminance-based exposure calculation with ACES tonemapping. Can be toggled via settings.
- Player-following point light for local illumination
- Animated water (wave effect, 0.45 opacity, lowered surface) and lava (wave effect, emissive vertex colors)
- Post-processing pipeline: EffectComposer with Bloom + FXAA + OutputPass, optional auto-exposure

### UIManager (`ui/UIManager.ts`) — HUD and UI panels
- Health bar (heart textures), breath bar (bubble textures)
- Hotbar with item display
- Chat overlay
- Debug info (FPS, position, chunk count)
- Death screen, creative inventory, crafting panel, chest UI, furnace UI, settings
- Settings panel (FOV, mouse sensitivity, render distance, AO, clouds, volume)

### Other Client Modules
- **InputManager** (`input/InputManager.ts`) — Keyboard/mouse state tracking with virtual input support for touch/gamepad (virtual keys, analog movement/look, gamepad polling via Web Gamepad API with deadzone)
- **TouchControls** (`input/TouchControls.ts`) — Mobile web touch controls with virtual joystick (left), action buttons (JUMP/DIG/USE/RUN), and camera look (right half drag). Auto-detected on touch-capable devices
- **AudioManager** (`audio/AudioManager.ts`) — Procedural audio via Web Audio API (8 sound types: block break, block place, footstep, hurt, pickup, death, note block, jukebox) plus material-based block sound groups (stone, dirt, grass, wood, leaves, glass, sand, gravel, cloth, metal, snow, water, lava)
- **Minimap** (`ui/Minimap.ts`) — 2D overhead minimap
- **WeatherSystem** (`world/WeatherSystem.ts`) — Rain and snow particle systems with cyclable weather modes
- **ParticleSystem** (`world/ParticleSystem.ts`) — Block break/place/damage particles
- **WieldItem** (`rendering/WieldItem.ts`) — First-person held item display
- **SelectionBox** (`rendering/SelectionBox.ts`) — Block targeting highlight
- **BlockRegistry** (`world/BlockRegistry.ts`) — Block definitions loaded from server, maps block types to texture atlas regions (101 block types with textures)
- **ItemRegistry** (`world/ItemRegistry.ts`) — Item definitions loaded from server, texture URL resolution for inventory display
- **SettingsPanel** (`ui/SettingsPanel.ts`) — Settings UI with persistence
- **ModLoader** (`modding/ModLoader.ts`) — Client-side mod loading system with lifecycle hooks (`onInit`, `onUpdate`, `onChatMessage`, `onDestroy`), custom chat command registration, and game API (player position, block get/set, chat). Wired into GameClient game loop and chat dispatch.
- **I18n** (`i18n/I18n.ts`) — Internationalization framework with translation lookup, parameter interpolation, locale auto-detection from browser settings. Supports English and Korean with 17 translation keys. Used in chat join/leave messages and UI labels.
- **EnrichedString** (`ui/EnrichedString.ts`) — Minetest-style color-coded chat support with § color codes (16 colors), bold/italic/underline formatting, HTML rendering, and plain text stripping
- **AutoExposurePass** (`rendering/AutoExposurePass.ts`) — Post-processing auto-exposure pass with ACES filmic tone mapping, luminance extraction, configurable exposure range. Integrated into Renderer's post-processing pipeline, toggleable via `setLighting({ autoExposure: true })`.

## World System

### Chunk Format
- Size: 16x16x16 blocks
- Block data: 4 bytes per block (Type:u8, Param1:u8, Param2:u8, Light:u8)
- Chunk serialized: 16,384 bytes

### Block Data
Each block has:
- `Type` (1 byte): BlockType enum value (0-250)
- `Param1`: Metadata (unused in most blocks)
- `Param2`: Liquid level (1-8 for flowing) or door state
- `Light`: Packed lighting (4-bit sun + 4-bit artificial)

### Block Types
251 block definitions in `BlockType.cs` enum and `blocks.json` (IDs 0-250). Full defaults in `BlockDefinition.cs` with JSON override via `blocks.json`. See [game-systems.md](game-systems.md) for full list.

### Chunk Meshing
- Only renders exposed faces (face culling against solid neighbors)
- Greedy meshing: adjacent same-color faces merged (implied by vertex count optimization)
- Ambient occlusion: 3-level AO per vertex using neighbor solid checks
- Light interpolation: samples 4 neighbor light values per face vertex
- Texture atlas: UV mapping into packed atlas (89 Minetest DevTest textures)
- Vegetation animation: top-face vertices displaced by sine wave

### Liquid Flow
- Water source (level 8) spreads to flowing (level 7->1), flows downward
- Lava source (level 8) spreads slower (every 5 ticks vs 3 for water)
- Water + lava source = obsidian, water + flowing lava = cobblestone

## Data Flow

### Player Join
```
Client                          Server
  |--- Join(name) -------------->|
  |                               |-> AuthService.AuthenticatePlayer()
  |                               |-> GameServer.PlayerJoin()
  |                               |-> Load from PlayerDatabase (if existing)
  |<-- OnPlayerJoined -----------|
  |<-- OnPlayerListUpdate -------|
  |<-- OnHealthUpdate -----------|
  |<-- OnInventoryUpdate --------|
  |<-- OnArmorUpdate ------------|
  |<-- OnTimeUpdate -------------|
  |<-- OnBlockDefinitions -------|
  |<-- OnChunkReceived x N ------|  (7x7x4 chunks around spawn)
```

### Block Interaction
```
Client                          Server
  |--- DigBlockStart(x,y,z) ---->|
  |<-- digTime -------------------|
  |   (client waits digTime)      |
  |--- DigBlock(x,y,z) --------->|
  |                               |-> World.SetBlock(Air)
  |                               |-> ItemEntity created (drop)
  |                               |-> Tool durability check
  |<-- OnBlockUpdate ------------|
  |<-- OnInventoryUpdate --------|
  |<-- OnEntitySpawned ----------|  (dropped item)
```

### Crafting
```
Client                          Server
  |--- InteractWithBlock(x,y,z)->|  (crafting_table)
  |<-- OnCraftingRecipes --------|
  |--- CraftRecipe(index) ------>|
  |                               |-> CraftingSystem.Craft()
  |<-- OnCraftResult ------------|
  |<-- OnInventoryUpdate --------|
```

### Smelting
```
Client                          Server
  |--- InteractWithBlock(x,y,z)->|  (furnace)
  |<-- OnSmeltingRecipes --------|
  |--- StartSmelting(input,result,x,y,z) ->|
  |<-- OnInventoryUpdate --------|
  |<-- OnFurnaceUpdate(progress) |  (periodic)
  |<-- OnInventoryUpdate --------|  (when complete)
  |<-- OnFurnaceUpdate(1.0) -----|
```

## Game Systems

### Day/Night Cycle
- Full cycle: 24,000 game ticks
- Dawn: 4500-6000, Day: 6000-16500, Dusk: 16500-18000, Night: 18000-4500
- Sky brightness: 0.2 (night) to 1.0 (day), smooth transitions

### Biomes & Terrain
- Noise-based terrain generation (Perlin noise)
- Ground base: Y=32, terrain variation: ±20 blocks
- Water level: Y=28
- Biomes: grassland, forest, desert, snow, taiga, jungle, savanna, mountains, swamp, ocean, plus ocean/underground variants (14 total from `biomes.json`)
- Trees generated with trunk + canopy (oak, jungle, pine variants)

### Caves & Ores
- 3D noise cave carving (threshold-based)
- Ore placement: iron (deep), coal (all depths), gold (mid-deep), diamond (deep)

### Dungeons
- Generated underground by `NoiseWorldGenerator`

### Active Block Modifiers (ABMs)
- Sand falling: sand/gravel falls when block below is air (checked every 2 ticks)
- Runs via `GameServer.Update()` per tick

### Node Timers
- Scheduled block changes:
  - Farmland reverts to dirt after 30s without nearby water
  - Grass spreads to adjacent dirt (10-30s random delay)
  - Ice melts near light sources (5-10s delay)

### Liquid Flow
- Water: flows every 3 ticks, source level 8, spreads to 1
- Lava: flows every 5 ticks, same level system
- Water+lava interactions (obsidian/cobblestone)

### Lighting
- Sun light: propagated from sky downward through transparent blocks
- Artificial light: BFS from emissive blocks (torch=14, lava=14, glowing obsidian=14)
- Combined: max(sun, artificial) for final light level

## Configuration

All configuration loaded from `web/data/server_config.json`:
- Server: max players (100), tick rate (20), port (5266)
- World: generator type, chunk size (16), render distance (4), seed, tree/cave/ore generation, world border
- Player: health (20), breath (10), inventory size (32), hotbar size (8), fall damage, start items
- Physics: gravity, jump force, speeds, terminal velocity, ranges, drag
- Day/night: cycle length, phase start times
- Network: protocol version, broadcast intervals, chunk compression
- Liquid: flow intervals
- Auth: PBKDF2 iterations, salt/hash sizes, password length, lockout policy, name pattern, reserved names
- Security: HTTPS redirection, HSTS max-age, CSP nonce size, max concurrent connections
- CORS: configurable allowed origins (`corsOrigins` array)
- Chat: max length, rate limit per 10 seconds

## Texture System

- **Texture atlas**: All block textures packed into a single atlas texture (89 textures from Minetest DevTest)
- **Runtime loading**: Atlas generated at startup from individual texture images
- **UV mapping**: Each block face maps to its region in the atlas via normalized UV coordinates
- **Animated textures**: Water (wave vertex displacement, 0.45 opacity) and lava (wave displacement, emissive vertex colors)
- **Block-face mapping**: 101 block types each have tile references for top, bottom, and side faces

## Server Physics Validation

The server performs authoritative movement validation to prevent cheating:

1. Client sends position updates via `UpdatePosition` hub method
2. Server's `PhysicsEngine` validates the move is physically possible (speed checks, collision checks)
3. If the client position deviates beyond a threshold, the server sends a corrected position via `OnPositionCorrection`
4. Client snaps to the corrected position seamlessly
5. Validation checks: max speed, teleportation detection, flying mode consistency, collision boundaries, NaN/Infinity checks, block type range validation, player AABB overlap on placement

## Dependency Injection

All server services registered as **Singleton** in `Program.cs`:
`ServerConfig`, `BlockDefinitionManager`, `WorldGeneratorFactory`, `SmeltingSystem`, `PrivilegeSystem`, `ActiveBlockModifierSystem`, `KnockbackSystem`, `PlayerDatabase`, `BlockMetadataDatabase`, `GameServer`, `AuthenticationService`, `ChatCommandManager`, `CraftingSystem`, `GridCraftingSystem`, `EntityManager`, `AreaProtectionSystem`, `DetachedInventoryManager`, `ParticleSpawnerManager`, `GameLoopService` (hosted).

## Recent Improvements

### Bug Fixes
- **FallingBlockAnimation**: Fixed double-counting gravity (was using both Euler integration and kinematic equation simultaneously)
- **WeatherSystem**: Fixed rain particle update always being marked as dirty
- **Position throttle**: Client now sends position updates at 50ms intervals instead of every frame (~60Hz)
- **Lava damage cooldown**: Added 500ms cooldown to prevent 80 DPS instant death from lava
- **Starter items**: New players now correctly receive starting items only on first join (not on reconnect)
- **HTML sanitization**: Replaced regex-based tag stripping with proper HTML entity encoding to prevent XSS bypass
- **Rate limit cleanup**: Lowered cleanup threshold from 10k to 5k entries, improved join attempt cleanup
- **Chunk data validation**: Client validates incoming chunk data size before processing

### Hunger Bar System
- Server broadcasts food level via `OnFoodUpdate` SignalR event
- Client renders hunger bar with drumstick icons below the hotbar
- Updates on damage (starvation), food consumption, and player join

### Entity Distance Culling
- `BroadcastEntityEvents` in `GameLoopService` only sends entity updates to players within 128 blocks
- Significantly reduces network bandwidth for servers with many entities

### Audio Enhancements
- Footstep sounds triggered by `PlayerController` based on ground contact and horizontal movement
- Pickup sounds play when inventory is updated from server

### Improved Wield Item Rendering
- Block items now display with their correct material color instead of a uniform grey
- 20+ block type color mappings (stone, dirt, grass, sand, wood, leaves, glass, water, lava, etc.)

### Enhanced CI/CD Pipeline
- Security scanning job with secrets detection, npm audit, debug endpoint checks
- Data integrity job with JSON validation and texture asset verification
- .gitignore coverage validation

### Bug Fixes (Round 2)
- **MobSpawner IsNight()**: Fixed always-true night detection (`||` → `&&` for time range check)
- **MobSpawner spawn target**: Mobs now spawn around random players instead of always near world origin
- **MobSpawner despawn**: Distance-based despawn checks nearest player instead of origin reference
- **Baby mob growth**: Fixed speed doubling bug on baby→adult transition (`/= 0.5` → `*= 2.0`)
- **NodeTimerSystem GetAllTimers**: Fixed returning timeout string instead of actual block name
- **Fall damage**: Eliminated duplicate fall damage application between ground/not-ground branches
- **ClearAllEntities**: Now clears all entity types (mobs + items), not just item entities
- **Inventory.AddItem**: Fixed item loss when adding to partially full slots (proper overflow handling)
- **WeatherSystem rain**: Fixed double-position-offset bug in rain particle system
- **Entity bobbing**: Fixed frame-rate-dependent animation using `Date.now()` → accumulated `dt`

### Porting Completeness (Round 3)
- **ToolWearSystem integration**: Replaced inline durability tracking in `DigBlock` and `PunchPlayer` with centralized `ToolWearSystem.ApplyDigWear()`/`ApplyAttackWear()` matching Minetest's 65536 wear scale
- **Sound system integration**: `SoundSpecManager` now loads `sounds.json` at startup; sound group definitions available for all block types
- **Block sound groups**: Client `AudioManager` now plays material-specific procedural sounds (stone, dirt, grass, wood, leaves, glass, sand, gravel, cloth, metal, snow, water, lava) based on block's `soundGroup` property
- **Passive hunger drain**: Food saturation drains at 0.01/tick, food level drains at 0.05/tick when saturation depleted, matching Minetest's hunger mechanics
- **TNT explosion**: Right-click on TNT triggers radius-3 spherical explosion destroying blocks, damaging nearby players, and dropping items
- **Player head tracking**: Multiplayer player avatars now rotate their head mesh based on pitch from position updates
- **Creative mode flight**: Switching to creative/spectator mode auto-enables flight; switching back disables it
- **Furnace visual state**: Lit furnaces (active smelting) render with orange glow tint; unlit furnaces retain default color
- **Note block/jukebox routing**: Right-click on note_block and jukebox properly routes through interaction handler
- **Window blur handling**: InputManager dispatches blur event; PlayerController releases pointer lock and zeroes velocity on focus loss
- **Security hardening**: Removed legacy static salt from password verification, added self-revoke and server privilege revocation protection

### Porting Improvements (Round 4)
- **GridCraftingSystem**: Fully wired into DI and GameHub, providing grid-based crafting with pattern offset matching and item group support alongside the existing CraftingSystem
- **Per-account brute-force protection**: 5 failed password attempts on the same account triggers a 5-minute lockout, preventing password guessing attacks even with IP rotation
- **Password policy strengthening**: Minimum password length increased from 4 to 8 characters
- **WorldPersistence crash fix**: Replaced `int.Parse` with `int.TryParse` in chunk file loading to prevent server crash on malformed files
- **Player head mesh fix**: Removed duplicate head mesh in player avatar rendering (WorldManager.ts)
- **Enhanced CI pipeline**: Added client typecheck job and data integrity validation (JSON parsing + required file checks)

### Porting Improvements (Round 5)
- **Server-driven block sounds**: `SoundSpecManager.GetBlockSound()` now wired into `DigBlock`/`PlaceBlock` hub methods; `OnPlaySound` SignalR event sends positional sound data to all nearby players
- **Crouch/sneak system**: Left Ctrl toggles sneaking (0.3x walk speed, lowered camera by 0.3 units); server tracks `IsSneaking` on Player, broadcasts via `OnPlayerPositionUpdate`; other players' avatars scale Y to 0.85 when sneaking
- **Chat message types**: `OnChatMessage` now includes `messageType` parameter (`normal`, `system`, `announcement`, `private`, `raw`) with distinct CSS styling per type
- **Server-to-client particle protocol**: `OnSpawnParticle` SignalR event enables server-triggered particle effects at arbitrary positions
- **Baby mob rendering**: Entity spawn protocol now includes `entityName` (mob type) and `isBaby` flag; baby mobs render at 0.5x scale on client
- **Mob type data in entity spawn**: `OnEntitySpawned` extended with `entityName` field for proper mob-specific model selection
- **Screenshot system**: F12 key captures canvas to PNG and triggers download with timestamped filename
- **Mob pathfinding integration**: Mob AI chase state calls A* pathfinder (`Pathfinding.Pathfinder`) with jump/drop limits for obstacle avoidance

### Stability & Security Improvements (Round 6)
- **Periodic auto-save**: GameServer now auto-saves all player data and block metadata every 1200 ticks (60 seconds at 20 TPS), preventing data loss on server crash
- **SpawnEntity fix**: `SpawnEntity("item", ...)` no longer hardcodes "torch" — accepts actual item name and count via parameters
- **Graceful shutdown**: Server shutdown now saves all online players (not just metadata), uses timeout-based async wait instead of blocking `.GetAwaiter().GetResult()`
- **HTTPS redirection**: Configurable HTTPS redirection middleware for production environments (`security.enableHttpsRedirection` in config)
- **Expanded reserved names**: Added administrator, owner, staff, operator to reserved name list preventing impersonation
- **Configurable security parameters**: Auth settings (PBKDF2 iterations, lockout policy, password length, reserved names) and security settings (HSTS max-age, CSP nonce size, max connections) externalized to `server_config.json`
- **CSP nonce size from config**: Content Security Policy nonce generation uses configurable byte size from `security.cspNonceSize`
- **Port validation in CORS**: Origin validation now checks for valid port numbers (1-65535) to prevent malformed origin injection

### Porting Improvements (Round 7)
- **Touch Controls**: Mobile web virtual joystick and action buttons (JUMP/DIG/USE/RUN) with camera look via right-half drag. Auto-detected on touch-capable devices via `TouchControls.ts`
- **Gamepad Support**: Web Gamepad API integration with analog stick movement/look, button mapping (A=jump, B=dig, X=place, triggers=sprint/sneak), configurable deadzone (0.15)
- **Enriched String Chat**: Minetest-style § color codes (16 colors) with bold/italic/underline formatting, HTML rendering, and plain text stripping via `EnrichedString.ts`
- **Server Profiler**: Runtime performance profiling with per-metric avg/max/min tracking, gauge values (TPS, entities, players, chunks), frame timing, and text report API (`/api/profiler`, `/api/profiler/report`). Integrated into `GameLoopService` tick measurement

## Security Model

### Authentication & Authorization
- Player name validation: regex `^[a-zA-Z0-9_-]{1,20}$` + reserved name list (server, admin, system, console, root, moderator, administrator, owner, staff, operator)
- Password authentication with PBKDF2 (100,000 iterations, SHA256, 16-byte random salt, constant-time comparison)
- Legacy SHA256 hashes (no salt) are rejected — forced password reset required
- IP-based and name-based ban system (`AuthenticationService`)
- 19 privilege system with per-player grant/revoke loaded from `privileges.json`
- Privilege escalation protection: cannot self-grant, cannot self-revoke, `server` privilege cannot be revoked via command
- Server capacity enforcement (max players check)
- Per-account brute-force lockout (5 failed attempts → 5-minute lockout)
- Password length: 8-128 characters

### Input Validation
- HTML/XML tag stripping in chat messages (XSS prevention)
- Chat message length limits
- NaN/Infinity position validation
- Block type range validation (0-226)
- Player AABB overlap check on block placement
- Block interaction range check (8 blocks)
- World border enforcement with position clamping

### Rate Limiting
- Position updates: 50ms minimum interval
- Chat messages: 500ms minimum interval
- Block dig/place: 250ms minimum interval
- Player punch: 250ms minimum interval
- Block interaction: 250ms minimum interval
- Join spam prevention

### Network Security
- CORS origins restricted to configured list in `server_config.json` with port validation
- Security headers: X-Content-Type-Options: nosniff, X-Frame-Options: DENY, X-XSS-Protection: 1; mode=block, CSP with nonce
- SignalR WebSocket transport (no raw HTTP API exposure)
- Server-authoritative physics validation (anti-cheat)
- HTTPS redirection available for production (configurable)
- HSTS headers in production (configurable max-age)
- Graceful shutdown with timeout-based async data persistence

### Data Security
- No hardcoded secrets or credentials in source code
- `.gitignore` excludes `.env`, `*.key`, `*.pem`, `*.db`, `credentials.json`
- Database files (SQLite) excluded from version control
- World data excluded from version control
- CI pipeline includes automated secrets detection and npm audit

### Security Fixes (Round 8)
- **Kestrel connection limit**: Fixed `MaxConcurrentConnections` config applied after `builder.Build()` (was silently ignored). Now correctly configured before host build
- **Profiler endpoint auth**: `/api/profiler` and `/api/profiler/report` endpoints now require `server` privilege via query token. Previously unauthenticated
- **Removed misleading UseAuthorization**: Removed `app.UseAuthorization()` call without matching `UseAuthentication()` middleware
- **AttackPlayer server-side damage**: `AttackPlayer` hub method now computes damage from attacker's equipped weapon instead of trusting client-supplied value
- **Chat sanitization**: Removed server-side HTML entity encoding from `SanitizeChatMessage` — client already handles XSS protection via `textContent`/`EnrichedString.toHtml()`. Server now only strips control characters
- **Projectile validation**: `ShootProjectile` now validates NaN/Infinity on position/velocity and enforces 10-block spawn distance from player
- **Explosion validation**: `TriggerExplosion` now validates NaN/Infinity on coordinates, radius, and power
- **SignalR message size**: Reduced `MaximumReceiveMessageSize` from 128KB to 64KB to limit memory pressure from malicious clients
- **.gitignore**: Added `.npmrc`, `*.bak`, `*.backup`, `*.old` patterns

### Anti-Cheat
- Server-authoritative physics validation
- Teleport detection (position delta exceeds max speed)
- Noclip prevention (solid block collision checks)
- Hover detection (gravity enforcement when not flying)
- Position correction sent to clients on violation
- Fly mode requires privilege check

### Security Improvements (Round 9)
- **Account lockout**: `AuthenticationService` now implements `ConcurrentDictionary`-based lockout tracking — 5 failed password attempts triggers 5-minute account lockout, auto-expires after configured duration
- **IP connection rate limiting**: Middleware in `Program.cs` enforces 10 connections/minute per IP via `IsConnectionRateLimited()` check before all requests
- **Protection bypass privilege**: `ProtectionSystem` now accepts configurable bypass privilege (default: `protection_bypass`) via `SetPrivilegeBypass()`, integrated with `PrivilegeSystem`
- **Smelting fuel system**: `SmeltingSystem` now loads fuel items with burn times from `smelting.json` fuels array, provides `GetFuel()`/`IsFuel()`/`GetFuelBurnTime()` APIs
- **WorldManager enhancement**: Added `CreateDefaultWorld()`, `GetDefaultWorld()`, `SaveAll()`, `LoadWorld()`, `WorldCount` for multi-world management support
- **Protocol integration test**: CI now includes `protocol-test` job that builds server, starts it in background, and runs `test-protocol.mjs` to verify SignalR communication
