# Client Architecture Reference

> Luanti (Minetest) 엔진 클라이언트 아키텍처 상세 분석 문서

## 1. 개요

클라이언트는 IrrlichtMT (OpenGL) 렌더링 엔진 기반으로 3D 복셀 월드를 렌더링하고, 서버와 UDP 프로토콜로 통신하며 게임 상태를 동기화합니다.

## 2. 클래스 계층 구조

```
Client
 ├── ClientEnvironment
 │    ├── ClientActiveObject (abstract)
 │    │    ├── GenericCAO          - 범용 클라이언트 오브젝트
 │    │    └── (기타 CAO)
 │    └── ActiveObjectMgr
 ├── LocalPlayer                    - 로컬 플레이어
 ├── Camera                         - 카메라 시스템
 ├── Sky                            - 하늘 렌더링
 ├── Clouds                         - 구름 렌더링
 ├── Minimap                        - 미니맵
 ├── GameUI                         - 게임 UI
 ├── InputHandler                   - 입력 처리
 │    └── JoystickController        - 게임패드
 ├── MeshUpdateQueue                - 비동기 메시 생성
 │    └── MeshUpdateWorker[N]
 ├── ClientMap                      - 맵 렌더링
 ├── RenderingPipeline              - 렌더링 파이프라인
 │    └── ShadowRenderer            - 동적 그림자
 ├── ShaderManager                  - 셰이더 관리
 ├── SoundManager                   - 사운드 시스템
 └── ParticleManager                - 파티클 시스템
```

## 3. Client 클래스 (`src/client/client.h`)

### 3.1 핵심 멤버

| 변수 | 타입 | 설명 |
|------|------|------|
| `m_env` | `ClientEnvironment*` | 클라이언트 환경 |
| `m_localplayer` | `LocalPlayer*` | 로컬 플레이어 |
| `m_camera` | `Camera*` | 카메라 |
| `m_minimap` | `Minimap*` | 미니맵 |
| `m_game_ui` | `GameUI*` | 게임 UI |
| `m_particle_manager` | `ParticleManager` | 파티클 관리 |
| `m_con` | `con::IConnection*` | 네트워크 연결 |
| `m_media_downloader` | `MediaDownloader*` | 미디어 다운로더 |
| `m_nodedef` | `NodeDefManager*` | 노드 정의 |
| `m_itemdef` | `IItemDefManager*` | 아이템 정의 |
| `m_mesh_update_thread` | `MeshUpdateQueue*` | 메시 업데이트 큐 |
| `m_state` | `ClientState` | 연결 상태 |

### 3.2 클라이언트 상태

| 상태 | 설명 |
|------|------|
| `CS_Created` | 생성됨 |
| `CS_Connecting` | 연결 중 |
| `CS_Connected` | 연결됨 (인증 진행 중) |
| `CS_Init` | 초기화 중 (미디어/정의 로딩) |
| `CS_Game` | 게임 중 |

### 3.3 클라이언트 step() 흐름

```
Client::step(dtime):
  1. 네트워크 패킷 수신 및 처리 (handleCommand_*)
  2. 연결 상태 관리
  3. 환경 업데이트
     ├── 플레이어 물리/이동
     ├── 엔티티 위치 보간
     └── 파티클 업데이트
  4. 메시 업데이트 처리
  5. 위치를 서버에 전송 (TOSERVER_PLAYERPOS)
```

### 3.4 서버→클라이언트 메시지 처리

