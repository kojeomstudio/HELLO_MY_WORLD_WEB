# WebGameServer Architecture Overview

## System Architecture

```
+------------------------------------------------------------------+
|                        Client (Browser)                          |
|                    TypeScript + Three.js                         |
|  +-----------------------------------------------------------+  |
|  |  Texture Atlas System | Crafting UI | Furnace UI | Chest  |  |
|  |  Armor UI | XP Bar | Settings Panel | Creative Inventory  |  |
|  |  Durability Display | Footstep Sounds | Minimap            |  |
|  +-----------------------------------------------------------+  |
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
|  |  - InteractWithBlock (chest/furnace/crafting_table/   |      |
|  |    door_wood, bucket fluid pickup)                    |      |
|  |  - EquipArmor, UnequipArmor                           |      |
|  |  - GetCraftingRecipes, CraftRecipe                    |      |
|  |  - GetSmeltingRecipes, StartSmelting                  |      |
|  |  - GetChestInventory, MoveItemToChest, TakeItemFromChest |   |
|  |  - GetPrivileges, Craft, UseItem                      |      |
|  |  - Rate limiting (chat: 500ms, dig/place: 250ms)     |      |
|  +---------------------------v---------------------------+      |
|                              |                                   |
|  +---------------------------v---------------------------+      |
|  |                    GameServer                          |      |
|  |            (Singleton Service)                         |      |
|  |  - World, Player, Game Loop (20 TPS), Day/Night       |      |
|  |  - Physics validation (server-authoritative)          |      |
|  |  - Chest inventories (per-block, 27 slots, persisted)|      |
|  |  - Furnace operations (smelting progress tracking)    |      |
|  |  - World persistence (auto-save every 300s)           |      |
|  |  - Item pickup system (2 block range)                 |      |
|  |  - Player death drops (inventory + armor)             |      |
|  |  - Mob death drops                                   |      |
|  |  - Agriculture system (crop growth)                   |      |
|  +-----------+-----------+-----------+-----------+--------+      |
|             |           |           |           |               |
|  +----------v---+ +-----v----+ +---v-------+ +v------------+    |
|  |  AuthSystem   | | Crafting | | Entities  | | Physics     |    |
|  |  ChatCmds     | | System   | | Manager   | | Engine      |    |
|  |  PrivilegeSys | | Smelting | | (WorldRef)| | Validation  |    |
|  |  (JSON load)  | | System   | | Mob AI    | | Knockback   |    |
|  +--------------+ +----------+ +-----------+ +-------------+    |
|  +--------------+ +--------------+ +--------------+             |
|  |  ABM System  | | PlayerDB    | | BlockMetaDB  |             |
|  |  (falling)   | | (SQLite)    | | (SQLite)     |             |
|  +--------------+ +--------------+ +--------------+             |
+------------------------------------------------------------------+
                               |
                               v
+------------------------------------------------------------------+
|                      Data Files (JSON) + SQLite                  |
|  - server_config.json  - blocks.json (68 types)  - items.json   |
|  - privileges.json (15 privileges) - smelting.json              |
|  - players.db (SQLite)       - blockmeta.db (SQLite)            |
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
| `src/mapgen/treegen.*` | `Core/World/Generators/NoiseWorldGenerator.cs` (`GenerateTrees`) |
| `src/craftdef.*` | `Core/Crafting/CraftingSystem.cs` |
| `src/network/connection.*` (UDP/MTP) | SignalR/WebSocket |
| `src/client/client.*` | `GameClient.ts` |
| `src/client/game.*` | `GameClient.ts` (game loop) |
| `src/client/mapblock_mesh.*` | `world/ChunkMesh.ts` (with texture atlas UV mapping) |
| `src/client/camera.*` | `player/PlayerController.ts` |
| `src/client/hud.*` | `ui/UIManager.ts` |
| `builtin/game/register.*` | `data/blocks.json`, `data/items.json` |
| `src/nodedef.*` | `Core/Game/BlockDefinitionManager.cs` |
| `src/defaultsettings.*` | `data/server_config.json` |
| `src/server/modsuiltin/chatcommands.lua` | `Core/Chat/ChatCommandManager.cs` (`/gamemode`, `/tp`, `/give`) |
| `src/privileges.*` / `builtin/privileges.lua` | `Core/Auth/PrivilegeSystem.cs` + `data/privileges.json` |
| `src/environment.h` (ABM) | `Core/World/ActiveBlockModifier.cs` |
| `src/content_sao.cpp` (knockback) | `Core/Physics/KnockbackSystem.cs` |
| `src/environment.h` (falling nodes) | `Core/World/ActiveBlockModifier.cs` (sand/gravel ABM) |
| `src/inventorymanager.*` (furnace) | `Core/GameServer.cs` (`FurnaceOperation`) |
| `src/inventorymanager.*` (metadata) | `Core/World/BlockMetadataDatabase.cs` (SQLite) |
| `src/server/save.*` | `Core/World/WorldPersistence.cs` + `Core/Player/PlayerDatabase.cs` |

### Protocol Mapping

| Luanti (MTP/UDP) | Web (SignalR) |
|-----------------|---------------|
| `TOSERVER_INIT` | `Join(playerName)` |
| `TOSERVER_PLAYERPOS` | `UpdatePosition(x,y,z,vx,vy,vz,yaw,pitch)` |
| `TOSERVER_INTERACT (dig start)` | `DigBlockStart(x,y,z)` — server validates dig target |
| `TOSERVER_INTERACT (dig complete)` | `DigBlock(x,y,z)` — applies tool wear, spawns item drops |
| `TOSERVER_INTERACT (place)` | `PlaceBlock(x,y,z,blockType)` |
| `TOSERVER_INTERACT (punch player)` | `PunchPlayer(targetName)` — PvP damage + knockback |
| `TOSERVER_INTERACT (right-click block)` | `InteractWithBlock(x,y,z)` — chest/furnace/crafting_table/door_wood |
| `TOSERVER_CHAT_MESSAGE` | `SendChat(message)` |
| `TOSERVER_ITEM_USE` | `UseItem(slotIndex)` — food/bucket consumption |
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
| (custom) | `OnCraftingRecipes(recipes[])` |
| (custom) | `OnSmeltingRecipes(recipes[])` |
| (custom) | `OnChestInventory(items[])` |
| (custom) | `OnFurnaceUpdate(input,fuel,output,progress)` |
| (custom) | `OnArmorUpdate(armorSlots[])` |
| (custom) | `OnExperienceUpdate(level,totalExp)` |

### Chat Command Mapping

| Minetest Command | Web Implementation | Status |
|-----------------|-------------------|--------|
| `/gamemode` (`/gm`) | `ChatCommandManager.cs` | Fully wired — switches survival/creative/adventure/spectator |
| `/tp <x> <y> <z>` | `ChatCommandManager.cs` | Fully wired — teleports player to coordinates |
| `/give <player> <item> [count]` | `ChatCommandManager.cs` | Fully wired — grants items to inventory |
| `/time` | Handled via `settime` privilege | Available via privilege system |

## Server Components

### GameServer (Core/GameServer.cs)
Central controller: world management, player lifecycle, game loop (20 TPS), day/night cycle.
Integrates all subsystems via constructor injection:

| Dependency | Type | Purpose |
|-----------|------|---------|
| `PrivilegeSystem` | Singleton | 15 Minetest-compatible privileges (loaded from JSON) |
| `ActiveBlockModifierSystem` | Singleton | Periodic block modifications (falling sand/gravel ABMs) |
| `KnockbackSystem` | Singleton | PvP knockback physics |
| `BlockDefinitionManager` | Singleton | 68 block type definitions |
| `CraftingSystem` | Singleton | Recipe matching and crafting |
| `EntityManager` | Singleton | Item drops and mob entities |
| `SmeltingSystem` | Singleton | Furnace smelting recipes |
| `PlayerDatabase` | Singleton | SQLite-based player persistence (position, inventory, armor, XP) |
| `BlockMetadataDatabase` | Singleton | SQLite-based chest/furnace/node timer persistence |
| `AgricultureSystem` | Singleton | Crop planting, growth, and harvesting |

**Server-authoritative features:**
- `ValidatePlayerPosition()` — caps movement speed per tick to prevent teleport exploits; tracks previous position for proper speed validation
- `PickupItem()` — validates range (2 blocks) and inventory capacity before transferring
- `StartSmelting()` — validates recipe, input item, and fuel before consuming
- `MoveItemToChest()` / `TakeItemFromChest()` — validates slot bounds and stack limits (max 64)
- `DamagePlayer()` — applies armor defense reduction, triggers death drops on kill

**Death drops:**
- `DropPlayerInventory()` — drops all inventory items and armor slots as `ItemEntity` instances at player position on death

**Storage systems:**
- `_chestInventories: ConcurrentDictionary<string, ItemStack?[]>` — 27-slot per-block chest storage, keyed by `"x,y,z"`, persisted to SQLite via `BlockMetadataDatabase`
- `_activeFurnaces: ConcurrentDictionary<string, FurnaceOperation>` — per-furnace smelting progress tracking, persisted to SQLite

### Player Persistence (Core/Player/PlayerDatabase.cs)
SQLite database storing full player state across sessions.

**Schema (`players` table):**
| Column | Type | Description |
|--------|------|-------------|
| `name` | TEXT (PK) | Player name |
| `position_x/y/z` | REAL | World position |
| `yaw`, `pitch` | REAL | Camera orientation |
| `health`, `max_health` | REAL | Health state |
| `breath` | REAL | Breath/drowning state |
| `food_level`, `food_saturation` | REAL | Hunger state |
| `total_experience`, `experience_level` | INTEGER | Experience/level |
| `game_mode` | INTEGER | Game mode enum |
| `inventory_json` | TEXT | Serialized inventory (JSON) |
| `armor_json` | TEXT | Serialized armor slots (JSON) |
| `selected_hotbar_slot` | INTEGER | Active hotbar slot |
| `last_ground_y` | REAL | Fall damage tracking |
| `last_login`, `last_save` | TEXT | Timestamps (ISO 8601) |

**Behavior:**
- `SavePlayer()` called on disconnect (`PlayerLeave`)
- `LoadPlayer()` called on `PlayerJoin` if player exists in database
- `INSERT OR REPLACE` semantics (upsert)
- Inventory/armor serialized as JSON arrays of `{ itemId, count, metadata }`

### Block Metadata Persistence (Core/World/BlockMetadataDatabase.cs)
SQLite database for block-associated metadata that persists across server restarts.

**Schema:**

| Table | Key | Data |
|-------|-----|------|
| `chest_inventories` | `pos_key TEXT (PK)` | `items_json TEXT` — 27-slot inventory |
| `furnace_operations` | `pos_key TEXT (PK)` | `input_item_id`, `result_item_id`, `cook_time`, `progress`, `connection_id` |
| `node_timers` | `(x,y,z) INTEGER (PK)` | `block_name TEXT`, `expiration REAL` |

**Behavior:**
- `SaveAllMetadata()` called on server shutdown and auto-save
- Chest inventories loaded on first access via `GetOrCreateChestInventory()`
- Furnace operations and node timers bulk-loaded at save time

### World System (Core/World/)
- **World.cs** — Lazy chunk generation, concurrent storage, block get/set, liquid simulation, auto-save
- **Chunk.cs** — 16^3 block container, 16KB serialized
- **WorldPersistence.cs** — Filesystem save/load (`SaveWorld` / `LoadWorld`), stores `.chunk` files
- **Generators/** — Noise (Perlin-like) and Flat terrain generators
- **ActiveBlockModifier.cs** — ABM system for periodic block transformations
  - `ActiveBlockModifier` record: `Name`, `Interval`, `Chance`, `RequiredNeighbor`, `MinY`, `MaxY`, `Action`
  - `ActiveBlockModifierSystem`: iterates loaded chunks each tick, checks interval/chance/neighbors, invokes action
  - Maps to Luanti's `minetest.register_abm()`
- **AgricultureSystem.cs** — Crop growth simulation
- **BlockMetadataDatabase.cs** — SQLite persistence for chest/furnace/node timer data

### Agriculture System (Core/World/AgricultureSystem.cs)
Manages crop planting, growth, and harvesting.

**Crop types:**

| Crop | Block ID | Grow Time | Notes |
|------|----------|-----------|-------|
| WheatCrop | 64 | 60s | 8 growth stages (Param2 0-7) |
| CarrotCrop | 65 | 45s | 8 growth stages |
| PotatoCrop | 66 | 45s | 8 growth stages |

**Growth mechanics:**
- `PlantCrop()` — requires farmland below and air at placement position
- `TryGrowCrop()` — stochastic growth per tick; probability = `dt / growTime` (x4 if water within 4-block radius)
- `GrowAllCrops()` — iterates all loaded chunks every game tick, checks for crop blocks and attempts growth
- Growth stages tracked via `Block.Param2` (0 = seedling, 7 = fully grown)

### Tree Generation (NoiseWorldGenerator)
The noise world generator includes procedural tree generation during chunk creation:

1. For each surface block (grass), evaluates biome noise to determine tree eligibility
2. Trees only spawn above water level and outside sandy biomes
3. Tree density controlled by Perlin noise (`treeNoise > 0.35` threshold)
4. Trunk height: deterministic hash 4-6 blocks of wood
5. Canopy: 3-layer sphere of leaves (radii 2, 2, 1) with spherical distance check (`dx*dx + dy*dy + dz*dz <= 5`)
6. Trees are generated per-chunk during `GenerateChunk()` — may clip at chunk boundaries

### Falling Nodes ABM System
Sand and gravel blocks use the Active Block Modifier system to simulate gravity:

| Property | Value |
|----------|-------|
| Blocks affected | Sand, Gravel (blocks with `Falling = true`) |
| Interval | Configured per ABM registration |
| Behavior | Check below block — if air, convert to falling entity |
| Neighbor check | None required |

### Entity Item Pickup System
`GameLoopService.ProcessItemPickups()` runs every tick:

1. Iterates all `ItemEntity` instances that are alive
2. For each, checks distance to every online player
3. Within 2-block range (`PickupRange`): attempts `Inventory.AddItem()`
4. On success: removes entity, sends `OnEntityDespawned` and `OnInventoryUpdate`
5. Stack limits (64) prevent overflow — pickup fails if inventory is full

### Enhanced Mob AI
`MobEntity.Update()` implements a three-state behavior system:

| State | Condition | Behavior |
|-------|-----------|----------|
| **Chase** | Nearest player within `DetectionRange` (16 blocks) | Move toward player at `Speed`, direction = normalized vector |
| **Attack** | Player within `AttackRange` (2 blocks) | Stop movement, deal `AttackDamage` every 1s (`AttackCooldownMs`) |
| **Wander** | No player detected | Random walk direction, changes each tick |

Mob physics include gravity (`MobGravity = 20.0`), ground collision detection, and void protection (Y < 1 teleport).

**Mob death drops:** When a mob's health reaches 0, `MobDeathDrops` delegate is invoked to spawn item entities at the mob's position.

### Player System (Core/Player/)
- **Player.cs** — Position, health, inventory, game mode, state flags, armor slots, experience
- **Inventory.cs** — 32-slot inventory with `ItemStack` records; durability tracked via `Metadata` field
- **PlayerDatabase.cs** — SQLite persistence for full player state

**Player properties:**
| Property | Type | Description |
|----------|------|-------------|
| `ArmorSlots` | `ItemStack?[4]` | Helmet, chestplate, leggings, boots |
| `TotalExperience` | `int` | Accumulated XP |
| `ExperienceLevel` | `int` | Current level |
| `FoodLevel` | `float` | Hunger (0-20) |
| `FoodSaturation` | `float` | Saturation |
| `FallDistance` | `float` | Distance since last ground contact |
| `LastGroundY` | `float` | Y position on last ground contact |

**Armor defense values:**

| Armor | Defense |
|-------|---------|
| Leather (any) | 1.0 |
| Iron Helmet | 2.0 |
| Iron Chestplate | 6.0 |
| Iron Leggings | 5.0 |
| Iron Boots | 2.0 |
| Diamond Helmet | 3.0 |
| Diamond Chestplate | 8.0 |
| Diamond Leggings | 6.0 |
| Diamond Boots | 3.0 |

Damage reduction: `finalDamage = max(0, damage - totalDefense * 0.04)`

### Crafting (Core/Crafting/)
JSON-based recipe system with ingredient matching. Expanded: 56 recipes, 16 food values, 5 tool capability tiers.

### Smelting (Core/Smelting/)
- **SmeltingSystem** — Loads recipes from `smelting.json`, matches by input item ID
- **SmeltingRecipe** record: `InputItemId`, `ResultItemId`, `CookTime`, `Experience`

### Furnace Operations
`GameServer.UpdateFurnaces()` runs each game tick:

1. Iterates `_activeFurnaces` dictionary
2. Increments progress by `dt / CookTime`
3. Every 10 ticks: sends `OnFurnaceUpdate` to owning player with current progress
4. At completion (progress >= 1.0): adds result item to player inventory, sends `OnInventoryUpdate` and `OnFurnaceUpdate(input="", fuel="", output=resultItem, progress=1.0)`
5. Removes completed operation from dictionary

`FurnaceOperation` record tracks: `InputItemId`, `ResultItemId`, `CookTime`, `Progress`, `ConnectionId`.

Fuel sources: `coal` and `charcoal`. Input item and fuel are consumed when `StartSmelting()` is called.

### Chest Inventory System
Per-block chest storage using `ConcurrentDictionary<string, ItemStack?[]>`:

| Property | Value |
|----------|-------|
| Key format | `"x,y,z"` (via `GameServer.PositionKey()`) |
| Slot count | 27 (3 rows of 9) |
| Max stack | 64 |
| Persistence | SQLite via `BlockMetadataDatabase` |
| Auto-creation | `GetOrCreateChestInventory()` creates empty 27-slot array on first access (loads from DB if exists) |

### Door Mechanics
`InteractWithBlock()` handles `door_wood` blocks:
- Reads current `Param2` bit 0 for open/close state
- Toggles: `(isOpen ? 0 : 1)`
- Broadcasts `OnBlockUpdate` to all clients

### Fluid Bucket Interaction
`InteractWithBlock()` and `UseItem()` handle bucket items:

| Item | Right-click on Liquid | Use Item |
|------|----------------------|----------|
| `bucket` | Picks up water → `water_bucket` or lava → `lava_bucket` | — |
| `water_bucket` | — | Consumes, gives `bucket` |
| `lava_bucket` | — | Consumes, gives `bucket` |
| `milk_bucket` | — | Consumes, gives `bucket`, heals 4 HP |

### Physics (Core/Physics/)
Gravity, collision detection, movement simulation, server-authoritative validation.
- **PhysicsEngine.cs** — Full movement simulation with fly, climb, liquid, and walk modes
- **KnockbackSystem.cs** — Minetest knockback formula:
  - `kbValue = 8 - 8 * exp(-0.17328 * damage)`
  - `distanceFactor = 1 / (distance + 1)`
  - Horizontal: direction * kb * 10, Vertical: kb * 8
- **PhysicsState** record struct for state snapshot
- **PlayerInput** record struct for input state

### Physics Validation (Server-Authoritative)
`GameServer.ValidatePlayerPosition()` runs every tick:

- Calculates max allowed distance: `maxSpeed * dt * 1.5`
- `maxSpeed` is walk/sprint/fly speed depending on player state
- Compares distance between current position and previous position (`player.Velocity`)
- If exceeded, clamps to max distance along the direction vector
- Updates ground/liquid state flags based on block checks at player feet

### World Persistence (Auto-save)
`GameLoopService.CheckAutoSave()` triggers world save:

| Setting | Value |
|---------|-------|
| Check interval | Every tick |
| Save interval | 300 seconds (5 minutes) |
| Trigger | `world.NeedsSave && timeSinceLastSave > 300s` |
| Save location | `data/worlds/default/` |
| File format | `{x}_{y}_{z}.chunk` (binary) |
| Persistence | Chunks + chest inventories + furnace operations + node timers (all saved via `SaveAllMetadata()`) |

### Auth & Privileges (Core/Auth/)
- **AuthSystem** — Name validation, banning
- **PrivilegeSystem** — 15 Minetest-compatible privileges with grant/revoke/query
- **LoadFromFile()** — Parses `data/privileges.json` to override built-in privilege definitions

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
SignalR hub bridging client actions to server systems. All injected via constructor DI:

| Method | Description | Rate Limit |
|--------|-------------|------------|
| `Join(playerName)` | Validates, creates Player, loads from DB if exists, sends initial sync | — |
| `UpdatePosition(x,y,z,vx,vy,vz,yaw,pitch)` | Syncs position, broadcasts to nearby | — |
| `SendChat(message)` | Broadcasts chat or executes slash command | 500ms |
| `DigBlockStart(x,y,z)` | Validates block is breakable | — |
| `DigBlock(x,y,z)` | Breaks block, spawns item entity, applies tool wear | 250ms |
| `PlaceBlock(x,y,z,blockType)` | Places block in world | 250ms |
| `InteractWithBlock(x,y,z)` | Opens UI for chest/furnace/crafting_table, toggles doors, handles bucket fluid pickup | — |
| `PunchPlayer(targetName)` | PvP: weapon damage + knockback | — |
| `UseItem(slotIndex)` | Consumes food items, bucket items (water/lava/milk) | — |
| `GetPrivileges()` | Returns caller's privilege list | — |
| `Craft(recipeId)` | Auto-matches recipe from inventory | — |
| `GetCraftingRecipes()` | Returns all crafting recipes | — |
| `CraftRecipe(recipeIndex)` | Crafts specific recipe by index | — |
| `GetSmeltingRecipes()` | Returns all smelting recipes | — |
| `StartSmelting(inputItemId,resultItemId,x,y,z)` | Starts furnace operation | — |
| `GetChestInventory(x,y,z)` | Returns chest contents (27 slots) | — |
| `MoveItemToChest(slotIndex,chestSlot,x,y,z)` | Moves item from player to chest | — |
| `TakeItemFromChest(chestSlot,slotIndex,x,y,z)` | Moves item from chest to player | — |
| `SelectSlot(slot)` | Updates selected hotbar slot | — |
| `Respawn()` | Respawns dead player | — |
| `DropItem(slotIndex,count)` | Drops item as entity | — |
| `EquipArmor(slotIndex,armorSlot)` | Moves item from inventory to armor slot | — |
| `UnequipArmor(armorSlot)` | Moves item from armor slot to inventory | — |

### Rate Limiting
Implemented as a static cooldown dictionary in `GameHub`:

```csharp
private static readonly Dictionary<string, DateTime> _lastActionTimes = new();

