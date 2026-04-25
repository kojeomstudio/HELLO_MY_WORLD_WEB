# World & Map System Reference

> Luanti (Minetest) 월드/맵 시스템 상세 분석 문서

## 1. 핵심 상수 (`src/constants.h`)

| 상수 | 값 | 의미 |
|------|-----|------|
| `BS` | 10.0f | 노드 크기 (부동소수점 단위) |
| `MAP_BLOCKSIZE` | 16 | 블록 엣지당 노드 수 |
| `MAX_MAP_GENERATION_LIMIT` | 31007 | 최대 맵젠 좌표 |
| `PLAYER_INVENTORY_SIZE` | 32 (8×4) | 플레이어 인벤토리 슬롯 |
| `PLAYER_MAX_HP_DEFAULT` | 20 | 기본 최대 체력 |
| `PLAYER_MAX_BREATH_DEFAULT` | 10 | 기본 최대 호흡 |
| `MAX_WORKING_VOLUME` | 150M | VoxelArea 최대 볼륨 |

## 2. MapNode (`src/mapnode.h`)

### 2.1 데이터 구조 (4바이트)

```cpp
struct alignas(u32) MapNode {
    u16 param0;    // 콘텐츠 타입 ID (content_t)
    u8  param1;    // 조명: 하위 4비트 = 낮, 상위 4비트 = 밤
    u8  param2;    // 보조 데이터 (방향, 액체 레벨, 색상 등)
};
```

### 2.2 특수 콘텐츠 ID

| ID | 이름 | 설명 |
|----|------|------|
| 125 | CONTENT_UNKNOWN | 알 수 없는 노드 |
| 126 | CONTENT_AIR | 공기 |
| 127 | CONTENT_IGNORE | 무시 (미생성 영역) |

### 2.3 조명 시스템 (`src/light.h`)

```
LIGHT_MAX = 14     최대 광원 밝기
LIGHT_SUN = 15     태양광

param1 구조:
  하위 4비트: 낮 뱅크 (LIGHTBANK_DAY)
  상위 4비트: 밤 뱅크 (LIGHTBANK_NIGHT)

ContentLightingFlags (1바이트):
  light_source:4       발광 레벨 (0-14)
  has_light:1          조명 전파 여부
  light_propagates:1   일반 조명 전파
  sunlight_propagates:1 태양광 전파
```

### 2.4 액체 마스크

```
LIQUID_LEVEL_MASK = 0x07      레벨 0-7
LIQUID_LEVEL_SOURCE = 0x08    소스 블록
LIQUID_FLOW_DOWN_MASK = 0x08  아래로 흐름
LIQUID_INFINITY_MASK = 0x80   무한 소스
```

### 2.5 param2 타입 (ContentParamType2)

| 타입 | 설명 |
|------|------|
| `CPT2_NONE` | 없음 |
| `CPT2_FULL` | 8비트 자유 사용 |
| `CPT2_FLOWINGLIQUID` | 흐르는 액체 레벨/방향 |
| `CPT2_FACEDIR` | 24방향 회전 |
| `CPT2_WALLMOUNTED` | 벽 부착 방향 |
| `CPT2_LEVELED` | 동적 높이 |
| `CPT2_DEGROTATE` | 2D 회전 (1.5도 단계, 0-239) |
| `CPT2_MESHOPTIONS` | plantlike 메시 옵션 |
| `CPT2_COLOR` | 팔레트 색상 인덱스 |
| `CPT2_COLORED_FACEDIR` | 3비트 색상 + facedir |
| `CPT2_COLORED_WALLMOUNTED` | 5비트 색상 + wallmounted |
| `CPT2_GLASSLIKE_LIQUID_LEVEL` | 내부 액체 레벨 |
| `CPT2_COLORED_DEGROTATE` | 3비트 색상 + degrotate |
| `CPT2_4DIR` | 4방향 단순 회전 |
| `CPT2_COLORED_4DIR` | 6비트 색상 + 4dir |

## 3. MapBlock (`src/mapblock.h`)

### 3.1 코어 데이터

```cpp
class MapBlock {
    MapNode *data;              // 16³ = 4096 노드 (16KB)
    bool m_is_mono_block;       // 모든 노드 동일 → 4바이트만 저장
    
    static const int ystride = 16;
    static const int zstride = 256;
    static const int nodecount = 4096;
};
```

### 3.2 Monoblock 최적화

모든 4096 노드가 동일하면 1개의 MapNode(4바이트)만 저장합니다.

### 3.3 상태 플래그

| 상태 | 설명 |
|------|------|
| `MOD_STATE_CLEAN` | 변경 없음 |
| `MOD_STATE_WRITE_AT_UNLOAD` | 언로드 시 저장 |
| `MOD_STATE_WRITE_NEEDED` | 즉시 저장 필요 |

### 3.4 포함하는 하위 시스템