| 메시지 | 처리 메서드 | 동작 |
|--------|------------|------|
| `TOCLIENT_HELLO` | `handleCommand_Hello` | 인증 메커니즘 수신 |
| `TOCLIENT_AUTH_ACCEPT` | `handleCommand_AuthAccept` | 인증 승인, 맵 시드 수신 |
| `TOCLIENT_BLOCKDATA` | `handleCommand_BlockData` | 블록 데이터 역직렬화 |
| `TOCLIENT_INVENTORY` | `handleCommand_Inventory` | 인벤토리 동기화 |
| `TOCLIENT_TIME_OF_DAY` | `handleCommand_TimeOfDay` | 시간 동기화 |
| `TOCLIENT_CHAT_MESSAGE` | `handleCommand_ChatMessage` | 채팅 표시 |
| `TOCLIENT_NODEDEF` | `handleCommand_NodeDef` | 노드 정의 수신 |
| `TOCLIENT_ITEMDEF` | `handleCommand_ItemDef` | 아이템 정의 수신 |
| `TOCLIENT_HP` | `handleCommand_HP` | 체력 업데이트 |
| `TOCLIENT_ACTIVE_OBJECT_REMOVE_ADD` | `handleCommand_ActiveObjectRemoveAdd` | 엔티티 추가/제거 |
| `TOCLIENT_ACTIVE_OBJECT_MESSAGES` | `handleCommand_ActiveObjectMessages` | 엔티티 상태 업데이트 |
| `TOCLIENT_MEDIA` | `handleCommand_Media` | 미디어 파일 수신 |
| `TOCLIENT_PLAY_SOUND` | `handleCommand_PlaySound` | 사운드 재생 |
| `TOCLIENT_HUDADD/HUDRM/HUDCHANGE` | `handleCommand_Hud*` | HUD 요소 관리 |
| `TOCLIENT_SPAWN_PARTICLE` | `handleCommand_SpawnParticle` | 파티클 생성 |
| `TOCLIENT_MOVEMENT` | `handleCommand_Movement` | 물리 파라미터 설정 |
| `TOCLIENT_MOVE_PLAYER` | `handleCommand_MovePlayer` | 강제 플레이어 이동 |

## 4. LocalPlayer (`src/client/localplayer.h`)

### 4.1 핵심 멤버

| 멤버 | 타입 | 설명 |
|------|------|------|
| `m_position` | `v3f` | 현재 위치 |
| `m_speed` | `v3f` | 현재 속도 |
| `m_pitch` | `float` | 상하 회전 |
| `m_yaw` | `float` | 좌우 회전 |
| `m_keyPressed` | `u64` | 눌린 키 비트마스크 |
| `m_sneak_node` | `v3s16` | 웅크린 상태의 블록 |
| `m_old_node_below` | `std::pair<v3s16, bool>` | 이전 발 아래 블록 |
| `m_can_jump` | `bool` | 점프 가능 여부 |
| `m_is_climbing` | `bool` | 오르기 중 |
| `m_in_liquid` | `bool` | 액체 안에 있음 |
| `m_in_liquid_stable` | `bool` | 안정적 부유 |
| `m_swimming_vertical` | `bool` | 수직 수영 |
| `m_touching_ground` | `bool` | 지면 접촉 |
| `m_free_falling` | `bool` | 자유 낙하 |

### 4.2 물리 엔진

```
LocalPlayer::move(dtime, environment, pos_max_d, box_0, stepheight):
  1. 이동 의도 계산 (키 입력 → 가속도)
     ├── 걷기: speed_walk (기본 4.0)
     ├── 웅크리기: speed_crouch (기본 1.35)
     ├── 점프: speed_jump (기본 6.5)
     ├── 오르기: speed_climb (기본 3.0)
     └── 액체: liquid_fluidity (기본 1.0)
  
  2. 가속도 적용
     ├── 중력: movement_gravity (기본 9.81)
     ├── 공기 저항: movement_acceleration_air (기본 2.0)
     └── 지면: movement_acceleration_default (기본 3.0)
  
  3. 충돌 감지 (collisionMoveSimple)
  4. 최종 위치/속도 업데이트
  5. 서버에 위치 전송
```

## 5. 카메라 시스템 (`src/client/camera.h`)

### 5.1 카메라 모드

| 모드 | 설명 |
|------|------|
| `CAMERA_MODE_FIRST` | 1인칭 |
| `CAMERA_MODE_THIRD` | 3인칭 후방 |
| `CAMERA_MODE_THIRD_FRONT` | 3인칭 전방 |

### 5.2 카메라 FOV

```
기본 FOV: 72도
scopezoom: 1/8 FOV (스나이퍼 줌)
서버 오버라이드: TOCLIENT_FOV 메시지
```

### 5.3 카메라 업데이트 흐름

```
Camera::step(dtime):
  1. 플레이어 위치에서 카메라 위치 계산
  2. 1인칭: 눈 오프셋 적용 (eye_offset_first)
  3. 3인칭: 뒤로 이동, 충돌 감지로 벽 통과 방지
  4. pitch/yaw 회전 적용
  5. 카메라 흔들림 (걷기/달리기)
  6. FOV 업데이트
```

