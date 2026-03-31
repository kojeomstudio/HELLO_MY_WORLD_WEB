# Server API Reference

## SignalR Hub Connection

**Endpoint:** `/game`

**Protocol:** WebSocket (SignalR)

## Rate Limiting

The following Hub methods are rate-limited per connection:

| Method | Cooldown | Action Key |
|--------|----------|------------|
| `SendChat` | 500ms | `chat` |
| `DigBlock` | 250ms | `dig` |
| `PlaceBlock` | 250ms | `place` |

Requests within the cooldown window are silently ignored. Rate limits are tracked via a static `Dictionary<string, DateTime>` keyed by `"{connectionId}:{action}"`.

## Client Methods

### Join
Register player in the game world.

```typescript
connection.invoke("Join", playerName: string): Promise<void>
```

**Triggers:**
- `OnPlayerJoined` to all clients
- `OnPlayerListUpdate` to caller
- `OnHealthUpdate` to caller
- `OnInventoryUpdate` to caller (starter items: wooden_pickaxe, wooden_sword, torch x16, bread x5)
- `OnTimeUpdate` to caller
- `OnBlockDefinitions` to caller
- Initial chunk delivery (7x4x7 around spawn)

---

### UpdatePosition
Synchronize player position and movement.

```typescript
connection.invoke(
  "UpdatePosition",
  x: number, y: number, z: number,
  vx: number, vy: number, vz: number,
  yaw: number, pitch: number
): Promise<void>
```

**Server behavior:** Validates position via `ValidatePlayerPosition()` which caps distance per tick to `maxSpeed * dt * 1.5f`. Broadcasts to players within 64-block range.

---

### SendChat
Broadcast chat message or execute slash command.

```typescript
connection.invoke("SendChat", message: string): Promise<void>
```

**Rate limited:** 500ms cooldown. Messages starting with `/` are routed to `ChatCommandManager`.

---

### PlaceBlock
Place a block in the world.

```typescript
connection.invoke(
  "PlaceBlock",
  x: number, y: number, z: number,
  blockType: number
): Promise<void>
```

**Rate limited:** 250ms cooldown.

**Validation:** Block definition must exist and not be Air.

**Triggers:** `OnBlockUpdate` to all clients.

---

### DigBlock
Remove a block from the world.

```typescript
connection.invoke("DigBlock", x: number, y: number, z: number): Promise<void>
```

**Rate limited:** 250ms cooldown.

**Validation:** Block must be non-zero and breakable.

**Side effects:**
1. Removes block from world
2. Spawns `ItemEntity` with drop item at block position
3. Applies tool wear (decrements durability)
4. Destroys tool if durability reaches 0
5. Updates player inventory

**Triggers:** `OnBlockUpdate` to all clients, `OnInventoryUpdate` to caller.

---

### DigBlockStart
Validate that a block can be dug.

```typescript
connection.invoke("DigBlockStart", x: number, y: number, z: number): Promise<boolean>
```

**Returns:** `true` if block is non-air and breakable, `false` otherwise.

---

### InteractWithBlock
Open UI for interactive blocks.

```typescript
connection.invoke("InteractWithBlock", x: number, y: number, z: number): Promise<void>
```

**Behavior by block type:**

| Block | Action |
|-------|--------|
| `chest` | Sends `OnChestInventory` with 27-slot contents |
| `furnace` | Sends `OnSmeltingRecipes` + existing `OnFurnaceUpdate` if active |
| `crafting_table` | Sends `OnCraftingRecipes` with all recipes |

---

### RequestChunk
Request chunk data from server.

```typescript
connection.invoke(
  "RequestChunk",
  chunkX: number, chunkY: number, chunkZ: number
): Promise<void>
```

**Triggers:** `OnChunkReceived` to caller with 16KB binary data.

---

### SelectSlot
Change selected hotbar slot.

```typescript
connection.invoke("SelectSlot", slot: number): Promise<void>
```

---

### PunchPlayer
Attack another player.

```typescript
connection.invoke("PunchPlayer", targetName: string): Promise<void>
```

**Damage calculation:** Based on held tool type:

| Tool | Damage |
|------|--------|
| Wooden sword | 4 |
| Stone sword | 5 |
| Iron sword | 6 |
| Diamond sword | 7 |
| Wooden axe | 3 |
| Stone axe | 4 |
| Iron axe | 5 |
| Diamond axe | 6 |
| Other tool / bare hand | 1-2 |

**Triggers:** `OnKnockback` to target, `OnHealthUpdate` if killed.

---

### GetPrivileges
Query caller's privilege list.

```typescript
connection.invoke("GetPrivileges"): Promise<void>
```

**Triggers:** `OnPrivilegeList` to caller.

---

### UseItem
Consume a food item from inventory.

```typescript
connection.invoke("UseItem", slotIndex: number): Promise<void>
```

**Food items:** bread, apple, cooked_beef, cooked_pork, raw_beef, raw_pork, carrot, potato, baked_potato, mushroom_stew, melon_slice, cookie, cake.

**Effects:** Heals 2.0 HP, feeds 4.0 food.

