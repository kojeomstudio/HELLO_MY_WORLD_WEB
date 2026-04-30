# 00 - 프로젝트 아키텍처 개요 (거시적 관점)

## 이 문서의 목적

에이전트가 `work/work_content.md`를 읽은 후 **어떤 프로젝트를 어떤 구조로 구성해야 하는지** 거시적으로 파악하기 위한 문서입니다.
미시적인 구현 세부사항(서브모듈 소스 코드 분석, 코딩 컨벤션, 보안 상세 등)은 `web/docs/reference/` 경로의 문서를 참조하세요.

---

## 1. 프로젝트 정체성

**Luanti(Minetest) 기반 복셀 게임을 웹 브라우저 환경으로 포팅하는 프로젝트**

| 항목 | 원본 (서브모듈) | 포팅 대상 (웹 프로젝트) |
|------|----------------|----------------------|
| 언어 | C++ (엔진) + Lua (게임 로직) | C# (서버) + TypeScript (클라이언트) |
| 렌더링 | IrrlichtMT (OpenGL) | Three.js (WebGL) |
| 네트워크 | UDP 커스텀 프로토콜 | SignalR (WebSocket) |
| 스크립팅 | Lua API (modding) | 하드코딩 + JSON 데이터 구동 |
| DB | LevelDB / SQLite | SQLite |
| 빌드 | CMake + Make | Vite (클라이언트) + dotnet CLI (서버) |

## 2. 서브모듈 프로젝트 구조 (분석 대상)

```
minetest_sub_project/                  # Minetest 0.4.16 기반
  src/
    client/          # C++ 클라이언트 (95개 파일)
      game.cpp       # 메인 게임 루프
      localplayer.cpp
      camera.cpp
      mapblock_mesh.cpp   # 청크 메시 생성
      sky.cpp, clouds.cpp
      renderingengine.cpp
      sound.cpp
      inputhandler.cpp
      minimap.cpp, hud.cpp
      tile.cpp, wieldmesh.cpp
    server/          # C++ 서버 (25개 파일)
      server.cpp     # 메인 서버
      mods.cpp       # Lua mod 로더
      player_sao.cpp # 플레이어 SAO
      luaentity_sao.cpp
      ban.cpp        # 밴 시스템
    network/         # UDP 네트워크 (20개 파일)
      connection.cpp
      serverpackethandler.cpp
      clientpackethandler.cpp
      networkprotocol.h
    mapgen/          # 월드 생성 (33개 파일)
      mapgen.cpp     # Mapgen 기반 클래스
      mapgen_v6.cpp, mapgen_v7.cpp, mapgen_flat.cpp ...
      cavegen.cpp, dungeongen.cpp
      mg_biome.cpp, mg_ore.cpp, mg_decoration.cpp
      treegen.cpp, mg_schematic.cpp
    script/          # Lua 스크립팅 시스템 (17개 파일)
      lua_api/       # C++ -> Lua API 바인딩
      cpp_api/       # Lua -> C++ 콜백
    content/         # 콘텐츠 관리
    database/        # LevelDB/SQLite 저장소
    gui/             # Irrlicht GUI
    util/            # 유틸리티
  builtin/
    game/            # 코어 게임 로직 (Lua)
      auth.lua, chat.lua, privileges.lua, register.lua
      falling.lua, item_entity.lua, knockback.lua
      constants.lua, features.lua, hud.lua
    client/          # 클라이언트 builtin (Lua)
    mainmenu/        # 메인 메뉴 (Lua)
  games/devtest/     # DevTest 게임 (데이터 소스)
    mods/
      basenodes/     # 기본 블록 정의 (28 블록)
      basetools/     # 기본 도구 정의 (곡괭이/삽/도끼/검)
      bucket/        # 양동이
      chest/         # 상자
      stairs/        # 계단/반블록
      testfood/      # 음식
      testnodes/     # 테스트 노드
      give_initial_stuff/  # 초기 아이템
```

## 3. 포팅 대상 웹 프로젝트 구성 (제안)

