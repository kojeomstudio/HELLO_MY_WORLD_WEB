# Map Generation System Reference

> Luanti (Minetest) 맵 생성 시스템 상세 분석 문서

## 1. 개요

맵 생성 시스템은 8가지 지형 생성기를 제공하며, 각각 노이즈 기반으로 지형, 생물군계, 광석, 장식, 동굴, 던전을 생성합니다.

## 2. 클래스 계층

```
Mapgen (abstract base)
  └── MapgenBasic (공통 기능)
       ├── MapgenV7        (기본 생성기)
       ├── MapgenV5
       ├── MapgenFlat
       ├── MapgenValleys
       ├── MapgenCarpathian
       └── MapgenFractal
  ├── MapgenV6             (레거시, 직접 상속)
  └── MapgenSinglenode     (최소 생성기)
```

## 3. 공통 매개변수 (MapgenParams)

| 파라미터 | 기본값 | 설명 |
|----------|--------|------|
| `mgtype` | v7 | 생성기 타입 |
| `chunksize` | (5,5,5) | 청크 크기 (80×80×80 노드) |
| `seed` | 랜덤 | 맵 시드 |
| `water_level` | 1 | 수면 레벨 |
| `mapgen_limit` | 31007 | 최대 생성 좌표 |
| `flags` | caves+dungeons+light+decorations+biomes+ores | 글로벌 플래그 |

## 4. MapgenBasic 공통 기능

모든 V5/V7/Flat/Valleys/Carpathian/Fractal 생성기가 공유합니다:

| 메서드 | 설명 |
|--------|------|
| `generateBiomes()` | 생물군계별 표면 노드 배치 |
| `dustTopNodes()` | 생물군계 먼지 재료 살포 |
| `generateCavesNoiseIntersection()` | 부드러운 웹형 터널 |
| `generateCavesRandomWalk()` | 랜덤 워크 터널 |
| `generateCavernsNoise()` | 대형 동굴 |
| `generateDungeons()` | 던전 생성 |
| `calcLighting()` | 전체 조명 계산 |

### 조명 파이프라인

```
1. setLighting()        - 조명 초기화
2. propagateSunlight()  - 태양광 아래로 전파
3. spreadLight()        - 인공광 BFS 전파
4. calcLighting()       - 위 모든 것을 오케스트레이션
```

## 5. MapgenV7 (기본 생성기)

### 5.1 플래그

| 플래그 | 기본 | 설명 |
|--------|------|------|
| MGV7_MOUNTAINS | ON | 산 생성 |
| MGV7_RIDGES | ON | 강/계곡 생성 |
| MGV7_FLOATLANDS | OFF | 부유섬 생성 |
| MGV7_CAVERNS | ON | 대형 동굴 |

### 5.2 주요 파라미터

| 파라미터 | 기본값 | 설명 |
|----------|--------|------|
| `mount_zero_level` | 0 | 산 밀도 그래디언트 시작 Y |
| `floatland_ymin/ymax` | 1024/4096 | 부유섬 Y 범위 |
| `floatland_taper` | 256 | 가장자리 테이퍼 거리 |
| `floatland_density` | -0.6 | 부유섬 밀도 임계값 |
| `cave_width` | 0.09 | 동굴 터널 폭 |
| `large_cave_depth` | -33 | 대형 동굴 최대 Y |
| `cavern_limit` | -256 | 대형 동굴 Y 한계 |
| `cavern_threshold` | 0.7 | 동굴 임계값 |

### 5.3 노이즈 파라미터 (13개)

| 노이즈 | 용도 | 차원 |
|--------|------|------|
| `np_terrain_base` | 기본 지형 높이 | 2D |
| `np_terrain_alt` | 대체 지형 높이 | 2D |
| `np_terrain_persist` | 지형 지속성 변화 | 2D |
| `np_height_select` | 기본/대체 지형 선택 | 2D |
| `np_filler_depth` | 표토 깊이 | 2D |
| `np_mount_height` | 산 높이 | 2D |
| `np_ridge_uwater` | 강 수위 | 2D |
| `np_mountain` | 산 밀도 | 3D |
| `np_ridge` | 계곡/강 형태 | 3D |
| `np_floatland` | 부유섬 밀도 | 3D |
| `np_cavern` | 대형 동굴 | 3D |
| `np_cave1` | 동굴 형태 1 | 3D |
| `np_cave2` | 동굴 형태 2 | 3D |

