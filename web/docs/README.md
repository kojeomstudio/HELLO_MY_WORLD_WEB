# HelloMyWorld - Architecture Documentation

Web-based Minecraft/Minetest-like voxel game.

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
| [Client Architecture](client-architecture.md) | TypeScript client structure, classes, rendering pipeline |
| [Server Architecture](server-architecture.md) | C# server structure, DI, game loop, services |
| [Communication Protocol](communication-protocol.md) | SignalR hub methods (client-to-server, server-to-client) |
| [Game Systems](game-systems.md) | World generation, lighting, physics, crafting, mobs, agriculture |
