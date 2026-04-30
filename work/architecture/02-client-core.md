# 02 - 클라이언트 아키텍처 (거시적 설계)

## 포팅 방향성

Minetest의 C++/IrrlichtMT 클라이언트를 **TypeScript/Three.js SPA**로 포팅합니다.
Irrlicht GUI와 FormSpec 시스템은 **DOM 기반 HTML/CSS UI**로 대체합니다.

## 시스템 구성도

```
┌──────────────────────────────────────────────────┐
│  Browser (Single Page Application)               │
│                                                  │
│  ┌──────────┐     ┌──────────────────────────┐  │
│  │ main.ts  │────>│      GameClient.ts       │  │
│  │ (bootstrap)│    │  (Composition Root)      │  │
│  └──────────┘     └──────────┬───────────────┘  │
│                              │                   │
│         ┌────────────────────┼────────────┐     │
│         │                    │            │     │
│    ┌────┴─────┐      ┌──────┴──────┐  ┌──┴───┐  │
│    │Renderer  │      │WorldManager │  │Player│  │
│    │(Three.js)│      │(Chunk/Atlas)│  │Ctrl  │  │
│    └────┬─────┘      └──────┬──────┘  └──┬───┘  │
│         │                   │             │     │
│    ┌────┴─────┐      ┌──────┴──────┐  ┌──┴───┐  │
│    │ Sky,     │      │ BlockReg,   │  │Input │  │
│    │ Cloud,   │      │ ChunkMesh,  │  │Mgr   │  │
│    │ Shadow,  │      │ Weather,    │  └──────┘  │
│    │ Weather  │      │ Particle    │             │
│    └──────────┘      └─────────────┘             │
│                                                  │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│    │ UIManager│  │  Audio   │  │ Minimap  │    │
│    │ (HUD/UI) │  │ (Web API)│  │ (Canvas) │    │
│    └──────────┘  └──────────┘  └──────────┘    │
│                                                  │
│    ┌──────────────────────────────────────────┐  │
│    │  SignalR Client ──WebSocket──> Server     │  │
│    └──────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

## 핵심 컴포넌트 (거시적 구성)

### GameClient (컴포지션 루트)
**역할**: 모든 서브시스템 생성, 연결, 게임 루프 관리

| 책임 | Minetest 대응 |
|------|-------------|
| SignalR 연결/이벤트 등록 | `client/client.cpp` (m_con) |
| requestAnimationFrame 게임 루프 | `client/game.cpp` (the_game()) |
| 서버 이벤트 분산 (26+ 핸들러) | `client/client.cpp` (handleCommand_*) |
| 설정 적용 | `src/defaultsettings.cpp` |
| 청크 요청 (2초 주기) | `client/clientmap.cpp` (requestMapBlock) |

### Renderer (Three.js 씬)
**역할**: 3D 렌더링, 카메라, 조명, 하늘, 후처리

| 책임 | Minetest 대응 |
|------|-------------|
| PerspectiveCamera + Scene | `client/camera.cpp` |
| 낮/밤 하늘 밝기 | `client/sky.cpp` |
| 구름 렌더링 | `client/clouds.cpp` |
| 그림자 (PCFSoft) | `client/shadows/` |
| 커브 다크니스, 용암 빛 효과 | `client/renderingengine.cpp` |
| 포인트 라이트 (플레이어 추적) | (웹 전용 추가) |

### WorldManager (청크 + 텍스처 아틀라스)
**역할**: 청크 메시 저장, 텍스처 아틀라스, 엔티티/플레이어 메시

| 책임 | Minetest 대응 |
|------|-------------|
| 청크 메시 저장/관리 | `client/clientmap.cpp` |
| 텍스처 아틀라스 생성 | `client/texturesource.cpp` |
| 청크 로딩 (서버 데이터 -> Three.js 메시) | `client/mapblock_mesh.cpp` |
| 원격 플레이어 메시 | `client/content_cao.cpp` (GenericCAO) |
| 아이템/몹 엔티티 메시 | `client/content_cao.cpp` |
| 청크 언로드 (거리 기반) | `client/clientmap.cpp` |

### ChunkMesh (메시 생성)
**역할**: 16x16x16 블록 데이터 -> Three.js 지오메트리

| 책임 | Minetest 대응 |
|------|-------------|
| 면 컬링 (Solid/Transparent 분리) | `client/mapblock_mesh.cpp` (makeFastFace) |
| 앰비언트 오클루전 | `client/mapblock_mesh.cpp` (smooth lighting) |
| UV 매핑 (텍스처 아틀라스) | `client/tile.cpp` (material) |
| 커스텀 블록 지오메트리 | `client/mapblock_mesh.cpp` (drawtype 처리) |
| 식물/불 애니메이션 | `client/mapblock_mesh.cpp` (waving) |

### PlayerController (1인칭 컨트롤)
**역할**: 카메라, 물리, 충돌, 레이캐스팅

| 책임 | Minetest 대응 |
|------|-------------|
| 포인터 락 + 마우스 회전 | `client/inputhandler.cpp` |
| WASD 이동, 점프, 스프린트 | `client/localplayer.cpp` |
| 클라이언트 사이드 물리/충돌 | `client/localplayer.cpp` (move) |
| 블록 레이캐스팅 (DDA) | `src/raycast.cpp` |
| 채굴 타이밍 | `client/game.cpp` (digging) |
| 비행 모드 | `client/localplayer.cpp` (fly) |

### UIManager (HUD + UI 패널)
**역할**: DOM 기반 HUD와 상호작용 UI

| 책임 | Minetest 대응 |
|------|-------------|
| 체력 바, 호흡 바, 배고픔 바 | `client/hud.cpp` (drawHud) |
| 핫바 (8슬롯) | `client/hud.cpp` (drawHotbar) |
| 채팅 오버레이 | `client/game.cpp` (chat) |
| 제작 UI | FormSpec (`size[]list[]button[]`) |
| 화로 UI | FormSpec (화로 전용) |
| 상자 UI | FormSpec (상자 전용) |
| 방어구 UI | FormSpec (방어구 전용) |
| death screen | `builtin/game/death_screen.lua` |
| 설정 패널 | `src/defaultsettings.cpp` (설정값들) |
| 미니맵 | `client/minimap.cpp` |

### Event Communication (DOM CustomEvent)
**역할**: PlayerController <-> UIManager 결합 분리

```
Minetest: 직접 함수 호출
  game.cpp -> game_formspec.cpp -> server request

