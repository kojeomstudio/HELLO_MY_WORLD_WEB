# HelloMyWorld Web Game

Web-based voxel game ported from the minetest_sub_project (Luanti engine v5.16.0-dev).  
Built with **TypeScript + Three.js** (client) and **C# ASP.NET Core 8.0 + SignalR** (server).

## Architecture

```
Client (Browser)          Server (ASP.NET Core 8.0)
TypeScript + Three.js      C# .NET 8.0 + SignalR
         |                          |
         +---- WebSocket/SignalR ---+
                    |
           Game World (C# Server)
                    |
         +-- Physics -- Knockback -- ABM --+
         |         |          |       |     |
     Entities  Falling   Privilege System  |
```

## Project Structure

```
web/
  server/                    # C# .NET 8.0 Backend
    Core/
      GameServer.cs          # Main game server controller
      DayNightCycle.cs       # Day/night cycle system
      Vector3.cs             # 3D vector math
      Vector3s.cs            # Short integer vector (block coords)
      ServerConfig.cs        # Server configuration models
      Auth/
        AuthenticationService.cs  # Authentication & ban system
        PrivilegeSystem.cs       # 15 Minetest privileges
      Chat/
        ChatCommandManager.cs    # Slash command system (/help, /time, /tp, /give, /gamemode)
      Crafting/
        CraftingSystem.cs        # Shaped/shapeless crafting recipes
      Entities/
        Entity.cs                # Entity system (items, mobs, projectiles)
        EntityManager.cs         # Thread-safe entity lifecycle
      Game/
        BlockDefinition.cs       # Block definition registry (64 types)
      Physics/
        PhysicsEngine.cs         # Server-side physics simulation
        KnockbackSystem.cs       # Minetest knockback formula
      Player/
        Player.cs                # Player state, health, inventory, armor
        PlayerState.cs           # Enums (PlayerState, GameMode)
        Inventory.cs             # ItemStack record, inventory management
      Smelting/
        SmeltingSystem.cs        # Furnace/smelting recipes
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
        ActiveBlockModifier.cs   # ABM system for periodic block modifications
        Generators/
          NoiseWorldGenerator.cs # Perlin noise terrain with biomes/caves/ores
          FlatWorldGenerator.cs  # Simple flat terrain
    Services/
      GameHub.cs               # SignalR communication hub (20+ methods)
      GameLoopService.cs       # Background game loop (20 TPS)
    Program.cs                 # Application entry point & DI
  client/                    # TypeScript Frontend
    src/
      main.ts                  # Entry point
      GameClient.ts            # Central orchestrator & SignalR client
      rendering/
        Renderer.ts            # Three.js scene setup & sky rendering
      world/
        WorldManager.ts        # Chunk management, player/entity rendering
        BlockRegistry.ts       # 64 block definitions with groups
        ChunkMesh.ts           # Greedy chunk mesh builder
      player/
        PlayerController.ts    # First-person controller with climbing/knockback
      input/
        InputManager.ts        # Keyboard/mouse state tracking
      ui/
        UIManager.ts           # HUD, chat, hotbar, death screen, crafting
      audio/
        AudioManager.ts        # Procedural Web Audio sound synthesis
    index.html                 # Entry HTML with inline CSS
    public/
      textures/blocks/         # 63 PNG textures from Minetest devtest
      fonts/                   # Arimo, Cousine, DroidSansFallbackFull
  data/                      # Game Data (JSON)
    blocks.json                # 64 block definitions with groups & sounds
    items.json                 # 68 items, 56 recipes, 16 food values, 5 tool tiers
    server_config.json         # Server configuration
    smelting.json              # 15 smelting recipes
    privileges.json            # 15 privilege definitions
  docs/                      # Documentation
    architecture.md            # Architecture overview
    data-models.md             # Data model documentation
    server-api.md              # Server API documentation
```

## Getting Started

### Prerequisites
- .NET 8.0 SDK
- Node.js 18+
- npm

### Server

```bash
cd web/server
dotnet restore
dotnet run
```

Server starts at `http://localhost:5266`

### Client

```bash
cd web/client
npm install
npm run dev
```

Client starts at `http://localhost:5173` (proxies `/game` to server)

### Production Build

```bash
cd web/client
npm run build
```

## Ported Features from minetest_sub_project

| Feature | Status |
|---------|--------|
| Voxel world (16x16x16 chunks) | Ported |
| Procedural terrain generation (biomes, caves, ores) | Ported |
| Block placement/digging with tool wear | Ported |
| Player movement & physics | Ported |
| Ladder climbing | Ported |
| Multiplayer (SignalR/WebSocket) | Ported |
| Inventory system (32 slots) | Ported |
| Crafting system (56 recipes) | Ported |
| Smelting system (15 recipes) | Ported |
| Chat system with commands | Ported |
| Day/night cycle | Ported |
| Entity system with terrain collision | Ported |
| Item drop entities with gravity | Ported |
| Mob entities with AI | Ported |
| Authentication & ban system | Ported |
| Chat commands (/help, /time, /tps, /gamemode, /tp, /give) | Ported |
| Sky rendering with day/night | Ported |
| Block types (64 with groups) | Ported |
| Items & tools (68 items, 5 material tiers) | Ported |
| Tool durability/wear system | Ported |
| Block groups (cracky, crumbly, choppy, snappy) | Ported |
| Block sounds (stone, wood, dirt, etc.) | Ported |
| Liquid physics (water/lava flow) | Ported |
| Falling node physics (sand, gravel) | Ported |
| Knockback system (Minetest formula) | Ported |
| Privilege system (15 privileges) | Ported |
| Active Block Modifier (ABM) system | Ported |
| PvP with damage and knockback | Ported |
| Block interaction (chest, furnace, crafting table) | Ported |
| Food system (16 foods with nutrition/saturation) | Ported |
| Armor system (leather, iron, diamond) | Ported |
| Fall damage | Ported |
| Drowning (water/lava) | Ported |
| Procedural audio (Web Audio API) | Ported |
| HUD (health, breath, hotbar, debug) | Ported |
| Death screen with respawn | Ported |
| Creative/survival/adventure/spectator modes | Ported |
| Block definitions with groups and sounds | Ported |
| 63 game textures from Minetest | Ported |

## Controls

- **WASD** - Move
- **Mouse** - Look around
- **Left Click** - Dig block
- **Right Click** - Place block
- **Space** - Jump / Fly up / Climb up
- **Shift** - Sprint / Fly down / Climb down
- **F** - Toggle fly mode
- **1-8** - Select hotbar slot
- **T** - Open chat
- **E** - Open crafting
- **F3** - Debug info

## Technology Stack

**Server:** C# .NET 8.0, ASP.NET Core, SignalR, Swagger  
**Client:** TypeScript, Three.js, Vite, SignalR client  
**Data:** JSON configuration files  
**Textures:** 63 PNG textures ported from Minetest devtest
