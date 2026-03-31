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
|  |  - DigBlockStart (validation), DigBlock (wear/drops)  |      |
|  |  - PunchPlayer (PvP + knockback)                      |      |
|  |  - InteractWithBlock (chest/furnace/crafting_table)   |      |
|  |  - GetPrivileges, Craft, UseItem                      |      |
|  +---------------------------v---------------------------+      |
|                              |                                   |
|  +---------------------------v---------------------------+      |
|  |                    GameServer                          |      |
|  |            (Singleton Service)                         |      |
|  |  - World, Player, Game Loop (20 TPS), Day/Night       |      |
|  +-----------+-----------+-----------+-----------+--------+      |
|             |           |           |           |               |
|  +----------v---+ +-----v----+ +---v-------+ +v------------+    |
|  |  AuthSystem   | | Crafting | | Entities  | | Physics     |    |
|  |  ChatCmds     | | System   | | Manager   | | Engine      |    |
|  |  PrivilegeSys | | Smelting | | (WorldRef)| | Knockback   |    |
|  +--------------+ +----------+ +-----------+ +-------------+    |
|  +--------------+                                                     |
|  |  ABM System  |  ActiveBlockModifier (periodic block transforms) |
|  +--------------+                                                     |
+------------------------------------------------------------------+
                               |
                               v
+------------------------------------------------------------------+
|                      Data Files (JSON)                           |
|  - server_config.json  - blocks.json (64 types)  - items.json   |
|  - privileges.json (15 privileges)                               |
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
| `src/server/modsuiltin/chatcommands.lua` | `Core/Chat/ChatCommandManager.cs` (`/gamemode`, `/tp`, `/give`) |
| `src/privileges.*` / `builtin/privileges.lua` | `Core/Auth/PrivilegeSystem.cs` + `data/privileges.json` |
| `src/environment.h` (ABM) | `Core/World/ActiveBlockModifier.cs` |
| `src/content_sao.cpp` (knockback) | `Core/Physics/KnockbackSystem.cs` |

### Protocol Mapping

| Luanti (MTP/UDP) | Web (SignalR) |
|-----------------|---------------|
| `TOSERVER_INIT` | `Join(playerName)` |
| `TOSERVER_PLAYERPOS` | `UpdatePosition(x,y,z,vx,vy,vz,yaw,pitch)` |
| `TOSERVER_INTERACT (dig start)` | `DigBlockStart(x,y,z)` — server validates dig target |
| `TOSERVER_INTERACT (dig complete)` | `DigBlock(x,y,z)` — applies tool wear, spawns item drops |
| `TOSERVER_INTERACT (place)` | `PlaceBlock(x,y,z,blockType)` |
| `TOSERVER_INTERACT (punch player)` | `PunchPlayer(targetName)` — PvP damage + knockback |
| `TOSERVER_INTERACT (right-click block)` | `InteractWithBlock(x,y,z)` — chest/furnace/crafting_table |
| `TOSERVER_CHAT_MESSAGE` | `SendChat(message)` |
| `TOSERVER_ITEM_USE` | `UseItem(slotIndex)` — food consumption |
| `TOSERVER_BREATH` | Server-side drowning via `Drowning` block property |
| `TOCLIENT_BLOCKDATA` | `OnChunkReceived(x,y,z,data)` |
| `TOCLIENT_CHAT_MESSAGE` | `OnChatMessage(sender,message)` |
| `TOCLIENT_HP` | `OnHealthUpdate(health,maxHealth)` |
| `TOCLIENT_INVENTORY` | `OnInventoryUpdate(items)` |
| `TOCLIENT_TIME_OF_DAY` | `OnTimeUpdate(time,speed,skyBrightness)` |
| `TOCLIENT_ADDNODE/REMOVENODE` | `OnBlockUpdate(x,y,z,blockData)` |
| `TOCLIENT_ACTIVE_OBJECT_*` | `OnEntitySpawned/Update/Despawned` |
| `TOCLIENT_KNOCKBACK` | `OnKnockback(vx,vy,vz)` |
| `TOCLIENT_PRIVILEGES` | `OnPrivilegeList(privileges[])` |
| `TOCLIENT_SET_SKY` | `OnGameModeChanged(mode)` |
| (custom) | `OnTeleported(x,y,z)` |

