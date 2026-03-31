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
    GameClient.ts     - Central orchestrator, 26 server event handlers
    rendering/
      Renderer.ts     - Three.js scene, camera, lighting, sky
      CloudSystem.ts  - Procedural cloud layer
      SelectionBox.ts - Block selection wireframe + dig progress
      WieldItem.ts    - Hand-held item display (tools/blocks)
    world/
      WorldManager.ts - Chunk storage, texture atlas, player/entity meshes
      BlockRegistry.ts- 68 block definitions with textureName field
      ChunkMesh.ts    - Chunk mesh builder with UV mapping support
      WeatherSystem.ts- Rain particle system
      ParticleSystem.ts- Dig/place/damage/smoke particles
    player/
      PlayerController.ts - FPS camera, physics, raycasting, interactive block detection
    input/
      InputManager.ts - Keyboard state, pointer lock
    ui/
      UIManager.ts    - HUD, chat, hotbar, crafting/furnace/chest/armor UI
      SettingsPanel.ts- Settings with localStorage persistence
      Minimap.ts      - In-game minimap (3 modes)
    audio/
      AudioManager.ts - Procedural Web Audio API sounds
  public/
    textures/blocks/  - 125 PNG textures (16x16)
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
- `Minimap` (receives container + WorldManager)
- `ParticleSystem` (receives Three.js scene)
- `WieldItem` (receives scene + camera)
- `SelectionBox` (receives scene)
- `WeatherSystem` (receives scene)

**Game Loop** (`requestAnimationFrame`):

```
gameLoop(dt)
  |
  +-- playerController.update(dt)       // physics, camera, input
  +-- minimap.update(dt)                // minimap rendering
  +-- particleSystem.update(dt)         // particle animations
  +-- wieldItem.update(dt, onGround)    // hand item bob/swing
  +-- worldManager.requestChunksAroundPlayer(pos)  // every 2s
  +-- worldManager.update(dt)           // entity animation, waving
  +-- renderer.updateClouds(dt)         // cloud drift
  +-- renderer.updateEffects(dt)        // post-processing
  +-- weatherSystem.update(dt, pos)     // rain particles
  +-- renderer.render()                 // Three.js draw
  +-- uiManager.updateDebugInfo(...)    // FPS, position, chunks
  +-- sendPositionUpdate()              // every frame
```

**Settings wiring:**
- Settings loaded from `SettingsPanel` on construction via `applySettings()`
- `SettingsPanel.setOnSettingsChanged()` callback applies FOV changes on settings panel close
- Settings persisted to localStorage automatically by `SettingsPanel`

**Server Event Handlers (26 total):**

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
| `OnKnockback` | `playerController.applyKnockback()` + `audioManager.play('hurt')` + `renderer.flashDamage()` |
| `OnPrivilegeList` | Chat notification |
| `OnGameModeChanged` | Chat notification + `playerController.setFlying()` |
| `OnTeleported` | (position update handled on server) |
| `OnCraftingRecipes` | `uiManager.populateCraftingRecipes()` |
| `OnSmeltingRecipes` | `uiManager.populateSmeltingRecipes()` |
| `OnChestInventory` | `uiManager.updateChestInventory()` + `uiManager.updateChestPlayerInventory()` |
| `OnFurnaceUpdate` | `uiManager.updateFurnaceState()` |
| `OnFallingBlock` | `worldManager.onFallingBlock()` |
| `OnArmorUpdate` | `uiManager.updateArmorSlots()` |
| `OnExperienceUpdate` | `uiManager.updateExperienceBar()` |

**FPS Counter:** Updates every second, tracks `frameCount` / `fpsTimer`.

### Renderer (rendering/Renderer.ts)

Three.js scene setup and rendering.

**Camera:** PerspectiveCamera(70 FOV, 0.1 near, 500 far) — FOV configurable via settings.

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

**Post-processing effects:**
- `flashDamage(intensity)` — red fullscreen overlay, fades over 0.3s
- `updateCaveDarkness(y, noSky)` — vignette + ambient dimming for Y < 30
- `updateLavaEffect(nearLava)` — orange tint overlay
- `updateClouds(dt)` — cloud drift animation
- `updateEffects(dt)` — effect animation/update pass

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

The texture atlas loads 125 PNG textures from `public/textures/blocks/` and composites them into a single canvas texture at startup:

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

**Player mesh:** Box geometry (0.6 x 1.8 x 0.6) + floating name label (Sprite). Walk animation via limb swinging.

**Entity mesh:** Item = small orange box (0.3), Mob = tall red box (0.8). Animated with floating sine wave + rotation.

**Falling block animation:** `onFallingBlock()` creates temporary mesh at source, animates gravity-based fall to target over 0.5s.

### BlockRegistry (world/BlockRegistry.ts)

68 default block type definitions. Dual-indexed lookup (by numeric ID and string name).

**Key Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `textureName` | `string?` | Name of texture in atlas (e.g. `"default_stone"`) |
| `interactive` | `boolean?` | Block responds to right-click (chest, furnace, crafting_table, door_wood) |

