# 06 - 데이터 모델 (거시적 설계)

## 포팅 방향성

Minetest의 **Lua 동적 데이터 + C++ 구조체 + conf 파일 설정**을 **JSON 정적 데이터 + C# record/struct**로 통합합니다.

## 데이터 계층 구조

```
Minetest                           웹 프로젝트
──────────                         ──────────
Lua register_node()                blocks.json
Lua register_tool/craftitem()      items.json
Lua register_craft()               items.json (recipes 섹션)
Lua register_biome()               biomes.json
Lua register_ore()                 ores.json
Lua register_privilege()           privileges.json
minetest.conf                      server_config.json + physics_constants.json
LevelDB (월드 데이터)              SQLite (players.db, blockmeta.db) + 파일 (chunk)
nodemetadata (Lua 테이블)          blockmeta.db (SQLite)
```

## 핵심 C# 타입

```
값 타입 (성능):
  readonly struct Vector3 { float X, Y, Z }
  readonly struct Vector3s { short X, Y, Z }
  readonly struct ChunkCoord { int X, Y, Z }
  record struct PhysicsState { ... }
  record struct PlayerInput { ... }

DTO (전송/저장):
  record ItemStack(string ItemId, int Count, string? Metadata)
  record FurnaceOperation(string Input, string Result, float CookTime, float Progress, string ConnId)
  record SmeltingRecipe(string Input, string Result, float CookTime, float Experience)
  record Privilege(string Name, string Description, bool Default)

엔티티:
  enum BlockType { Air, Stone, Dirt, ..., CoarseDirt }  // 226 values
  enum PlayerState { Connecting, Connected, Playing, Disconnected }
  enum GameMode { Survival, Creative, Adventure, Spectator }
  class Block { BlockType Type; byte Param1, Param2, Light; }
  class Chunk { ChunkCoord Coord; Block[4096]; }
  class Player { ... 20+ 속성 ... }
  class Inventory { ItemStack?[32]; }
```

## JSON 스키마 개요

### server_config.json
```
server: { name, version, maxPlayers, tickRate, port }
world: { defaultGenerator, chunkSize, renderDistance, worldSeed, worldBorderSize }
player: { defaultHealth, defaultBreath, inventorySize, hotbarSize }
dayNight: { cycleLength, dawnStart, dayStart, duskStart, nightStart }
network: { timeBroadcastInterval, protocolVersion }
liquid: { waterFlowInterval, lavaFlowInterval }
corsOrigins: string[]
```

### blocks.json (226 정의)
```
각 블록: { id, name, solid, transparent, color, textureName, liquid, light,
  damage, breakable, interactive, climbable, drowning, falling,
  drawType, hardness, drops, groups, soundGroup, ... }
```

### items.json (220+ 아이템, 166+ 레시피)
```
아이템: { name, type, durability, damage, miningSpeed, stackable, maxStack, nutrition, blockId }
레시피: { result, resultCount, ingredients: [[itemId, count], ...] }
그리드 레시피: { result, resultCount, pattern: (string|null)[][], key: {...} }
연료: { itemId, burnTime }
```

### smelting.json, biomes.json, mobs.json, tools.json, privileges.json
(각각 해당 시스템의 데이터 정의)

## 지속성

| Minetest | 웹 프로젝트 | 내용 |
|----------|-----------|------|
| players.sqlite | `players.db` | 플레이어 데이터 (위치, 인벤토리, 체력, 방어구) |
| (nodemetadata) | `blockmeta.db` | 상자 인벤토리, 화로 상태, 노드 타이머 |
| LevelDB map.db | `*.chunk` 파일 | 청크 바이너리 (16KB/파일) |

## 텍스처 에셋

Minetest DevTest 텍스처를 **16x16 PNG**로 변환하여 `public/textures/blocks/`에 배치.
125개 텍스처를 **텍스처 아틀라스** (8열 캔버스)로 합성하여 Three.js UV 매핑에 사용.

## 상세 구현 참조

| 주제 | 참조 문서 |
|------|---------|
| Minetest 데이터 직렬화 포맷 | `web/docs/reference/world-map-system.md` |
| DevTest 블록/도구/아이템 정의 | `web/docs/reference/game-content.md` |
| Minetest 설정값 매핑 | `web/docs/reference/game-content.md` (settings) |
| Lua API 데이터 타입 | `web/docs/reference/scripting-modding.md` |