```
web/
  client/             # TypeScript + Three.js + Vite
    src/
      main.ts                    # 엔트리 포인트
      GameClient.ts              # 컴포지션 루트
      rendering/                 # Three.js 렌더링
        Renderer.ts              # <-> minetest: client/renderingengine.cpp, sky.cpp, clouds.cpp
        ChunkMesh.ts             # <-> minetest: client/mapblock_mesh.cpp
        SelectionBox.ts          # <-> minetest: client/hud.cpp (selection)
        WieldItem.ts             # <-> minetest: client/wieldmesh.cpp
      world/                     # 월드 관리
        WorldManager.ts          # <-> minetest: client/clientmap.cpp
        BlockRegistry.ts         # <-> minetest: src/nodedef.cpp
        LightingEngine.ts        # (클라이언트 사이드 조명 표시)
      player/                    # 플레이어
        PlayerController.ts      # <-> minetest: client/localplayer.cpp
      input/                     # 입력
        InputManager.ts          # <-> minetest: client/inputhandler.cpp
      ui/                        # HUD/UI
        UIManager.ts             # <-> minetest: gui/, game_formspec.cpp
        SettingsPanel.ts
        Minimap.ts               # <-> minetest: client/minimap.cpp
      audio/                     # 사운드
        AudioManager.ts          # <-> minetest: client/sound.cpp
    public/textures/blocks/      # <-> minetest: games/devtest/mods/*/textures/

  server/             # C# ASP.NET Core + SignalR
    Program.cs                     # DI, 앱 시작/종료
    Core/
      GameServer.cs                # <-> minetest: server/server.cpp
      ServerConfig.cs
      Game/
        BlockDefinition.cs         # <-> minetest: src/nodedef.cpp
      World/
        World.cs                   # <-> minetest: src/map.cpp, servermap.cpp
        Chunk.cs                   # <-> minetest: src/mapblock.cpp
        BlockType.cs               # <-> minetest: src/content_mapnode.h
        WorldPersistence.cs        # <-> minetest: src/database/
        Generators/
          NoiseWorldGenerator.cs   # <-> minetest: src/mapgen/mapgen_v6.cpp
          FlatWorldGenerator.cs    # <-> minetest: src/mapgen/mapgen_flat.cpp
        LightingEngine.cs          # <-> minetest: src/light.cpp
        ActiveBlockModifier.cs     # <-> minetest: server/blockmodifier.cpp
        NodeTimerSystem.cs         # <-> minetest: src/nodetimer.cpp
        AgricultureSystem.cs
      Entities/
        Entity.cs                  # <-> minetest: server/luaentity_sao.cpp
        EntityManager.cs           # <-> minetest: server/activeobjectmgr.cpp
        MobSpawner.cs
      Player/
        Player.cs                  # <-> minetest: server/player_sao.cpp
        Inventory.cs               # <-> minetest: src/inventory.h
        PlayerDatabase.cs          # <-> minetest: builtin/game/auth.lua
      Physics/
        PhysicsEngine.cs           # <-> minetest: client/localplayer.cpp (물리)
        KnockbackSystem.cs         # <-> minetest: builtin/game/knockback.lua
      Auth/
        AuthenticationService.cs   # <-> minetest: builtin/game/auth.lua
        PrivilegeSystem.cs         # <-> minetest: builtin/game/privileges.lua
      Chat/
        ChatCommandManager.cs      # <-> minetest: builtin/game/chat.lua
      Crafting/
        CraftingSystem.cs          # <-> minetest: src/craftdef.cpp
        SmeltingSystem.cs
    Services/
      GameHub.cs                   # <-> minetest: network/serverpackethandler.cpp
      GameLoopService.cs           # <-> minetest: server/server.cpp (메인 루프)

  data/                # JSON 게임 데이터
    server_config.json         # <-> minetest.conf
    blocks.json                # <-> devtest/mods/basenodes/*.lua
    items.json                 # <-> devtest/mods/basetools/*.lua + 기타
    smelting.json              # <-> minetest: src/craftdef.cpp (cooking)
    biomes.json                # <-> minetest: src/mapgen/mg_biome.cpp
    mobs.json                  # (신규 구현)
    tools.json                 # <-> devtest/mods/basetools/*.lua
    physics_constants.json     # <-> minetest.conf (movement_*)
    privileges.json            # <-> builtin/game/privileges.lua
    sounds.json                # <-> minetest: src/sound_spec.h
```

## 4. 핵심 시스템 포팅 매핑 (거시적)