| 시스템 | 설명 |
|--------|------|
| `NodeMetadataList` | 노드 메타데이터 |
| `StaticObjectList` | 정적 오브젝트 (아이템 엔티티 등) |
| `NodeTimerList` | 노드 타이머 |
| `MapBlockMesh*` | 클라이언트 측 렌더링 메시 |

### 3.5 직렬화 (v29+)

```
전체 블록 zlib 압축:
  flags, lighting_complete, timestamp,
  NameIdMapping (로컬 ID → 전역 이름),
  벌크 노드 데이터 (content[], param1[], param2[]),
  노드 메타데이터, 정적 오브젝트, 노드 타이머
```

## 4. MapSector (`src/mapsector.h`)

```cpp
class MapSector {
    std::unordered_map<s16, MapBlock*> m_blocks;  // Y 인덱스
    v2s16 m_pos;                                    // XZ 블록 좌표
};
```

수직 방향으로 MapBlock들을 Y 좌표로 인덱싱합니다.

## 5. Map (`src/map.h`)

### 5.1 클래스 계층

```
Map (base)
  ├── ServerMap   - 서버 측 맵 (저장/생성)
  └── ClientMap   - 클라이언트 측 맵 (렌더링)
```

### 5.2 코어 구조

```cpp
class Map {
    std::unordered_map<v2s16, MapSector*> m_sectors;  // XZ 인덱스
    MapSector *m_sector_cache;                          // 마지막 접근 캐시
    const NodeDefManager *m_nodedef;
};
```

### 5.3 노드 접근 알고리즘

```
getNode(v3s16 p):
  1. v2s16(p.X, p.Z)로 섹터 조회 (해시맵 + 캐시)
  2. p.Y로 블록 조회 (unordered_map)
  3. 블록 내 인덱스: z*256 + y*16 + x
```

### 5.4 조명 업데이트

```
addNodeAndUpdate():
  1. 이전/새 ContentLightingFlags 비교
  2. 동일하면 조명 직접 복사
  3. 다르면 voxalgo::update_lighting_nodes() 호출
     ├── 태양광 전파 (위에서 아래로)
     └── 인공광 BFS 전파
```

### 5.5 블록 언로드 (`timerUpdate`)

```
1. 사용 시간 기준 우선순위 큐 정렬
2. 수정된 블록 먼저 저장
3. max_loaded_blocks 한계 내에서 오래된 블록 언로드
```

## 6. 데이터베이스 (`src/database/`)

### 6.1 인터페이스 계층

```
Database (base)
  ├── MapDatabase       { saveBlock, loadBlock, deleteBlock, listAllLoadableBlocks }
  ├── PlayerDatabase    { savePlayer, loadPlayer, removePlayer, listPlayers }
  ├── AuthDatabase      { getAuth, saveAuth, createAuth, deleteAuth, listNames }
  └── ModStorageDatabase { get/set/remove ModEntries }

Database_SQLite3 (SQLite 기반)
  ├── MapDatabaseSQLite3
  ├── PlayerDatabaseSQLite3
  ├── AuthDatabaseSQLite3
  └── ModStorageDatabaseSQLite3
```

### 6.2 SQLite 맵 저장

블록 위치를 X/Y/Z 비트 인터리빙으로 s64 인코딩합니다.

## 7. ContentFeatures / 노드 정의 (`src/nodedef.h`)

### 7.1 전체 필드 목록

#### 일반 속성

| 필드 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `name` | string | "" | 노드 식별자 |
| `groups` | ItemGroupList | {dig_immediate=2} | 그룹 멤버십 |
| `param_type` | ContentParamType | CPT_NONE | param1 의미 |
| `param_type_2` | ContentParamType2 | CPT2_NONE | param2 의미 |

#### 시각 속성

| 필드 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `drawtype` | NodeDrawType | NDT_NORMAL | 렌더링 방식 (20가지) |
| `mesh` | string | "" | NDT_MESH용 메시 |
| `visual_scale` | float | 1.0 | 시각 스케일 |
| `tiledef[6]` | TileDef[] | empty | 6면 타일 |
| `tiledef_overlay[6]` | TileDef[] | empty | 오버레이 타일 |
| `alpha` | AlphaMode | OPAQUE | 알파 모드 (BLEND/CLIP/OPAQUE) |
| `color` | SColor | #FFFFFF | 노드 색상 |
| `palette_name` | string | "" | param2 색상 팔레트 |
| `waving` | u8 | 0 | 흔들림 (1=나뭇잎, 2=식물, 3=액체) |
| `connect_sides` | u8 | 0 | 연결된 노드박스 면 |
| `connects_to` | string[] | empty | 연결 대상 노드 이름 |
| `post_effect_color` | SColor | 투명 | 카메라 내부 시 오버레이 색 |

#### DrawType (20가지)

