# WebGameServer Architecture Overview

## System Architecture

```
+------------------------------------------------------------------+
|                        Client (Browser)                          |
|                    TypeScript + Three.js                         |
+------------------------------------------------------------------+
                               | WebSocket (SignalR)
                               v
+------------------------------------------------------------------+
|                    ASP.NET Core 8.0 Server                       |
|  +-----------------------------------------------------------+  |
|  |                     Program.cs                           |  |
|  |  - DI Container, SignalR, CORS, Swagger                  |  |
|  +-----------------------------------------------------------+  |
|                              |                                   |
|  +---------------------------v---------------------------+      |
|  |                       GameHub                          |      |
|  |           SignalR Hub (IGameClient Interface)          |      |
|  |  - Connection Management, Player Actions, Chunk Stream |      |
|  +---------------------------v---------------------------+      |
|                              |                                   |
|  +---------------------------v---------------------------+      |
|  |                    GameServer                          |      |
|  |            (Singleton Service)                         |      |
|  |  - World, Player, Game Loop (20 TPS), Day/Night       |      |
|  +-----------+-----------+-----------+-----------+--------+      |
|              |           |           |           |               |
|  +-----------v---+ +-----v----+ +---v-------+ +v-----------+    |
|  |  AuthSystem   | | Crafting | | Entities  | | Physics    |    |
|  |  ChatCmds     | | System   | | Manager   | | Engine     |    |
|  +---------------+ +----------+ +-----------+ +------------+    |
+------------------------------------------------------------------+
                               |
                               v
+------------------------------------------------------------------+
|                      Data Files (JSON)                           |
|  - server_config.json  - blocks.json  - items.json             |
+------------------------------------------------------------------+
```

## Port from minetest_sub_project (Luanti v5.16.0-dev)

This project is a web-based port of the Luanti voxel engine. The original C++ architecture has been restructured for web deployment:

### Mapping Table

| Luanti (C++) | Web Port (TypeScript/C#) |
|-------------|------------------------|
| `src/server.cpp` | `Core/GameServer.cs` |
| `src/server/player_sao.*` | `Core/Player/Player.cs` |
| `src/inventory.*` | `Core/Player/Inventory.cs` |
| `src/map.*` / `src/mapblock.*` | `Core/World/World.cs`, `Chunk.cs` |
| `src/mapgen/mapgen.*` | `Core/World/Generators/` |
| `src/craftdef.*` | `Core/Crafting/CraftingSystem.cs` |
| `src/network/connection.*` (UDP/MTP) | SignalR/WebSocket |
| `src/client/client.*` | `GameClient.ts` |
| `src/client/game.*` | `GameClient.ts` (game loop) |
| `src/client/mapblock_mesh.*` | `world/ChunkMesh.ts` |
| `src/client/camera.*` | `player/PlayerController.ts` |
| `src/client/hud.*` | `ui/UIManager.ts` |
| `builtin/game/register.*` | `data/blocks.json`, `data/items.json` |
| `src/nodedef.*` | `Core/Game/BlockDefinitionManager.cs` |
| `src/defaultsettings.*` | `data/server_config.json` |

### Protocol Mapping

| Luanti (MTP/UDP) | Web (SignalR) |
|-----------------|---------------|
| `TOSERVER_INIT` | `Join(playerName)` |
| `TOSERVER_PLAYERPOS` | `UpdatePosition(x,y,z,vx,vy,vz,yaw,pitch)` |
| `TOSERVER_INTERACT (dig)` | `DigBlock(x,y,z)` |
| `TOSERVER_INTERACT (place)` | `PlaceBlock(x,y,z,blockType)` |
| `TOSERVER_CHAT_MESSAGE` | `SendChat(message)` |
| `TOCLIENT_BLOCKDATA` | `OnChunkReceived(x,y,z,data)` |
| `TOCLIENT_CHAT_MESSAGE` | `OnChatMessage(sender,message)` |
| `TOCLIENT_HP` | `OnHealthUpdate(health,maxHealth)` |
| `TOCLIENT_INVENTORY` | `OnInventoryUpdate(items)` |
| `TOCLIENT_TIME_OF_DAY` | `OnTimeUpdate(time,speed,skyBrightness)` |
| `TOCLIENT_ADDNODE/REMOVENODE` | `OnBlockUpdate(x,y,z,blockData)` |
| `TOCLIENT_ACTIVE_OBJECT_*` | `OnEntitySpawned/Update/Despawned` |

## Server Components

### GameServer (Core/GameServer.cs)
Central controller: world management, player lifecycle, game loop.

### World System (Core/World/)
- **World.cs** - Lazy chunk generation, concurrent storage
- **Chunk.cs** - 16^3 block container, 16KB serialized
- **Generators/** - Noise (Perlin-like) and Flat terrain

### Player System (Core/Player/)
- **Player.cs** - Position, health, inventory, state
- **Inventory.cs** - 32-slot inventory with ItemStack records

### Crafting (Core/Crafting/)
JSON-based recipe system with ingredient matching.

### Entities (Core/Entities/)
Item drops and mob entities with update lifecycle.

### Physics (Core/Physics/)
Gravity, collision detection, movement simulation.

### Auth & Chat (Core/Auth/, Core/Chat/)
Name validation, banning, slash commands.

## Client Components

### GameClient (GameClient.ts)
Manages SignalR connection and game loop.

### Renderer (rendering/Renderer.ts)
Three.js scene, camera, lighting, sky dome, fog.

### WorldManager (world/WorldManager.ts)
Chunk loading/meshing, player entities, block updates.

### PlayerController (player/PlayerController.ts)
First-person camera, WASD movement, ray casting for dig/place.

### InputManager (input/InputManager.ts)
Keyboard state tracking, pointer lock.

### UIManager (ui/UIManager.ts)
Chat, health hearts, hotbar, debug overlay.
