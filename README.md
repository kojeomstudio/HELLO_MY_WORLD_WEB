# HelloMyWorld Web Game

A web-based voxel game ported from the minetest_sub_project (Luanti/Minetest engine) to a modern TypeScript/Three.js client + C# ASP.NET Core 8.0/SignalR server architecture.

## Features

- **Voxel World**: Procedurally generated 3D world with noise-based terrain, caves, ores, schematic-based trees (oak, pine, jungle, birch, cactus), rivers, multi-room dungeons, and 10 biomes (grassland, forest, desert, snow, taiga, jungle, savanna, mountains, swamp, ocean) selected via heat/humidity noise
- **162 Block Types**: Including stone variants, 9 ore types (diamond, gold, iron, coal, redstone, emerald, lapis, copper), wood types (oak, jungle, pine), stairs/slabs, fences, walls, glass panes, doors, decorative blocks, flowers, mushrooms, utility blocks, light sources, fire, cobweb, vine, Nether/End blocks, redstone components, mud/mud brick blocks, huge mushroom blocks, and all wood variants (spruce/birch/jungle/acacia/dark oak doors, fences, planks)
- **251 Block Definitions**: Full block enum (IDs 0-250) with complete defaults in code and JSON data override, including mese block/ore, locked chest, rail, sapling, cloud, grass footsteps, nyan cat/rainbow, papyrus, coalstone, stone stairs, redstone repeater/comparator
- **247 Items**: Tools (wood/stone/iron/diamond/gold/steel/mese/titanium), special weapons (fire sword, ice sword, blood sword, heal sword, elemental sword, daggers), steel shears, alchemy ingredients, crafting materials, armor (leather/iron/gold/diamond), food, resources, utility items, and fishing/breeding drops
- **183 Crafting Recipes**: Shaped and shapeless recipes with group-based matching, including mese block, stone stairs, locked chest, rail, redstone components, mud bricks, and all tool/armor sets
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
- **Server-Authoritative Physics**: Anti-cheat with dedicated AntiCheatValidator integration (speed validation per movement mode, fly speed check, jump height validation, teleport detection, violation counting with progressive enforcement, move resistance awareness), noclip prevention, position correction
- **Lightning Damage**: Thunderstorm lightning strikes damage nearby players (falloff over 5 blocks) and can ignite fires on exposed surfaces
- **Explosion System**: Radius-based block destruction with per-block resistance, item drops, entity/player damage with knockback, rollback integration
- **Projectile System**: Arrow/snowball entities with gravity, drag, block collision, entity hit detection, and piercing support
- **PvP Combat**: Players attack each other (6-block range) via `AttackPlayer` hub method, requires `pvp` privilege, knockback and damage tracking
- **Smooth Lighting**: Per-face smooth lighting from 4 neighbor light samples for improved visual quality
- **Param2 Color Palette**: Wool blocks and colorable blocks support 32 colors via param2, with generic RGB palette for other blocks
- **Client Prediction**: Smooth position interpolation for server corrections (<2 blocks lerp), hard snap for large corrections
- **Cascade Shadow Map Rendering**: 3-cascade CSM fully wired into main render pipeline with depth rendering
- **Auto Exposure Pipeline**: ACES tone mapping with luminance-based auto-exposure integrated into post-processing
- **PvM**: Player vs mob combat with damage, knockback, and mob death drops
- **Fishing System**: Cast, wait, bite, reel phases with catch probabilities; accessible via hub methods
- **Breeding System**: Feed animals (cow/pig with wheat, chicken with seeds) to breed with baby mobs
- **Shared Noise System**: Reusable `PerlinNoise` class with fractal octave noise (configurable octaves/persistence/lacunarity), `NoiseParams` record for structured noise configuration, `PcgRandom` deterministic PRNG, `NoiseBuffer2D`/`NoiseBuffer3D` for pre-computed noise grids, eased/abs-value noise flags
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
- **Security Hardening**: InteractBlock privilege/protection/range checks, UseBucket protection, teleport coordinate validation, inventory slot bounds, NaN validation, ModStorage access control (server privilege for writes, interact+server for reads), FormspecRenderer XSS prevention (DOM-based hypertext rendering, CSS color validation, CSS property value validation, image URL sanitization), CAS-based area protection removal (TOCTOU-safe), periodic rate-limit dictionary cleanup, privilege escalation prevention (no granting to server-privileged players without server privilege), server-side damage calculation for PvP (no client-trusted damage values), profiler endpoint authentication (header-based with server privilege), Kestrel connection limit enforcement (configurable via server_config.json), NaN/Infinity validation on projectile/explosion coordinates, projectile spawn distance validation, world seed restricted to server privilege, stale connection cleanup on disconnect, configurable default connection limit (100)
- **Raycast API**: Server-side DDA voxel traversal for interaction range validation
- **Sky Parameters**: Server-driven sun/moon/stars/fog color via `/setsky` command
- **World Backup**: Periodic auto-backup every 30 minutes, `/backup` and `/restore` commands
- **Player Flags**: Invisible (hidden from other players), footstep sounds, zoom toggle per player
- **Dungeon Loot Tables**: Tiered loot (common/uncommon/rare/special) with varied items
- **Extended Drop Tables**: Per-block drop tables with rarity, tool group requirements, tool rating min/max, max drop items, inherit color support
- **Cascade Falling Nodes**: Stack-based iterative falling with neighbor cascade propagation, attached node drop support
- **VoxelArea**: Fast cuboid iteration utility with ZYX stride indexing, area operations (addArea, intersect, pad, contains, intersects)
- **Forceloading**: Persistent and transient chunk forceloading with reference counting and JSON persistence
- **Entity Lifecycle Callbacks**: Static events for entity spawn/despawn/step and mob activate/damage/death
- **Item Entity Improvements**: Collection radius, stuck-in-solid pushout, slippery block sliding
- **Wear Bar Colors**: Per-material tool wear bar color definitions
- **Server-Driven HUD**: Add/remove/change/clear HUD elements (text, image, statbar, waypoint, compass) via SignalR
- **Death Screen**: Formspec-styled death screen with respawn button
- **VoxelManipulator**: Bulk node read/write utility for mapgen and world manipulation (CopyFrom/CopyTo/Fill/Replace/Blit)
- **MMVManip**: Map-bound VoxelManipulator with InitialEmerge/BlitBackAll for map generation workflows
- **MapEditEvent System**: World change event dispatching with typed events (AddNode/RemoveNode/SwapNode/MetadataChanged), receiver pattern for subscriber notification
- **Advanced Ore Generation**: 6 ore placement algorithms — Scatter (noise-based), Vein (random-walk), Sheet (horizontal layer), Blob (spherical radius), Puff (3D thickness noise), Stratum (noise-contoured horizontal layers)
- **Entity Interpolation**: Smooth position transitions for mobs and items using hermite spline interpolation
- **Cloud Parameters Protocol**: Server-driven cloud density, thickness, height, and speed via SignalR `OnCloudParams` message
- **Dig Time Verification**: Server-side anti-cheat validates dig completion time against block hardness and tool speed
- **Loading Block Modifiers (LBM)**: Chunk-load-time block transformations with trigger block matching
- **Extended DrawTypes**: glasslike_framed (framed glass with edge borders), signlike (wall-mounted flat signs), raillike (connected rail segments)
- **Tool Group Capabilities**: Per-material group effectiveness (cracky, crumbly, choppy, snappy) and full punch interval configuration
- **Redstone Repeater/Comparator**: New redstone components with delay and signal comparison
- **Creative Search**: Real-time search by name or block ID with result highlighting
- **Frustum Culling**: Camera frustum-based chunk visibility culling for performance
- **Occlusion Culling**: 9-point raycast occlusion culling with progressive step increase (1.05x factor), configurable solid-block threshold, and early exit optimization
- **Cascade Shadow Maps**: Multi-cascade (1-4) shadow system with dynamic frustum fitting, block-boundary snapping, configurable split distances, bias, and map resolution
- **Auto-Exposure / Tone Mapping**: ACES filmic tone mapping shader with luminance-based auto-exposure, configurable min/max exposure range
- **Formspec System**: Server-driven UI system with formspec string parser (12 element types: size, label, button, field, textarea, list, image, box, dropdown, checkbox, bgcolor, container), predefined templates (chest, furnace, crafting, death screen), SignalR bidirectional communication
- **Mod Storage**: Persistent key-value storage per mod with JSON persistence, CRUD operations via SignalR hub methods
- **Connected NodeBox**: Fence, wall, and glass_pane blocks with bidirectional `connectsTo` connectivity (fences connect to all wood variants, walls connect to stone variants, glass panes connect to glass/iron bars)
- **Modding API**: Client-side mod loading system with lifecycle hooks and game API
- **Internationalization (i18n)**: Auto-detected browser locale with English/Korean translations, extensible framework
- **LiquidSimulator**: Full liquid flow simulation with viscosity-based speed, range-limited spread, source renewal, and water-lava interaction (obsidian/cobblestone/stone generation)
- **Post-Processing Pipeline**: Three.js EffectComposer with UnrealBloomPass (server-toggleable glow effects), FXAA anti-aliasing, ACES filmic tone mapping with auto-exposure (configurable min/max range), and tone mapping output
- **Player-Centric ABM Processing**: Active Block Modifiers only process chunks within player radius (3-chunk range) for scalable server performance
- **MapBlock Monoblock Optimization**: Chunks with all identical blocks serialize to 5 bytes (with 0xFF marker) instead of 16KB
- **Per-Block Dirty Tracking**: Chunks track modification state; only dirty chunks need saving
- **Anti-Cheat Validator**: Dedicated server-side AntiCheatValidator class integrated into SignalR hub, tracking per-player movement state with speed/fly/jump-height checks, violation counting with auto-correction, teleport distance threshold, physics override and move resistance awareness
- **Particle Spawner Lifecycle**: Server-side spawner expiration based on lifetime, automatic cleanup in update loop
- **Leveled NodeBox**: Dynamic-height blocks (snow layers, farmland) rendered with param2-based height and neighbor-aware side faces
- **Mod Channels**: Server-side inter-mod communication framework
- **i18n Framework**: Internationalization support with English/Korean translations
- **Formspec Components**: Reusable dropdown and scrollbar UI components
- **Item Color Tinting**: `/color` command to dye inventory items with hex colors
- **Bone Manipulation**: Server-driven entity bone rotation/scale (head tracking)
- **Per-Player FOV**: Server-driven FOV override via `/fov` command
- **L-System Tree Generation**: Axiom/rule-based procedural tree generation with turtle graphics (F/T/f/R/G commands, yaw/pitch/roll rotation, state push/pop), 5 predefined tree types (default, jungle, pine, large_oak, savanna_acacia), biome-specific placement, random variation support
- **Schematic Placement System**: JSON-based structure placement with per-node probability, Y-slice probability, rotation (0/90/180/270), force-place option, surface placement API; 2 predefined schematics (small_house, outpost_tower)
- **MapgenValleys**: River valley terrain generator with altitude-chill biome adjustment, noise-based river carving, configurable valley depth/width
- **MapgenCarpathian**: Terraced mountain terrain generator with step-height quantization, ridge noise for mountain ridges, stone surface at high altitudes, optional rivers
- **MapgenV7**: Full V7 terrain generator ported from minetest with dual terrain blending (base/alt via height_select noise), modulated persistence, 3D mountain terrain with density gradient, ridge/river carving via 3D noise, cave noise intersection (dual 3D), cavern noise with amplitude tapering, noise-driven dungeon placement, filler depth noise for surface variation
- **Async Job System**: Background job queue with concurrency limiting (4 parallel), progress tracking, cancellation, job status (Pending/Running/Completed/Failed/Cancelled), automatic cleanup of completed jobs
- **Tool Repair Crafting**: Combine two worn tools of the same type in the crafting grid to repair them; uses Minetest formula `new_wear = 65536 - (uses1 + uses2)`, respects disable_repair group
- **ModChannel Communication**: Join/leave/send messages on named mod channels via SignalR hub methods, inter-mod communication framework
- **Client Connection State Machine**: 5-state client lifecycle (Created/Connecting/Connected/Init/Game/Disconnected) replacing simple boolean, proper state transitions
- **Recipe Priority System**: 6-level priority enum (NoRecipe < ToolRepair < ShapelessAndGroups < Shapeless < ShapedAndGroups < Shaped) matching Minetest's crafting resolution order
- **Persistent Particle Spawners**: Server-driven spawner creation/deletion with configurable velocity/acceleration/size/expiration/collision parameters, time-based emission
- **Item Definition Sync**: Server sends items.json to client on join for server-authoritative item definitions
- **Minimap Modes**: Server-driven minimap mode list sent on join (surface/radar/normal)
- **Invulnerable Mode**: Players with invulnerable flag (spectator mode) are immune to all damage sources
- **Bouncy Block Physics**: Slime blocks apply velocity reversal on landing (percentage-based bounce), fall damage negated
- **Slippery Block Physics**: Ice and slippery blocks reduce ground friction for sliding movement
- **Block Floodable Property**: Blocks marked floodable can be replaced by liquid flow (plants, tall grass)
- **Block Pointable Property**: Blocks can disable player pointing/interaction (pointable=false)
- **Entity Glow**: Per-entity glow level for self-illumination rendering
- **Static Spawnpoint**: Configurable fixed spawn position via server_config.json (StaticSpawnX/Y/Z)
- **Find Free Position**: Teleport system finds safe non-solid positions near target coordinates
- **Extended Formspec Elements**: image_button, item_image_button, button_exit, button_url, anchor, position, scroll_container, container_end, textlist, background9, allow_close, formspec_version, real_coordinates, style_type, no_prepend
- **Weather Command**: `/weather <clear|rain|snow|thunder>` for manual weather control
- **Player-to-Player Teleport**: `/tpplayer <source> <target>` command
- **Use Tool Command**: `/use_tool <dig|hit> <group> [level] [uses]` for tool wear testing
- **Detach Command**: `/detach [radius]` to detach objects near player
- **Clear Objects Command**: `/clearobjects` to clear all entities
- **Periodic Auto-Save**: Player data and block metadata auto-saved every 60 seconds (1200 ticks), preventing data loss on server crash
- **Configurable Security Settings**: Auth parameters (PBKDF2 iterations, lockout policy, reserved names) and security settings (HTTPS redirection, HSTS, CSP nonce size) externalized to `server_config.json`
- **HTTPS Redirection**: Optional HTTPS enforcement for production deployments
- **Expanded Reserved Names**: Administrator, owner, staff, operator names blocked from registration to prevent impersonation
- **Config-Driven Game Systems**: All game balance values (auto-save interval, day/night cycle length, chat max length, password policy, account lockout) read from `server_config.json` instead of hardcoded
- **MapgenV7 External Config**: All noise parameters and feature toggles configurable via `mapgen_v7.json` (caves, dungeons, mountains, rivers, caverns, ores, dust)
- **MapgenV7 Data-Driven Ores**: Ore definitions loaded from `ores.json` (11 ores with biome filtering, cluster size/scarcity, Y range) with fallback to hardcoded defaults
- **MapgenV7 Data-Driven Decorations**: Decoration definitions loaded from `decorations.json` (12 decorations with biome filtering, place-on validation, schematic height variation)
- **MapgenV7 Data-Driven Trees**: Tree schematics loaded from `tree_schematics.json` (5 types with canopy shapes: sphere, cone, cylinder, none), L-system trees from `lsystem_trees.json`, biome-matched placement
- **Biome Blend Noises**: Smooth biome transitions using heat_blend and humidity_blend noises from `biomes.json`, weighted biome selection
- **Biome Dust**: Biome-specific dust nodes (snow layers in cold biomes) placed on exposed surfaces
- **Touch Controls**: Mobile web virtual joystick and action buttons (JUMP/DIG/USE/RUN) with camera look via right-half drag, auto-detected on touch-capable devices
- **Gamepad Support**: Web Gamepad API integration with analog stick movement/look, button mapping (A=jump, B=dig, X=place, triggers=sprint/sneak), configurable deadzone
- **Enriched String Chat**: Minetest-style § color codes (16 colors) with bold/italic/underline formatting in chat messages
- **Server Profiler**: Runtime performance profiling with per-metric avg/max/min tracking, gauge values, text report API (`/api/profiler`, `/api/profiler/report`)

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
│   │   │   ├── SelectionBox.ts  # Block selection overlay
│   │   │   ├── OcclusionCuller.ts # 9-point raycast occlusion
│   │   │   ├── CascadeShadowMap.ts # Multi-cascade shadows
│   │   │   └── AutoExposurePass.ts # ACES tone mapping
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
│   │   │   ├── InputManager.ts    # Keyboard/mouse/touch/gamepad input
│   │   │   └── TouchControls.ts   # Mobile virtual joystick and buttons
│   │   ├── ui/
│   │   │   ├── UIManager.ts     # All UI panels
│   │   │   ├── CraftingGridUI.ts # 3x3 crafting grid
│   │   │   ├── FormspecRenderer.ts # Server-driven UI
│   │   │   ├── EnrichedString.ts # Color-coded chat
│   │   │   ├── Minimap.ts
│   │   │   └── SettingsPanel.ts
│   │   └── audio/
│   │       └── AudioManager.ts  # Procedural audio
│   ├── modding/
│   │   └── ModLoader.ts        # Client mod system
│   └── i18n/
│       └── I18n.ts             # Internationalization
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
│   │   ├── Auth/                 # Authentication, privileges, protection, ban DB
│   │   ├── Chat/                 # Chat commands with privilege checks
│   │   ├── Crafting/             # Crafting system
│   │   ├── Entities/             # Entities, mobs (with AI states), spawner, fishing, breeding, projectiles
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
│   │   ├── ModStorage/           # Persistent mod key-value storage
│   │   ├── AsyncJobSystem.cs     # Background job queue with progress tracking
│   │   ├── UI/                   # Formspec parser and system
│   │   ├── Weather/              # Server weather system (rain, snow, thunderstorm)
│   │   └── World/                # World, chunks, generators, lighting, ABMs, redstone, explosions
│       │       ├── Generators/       # MapgenV5, V6, V7, Noise, Valleys, Carpathian, Fractal, Singlenode, Flat
    │       │   ├── NoiseSystem.cs        # Shared PerlinNoise, NoiseParams, PcgRandom, NoiseBuffer
