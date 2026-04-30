# 08 - 에이전트 구현 가이드

## 에이전트가 작업을 진행하는 순서

```
1. work/work_content.md 읽기          # 페르소나, 룰, 태스크 확인
2. AGENTS.md 읽기                      # 코딩 컨벤션 확인
3. work/architecture/00-overview.md   # 거시적 구조 파악
4. work/architecture/ 01~07           # 해당 시스템 설계 참조
5. web/docs/reference/                # 미시적 구현 세부 참조 (필요시)
6. 구현 -> 테스트 -> 커밋
```

## 빌드 & 실행

```bash
# 서버
dotnet build web/server/WebGameServer.csproj
dotnet run --project web/server/WebGameServer.csproj   # :5266

# 클라이언트
npm install --prefix web/client
npm run dev --prefix web/client                         # :5173

# 타입 체크
npx tsc --noEmit --project web/client/tsconfig.json
```

## 새 기능 추가 체크리스트

### 새 블록 추가
- [ ] `web/data/blocks.json`에 정의 추가 (name, solid, groups, drawType 등)
- [ ] 필요시 `web/data/items.json`에 도구/아이템 정의
- [ ] 필요시 `web/data/items.json`에 제작 레시피 추가
- [ ] 텍스처: `web/client/public/textures/blocks/`에 PNG 추가
- [ ] 텍스처 아틀라스: `WorldManager.ts` TEXTURE_NAMES 배열에 추가
- [ ] 커스텀 지오메트리(비큐브): `ChunkMesh.ts` buildMesh()에 케이스 추가
- [ ] 서버 재빌드 후 테스트

### 새 아이템 추가
- [ ] `web/data/items.json`에 아이템 정의 추가
- [ ] 제작이 필요하면 레시피 추가
- [ ] 음식이면 `nutrition` 설정, `GameHub.UseItem()` 확인
- [ ] 도구면 `durability`, `damage`, `miningSpeed` 설정

### 새 명령어 추가
- [ ] `ChatCommandManager.cs`에 핸들러 메서드 추가
- [ ] 생성자에서 명령어 이름과 핸들러 매핑
- [ ] 필요시 권한 체크 추가
- [ ] 클라이언트 변경 불필요 (SendChat("/command")로 전송)

### 새 몹 추가
- [ ] `web/data/mobs.json`에 정의 추가
- [ ] 스폰 규칙(minY, maxY, weight) 설정
- [ ] 클라이언트 렌더링은 기본 엔티티 메시 자동 처리

### 새 바이옴 추가
- [ ] `web/data/biomes.json`에 정의 추가
- [ ] 표면 블록이 blocks.json에 존재해야 함
- [ ] 코드 변경 불필요 (NoiseWorldGenerator가 JSON을 읽음)

## 주요 파일 위치 (빠른 참조)

| 작업 | 서버 파일 | 클라이언트 파일 |
|------|---------|--------------|
| 블록 정의 | `web/data/blocks.json` | `src/world/BlockRegistry.ts` |
| 아이템/레시피 | `web/data/items.json` | `src/world/ItemRegistry.ts` |
| 서버 설정 | `web/data/server_config.json` | - |
| 허브 메서드 | `server/Services/GameHub.cs` | - |
| 게임 로직 | `server/Core/GameServer.cs` | - |
| 월드 생성 | `server/Core/World/Generators/` | - |
| 렌더링 | - | `src/rendering/Renderer.ts` |
| 청크 메시 | - | `src/world/ChunkMesh.ts` |
| 플레이어 | `server/Core/Player/Player.cs` | `src/player/PlayerController.ts` |
| UI | - | `src/ui/UIManager.ts` |
| 입력 | - | `src/input/InputManager.ts` |
| 사운드 | - | `src/audio/AudioManager.ts` |

## 코딩 컨벤션 요약

### TypeScript (클라이언트)
- 4공백 들여쓰기, 세미콜론, 작은따옴표
- strict 모드 (`noUnusedLocals`, `noUnusedParameters`)
- `import * as THREE from 'three'` (서드파티), `import { X } from './X'` (로컬)
- 클래스 PascalCase, 메서드 camelCase, 상수 SCREAMING_SNAKE_CASE
- `interface` 사용, `type` 별칭 금지
- 네임드 익스포트만 (default 금지)

### C# (서버)
- 4공백, Allman 중괄호
- 파일 범위 네임스페이스 (`namespace X;`)
- `readonly struct` (값 타입), `record` (DTO)
- `private readonly` 필드, PascalCase 메서드/속성
- 생성자 주입, 모든 서비스 Singleton
- Guard clause 패턴, switch expression

## 문서 참조 경로

```
work/
  work_content.md                    # 엔트리 포인트 (최우선 참조)
  architecture/
    00-overview.md                   # 프로젝트 거시적 구조
    01-server-core.md                # 서버 구성 설계
    02-client-core.md                # 클라이언트 구성 설계
    03-communication.md              # 통신 프로토콜 설계
    04-world-system.md               # 월드 시스템 설계
    05-gameplay.md                   # 게임플레이 설계
    06-data-models.md                # 데이터 모델 설계
    07-security.md                   # 보안 설계
    08-implementation-guide.md       # 이 문서

web/docs/reference/                  # 서브모듈 미시적 분석 (필요시 참조)
  client-architecture.md            # Minetest 클라이언트 소스 분석
  server-architecture.md            # Minetest 서버 소스 분석
  network-protocol.md               # Minetest 네트워크 프로토콜 분석
  world-map-system.md               # Minetest 월드/맵 시스템 분석
  mapgen-system.md                  # Minetest 맵 생성 분석
  game-content.md                   # Minetest 콘텐츠/데이터 분석
  scripting-modding.md              # Minetest Lua 스크립팅 분석
```
