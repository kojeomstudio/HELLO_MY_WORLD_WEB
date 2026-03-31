# Client Architecture

## Overview

The client is a TypeScript/Three.js single-page application built with Vite. It runs entirely in the browser and communicates with the server via SignalR over WebSocket.

**Tech Stack:**
- TypeScript 5.9 (strict mode)
- Three.js 0.160 (3D rendering)
- @microsoft/signalr 8.0 (WebSocket)
- Vite 5.0 (build tool + dev server)

## File Structure

```
web/client/
  index.html          - Entry HTML with inline UI elements and CSS
  vite.config.ts      - Dev server config, proxy /game to server
  tsconfig.json       - TypeScript config (ES2020, strict)
  package.json        - Dependencies and scripts
  src/
    main.ts           - Bootstrap, DOM event bridges
    GameClient.ts     - Central orchestrator, 24 server event handlers
    rendering/
      Renderer.ts     - Three.js scene, camera, lighting, sky
    world/
      WorldManager.ts - Chunk storage, texture atlas, player/entity meshes
      BlockRegistry.ts- 64 block definitions with textureName field
      ChunkMesh.ts    - Chunk mesh builder with UV mapping support
    player/
      PlayerController.ts - FPS camera, physics, raycasting, interactive block detection
    input/
      InputManager.ts - Keyboard state, pointer lock
    ui/
      UIManager.ts    - HUD, chat, hotbar, crafting UI, furnace UI, chest UI
    audio/
      AudioManager.ts - Procedural Web Audio API sounds
  public/
    textures/blocks/  - 63 PNG textures from Minetest devtest
```

## Build Configuration

### Vite Dev Server
- Port: 5173
- Proxy: `/game` -> `http://localhost:5266` (WebSocket support)
- Build output: `dist/`

### TypeScript Config
- Target: ES2020, Module: ESNext
- Strict mode enabled: `noUnusedLocals`, `noUnusedParameters`
- No emit (Vite handles bundling)

## Component Details

### App (main.ts)

Bootstrap class. Instantiated immediately at module load.

**Responsibilities:**
- Creates `UIManager` and `GameClient`
- Bridges DOM events to `GameClient` API
- Login form submit -> `gameClient.connect(playerName)`
- Chat input Enter -> `gameClient.sendChat(message)`
- `T` key -> shows chat input
- `F3` key -> toggles debug overlay
- `respawnRequest` custom event -> `gameClient.respawn()`

### GameClient (GameClient.ts)

Central orchestrator and composition root. Owns all subsystem references and the game loop.

**Constructor dependencies:**
- `UIManager` (passed from App)

**Creates internally:**
- `Renderer` (mounts to `#game-container`)
- `WorldManager` (receives Renderer)
- `InputManager`
- `AudioManager`
- `PlayerController` (receives camera + InputManager)

**Game Loop** (`requestAnimationFrame`):

```
gameLoop(dt)
  |
  +-- playerController.update(dt)       // physics, camera, input
  +-- worldManager.requestChunksAroundPlayer(pos)  // every 2s
  +-- worldManager.update(dt)           // entity animation
  +-- renderer.render()                 // Three.js draw
  +-- uiManager.updateDebugInfo(...)    // FPS, position, chunks
  +-- sendPositionUpdate()              // every frame
```

**Server Event Handlers (24 total):**

| Event | Action |
|-------|--------|
| `OnChunkReceived` | `worldManager.loadChunk()` |
| `OnPlayerJoined/Left` | `worldManager` add/remove + chat message |
| `OnPlayerListUpdate` | `uiManager.updatePlayerList()` |
| `OnPlayerPositionUpdate` | `worldManager.updatePlayerPosition()` |
| `OnChatMessage` | `uiManager.addChatMessage()` |
| `OnBlockUpdate` | `worldManager.updateBlock()` |
| `OnHealthUpdate` | `uiManager.updateHealth()` + `playerController.setHealth()` |
| `OnInventoryUpdate` | `uiManager.updateInventory()` + `playerController.setInventory()` |
| `OnTimeUpdate` | `renderer.updateSkyBrightness()` |
| `OnEntitySpawned/Update/Despawned` | `worldManager` spawn/update/remove entity |
| `OnCraftResult` | Chat notification |
| `OnDeath` | `uiManager.showDeathScreen()` + `playerController.handleDeath()` |
| `OnBlockDefinitions` | `worldManager.getBlockRegistry().loadFromServer()` |
| `OnBreathUpdate` | `uiManager.updateBreath()` |
| `OnKnockback` | `playerController.applyKnockback()` + `audioManager.play('hurt')` |
| `OnPrivilegeList` | Chat notification |
| `OnGameModeChanged` | Chat notification + `playerController.setFlying()` |
| `OnTeleported` | (position update handled on server) |
| `OnCraftingRecipes` | `uiManager.populateCraftingRecipes()` |
| `OnSmeltingRecipes` | `uiManager.populateSmeltingRecipes()` |
| `OnChestInventory` | `uiManager.updateChestInventory()` + `uiManager.updateChestPlayerInventory()` |
| `OnFurnaceUpdate` | `uiManager.updateFurnaceState()` |

