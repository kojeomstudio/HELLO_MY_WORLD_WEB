# Network Protocol Reference

> Luanti (Minetest) 네트워크 프로토콜 전체 사양

## 1. 전송 계층

### 1.1 기본 프로토콜

모든 통신은 **UDP** 기반입니다.

### 1.2 베이스 헤더 (7바이트, 모든 패킷)

```
Offset  Size  Field
0       u32   protocol_id     (항상 0x4f457403)
4       u16   sender_peer_id  (0 = 새 연결, 1 = 서버)
6       u8    channel         (0, 1, 또는 2)
```

### 1.3 채널 구성

**서버 → 클라이언트 채널:**

| 채널 | 용도 |
|------|------|
| 0 | 일반 (인증, HUD, 채팅, 엔티티, 시간, 파티클 등) |
| 1 | HUD 전용 (HUDADD, HUDRM, HUDCHANGE, HUD_SET_FLAGS, HUD_SET_PARAM) |
| 2 | 대량 데이터 (BLOCKDATA, MEDIA) |

**클라이언트 → 서버 채널:**

| 채널 | 용도 |
|------|------|
| 0 | 일반 (위치, 인벤토리, 채팅, 상호작용, 피해) |
| 1 | 초기화/인증 (INIT, INIT2, FIRST_SRP, SRP_BYTES_A/M, REQUEST_MEDIA, CLIENT_READY) |
| 2 | 알림 (GOTBLOCKS, DELETEDBLOCKS, REMOVED_SOUNDS, HAVE_MEDIA, UPDATE_CLIENT_INFO) |

### 1.4 패킷 타입 (와이어 레벨)

| 값 | 이름 | 헤더 크기 | 설명 |
|----|------|-----------|------|
| 0 | PACKET_TYPE_CONTROL | 2바이트 | 제어 (ACK, SET_PEER_ID, PING, DISCO) |
| 1 | PACKET_TYPE_ORIGINAL | 1바이트 | 신뢰성 없는 직접 전달 |
| 2 | PACKET_TYPE_SPLIT | 7바이트 | 대용량 분할 |
| 3 | PACKET_TYPE_RELIABLE | 3바이트 | 신뢰성 래퍼 |

### 1.5 신뢰성 계층

- 신뢰성 패킷: `PACKET_TYPE_RELIABLE` + 시퀀스 번호 (u16)
- 시퀀스: `SEQNUM_INITIAL=65500` 부터, `SEQNUM_MAX=65535` 에서 랩
- ACK: `CONTROLTYPE_ACK` 으로 확인 응답
- 윈도우: 시작 64, 최대 2048

### 1.6 분할

- MTU 초과 시 (512바이트) 자동 분할
- `PACKET_TYPE_SPLIT`: seqnum + chunk_count + chunk_num

## 2. 직렬화 포맷 (NetworkPacket)

| 타입 | 와이어 크기 | 인코딩 |
|------|------------|--------|
| `u8` | 1바이트 | Raw |
| `u16` | 2바이트 | 빅엔디안 |
| `u32` | 4바이트 | 빅엔디안 |
| `u64` | 8바이트 | 빅엔디안 |
| `s16/s32` | 2/4바이트 | 빅엔디안 2의 보수 |
| `float` | 4바이트 | IEEE 754 빅엔디안 |
| `v3f` | 12바이트 | f32 × 3 |
| `v3s16` | 6바이트 | s16 × 3 |
| `v3s32` | 12바이트 | s32 × 3 |
| `bool` | 1바이트 | 0 또는 1 |
| `string` | 2+N바이트 | u16 길이 + 바이트 |
| `wstring` | 2+N×2바이트 | u16 문자수 + u16 per char |
| 긴 문자열 | 4+N바이트 | u32 길이 + 바이트 |
| `f1000` | 4바이트 | f32로 직렬화 |

## 3. 인증 핸드셰이크

### 3.1 신규 사용자 등록

```
Client                              Server
  │── TOSERVER_INIT (0x02) ────────>│  ser_ver, min/max_proto, player_name
  │                                  │  (사용자 없음 → FIRST_SRP 비트 설정)
  │<── TOCLIENT_HELLO (0x02) ───────│  proto_ver, auth_mechs
  │                                  │
  │── TOSERVER_FIRST_SRP (0x50) ───>│  salt, verification_key, is_empty
  │                                  │  (인증 엔트리 생성)
  │<── TOCLIENT_AUTH_ACCEPT (0x03) ─│  map_seed, send_interval
  │                                  │
  │── TOSERVER_INIT2 (0x11) ───────>│  lang_code
  │                                  │
  │<── (콘텐츠 데이터 전송 시작) ──│
```

### 3.2 기존 사용자 SRP 로그인