### Chat Command Mapping

| Minetest Command | Web Implementation | Status |
|-----------------|-------------------|--------|
| `/gamemode` (`/gm`) | `ChatCommandManager.cs:69` | Fully wired — switches survival/creative/adventure/spectator |
| `/tp <x> <y> <z>` | `ChatCommandManager.cs:93` | Fully wired — teleports player to coordinates |
| `/give <player> <item> [count]` | `ChatCommandManager.cs:110` | Fully wired — grants items to inventory |
| `/time` | Handled via `settime` privilege | Available via privilege system |

## Server Components

### GameServer (Core/GameServer.cs)
Central controller: world management, player lifecycle, game loop (20 TPS), day/night cycle.
Integrates all subsystems via constructor injection:

| Dependency | Type | Purpose |
|-----------|------|---------|
| `PrivilegeSystem` | Singleton | 15 Minetest-compatible privileges |
| `ActiveBlockModifierSystem` | Singleton | Periodic block modifications (ABMs) |
| `KnockbackSystem` | Singleton | PvP knockback physics |
| `BlockDefinitionManager` | Singleton | 64 block type definitions |
| `CraftingSystem` | Singleton | Recipe matching and crafting |
| `EntityManager` | Singleton | Item drops and mob entities |
| `SmeltingSystem` | Singleton | Furnace smelting recipes |