---

### Craft
Auto-match and craft a recipe from available inventory items.

```typescript
connection.invoke("Craft", recipeId: string): Promise<void>
```

---

### GetCraftingRecipes
Request all available crafting recipes.

```typescript
connection.invoke("GetCraftingRecipes"): Promise<void>
```

**Triggers:** `OnCraftingRecipes` to caller with array of recipe objects.

---

### CraftRecipe
Craft a specific recipe by index.

```typescript
connection.invoke("CraftRecipe", recipeIndex: number): Promise<void>
```

**Validation:**
- `recipeIndex` must be within recipe list bounds
- Player must have all required ingredients

**Error responses:** `OnChatMessage` with error description.

**Triggers:** `OnInventoryUpdate`, `OnCraftResult`.

---

### GetSmeltingRecipes
Request all available smelting recipes.

```typescript
connection.invoke("GetSmeltingRecipes"): Promise<void>
```

**Triggers:** `OnSmeltingRecipes` to caller with array of smelting recipe objects.

---

### StartSmelting
Begin a smelting operation in a furnace.

```typescript
connection.invoke(
  "StartSmelting",
  inputItemId: string,
  resultItemId: string,
  x: number, y: number, z: number
): Promise<void>
```

**Validation:**
- No existing active furnace at position
- Valid smelting recipe exists for input
- Player has input item in inventory
- Player has fuel (coal or charcoal) in inventory

**Side effects:**
1. Consumes 1 input item and 1 fuel from player inventory
2. Creates `FurnaceOperation` tracked on server
3. Progress updates sent via `OnFurnaceUpdate` every ~0.5s

**Triggers:** `OnInventoryUpdate`, `OnFurnaceUpdate`, `OnChatMessage`.

---

### GetChestInventory
Request contents of a chest at specific coordinates.

```typescript
connection.invoke("GetChestInventory", x: number, y: number, z: number): Promise<void>
```

**Triggers:** `OnChestInventory` with 27-slot array to caller. Creates empty chest if none exists.

---

### MoveItemToChest
Move an item from player inventory to a chest.

```typescript
connection.invoke(
  "MoveItemToChest",
  slotIndex: number,
  chestSlot: number,
  x: number, y: number, z: number
): Promise<void>
```

**Parameters:**
- `slotIndex` — Player inventory slot (0-31)
- `chestSlot` — Target chest slot (-1 for auto-find first available)
- `x, y, z` — Chest block position

**Behavior:**
- If `chestSlot >= 0`: attempts to place in that specific slot
- If `chestSlot == -1`: auto-finds empty slot or stackable slot (max 64)
- Stacks with existing items of same type when possible

**Triggers:** `OnInventoryUpdate`, `OnChestInventory`.

---

### TakeItemFromChest
Move an item from a chest to player inventory.

```typescript
connection.invoke(
  "TakeItemFromChest",
  chestSlot: number,
  slotIndex: number,
  x: number, y: number, z: number
): Promise<void>
```

**Parameters:**
- `chestSlot` — Source chest slot (0-26)
- `slotIndex` — Target player inventory slot (-1 for auto-find)
- `x, y, z` — Chest block position

**Behavior:**
- If `slotIndex >= 0`: attempts to place in that specific slot
- If `slotIndex == -1`: auto-finds empty slot or stackable slot
- Stacks with existing items of same type when possible

**Triggers:** `OnInventoryUpdate`, `OnChestInventory`.

---

### Respawn
Respawn a dead player.

```typescript
connection.invoke("Respawn"): Promise<void>
```

**Side effects:** Resets health, teleports to spawn point, re-sends chunks.

**Triggers:** `OnHealthUpdate`, `OnChunkReceived`.

---

### DropItem
Drop an item from inventory as an entity.

```typescript
connection.invoke("DropItem", slotIndex: number, count: number): Promise<void>
```

**Triggers:** `OnInventoryUpdate`, `OnEntitySpawned`.

---

### RequestInventory
Request full inventory sync.

```typescript
connection.invoke("RequestInventory"): Promise<void>
```

**Triggers:** `OnInventoryUpdate` to caller.

---

## Server Events

### OnChunkReceived
Delivers chunk block data.

```typescript
connection.on("OnChunkReceived", (
  chunkX: number,
  chunkY: number,
  chunkZ: number,
  data: Uint8Array  // 16384 bytes: 4096 blocks × 4 bytes
) => void)
```

**Data Format (per block):**
| Byte | Content |
|------|---------|
| 0 | BlockType (enum) |
| 1 | Param1 |
| 2 | Param2 |
| 3 | Light level |

---

### OnPlayerJoined
Notifies when a player joins.

```typescript
connection.on("OnPlayerJoined", (playerName: string) => void)
```

---

### OnPlayerLeft
Notifies when a player leaves.

```typescript
connection.on("OnPlayerLeft", (playerName: string) => void)
```

---

### OnPlayerListUpdate
Full player list synchronization.

```typescript
connection.on("OnPlayerListUpdate", (players: string[]) => void)
```

---