**FPS Counter:** Updates every second, tracks `frameCount` / `fpsTimer`.

### Renderer (rendering/Renderer.ts)

Three.js scene setup and rendering.

**Camera:** PerspectiveCamera(70 FOV, 0.1 near, 500 far)

**Scene Setup:**
- Background: `#87CEEB` (sky blue)
- Fog: `THREE.Fog(skyColor, 80, 160)`
- Directional light: white, intensity 1.0, position (100, 200, 100)
- Ambient light: `#404040`, intensity 0.6
- Sky dome: BackSide sphere (radius 400)
- Sun: yellow sphere mesh

**Day/Night:** `updateSkyBrightness(0-1)` adjusts:
- Scene background color (lerp sky to dark)
- Fog density and color
- Light intensities (directional + ambient)
- Sky dome material color
- Sun visibility

**Performance:** Antialias enabled, pixel ratio capped at 2.0, no shadow maps.

### WorldManager (world/WorldManager.ts)

Chunk storage, visual management, and texture atlas system.

**Data structures:**
- `chunks: Map<string, ChunkMesh>` — keyed by `"x,y,z"`
- `playerMeshes: Map<string, PlayerInfo>` — other players' visual representations
- `entityMeshes: Map<string, THREE.Mesh>` — item/mob entity visuals
- `pendingChunks: Set<string>` — requested but not yet received
- `textureAtlas: TextureAtlas | null` — loaded texture atlas for UV mapping

**Texture Atlas System:**

The texture atlas loads 32 PNG textures from `public/textures/blocks/` and composites them into a single canvas texture at startup:

1. Loads all textures in `TEXTURE_NAMES` array via `Image` elements
2. Creates a canvas with `ATLAS_COLS = 8` columns, rows calculated dynamically
3. Draws each texture as a 16x16 tile at computed grid position
4. Creates `THREE.CanvasTexture` with `NearestFilter` (pixelated rendering)
5. Provides `getUV(blockId)` lookup function that maps block IDs to atlas UV coordinates
6. When atlas is ready, rebuilds all existing chunk meshes to apply textures

**UV Coordinate System:**

Atlas uses normalized UV coordinates (0.0-1.0):
- `u_min = col / ATLAS_COLS`
- `v_min = 1 - (row + 1) / atlasRows`
- `u_max = (col + 1) / ATLAS_COLS`
- `v_max = 1 - row / atlasRows`

Each block face maps to a 4-corner quad: `(u_min, v_min)`, `(u_max, v_min)`, `(u_max, v_max)`, `(u_min, v_max)`.

**Chunk loading:**
1. `loadChunk()` receives raw byte data from server
2. Creates `ChunkMesh.fromServerData()`
3. Builds opaque + transparent meshes with face culling and UV mapping
4. Adds to scene, rebuilds neighbor chunks at borders

**Chunk request strategy:**
- `requestChunksAroundPlayer(position)` — diamond shape, distance 4, Y range -1 to +2
- Called every 2 seconds in game loop
- Skips already loaded and pending chunks

**Player mesh:** Box geometry (0.6 x 1.8 x 0.6) + floating name label (Sprite).

**Entity mesh:** Item = small orange box (0.3), Mob = tall red box (0.8). Animated with floating sine wave + rotation.

### BlockRegistry (world/BlockRegistry.ts)

64 default block type definitions. Dual-indexed lookup (by numeric ID and string name).

**Key Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `textureName` | `string?` | Name of texture in atlas (e.g. `"default_stone"`) |
| `interactive` | `boolean?` | Block responds to right-click (chest, furnace, crafting_table) |

**Texture-mapped blocks (server-side `TextureName` property):**
stone, dirt, grass, water, sand, wood, leaves, snow, ice, lava, cobblestone, gravel, water_flowing, lava_flowing, mossy_cobblestone.

**Query helpers:**
- `isSolid(id)` — defaults to false
- `isTransparent(id)` — defaults to true
- `isLiquid(id)` — defaults to false
- `isClimbable(id)` — defaults to false
- `isFalling(id)` — defaults to false
- `isInteractive(id)` — defaults to false
- `getGroups(id)` — defaults to `{}`
- `getAll()` — returns full `Map<number, BlockDefinition>`

