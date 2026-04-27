# Build & Run Guide

## Prerequisites

### Server
- .NET 8.0 SDK
- No additional dependencies (all NuGet packages restored automatically)

### Client
- Node.js 18+ (LTS recommended)
- npm (bundled with Node.js)

## Configuration Files

- `web/data/server_config.json` — Server settings (players, tick rate, world gen, physics, day/night, networking, liquids, CORS)
- `web/data/blocks.json` — Block type definitions (226 entries)
- `web/data/items.json` — Item definitions, 166+ crafting recipes, food values, tool capabilities, fuel registry
- `web/data/smelting.json` — 20 smelting recipes
- `web/data/biomes.json` — 10 biome definitions with tree types and decorations
- `web/data/mobs.json` — 6 mob definitions (Zombie, Skeleton, Spider, Cow, Pig, Chicken)
- `web/data/tools.json` — 8 tool material definitions
- `web/data/physics_constants.json` — Physics configuration
- `web/data/privileges.json` — 19 privilege definitions
- `web/data/tree_schematics.json` — Tree schematic definitions
- `web/data/decorations.json` — World decoration definitions
- `web/data/ores.json` — Ore distribution definitions
- `web/data/sky_params.json` — Sky rendering parameters
- `web/data/day_night_ratio.json` — Day/night brightness curve
- `web/data/sounds.json` — 15 sound group definitions
- `web/data/protection.json` — Protection system config
- `web/data/game_constants.json` — Game constants

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

| Script | Description |
|--------|-------------|
| `start.bat` | Start both server + client dev servers (Windows) |
| `start.sh` | Start both server + client dev servers (Linux/macOS) |
| `start-prod.bat` | Build client, then serve both via C# server |
| `build.bat` | Production build of both server and client |
| `test-protocol.bat` | Build + start server + run protocol integration tests |
| `cli-test.bat` | Build + start server + run comprehensive CLI test suites |

### Start (Development)

```bash
# Windows - starts server + Vite dev server
start.bat

# Linux/macOS
chmod +x start.sh && ./start.sh
```

### Start (Production)

```bash
# Builds client, then serves everything from C# server on port 5266
start-prod.bat
```

### CLI Test Tool

```bash
# Run all tests (auto-starts server)
cli-test.bat

# Run specific test suites
cli-test.bat quick              # Quick smoke test
cli-test.bat protocol           # Full protocol sequence
cli-test.bat crafting smelting  # Specific suites

# Manual (requires server already running)
node cli-test.mjs all
node cli-test.mjs list          # List available suites
```

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
| Client (proxy) | 5173 | http://localhost:5173/game → localhost:5266 |
