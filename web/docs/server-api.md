# Server API Reference

## SignalR Hub Connection

**Endpoint:** `/game`

**Protocol:** WebSocket (SignalR)

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
- `OnTimeUpdate` to caller
- Initial chunk delivery

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

---

### SendChat
Broadcast chat message to all players.

```typescript
connection.invoke("SendChat", message: string): Promise<void>
```

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

---

### DigBlock
Remove a block from the world.

```typescript
connection.invoke("DigBlock", x: number, y: number, z: number): Promise<void>
```

---

### RequestChunk
Request chunk data from server.

```typescript
connection.invoke(
  "RequestChunk",
  chunkX: number, chunkY: number, chunkZ: number
): Promise<void>
```

---

### SelectSlot
Change selected hotbar slot.

```typescript
connection.invoke("SelectSlot", slot: number): Promise<void>
```

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

---

### OnTimeUpdate
Game time update.

```typescript
connection.on("OnTimeUpdate", (
  time: number,  // DateTime ticks
  speed: number  // Time speed multiplier
) => void)
```

## Connection Lifecycle

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Connect     │────▶│    Join()    │────▶│   Playing    │
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