```
Client                              Server
  │── TOSERVER_INIT (0x02) ────────>│
  │<── TOCLIENT_HELLO (0x02) ───────│  auth_mechs (SRP or LEGACY)
  │                                  │
  │── TOSERVER_SRP_BYTES_A (0x51) ─>│  bytes_A, based_on
  │<── TOCLIENT_SRP_BYTES_S_B ──────│  bytes_s(salt), bytes_B
  │                                  │
  │── TOSERVER_SRP_BYTES_M (0x52) ─>│  bytes_M (SRP 증명)
  │                                  │  (검증 성공 시)
  │<── TOCLIENT_AUTH_ACCEPT (0x03) ─│  map_seed, send_interval
  │                                  │
  │── TOSERVER_INIT2 (0x11) ───────>│
  │<── (콘텐츠 데이터 전송 시작) ──│
```

### 3.3 접속 거부 사유

| 코드 | 상수 | 의미 |
|------|------|------|
| 0 | WRONG_PASSWORD | 잘못된 비밀번호 |
| 1 | UNEXPECTED_DATA | 프로토콜 위반 |
| 2 | SINGLEPLAYER | 싱글플레이어 전용 |
| 3 | WRONG_VERSION | 버전 불일치 |
| 4 | WRONG_CHARS_IN_NAME | 이름에 잘못된 문자 |
| 5 | WRONG_NAME | 이름 허용 불가 |
| 6 | TOO_MANY_USERS | 사용자 수 초과 |
| 7 | EMPTY_PASSWORD | 빈 비밀번호 불가 |
| 8 | ALREADY_CONNECTED | 이미 접속 중 |
| 9 | SERVER_FAIL | 서버 내부 오류 |
| 10 | CUSTOM_STRING | 커스텀 사유 (Lua) |
| 11 | SHUTDOWN | 서버 종료 중 |
| 12 | CRASH | 서버 크래시 |

## 4. 서버 → 클라이언트 메시지 (ToClientCommand)

| 코드 | 이름 | 채널 | 파라미터 |
|------|------|------|----------|
| 0x02 | TOCLIENT_HELLO | 0 | ser_ver, proto_ver, auth_mechs |
| 0x03 | TOCLIENT_AUTH_ACCEPT | 0 | map_seed, send_interval, sudo_auth_methods |
| 0x0A | TOCLIENT_ACCESS_DENIED | 0 | reason, custom_reason, reconnect |
| 0x20 | TOCLIENT_BLOCKDATA | 2 | v3s16 position, serialized MapBlock |
| 0x21 | TOCLIENT_ADDNODE | 0 | v3s16 position, MapNode, keep_metadata |
| 0x22 | TOCLIENT_REMOVENODE | 0 | v3s16 position |
| 0x27 | TOCLIENT_INVENTORY | 0 | serialized inventory |
| 0x29 | TOCLIENT_TIME_OF_DAY | 0 | u16 time(0-23999), f1000 time_speed |
| 0x2F | TOCLIENT_CHAT_MESSAGE | 0 | version, type, sender, wstring message, u64 timestamp |
| 0x31 | TOCLIENT_ACTIVE_OBJECT_REMOVE_ADD | 0 | removed[], added[{id, type, init_data}] |
| 0x32 | TOCLIENT_ACTIVE_OBJECT_MESSAGES | 0 | {u16 id, string message}[] |
| 0x33 | TOCLIENT_HP | 0 | u16 hp, bool damage_effect |
| 0x34 | TOCLIENT_MOVE_PLAYER | 0 | v3f position, f1000 pitch, f1000 yaw |
| 0x36 | TOCLIENT_FOV | 0 | f32 fov, bool is_multiplier, f32 transition_time |
| 0x38 | TOCLIENT_MEDIA | 2 | bunches, index, files[{name, zstd_data}] |
| 0x3A | TOCLIENT_NODEDEF | 0 | compressed node definitions |
| 0x3C | TOCLIENT_ANNOUNCE_MEDIA | 0 | filenames + sha1 hashes |
| 0x3D | TOCLIENT_ITEMDEF | 0 | compressed item definitions |
| 0x3F | TOCLIENT_PLAY_SOUND | 0 | id, name, gain, type, pos, object_id, loop, fade, pitch |
| 0x40 | TOCLIENT_STOP_SOUND | 0 | sound_id |
| 0x41 | TOCLIENT_PRIVILEGES | 0 | count, {privilege}[] |
| 0x42 | TOCLIENT_INVENTORY_FORMSPEC | 0 | formspec string |
| 0x43 | TOCLIENT_DETACHED_INVENTORY | 0 | name, keep_inv, serialized inventory |
| 0x44 | TOCLIENT_SHOW_FORMSPEC | 0 | formspec, formname |
| 0x45 | TOCLIENT_MOVEMENT | 0 | 12× f1000 physics params |
| 0x46 | TOCLIENT_SPAWN_PARTICLE | 0 | ParticleParameters |
| 0x47 | TOCLIENT_ADD_PARTICLESPAWNER | 0 | ParticleSpawnerParameters |
| 0x49 | TOCLIENT_HUDADD | 1 | id, type, pos, name, scale, text, number, item, dir, align, offset, world_pos, size, z_index, text2, style |
| 0x4A | TOCLIENT_HUDRM | 1 | id |
| 0x4B | TOCLIENT_HUDCHANGE | 1 | id, stat, data |
| 0x4C | TOCLIENT_HUD_SET_FLAGS | 1 | flags, mask |
| 0x4D | TOCLIENT_HUD_SET_PARAM | 1 | param, value |
| 0x4E | TOCLIENT_BREATH | 0 | u16 breath |
| 0x4F | TOCLIENT_SET_SKY | 0 | SkyboxParams |
| 0x50 | TOCLIENT_OVERRIDE_DAY_NIGHT_RATIO | 0 | do_override, ratio(0-65535) |
| 0x53 | TOCLIENT_DELETE_PARTICLESPAWNER | 0 | id |
| 0x54 | TOCLIENT_CLOUD_PARAMS | 0 | density, colors, height, thickness, speed |
| 0x56 | TOCLIENT_UPDATE_PLAYER_LIST | 0 | type, count, names[] |
| 0x57 | TOCLIENT_MODCHANNEL_MSG | 0 | channel, sender, message |
| 0x60 | TOCLIENT_SRP_BYTES_S_B | 0 | bytes_s, bytes_B |
| 0x62 | TOCLIENT_MINIMAP_MODES | 0 | modes[] |
| 0x63 | TOCLIENT_SET_LIGHTING | 0 | shadow, saturation, exposure, bloom |