### 5.4 지형 생성 알고리즘

```
For each (X,Z) column:
  1. 기본 지형 레벨 계산:
     persistence = noise_terrain_persist(x,z)
     height_base = noise_terrain_base(x,z) × persistence
     height_alt = noise_terrain_alt(x,z) × persistence
     hselect = clamp(noise_height_select(x,z))
     
     if height_alt > height_base:
         surface_y = height_alt
     else:
         surface_y = lerp(height_base, height_alt, hselect)

  For each Y in column:
    2. Y <= surface_y → STONE (기본 지형)
    3. 산 활성 + mountain_test 통과 → STONE
       density_gradient = -(y - mount_zero_level) / mount_height
    4. 부유섬 활성 + floatland_test 통과 → STONE
    5. Y <= water_level → WATER
    6. 나머지 → AIR
```

### 5.5 강/계곡 알고리즘

```
width = 0.2
absuwatern = |ridge_uwater| × 2.0
if absuwatern > width: not a river
altitude = y - water_level
nridge × max(altitude, 0) / 7 + (width - absuwatern) × ((altitude+17)/2.5) >= 0.6
  → 강 도로 (AIR)
```

### 5.6 makeChunk 파이프라인

```
1. generateTerrain()          - 기본 + 산 + 부유섬 + 강
2. updateHeightmap()          - 표면 Y 기록
3. calcBiomeNoise()           - 생물군계 노이즈
4. generateBiomes()           - 생물군계 배치
5. generateCavesNoiseIntersection() - 부드러운 터널
6. generateCavernsNoise()     - 대형 동굴
7. generateCavesRandomWalk()  - 랜덤 워크 동굴
8. placeAllOres()             - 광석 배치
9. generateDungeons()         - 던전 생성
10. placeAllDecos()           - 장식 배치
11. dustTopNodes()            - 생물군계 먼지
12. updateLiquid()            - 액체 흐름 큐
13. calcLighting()            - 전체 조명
```

## 6. 기타 생성기 요약

### MapgenV5

3D 노이즈 기반. `np_factor` + `np_height`(2D) + `np_ground`(3D). V7보다 단순.

### MapgenV6 (레거시)

MapgenBasic 사용 안 함. 자체 생물군계 시스템 (NORMAL/DESERT/JUNGLE/TUNDRA/TAIGA). 진흙 흐름 시뮬레이션 포함.

### MapgenFlat

평평한 지형. 선택적 호수/언덕 (2D 노이즈). 노이즈 6개.

### MapgenValleys

강 계곡. 고도-냉기, 습윤-강, 가변 강 깊이. 노이즈 12개.

### MapgenCarpathian

계단식 산. 선택적 강, 4가지 높이 노이즈. 노이즈 16개.

### MapgenFractal

프랙탈 형태 (Mandelbrot/Julia 3D/4D, 9가지 공식). 노이즈 5개.

### MapgenSinglenode

단일 노드 타입만. 생성 없음. 노이즈 0개.

## 7. 생물군계 시스템 (`src/mapgen/mg_biome.h`)

### 7.1 Biome 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `c_top` | content_t | 최상층 노드 (잔디 등) |
| `c_filler` | content_t | 충전 노드 (흙 등) |
| `c_stone` | content_t | 석재 노드 |
| `c_water_top` | content_t | 표면수 노드 |
| `c_water` | content_t | 심층수 노드 |
| `c_river_water` | content_t | 강물 노드 |
| `c_riverbed` | content_t | 강바닥 노드 |
| `c_dust` | content_t | 먼지 노드 (눈 등) |
| `c_dungeon` | content_t | 던전 벽 노드 |
| `c_dungeon_alt` | content_t | 던전 대체 벽 |
| `c_dungeon_stair` | content_t | 던전 계단 |
| `c_cave_liquid` | content_t[] | 동굴 액체 (물/용암) |
| `depth_top` | s16 | 최상층 깊이 |
| `depth_filler` | s16 | 충전 깊이 |
| `depth_water_top` | s16 | 표면수 깊이 |
| `heat_point` | float | 열 포인트 |
| `humidity_point` | float | 습도 포인트 |
| `vertical_blend` | float | 수직 블렌드 거리 |
| `weight` | float | 가중치 |
| `min_pos/max_pos` | v3s16 | 바운딩 박스 |

