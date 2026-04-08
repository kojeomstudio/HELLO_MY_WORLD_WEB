# Build & Run Guide

## Prerequisites

### Server
- .NET 8.0 SDK
- No additional dependencies (all NuGet packages restored automatically)

### Client
- Node.js 18+ (LTS recommended)
- npm (bundled with Node.js)

## Configuration Files

- `web/data/server_config.json` — Server settings (players, tick rate, world gen, physics, day/night, networking, liquids)
- `web/data/blocks.json` — Block type definitions (32 entries)
- `web/data/items.json` — Item definitions, crafting recipes, food values, tool capabilities
- `web/data/smelting.json` — Smelting recipes
- `web/data/biomes.json` — Biome definitions
- `web/data/physics_constants.json` — Physics configuration
- `web/data/privileges.json` — Default privilege definitions

## Server

### Build
```bash
dotnet build web/server/WebGameServer.csproj
```

### Run
```bash
dotnet run --project web/server/WebGameServer.csproj
```
Starts at `http://localhost:5266`. The SignalR hub is available at `/game`. REST API at `/api/status`.

### Restore Dependencies
```bash
dotnet restore web/server/WebGameServer.csproj
```

## Client

### Install Dependencies
```bash
npm install --prefix web/client
```

### Dev Server
```bash
npm run dev --prefix web/client
```
Starts at `http://localhost:5173`. Proxies `/game` WebSocket to `http://localhost:5000` (server).

### Production Build
```bash
npm run build --prefix web/client
```
Runs TypeScript compiler (`tsc`) then Vite build. Output in `web/client/dist/`.

### Preview Production Build
```bash
npm run preview --prefix web/client
```

### Type Check
```bash
npx tsc --noEmit --project web/client/tsconfig.json
```

## Running Together

Start the server first, then the client dev server:

```bash
# Terminal 1: Server
dotnet run --project web/server/WebGameServer.csproj

# Terminal 2: Client
npm run dev --prefix web/client
```

Open `http://localhost:5173` in a browser.

## Batch Scripts

No batch scripts are currently provided. Use the commands above.

## World Data

World data is persisted to `web/data/worlds/default/`:
- Chunks saved/loaded by `WorldPersistence`
- Player data in `players.db` (SQLite via `PlayerDatabase`)
- Block metadata (chests, furnaces, node timers) in `blockmeta.db` (SQLite via `BlockMetadataDatabase`)
- Auto-save every 300 seconds
- Full save on server shutdown

## Ports

| Service | Port | URL |
|---------|------|-----|
| Server | 5266 | http://localhost:5266 |
| Client (dev) | 5173 | http://localhost:5173 |
| Client (proxy) | 5173 | http://localhost:5173/game → localhost:5000 |

Note: The server listens on port 5266 by default but the Vite proxy targets port 5000. Update `web/client/vite.config.ts` if the server port changes.
