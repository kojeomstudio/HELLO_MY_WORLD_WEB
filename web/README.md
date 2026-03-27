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
      Auth/                  # Authentication & ban system
      Chat/                  # Chat command manager
      Crafting/              # Crafting recipe system
      Entities/              # Entity system (items, mobs)
      Game/                  # Block/item definitions
      Physics/               # Physics & collision engine
      Player/                # Player state & inventory
      World/                 # World, chunks, generators
    Services/
      GameHub.cs             # SignalR communication hub
      GameLoopService.cs     # Background game loop
    Program.cs               # Application entry point
  client/                    # TypeScript Frontend
    src/
      GameClient.ts          # Main game client
      rendering/Renderer.ts  # Three.js 3D renderer
      world/                 # Chunk management, block registry
      player/                # First-person player controller
      input/InputManager.ts  # Keyboard/mouse input
      ui/UIManager.ts        # HUD, chat, inventory UI
      audio/AudioManager.ts  # Sound system
    index.html               # Entry HTML
  data/                      # Game Data (JSON)
    blocks.json              # Block definitions (32 types)
    items.json               # Items, tools, recipes
    server_config.json       # Server configuration
  docs/                      # Documentation
    architecture.md          # Architecture overview
    data-models.md           # Data model documentation
    server-api.md            # Server API documentation
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

Server starts at `http://localhost:5000`

### Client

```bash
cd web/client
npm install
npm run dev
```

Client starts at `http://localhost:5173`

## Ported Features from minetest_sub_project

| Feature | Status |
|---------|--------|
| Voxel world (16x16x16 chunks) | Ported |
| Procedural terrain generation | Ported |
| Block placement/digging | Ported |
| Player movement & physics | Ported |
| Multiplayer (SignalR/WebSocket) | Ported |
| Inventory system | Ported |
| Crafting system | Ported |
| Chat system | Ported |
| Day/night cycle | Ported |
| Entity system | Ported |
| Authentication | Ported |
| Chat commands | Ported |
| Sky rendering | Ported |
| Block types (32) | Ported |
| Items & tools (24) | Ported |
| Crafting recipes (21) | Ported |

## Controls

- **WASD** - Move
- **Mouse** - Look around
- **Left Click** - Dig block
- **Right Click** - Place block
- **Space** - Jump / Fly up
- **Shift** - Sprint / Fly down
- **F** - Toggle fly mode
- **1-8** - Select hotbar slot
- **T** - Open chat
- **F3** - Debug info

## Technology Stack

**Server:** C# .NET 8.0, ASP.NET Core, SignalR, Swagger  
**Client:** TypeScript, Three.js, Vite, SignalR client  
**Data:** JSON configuration files
