# Communication Protocol

## Overview

Client and server communicate via **SignalR over WebSocket** on the `/game` endpoint. The Vite dev server proxies `/game` to the ASP.NET Core server.

## Network Topology

```
Browser (localhost:5173)
    |
    | /game (WebSocket proxy)
    v
Vite Dev Server (port 5173)
    |
    | proxy -> http://localhost:5266/game
    v
ASP.NET Core Server (port 5266)
    |
    v
GameHub (SignalR Hub)
```

**Production:** Browser connects directly to the ASP.NET Core server (no proxy).

## Protocol Details

### Transport
- **WebSocket** (preferred, auto-negotiated by SignalR)
- Fallback: Server-Sent Events, Long Polling (SignalR default)
- Binary protocol for chunk data (byte[])

### Connection Flow

```
1. Browser loads index.html
2. User enters name and clicks "Play"
3. App calls gameClient.connect(playerName)
4. GameClient builds HubConnectionBuilder to "/game"
5. SignalR negotiates transport -> upgrades to WebSocket
6. GameClient registers 24 server event handlers
7. GameClient invokes "Join(playerName)"
8. Server validates, creates Player, sends initial sync:
   - OnBlockDefinitions (full JSON)
   - OnInventoryUpdate (starter items)
   - OnHealthUpdate
   - OnTimeUpdate
   - OnChunkReceived x N (7x4x7 initial chunks)
   - OnPlayerListUpdate
9. Game loop starts (requestAnimationFrame)
```

### Tick Rates

| Update Type | Rate | Trigger |
|-------------|------|---------|
| Client position send | Every frame (~60 Hz) | requestAnimationFrame |
| Server game tick | 20 TPS (50ms) | BackgroundService timer |
| Server time broadcast | Every 100 ticks (~5s) | GameLoopService |
| Chunk requests | Every 2s | GameClient timer |
| Entity broadcasts | Every tick | GameLoopService |
| Furnace progress updates | Every 10 ticks (~0.5s) | GameServer.UpdateFurnaces() |
| World auto-save | Every 300s (5 min) | GameLoopService.CheckAutoSave() |

## Rate Limiting

Hub methods use a static cooldown dictionary (`Dictionary<string, DateTime>`) to prevent abuse:

| Action | Cooldown | Message | Behavior |
|--------|----------|---------|----------|
| `chat` | 500ms | `SendChat` | Silently ignored if within cooldown |
| `dig` | 250ms | `DigBlock` | Silently ignored if within cooldown |
| `place` | 250ms | `PlaceBlock` | Silently ignored if within cooldown |
| `bucket` | 500ms | `UseBucket` | Silently ignored if within cooldown |

Key format: `"{connectionId}:{action}"`. Rate limits are per-connection and reset on each successful invocation.

All other Hub methods (position updates, crafting, smelting, chest, etc.) are not rate-limited.

## Client -> Server Messages

### Connection Management

| Message | When | Data |
|---------|------|------|
| `Join(playerName)` | Login | string |
| (Disconnect) | Close tab/browser | — |

### Position Sync

| Message | Rate | Data |
|---------|------|------|
| `UpdatePosition` | Every frame | x, y, z, vx, vy, vz, yaw, pitch (all float) |

### World Interaction

| Message | When | Data | Validation | Rate Limit |
|---------|------|------|------------|------------|
| `DigBlockStart` | Mouse left down | x, y, z (int) | Non-air, breakable | — |
| `DigBlock` | Mouse left up | x, y, z (int) | Breakable, tool durability | 250ms |
| `PlaceBlock` | Mouse right click | x, y, z (int), blockType (ushort) | Block exists | 250ms |
| `InteractBlock` | — | x, y, z (int) | — | — |
| `InteractWithBlock` | Mouse right on interactive | x, y, z (int) | Interactive block | — |
| `UseBucket` | Bucket fluid interaction | x, y, z (int), place (bool) | Held bucket item | 500ms |
| `RequestChunk` | Chunk needed | chunkX, Y, Z (int) | Chunk exists | — |

### Player Actions

| Message | When | Data | Rate Limit |
|---------|------|------|------------|
| `SendChat` | Enter in chat | message (string) | 500ms |
| `PunchPlayer` | Attack player | targetName (string) | — |
| `UseItem` | Food consumption | slotIndex (int) | — |
| `Craft` | Crafting (auto-match) | recipeId (string) | — |
| `Respawn` | After death | — | — |
| `SelectSlot` | Hotbar change | slot (int) | — |
| `RequestInventory` | Manual sync | — | — |
| `DropItem` | Item drop | slotIndex (int), count (int) | — |
| `GetPrivileges` | Query privs | — | — |