### OnPlayerPositionUpdate
Other player position updates.

```typescript
connection.on("OnPlayerPositionUpdate", (
  playerName: string,
  x: number, y: number, z: number,
  yaw: number, pitch: number
) => void)
```

---

### OnChatMessage
Chat message broadcast.

```typescript
connection.on("OnChatMessage", (sender: string, message: string) => void)
```

---

### OnBlockUpdate
Block change notification.

```typescript
connection.on("OnBlockUpdate", (
  x: number, y: number, z: number,
  blockData: number  // ushort: (Type << 8) | Param1
) => void)
```

---

### OnHealthUpdate
Player health synchronization.

```typescript
connection.on("OnHealthUpdate", (
  health: number,
  maxHealth: number
) => void)
```

---

### OnInventoryUpdate
Inventory content synchronization.

```typescript
connection.on("OnInventoryUpdate", (items: object[]) => void)
```

**Item format:**
```json
{ "itemId": "wooden_pickaxe", "count": 1, "metadata": "59" }
```

---

### OnTimeUpdate
Game time update.

```typescript
connection.on("OnTimeUpdate", (
  time: number,     // DateTime ticks
  speed: number,    // Time speed multiplier
  skyBrightness: number  // 0.0 (night) to 1.0 (day)
) => void)
```

---

### OnDeath
Death notification.

```typescript
connection.on("OnDeath", (message: string) => void)
```

---

### OnKnockback
PvP knockback impulse.

```typescript
connection.on("OnKnockback", (
  vx: number,
  vy: number,
  vz: number
) => void)
```

---

### OnGameModeChanged
Game mode change notification.

```typescript
connection.on("OnGameModeChanged", (mode: string) => void)
```

Modes: `"survival"`, `"creative"`, `"adventure"`, `"spectator"`.

---

### OnTeleported
Player teleportation.

```typescript
connection.on("OnTeleported", (
  x: number,
  y: number,
  z: number
) => void)
```

---

### OnPrivilegeList
Player privilege list.

```typescript
connection.on("OnPrivilegeList", (privileges: string[]) => void)
```

---

### OnBreathUpdate
Player breath/drowning sync.

```typescript
connection.on("OnBreathUpdate", (
  breath: number,
  maxBreath: number
) => void)
```

---

### OnCraftingRecipes
Crafting recipe list.

```typescript
connection.on("OnCraftingRecipes", (recipes: object[]) => void)
```

**Recipe format:**
```json
{
  "result": "wooden_planks",
  "resultCount": 4,
  "ingredients": [["wood", 1]]
}
```

---

### OnSmeltingRecipes
Smelting recipe list.

```typescript
connection.on("OnSmeltingRecipes", (recipes: object[]) => void)
```

**Recipe format:**
```json
{
  "input": "iron_ore",
  "result": "iron_ingot",
  "cookTime": 10.0,
  "experience": 0.1
}
```

---

### OnChestInventory
Chest contents (27 slots).

```typescript
connection.on("OnChestInventory", (items: object[]) => void)
```

**Array length:** 27. Null entries = empty slots.

---

### OnFurnaceUpdate
Furnace smelting state update.

```typescript
connection.on("OnFurnaceUpdate", (
  input: string,
  fuel: string,
  output: string,
  progress: number
) => void)
```

- `progress`: 0.0 to 1.0 (1.0 = complete)
- Empty strings indicate no item in that slot

---

### OnEntitySpawned
New entity created in the world.

```typescript
connection.on("OnEntitySpawned", (
  entityId: string,   // Guid
  entityType: string, // "item" or "mob"
  x: number,
  y: number,
  z: number
) => void)
```

---

### OnEntityUpdate
Entity position update.

```typescript
connection.on("OnEntityUpdate", (
  entityId: string,
  x: number,
  y: number,
  z: number
) => void)
```

---

### OnEntityDespawned
Entity removed from the world.

```typescript
connection.on("OnEntityDespawned", (entityId: string) => void)
```

---

### OnCraftResult
Crafting completion notification.

```typescript
connection.on("OnCraftResult", (
  itemId: string,
  count: number
) => void)
```

---

### OnBlockDefinitions
Full block definition JSON from server.

```typescript
connection.on("OnBlockDefinitions", (definitionsJson: string) => void)
```

---

## Connection Lifecycle

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Connect     │────>│    Join()    │────>│   Playing    │
│  (WebSocket) │     │  (Register)  │     │   (Active)   │
└──────────────┘     └──────────────┘     └──────────────┘
                                                  │
                                                  ▼
                                           ┌──────────────┐
                                           │ Disconnect   │
                                           │ (Cleanup)    │
                                           └──────────────┘
```

## Error Handling

- **Join Failure:** `OnChatMessage("Server", "Failed to join...")`
- **Invalid Actions:** Silently ignored (null player check)
- **Rate Limited:** Silently ignored (no response)
- **Craft Failure:** `OnChatMessage("Server", "No matching crafting recipe.")` or `"Missing ingredients for {item}."`
- **Smelting Failure:** `OnChatMessage("Server", "Cannot start smelting...")`