**Server override:** `loadFromServer(json)` parses server JSON, clears defaults, rebuilds both maps. Handles `{blocks: {...}}` and flat `{...}` formats. Preserves `textureName` from server data.

### ChunkMesh (world/ChunkMesh.ts)

16x16x16 mesh builder with per-face culling and UV mapping support.

**TextureAtlas interface:**

```typescript
export interface TextureAtlas {
    texture: THREE.CanvasTexture;
    getUV(blockId: number): [number, number, number, number];
    hasTexture(blockId: number): boolean;
}
```

**Data layout:** `Uint8Array` of 4 bytes per block. Index: `(x*256 + y*16 + z) * 4`.

**Mesh building algorithm (`buildMesh`):**
1. Iterate all 16x16x16 blocks
2. For each non-air block, check 6 face directions
3. Use `getNeighborBlock` callback for cross-chunk lookups
4. Face culling:
   - Solid blocks: skip if neighbor is solid AND not transparent
   - Transparent blocks: skip if neighbor is same type (except liquids)
5. Brightness: top faces 1.1x, bottom faces 0.7x
6. Separate arrays for opaque and transparent geometry
7. **UV mapping:** If atlas is available and block has texture, use atlas UV coordinates; set vertex color to white (1,1,1) so texture shows through. If no atlas, fall back to vertex colors from `blockDef.color`.
8. Append UV coordinates (2 floats per vertex) when atlas is present

**Output:** Two `THREE.Mesh` per chunk:
- Opaque: `MeshLambertMaterial` with texture map + vertex colors
- Transparent: opacity 0.6, `DoubleSide`, no depth write

**Note:** No greedy meshing — each visible face generates 4 vertices + 2 triangles (6 indices).

### PlayerController (player/PlayerController.ts)

First-person player with physics, collision, raycasting, and interactive block detection.

**Constants:**

| Constant | Value | Description |
|----------|-------|-------------|
| `GRAVITY` | 20.0 | Gravity acceleration |
| `WALK_SPEED` | 5.0 | Normal walk speed |
| `SPRINT_SPEED` | 8.0 | Sprint speed (Shift) |
| `FLY_SPEED` | 12.0 | Fly mode speed |
| `MOUSE_SENSITIVITY` | 0.002 | Mouse look sensitivity |
| `PLAYER_HEIGHT` | 1.7 | Eye level |
| `PLAYER_WIDTH` | 0.6 | Collision width |
| `PLAYER_FULL_HEIGHT` | 1.8 | Collision height |

**Movement modes:**

| Mode | Controls | Gravity | Speed |
|------|----------|---------|-------|
| Walk | WASD + Space (jump) | Yes | 5.0 / 8.0 sprint |
| Fly | WASD + Space/Shift | No | 12.0 |
| Climb | WASD + Space/Shift | No | 2.5 |

**Collision system:**
- AABB with half-width 0.3, height 1.8
- Per-axis independent resolution (X, Y, Z)
- Ground detection on Y collision when falling
- Terminal velocity: -50
- Safety teleport: Y < -20 -> (0, 50, 0)

**Raycasting (`castRay`):**
- Direction from camera quaternion
- Range: 8 units
- Traverses scene meshes (excludes sky, sun, entity meshes)
- Returns: `{blockX, blockY, blockZ}` + `{placeX, placeY, placeZ}`

**Interactive block detection (`onPlace`):**
1. Cast ray to find targeted block
2. Look up block definition via `WorldManager.getBlockRegistry().get(blockId)`
3. Check `blockDef.interactive` flag
4. If interactive: dispatch `CustomEvent('interactBlock')` with position and block name
5. If not interactive: proceed with normal block placement

**Block actions:** Dispatches `CustomEvent('blockAction')` on `document` for dig/place. Dispatches `CustomEvent('interactBlock')` for interactive blocks. UIManager listens and forwards to server.

### InputManager (input/InputManager.ts)

Minimal keyboard state tracker.

- Uses `e.code` (physical key codes: `KeyW`, `KeyS`, `KeyA`, `KeyD`, etc.)
- `isKeyDown(code: string): boolean`
- `isPointerLocked(): boolean`
- Clears all state on window blur (prevents stuck keys)

### UIManager (ui/UIManager.ts)

All HUD and overlay management. The bridge between PlayerController and server.

**DOM Elements (from index.html):**
- `#chat-messages` — chat message list
- `#health-bar` — heart display
- `#hotbar` — 8 inventory slots
- `#debug-info` — F3 overlay

