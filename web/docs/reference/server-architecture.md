# Server Architecture Reference

> Luanti (Minetest) 엔진 서버 아키텍처 상세 분석 문서

## 1. 개요

서버는 UDP 기반 커스텀 프로토콜을 통해 클라이언트와 통신하며, 게임 월드 관리, 엔티티 처리, 플레이어 관리, 맵 생성, Lua 스크립팅 엔진을 통합 관리합니다.

## 2. 클래스 계층 구조

```
Server
 ├── ServerEnvironment
 │    ├── ServerActiveObject (abstract)
 │    │    ├── UnitSAO
 │    │    │    ├── PlayerSAO        - 플레이어 객체
 │    │    │    └── LuaEntitySAO     - Lua 정의 엔티티
 │    │    └── (기타 내장 SAO)
 │    ├── ActiveObjectMgr            - 엔티티 관리자
 │    └── ABMHandler                 - Active Block Modifier
 ├── EmergeManager                   - 맵 생성 관리
 │    └── EmergeThread[]             - 멀티스레드 청크 생성
 ├── ServerScripting                 - Lua 스크립팅 엔진
 ├── ClientInterface                 - 클라이언트 연결 관리
 ├── BanManager                      - 밴 관리
 ├── RollbackManager                 - 롤백 관리
 ├── ServerModManager                - 모드 관리
 ├── ServerInventoryManager          - 인벤토리 관리
 └── NodeDefManager / ItemDefManager - 콘텐츠 정의
```

## 3. Server 클래스 (`src/server.h`, `src/server.cpp`)

### 3.1 핵심 멤버 변수

| 변수 | 타입 | 설명 |
|------|------|------|
| `m_env` | `ServerEnvironment*` | 게임 환경 |
| `m_clients` | `ClientInterface` | 클라이언트 연결 관리 |
| `m_script` | `ServerScripting*` | Lua 스크립팅 엔진 |
| `m_emerge` | `EmergeManager*` | 맵 생성 관리 |
| `m_nodedef` | `NodeDefManager*` | 노드 정의 |
| `m_itemdef` | `IWritableItemDefManager*` | 아이템 정의 |
| `m_craftdef` | `IWritableCraftDefManager*` | 제작 정의 |
| `m_modmgr` | `ServerModManager*` | 모드 관리 |
| `m_banmanager` | `BanManager*` | 밴 관리 |
| `m_rollback` | `RollbackManager*` | 롤백 관리 |
| `m_inventory_mgr` | `ServerInventoryManager` | 인벤토리 관리 |
| `m_path_world` | `std::string` | 월드 디렉토리 경로 |
| `m_time_of_day` | `u32` | 현재 게임 시간 (0-23999) |
| `m_time_speed` | `float` | 시간 진행 속도 (기본 72) |
| `m_lag` | `float` | 현재 서버 랙 |

### 3.2 스레딩 모델

서버는 다중 스레드로 동작합니다:

| 스레드 | 역할 |
|--------|------|
| **Main Thread** | 게임 루프 (`step()`), 물리, 채팅, 인벤토리, Lua 콜백 |
| **EmergeThread (N개)** | 맵 생성 (청크 단위 병렬 처리) |
| **Async Thread** | 비동기 Lua 스크립트 실행 (HTTP 요청 등) |
| **Connection Thread** | 네트워크 패킷 송수신 |

### 3.3 메인 게임 루프 (`Server::step()`)

```
step(dtime):
  1. 네트워크 패킷 수신 및 처리 (handleCommand_*)
  2. 인증 처리
  3. 환경 업데이트 (ServerEnvironment::step())
     ├── ABM (Active Block Modifier) 처리
     ├── 엔티티 물리/충돌 업데이트
     ├── 액티브 블록 관리 (로드/언로드)
     ├── 액티브 오브젝트 브로드캐스트
     └── Liquid 업데이트
  4. 블록 전송 (클라이언트 요청에 따라)
  5. Lua globalstep 콜백 실행
  6. 시간 업데이트 브로드캐스트
  7. 플레이어 목록 업데이트
  8. 연결 타임아웃 처리
```

### 3.4 클라이언트 명령 처리

서버는 `handleCommand_*` 메서드로 클라이언트 요청을 처리합니다:

