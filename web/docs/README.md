# HelloMyWorld - Architecture Documentation

Web-based voxel game ported from Luanti/Minetest with 226 block types, 220+ items, 166+ crafting recipes, 10 biomes, 6 mob types, and full multiplayer support.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Client | TypeScript 5.3, Vite 5, Three.js 0.160, @microsoft/signalr 8 |
| Server | .NET 8.0, ASP.NET Core, SignalR, SQLite |
| Communication | WebSocket via SignalR (`/game` endpoint) |
| Data | JSON config files (`web/data/`) |

## Ports

- **Client dev server:** http://localhost:5173 (proxies `/game` to server)
- **Server:** http://localhost:5266

## Documentation Index

| Document | Description |
|----------|-------------|
| [Architecture Overview](architecture.md) | Full system architecture, data flow, security model |
| [Client Architecture](client-architecture.md) | TypeScript client structure, classes, rendering pipeline |
| [Server Architecture](server-architecture.md) | C# server structure, DI, game loop, services |
| [Communication Protocol](communication-protocol.md) | SignalR hub methods (client-to-server, server-to-client) |
| [Game Systems](game-systems.md) | World generation, lighting, physics, crafting, mobs, agriculture |
| [Build & Run](build-run.md) | Build, run, test instructions |
| [Network Protocol](network-protocol.md) | Network protocol details |
| [Server API](server-api.md) | REST/SignalR API reference |
| [Data Models](data-models.md) | Data model documentation |
| [Communication](communication.md) | Communication architecture |

### Reference Documentation (`reference/`)

| Document | Description |
|----------|-------------|
| [Client Architecture (Minetest)](reference/client-architecture.md) | Minetest client architecture analysis |
| [Server Architecture (Minetest)](reference/server-architecture.md) | Minetest server architecture analysis |
| [World & Map System](reference/world-map-system.md) | Minetest world/map system reference |
| [Map Generation](reference/mapgen-system.md) | Minetest mapgen system reference |
| [Network Protocol (Minetest)](reference/network-protocol.md) | Minetest network protocol reference |
| [Game Content](reference/game-content.md) | Minetest game content and data reference |
| [Scripting & Modding](reference/scripting-modding.md) | Minetest Lua scripting reference |
