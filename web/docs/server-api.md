# Server API — SignalR Hub Methods & Client Events

Hub endpoint: `/game` (WebSocket via SignalR)

Strongly-typed interface: `IGameClient` (server-to-client), `GameHub` (client-to-server).

## Hub Methods (Client → Server)

### Join
```
Task Join(string playerName)
```
Authenticates and registers the player. Server sends initial state (chunks, inventory, block definitions, time).

### UpdatePosition
```
Task UpdatePosition(float x, float y, float z, float vx, float vy, float vz, float yaw, float pitch)
```
Sent every frame. Server validates position and broadcasts to nearby players (64 block range).

### DigBlock
```
Task DigBlock(int x, int y, int z)
```
Removes block, drops item entity, checks tool durability. Rate limited: 250ms.

### DigBlockStart
```
Task<float> DigBlockStart(int x, int y, int z)
```
Returns dig time in seconds based on block hardness and tool multiplier. Returns -1 if unbreakable.

### PlaceBlock
```
Task PlaceBlock(int x, int y, int z, ushort blockType)
```
Places block at position. Validates block definition exists and is not air. Rate limited: 250ms.

### UseBucket
```
Task<bool> UseBucket(int x, int y, int z, bool place)
```
Place mode: places water/lava from bucket. Non-place mode: picks up liquid with empty bucket, or drinks milk. Rate limited: 500ms.

### InteractWithBlock
```
Task InteractWithBlock(int x, int y, int z)
```
Context-sensitive interaction based on block type:
- **chest**: sends `OnChestInventory`
- **furnace**: sends `OnSmeltingRecipes` + current state
- **door_wood**: toggles open/close
- **crafting_table**: sends `OnCraftingRecipes`
- Also handles bucket pickup on water/lava blocks

### UseItem
```
Task UseItem(int slotIndex)
```
Uses item in inventory slot. Handles food consumption (heals 2 HP, feeds 4), bucket conversions.

### Respawn
```
Task Respawn()
```
Respawns dead player at world spawn. Resets health, re-sends chunks.

### SendChat
```
Task SendChat(string message)
```
Broadcasts chat message to all players. Commands starting with `/` are dispatched to `ChatCommandManager`. Rate limited: 500ms.

### PunchPlayer
```
Task PunchPlayer(string targetName)
```
Deals damage based on held tool (1-7). Applies knockback to target.

### SelectSlot
```
Task SelectSlot(int slot)
```
Updates player's selected hotbar slot on server.

### RequestChunk
```
Task RequestChunk(int chunkX, int chunkY, int chunkZ)
```
Sends serialized chunk data to requesting client.

### Craft / CraftRecipe
```
Task Craft(string recipeId)
Task CraftRecipe(int recipeIndex)
```
Crafts item from recipe. Removes ingredients from inventory, adds result.

### GetCraftingRecipes / GetSmeltingRecipes
```
Task GetCraftingRecipes()
Task GetSmeltingRecipes()
```
Returns all available recipes as arrays of `{result, resultCount, ingredients}` or `{input, result, cookTime, experience}`.

### StartSmelting
```
Task StartSmelting(string inputItemId, string resultItemId, int x, int y, int z)
```
Starts furnace operation. Consumes 1 input item + 1 fuel (coal/charcoal) from player inventory.

### GetChestInventory
```
Task GetChestInventory(int x, int y, int z)
```
Returns chest's 27-slot inventory as array of `{itemId, count, metadata}`.

### MoveItemToChest / TakeItemFromChest
```
Task MoveItemToChest(int slotIndex, int chestSlot, int x, int y, int z)
Task TakeItemFromChest(int chestSlot, int slotIndex, int x, int y, int z)
```
Moves items between player inventory and chest. Auto-finds slot if -1.

### DropItem
```
Task DropItem(int slotIndex, int count)
```
Drops item from inventory as world entity.

### EquipArmor / UnequipArmor
```
Task EquipArmor(int slotIndex, int armorSlot)
Task UnequipArmor(int armorSlot)
```
Swaps armor between inventory and armor slots (0=helmet, 1=chestplate, 2=leggings, 3=boots).

### GetPrivileges
```
Task GetPrivileges()
```
Returns player's privilege list.

### RequestInventory
```
Task RequestInventory()
```
Re-sends current inventory to client.

### InteractBlock
```
Task InteractBlock(int x, int y, int z)
```
Stub interaction method (no-op).

## Client Events (Server → Client)

### OnChunkReceived
```
Task OnChunkReceived(int chunkX, int chunkY, int chunkZ, byte[] data)
```
Serialized chunk data (16,384 bytes = 16^3 blocks * 4 bytes each).