│   │       │   ├── LSystemTree.cs        # L-system tree generation engine
│   │       │   ├── SchematicPlacer.cs    # Schematic placement with rotation/probability
│   │       │   ├── MapgenValleys.cs      # River valley terrain generator
│   │       │   └── MapgenCarpathian.cs   # Terraced mountain terrain generator
│   └── Services/
│       ├── GameHub.cs            # SignalR hub
│       └── GameLoopService.cs    # Background game loop
├── data/                # JSON configuration
│   ├── blocks.json       # 251 block definitions (IDs 0-250, full defaults in code)
│   ├── items.json        # 247 items, 183 recipes, food values, tool capabilities
│   ├── mobs.json         # 6 mob definitions
│   ├── tools.json        # 8 tool material definitions
│   ├── biomes.json       # 10 biome definitions with tree types and decorations
│   ├── tree_schematics.json # Tree schematic definitions (oak, pine, jungle, birch, cactus)
│   ├── lsystem_trees.json   # L-system tree definitions (5 types with axiom/rules)
│   ├── schematics.json      # Structure schematics (small_house, outpost_tower)
│   ├── mapgen_valleys.json  # Valleys generator config
│   ├── mapgen_carpathian.json # Carpathian generator config
│   ├── mapgen_v7.json      # V7 generator config (noise params, features)
│   ├── physics_constants.json
│   ├── privileges.json   # 19 privileges
│   ├── abm_config.json   # ABM modifier parameters (intervals, chances)
│   ├── server_config.json
│   ├── smelting.json     # 20 smelting recipes
│   ├── decorations.json
│   ├── ores.json
│   └── sky_params.json, day_night_ratio.json, sounds.json (15 groups), protection.json, game_constants.json, formspecs.json
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
- Game (dev): http://localhost:5173
- Game (prod): http://localhost:5266
- Server API: http://localhost:5266
- API Status: http://localhost:5266/api/status