**Texture-mapped blocks (server-side `TextureName` property):**
stone, dirt, grass, water, sand, wood, leaves, snow, ice, lava, cobblestone, gravel, water_flowing, lava_flowing, mossy_cobblestone, planks, brick, glass, bookshelf, chest, furnace, crafting_table, fence, ladder, cactus, sandstone, obsidian, coal_ore, iron_ore, gold_ore, diamond_ore, iron_block, gold_block, diamond_block, farmland, melon, pumpkin, hay, apple, and more.

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
| `STEP_HEIGHT` | 0.6 | Max step-up height |

**Movement modes:**

| Mode | Controls | Gravity | Speed |
|------|----------|---------|-------|
| Walk | WASD + Space (jump) | Yes | 5.0 / 8.0 sprint |
| Fly | WASD + Space/Shift | No | 12.0 |
| Climb | WASD + Space/Shift | No | 2.5 |

**Collision system:**
- AABB with half-width 0.3, height 1.8
- Per-axis independent resolution (X, Y, Z)
- Step-up support (0.6 blocks) for smooth terrain traversal
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

**Footstep sounds:** Movement velocity squared checked against threshold (>0.5) in game loop, passed to `WorldManager.animatePlayer()` for walk animation triggering.

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
- Creative inventory panel
- Player list panel
- Breath bar (underwater)
- Armor panel (P key)

**Durability Display:**
- Tools with metadata show a colored durability bar on hotbar slots
- `borderBottom` style set on hotbar slots when item has metadata

**Armor Equipment UI:**
- Opened via P key
- 4 armor slots: helmet, chestplate, leggings, boots
- Click to equip from inventory / unequip to inventory
- Sends `EquipArmor` / `UnequipArmor` via SignalR

**Experience Bar:**
- XP bar displayed below hotbar
- Level display
- Updated via `OnExperienceUpdate` server event

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

### SettingsPanel (ui/SettingsPanel.ts)

Dedicated settings management with localStorage persistence.

| Setting | Type | Range | Default |
|---------|------|-------|---------|
| Mouse Sensitivity | slider | 0.001 - 0.01 | 0.002 |
| Render Distance | slider | 2 - 8 | 4 |
| FOV | slider | 50 - 110 | 70 |
| Music Volume | slider | 0 - 1 | 0.5 |
| Sound Volume | slider | 0 - 1 | 0.5 |
| Clouds | toggle | — | enabled |
| Ambient Occlusion | toggle | — | enabled |

**Behavior:**
- Settings loaded from `localStorage` on construction (key: `helloworld_settings`)
- Slider controls with real-time value display
- Toggle controls with checkboxes
- Settings applied on panel close via `onSettingsChanged` callback
- Auto-saves to `localStorage` whenever panel is hidden

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

**Volume parameter:** `play(soundName, volume)` accepts a volume argument (default 0.5).

Auto-resumes suspended `AudioContext` (browser autoplay policy).

### Minimap (ui/Minimap.ts)

In-game minimap with 3 rendering modes.

**Modes:** surface, radar, normal.

Updated every frame with player position and yaw.

### ParticleSystem (world/ParticleSystem.ts)

Particle effects for game events.

| Type | Description |
|------|-------------|
| `dig` | 8 block-colored particles |
| `place` | 6 block-colored particles |
| `damage` | Red particles at player position |
| `smoke` | 4 gray particles |

Triggered via `particleEmitter` callback from `PlayerController`.

### WeatherSystem (world/WeatherSystem.ts)

Rain particle system.

- 800 particles with wind effect
- Player-following cylinder (radius 60, height 40)
- Toggled by `GameClient` based on time of day

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
     |                         |                      |   EquipArmor       |
     |                         |                      |   UnequipArmor     |
     |                         |                      |                    |
UIManager -- dispatch -->  |                      |                    |
 'respawnRequest'       |                      |                    |
     |                         |-- addEventListener -->|                    |
App (main.ts)             |                      |                    |
     |                         |-- gameClient.respawn() -->|
     |                         |                      |                    |
App (main.ts)             |                      |                    |
  'keydown' (T/F3/E/I/O/P)                      |                    |
     |-- chat UI toggle ->|                      |-- showCraftingUI()|
     |-- debug toggle --->|                      |-- creative inv    |
     |-- settings panel -->|                     |-- armor panel      |
```

## Texture Assets

125 procedurally generated 16x16 PNG textures in `public/textures/blocks/`, covering:

- Natural blocks: stone, dirt, grass (side/top), sand, wood (side/top), leaves, snow, ice, gravel, clay, cobblestone, obsidian, mossy_cobblestone, sandstone
- Ores: coal, iron, gold, diamond
- Building blocks: brick, glass, planks, stone_brick, bookshelf, fence, ladder, chest (front/side/top), furnace (front/side), crafting_table (front/side/top), bedrock, hay
- Liquids: water, water_flowing, lava, lava_flowing, river_water, river_water_flowing
- Wool: 16 color variants
- Trees: oak (side/top), pine (side/top, needles), jungle (side/top, leaves)
- Plants: cactus, apple, melon (side/top), pumpkin (side/top)
- Decorative: door_wood, default_apple, desert_sand, desert_stone, junglegrass, snow_sheet, dirt_with_snow, dirt_with_grass
- Tool textures: basetools_wood* (sword, pick, shovel, axe, shears, dagger), basetools_stone*, basetools_steel*, basetools_mese*, basetools_special* (fire, ice, blood, heal, mesepick, etc.)