### Crafting & Smelting

| Message | When | Data |
|---------|------|------|
| `GetCraftingRecipes` | Open crafting UI | — |
| `CraftRecipe` | Click craft button | recipeIndex (int) |
| `GetSmeltingRecipes` | Open furnace UI | — |
| `StartSmelting` | Click smelt button | inputItemId (string), resultItemId (string), x, y, z (int) |

### Chest Inventory

| Message | When | Data |
|---------|------|------|
| `GetChestInventory` | Open chest / right-click chest | x, y, z (int) |
| `MoveItemToChest` | Click player slot in chest UI | slotIndex (int), chestSlot (int), x, y, z (int) |
| `TakeItemFromChest` | Click chest slot in chest UI | chestSlot (int), slotIndex (int), x, y, z (int) |

## Server -> Client Messages

### World Data

| Message | Data Size | Description |
|---------|-----------|-------------|
| `OnChunkReceived` | ~16 KB | 4096 blocks x 4 bytes |
| `OnBlockUpdate` | ~16 bytes | Single block change |
| `OnBlockDefinitions` | ~10 KB | Full JSON string |

### Player Data

| Message | Data | Description |
|---------|------|-------------|
| `OnHealthUpdate` | health, maxHealth (float) | Health sync |
| `OnBreathUpdate` | breath, maxBreath (float) | Breath sync |
| `OnInventoryUpdate` | object[] | Full inventory |
| `OnPlayerJoined` | playerName (string) | Player join |
| `OnPlayerLeft` | playerName (string) | Player leave |
| `OnPlayerListUpdate` | string[] | All online players |
| `OnPlayerPositionUpdate` | name, x, y, z, yaw, pitch (float) | Other player pos |
| `OnDeath` | message (string) | Death notification |
| `OnKnockback` | vx, vy, vz (float) | PvP knockback |
| `OnGameModeChanged` | mode (string) | Mode change |
| `OnTeleported` | x, y, z (float) | Teleport |
| `OnPrivilegeList` | string[] | Player privileges |

### World State

| Message | Data | Description |
|---------|------|-------------|
| `OnTimeUpdate` | time (long), speed (float), skyBrightness (float) | Day/night |
| `OnEntitySpawned` | entityId (Guid), type (string), x, y, z (float) | New entity |
| `OnEntityUpdate` | entityId (Guid), x, y, z (float) | Entity position |
| `OnEntityDespawned` | entityId (Guid) | Entity removed |
| `OnChatMessage` | sender, message (string) | Chat broadcast |
| `OnCraftResult` | itemId (string), count (int) | Craft result |

### Crafting & Smelting Responses

| Message | Data | Description |
|---------|------|-------------|
| `OnCraftingRecipes` | object[] | All crafting recipes with ingredients |
| `OnSmeltingRecipes` | object[] | All smelting recipes with cook times |
| `OnFurnaceUpdate` | input (string), fuel (string), output (string), progress (float) | Furnace state update |

### Chest Inventory Responses

| Message | Data | Description |
|---------|------|-------------|
| `OnChestInventory` | object[] | 27-slot chest contents |

## Crafting Recipe Format

`OnCraftingRecipes` returns an array of recipe objects:

```json
[
    {
        "result": "wooden_planks",
        "resultCount": 4,
        "ingredients": [["wood", 1]]
    },
    {
        "result": "stone_brick",
        "resultCount": 4,
        "ingredients": [["cobblestone", 4]]
    }
]
```

## Smelting Recipe Format

`OnSmeltingRecipes` returns an array of recipe objects:

```json
[
    {
        "input": "iron_ore",
        "result": "iron_ingot",
        "cookTime": 10.0,
        "experience": 0.1
    }
]
```

## Furnace Update Format

`OnFurnaceUpdate` provides real-time smelting state:

```json
{
    "input": "iron_ore",
    "fuel": "coal",
    "output": "",
    "progress": 0.65
}
```

When smelting completes:

```json
{
    "input": "",
    "fuel": "",
    "output": "iron_ingot",
    "progress": 1.0
}
```

## Chest Inventory Format

`OnChestInventory` returns a 27-element array:

```json
[
    { "itemId": "cobblestone", "count": 32, "metadata": null },
    null,
    { "itemId": "wooden_sword", "count": 1, "metadata": "45" },
    null,
    ... (27 slots total)
]
```

Null = empty slot. `metadata` stores tool durability as string.

## Chunk Data Format

Each chunk is 16x16x16 blocks serialized as 16,384 bytes:

