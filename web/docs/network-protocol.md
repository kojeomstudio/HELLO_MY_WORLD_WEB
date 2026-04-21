# Network Protocol (SignalR)

## Connection

- **Endpoint**: `/game` (WebSocket, proxied through Vite dev server in development)
- **Protocol**: SignalR over WebSocket
- **Reconnection**: Automatic reconnect enabled on client side
- **Authentication**: Player name passed via `Join` method call after connection

## Server-to-Client Events (IGameClient)

27 callback methods defined in `IGameClient` interface.

### World & Chunk Events
| Event | Payload | Description |
|-------|---------|-------------|
| `OnChunkReceived` | `cx, cy, cz, byte[] data` | Chunk data (4 bytes/block, 16KB/chunk) |
| `OnBlockUpdate` | `x, y, z, blockType` | Block placed or removed |
| `OnBlockDefinitions` | JSON `BlockDefinition[]` | Full block type registry |
| `OnFallingBlock` | `x, y, z, blockType` | Falling block animation trigger |
| `OnTimeUpdate` | `gameTime` | Day/night cycle time (0-23999) |

### Player Events
| Event | Payload | Description |
|-------|---------|-------------|
| `OnPlayerJoined` | `name` | Player joined the game |
| `OnPlayerLeft` | `name` | Player disconnected |
| `OnPlayerListUpdate` | `string[]` | Full player name list |
| `OnPlayerPositionUpdate` | `name, x, y, z, yaw, pitch` | Other player movement |
| `OnHealthUpdate` | `health` | Player health changed |
| `OnBreathUpdate` | `breath` | Underwater breath changed |
| `OnDeath` | `message` | Player died |
| `OnKnockback` | `x, y, z` | Knockback force applied |
| `OnGameModeChanged` | `gameMode` | Game mode changed |
| `OnTeleported` | `x, y, z` | Player teleported |
| `OnPositionCorrection` | `x, y, z, yaw, pitch` | Server position override |

### Inventory Events
| Event | Payload | Description |
|-------|---------|-------------|
| `OnInventoryUpdate` | `ItemStack[]` | Full inventory sync |
| `OnArmorUpdate` | `ItemStack[]` | Armor slots update |
| `OnExperienceUpdate` | `level, progress` | XP level and progress bar |

### Entity Events
| Event | Payload | Description |
|-------|---------|-------------|
| `OnEntitySpawned` | `id, type, x, y, z, itemId?, count?` | Entity appeared |
| `OnEntityDespawned` | `id` | Entity removed |
| `OnEntityUpdate` | `id, x, y, z` | Entity position update |

### UI Events
| Event | Payload | Description |
|-------|---------|-------------|
| `OnChatMessage` | `sender, message, isSystem` | Chat message |
| `OnCraftResult` | `message` | Crafting result |
| `OnPrivilegeList` | `string[]` | Player's privileges |
| `OnCraftingRecipes` | JSON recipes | Available crafting recipes |
| `OnSmeltingRecipes` | JSON recipes | Available smelting recipes |
| `OnChestInventory` | `items[], playerItems[]` | Chest contents |
| `OnFurnaceUpdate` | `input, fuel, output, progress, fuelProgress` | Furnace state |

## Client-to-Server Methods (Hub)

30+ methods callable by the client.

### Connection & Player
| Method | Parameters | Description |
|--------|-----------|-------------|
| `Join` | `name` | Authenticate and join game |
| `Respawn` | - | Respawn after death |
| `UpdatePosition` | `x, y, z, vx, vy, vz, yaw, pitch` | Movement sync |

### Block Interaction
| Method | Parameters | Description |
|--------|-----------|-------------|
| `RequestChunk` | `cx, cy, cz` | Request chunk data |
| `DigBlockStart` | `x, y, z` | Start digging (returns dig time) |
| `DigBlock` | `x, y, z` | Complete block break |
| `PlaceBlock` | `x, y, z, blockType` | Place block |
| `UseBucket` | `x, y, z, place` | Pick up or place liquid |
| `InteractWithBlock` | `x, y, z` | Open chest/furnace/crafting, toggle doors |

### Inventory & Crafting
| Method | Parameters | Description |
|--------|-----------|-------------|
| `SelectSlot` | `slot` | Change hotbar selection |
| `RequestInventory` | - | Full inventory sync |
| `DropItem` | `slot, count` | Drop item as entity |
| `UseItem` | `slot` | Consume food/bucket |
| `Craft` | `recipeId` | Craft by recipe ID |
| `CraftRecipe` | `index` | Craft by recipe index |
| `GetCraftingRecipes` | - | Request crafting recipe list |
| `GetSmeltingRecipes` | - | Request smelting recipe list |
| `StartSmelting` | `input, result, x, y, z` | Start furnace operation |

### Container Management
| Method | Parameters | Description |
|--------|-----------|-------------|
| `GetChestInventory` | `x, y, z` | Request chest contents |
| `MoveItemToChest` | `x, y, z, slot, item, count` | Move item to chest |
| `TakeItemFromChest` | `x, y, z, slot, count` | Take item from chest |

### Armor
| Method | Parameters | Description |
|--------|-----------|-------------|
| `EquipArmor` | `slot, armorSlot` | Equip armor piece |
| `UnequipArmor` | `armorSlot` | Remove armor piece |

### Combat
| Method | Parameters | Description |
|--------|-----------|-------------|
| `PunchPlayer` | `targetName` | PVP attack |

### Social & Admin
| Method | Parameters | Description |
|--------|-----------|-------------|
| `SendChat` | `message` | Chat or /command |
| `GetPrivileges` | - | Query privilege list |

## Rate Limiting

| Action | Cooldown |
|--------|----------|
| Position update | 50ms |
| Chat message | 500ms |
| Place/Dig block | 250ms |
| Chunk request | 100ms |
| Bucket use | 500ms |

Rate limiter uses static `Dictionary<string, DateTime>` keyed by `connectionId + action`. Auto-cleanup when >10000 entries.

## Message Flow Examples

### Block Break (Dig)
```
Client                          Server
  |                                |
  |-- DigBlockStart(x,y,z) ------>|
  |<-- digTime (float) -----------|
  |   (client shows progress)     |
  |                                |
  |-- DigBlock(x,y,z) ----------->|
  |     (server validates)         |
  |     (server updates world)     |
  |     (server broadcasts)        |
  |<-- OnBlockUpdate --------------|  (to all clients)
  |<-- OnInventoryUpdate ---------|  (to digger)
```

### Block Place
```
Client                          Server
  |                                |
  |   (PlayerController raycasts)  |
  |   (dispatches blockAction)     |
  |   (UIManager sends RPC)        |
  |-- PlaceBlock(x,y,z,type) ---->|
  |     (server validates)         |
  |     (server updates world)     |
  |     (server broadcasts)        |
  |<-- OnBlockUpdate --------------|  (to all clients)
  |<-- OnInventoryUpdate ---------|  (to placer)
```

### Interactive Block (Chest)
```
Client                          Server
  |                                |
  |   (PlayerController raycasts)  |
  |   (dispatches interactBlock)   |
  |   (UIManager sends RPC)        |
  |-- InteractWithBlock(x,y,z) -->|
  |     (server finds chest)       |
  |     (server loads inventory)   |
  |<-- OnChestInventory ----------|  (to opener)
  |   (UIManager shows chest UI)   |
  |                                |
  |-- TakeItemFromChest(x,y,z, 0) >|
  |<-- OnChestInventory ----------|  (updated)
```