### World System (Core/World/)
- **World.cs** — Lazy chunk generation, concurrent storage, block get/set
- **Chunk.cs** — 16^3 block container, 16KB serialized
- **Generators/** — Noise (Perlin-like) and Flat terrain generators
- **ActiveBlockModifier.cs** — ABM system for periodic block transformations
  - `ActiveBlockModifier` record: `Name`, `Interval`, `Chance`, `RequiredNeighbor`, `MinY`, `MaxY`, `Action`
  - `ActiveBlockModifierSystem`: iterates loaded chunks each tick, checks interval/chance/neighbors, invokes action
  - Maps to Luanti's `minetest.register_abm()`

### Player System (Core/Player/)
- **Player.cs** — Position, health, inventory, game mode, state flags
- **Inventory.cs** — 32-slot inventory with `ItemStack` records; durability tracked via `Metadata` field

### Crafting (Core/Crafting/)
JSON-based recipe system with ingredient matching. Expanded: 56 recipes, 16 food values, 5 tool capability tiers.

### Entities (Core/Entities/)
Item drops and mob entities with update lifecycle.
`Entity.WorldReference` provides a static reference to `WorldMap` for entity-terrain collision detection (set during game loop initialization).

### Physics (Core/Physics/)
Gravity, collision detection, movement simulation.
- **KnockbackSystem.cs** — Minetest knockback formula:
  - `kbValue = 8 - 8 * exp(-0.17328 * damage)`
  - `distanceFactor = 1 / (distance + 1)`
  - Horizontal: direction * kb * 10, Vertical: kb * 8

### Auth & Privileges (Core/Auth/)
- **AuthSystem** — Name validation, banning
- **PrivilegeSystem** — 15 Minetest-compatible privileges with grant/revoke/query

| Privilege | Default | Description |
|-----------|---------|-------------|
| `interact` | yes | Can interact with world (dig/place) |
| `shout` | yes | Can send chat messages |
| `fly` | no | Can fly in survival mode |
| `fast` | no | Can move faster than normal |
| `teleport` | no | Can teleport self to other players |
| `bring` | no | Can teleport other players to self |
| `settime` | no | Can change time of day |
| `server` | no | Server admin, grants all privileges |
| `protection_bypass` | no | Bypass area protection |
| `ban` | no | Can ban/unban players |
| `kick` | no | Can kick players |
| `give` | no | Can give items to self and others |
| `password` | no | Can change own password |
| `privs` | no | Can grant any privilege |
| `basic_privs` | no | Can grant interact and shout |

### Chat Commands (Core/Chat/ChatCommandManager.cs)
Slash commands fully wired to game logic:

| Command | Aliases | Effect |
|---------|---------|--------|
| `/gamemode <mode>` | `/gm` | Switches game mode, fires `OnGameModeChanged` |
| `/tp <x> <y> <z>` | — | Teleports player, fires `OnTeleported` |
| `/give <player> <item> [count]` | — | Adds items to target inventory |

### GameHub (Services/GameHub.cs)
SignalR hub bridging client actions to server systems:

| Method | Description |
|--------|-------------|
| `DigBlockStart(x,y,z)` | Validates block is breakable (non-air, Breakable=true) |
| `DigBlock(x,y,z)` | Breaks block, spawns item entity, applies tool wear/durability |
| `PunchPlayer(targetName)` | PvP: calculates weapon damage, applies knockback via KnockbackSystem |
| `InteractWithBlock(x,y,z)` | Opens UI for interactive blocks (chest/furnace/crafting_table) |
| `GetPrivileges()` | Returns caller's privilege list |
| `UseItem(slotIndex)` | Consumes food items (heals + feeds) |
| `SelectSlot(slot)` | Updates selected hotbar slot |

### Tool Wear/Durability System
Tools degrade on block dig. Durability stored in `ItemStack.Metadata` as string:

| Material | Max Durability |
|----------|---------------|
| Wooden | 59 |
| Stone | 131 |
| Iron | 250 |
| Diamond | 1561 |
| Default | 60 |

When durability reaches 0, the tool is destroyed and the player receives a chat notification.

## Client Components

### GameClient (GameClient.ts)
Manages SignalR connection and game loop.
Connected server events:

| Event | Handler |
|-------|---------|
| `OnKnockback(vx,vy,vz)` | Applies velocity impulse to player |
| `OnPrivilegeList(privs[])` | Stores player privileges |
| `OnGameModeChanged(mode)` | Switches game mode |
| `OnTeleported(x,y,z)` | Updates player position |
| `OnChunkReceived` | Delegates to WorldManager |
| `OnBlockUpdate` | Updates block in mesh |
| `OnHealthUpdate` | Updates HUD hearts |
| `OnInventoryUpdate` | Refreshes hotbar/items |
| `OnChatMessage` | Displays in chat UI |
| `OnEntitySpawned/Update/Despawned` | Manages entity visuals |
| `OnTimeUpdate` | Updates sky/lighting |

AudioManager is connected and active.

### Renderer (rendering/Renderer.ts)
Three.js scene, camera, lighting, sky dome, fog.

### WorldManager (world/WorldManager.ts)
Chunk loading/meshing, player entities, block updates.

### BlockRegistry (world/BlockRegistry.ts)
64 block type definitions with extended properties and helper methods.

### PlayerController (player/PlayerController.ts)
First-person camera, WASD movement, ray casting for dig/place.
Extended features:

- **Ladder climbing** — checks `BlockRegistry.isClimbable()` at player position, disables gravity while climbing
- **Knockback** — applies velocity from server `OnKnockback` event
- **Crafting toggle** — E key opens/closes crafting UI
- **Drowning detection** — checks `BlockRegistry.isLiquid()` for liquid blocks with `drowning: true`

### InputManager (input/InputManager.ts)
Keyboard state tracking, pointer lock.

### UIManager (ui/UIManager.ts)
Chat, health hearts, hotbar, debug overlay.
Extended features:

- **Durability display** — shows tool durability bar on hotbar items
- **Slot selection** — highlights active hotbar slot, supports number key selection

## Block System (64 Types)

### BlockDefinition Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `ushort` | Unique block identifier (0-63) |
| `name` | `string` | Block name (e.g. "stone", "water_flowing") |
| `solid` | `bool` | Blocks movement and ray casting |
| `transparent` | `bool` | Allows rendering of adjacent faces |
| `color` | `string` | Hex color for face rendering |
| `liquid` | `bool` | Is a liquid (water, lava, flowing variants) |
| `light` | `int` | Light emission level (0-14) |
| `hardness` | `float` | Dig time multiplier |
| `damage` | `float` | Damage dealt on contact (e.g. cactus=1, lava=4) |
| `breakable` | `bool` | Whether the block can be dug (bedrock=false) |
| `interactive` | `bool` | Responds to right-click (chest, furnace, etc.) |
| `drawType` | `string` | Render mode ("normal", etc.) |
| `drops` | `string?` | Override drop item name |
| `climbable` | `bool` | Ladder-like climbing |
| `drowning` | `bool` | Causes drowning damage |
| `falling` | `bool` | Subject to gravity (gravel) |
| `bouncy` | `int` | Bounce height multiplier |
| `slippery` | `bool` | Reduces friction |
| `liquidRange` | `int` | Flow distance for liquid blocks |
| `liquidViscosity` | `int` | Flow speed (higher = slower) |
| `liquidRenewable` | `bool` | Infinite liquid source |
| `moveResistance` | `float` | Movement speed multiplier when inside |
| `postEffectColor` | `string?` | Screen tint when camera is inside (e.g. lava="#FF4400") |
| `level` | `int` | Liquid level (0-8) |
| `maxLevel` | `int` | Maximum liquid level |
| `groups` | `Dict<string,int>` | Tool group ratings (cracky, crumbly, choppy, snappy, dig_immediate, oddly_breakable_by_hand) |
| `soundGroup` | `string` | Footstep/break sound class (default, stone, dirt, grass, wood, metal, gravel, cloth, water, lava) |

### Block Groups (Minetest Tool System)

| Group | Description | Example Blocks |
|-------|-------------|---------------|
| `cracky` | Requires pickaxe | stone (1), cobblestone (2), iron_block (2), obsidian (5) |
| `crumbly` | Requires shovel | dirt (1), sand (1), gravel (3), clay (3) |
| `choppy` | Requires axe | wood (1), leaves (1), cactus (2), pumpkin (2) |
| `snappy` | Requires shears | wool variants (2), apple_block (3) |
| `dig_immediate` | Hand-diggable | — |
| `oddly_breakable_by_hand` | Any tool works | — |

### Complete Block List (64 types)

| ID | Name | Category | Notable Properties |
|----|------|----------|-------------------|
| 0 | air | — | transparent, non-solid |
| 1 | stone | Natural | hardness=1.5, drops cobblestone, cracky |
| 2 | dirt | Natural | hardness=0.5, crumbly |
| 3 | grass | Natural | hardness=0.6 |
| 4 | water | Liquid | liquid, drowning |
| 5 | sand | Natural | hardness=0.5 |
| 6 | wood | Natural | hardness=2.0 |
| 7 | leaves | Natural | hardness=0.2, transparent |
| 8 | glass | Building | hardness=0.3, transparent |
| 9 | brick | Building | hardness=2.0 |
| 10 | ore_iron | Ore | hardness=3.0, drops iron_ingot |
| 11 | coal | Ore | hardness=3.0 |
| 12 | bedrock | Natural | unbreakable |
| 13 | snow | Natural | hardness=0.2 |
| 14 | ice | Natural | hardness=0.5, transparent |
| 15 | lava | Liquid | liquid, damage=4, postEffectColor |
| 16 | torch | Decoration | light=14, non-solid |
| 17 | ladder | Decoration | climbable |
| 18 | fence | Building | hardness=2.0, transparent |
| 19 | door_wood | Decoration | interactive, hardness=3.0 |
| 20 | chest | Decoration | interactive, hardness=2.5 |
| 21 | crafting_table | Decoration | interactive, hardness=2.5 |
| 22 | furnace | Decoration | interactive, hardness=3.5 |
| 23 | ore_gold | Ore | hardness=3.0, drops gold_ingot |
| 24 | ore_diamond | Ore | hardness=3.0, drops diamond |
| 25 | planks | Building | hardness=2.0 |
| 26 | cobblestone | Building | hardness=2.0 |
| 27 | stone_brick | Building | hardness=1.5 |
| 28 | wool_white | Wool | hardness=0.8, snappy=2 |
| 29 | wool_red | Wool | hardness=0.8, snappy=2 |
| 30 | wool_blue | Wool | hardness=0.8, snappy=2 |
| 31 | wool_green | Wool | hardness=0.8, snappy=2 |
| 32 | bookshelf | Building | hardness=1.5 |
| 33 | gravel | Natural | hardness=0.6, falling, crumbly=3 |
| 34 | clay | Natural | hardness=0.6, crumbly=3 |
| 35 | sandstone | Natural | hardness=0.8, cracky=3 |
| 36 | obsidian | Natural | hardness=50.0, cracky=5 |
| 37 | cactus | Natural | hardness=0.4, damage=1, choppy=2 |
| 38 | sugar_cane | Plant | hardness=0.2, non-solid |
| 39 | pumpkin | Plant | hardness=1.0, choppy=2 |
| 40 | melon | Plant | hardness=1.0, drops melon_slice, choppy=2 |
| 41 | mycelium | Natural | hardness=0.6, drops dirt, crumbly=3 |
| 42 | farmland | Natural | hardness=0.6, crumbly=3 |
| 43 | water_flowing | Liquid | liquid, drowning |
| 44 | lava_flowing | Liquid | liquid, damage=4, postEffectColor |
| 45 | coal_ore | Ore | hardness=3.0, drops coal, cracky=3 |
| 46 | mossy_cobblestone | Building | hardness=2.0, cracky=3 |
| 47 | iron_block | Building | hardness=5.0, cracky=2 |
| 48 | gold_block | Building | hardness=3.0, cracky=2 |
| 49 | diamond_block | Building | hardness=5.0, cracky=2 |
| 50 | wool_orange | Wool | hardness=0.8, snappy=2 |
| 51 | wool_yellow | Wool | hardness=0.8, snappy=2 |
| 52 | wool_cyan | Wool | hardness=0.8, snappy=2 |
| 53 | wool_purple | Wool | hardness=0.8, snappy=2 |
| 54 | wool_black | Wool | hardness=0.8, snappy=2 |
| 55 | wool_brown | Wool | hardness=0.8, snappy=2 |
| 56 | wool_pink | Wool | hardness=0.8, snappy=2 |
| 57 | wool_lime | Wool | hardness=0.8, snappy=2 |
| 58 | wool_light_blue | Wool | hardness=0.8, snappy=2 |
| 59 | wool_magenta | Wool | hardness=0.8, snappy=2 |
| 60 | wool_gray | Wool | hardness=0.8, snappy=2 |
| 61 | wool_light_gray | Wool | hardness=0.8, snappy=2 |
| 62 | glowing_obsidian | Building | hardness=50.0, light=14, cracky=5 |
| 63 | apple_block | Plant | hardness=0.8, drops apple, snappy=3 |

## Data Files

### blocks.json
64 block type definitions with all `BlockDefinition` properties including groups, sound groups, and liquid properties.

### items.json
68 items with:
- 56 crafting recipes (shaped and shapeless)
- 16 food values (bread, apple, cooked_beef, cooked_pork, raw_beef, raw_pork, carrot, potato, baked_potato, mushroom_stew, melon_slice, cookie, cake, and more)
- 5 tool capability tiers (wooden, stone, iron, diamond, default) with material-specific group ratings and dig speeds

### privileges.json
15 privilege definitions matching Minetest's built-in privilege set. Each privilege has a `description` and `default` flag.

### server_config.json
Server configuration: max players, world size, tick rate, spawn point, etc.

## Textures

63 PNG textures from the Minetest devtest texture pack are stored in `public/textures/blocks/`. These cover:
- Natural blocks (stone, dirt, grass, sand, snow, ice, gravel, clay, sandstone, obsidian, mycelium, etc.)
- Tree variants (default, pine, jungle) with tops and leaves
- Liquids (water, flowing water, river water, lava, flowing lava)
- Tool textures (wooden, stone, steel, mese, and special swords/pickaxes/axes/shovels/shears/daggers)
- Special blocks (mossy cobble, apple, dirt_with_grass, dirt_with_snow, snow_sheet)
