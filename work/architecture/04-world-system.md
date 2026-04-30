# 04 - 월드 시스템 (거시적 설계)

## 포팅 방향성

Minetest의 C++ 월드 엔진(Map/MapBlock/MapSector)을 **C# World/Chunk 클래스**로 포팅합니다.
첨부 파일(LevelDB) 기반 저장을 **바이너리 파일 + SQLite**로 대체합니다.

## 월드 구조

```
Minetest                          웹 프로젝트
┌──────────────┐                 ┌──────────────┐
│ ServerMap    │                 │ World        │
│  └─ MapSector│                 │  └─ Chunk    │
│     └─ MapBlock│               │     └─ Block │
└──────────────┘                 └──────────────┘

Minetest: Map(gen) -> Sector(16x16 columns) -> MapBlock(16x16x16)
웹 프로젝트: World -> Chunk(16x16x16) (Sector 계층 생략)
```

## 청크 포맷

Minetest와 동일한 4바이트/블록 포맷 유지:

```
블록 구조 (4 bytes):
  Byte 0: BlockType (u8, 0-226)
  Byte 1: Param1 (메타데이터)
  Byte 2: Param2 (액체 레벨, 문 상태)
  Byte 3: Light (4-bit sun << 4 | 4-bit artificial)

청크: 16x16x16 = 4096 블록 = 16,384 bytes
인덱스: (x * 256 + y * 16 + z) * 4
```

## 월드 생성 전략

| Minetest 맵젠 | 웹 프로젝트 | 포팅 범위 |
|--------------|-----------|----------|
| `MapgenV6` | `NoiseWorldGenerator` | Perlin 노이즈 지형 + 동굴 + 광물 + 나무 + 던전 |
| `MapgenFlat` | `FlatWorldGenerator` | 평지 월드 |
| MapgenV7 | (미포팅) | 향후 확장 가능 |
| MapgenCarpathian | (미포팅) | 향후 확장 가능 |

### NoiseWorldGenerator 핵심 알고리즘

```
지형: Perlin noise 기반
  baseHeight = 32, variation = +/- 20
  waterLevel = 28

바이옘: heat + humidity 2D 노이즈 -> 바이옴 선택
  10 바이옘 (Grassland, Forest, Desert, Snow, ...)

동굴: 2개 3D 노이즈 교차 (worm carving)
  cave1^2 + cave2^2 < threshold -> 공기

광물: 깊이별 광물 생성 (9종)
  Diamond < Y16, Gold < Y32, Iron < Y48, Coal < Y64 ...

나무: 노이즈 임계값 > 0.35 -> 트리 생성
  Oak, Pine, Birch, Jungle 스키�매틱

던전: Y < 30, 이끼 낀 조약돌 방
```

## 조명 시스템

```
Minetest와 동일한 4+4 비트 패킹:
  Light byte = (sunLight << 4) | artificialLight

태양광: 하늘에서 아래로 홍수 채우기
인공광: 발광 블록에서 BFS 확산
  횃락=14, 용암=14, 발광 흑요석=14

최종 조명: max(sun, artificial)
블록 설치/제거 시 조명 재계산
```

## 액체 시스템

| 항목 | 물 | 용암 |
|------|---|------|
| 원본 레벨 | 8 | 8 |
| 흐름 주기 | 3 틱 | 5 틱 |
| 확산 방향 | 하향 + 4방향 | 하향 + 4방향 |
| 상호작용 | 물+용암원천 -> 흑요석 | 물+흐르는용암 -> 조약돌 |

## 바이옴 시스템

히트/습도 2D 노이즈 기반 선택 (Minetest mg_biome.cpp와 동일한 방식):

| 바이옴 | 표면 블록 | 나무 |
|------|----------|------|
| Grassland | Grass | Oak, Birch |
| Forest | Grass | Oak, Birch, Pine |
| Desert | DesertSand | Cactus |
| Snow | DirtWithSnow | Pine |
| Taiga | DirtWithSnow | Pine |
| Jungle | JungleGrass | Jungle |
| Savanna | Grass | - |
| Mountains | Stone | - |
| Swamp | Grass | Oak |
| Ocean | Sand (수중) | - |

## ABM (Active Block Modifier)

| ABM | 주기 | 설명 |
|-----|------|------|
| sand_falling | 2틱 | 모래/자갈 낙하 |
| gravel_falling | 2틱 | 모래/자갈 낙하 |

## Node Timer

| 타이머 | 지연 | 설명 |
|--------|------|------|
| Farmland dehydration | 30초 | 물 없으면 흙으로 변환 |
| Grass spread | 10-30초 | 인접 흙에 잔디 확산 |
| Ice melting | 5-10초 | 빛 근처 얼음 녹음 |

## 블록 타입 체계

226 블록 타입, ID 기반 열거형:

| 카테고리 | ID 범위 | 예시 |
|---------|--------|------|
| 기본 블록 | 0-30 | Air, Stone, Dirt, Grass, Water, Wood... |
| 광물 | 10-11, 23-24 | OreIron, OreGold, OreDiamond, Coal |
| 재료 | 25-27 | Planks, Cobblestone, StoneBrick |
| 장식 | 28-68 | Wool(16색), Bookshelf, Glass, Gravel... |
| 작물/식물 | 38, 64-66 | SugarCane, Apple, Wheat, Carrot, Potato |
| 인터랙티브 | 19-22 | DoorWood, Chest, CraftingTable, Furnace |
| 액체 | 4, 43-44, 75 | Water, WaterFlowing, Lava, LavaFlowing, RiverWater |
| 광물 변종 | 101-160 | GoldOre, LapisOre, EmeraldOre, CopperOre... |
| 계단/반블록 | 101-160 | WoodStairs, StoneSlab... |
| 장식 확장 | 101-160 | Lantern, Campfire, Glowstone, Fire... |

## 상세 구현 참조

| 주제 | 참조 문서 |
|------|---------|
| MapBlock/MapSector 저장소 구조 | `web/docs/reference/world-map-system.md` |
| 맵 생성 알고리즘 상세 (V6, V7, Flat) | `web/docs/reference/mapgen-system.md` |
| 바이옴/광물/장식 생성 | `web/docs/reference/mapgen-system.md` |
| 조명 전파 알고리즘 | `web/docs/reference/world-map-system.md` |
| DevTest 블록 정의 | `web/docs/reference/game-content.md` |