private static bool CheckRateLimit(string connectionId, string action, int cooldownMs)
```

| Action | Cooldown | Purpose |
|--------|----------|---------|
| `chat` | 500ms | Prevent spam |
| `dig` | 250ms | Limit block breaking speed |
| `place` | 250ms | Limit block placement speed |

Key format: `"{connectionId}:{action}"`. Requests within cooldown are silently ignored.

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
Central orchestrator and composition root. Owns all subsystem references and the game loop.
Connected server events:

| Event | Handler |
|-------|---------|
| `OnKnockback(vx,vy,vz)` | Applies velocity impulse to player + damage flash |
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
| `OnBreathUpdate` | Updates breath bar |
| `OnCraftingRecipes` | Populates crafting UI |
| `OnSmeltingRecipes` | Populates furnace UI recipe list |
| `OnChestInventory` | Updates chest UI grid |
| `OnFurnaceUpdate` | Updates furnace progress bar and slots |
| `OnDeath` | Shows death screen |
| `OnFallingBlock` | Triggers falling block animation |
| `OnArmorUpdate` | Updates armor UI panel |
| `OnExperienceUpdate` | Updates XP bar and level display |

AudioManager is connected and active. Settings panel wired to apply FOV on change.

### Renderer (rendering/Renderer.ts)
Three.js scene, camera, lighting, sky dome, fog, damage flash, cave darkness, lava overlay, cloud system.

### WorldManager (world/WorldManager.ts)
Chunk loading/meshing, player entities, block updates, texture atlas system, falling block animations.

### BlockRegistry (world/BlockRegistry.ts)
68 block type definitions with extended properties, `textureName` field, and helper methods.

### ChunkMesh (world/ChunkMesh.ts)
16x16x16 mesh builder with per-face culling and UV mapping support for texture atlas.

### PlayerController (player/PlayerController.ts)
First-person camera, WASD movement, ray casting for dig/place, interactive block detection.
Extended features:

- **Ladder climbing** — checks `BlockRegistry.isClimbable()` at player position, disables gravity while climbing
- **Knockback** — applies velocity from server `OnKnockback` event
- **Crafting toggle** — E key opens/closes crafting UI
- **Drowning detection** — checks `BlockRegistry.isLiquid()` for liquid blocks with `drowning: true`
- **Interactive block detection** — right-click checks `BlockRegistry.isInteractive()`, dispatches `interactBlock` CustomEvent
- **Footstep sounds** — triggers `audioManager.play('footstep')` during movement

### InputManager (input/InputManager.ts)
Keyboard state tracking, pointer lock.

### UIManager (ui/UIManager.ts)
Chat, health hearts, hotbar, debug overlay, and interactive UI panels:
Extended features:

- **Tool durability display** — color-coded durability bars on hotbar items
- **Slot selection** — highlights active hotbar slot, supports number key selection
- **Crafting UI** — recipe listing with ingredients, craft buttons per recipe
- **Furnace UI** — smelting recipe list, input/fuel/output slots, real-time progress bar
- **Chest UI** — 27-slot chest grid + 8-slot player hotbar, click-to-transfer items
- **Death screen** — overlay with respawn button
- **Player list panel** — shows online players
- **Breath bar** — underwater oxygen indicator
- **Armor equipment UI** — P key opens armor panel with 4 slots (helmet, chestplate, leggings, boots), equip/unequip
- **Experience bar** — XP bar below hotbar with level display
- **Creative inventory UI** — paginated grid with search/filter (I key)
- **Settings panel** — FOV, sensitivity, render distance, volumes, clouds, AO (O key), all persisted to localStorage

### SettingsPanel (ui/SettingsPanel.ts)
Dedicated settings management with localStorage persistence.

| Setting | Range | Default |
|---------|-------|---------|
| Mouse Sensitivity | 0.001 - 0.01 | 0.002 |
| Render Distance | 2 - 8 | 4 |
| FOV | 50 - 110 | 70 |
| Music Volume | 0 - 1 | 0.5 |
| Sound Volume | 0 - 1 | 0.5 |
| Clouds | toggle | enabled |
| Ambient Occlusion | toggle | enabled |

Settings applied on panel close via callback to `GameClient.applySettings()`.

### AudioManager (audio/AudioManager.ts)
Procedural sound effects using Web Audio API. No audio files.

| Sound | Method | Generation |
|-------|--------|------------|
| `block_break` | `playBlockBreak` | White noise burst (0.1s), decay |
| `block_place` | `playBlockPlace` | Sine sweep 150->60 Hz (0.08s) |
| `footstep` | `playFootstep` | Quiet white noise (0.05s) |
| `hurt` | `playHurt` | Sawtooth 200Hz + square 153Hz (0.2s) |
| `pickup` | `playPickup` | Sine 400->600 Hz step (0.15s) |
| `death` | `playDeath` | Sawtooth sweep 440->55 Hz (0.5s) |

Auto-resumes suspended `AudioContext` (browser autoplay policy).

## Block System (68 Types)

### BlockDefinition Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `ushort` | Unique block identifier (0-67) |
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
| `textureName` | `string?` | Name of texture in atlas for UV mapping |
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

### Complete Block List (68 types)

| ID | Name | Category | Notable Properties |
|----|------|----------|-------------------|
| 0 | air | — | transparent, non-solid |
| 1 | stone | Natural | hardness=1.5, drops cobblestone, cracky |
| 2 | dirt | Natural | hardness=0.5, crumbly |
| 3 | grass | Natural | hardness=0.6 |
| 4 | water | Liquid | liquid, drowning |
| 5 | sand | Natural | hardness=0.5, falling |
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
| 19 | door_wood | Decoration | interactive, hardness=3.0, open/close via Param2 |
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
| 64 | wheat_crop | Agriculture | 8 growth stages (Param2 0-7), plantable on farmland |
| 65 | carrot_crop | Agriculture | 8 growth stages, 45s grow time |
| 66 | potato_crop | Agriculture | 8 growth stages, 45s grow time |
| 67 | hay_bale | Agriculture | Building block from harvested crops |

## Data Files

### blocks.json
68 block type definitions with all `BlockDefinition` properties including groups, sound groups, liquid properties.

### items.json
68 items with:
- 56 crafting recipes (shaped and shapeless)
- 16 food values (bread, apple, cooked_beef, cooked_pork, raw_beef, raw_pork, carrot, potato, baked_potato, mushroom_stew, melon_slice, cookie, cake, and more)
- 5 tool capability tiers (wooden, stone, iron, diamond, default) with material-specific group ratings and dig speeds
- Bucket items (bucket, water_bucket, lava_bucket, milk_bucket)
- Armor items (leather/iron/diamond helmet, chestplate, leggings, boots)

### smelting.json
Smelting recipes with input, result, cook time, and experience yield.

### privileges.json
15 privilege definitions matching Minetest's built-in privilege set. Each privilege has a `description` and `default` flag. Loaded at startup via `PrivilegeSystem.LoadFromFile()`.

### server_config.json
Server configuration: max players, world size, tick rate, spawn point, network settings, etc.

## Textures

### Texture Atlas System
The client uses a texture atlas for block rendering instead of per-block solid colors:

- **Atlas layout:** 8 columns x N rows (dynamic based on loaded textures)
- **Tile size:** 16x16 pixels
- **Filtering:** `NearestFilter` (pixelated, no smoothing)
- **Loaded textures:** 125 PNG textures from `public/textures/blocks/`

Texture categories include: natural blocks (stone, dirt, grass, sand, etc.), ores (coal, iron, gold, diamond), building blocks (brick, glass, planks, cobblestone, etc.), wool variants (16 colors), tool textures (wood/stone/steel/mese/diamond swords, picks, shovels, axes, shears, daggers), decorative blocks (chest, furnace, crafting table, bookshelf, fence, ladder), tree variants (oak, pine, jungle), and special blocks (hay, melon, pumpkin, cactus, ice, snow).

Blocks without a matching atlas texture fall back to vertex colors.

## Lighting System

### Server-Side (C#)
- `LightingEngine.cs` — Static BFS-based lighting propagation
  - Light packing: high nibble = sun light (4 bits), low nibble = artificial light (4 bits) in `Block.Light`
  - `PropagateSunLight()` — column top-down + horizontal BFS spread
  - `PropagateArtificialLight()` — BFS from light-emitting blocks
  - `RemoveLight()` — flood-remove + re-propagate remaining sources
  - `OnBlockChanged()` — orchestrates full re-computation on block edits
- `LightingSystem.cs` — Higher-level wrapper using `BlockDefinitionManager`

### Client-Side (TypeScript)
- `ChunkMesh.getLight()` reads light byte from chunk data
- Per-vertex light sampling from 4 surrounding blocks, averaged
- Light multiplier mixed with AO: `finalColor = baseColor * (avgLight / 15) * ao`
- Light-emitting blocks use full brightness (multiplier = 1.0)
- Minimum light floor of 0.1 to prevent pitch-black surfaces

## Tool Mining System

### Server-Side
- `DigBlockStart(x, y, z)` returns dig time based on:
  - Block hardness from `BlockDefinition`
  - Tool group matching against block groups (cracky, crumbly, choppy, snappy, dig_immediate)
  - Tool material multiplier: wooden=2x, stone=4x, iron=6x, diamond=8x, hand=1x
  - `dig_immediate` blocks get 0.15s dig time
  - Dig time = hardness / toolMultiplier (minimum 0.1s)

### Client-Side
- Progressive dig with `digStartTime`, `digTarget`, `digDuration` tracking
- Selection box darkens as dig progresses (opacity 0 to 0.6)
- Auto-completes dig when elapsed >= duration
- Resets on crosshair change or mouse release
- Falls back to instant dig on server communication failure

## Falling Node System

### Server-Side
- `World.GetPendingFallingBlocks()` scans for blocks with `Falling=true` where below is air/liquid
- `GameLoopService.ProcessFallingBlocks()` runs every 10 ticks
- Broadcasts `OnFallingBlock` events to all clients

### Client-Side
- `WorldManager.FallingBlockAnimation` — gravity-based physics animation
- Creates temporary mesh at source position, animates to target over 0.5s
- Applies block data changes on completion

## Liquid Simulation

- Level-based flow using `Block.Param2` for liquid level (0-7 for flowing, 8 for source)
- Water flows every 3 ticks, lava every 5 ticks (viscosity)
- Horizontal spread with randomized direction order
- Level averaging when flowing blocks merge
- Water + lava interaction: source+source → obsidian, flowing → cobblestone
- Level 0 flowing blocks despawn automatically
- Bucket interaction: right-click water/lava with empty bucket to pick up; use water_bucket/lava_bucket to place

## Mob Spawning System

- `MobSpawner.cs` spawns mobs every 10 seconds near players (24-48 blocks away)
- Weighted random selection: Zombie(3), Skeleton(2), Spider(2), Cow(3), Pig(3), Chicken(2)
- Y-range validation per mob type
- Despawn when >128 blocks from nearest player
- Max 50 mobs server-wide
- Mob AI: chase within 16 blocks, attack within 2 blocks, wander when idle
- **Mob death drops:** Items spawned at mob position when killed

## Cloud System

- `CloudSystem.ts` — procedural canvas texture with white radial gradient blobs
- Large plane at Y=120, slowly drifting in X direction with wrapping
- Color/opacity responds to day/night cycle (white → orange/pink → dark gray)
- Toggleable via settings panel

## Post-Processing Effects

- **Damage flash**: Full-screen red overlay, fades from 0.6 to 0 over 0.3s
- **Cave darkness**: Radial-gradient vignette + ambient dimming when player Y < 30
- **Lava overlay**: Orange tint when player is within 4 blocks of lava

## Weather System

- `WeatherSystem.ts` — 800 rain particles with wind effect
- Player-following cylinder (radius 60, height 40)
- Toggles based on time of day (always rain at night, 20% during day)
- Fog density increases during rain

## Waving Vegetation

- Leaves, pine needles, sugar cane blocks get vertex animation
- Sin-wave Y offset on top face vertices (amplitude 0.05, frequency 1-2 Hz)
- Tracked per chunk, updated in WorldManager game loop

## Node Timer System

- Wired into `GameServer.Update()` main loop
- Timers: farmland→dirt (30s, no water), dirt→grass (10-30s, near grass), ice→water (5-10s, near light >12)
- `InitializeNodeTimers()` scans chunks on server start
- Timers persisted to SQLite via `BlockMetadataDatabase`

## Creative Mode & Settings

- Paginated creative inventory UI with search/filter (I key)
- Settings panel (O key): mouse sensitivity, render distance, FOV, volumes, cloud/AO toggles
- All settings persisted to localStorage
- Settings applied in real-time (FOV applied on panel close)

## Player Animation

- Multi-part body: head, torso, legs (x2), arms (x2)
- Walk animation: limb swinging via sin(time * walkSpeed) at ±30 degrees
- Idle pose: all limbs at rest rotation
