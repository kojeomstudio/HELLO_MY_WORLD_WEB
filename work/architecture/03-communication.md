# 03 - 통신 프로토콜 (거시적 설계)

## 포팅 방향성

Minetest의 **UDP 커스텀 바이너리 프로토콜**을 **SignalR WebSocket JSON 프로토콜**로 재설계합니다.
바이너리 패킷 -> 직관적인 메서드 이름과 타입 안전한 파라미터.

## 프로토콜 비교

| 항목 | Minetest (원본) | 웹 프로젝트 (포팅) |
|------|----------------|-------------------|
| 전송 계층 | UDP (커스텀 RELIABLE/UNRELIABLE) | WebSocket (SignalR) |
| 메시지 형식 | 바이너리 (u8/u16/u32/f32/문자열) | JSON (직렬화) + byte[] (청크) |
| 명령 체계 | 2바이트 명령어 ID (TOCLIENT_*, TOSERVER_*) | 문자열 메서드명 (invoke/event) |
| 인증 | INIT 앞핸드쉐이크 (SRP/비밀번호) | Join(name) 허브 메서드 |
| 청크 전송 | TOCLIENT_BLOCKDATA (16KB 바이너리) | OnChunkReceived (byte[]) |
| 상태 동기화 | 개별 명령어 (각 TOCLIENT_*) | 이벤트 푸시 (OnHealthUpdate 등) |
| 압축 | zlib (MapBlock 전용) | 미사용 (SignalR 기본 직렬화) |
| 보안 | SRP 인증 | PBKDF2 해시 |

## 통신 토폴로지

```
[개발 환경]
Browser (:5173) --/game proxy--> Vite (:5173) --proxy--> Server (:5266)

[프로덕션]
Browser --> Reverse Proxy (nginx/Caddy) --> Server (:5266)
```

## 명령어 매핑 (거시적)

### 클라이언트 -> 서버

| Minetest 명령어 | SignalR Hub 메서드 | 설명 |
|----------------|-------------------|------|
| `TOSERVER_INIT` | `Join(name)` | 접속 + 인증 |
| `TOSERVER_PLAYERPOS` | `UpdatePosition(x,y,z,vx,vy,vz,yaw,pitch)` | 위치 동기화 |
| `TOSERVER_DIG` / `TOSERVER_INTERACT` | `DigBlock(x,y,z)` | 블록 채굴 완료 |
| (없음, 클라이언트 로컬) | `DigBlockStart(x,y,z)` -> float | 채굴 시간 조회 |
| `TOSERVER_PLACE` | `PlaceBlock(x,y,z,blockType)` | 블록 설치 |
| `TOSERVER_INTERACT` (right-click) | `InteractWithBlock(x,y,z)` | 블록 상호작용 |
| `TOSERVER_INVENTORY_ACTION` | `CraftRecipe(idx)`, `MoveItemToChest(...)` 등 | 인벤토리 액션 |
| `TOSERVER_CHAT_MESSAGE` | `SendChat(message)` | 채팅/명령 |
| `TOSERVER_REQUEST_MEDIA` | `OnBlockDefinitions` (서버 푸시) | 블록 정의 요청 |
| `TOSERVER_RESPAWN` | `Respawn()` | 리스폰 |

### 서버 -> 클라이언트

| Minetest 명령어 | SignalR 이벤트 | 설명 |
|----------------|---------------|------|
| `TOCLIENT_INIT` (초기 데이터) | `OnBlockDefinitions`, `OnInventoryUpdate`, `OnTimeUpdate` 등 | 초기 상태 |
| `TOCLIENT_BLOCKDATA` | `OnChunkReceived(cx,cy,cz,byte[])` | 청크 데이터 (16KB) |
| `TOCLIENT_ADDNODE` | `OnBlockUpdate(x,y,z,blockData)` | 블록 변경 |
| `TOCLIENT_PLAY_SOUND` | (Web Audio API, 클라이언트 자체 처리) | 사운드 |
| `TOCLIENT_MOVEMENT` | `OnPositionCorrection(x,y,z,yaw,pitch)` | 위치 보정 |
| `TOCLIENT_HP` | `OnHealthUpdate(health,maxHealth)` | 체력 |
| `TOCLIENT_BREATH` | `OnBreathUpdate(breath,maxBreath)` | 호흡 |
| `TOCLIENT_CHAT_MESSAGE` | `OnChatMessage(sender,message)` | 채팅 |
| `TOCLIENT_ACTIVE_OBJECT` | `OnEntitySpawned/Update/Despawned` | 엔티티 |
| `TOCLIENT_PLAYERINFO` | `OnPlayerJoined/Left/PositionUpdate` | 플레이어 |
| `TOCLIENT_DEATHSCREEN` | `OnDeath(message)` | 사망 |
| `TOCLIENT_ACCESS_DENIED` | (SendChat으로 에러 메시지) | 권한 거부 |
| `TOCLIENT_INVENTORY` | `OnInventoryUpdate(items)` | 인벤토리 |

## 새로 설계된 통신 기능

Minetest에 없고 웹 프로젝트에서 새로 추가된 기능:

| Hub 메서드/이벤트 | 설명 |
|-----------------|------|
| `DigBlockStart(x,y,z) -> float` | 채굴 시간 서버 조회 (원본은 클라이언트 로컬 계산) |
| `UseItem(slotIndex)` | 아이템 사용 (음식/양동이) - 명시적 분리 |
| `EquipArmor/UnequipArmor` | 방어구 장착/해제 - 별도 명령어 |
| `OnFoodUpdate(foodLevel,maxFood)` | 배고픔 상태 브로드캐스트 |
| `OnExperienceUpdate(level,totalExp)` | 경험치 브로드캐스트 |
| `OnFallingBlock(from,to,type)` | 낙하 블록 애니메이션 |
| `OnArmorUpdate(items)` | 방어구 상태 브로드캐스트 |

## 속도 제한 설계

```
원본 (Minetest): anticheat_movement_tolerance, chat_message_limit_per_10sec
웹 프로젝트:     Dictionary<string, DateTime> (connectionId:action)
```

| 액션 | 제한 | 설명 |
|------|------|------|
| 위치 전송 | 50ms | 클라이언트 쓰로틀 |
| 채팅 | 500ms | 도배 방지 |
| 채굴/설치 | 250ms | 블록 스팸 방지 |
| 펀치 | 250ms | 전투 스팸 방지 |

## 상세 구현 참조

| 주제 | 참조 문서 |
|------|---------|
| UDP 패킷 포맷, 명령어 ID | `web/docs/reference/network-protocol.md` |
| 앞핸드쉐이크, 인증 흐름 | `web/docs/reference/network-protocol.md` |
| 직렬화/역직렬화 방식 | `web/docs/reference/network-protocol.md` |