**Dynamically created elements:**
- Death screen overlay
- Crafting panel
- Furnace panel
- Chest panel
- Player list panel
- Breath bar (underwater)

**Crafting UI:**
- Full-screen modal with recipe listing
- Each row shows: result item name + count, ingredient list, "Craft" button
- Recipes populated from `OnCraftingRecipes` server event
- Clicking "Craft" invokes `CraftRecipe(recipeIndex)` on server
- Opened via E key or right-clicking a crafting table

**Furnace UI:**
- Full-screen modal with input/fuel/output slot display
- Real-time progress bar (gradient fill, CSS transition)
- Smelting recipe list below slots
- Each recipe row shows: `input -> result (cookTime s)` with "Smelt" button
- Progress updates from `OnFurnaceUpdate` server event (every 10 ticks)
- Opened via right-clicking a furnace block

**Chest UI:**
- Full-screen modal with two grids:
  - Chest inventory: 27 slots (3x9 grid)
  - Player hotbar: 8 slots
- Click chest slot -> `TakeItemFromChest` (moves item to player inventory)
- Click player slot -> `MoveItemToChest` (moves item to chest)
- Items display formatted name and count badge
- Opened via right-clicking a chest block

**Block action bridge:**
```typescript
document.addEventListener('blockAction', (e) => {
    if (e.detail.type === 'dig') connection.invoke('DigBlock', ...)
    if (e.detail.type === 'place') connection.invoke('PlaceBlock', ...)
})

document.addEventListener('interactBlock', (e) => {
    if (e.detail.blockName === 'chest') { showChestUI(); connection.invoke('GetChestInventory', ...) }
    else if (e.detail.blockName === 'furnace') { showFurnaceUI(); connection.invoke('GetSmeltingRecipes') }
    else if (e.detail.blockName === 'crafting_table') { showCraftingUI(); connection.invoke('GetCraftingRecipes') }
})
```

**Chat:** Auto-scroll, limited to 100 messages.

**Hotbar:** 8 slots with item name, count, and metadata indicator (durability bar).

### AudioManager (audio/AudioManager.ts)

Procedural sound effects using Web Audio API. No audio files.

**Sounds:**

| Sound | Method | Generation |
|-------|--------|------------|
| `block_break` | `playBlockBreak` | White noise burst (0.1s), decay |
| `block_place` | `playBlockPlace` | Sine sweep 150->60 Hz (0.08s) |
| `footstep` | `playFootstep` | Quiet white noise (0.05s) |
| `hurt` | `playHurt` | Sawtooth 200Hz + square 153Hz (0.2s) |
| `pickup` | `playPickup` | Sine 400->600 Hz step (0.15s) |
| `death` | `playDeath` | Sawtooth sweep 440->55 Hz (0.5s) |

Auto-resumes suspended `AudioContext` (browser autoplay policy).

## Event Communication

```
PlayerController          document (DOM)          UIManager              Server
     |                         |                      |                    |
     |-- castRay() -------->  |                      |                    |
     |-- emitBlockEvent() --> |                      |                    |
     |    CustomEvent         |                      |                    |
     |    'blockAction'       |                      |                    |
     |                         |-- addEventListener -->|                    |
     |                         |                      |-- invoke() ------>|
     |                         |                      |   DigBlock         |
     |                         |                      |   PlaceBlock       |
     |                         |                      |                    |
     |-- onPlace() --------->  |                      |                    |
     |    CustomEvent         |                      |                    |
     |    'interactBlock'     |                      |                    |
     |                         |-- addEventListener -->|                    |
     |                         |                      |-- showChestUI()   |
     |                         |                      |-- showFurnaceUI() |
     |                         |                      |-- showCraftingUI()|
     |                         |                      |-- invoke() ------>|
     |                         |                      |   GetChestInventory|
     |                         |                      |   GetSmeltingRecipes|
     |                         |                      |   GetCraftingRecipes|
     |                         |                      |   CraftRecipe      |
     |                         |                      |   StartSmelting    |
     |                         |                      |   MoveItemToChest  |
     |                         |                      |   TakeItemFromChest|
     |                         |                      |                    |
UIManager -- dispatch -->  |                      |                    |
 'respawnRequest'       |                      |                    |
     |                         |-- addEventListener -->|                    |
App (main.ts)             |                      |                    |
     |                         |-- gameClient.respawn() -->|
     |                         |                      |                    |
App (main.ts)             |                      |                    |
  'keydown' (T/F3)       |                      |                    |
     |-- chat UI toggle ->|                      |                    |
     |-- debug toggle --->|                      |                    |
     |-- openCrafting ---->|                      |-- showCraftingUI()|
```
