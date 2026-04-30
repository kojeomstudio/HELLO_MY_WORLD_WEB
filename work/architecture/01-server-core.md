# 01 - 서버 아키텍처 (거시적 설계)

## 포팅 방향성

Minetest 서버의 C++ 코어 + Lua 스크립팅 구조를 **C# ASP.NET Core 단일 프로세스**로 포팅합니다.
Lua mod 시스템은 JSON 데이터 구동 방식으로 대체합니다.

## 시스템 구성도

```
┌─────────────────────────────────────────────────┐
│  ASP.NET Core 10.0                              │
│                                                 │
│  ┌──────────┐  DI (Singleton)  ┌─────────────┐ │
│  │ GameHub   │─────────────────│  GameServer  │ │
│  │ (SignalR) │                 │             │ │
│  └────┬─────┘                 └──────┬──────┘ │
│       │                              │         │
│  클라이언트 요청                  게임 상태    │
│  (Hub 메서드)                  (20TPS 업데이트) │
│                              ┌─────┴──────┐  │
│                              │            │  │
│                         ┌────┴───┐  ┌────┴───┐ │
│                         │ World  │  │Player  │ │
│                         │        │  │  Mgr   │ │
│                         └────────┘  └────────┘ │
│                              │                  │
│                         ┌────┴────────────┐    │
│                         │ Entity, Craft,  │    │
│                         │ Smelt, Auth,    │    │
│                         │ Physics, Chat   │    │
│                         └─────────────────┘    │
└─────────────────────────────────────────────────┘
```

## 핵심 컴포넌트 (거시적 구성)

### GameHub (SignalR Hub)
**역할**: 클라이언트 요청을 수신하고 GameServer에 위임

| 책임 | Minetest 대응 |
|------|-------------|
| 플레이어 접속/종료 | `server/clientiface.cpp` |
| 블록 상호작용 (채굴/설치) | `serverpackethandler.cpp` (TOSERVER_DIG/PLACE) |
| 인벤토리/제작/제련 | `serverpackethandler.cpp` (TOSERVER_INVENTORY_ACTION) |
| 위치 동기화 | `serverpackethandler.cpp` (TOSERVER_PLAYERPOS) |
| 채팅/명령 | `builtin/game/chat.lua` |
| 속도 제한 | `serverpackethandler.cpp` (안티치트) |

### GameServer (중앙 게임 상태)
**역할**: 모든 게임 로직의 중심, 틱 기반 업데이트

| 책임 | Minetest 대응 |
|------|-------------|
| 플레이어 레지스트리 | `server/server.cpp` (m_players) |
| 월드 인스턴스 관리 | `server/serverenvironment.cpp` |
| 게임 시간/낮밤 | `serverenvironment.cpp` (m_game_time) |
| 청크/상자/화로 상태 | `servermap.cpp`, `nodemetadata.h` |

### GameLoopService (BackgroundService)
**역할**: 20TPS 고정 틱 레이트 게임 루프

```
매 틱 (50ms):
  GameServer.Update()
    -> 플레이어 업데이트 (피해/호흡/배고픔/추락)
    -> 위치 검증
    -> 엔티티 업데이트
    -> 노드 타이머
    -> 몹 스폰
    -> 액체 흐름
    -> ABM 처리
    -> 농작물 성장
    -> 화로 진행
  아이템 픽업 처리
  엔티티 브로드캐스트
  낙하 블록 처리
  자동 저장 (5분 주기)
  시간 브로드캐스트 (100틱 주기)
```

### World (청크 저장소)
**역할**: 청크 생성/저장/조회, 액체 시뮬레이션

| 책임 | Minetest 대응 |
|------|-------------|
| 청크 저장 (ConcurrentDictionary) | `src/map.cpp` (m_sectors) |
| 지연 생성 (GetOrAdd) | `emerge.cpp` (EmergeManager) |
| 액체 흐름 | `src/map.cpp` (transformLiquids) |
| 조명 엔진 | `src/light.cpp` |

### Player (플레이어 상태)
**역할**: 개별 플레이어의 모든 상태 관리

| 상태 | Minetest 대응 |
|------|-------------|
| 위치/속도/회전 | `player_sao.cpp` (m_position, m_velocity) |
| 체력/호흡/식량 | `player_sao.cpp` (m_hp, m_breath) |
| 인벤토리 (32슬롯) | `inventory.h` (m_lists) |
| 방어구 (4슬롯) | `lua_api/l_player.cpp` (set_armor) |
| 게임 모드 | `player_sao.cpp` (m_player) |

## DI 등록 구조

모든 서비스를 **Singleton**으로 등록 (Program.cs).

```
ServerConfig -> BlockDefinitionManager -> WorldGeneratorFactory
  -> SmeltingSystem -> PrivilegeSystem -> PlayerDatabase
    -> BlockMetadataDatabase -> GameServer (모든 의존성 주입)
      -> AuthenticationService -> ChatCommandManager
        -> CraftingSystem -> GridCraftingSystem
          -> EntityManager -> AreaProtectionSystem
            -> GameLoopService (Hosted)
```

## JSON 데이터 구동 원칙

Minetest의 Lua 동적 등록 방식을 JSON 정적 정의로 대체:

| Minetest | 웹 프로젝트 |
|----------|-----------|
| `minetest.register_node(...)` | `blocks.json`에 블록 정의 추가 |
| `minetest.register_tool(...)` | `items.json`에 도구 정의 추가 |
| `minetest.register_craft(...)` | `items.json`에 레시피 추가 |
| `minetest.register_biome(...)` | `biomes.json`에 바이옴 추가 |
| `minetest.register_ore(...)` | `ores.json`에 광물 추가 |
| `minetest.register_privilege(...)` | `privileges.json`에 권한 추가 |

데이터 파일 수정만으로 게임 콘텐츠를 확장할 수 있도록 설계합니다.

## 서버 API

| 엔드포인트 | 방식 | 용도 |
|-----------|------|------|
| `/game` | SignalR WebSocket | 게임 통신 (모든 게임 로직) |
| `/api/status` | REST GET | 서버 상태 조회 (건강 체크용) |

## 상세 구현 참조

| 주제 | 참조 문서 |
|------|---------|
| Minetest 서버 클래스 계층 상세 | `web/docs/reference/server-architecture.md` |
| 네트워크 패킷 처리 상세 | `web/docs/reference/network-protocol.md` |
| 월드/맵 저장소 상세 | `web/docs/reference/world-map-system.md` |
| 맵 생성 알고리즘 상세 | `web/docs/reference/mapgen-system.md` |
| 콘텐츠/데이터 상세 | `web/docs/reference/game-content.md` |