| 명령 | 처리 메서드 | 설명 |
|------|------------|------|
| `TOSERVER_INIT` | `handleCommand_Init` | 초기 연결 |
| `TOSERVER_INIT2` | `handleCommand_Init2` | 인증 완료 후 초기화 |
| `TOSERVER_PLAYERPOS` | `handleCommand_PlayerPos` | 플레이어 위치 업데이트 |
| `TOSERVER_CHAT_MESSAGE` | `handleCommand_ChatMessage` | 채팅 메시지 |
| `TOSERVER_INVENTORY_ACTION` | `handleCommand_InventoryAction` | 인벤토리 조작 |
| `TOSERVER_INTERACT` | `handleCommand_Interact` | 블록/엔티티 상호작용 |
| `TOSERVER_DAMAGE` | `handleCommand_Damage` | 피해 보고 |
| `TOSERVER_FIRST_SRP` | `handleCommand_FirstSrp` | SRP 신규 가입 |
| `TOSERVER_SRP_BYTES_A/M` | `handleCommand_SrpBytes*` | SRP 인증 |
| `TOSERVER_REQUEST_MEDIA` | `handleCommand_RequestMedia` | 미디어 파일 요청 |
| `TOSERVER_NODEMETA_FIELDS` | `handleCommand_NodeMetaFields` | 노드 메타데이터 폼 |
| `TOSERVER_CLIENT_READY` | `handleCommand_ClientReady` | 클라이언트 준비 완료 |

## 4. ServerEnvironment (`src/serverenvironment.h`)

### 4.1 핵심 역할

- 맵(Map)과 액티브 오브젝트 관리
- ABM(Active Block Modifier) 처리
- 플레이어 세션 관리
- 시간/날씨 관리

### 4.2 주요 멤버

| 변수 | 타입 | 설명 |
|------|------|------|
| `m_map` | `ServerMap*` | 서버 맵 |
| `m_script` | `ServerScripting*` | Lua 엔진 |
| `m_server` | `Server*` | 부모 서버 |
| `m_active_objects` | `ActiveObjectMgr` | 활성 엔티티 |
| `m_active_blocks` | `std::set<v3s16>` | 활성 블록 목록 |
| `m_players` | `std::vector<RemotePlayer*>` | 접속 중인 플레이어 |
| `m_game_time` | `u64` | 게임 경과 시간 (초) |
| `m_time_of_day` | `u32` | 게임 내 시간 |

### 4.3 step() 동작 흐름

```
ServerEnvironment::step(dtime):
  1. m_time_of_day 업데이트
  2. IncreaseTimeOfDay()
  3. ActiveBlockList 업데이트
     ├── 플레이어 주변 블록 활성화
     └── 멀리 있는 블록 비활성화
  4. ABM 처리 (Active Block Modifiers)
     ├── 각 활성 블록의 노드 순회
     ├── 조건 매칭 (nodenames, neighbors, interval, chance)
     └── Lua action 콜백 실행
  5. 액티브 오브젝트 업데이트
     ├── 물리/충돌 처리
     ├── AI/행동 업데이트
     └── 위치/애니메이션 브로드캐스트
  6. Liquid 업데이트 (transforming_liquid)
  7. Node Timer 처리
```

## 5. ServerActiveObject 계층

### 5.1 UnitSAO (공통 베이스)

```
ServerActiveObject (abstract)
  └── UnitSAO
       ├── PlayerSAO      - 플레이어
       └── LuaEntitySAO   - Lua 엔티티
```

### 5.2 PlayerSAO (`src/server/player_sao.h`)

플레이어의 서버 측 표현입니다.

| 멤버 | 타입 | 설명 |
|------|------|------|
| `m_player` | `RemotePlayer*` | 플레이어 데이터 |
| `m_hp` | `u16` | 현재 체력 (기본 최대 20) |
| `m_breath` | `u16` | 호흡량 (기본 최대 10) |
| `m_armor_groups` | `ItemGroupList` | 방어구 그룹 |
| `m_physics_override` | `PhysicsParams` | 물리 오버라이드 |
| `m_animation` | `v2s32[4]` | 애니메이션 프레임 |
| `m_bone_position` | `map<string, pair<v3f, v3f>>` | 본 위치/회전 |
| `m_attachment` | `ObjectAttachment` | 부착 정보 |
| `m_wield_index` | `u16` | 장착 슬롯 인덱스 |
| `m_position` | `v3f` | 현재 위치 |
| `m_velocity` | `v3f` | 현재 속도 |
| `m_pitch`, `m_yaw` | `float` | 카메라 회전 |
| `m_privs` | `u64` | 권한 비트마스크 |

### 5.3 PlayerSAO 물리/이동 처리