웹 프로젝트: DOM CustomEvent 기반 분리
  PlayerController --dispatch--> document <--listen-- UIManager --invoke--> SignalR
```

## UI 포팅 전략

Minetest의 FormSpec (텍스트 기반 UI 정의)을 **하드코딩된 DOM 패널**로 대체:

| FormSpec 요소 | 웹 대응 |
|--------------|--------|
| `list[]` (인벤토리 슬롯) | HTML `<div>` grid + CSS |
| `button[]` | HTML `<button>` |
| `image[]` | HTML `<img>` |
| `label[]` | HTML `<span>` / `<div>` |
| `field[]` | HTML `<input>` |
| `dropdown[]` | HTML `<select>` |
| `scrollbar[]` | CSS overflow |
| `bgcolor[]`, `box[]` | CSS background/border |

## 사운드 포팅 전략

Minetest의 OpenAL 사운드를 **Web Audio API 절차적 사운드**로 대체:

| Minetest | 웹 프로젝트 |
|----------|-----------|
| OGG 사운드 파일 재생 | Web Audio API 절차적 생성 |
| 사운드 스펙 (gain, pitch, fade) | JavaScript 오실레이터 조합 |
| 3D 위치 사운드 | Web Audio PannerNode |

## 상세 구현 참조

| 주제 | 참조 문서 |
|------|---------|
| Minetest 클라이언트 클래스 계층 상세 | `web/docs/reference/client-architecture.md` |
| 청크 메시 생성 알고리즘 상세 | `web/docs/reference/client-architecture.md` (mapblock_mesh) |
| FormSpec GUI 시스템 상세 | `web/docs/reference/game-content.md` (FormSpec) |
| 렌더링 파이프라인 상세 | `web/docs/reference/client-architecture.md` (render) |
| 미니맵 구현 상세 | `web/docs/reference/client-architecture.md` (minimap) |