### 7.2 생물군계 선택 알고리즘

```
1. 열 + 습도 2D 노이즈 생성 (+ 블렌드 노이즈)
2. 각 열(column)에 대해:
   열-습도 공간에서 유클리드 거리로 생물군계 찾기
   dist = (dHeat² + dHumidity²) / weight
   최소 거리의 생물군계 선택
3. 수직 블렌드: max_pos.Y 이상에서 PcgRandom으로 확장
```

### 7.3 BiomeParams

4개 노이즈: heat, humidity, heat_blend, humidity_blend

## 8. 광석 시스템 (`src/mapgen/mg_ore.h`)

### 6가지 광석 타입

| 타입 | 노이즈 | 알고리즘 |
|------|--------|----------|
| **OreScatter** | 없음 | 무작위 클러스터: nclusters = volume/clust_scarcity, 클러스터당 clust_num_ores 개 |
| **OreSheet** | 2D | 수직 컬럼, Y 위치를 노이즈로 제어 |
| **OrePuff** | 3D | 상/하부 두께 노이즈 분리, 절벽/가산 모드 |
| **OreBlob** | 3D | 구형 거리 감쇠: noiseval -= sqrt(xd²+yd²+zd²)/csize |
| **OreVein** | 2×3D | contour(n1) × contour(n2) + random × factor >= threshold |
| **OreStratum** | 선택 | 수평 층, 노이즈로 Y 위치/두께 제어 |

### 공통 필드

| 필드 | 설명 |
|------|------|
| `c_ore` | 광석 노드 |
| `c_wherein` | 대상 노드 |
| `clust_scarcity` | 희소성 (낮을수록 많음) |
| `clust_num_ores` | 클러스터당 광석 수 |
| `clust_size` | 클러스터 크기 |
| `y_min/y_max` | Y 범위 |
| `biomes` | 생물군계 필터 |

## 9. 장식 시스템 (`src/mapgen/mg_decoration.h`)

### 3가지 장식 타입

| 타입 | 설명 |
|------|------|
| **DecoSimple** | 수직 노드 컬럼 (랜덤 높이, param2) |
| **DecoSchematic** | .mts 파일 구조물 배치 (회전, 강제 배치) |
| **DecoLSystem** | L-시스템 나무 생성 |

### 배치 모드

| 모드 | 설명 |
|------|------|
| 기본 | 지형 표면 Y에 배치 |
| DECO_ALL_FLOORS | 모든 바닥 표면에 배치 |
| DECO_ALL_CEILINGS | 모든 천장 표면에 배치 |
| DECO_LIQUID_SURFACE | 액체 표면에 배치 |

## 10. 동굴 생성 (`src/mapgen/cavegen.h`)

### 3가지 동굴 알고리즘

| 알고리즘 | 방식 | 설명 |
|----------|------|------|
| **CavesNoiseIntersection** | 2×3D 노이즈 교차 | contour(n1) × contour(n2) > cave_width → 웹형 터널 |
| **CavernsNoise** | 단일 3D 노이즈 | |noise| × amplitude > threshold → 대형 공간 |
| **CavesRandomWalk** | 랜덤 워크 | 소형(지름 2-6) + 대형(지름 5-24) 터널, 침수 가능 |

### CavesRandomWalk 파라미터

```
소형 동굴: 지름 2-6, 경로포인트 10-30
대형 동굴: 지름 5-24, 평면 옵션, 생물군계 액체로 침수
청크 엣지 밖으로 16노드 확장 (연결성)
액체: 생물군계 c_cave_liquid (무작위 선택) 또는 깊이에 따라 용암/물
```

## 11. 던전 생성 (`src/mapgen/dungeongen.h`)

### DungeonParams