```
[Block 0][Block 1]...[Block 4095]

Each Block = 4 bytes:
  Byte 0: BlockType  (low byte of ushort)
  Byte 1: Param1     (metadata)
  Byte 2: Param2     (metadata)
  Byte 3: Light      (0-15)

Index calculation:  (x * 256 + y * 16 + z) * 4
```

**Wire format:** SignalR serializes `byte[]` efficiently. No compression despite config flag.

## Block Update Format

Single block changes use a packed `ushort`:
```
blockData = (Param1 << 8) | BlockType
```

Client extracts: `BlockType = blockData & 0xFF`, `Param1 = (blockData >> 8) & 0xFF`.

## Inventory Serialization

Inventory items are serialized as anonymous objects:
```json
[
    { "itemId": "wooden_pickaxe", "count": 1, "metadata": "59" },
    { "itemId": "torch", "count": 16 },
    null,
    ...
]
```

Total 32 slots. Null = empty. `metadata` stores tool durability as string.

## Security Notes

- **No authentication:** Players are identified by name only
- **Server-authoritative physics validation:** `ValidatePlayerPosition()` caps movement to `maxSpeed * dt * 1.5f` per tick
- **Rate limiting** on `SendChat` (500ms), `DigBlock` (250ms), `PlaceBlock` (250ms), `UseBucket` (500ms)
- **No input validation** beyond basic null checks and property checks
- **Bans are in-memory:** Lost on server restart
- **Chest inventories are in-memory:** Lost on server restart
- **Furnace operations are in-memory:** Lost on server restart
- **World auto-saves** to disk every 5 minutes

## Error Handling

| Scenario | Server Behavior | Client Behavior |
|----------|----------------|-----------------|
| Join with taken name | Silent fail, no OnPlayerJoined | Stuck on loading |
| Join while banned | `AuthResult.Banned` | Chat error message |
| Server full | `AuthResult.ServerFull` | Chat error message |
| Hub method exception | Caught, logged, swallowed | No response |
| Connection drop | `OnDisconnectedAsync` cleanup | Shows login screen |
| Invalid block coordinates | Null player check -> silent | No response |
| Rate limited action | `CheckRateLimit` returns false | No response |
| UseBucket failure | Returns `false` | No response |
| Invalid recipe index | Chat error "Invalid recipe index" | Chat notification |
| Missing crafting ingredients | Chat error "Missing ingredients" | Chat notification |
| Cannot start smelting | Chat error "Cannot start smelting" | Chat notification |
| Invalid chest slot | Silent return | No response |

## Internal Event Communication (Client-side)

### blockAction CustomEvent

`PlayerController` dispatches, `UIManager` listens:

```typescript
// Dispatch (PlayerController)
document.dispatchEvent(new CustomEvent('blockAction', {
    detail: { type: 'dig', blockX, blockY, blockZ }
}));

// Listen (UIManager)
document.addEventListener('blockAction', (e: CustomEvent) => {
    if (e.detail.type === 'dig') connection.invoke('DigBlock', ...)
    if (e.detail.type === 'place') connection.invoke('PlaceBlock', ...)
})
```

### interactBlock CustomEvent

`PlayerController` dispatches on right-click of interactive blocks, `UIManager` listens:

```typescript
// Dispatch (PlayerController)
document.dispatchEvent(new CustomEvent('interactBlock', {
    detail: { x, y, z, blockId, blockName }
}));

// Listen (UIManager)
document.addEventListener('interactBlock', (e: CustomEvent) => {
    if (e.detail.blockName === 'chest') {
        showChestUI();
        connection.invoke('GetChestInventory', x, y, z);
    } else if (e.detail.blockName === 'furnace') {
        showFurnaceUI();
        connection.invoke('GetSmeltingRecipes');
    } else if (e.detail.blockName === 'crafting_table') {
        showCraftingUI();
        connection.invoke('GetCraftingRecipes');
    }
})
```

### openCrafting CustomEvent

`PlayerController` dispatches on E key press, `UIManager` listens:

```typescript
// Dispatch (PlayerController)
document.dispatchEvent(new CustomEvent('openCrafting'));

// Listen (UIManager)
document.addEventListener('openCrafting', () => {
    showCraftingUI();
    connection.invoke('GetCraftingRecipes');
})
```

### respawnRequest CustomEvent

`UIManager` death screen button dispatches, `App` listens:

```typescript
// Dispatch (UIManager death screen)
document.dispatchEvent(new CustomEvent('respawnRequest'));

// Listen (App)
document.addEventListener('respawnRequest', () => gameClient.respawn());
```

This decoupling via DOM CustomEvents means `PlayerController` never directly references `UIManager` or the SignalR connection for block actions.