## 6. 렌더링 파이프라인 (`src/client/rendering/core.h`)

### 6.1 렌더링 단계

```
RenderingPipeline:
  1. Shadow Map (선택적)
     ├── Pass 1: 빛 시점에서 깊이 렌더링 (불투명)
     ├── Pass 1 Trans: 반투명 오브젝트
     └── Pass 2: 추가 그림자 패스
  
  2. 3D Scene
     ├── Sky rendering (하늘)
     ├── Clouds (구름)
     ├── ClientMap (맵 블록)
     ├── Objects (엔티티)
     ├── Particles (파티클)
     ├── Selection Box (선택 박스)
     └── Stars (별)
  
  3. Post-Processing
     ├── Volumetric Light (신광)
     ├── Bloom (블룸)
     │    ├── Extract Bloom
     │    ├── Downsample
     │    └── Upsample
     ├── Auto-Exposure
     ├── Tone Mapping
     ├── FXAA (안티에일리어싱)
     └── Debanding
```

### 6.2 렌더링 설정

| 설정 | 기본값 | 설명 |
|------|--------|------|
| `viewing_range` | 190 | 시야 거리 (노드 단위) |
| `fov` | 72 | 시야각 (도) |
| `enable_dynamic_shadows` | false | 동적 그림자 |
| `enable_post_processing` | true | 후처리 효과 |
| `enable_bloom` | false | 블룸 효과 |
| `enable_volumetric_lighting` | false | 신광 효과 |
| `tone_mapping` | "reinhard" | 톤매핑 |
| `antialiasing` | "none" | 안티에일리어싱 |
| `enable_auto_exposure` | false | 자동 노출 |

## 7. 메시 생성 시스템 (`src/client/mesh_generator_thread.h`)

### 7.1 비동기 메시 생성

```
MeshUpdateQueue (메인 스레드)
  │
  ├── MeshUpdateWorker 1 ──> MapBlock → Mesh
  ├── MeshUpdateWorker 2 ──> MapBlock → Mesh  
  ├── MeshUpdateWorker 3 ──> MapBlock → Mesh
  └── ...
  │
  완료된 메시를 메인 스레드에서 적용
```

### 7.2 MapBlockMesh (`src/client/mapblock_mesh.h`)

블록 메시 생성 과정:

```
MapBlockMesh 생성:
  1. 16³ 노드 순회
  2. ContentFeatures.drawtype에 따라 렌더링 방식 결정
     ├── NDT_NORMAL: 전체 큐브
     ├── NDT_AIRLIKE: 렌더링 안 함
     ├── NDT_LIQUID/FLOWINGLIQUID: 액체 메시
     ├── NDT_GLASSLIKE: 유리 (내부 면 제거)
     ├── NDT_PLANTLIKE: X자 교차 평면
     ├── NDT_NODEBOX: 커스텀 박스
     ├── NDT_MESH: 외부 모델
     └── ... (20가지 DrawType)
  3. 이웃 블록 참조로 면 컬링
  4. 조명 계산 (smooth lighting)
  5. 버텍스/인덱스 버퍼 생성
```

## 8. 맵 렌더링 (`src/client/clientmap.h`)

### 8.1 오클루전 컬링

```
ClientMap::render():
  1. 카메라 frustum에서 보이는 블록만 선택
  2. 오클루전 컬링 (BFS 또는 Loops 모드)
     ├── 각 블록의 9개 포인트(중앙+8모서리)로 레이캐스트
     ├── 2개 이상의 솔리드 블록이 가리면 컬링
     └── 팩터 1.05로 점진적 스텝 증가
  3. 블록을 거리순 정렬 (뒤에서 앞으로)
  4. 메시 렌더링
```

## 9. 하늘 렌더링 (`src/client/sky.h`)

| 기능 | 설명 |
|------|------|
| 일출/일몰 | 시간에 따른 하늘 색상 변화 |
| 태양 | 텍스처/톤맵/크기 커스터마이즈 |
| 달 | 별도 텍스처/톤맵 |
| 별 | 수/count/color/scale/day_opacity 설정 |
| 하늘 박스 | 단색/그라데이션/텍스처 큐브맵 |