```
PlayerSAO::step(dtime):
  1. 물리 오버라이드 적용 (speed, jump, gravity 등)
  2. 서버 측 위치 검증 (안티치트)
  3. 이동 충돌 처리 (collisionMoveSimple)
  4. 호흡 시스템 (수중: breath 감소, 0이면 피해)
  5. 체력 재생 (포화 상태에서 0.5초마다 1HP)
  6. 노드 피해 (damage_per_second, lava, fire)
  7. 애니메이션 업데이트
```

### 5.4 LuaEntitySAO (`src/server/luaentity_sao.h`)

Lua 스크립트로 정의된 커스텀 엔티티입니다.

| 멤버 | 설명 |
|------|------|
| `m_init_name` | 엔티티 타입 이름 |
| `m_prop` | ObjectProperties (시각적 속성) |
| `m_velocity` | 현재 속도 |
| `m_acceleration` | 가속도 |
| `m_rotation` | 회전 (3축) |
| `m_texture_mod` | 텍스처 수정자 |

### 5.5 ObjectProperties 주요 필드

| 필드 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `visual` | `string` | "sprite" | 시각 타입 (sprite/cube/wielditem/mesh/item) |
| `mesh` | `string` | "" | 메시 이름 (visual=mesh 시) |
| `textures` | `vector<string>` | {} | 텍스처 목록 |
| `visual_size` | `v3f` | (1,1,1) | 시각 크기 |
| `collisionbox` | `aabb3f` | (-0.5,..,0.5) | 충돌 박스 |
| `selectionbox` | `aabb3f` | (-0.5,..,0.5) | 선택 박스 |
| `physical` | `bool` | false | 물리 엔진 적용 |
| `collide_with_objects` | `bool` | true | 오브젝트와 충돌 |
| `hp_max` | `u16` | 1 | 최대 체력 |
| `infotext` | `string` | "" | 정보 텍스트 |
| `automatic_rotate` | `float` | 0 | 자동 회전 속도 |
| `stepheight` | `float` | 0 | 올라갈 수 있는 높이 |
| `automatic_face_movement_dir` | `float` | 0 | 이동 방향으로 자동 회전 |

## 6. ActiveObjectMgr (`src/server/activeobjectmgr.h`)

서버의 모든 활성 오브젝트를 관리합니다.

```cpp
class ActiveObjectMgr {
    std::unordered_map<u16, ServerActiveObject*> m_active_objects;
    
    // 주요 메서드
    void addObject(ServerActiveObject* obj);
    void removeObject(u16 id);
    ServerActiveObject* getObject(u16 id);
    std::vector<ServerActiveObject*> getAllObjects();
    // 영역/반경 내 오브젝트 검색
    std::vector<ServerActiveObject*> getObjectsInsideRadius(v3f pos, float radius);
    std::vector<ServerActiveObject*> getObjectsInArea(aabb3f box);
    // 브로드캐스트
    void sendActiveObjectRemoveAdd(u16 peer_id);
    void sendActiveObjectMessages(u16 peer_id);
};
```

## 7. ClientInterface (`src/server/clientiface.h`)

### 7.1 클라이언트 상태

| 상태 | 설명 |
|------|------|
| `CS_Invalid` | 유효하지 않음 |
| `CS_Disconnecting` | 연결 종료 중 |
| `CS_HalfAttempt` | 연결 시도 (피어 ID 미할당) |
| `CS_Created` | 피어 ID 할당됨 |
| `CS_AwaitingInit2` | INIT2 대기 (인증 후) |
| `CS_Active` | 게임 중 |

### 7.2 RemotePlayer

접속 중인 플레이어의 영구적 상태를 관리합니다:

| 멤버 | 설명 |
|------|------|
| `m_name` | 플레이어 이름 |
| `m_inventory` | 인벤토리 |
| `m_privs` | 권한 |
| `m_last_login` | 마지막 로그인 시간 |
| `m_sao` | PlayerSAO 포인터 |
| `m_hotbar_image` | 핫바 이미지 |
| `m_hotbar_selected_image` | 선택된 핫바 이미지 |

## 8. BanManager (`src/server/ban.h`)

```cpp
class BanManager {
    std::unordered_map<std::string, std::string> m_bans; // IP_or_name -> reason
    
    void load();
    void save();
    void addBan(std::string ip_or_name, std::string reason);
    void removeBan(std::string ip_or_name);
    bool isBanned(std::string ip_or_name);
    std::string getBanDescription(std::string ip_or_name);
};
```

## 9. RollbackManager (`src/server/rollback.h`)

블록 변경 이력을 추적하고 되돌릴 수 있습니다.