## 5. 클라이언트 → 서버 메시지 (ToServerCommand)

| 코드 | 이름 | 채널 | 신뢰성 | 파라미터 |
|------|------|------|--------|----------|
| 0x02 | TOSERVER_INIT | 1 | No | ser_ver, min/max_proto, player_name |
| 0x11 | TOSERVER_INIT2 | 1 | Yes | lang_code |
| 0x17 | TOSERVER_MODCHANNEL_JOIN | 0 | Yes | channel_name |
| 0x18 | TOSERVER_MODCHANNEL_LEAVE | 0 | Yes | channel_name |
| 0x19 | TOSERVER_MODCHANNEL_MSG | 0 | Yes | channel, message |
| 0x23 | TOSERVER_PLAYERPOS | 0 | **No** | v3s32 pos×100, v3s32 speed×100, s32 pitch×100, s32 yaw×100, u32 keyPressed, u8 fov×80, u8 wanted_range |
| 0x24 | TOSERVER_GOTBLOCKS | 2 | Yes | count, {v3s16 pos}[] |
| 0x25 | TOSERVER_DELETEDBLOCKS | 2 | Yes | count, {v3s16 pos}[] |
| 0x31 | TOSERVER_INVENTORY_ACTION | 0 | Yes | serialized InventoryAction |
| 0x32 | TOSERVER_CHAT_MESSAGE | 0 | Yes | wstring message |
| 0x35 | TOSERVER_DAMAGE | 0 | Yes | u16 amount |
| 0x37 | TOSERVER_PLAYERITEM | 0 | Yes | u16 item_index |
| 0x39 | TOSERVER_INTERACT | 0 | Yes | u8 action, u16 item, PointedThing, player_pos |
| 0x3A | TOSERVER_REMOVED_SOUNDS | 2 | Yes | count, {s32 id}[] |
| 0x3B | TOSERVER_NODEMETA_FIELDS | 0 | Yes | v3s16 pos, formname, fields[] |
| 0x3C | TOSERVER_INVENTORY_FIELDS | 0 | Yes | formname, fields[] |
| 0x40 | TOSERVER_REQUEST_MEDIA | 1 | Yes | count, {name}[] |
| 0x43 | TOSERVER_CLIENT_READY | 1 | Yes | version, full_version_string |
| 0x50 | TOSERVER_FIRST_SRP | 1 | Yes | salt, verification_key, is_empty |
| 0x51 | TOSERVER_SRP_BYTES_A | 1 | Yes | bytes_A, based_on |
| 0x52 | TOSERVER_SRP_BYTES_M | 1 | Yes | bytes_M |

## 6. 상호작용 프로토콜 (TOSERVER_INTERACT)

| 액션 값 | 이름 | 설명 |
|---------|------|------|
| 0 | INTERACT_START_DIGGING | 블록 파기 시작 / 엔티티 펀치 |
| 1 | INTERACT_STOP_DIGGING | 파기 중지 |
| 2 | INTERACT_DIGGING_COMPLETED | 파기 완료 |
| 3 | INTERACT_PLACE | 블록 배치 / 엔티티 우클릭 |
| 4 | INTERACT_USE | 아이템 사용 (음식 섭취 등) |
| 5 | INTERACT_ACTIVATE | 공중 우클릭 |

