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

- **Client**: TypeScript 5.9 + Three.js 0.160 + Vite 5.0
- **Server**: C# .NET 8.0 + ASP.NET Core + SignalR
- **Communication**: WebSocket (SignalR)
- **Data**: JSON configuration files in `web/data/`

## Features

- Procedural world generation (biomes, caves, caverns, dungeons, ores, trees)
- 64 block types with full property system
- Ambient occlusion and texture atlas rendering
- Minimap, particle system, wield item display, block selection highlight
- Multiplayer via SignalR, chat with slash commands
- Crafting (80+ recipes), smelting (15 recipes), chest storage
- Player physics, PvP combat, tool durability
- Day/night cycle, world persistence, privilege system