| 타입 | 렌더링 |
|------|--------|
| NDT_NORMAL | 솔리드 큐브 |
| NDT_AIRLIKE | 보이지 않음 |
| NDT_LIQUID | 소스 액체 |
| NDT_FLOWINGLIQUID | 흐르는 액체 |
| NDT_GLASSLIKE | 유리 (내부 면 제거) |
| NDT_ALLFACES | 모든 면 표시 (나뭇잎) |
| NDT_TORCHLIKE | 횃불형 |
| NDT_SIGNLIKE | 표지판형 |
| NDT_PLANTLIKE | X자 교차 (식물) |
| NDT_FENCELIKE | 울타리 |
| NDT_RAILLIKE | 레일 |
| NDT_NODEBOX | 커스텀 박스 |
| NDT_GLASSLIKE_FRAMED | 테두리 유리 |
| NDT_FIRELIKE | 불꽃형 |
| NDT_MESH | 외부 3D 모델 |
| NDT_PLANTLIKE_ROOTED | 바닥에 뿌리진 식물 |

#### 조명 속성

| 필드 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `light_propagates` | bool | false | 조명 통과 |
| `sunlight_propagates` | bool | false | 태양광 통과 |
| `light_source` | u8 | 0 | 발광 레벨 (0-14) |

#### 상호작용 속성

| 필드 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `walkable` | bool | true | 충돌 |
| `pointable` | bool | true | 포인팅 |
| `diggable` | bool | true | 파기 가능 |
| `climbable` | bool | false | 오르기 (사다리) |
| `buildable_to` | bool | false | 위에 건설 |
| `damage_per_second` | u32 | 0 | 초당 피해 |
| `move_resistance` | u8 | 0 | 이동 저항 (0-7) |

#### 액체 속성

| 필드 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `liquid_type` | LiquidType | NONE | 없음/흐름/소스 |
| `liquid_viscosity` | u8 | 0 | 점도 (1-7) |
| `liquid_renewable` | bool | true | 재생 가능 |
| `liquid_range` | u8 | 8 | 흐름 거리 |
| `drowning` | u8 | 0 | 익사 피해 |
| `floodable` | bool | false | 액체 침수 |

#### NodeBox 타입

| 타입 | 설명 |
|------|------|
| NODEBOX_REGULAR | 전체 큐브 |
| NODEBOX_FIXED | 임의 AABB 목록 |
| NODEBOX_WALLMOUNTED | 상/하/측면 박스 |
| NODEBOX_LEVELED | 동적 높이 |
| NODEBOX_CONNECTED | 최대 15개 박스 세트 (6연결 + 6비연결 + 3기타) |

### 7.2 NodeDefManager

```cpp
class NodeDefManager {
    vector<ContentFeatures> m_content_features;  // ID → 정의
    NameIdMapping m_name_id_mapping;               // 이름 ↔ ID
    ContentLightingFlags m_lighting_flags[];        // 조명 플래그 캐시
};
```

## 8. ItemDefinition (`src/itemdef.h`)

### 8.1 아이템 타입

| 타입 | 설명 |
|------|------|
| ITEM_NONE | 미정의 |
| ITEM_NODE | 배치 가능 블록 |
| ITEM_CRAFT | 제작 아이템 |
| ITEM_TOOL | 내구도 있는 도구 |

### 8.2 주요 필드

| 필드 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `type` | ItemType | NONE | 아이템 카테고리 |
| `name` | string | "" | 식별자 |
| `description` | string | "" | 툴팁 |
| `stack_max` | u16 | 99 | 최대 스택 |
| `tool_capabilities` | ToolCapabilities* | NULL | 도구 능력 |
| `groups` | ItemGroupList | empty | 그룹 |
| `inventory_image` | string | "" | 인벤토리 이미지 |
| `wield_image` | string | "" | 장착 이미지 |
| `wield_scale` | v3f | (1,1,1) | 장착 스케일 |
| `range` | f32 | -1 | 상호작용 거리 |
| `liquids_pointable` | bool | false | 액체 포인팅 |

### 8.3 ToolCapabilities

```cpp
struct ToolCapabilities {
    float full_punch_interval = 1.4;    // 완전 펀치 시간
    int max_drop_level = 1;              // 최대 드롭 레벨
    int punch_attack_uses = 0;           // 펀치 공격 사용 횟수
    ToolGCMap groupcaps;                 // 그룹별 파기 능력
    DamageGroup damageGroups;            // 데미지 그룹
};

struct ToolGroupCap {
    vector<pair<int,float>> times;       // 등급 → 파기 시간
    int maxlevel = 1;                     // 최대 파기 레벨
    int uses = 20;                        // 내구도
};
```

## 9. VoxelManipulator (MMVManip)

맵 생성 및 Lua 스크립트에서 대량 노드 조작에 사용됩니다.

```
MMVManip (Map-bound):
  initialEmerge(p1, p2)  - 맵에서 블록 단위로 로드
  blitBackAll()           - 수정된 데이터를 맵에 다시 기록
  clone()                 - 맵과 무관한 깊은 복사
```