### OnPlayerJoined / OnPlayerLeft
```
Task OnPlayerJoined(string playerName)
Task OnPlayerLeft(string playerName)
```
Broadcast to all players.

### OnPlayerListUpdate
```
Task OnPlayerListUpdate(string[] players)
```
Sent to joining player with list of online player names.

### OnPlayerPositionUpdate
```
Task OnPlayerPositionUpdate(string playerName, float x, float y, float z, float yaw, float pitch)
```
Broadcast to nearby players (64 block range) for remote player rendering.

### OnChatMessage
```
Task OnChatMessage(string sender, string message)
```
Broadcast chat or server messages.

### OnBlockUpdate
```
Task OnBlockUpdate(int x, int y, int z, ushort blockData)
```
Broadcast to all players when a block changes.

### OnHealthUpdate
```
Task OnHealthUpdate(float health, float maxHealth)
```
Sent to affected player when health changes.

### OnInventoryUpdate
```
Task OnInventoryUpdate(object[] items)
```
Each item: `{itemId: string, count: number, metadata: string}` or `null`.

### OnArmorUpdate
```
Task OnArmorUpdate(object[] armorSlots)
```
4-element array (helmet, chestplate, leggings, boots).

### OnBreathUpdate
```
Task OnBreathUpdate(float breath, float maxBreath)
```

### OnTimeUpdate
```
Task OnTimeUpdate(long time, float speed, float skyBrightness)
```
Broadcast periodically (every 100 ticks).

### OnEntitySpawned / OnEntityDespawned / OnEntityUpdate
```
Task OnEntitySpawned(Guid entityId, string entityType, float x, float y, float z)
Task OnEntityDespawned(Guid entityId)
Task OnEntityUpdate(Guid entityId, float x, float y, float z)
```

### OnCraftResult
```
Task OnCraftResult(string itemId, int count)
```

### OnDeath
```
Task OnDeath(string message)
```
Broadcast to all players.

### OnKnockback
```
Task OnKnockback(float vx, float vy, float vz)
```
Sent to damaged player for client-side knockback animation.

### OnBlockDefinitions
```
Task OnBlockDefinitions(string definitionsJson)
```
JSON array of `{id, name, solid, transparent, color, liquid, light, damage, breakable, interactive, drawType, hardness, drops, climbable, textureName}`.

### OnPrivilegeList
```
Task OnPrivilegeList(string[] privileges)
```

### OnGameModeChanged
```
Task OnGameModeChanged(string mode)
```

### OnTeleported
```
Task OnTeleported(float x, float y, float z)
```

### OnCraftingRecipes / OnSmeltingRecipes
```
Task OnCraftingRecipes(object[] recipes)
Task OnSmeltingRecipes(object[] recipes)
```
Crafting: `{result, resultCount, ingredients: [[itemId, count], ...]}`.
Smelting: `{input, result, cookTime, experience}`.

### OnChestInventory
```
Task OnChestInventory(object[] items)
```
27-element array of `{itemId, count, metadata}` or `null`.

### OnFurnaceUpdate
```
Task OnFurnaceUpdate(string input, string fuel, string output, float progress)
```

### OnFallingBlock
```
Task OnFallingBlock(int fromX, int fromY, int fromZ, int toX, int toY, int toZ, ushort blockType)
```

### OnExperienceUpdate
```
Task OnExperienceUpdate(int level, int totalExp)
```

## REST API

### GET /api/status
```json
{
  "online": 5,
  "maxPlayers": 100,
  "isRunning": true,
  "worldSeed": 12345
}
```

## Data Formats

### Block Data Packing
Each block: 4 bytes serialized in order `[Type, Param1, Param2, Light]`.
- `Type`: `BlockType` enum (0-100)
- `Param1`: Reserved metadata
- `Param2`: Liquid level (1-8) or door open state (0/1)
- `Light`: `(sunLight << 4) | artificialLight`

### Inventory Format
Array of 32 items (or 8 for hotbar). Each item:
```json
{ "itemId": "wooden_pickaxe", "count": 1, "metadata": "59" }
```
`null` for empty slots. `metadata` stores tool durability as string.

### Block Definition (OnBlockDefinitions)
```json
{
  "id": 1,
  "name": "default:stone",
  "solid": true,
  "transparent": false,
  "color": "#808080",
  "liquid": false,
  "light": 0,
  "damage": 0,
  "breakable": true,
  "interactive": false,
  "drawType": "normal",
  "hardness": 1.5,
  "drops": "default:cobblestone",
  "climbable": false,
  "textureName": "default_stone"
}
```