## 10. 구름 렌더링 (`src/client/clouds.h`)

| 설정 | 기본값 | 설명 |
|------|--------|------|
| `density` | 0.4 | 구름 밀도 (0=없음) |
| `color_diffuse` | #fff | 확산 색 |
| `color_ambient` | #fff | 환경 색 |
| `height` | 120 | 높이 (노드) |
| `thickness` | 16 | 두께 (노드) |
| `speed` | (0, -2) | 이동 속도 |

## 11. 미니맵 (`src/client/minimap.h`)

| 모드 | 설명 |
|------|------|
| 0 | 비활성화 |
| 1 | 표면 미니맵 (둥근/사각형) |
| 2 | 레이더 모드 |
| 3 | 타일 텍스처 오버레이 |

## 12. 사운드 시스템 (`src/client/sound/`)

### 12.1 아키텍처

```
SoundManager (OpenAL 기반)
  ├── SoundBuffer 관리
  ├── SoundSource 관리 (위치/볼륨/피치/페이드)
  ├── 리스너 (카메라 위치)
  └── 스트리밍 지원
```

### 12.2 SoundSpec

| 필드 | 설명 |
|------|------|
| `name` | 사운드 파일 이름 |
| `gain` | 볼륨 (0.0-1.0) |
| `pitch` | 피치 배율 |
| `fade` | 페이드 스텝 |
| `loop` | 반복 여부 |
| `type` | 위치/객체/고정 |
| `pos` | 3D 위치 |
| `object_id` | 부착 오브젝트 |

## 13. 파티클 시스템 (`src/client/particles.h`)

### 13.1 ParticleSpawner 파라미터

| 파라미터 | 설명 |
|----------|------|
| `amount` | 파티클 수 |
| `time` | 지속 시간 (0=영구) |
| `pos` / `vel` / `acc` | min/max 범위 |
| `exptime` | 수명 범위 |
| `size` | 크기 범위 |
| `texture` | 텍스처 |
| `collisiondetection` | 충돌 감지 |
| `collision_removal` | 충돌 시 제거 |
| `vertical` | 수직 방향만 |
| `animation` | 텍스처 애니메이션 |
| `glow` | 발광 |

## 14. 셰이더 시스템 (`src/client/shader.h`)

### 14.1 게임 셰이더 목록

| 셰이더 | 용도 |
|--------|------|
| `nodes_shader` | 월드 노드 렌더링 |
| `object_shader` | 엔티티 렌더링 |
| `inventory_shader` | 인벤토리 아이템 |
| `minimap_shader` | 미니맵 |
| `cloud_shader` | 구름 |
| `stars_shader` | 별 |
| `selection_shader` | 선택 하이라이트 |
| `shadow/pass1` | 그림자 맵 (불투명) |
| `shadow/pass1_trans` | 그림자 맵 (반투명) |
| `second_stage` | 후처리 |
| `fxaa` | FXAA 안티에일리어싱 |
| `extract_bloom` | 블룸 추출 |
| `bloom_downsample` | 블룸 다운샘플 |
| `bloom_upsample` | 블룸 업샘플 |
| `volumetric_light` | 신광 효과 |
| `update_exposure` | 자동 노출 |

## 15. 입력 시스템 (`src/client/inputhandler.h`)

### 15.1 키 바인딩

| 액션 | 기본 키 |
|------|---------|
| 전진 | W |
| 후진 | S |
| 좌 | A |
| 우 | D |
| 점프 | Space |
| 특수 | E |
| 웅크리기 | Shift |
| 달리기 | Ctrl |
| 인벤토리 | I |
| 채팅 | T |
| 미니맵 | V |
| 비행 토글 | K |
| 노클립 토글 | H |
| 빠른 이동 | J |
| 카메라 전환 | C |
| 디버그 | F5 |
| 스크린샷 | F12 |

### 15.2 JoystickController (`src/client/joystick_controller.h`)

게임패드 입력을 지원합니다:

- 아날로그 스틱 → 이동/카메라
- 트리거 → 점프/특수
- 버튼 매핑 지원
- 진동( rumble) 지원
