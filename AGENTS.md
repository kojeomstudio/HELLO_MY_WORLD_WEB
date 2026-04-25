# AGENTS.md

## Project Overview

Web-based voxel game (HelloMyWorld) with a **TypeScript/Three.js client** and **C# ASP.NET Core 8.0/SignalR server**.

## Build & Run Commands

### Server (C# ASP.NET Core)
```bash
# Build
dotnet build web/server/WebGameServer.csproj

# Run (starts at http://localhost:5266)
dotnet run --project web/server/WebGameServer.csproj

# Restore dependencies
dotnet restore web/server/WebGameServer.csproj
```

### Client (TypeScript/Vite)
```bash
# Install dependencies
npm install --prefix web/client

# Dev server (starts at http://localhost:5173, proxies /game to server)
npm run dev --prefix web/client

# Production build (runs tsc first, then vite build)
npm run build --prefix web/client

# Preview production build
npm run preview --prefix web/client
```

### Type Checking (Client)
```bash
npx tsc --noEmit --project web/client/tsconfig.json
```

### Lint / Test

No linter (ESLint/Prettier) or test framework is configured. There are no test files in this project.
If adding tests, use Vitest for the client and xUnit for the server.

## Project Structure

```
web/
  client/src/       # TypeScript frontend (10 files)
    GameClient.ts   # Central orchestrator / composition root
    rendering/      # Three.js 3D renderer
    world/          # Chunk management, block registry
    player/         # First-person player controller
    input/          # Keyboard/mouse input
    ui/             # HUD, chat, inventory UI
    audio/          # Sound system (stub)
  server/           # C# ASP.NET Core backend
    Core/           # Game logic (world, physics, entities, crafting, chat, auth)
    Services/       # SignalR hub, background game loop service
    Program.cs      # Top-level statements entry point
  data/             # JSON config: blocks.json, items.json, server_config.json
```

## Code Style — Client (TypeScript)

- **Indentation:** 4 spaces, never tabs
- **Semicolons:** Always present
- **Quotes:** Single quotes for strings, template literals for interpolation
- **Trailing commas:** Never used
- **Strict mode:** Enabled (`strict: true`, `noUnusedLocals`, `noUnusedParameters`)

### Imports
```typescript
import * as THREE from 'three';           // third-party: namespace import
import { GameClient } from './GameClient'; // local: named import
```
- Third-party imports first, then blank line, then local imports
- Relative paths only (`./`, `../`) — no path aliases

### Naming
| Element | Convention | Example |
|---------|-----------|---------|
| Classes | PascalCase | `class GameClient` |
| Interfaces | PascalCase | `interface BlockDefinition` |
| Methods/Functions | camelCase | `setupEventListeners()` |
| Private fields | camelCase (no underscore prefix) | `private renderer` |
| Constants | SCREAMING_SNAKE_CASE | `const CHUNK_SIZE = 16` |
| Unused params | underscore prefix | `_health: number` |
| Files | PascalCase | `WorldManager.ts` (entry: `main.ts`) |

### Types
- Use `interface` for object shapes — no `type` aliases
- Use `T | null` for nullable references, `T | undefined` for optional lookups
- No custom generics; use built-in `Map<K,V>`, `Set<T>`
- Prefer `as HTMLFormElement` for DOM casts, `!` for guaranteed non-null elements
- Avoid `any`; use proper types for new code

### Exports
- Named exports only — no default exports
- One class per file (interfaces co-located with their primary class)

### Error Handling
- Guard clauses / early returns are the dominant pattern
- `try/catch` only for truly unexpected failures (e.g., AudioContext creation)
- Optional chaining (`?.`) for safe method calls on nullable references
- No custom error classes

## Code Style — Server (C#)

- **Indentation:** 4 spaces (Allman braces — opening brace on own line)
- **Nullable reference types:** Enabled (`<Nullable>enable</Nullable>`)
- **Implicit usings:** Enabled
- **Namespaces:** File-scoped (`namespace X;`)

### Naming
| Element | Convention | Example |
|---------|-----------|---------|
| Classes | PascalCase | `class GameServer` |
| Interfaces | PascalCase with `I` prefix | `interface IWorldGenerator` |
| Enums (type + values) | PascalCase | `enum BlockType { Air, Stone }` |
| Methods | PascalCase | `GetPlayer()` |
| Private fields | `_camelCase` (underscore prefix) | `private readonly GameServer _gameServer` |
| Constants | PascalCase | `public const int Size = 16` |
| Local variables | `var` + camelCase | `var player = ...` |
| Properties | PascalCase | `public int MaxPlayers` |

### Types
- Use `readonly struct` for value types (`Vector3`, `Vector3s`, `ChunkCoord`)
- Use `record` for data transfer objects (`ItemStack`, `CraftingRecipe`)
- Use `record struct` for lightweight data (`PhysicsState`, `PlayerInput`)
- Use `ConcurrentDictionary` for thread-safe shared state
- Use `string.Empty` for non-nullable strings, `string?` for nullable
- Use `T?` nullable return types for lookup methods that may miss
- Target-typed `new()` for field initialization where type is clear

### Access Modifiers
- `public` for all API-facing members
- `private readonly` for injected dependencies and collections
- No `internal` or `protected` — not used in this codebase

### Patterns
- Constructor injection for all dependencies (all registered as Singleton)
- `BackgroundService` for the game loop
- `Hub<IGameClient>` for strongly-typed SignalR
- Expression-bodied members for single-expression methods/properties
- Switch expressions and pattern matching preferred over if/else chains
- Guard clauses returning `null`/`false`/enum instead of throwing exceptions
- `using X = Fully.Qualified.Name` aliases to disambiguate types
- No XML doc comments, no `#region` directives

## Communication Architecture

Client and server communicate via SignalR over WebSocket (`/game` endpoint).
The Vite dev server proxies `/game` to `http://localhost:5266` (server runs on port 5266).
Block actions use DOM `CustomEvent('blockAction')` for decoupled communication between PlayerController and UIManager.

## Key Data Files

- `web/data/blocks.json` — 32 block type definitions
- `web/data/items.json` — Items, tools, and 21 crafting recipes
- `web/data/server_config.json` — Server configuration