### Production mode (single server):
```bash
# Windows
start-prod.bat

# Linux/macOS
chmod +x start-prod.sh
./start-prod.sh
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

# Linux/macOS - builds and tests
chmod +x test-protocol.sh
./test-protocol.sh

# Manual - requires server already running
node test-protocol.mjs
```

The test verifies: API status, SignalR connection, join/init protocol, position updates, chat, chunk requests, crafting recipes, and privilege system.

## CLI Test Tool

Comprehensive CLI-based feature testing with 20+ individual test suites:

```bash
# Run all tests (auto-starts server)
# Windows:
cli-test.bat
# Linux/macOS:
chmod +x cli-test.sh
./cli-test.sh

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
| /password <new_pw> <current_pw> | Set your account password (requires current password if one exists) |
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
| `/setpassword <player> <pw>` | Set another player's password (requires `password`) |
| `/clearpassword <player>` | Clear a player's password |
| `/remove_player <player>` | Remove a player's account data |
| `/auth_reload` | Reload authentication data |
| `/last-login <player>` | Show last login time for a player |
| `/rollback_check <x> <y> <z> <r>` | Check rollback data at position |
| `/emergeblocks <x1> <y1> <z1> <x2> <y2> <z2>` | Force-generate chunks in area |
| `/deleteblocks <x1> <y1> <z1> <x2> <y2> <z2>` | Delete blocks in area |
| `/fixlight <x1> <y1> <z1> <x2> <y2> <z2>` | Fix lighting in area |
| `/weather <clear|rain|snow|thunder>` | Set weather manually |
| `/tpplayer <source> <target>` | Teleport player to another player |
| `/use_tool <dig|hit> <group> [level] [uses]` | Apply tool wear for testing |
| `/detach [radius]` | Detach objects near player |
| `/clearobjects` | Clear all entities |
| `/pulverize` | Clear all entities |
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
- **Shared Noise System**: Reusable `PerlinNoise` class with fractal octave noise (configurable octaves/persistence/lacunarity), `NoiseParams` record for structured noise configuration, `PcgRandom` deterministic PRNG, `NoiseBuffer2D`/`NoiseBuffer3D` for pre-computed noise grids, eased/abs-value noise flags
- **MapgenV6**: Legacy minetest terrain generator with 5 biome types (Normal, Desert, Jungle, Tundra, Taiga), integer-noise-based biome selection, baseTerrainLevel dual-noise blending with steepness/height_select, mud flow simulation (2-pass slope sliding), V6-specific cave generation with configurable tunnel diameters, desert temple dungeons with desert_stone walls, biome-specific tree placement (jungle 4x density, apple trees by noise), snow/ice placement in cold biomes, dirt-to-grass conversion, configurable flags (jungles, biomeblend, mudflow, snowbiomes, flat, trees, temples)
- **Enhanced Biome System**: Weighted biome selection, vertical blending at biome transitions, heat/humidity blend noise for smooth borders, biome-specific cave liquids (water/lava), dust node placement (snow on surfaces), water top blocks (ice in cold biomes with configurable depth), river water/riverbed per biome, dungeon stair blocks per biome, underground biomes with lava cave liquid
- **Vein Ore Generation**: 6th ore placement algorithm using 3D noise contour intersection for continuous ore vein generation (diamond, iron, gold)
- **World Generation**: 10 biomes (grassland, forest, desert, snow, taiga, jungle, savanna, mountains, swamp, ocean) with heat/humidity noise, weighted biome selection with vertical blending, heat/humidity blend noise for smooth transitions, biome-specific cave liquids (water in jungle/swamp, lava in deep underground), dust nodes (snow in tundra/taiga/mountains), water top blocks (ice in cold biomes), river water/riverbed support, schematic-based trees (oak, pine, jungle, birch, cactus), river generation, 13 ore/mineral types with scatter, vein (3D noise contour), blob, puff, sheet, and stratum placement, multi-room dungeons with corridors and loot chests, cave systems with large caverns, random-walk tunnel generation with variable radius, biome-aware cave liquid filling. 9 map generators: Flat, Noise, V5, V6 (legacy with mud flow, 5 biome types, desert temples), V7 (default minetest terrain with dual-blend mountains/ridges/rivers), Valleys, Carpathian, Fractal, Singlenode
- **Security**: XSS-safe rendering (textContent/DOM APIs, CSS color validation), CORS-restricted origins with scoped headers/methods, CSP headers with nonce-based styles (no unsafe-eval, no unsafe-inline scripts/styles, frame-ancestors none), HSTS, Cross-Origin-Opener-Policy, Cross-Origin-Resource-Policy, Referrer-Policy, Permissions-Policy, HTML entity encoding for chat, sign text sanitization, player name sanitization, IP-based rate limiting with join cooldown, per-account brute-force lockout (5 failed attempts -> 5-minute lockout, keyed by IP+name to prevent cross-IP DoS), PBKDF2 password hashing (100k iterations, SHA256, random salt), constant-time comparison, privilege escalation protection (no self-grant/self-revoke/server privilege revocation), thread-safe privilege persistence, tiered privilege escalation protection, area protection with ownership checks, chest/furnace proximity validation, rollback recording, persistent ban database, block coordinate range validation, integrated AntiCheatValidator with per-player movement tracking (speed/fly/jump validation per physics mode, violation counting, position correction), input validation on /give (item whitelist) and /spawn (entity type whitelist) commands, rate limiting on all SignalR hub methods, configurable chat rate limit from server config, item ID validation on give commands, entity type validation on spawn commands, consistent password policy (8-char minimum, 128-char max), CI security scanning with fail-on-detect, npm audit in CI, minimal permissions for CI workflows, authenticated hub methods, explicit content-type whitelist for static files (no ServeUnknownFileTypes), SignalR max receive message size (128KB), runtime data files excluded from git, detached inventory creation restricted to server privilege, smelting item ID length validation, grid craft size validation, configurable Kestrel connection limit via MAX_CONNECTIONS env var, WORLD_SEED env var for deployment-safe seed configuration
- **CI**: GitHub Actions pipeline with Ubuntu + Windows server builds, NuGet caching, client typecheck+build, security scan, data integrity verification (JSON parsing + required file checks + schema consistency), root dependency install for test scripts, fail-on-missing .gitignore patterns
- **Environment Variables**: `WORLD_SEED` overrides server seed, `MAX_CONNECTIONS` sets Kestrel connection limit, `SERVER_URL` overrides test script target

## License

This project references the minetest_sub_project submodule which is licensed under LGPL-2.1+.
The web port code is its own project.