```cpp
struct DungeonParams {
    content_t c_wall, c_alt_wall, c_stair;
    NoiseParams np_alt_wall;     // 3D 노이즈 이끼 벽 변환
    u16 num_dungeons, num_rooms;
    v3s16 room_size_min/max, room_size_large_min/max;
    u16 large_room_chance;
    v3s16 holesize;              // 복도 단면 (기본 1×2×1)
    u16 corridor_len_min/max;
    bool diagonal_dirs, only_in_ground;
};
```

### 던전 생성 알고리즘

```
1. 공기/액체/무시/비지면 노드를 VMANIP_FLAG_DUNGEON_PRESERVE로 마크
2. 첫 번째 방 배치 (최대 100회 무작위 시도)
3. num_rooms 횟수 반복:
   a. 현재 방 중심에서 걷기
   b. findPlaceForDoor(): 공기 통과 → 벽 도달
   c. 복도 생성 (무작위 길이, 선택적 계단)
   d. findPlaceForRoomDoor(): 새 방 맞춤
4. 후처리: 3D 노이즈로 일부 벽을 alt_wall로 변환
```

## 12. 나무 생성 (`src/mapgen/treegen.h`)

### 3가지 하드코딩된 나무

| 나무 | 트렁크 | 잎 | 특징 |
|------|--------|-----|------|
| 기본 나무 | 4-5블록 | 5×4×5 | 사과 10% 확률 |
| 정글 나무 | 8-12블록 | 7×5×7 | 넓은 기둥 기부 |
| 소나무 | 9-13블록 | 계단식 원뿔 | 꼭대기 눈 |

### L-시스템 나무

```
공리(axiom) 확장: A-D 문자를 규칙으로 교체
거북이 그래픽스:
  F = 트렁크+잎, T = 트렁크만, f = 잎만
  R = 과일, G = 이동만
  +/-/&/^/*/ = 회전 (yaw/pitch/roll)
  [ ] = 상태 푸시/팝

파라미터: initial_axiom, rules_a/b/c/d, angle, iterations,
          trunk_type ("single"/"double"/"crossed")
```

## 13. Schematic 시스템 (`src/mapgen/mg_schematic.h`)

### MTSM 파일 포맷 (v4)

```
Signature: 'MTSM' (u32)
Version: 4 (u16)
Size: X, Y, Z (u16 each)
Y-slice 확률: Y 바이트
Name-ID 매핑: count + names
ZLib 압축: content[], param1[](prob+force_place), param2[]
```

### 확률 시스템

```
MTSCHEM_PROB_NEVER = 0x00
MTSCHEM_PROB_ALWAYS = 0x7F
MTSCHEM_FORCE_PLACE = 0x80  (param1 비트 7)

노드별 + Y-슬라이스별 확률
회전 지원 (0/90/180/270도)
CONTENT_IGNORE 건너뜀
```

## 14. 노이즈 시스템 (`src/noise.h`)

### NoiseParams

```cpp
struct NoiseParams {
    float offset;        // 오프셋
    float scale;         // 스케일
    v3f spread;          // 파장 (각 차원)
    s32 seed;            // 시드
    u16 octaves;         // 옥타브 수
    float persist;       // 지속성 (진폭 배율)
    float lacunarity;    // 주파수 배율
    u32 flags;           // EASED, ABSVALUE
};
```

### PRNG

| 클래스 | 방식 | 범위 |
|--------|------|------|
| `PseudoRandom` | LCG (1103515245×x+12345) | 0-32767 |
| `PcgRandom` | Permuted Congruential | 전체 32비트, 정규분포 지원 |

### 보조 함수

```
easeCurve(t): S-커브 보간 = t³ × (6t² - 15t + 10)
contour(v): -1..1 곡선 변환
```

## 15. EmergeManager 파이프라인

```
EmergeManager (스레드/큐/생성기 관리)
  │
  ├── EmergeThread[0] ← BlockQueue ← EmergeManager::enqueueBlockEmerge()
  ├── EmergeThread[1]
  └── EmergeThread[N]
       │
       └── 블록 처리:
            1. 메모리 조회
            2. 디스크 조회
            3. MapGen으로 생성
            │
            결과: CANCELLED | ERRORED | FROM_MEMORY | FROM_DISK | GENERATED
            │
       각 스레드는 독립적인 BiomeGen, OreManager, DecorationManager 소유
       (공유 가변 상태 없음 → 스레드 안전)
```
