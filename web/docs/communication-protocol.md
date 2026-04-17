# Communication Protocol

SignalR over WebSocket (`/game` endpoint). Strongly-typed via `IGameClient` interface.

## Server-to-Client (IGameClient)

28 methods invoked by server, received by client:

| Method | Parameters | Description |
|--------|-----------|-------------|
| `OnChunkReceived` | chunkX, chunkY, chunkZ, data (byte[]) | Chunk data (16KB, 4 bytes/block) |
| `OnPlayerJoined` | name | Player joined game |
| `OnPlayerLeft` | name | Player disconnected |
| `OnPlayerListUpdate` | players (string[]) | Full player list |
| `OnPlayerPositionUpdate` | name, x, y, z, yaw, pitch | Other player movement |
| `OnChatMessage` | sender, message | Chat message |
| `OnBlockUpdate` | x, y, z, blockType | Block changed in world |
| `OnHealthUpdate` | health, maxHealth | Player health change |
| `OnInventoryUpdate` | items ({itemId, count, metadata}[]) | Full inventory update |
| `OnTimeUpdate` | gameTime, timeSpeed, skyBrightness | Day/night cycle |
| `OnEntitySpawned` | id, type, x, y, z, itemId?, count? | Entity appeared |
| `OnEntityDespawned` | id | Entity removed |
| `OnEntityUpdate` | id, x, y, z, yaw? | Entity position update |
| `OnCraftResult` | success, message?, result? | Crafting outcome |
| `OnBlockDefinitions` | json (string) | All block type definitions |
| `OnDeath` | message | Player died |
| `OnBreathUpdate` | breath, maxBreath | Breath (underwater) |
| `OnKnockback` | vx, vy, vz | Knockback impulse |
| `OnPrivilegeList` | privileges (string[]) | Player privileges |
| `OnGameModeChanged` | mode (string) | Game mode change |
| `OnTeleported` | x, y, z | Teleport destination |
| `OnCraftingRecipes` | recipes (array) | Available crafting recipes |
| `OnSmeltingRecipes` | recipes (array) | Available smelting recipes |
| `OnChestInventory` | items (array), position | Chest contents |
| `OnFurnaceUpdate` | input?, fuel?, output?, progress?, position | Furnace state |
| `OnFallingBlock` | fromX,Y,Z, toX,Y,Z, blockType | Falling block animation |
| `OnArmorUpdate` | items (array) | Armor slot contents |
| `OnExperienceUpdate` | level, totalExp | Experience update |
| `OnFoodUpdate` | foodLevel: float, maxFood: float | Food/hunger level update |

## Client-to-Server (GameHub)

25+ methods invoked by client on server hub:

| Method | Rate Limit | Parameters | Returns | Description |
|--------|-----------|------------|---------|-------------|
| `Join` | - | name | void | Join game, receive chunks + definitions |
| `UpdatePosition` | - | x,y,z,vx,vy,vz,yaw,pitch | void | Player position broadcast |
| `SendChat` | 500ms | message | void | Chat or command (starts with /) |
| `PlaceBlock` | 250ms | x,y,z,blockType | void | Place block in world |
| `DigBlock` | 250ms | x,y,z | void | Break block, spawn item drop |
| `DigBlockStart` | - | x,y,z | float | Returns dig duration in seconds |
| `UseItem` | - | slotIndex | void | Use item (food/bucket/milk) |
| `Respawn` | - | - | void | Respawn after death |
| `RequestChunk` | - | cx,cy,cz | void | Request chunk data |
| `SelectSlot` | - | slot | void | Change hotbar selection |
| `InteractBlock` | - | x,y,z | void | Stub |
| `InteractWithBlock` | - | x,y,z | void | Open chest/furnace/crafting, toggle door, collect liquid |
| `PunchPlayer` | - | targetName | void | Melee attack with tool damage |
| `GetPrivileges` | - | - | void | Request privilege list |
| `Craft` | - | recipeId | void | Auto-craft recipe |
| `GetCraftingRecipes` | - | - | void | Request crafting recipes |
| `CraftRecipe` | - | index | void | Craft recipe by index |
| `GetSmeltingRecipes` | - | - | void | Request smelting recipes |
| `StartSmelting` | - | input,result,x,y,z | void | Start furnace operation |
| `GetChestInventory` | - | x,y,z | void | Request chest contents |
| `MoveItemToChest` | - | slot,chestSlot,x,y,z | void | Player -> Chest |
| `TakeItemFromChest` | - | chestSlot,slot,x,y,z | void | Chest -> Player |
| `RequestInventory` | - | - | void | Re-send inventory |
| `DropItem` | - | slot,count | void | Drop item as entity |
| `EquipArmor` | - | slotIndex,armorSlot | void | Inventory -> Armor slot |
| `UnequipArmor` | - | armorSlot | void | Armor -> Inventory |

## Dig System Flow

```
Client                          Server
  |                               |
  |-- DigBlockStart(x,y,z) ------>|
  |<-- digDuration (float) -------|
  |                               |
  |  [Client-side dig timer]      |
  |  [SelectionBox progress]      |
  |                               |
  |-- DigBlock(x,y,z) ----------->|
  |   (when progress >= 1.0)      |
  |                               |
  |   Server: validate, set Air,  |
  |   spawn ItemEntity,           |
  |   decrement tool durability   |
  |                               |
  |<-- OnBlockUpdate -------------|
  |<-- OnEntitySpawned (drop) ----|
  |<-- OnInventoryUpdate ---------|
```

## Place Block Flow

```
Client                              Server
  |                                   |
  | PlayerController.onPlace()        |
  | Raycast -> target block + normal  |
  | dispatches 'blockAction' event    |
  |                                   |
  | UIManager receives event          |
  | invokes PlaceBlock(x,y,z,type) -->|
  |                                   |
  |   Server: validate block type,    |
  |   check collision, set block,     |
  |   handle door/furnace/etc.        |
  |                                   |
  |<-- OnBlockUpdate -----------------|
```

## Chunk Transfer

- Client requests chunks within renderDistance=4 (circular), Y from -1 to +2
- Server serializes chunk: 16x16x16 x 4 bytes = 16,384 bytes per chunk
- Initial join: 7x4x7 = 196 chunks sent
- Periodic: client re-requests every 2 seconds around player position

## Block Data Format (4 bytes per block)

| Byte | Content |
|------|---------|
| 0 | Block type (0-67) |
| 1 | Param1 (rotation/state) |
| 2 | Param2 (additional state) |
| 3 | Light (4-bit sun << 4 \| 4-bit artificial) |