| Minetest 시스템 | 소스 위치 | 웹 프로젝트 대응 | 포팅 전략 |
|----------------|----------|-----------------|----------|
| **네트워크 프로토콜** | `src/network/` (UDP 커스텀) | SignalR WebSocket (`/game`) | 프로토콜 재설계: 커맨드 기반 -> 허브 메서드/이벤트 |
| **월드/청크** | `src/map.cpp`, `mapblock.cpp` | `World.cs`, `Chunk.cs` | 16x16x16 청크, 4바이트/블록 포맷 유지 |
| **월드 생성** | `src/mapgen/` (v6, v7, flat, ...) | `NoiseWorldGenerator.cs`, `FlatWorldGenerator.cs` | Perlin 노이즈 기반 지형 + 동굴 + 광물 |
| **조명** | `src/light.cpp` | `LightingEngine.cs` | 4비트 태양 + 4비트 인공 조명 패킹 유지 |
| **블록 정의** | `src/nodedef.cpp` + Lua `register_node()` | `blocks.json` + `BlockDefinition.cs` | Lua 동적 등록 -> JSON 정적 정의 |
| **아이템/도구** | Lua `register_tool()`, `register_craftitem()` | `items.json` | JSON으로 모든 아이템/도구 정의 |
| **제작 시스템** | `src/craftdef.cpp` (shaped/shapeless/cooking) | `CraftingSystem.cs`, `SmeltingSystem.cs` | 해시 매칭 -> JSON 레시피 순회 매칭 |
| **플레이어** | `server/player_sao.cpp`, `client/localplayer.cpp` | `Player.cs`, `PlayerController.ts` | 속성/물리 모델 유지, 렌더링은 Three.js |
| **물리** | `client/localplayer.cpp` (클라이언트 사이드) | `PhysicsEngine.cs` (서버 권위) | 서버 권위 모델로 변경, 위치 보정 |
| **엔티티** | `server/luaentity_sao.cpp` | `EntityManager.cs`, `Entity.cs` | Lua 엔티티 -> C# 고정 타입 (Item/Mob) |
| **인증/권한** | `builtin/game/auth.lua`, `privileges.lua` | `AuthenticationService.cs`, `PrivilegeSystem.cs` | PBKDF2 해시, 19 권한 유지 |
| **채팅/명령** | `builtin/game/chat.lua` | `ChatCommandManager.cs` | 명령어 집합 매핑 |
| **레이더스팅** | `client/mapblock_mesh.cpp` | `ChunkMesh.ts` (Three.js) | 면 컬링, AO, UV 매핑 알고리즘 포팅 |
| **UI/FormSpec** | `client/game_formspec.cpp` + Lua | `UIManager.ts` (DOM 기반) | FormSpec 파서 -> 하드코딩 UI 패널 |
| **사운드** | `client/sound.cpp` + OpenAL | `AudioManager.ts` (Web Audio API) | 절차적 사운드 생성 |
| **미니맵** | `client/minimap.cpp` | `Minimap.ts` | 2D 캔버스 렌더링 |
| **파티클** | `client/particles.cpp` | `ParticleSystem.ts` | Three.js 파티클 |
| **바이옴** | `src/mapgen/mg_biome.cpp` | `biomes.json` + 노이즈 선택 | 히트/습도 노이즈 기반 바이옴 선택 유지 |
| **ABM** | `server/blockmodifier.cpp` | `ActiveBlockModifierSystem.cs` | 샌드/자갈 낙하, 타이머 시스템 |
| **기상** | (엔진 내장) | `WeatherSystem.ts` (클라이언트 전용) | 비/눈 파티클 효과 |
| **낮/밤** | `src/daynightratio.h` | `server_config.json` + 클라이언트 렌더링 | 24000 틱 사이클, 하늘 밝기 보간 |

## 5. 미시적 참조 문서 (상세 분석)

에이전트가 세부 구현이 필요할 때 참조할 문서들입니다:

| 문서 | 경로 | 내용 |
|------|------|------|
| 서버 아키텍처 분석 | `web/docs/reference/server-architecture.md` | Minetest 서버 클래스 계층, 게임 루프, 패킷 처리 상세 |
| 클라이언트 아키텍처 분석 | `web/docs/reference/client-architecture.md` | Minetest 클라이언트 클래스 계층, 렌더링 파이프라인 상세 |
| 네트워크 프로토콜 분석 | `web/docs/reference/network-protocol.md` | UDP 패킷 포맷, 명령어 ID, 직렬화 방식 |
| 월드/맵 시스템 분석 | `web/docs/reference/world-map-system.md` | MapBlock, MapSector, 청크 관리, 조명 전파 |
| 맵 생성 시스템 분석 | `web/docs/reference/mapgen-system.md` | MapgenV6/V7, 노이즈 생성, 바이옴/광물/동굴 |
| 게임 콘텐츠 분석 | `web/docs/reference/game-content.md` | DevTest 블록/도구/아이템 정의, 제작 레시피, 설정값 |
| 스크립팅/모딩 분석 | `web/docs/reference/scripting-modding.md` | Lua API 바인딩, mod 로딩, builtin 함수들 |

## 6. 에이전트 작업 흐름

```
1. work/work_content.md 읽기
   -> 페르소나, 룰, 태스크, 참조 규칙 확인

2. work/architecture/00-overview.md 읽기 (이 문서)
   -> 프로젝트 전체 구조, 포팅 매핑 파악

3. 필요에 따라 work/architecture/ 세부 문서 참조
   -> 01-server-core.md: 서버 구성 제안
   -> 02-client-core.md: 클라이언트 구성 제안
   -> 03-communication.md: 통신 프로토콜 설계
   -> 04-world-system.md: 월드 시스템 설계
   -> 05-gameplay.md: 게임플레이 시스템 설계
   -> 06-data-models.md: 데이터 모델 설계
   -> 07-security.md: 보안 설계
   -> 08-implementation-guide.md: 구현 가이드

4. 미시적 분석이 필요한 경우 web/docs/reference/ 참조
   -> 서브모듈 C++ 소스의 상세 구현 분석

5. 코딩 컨벤션 확인: AGENTS.md

6. 구현 진행 -> 테스트 -> 커밋
```