```
RollbackManager:
  - 모든 노드 변경 기록 (actor, position, old_node, new_node, timestamp)
  - 시간 기반 롤백 지원
  - 행위자별 롤백 지원
  - 영역 기반 변경 조회
```

## 10. EmergeManager (`src/emerge.h`)

맵 생성을 관리하는 멀티스레드 시스템입니다.

### 10.1 아키텍처

```
EmergeManager
  ├── EmergeThread[N]           (각각 독립적인 Lua 상태 보유)
  │    ├── MapGen 인스턴스       (스레드 안전)
  │    ├── BiomeGen 인스턴스
  │    ├── OreManager 인스턴스
  │    └── DecorationManager 인스턴스
  ├── BlockQueue               (청크 생성 요청 큐)
  └── MapgenParams             (공유 생성 매개변수)
```

### 10.2 블록 생성 파이프라인

```
1. 클라이언트가 블록 요청
2. EmergeManager::enqueueBlockEmerge()
3. EmergeThread가 큐에서 꺼냄
4. 메모리에서 조회 -> 디스크에서 조회 -> MapGen으로 생성
5. 결과: CANCELLED | ERRORED | FROM_MEMORY | FROM_DISK | GENERATED
6. 메인 스레드에서 클라이언트에게 전송
```

## 11. 충돌 시스템 (`src/collision.h`)

### 11.1 충돌 감지 알고리즘

```
collisionMoveResult collisionMoveSimple(
    Environment *env,
    const NodeDefManager *nodedef,
    f32 pos_max_d,         // 최대 이동 거리
    const aabb3f &box_0,   // 충돌 박스
    f32 stepheight,         // 올라갈 높이
    f32 dtime,
    v3f pos,               // 입력/출력 위치
    v3f speed,             // 입력/출력 속도
    v3f accel              // 가속도
);
```

### 11.2 충돌 처리 흐름

```
1. 이동 궤적 계산 (pos + speed * dtime)
2. AABB 충돌 박스를 노드 그리드에 투영
3. 후보 노드 탐색
4. 각 축(X, Y, Z) 순서로 충돌 검사
5. 충돌 시 속도 반영 (미끄러짐/정지)
6. stepheight 처리 (1블록 높이 자동 올라가기)
7. 결과: 최종 위치 + 속도 + 충돌 정보
```

### 11.3 CollisionInfo 구조체

```cpp
struct CollisionInfo {
    v3s16 node_p;           // 충돌한 노드 위치
    u16 old_speed;          // 충돌 전 속도 성분
    u16 new_speed;          // 충돌 후 속도 성분
    CollisionType type;     // 충돌 타입 (NODE, OBJECT)
};
```

## 12. 서버 보안 시스템

### 12.1 안티치트

| 검사 항목 | 설명 |
|-----------|------|
| 이동 속도 | 플레이어 이동이 물리 범위 내인지 검증 |
| 블록 파괴 시간 | dig 시간이 올바른지 검증 |
| 상호작용 거리 | 대상과의 거리가 허용 범위 내인지 검증 |
| 비행 | fly 권한 없이 비행하는지 감지 |

### 12.2 권한 시스템

| 권한 | 설명 |
|------|------|
| `interact` | 블록 상호작용 |
| `shout` | 채팅 |
| `teleport` | 텔레포트 |
| `bring` | 다른 플레이어 소환 |
| `give` | 아이템 지급 |
| `settime` | 시간 설정 |
| `privs` | 권한 관리 |
| `basic_privs` | 기본 권한 부여/회수 |
| `server` | 서버 관리 |
| `ban` | 밴 관리 |
| `kick` | 플레이어 강제 퇴장 |
| `rollback` | 롤백 |
| `fly` | 비행 모드 |
| `noclip` | 노클립 모드 |
| `fast` | 빠른 이동 모드 |
| `creative` | 크리에이티브 모드 |

## 13. 블록 전송 시스템

서버는 클라이언트에게 맵 블록을 전송합니다:

```
1. 클라이언트가 시야 범위 내 블록 요청
2. 서버가 EmergeManager를 통해 블록 준비
3. 블록 직렬화 (zlib 압축)
4. TOCLIENT_BLOCKDATA로 전송 (Channel 2, Reliable)
5. 클라이언트가 GOTBLOCKS로 응답
```

### 블록 전송 최적화

- **우선순위 큐**: 플레이어와 가까운 블록 우선 전송
- **압축**: zlib 압축으로 대역폭 절약
- **Monoblock 최적화**: 동일 노드로 구성된 블록은 4바이트만 전송
- **증분 전송**: 변경된 블록만 재전송