서버 검증: `interact` 권한, 거리 검증(안티치트), 사망 상태, 파기 시간 검증

## 7. 블록 데이터 전송

```
Server                          Client
  │── BLOCKDATA (0x20) ───────>│  v3s16 pos + MapBlock (zlib 압축)
  │                             │  (역직렬화, 메시 업데이트)
  │<── GOTBLOCKS (0x24) ───────│  u8 count, {v3s16 pos}[N]
  │                             │
  │  (클라이언트 이동 시 새 블록 요구)
  │── BLOCKDATA (0x20) ───────>│
```

## 8. 엔티티 업데이트 프로토콜

### 8.1 TOCLIENT_ACTIVE_OBJECT_REMOVE_ADD

```
u16 removed_count, {u16 id}[N]
u16 added_count, {u16 id, u8 type, string init_data}[M]
```

### 8.2 TOCLIENT_ACTIVE_OBJECT_MESSAGES

```
{u16 id, u16 msg_len, string message}[]  (스트림)
```

각 엔티티 타입이 자체 메시지 형식을 해석합니다 (위치, 애니메이션, 부착 등).

## 9. 인벤토리 프로토콜

| 액션 타입 | 설명 |
|-----------|------|
| `IMoveAction` | 슬롯 간 아이템 이동 |
| `IDropAction` | 아이템 드롭 |
| `ICraftAction` | 아이템 제작 |

서버는 권한 검증 후 적용 → `TOCLIENT_INVENTORY` 로 전체 동기화

## 10. 채팅 프로토콜

**클라이언트 → 서버**: `TOSERVER_CHAT_MESSAGE` (wstring)

**서버 → 클라이언트**: `TOCLIENT_CHAT_MESSAGE`
```
u8 version (1)
u8 message_type (0=raw, 1=normal, 2=system, 3=announcement)
string sender
wstring message
u64 timestamp
```

## 11. 시간 동기화

**TOCLIENT_TIME_OF_DAY**: `u16 time (0-23999), f1000 time_speed`

- 0 = 자정, 12000 = 정오, 23999 = 자정 직전
- time_speed 기본 72 (현실 1분 = 게임 1시간)

## 12. 미디어 전송

```
1. 서버: TOCLIENT_ANNOUNCE_MEDIA → 파일명 + SHA1 해시
2. 클라이언트: 로컬 캐시 비교
3. 클라이언트: TOSERVER_REQUEST_MEDIA → 누락 파일 요청
4. 서버: TOCLIENT_MEDIA → 분할 전송 (zstd 압축)
5. 런타임: TOCLIENT_MEDIA_PUSH → 동적 미디어 푸시
```

## 13. 와이어 레벨 패킷 구조 예시

TOCLIENT_BLOCKDATA의 완전한 패킷:

```
[베이스 헤더 - 7바이트]
  u32  0x4f457403          PROTOCOL_ID
  u16  1                   서버 peer_id
  u8   2                   채널 2

[신뢰성 헤더 - 3바이트]
  u8   3                   PACKET_TYPE_RELIABLE
  u16  N                   시퀀스 번호

[분할 헤더 - 7바이트] (512바이트 초과 시)
  u8   2                   PACKET_TYPE_SPLIT
  u16  M                   분할 시퀀스
  u16  chunk_count         전체 프래그먼트 수
  u16  chunk_num           현재 프래그먼트 인덱스

[오리지널 헤더 - 1바이트]
  u8   1                   PACKET_TYPE_ORIGINAL

[명령 + 페이로드]
  u16  0x0020              TOCLIENT_BLOCKDATA
  v3s16 block_position     (6바이트)
  ... MapBlock 데이터 ...
```

## 14. 주요 상수

| 상수 | 값 | 용도 |
|------|-----|------|
| `PROTOCOL_ID` | 0x4f457403 | 매직 넘버 |
| `PEER_ID_SERVER` | 1 | 서버 피어 ID |
| `CHANNEL_COUNT` | 3 | 채널 수 |
| `BASE_HEADER_SIZE` | 7 | 베이스 헤더 크기 |
| `SEQNUM_INITIAL` | 65500 | 시작 시퀀스 |
| `SEQNUM_MAX` | 65535 | 최대 시퀀스 |
| `MAX_RELIABLE_WINDOW_SIZE` | 0x8000 | 최대 수신 윈도우 |
| `MEDIAFILE_MAX_SIZE` | 16700000 | 최대 미디어 파일 크기 |
| `MAX_PACKET_SIZE` | 512 | 단일 UDP 페이로드 최대 |
| `SERVER_PROTOCOL_VERSION_MIN` | 37 | 최소 프로토콜 버전 |
