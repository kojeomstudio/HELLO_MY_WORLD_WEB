#persona
- 당신은 웹기반 게임 및 c++/c# 베테랑 프로그래머 입니다. 서버와 클라이언트 프로그래밍에 매우 능숙한 시니어입니다.
- 아키텍처 및 구조 설계에 매우 유능하며, 기획 및 아트 데이터 에셋 활용에 능숙합니다.
- 스테이트풀, TCP/IP 기반 IOCP 및 소켓 통신, 멀티스레딩에 능숙한 서버 개발력을 가지고 있습니다.

#rule
- 사용자가 work\work_content.md 파일을 읽고 이 파일을 기준으로 작업을 진행하라는 명시적인
요청사항이 있지 않다면 이 파일에 대한 내용을 기준으로 작업을 진행하지 마십시오.
- 반드시 작업 완료 후에는 반드시 README.md 문서를 업데이트하고 코드 컴파일 테스트 완료 후 commit 합니다. 이후 origin에 push해서 반영하십시오.
- 이 프로세스는 비대화형 자율 모드로 실행 중입니다. 사용자가 결정을 내릴 수 없는 상태이므로, 귀하가 자율적으로 결정을 내려야 합니다.
- work 및 pipeline 경로에 있는 파일은 절대 수정하면 안됩니다. (CI/CD에서 사용하는 경로이므로 절대 수정을 해서는 안됩니다.)
- 이전 세션에 이어서 작업을 시작하기전에 반드시 context compaction을 진행하고 하십시오.

#task
- 반드시 minetest_sub_project 서브모듈 프로젝트를 기준으로 웹기반 게임으로 포팅을 해야합니다.
- 프론트엔드의 경우 타입스크립트 기반으로 진행하십시오.
- 백엔드의 경우 c# 닷넷 8.0 버전 이상 프로젝트로 진행하십시오.
- 웹 기반 프로젝트는 web 폴더를 루트 폴더로해서 하위 계층으로 폴더트리를 구성하십시오.
- 포팅 작업에 있어 코드, 에셋등 누락되는 것 없이 웹 기반 베이스 프로젝트로 완벽하게 진행하십시오.
- 프론트 엔드 및 백엔드를 한번에 실행시켜 편하게 게임 테스트를 할 수 있는 배치스크립트를 지원해야합니다.
- 작업 완료 후 백엔드 및 프론트엔드간에 통신 프로토콜/기능이 정상 동작하는지 테스트를 할 수 있는 스크립트를 통해 진행하세요.
- 백엔드 및 프론트엔드에서 CLI 기반 명령어셋을 제공해야합니다. 이를 통해 작업된 기능들을 효과적으로 테스트를 수행하십시오.

#asset
- 서브모듈 프로젝트에 있는 게임 데이터 및 에셋을 적극적으로 게임 에셋으로 활용하십시오. 

#document
- 코드 아키텍처등의 문서는 web/docs 아래 정리하십시오.
- 레퍼런스로 삼고있는 서브모듈 프로젝트의 코드 계층 및 아키텍처를 분석이 필요한 경우 web/docs/reference 경로 아래에 문서로 정리하고, 기존 문서가 있다면 업데이트하세요.

#reference
- 매우 엄격하게 서브모듈 프로젝트의 전체 아키텍처, 클라이언트 및 서버 코어 기능 및 콘텐츠 기능등 전체 프로젝트를 완벽하게 웹 기반 게임으로 완벽하게 포팅해야합니다.
- 서브모듈 프로젝트를 매번 분석하면 시간이 많이 소모되므로, web/docs/reference 경로에있는 참조 문서를 적극 활용하세요. 실제 서브모듈 프로젝트 코드 및 아키키처 분석이 필요한 경우에만 탐색 및 조회 작업을 수행하세요.

---

## 포팅 범위 (전체 목록 — 서브모듈 완벽 포팅)

서브모듈 `minetest_sub_project` (commit 00f670cf2, 기반 Luanti/Minetest)의 **전체 소스코드, 아키텍처, 동작 흐름, 콘텐츠**를 누락 없이 웹 프로젝트로 포팅합니다. 원본 프로젝트 구조:

| 계층 | 경로 | 역할 |
|------|------|------|
| C++ 엔진 | `src/` | 코어 로직, 클라이언트/서버, 네트워크, 렌더링, GUI |
| Lua builtin | `builtin/game/` + `builtin/common/` | 엔진 레벨 게임 로직 (인증, 채팅, 낙하, 아이템 등) |
| 게임 콘텐츠 | `games/devtest/mods/` | 35개 DevTest 모드 (블록, 아이템, 도구, 레시피, 엔티티, 테스트) |
| Lua API 바인딩 | `src/script/lua_api/` | 38개 Lua API 모듈 (~300+ 함수) |
| C++ 스크립트 콜백 | `src/script/cpp_api/` | 33+ 엔진→Lua 콜백 훅 |
| 네트워크 프로토콜 | `src/network/` | 80+ 서버 명령어, UDP 기반 패킷 |
| 렌더 파이프라인 | `src/render/`, `src/shadows/` | 다중 패스 렌더링, 동적 그림자 |
| 텍스처/에셋 | `textures/base/`, `games/devtest/mods/*/textures/` | ~400+ PNG 텍스처 |
| GUI 시스템 | `src/gui/` | FormSpec 파서, 40+ 위젯 타입 |
| 사운드 | `src/sound/`, `client/sound.cpp` | OpenAL 기반 3D 포지셔널 사운드 |

---

### 서버 포팅 (C# ASP.NET Core + SignalR)

#### 1. 코어 게임 루프
- [x] GameLoop 20TP BackgroundService 기반 게임 틱 (`server/server.cpp` -> `GameLoopService.cs`)
- [ ] **environment_Step 완벽 구현**: 매 틱마다 ABM 실행, LBM 실행, globalstep 콜백 실행 (`cpp_api/s_env.cpp`)
  - 현재: GameLoopService는 UpdatePlayer만 호출
  - 필요: ABM 스케줄러, LBM 매니저, globalstep 콜백 시스템
- [ ] **emerge 시스템**: 비동기 청크 생성 큐 (`src/emerge.cpp` -> `EmergeManager.cs`)
  - EmergeQueue: 우선순위 기반 청크 생성 스케줄링
  - EmergeThread: 백그라운드 생성 + 완료 콜백 (on_generated)
- [ ] **ServerEnvironment**: 월드+엔티티+플레이어 오케스트레이션 컨테이너 (`serverenvironment.cpp`)
  - 활성 블록 추적 (active_blocks), 엔티티 스텝, 플레이어 업데이트 조정

#### 2. 플레이어 시스템 (SAO + Player)
- [x] Player 생명주기: Join/Leave/Respawn/Death (`server/player_sao.cpp` -> `Player.cs`)
- [x] 인벤토리: 32슬롯, AddItem/RemoveItem/MoveItem (`src/inventory.h` -> `Inventory.cs`)
- [x] ItemStack: name, count, wear(65536), metadata 직렬화 (`src/inventory.h` -> `ItemStack`)
- [x] 장비구: 4슬롯 (helmet/chestplate/leggings/boots), 장비 수치/내구도
- [x] 도구 내구도: 65536 스케일, 수리 공식 동일 (`src/tool.cpp` -> `ToolWearSystem.cs`)
- [x] 데미지 시스템: 추락, 용암, 익사, 굶주림
- [x] 넉백 시스템: 데미지 * 거리계수 (`builtin/game/knockback.lua` -> `KnockbackSystem.cs`)
- [x] 호흡 시스템: 수중 호흡 감소, 수외 회복
- [x] 배고픔 시스템: 포만/포만도 감소, 굶주림 데미지, 음식 회복
- [x] 경험치 시스템: XP 바, 레벨업
- [ ] **플레이어 콜백 전체**: on_newplayer, on_joinplayer, on_leaveplayer, on_dieplayer, on_respawnplayer, on_prejoinplayer, on_punchplayer, on_rightclickplayer, on_player_hpchange, on_playerReceiveFields, on_cheat (`cpp_api/s_player.cpp`)
  - 필요: 콜백 파이프라인 (modifier + logger 패턴), 등록/실행 프레임워크
- [ ] **플레이어 물리 오버라이드**: set_physics_override (speed, jump, gravity, sneak, sneak_glitch, new_move, liquid_fluidity, liquid_sink, liquid_fluidity_smooth, acceleration, fast, climb_speed, deceleration) (`l_object.cpp`)
  - 현재: 하드코딩된 물리 상수만 사용
  - 필요: 플레이어별 물리 파라미터 오버라이드 시스템
- [ ] **플레이어 데이터 저장**: PlayerMetaRef (키-값 저장소) (`l_playermeta.cpp`)
  - 플레이어별 영속 데이터 (죽음 횟수, 스폰포인트, 커스텀 데이터 등)
- [ ] **HUD 원격 제어**: hud_add/remove/change/flags (`l_object.cpp` Player 전용 메서드)
  - 서버에서 클라이언트 HUD 요소 동적 생성/수정/삭제
- [ ] **인벤토리 액션 콜백**: allow_player_inventory_action, on_player_inventory_action (`s_player.cpp`)
  - AllowMove/AllowPut/AllowTake + OnMove/OnPut/OnTake 훅
- [ ] **Detached Inventory**: 독립 인벤토리 생성/삭제 + 콜백 (`builtin/game/detached_inventory.lua`)
  - create_detached_inventory(name, callbacks, player_name)
  - Allow/On Move/Put/Take 콜백
- [ ] **스폰포인트**: 서버 Join 시 GetGroundHeight 기반 스폰 좌표 전송 (`server/player_sao.cpp`)
  - 현재: 클라이언트가 (0,50,0)으로 시작, 서버가 스폰 위치 미전송
- [ ] **게임 모드 완벽**: Survival/Creative/Spectator 모드별 동작 분기
  - Creative: 무한 인벤토리, 비행 자동 활성화, 피해 비활성화
  - Spectator: Noclip, 엔티티 통과
- [ ] **침대/스폰포인트**: 침대 사용 시 스폰포인트 설정/리스폰
- [ ] **플레이어 폼펙 제어**: set_inventory_formspec, set_formspec_prepend (`l_object.cpp`)

#### 3. 서버 권위 물리 엔진
- [x] 기본 물리: 이동 검증, 위치 보정, 추락 데미지
- [ ] **완전한 물리 시뮬레이션**: (`serverenvironment.cpp` movePlayer)
  - AABB 충돌 (standing_on_node, collideWithObjects)
  - 액체 내 물리 (swimming, climbing, liquid resistance, sinking)
  - 이동 그룹 (liquid, climbable, snappy, choppy, bouncy, slippery)
  - 넉백 물리 (knockback velocity 적용)
  - 애니메이션 상태 추적 (walk, dig, walk+dig)

#### 4. 월드 시스템
- [x] MapBlock 16x16x16 청크 포맷 (4바이트/블록: Type, Param1, Param2, Light)
- [x] 월드 청크 스토리지: ConcurrentDictionary + 바이너리 파일
- [x] 월드 저장/로드: WorldPersistence
- [x] 조명 엔진: 4+4비트 패킹, 태양광/인공광 BFS 전파
- [x] 액체 시뮬레이션: water(3틱), lava(5틱), 물+용암 반응
- [ ] **월드 조작 API 완전**: set_node, remove_node, get_node, place_node, dig_node, swap_node (`l_env.cpp`)
  - 현재: 기본 get/set 구현
  - 필요: place_node (보호 체크 + facedir 회전 + on_place 콜백), dig_node (채굴 가능 체크 + 도구 내구도 + on_dig 콜백)
- [ ] **블록 검색 API**: find_node_near, find_nodes_in_area, find_nodes_in_area_under_air (`l_env.cpp`)
- [ ] **월드 조명 복구**: fix_light — 블록 변경 후 인접 청크 조명 재계산 완벽 동작 (`l_env.cpp`)
- [ ] **강제 로드**: forceload_block, forceload_free_block — 참조 카운트 기반 (`builtin/game/forceloading.lua`)
- [ ] **VoxelManipulator**: 대량 블록 조작 API (`l_vmanip.cpp`)
  - read_from_map, write_to_map, get_data, set_data
- [ ] **월드 삭제**: delete_area — AABB 범위 청크 삭제 (`l_env.cpp`)

#### 5. 맵 생성
- [x] NoiseWorldGenerator: Perlin 노이즈 지형 + 동굴 + 광물 + 나무
- [x] FlatWorldGenerator
- [x] 바이옴 시스템: heat/humidity 2D 노이즈 -> 최근접 바이옴 선택
- [x] 광물 생성: 9종 광물, 깊이별 분포
- [x] 나무 생성: 4종 (oak/pine/jungle/birch), biome 기반 트리 타입
- [ ] **맵 생성 안정화**: GetGroundHeight 정확도, 청크 경계 지형 연속성
- [ ] **동굴 생성 검증**: 2레이어 웜 동굴 + Y<20 심부 대형 동굴 (`src/mapgen/cavegen.cpp`)
- [ ] **던전 생성 검증**: Y<30, mossy_cobblestone 방 (`src/mapgen/dungeongen.cpp`)
- [ ] **장식 시스템**: mg_decoration 기반 꽃/풀/덤불 장식 (`src/mapgen/mg_decoration.cpp`)
- [ ] **맵 생성 콜백**: on_generated — 청크 생성 완료 후 모드 개입 포인트 (`s_env.cpp`)
- [ ] **맵 생성 파라미터 API**: get_mapgen_params, set_mapgen_params, get_seed (`l_mapgen.cpp`)

#### 6. Action/Timer 시스템
- [ ] **ABM (Active Block Modifier) 완벽**: (`server/blockmodifier.cpp` -> `BlockModifierManager.cs`)
  - 필요 조건: neighbor 검사, min_y/max_y, chance/interval, required_neighbors
  - 현재 미구현: 일부 ABM만 등록됨 (sand_falling, gravel_falling, dirt_to_grass)
  - 포팅 필요 ABM:
    - testabms 모드: wait_node→after_node 변환, chance/interval/min_max 테스트, neighbor 체크
    - basenodes: cactus 성장
- [ ] **NodeTimer 완벽**: (`src/nodetimer.cpp` -> `NodeTimerManager.cs`)
  - set_node_timer(pos, timeout, elapsed), on_timer 콜백
  - 미구현: farmland dehydration, grass spread, ice melt
- [ ] **LBM (Loading Block Modifier)**: 청크 로드 시 조건부 블록 수정 (`s_env.cpp` triggerLBM)
  - chunk_loaded 이벤트 기반 실행
  - bulk_action 지원 (배치 처리)

#### 7. 엔티티 시스템
- [ ] **SAO(Server Active Object) 아키텍처 완벽**: (`server/serveractiveobject.cpp`)
  - ServerActiveObject 기반 클래스: init/step/remove/punch/rightclick
  - Serialize/Deserialize: 엔티티 상태 저장/복원
  - SetOwner/SetAttachments: 소유권, 부착 시스템
- [ ] **엔티티 콜백 전체**: (`cpp_api/s_entity.cpp`)
  - luaentity_Activate, luaentity_Step, luaentity_Punch
  - luaentity_on_death, luaentity_Rightclick
  - luaentity_GetStaticdata, luaentity_GetProperties
- [ ] **엔티티 물리**: velocity, acceleration, rotation, yaw (`l_object.cpp` LuaEntity 전용)
- [ ] **엔티티 부착**: set_attach/detach, get_attach, get_children (`l_object.cpp`)
- [ ] **엔티티 속성**: set_properties (hp_max, physical, collide_with_objects, visual, mesh, textures, etc.)
- [ ] **액티브 오브젝트 매니저**: (`server/activeobjectmgr.cpp`)
  - 거리 기반 활성/비활성 전환
  - 오브젝트 범위 내 쿼리

#### 8. 인증 & 권한
- [x] 이름 검증: regex + reserved names
- [x] 비밀번호: PBKDF2 해시, salt, 브루트포스 방지
- [x] 밴 시스템: IP/이름 기반
- [x] 19 권한: interact, shout, fly, teleport, kick, ban, give, server 등
- [ ] **인증 핸들러 아키텍처**: builtin_auth_handler 전체 (`builtin/game/auth.lua`)
  - get_auth, create_auth, delete_auth, set_password, set_privileges, reload, record_login, iterate
  - 커스텀 인증 핸들러 교체 가능 구조
- [ ] **prejoin 검증**: 대소문자 무시 중복 이름 방지 (`auth.lua` on_prejoinplayer)
- [ ] **권한 동작 연동**: GrantPrivilege/RevokePrivilege 허브 메서드 + 권한 체크
- [ ] **권한 그랜트/리보크 콜백**: on_priv_grant, on_priv_revoke (`register.lua`)
- [ ] **사용자 제한 바이패스**: server/ban/privs/password 권한 보유자 제한 우회

#### 9. 채팅 & 명령어 (31개 명령어 전체)
- [x] 채팅 메시지 브로드캐스트
- [x] HTML 엔티티 인코딩 (XSS 방지)
- [ ] **채팅 명령어 31개 전체 구현** (`builtin/game/chat.lua`):

| 명령어 | 설명 | 권한 | 현재 상태 |
|--------|------|------|----------|
| `/me <action>` | 액션 메시지 | shout | 미구현 |
| `/admin` | 서버 관리자 이름 표시 | 없음 | 미구현 |
| `/privs [name]` | 권한 목록 | 없음 | 미구현 |
| `/haspriv <priv>` | 특정 권한 보유자 목록 | basic_privs | 미구현 |
| `/grant <name> <priv>` | 권한 부여 | 내부 체크 | 미구현 |
| `/grantme <priv>` | 자신에게 권한 부여 | 내부 체크 | 미구현 |
| `/revoke <name> <priv>` | 권한 박탈 | 내부 체크 | 미구현 |
| `/revokeme <priv>` | 자신 권한 박탈 | 내부 체크 | 미구현 |
| `/setpassword <name> <pw>` | 비밀번호 설정 | password | 미구현 |
| `/clearpassword <name>` | 비밀번호 초기화 | password | 미구현 |
| `/auth_reload` | 인증 데이터 리로드 | server | 미구현 |
| `/remove_player <name>` | 플레이어 데이터 삭제 | server | 미구현 |
| `/teleport <x,y,z\|name>` | 텔레포트 | teleport(+bring) | 부분 구현 |
| `/set <name> <value>` | 서버 설정 변경 | server | 미구현 |
| `/emergeblocks <area>` | 청크 생성/로드 | server | 미구현 |
| `/deleteblocks <area>` | 청크 삭제 | server | 미구현 |
| `/fixlight <area>` | 조명 복구 | server | 미구현 |
| `/mods` | 설치된 모드 목록 | 없음 | 미구현 |
| `/give <name> <item>` | 아이템 지급 | give | 부분 구현 |
| `/giveme <item>` | 자신에게 아이템 지급 | give | 부분 구현 |
| `/spawnentity <name> <pos>` | 엔티티 스폰 | give+interact | 미구현 |
| `/pulverize` | 손에 든 아이템 파괴 | give | 미구현 |
| `/rollback_check [range]` | 블록 변경 이력 확인 | rollback | 미구현 |
| `/rollback <name> [sec]` | 플레이어 액션 되돌리기 | rollback | 미구현 |
| `/status` | 서버 상태 표시 | 없음 | 부분 구현 |
| `/time [val]` | 시간 표시/설정 | 없음/settime | 부분 구현 |
| `/days` | 경과 일수 표시 | 없음 | 미구현 |
| `/shutdown [delay]` | 서버 종료 | server | 미구현 |
| `/ban [name]` | 플레이어 밴/목록 | ban | 부분 구현 |
| `/unban <name\|ip>` | 밴 해제 | ban | 부분 구현 |
| `/kick <name> [reason]` | 플레이어 강제 퇴장 | kick | 부분 구현 |
| `/clearobjects [mode]` | 엔티티 정리 | server | 미구현 |
| `/msg <name> <msg>` | 귓속말 | shout | 미구현 |
| `/last-login [name]` | 마지막 로그인 시간 | 없음 | 미구현 |
| `/clearinv [name]` | 인벤토리 초기화 | give(+server) | 미구현 |
| `/kill [name]` | 플레이어 사망 | server | 부분 구현 |

- [ ] **채팅 포맷**: chat_message_format 설정 기반 (@name, @timestamp, @message) (`chat.lua`)
- [ ] **명령어 실행 시간 표시**: 임계값 초과 명령어 실행시간 표시 (기본 0.1초)
- [ ] **chat_send_player**: 개인 귓속말 전송 (`l_server.cpp`)

#### 10. 제작 & 제련
- [x] Shaped/Shapeless 제작 레시피
- [x] 도구 수리 (65536 스케일, 10% 보너스)
- [x] Grid 기반 제작 (패턴 오프셋 매칭)
- [x] 제련 (SmeltingSystem): 20 레시피, 연료 레지스트리
- [ ] **제작 콜백**: on_craft (제작 결과 수정), craft_predict (미리보기) (`s_item.cpp`)
- [ ] **get_craft_recipe / get_all_craft_recipes**: 레시피 역조회 API (`l_craft.cpp`)
- [ ] **clear_craft**: 레시피 동적 제거 API (`l_craft.cpp`)
- [ ] **DevTest 레시피 완전성 검증**: basenodes/basetools 모드의 모든 레시피 교차 확인

#### 11. 사운드 시스템
- [x] 사운드 스펙 정의: sounds.json 기반 블록 사운드 그룹
- [ ] **서버 사운드 제어**: sound_play, sound_stop, sound_fade (`l_server.cpp`)
  - 3D 포지셔널 사운드 (위치, 속도, 루프, 게인, 피치)
  - 사운드 그룹 (랜덤 선택)
  - 페이드 아웃

#### 12. 롤백 시스템
- [ ] **롤백 완벽 구현**: (`server/rollback.cpp` -> `RollbackSystem.cs`)
  - 블록 변경 로그: actor, pos, old_node, new_node, timestamp
  - rollback_get_node_actions(pos, range, seconds): 변경 이력 조회
  - rollback_revert_actions_by(actor, seconds): 플레이어 액션 되돌리기
  - rollback_punch_callbacks: 펀치 기반 롤백 체크

#### 13. 보호 시스템
- [ ] **보호 완벽 구현**: (`builtin/game/misc.lua`)
  - is_protected(pos, name): 위치별 보호 여부
  - is_area_protected(minp, maxp, name, interval): AABB 범위 보호 체크 (3D 격자)
  - record_protection_violation(pos, name): 위반 콜백
  - on_protection_violation 콜백 시스템

#### 14. 노드 콜백
- [ ] **전체 노드 콜백 파이프라인**: (`cpp_api/s_node.cpp`)
  - node_on_punch: 블록 펀치 (도구 내구도, 블록 반응)
  - node_on_dig: 블록 채굴 (채굴 가능 체크, 드롭 계산)
  - node_on_construct: 블록 설치 직후 (폼펙 초기화, 엔티티 연결)
  - node_on_destruct / node_after_destruct: 블록 제거 전/후
  - node_on_flood: 액체 범람 시
  - node_on_timer: 노드 타이머 만료
  - node_on_receive_fields: 노드 폼펙 제출

#### 15. 아이템 콜백
- [ ] **전체 아이템 콜백**: (`cpp_api/s_item.cpp`)
  - item_OnPlace: 아이템 설치 (on_rightclick 라우팅 + item_place_node)
  - item_OnUse: 아이템 사용 (우클릭)
  - item_OnDrop: 아이템 드롭 (엔티티 생성 + 투척 속도)
  - item_OnSecondaryUse: 보조 사용
  - item_OnCraft: 제작 결과 수정
  - item_CraftPredict: 제작 미리보기
- [ ] **item_place_node 완벽**: (`builtin/game/item.lua`)
  - 보호 체크, facedir/4dir/wallmounted 회전
  - 팔레트 컬러 전이, attached node 유효성 검사
  - place 사운드 재생, after_place_node 콜백
- [ ] **node_dig 완벽**: (`builtin/game/item.lua`)
  - 채굴 가능 그룹 체크, 도구 내구도 차감
  - preserve_metadata, handle_node_drops, 파티클 생성
- [ ] **handle_node_drops**: 확장 드롭 테이블 (rarity, tool requirements, max_items)
- [ ] **core.do_item_eat**: 음식 섭취 (HP 변화, replace_with_item, eat 사운드)

#### 16. 빌트인 엔티티 2종
- [ ] **__builtin:item (아이템 엔티티)** 완벽: (`builtin/game/item_entity.lua`)
  - 스택/병합 (반경 1.0 내 동일 아이템)
  - TTL (기본 900초, -1=무한)
  - 고체 노드 내 밀어내기 복구
  - 미끄러운 노드에서 감속 (slippery 그룹)
  - ignore 노드 진입 시 삭제
  - 시각적 스케일링: count 기반 크기 조절
  - 반(半) 광원 상속
- [ ] **__builtin:falling_node (낙하 블록)** 완벽: (`builtin/game/falling.lua`)
  - falling_node 그룹: 아래 블록 비워지면 낙하
  - float 그룹: 비액체에서 낙하, 액체 원천에서 부유
  - attached_node 그룹: 지지 제거 시 아이템 드롭
  - check_single_for_falling / check_for_falling: 스택 기반 이웃 체크 (11방향)
  - 레벨 노드 병합, 노드박스 충돌, facedir 회전 유지

#### 17. 빌트인 게임 메커니즘
- [x] 넉백: core.calculate_knockback (`knockback.lua`)
- [ ] **데스 스크린**: FormSpec 기반 데스 화면 (`death_screen.lua`)
  - formspec: bgcolor[#320000b4;true] + "You died" + Respawn 버튼
  - btn_respawn 클릭 또는 ESC 종료 시 respawn() 호출
  - 조인 시 HP=0이면 데스 스크린 재표시
- [ ] **정적 스폰포인트**: static_spawnpoint 설정 기반 (`static_spawn.lua`)
  - on_newplayer / on_respawnplayer에서 텔레포트
- [ ] **VoxelArea 클래스**: 3D 볼륨 인덱싱 (`voxelarea.lua`)
  - index(x,y,z), position(i), contains, iter (사각형 반복자)
- [ ] **LBM 실행**: core.run_lbm(id, pos_list, dtime_s) — action/bulk_action (`misc.lua`)

---

### 클라이언트 포팅 (TypeScript + Three.js)

#### 1. 렌더링 코어
- [x] Three.js 씬/조명/안개 설정
- [x] 하늘 렌더링 + 낮/밤 사이클
- [x] 구름 렌더링 (3D 노이즈 기반)
- [x] 커브 다크니스 오버레이
- [x] 용암 근접 발광
- [x] 플레이어 포인트 라이트
- [x] 데미지 플래시 오버레이
- [ ] **렌더 파이프라인 아키텍처**: (`src/render/`)
  - PipelineContext, RenderSource, RenderTarget, TextureBuffer
  - ScreenTarget, PostProcessingStep, UpscaleStep
  - Three.js EffectComposer 기반 구현
- [ ] **그림자 완벽**: (`src/shadows/`)
  - DirectionalLight: 카메라 프러스텀 피팅, 미래 프레스텀 예측 (안정화)
  - CascadeShadowMap, 컬러 그림자 맵
  - 프레임 분산 렌더링 (프레임당 일부만 업데이트)
- [ ] **안개게 효과**: (`sky.cpp`)
  - 시간 기반 자동 색상 변화 (60fps)
  - Reinhard 토너매핑
  - 방향성 컬러 안개

#### 2. 카메라 시스템
- [x] 1인칭 카메라: 포인터 락, yaw/pitch
- [x] 3인칭 카메라 (R키)
- [ ] **View Bobbing**: 걷기 시 부드러운 카메라 흔들림 (`camera.cpp`)
- [ ] **Arm Inertia**: 카메라 회전 시 부드러운 팔/도구 애니메이션
- [ ] **Digging Animation**: 채굴/블록 설치 시 카메라 시각 피드백
- [ ] **FOV 전환**: 서버에서 전송된 FOV 값 부드러운 적용
- [ ] **Hurt Tilt**: 데미지 시 카메라 흔들림
- [ ] **Step Height Smoothing**: 계단 오르기 시 부드러운 수직 이동
- [ ] **Nametag 렌더링**: 3D 텍스트 라벨 (플레이어/엔티티 위)
- [ ] **Zoom FOV**: 돋보기/스코프용 줌

#### 3. 청크 메싱
- [x] 16x16x16 청크 메시 생성: 면 컬링, AO, UV 매핑
- [x] 투명/불투명 메시 분리 렌더링
- [x] 앰비언트 오클루전: 3-레벨 per-vertex AO
- [x] 조명 보간: 4 인접 광원 샘플링
- [x] 텍스처 아틀라스 시스템: 89+ 텍스처 팩킹
- [x] 커스텀 블록 지오메트리: 계단, 반블록, 펜스, 벽, 글래스판, 문, 사다리, 횃불, 식물류, 불
- [ ] **13 Drawtype 완벽 구현**: (`content_mapblock.cpp`, `mapblock_mesh.cpp`)
  - solid, liquid, glasslike, glasslike_framed, allfaces
  - torchlike, signlike, plantlike, plantlike_rooted, firelike
  - fencelike, raillike, nodebox, mesh
- [ ] **Smooth Lighting**: 코너 블렌딩 8-라이트 프레임 (`content_mapblock.cpp`)
- [ ] **투명 메시 BSP 정렬**: (`mapblock_mesh.cpp` BSP tree for transparent triangle sorting)
- [ ] **비동기 메시 생성**: Web Worker 기반 백그라운드 메시 빌드 (`mesh_generator_thread.cpp`)
  - MeshUpdateQueue (우선순위, 캐시 스킵, 이웃 연쇄)
  - Worker 풀 관리
- [ ] **청크 드로우 리스트**: 카메라 기반 가시 블록 정렬 + 거리 정렬 (`clientmap.cpp`)
- [ ] **Occlusion Culling**: 루프 오클루전 + 선택적 레이트레이스 컬링 (`clientmap.cpp`)
- [ ] **텍스처 애니메이션**: 프레임 사이클링 + 크랙 오버레이 애니메이션 (`tileanimation.cpp`)
- [ ] **월드 정렬 텍스처**: 바닥/벽 텍스처 자동 UV 보정 (`tile.cpp`)

#### 4. 플레이어 컨트롤러
- [x] WASD 이동, 점프, 스프린트, 웅크리기, 비행
- [x] 클라이언트 사이드 물리: 중력, AABB 충돌, 걸음 오르기
- [x] DDA 블록 레이캐스팅
- [x] 채굴 타이밍: 서버 확인 + 프로그레스
- [x] 블록 설치: 레이캐스트 + 인터랙티브 블록 분기
- [x] CustomEvent 기반 결합 분리
- [ ] **액체 내 물리 완벽**: (`localplayer.cpp`)
  - 수영, 오르기, 액체 저항, 액체 내 가속/감속
- [ ] **Sneak Node 감지**: 웅크리기 시 가장자리 매달림 (`localplayer.cpp`)
- [ ] **Autojump**: 1블록 장애물 자동 점프 (`localplayer.cpp`)
- [ ] **이동 그룹별 저항**: liquid, climbable, snappy, choppy, bouncy, slippery
- [ ] **블록 AABB 설치 검증**: 플레이어 겹침 체크
- [ ] **서버 스폰 위치 동기화**: Join 시 카메라 위치 설정
- [ ] **애니메이션 상태**: walk/dig/walk+dig 상태 추적

#### 5. 입력 시스템
- [x] 키보드 상태 추적: e.code 기반
- [x] 포인터 락 컨트롤
- [ ] **키 바인딩 시스템**: 50+ 액션 매핑 (`inputhandler.cpp`, `keys.h`)
  - 동적 키 재할당, 설정 저장/로드
- [ ] **키 상태 의미론**: keyIsDown, keyWasDown, keyWasPressed, keyWasReleased
- [ ] **마우스 휠 누적**: 핫바 슬롯 스크롤
- [ ] **게임패드 지원**: (`joystick_controller.cpp`)
  - 아날로그 조이스틱, 버튼 조합, 데드존
  - 더블 탭 감지, 이동 속도/방향
- [ ] **로그인 화면 단축키 버그 수정**: login-screen 표시 중 게임 단축키 비활성화

#### 6. HUD (Heads-Up Display)
- [x] 핫바: 8슬롯, 아이템 표시, 선택 하이라이트
- [x] 체력 바, 호흡 바, 배고픔 바, 경험치 바
- [ ] **Crosshair**: 커스텀 이미지 + 오브젝트 인식형 가변 크로스헤어 (`hud.cpp`)
- [ ] **Selection Mesh**: 블록 와이어프레임 오버레이 + 회전 지원 (`hud.cpp`)
- [ ] **Selection Boxes**: 노드박스 면 하이라이트 (AABB 기반 다중 박스) (`hud.cpp`)
- [ ] **Lua HUD 요소**: 서버 정의 HUD (image, text, statbar, compass, inventory, waypoint) (`hud.cpp`)
- [ ] **Compass**: 플레이어 방향 기반 회전 나침반 요소 (`hud.cpp`)
- [ ] **Hotbar 키 바인딩**: 1-8 키로 슬롯 선택 (현재 미구현)
- [ ] **HUD 플래그**: healthbar, hotbar, minimap 등 토글 (`l_object.cpp` hud_set_flags)

#### 7. FormSpec UI 시스템
- [x] 제작 UI, 화로 UI, 상자 UI, 크리에이티브 인벤토리, 방어구 패널, 설정 패널, 플레이어 목록
- [ ] **FormSpec 파서 완전**: (`guiFormSpecMenu.cpp` — 40+ 요소 타입)
  - size, container, scroll_container
  - inventory_list, list_ring (슬롯 드래그앤드롭)
  - button, button_image, button_exit, item_image_button
  - field, textarea, pwdfield
  - dropdown, checkbox
  - table (트리 뷰 포함)
  - image, animated_image, item_image
  - label, vertlabel, box, background
  - hypertext (리치 텍스트)
  - scrollbar, tabheader
  - tooltip, style, position, anchor, padding
  - model (3D 프리뷰)
  - set_focus, allow_close
- [ ] **인벤토리 슬롯 렌더링**: (`guiInventoryList.cpp`)
  - 아이템 아이콘, 수량 텍스트, 호버 하이라이트
  - 좌/우 클릭, 시프트 클릭, 드래그 앤드롭
- [ ] **인벤토리 드래그앤드롭**: 슬롯 간 아이템 이동/분할
- [ ] **채팅 콘솔**: (`guiChatConsole.cpp`)
  - 열기/닫기 애니메이션, 히스토리, 커서 깜빡임
  - 웹 링크 감지 (Ctrl+클릭)
  - 자동 닫기 방지
- [ ] **스타일 시스템**: CSS-like 스타일 프로퍼티 (`StyleSpec.h`)
  - 18개 프로퍼티, 4개 상태 (default/focused/hovered/pressed)
  - 상태 전파

#### 8. 게임 UI
- [ ] **GameUI 시스템**: (`gameui.h/cpp`)
  - 디버그 텍스트 (FPS, 위치, 드로우타임)
  - 정보 텍스트 (화면 중앙 — 블록 툴팁 등)
  - 상태 텍스트 (타이머 페이드)
  - 채팅 텍스트 (최근 메시지)
  - 프로파일러 텍스트 (페이지 전환)
- [ ] **이벤트 매니저**: (`event_manager.h`, `mtevent.h`)
  - Typed 이벤트 디스패치: ViewBobbing, CameraPunch, FallingDamage, PlayerDamage, NodeDug, PlayerJump, RegainGround
  - 사운드 시스템과 디커플링

#### 9. 엔티티 렌더링
- [x] 원격 플레이어 메시: GenericCAO 기본
- [x] 아이템/몹 엔티티 기본
- [x] 낙하 블록 애니메이션
- [ ] **GenericCAO 완벽**: (`content_cao.cpp`)
  - 비주얼 타입: mesh, animated_mesh, sprite (빌보드), wield_item
  - 부드러운 위치/회전 보간 (SmoothTranslator)
  - 부착 시스템 (부모→뼈→위치/회전)
  - 스프라이트 시트 애니메이션
  - 뼈 오버라이드
  - 텍스처 수정자
  - 네임태그 + 미니맵 마커
  - 장비 그룹 + 데미지 리포트
- [ ] **WieldMesh**: 손에 든 아이템 3D 렌더링 (`wieldmesh.cpp`)
  - 텍스처에서 익스트루전 생성
  - 아이템 메시 지원 (glTF, OBJ)
  - 조명, 애니메이션

#### 10. 월드 매니저
- [x] 청크 로드/언로드, 청크 요청, 장거 언로드
- [ ] **Active Object Manager**: 거리 정렬 쿼리 + 레이캐스트 선택 (`activeobjectmgr.h`)
- [ ] **ClientEnvironment**: 프레임 타이밍 + 일시정지 누적 (`clientenvironment.cpp`)
- [ ] **Camera Offset**: 대형 월드 좌표 오프셋 관리

#### 11. 사운드 시스템
- [x] Web Audio API 절차적 사운드 (8종 기본 + 블록 재질 그룹)
- [ ] **SoundMaker (이벤트 기반 사운드)**: (`sound_maker.cpp`)
  - 발소리 (step timer 기반), 점프 사운드
  - 펀치 효과 (좌/우), 아이템 사용 사운드
  - 노드 채굴 사운드, 플레이어 데미지, 추락 데미지
- [ ] **3D 포지셔널 사운드**: 위치/속도 기반 오디오 패닝
- [ ] **사운드 그룹**: 랜덤 그룹 내 사운드 선택 (`sound_spec.h`)
- [ ] **페이드**: 개별 사운드 게인 페이드 (step + target)
- [ ] **환경 사운드**: 비, 천둥, 동굴, 용암 환경음

#### 12. 파티클 & 날씨
- [x] 블록 파괴/설치 파티클, 데미지/연기 파티클
- [x] 날씨 시스템: 비/눈 + 자동 전환
- [ ] **ParticleSpawner**: 서버 제어 파티클 스포너 (`particles.h`)
  - amount, time, spawn_rate, radius, velocity/acceleration 범위
  - 크기/색상/텍스처 풀, 만료 시간
  - 엔티티 부착, 플레이어 제외
- [ ] **파티클 버퍼**: GPU 메시 버퍼 (최대 16000 파티클, 프리리스트) (`particles.h`)
- [ ] **날씨 시스템 동작 검증**: 하늘 밝기 기반 자동 전환

#### 13. 미니맵
- [x] 3가지 모드 (표면, 레이더, 일반)
- [ ] **백그라운드 스캐닝**: (`minimap.h` MinimapUpdateThread)
  - 비동기 지형 스캔, 최상단 노드 판별
  - 플레이어/엔티티 마커 표시

#### 14. 폰트 & 텍스트
- [ ] **FontEngine**: TTF 로딩, 캐싱, 텍스트 측정 (`fontengine.cpp`)
  - FontSpec: 크기, 모드 (standard/mono), 볼드, 이탤릭
  - 8변형 캐시 (크기x스타일)
  - 브라우저 Canvas API 활용

#### 15. 아이템 비주얼
- [ ] **Item Visuals Manager**: 인벤토리 아이콘 캐시 (`item_visuals_manager.cpp`)
  - 2D 인벤토리 텍스처, 오버레이, 애니메이션 프레임
  - 3D 아이템 메시, 팔레트, 아이템 컬러
- [ ] **drawItemStack**: 인벤토리 아이템 렌더링 (`drawItemStack.cpp`)
  - 아이템 텍스처, 오버레이, 수량 텍스트
  - 4회전 타입 (선택/호버/드래그/기타)

---

### 통신 프로토콜 (SignalR)

- [x] SignalR WebSocket `/game` 엔드포인트
- [x] Join 후 초기 데이터 전송
- [x] 위치 동기화 (50ms 쓰로틀)
- [x] 블록 변경 브로드캐스트
- [x] 엔티티 이벤트 (128블록 컬링)
- [x] 속도 제한: dig/place/chat
- [ ] **서버→클라이언트 이벤트 80+ 포팅**: (`src/network/serveropcodes.cpp`)
  - TOCLIENT_MOVE_PLAYER (서버 권위 위치 보정)
  - TOCLIENT_PLAYERINFO (원격 플레이어 정보)
  - TOCLIENT_INVENTORY (인벤토리 전체 동기화)
  - TOCLIENT_HUDADD/REMOVE/CHANGE (HUD 요소)
  - TOCLIENT_SHOW_FORMSPEC (폼펙 표시)
  - TOCLIENT_SPAWN_PARTICLE (단일 파티클)
  - TOCLIENT_ADD_PARTICLE_SPAWNER/REMOVE (스포너)
  - TOCLIENT_SKY_PARAMS, SUN_PARAMS, MOON_PARAMS, STARS_PARAMS
  - TOCLIENT_CLOUD_PARAMS
  - TOCLIENT_OVERRIDE_DAY_NIGHT_RATIO
  - TOCLIENT_CAMERA (카메라 모드/FOV)
  - TOCLIENT_DEATHSCREEN (데스 스크린)
  - TOCLIENT_ANNOUNCE_MEDIA (미디어 푸시)
  - TOCLIENT_NODEMETA_CHANGED (노드 메타데이터)
  - TOCLIENT_TIME_OF_DAY (시간 동기화)
- [ ] **플레이어 위치 브로드캐스트**: 원격 플레이어 위치 64블록 범위
- [ ] **FormSpec 필드 제출**: client→server formspec field 전송 + on_playerReceiveFields
- [ ] **연결 타임아웃**: 10초 연결 시간 초과 처리

---

### DevTest 게임 콘텐츠 포팅 (35개 모드)

#### 코어 모드 (필수)
| 모드 | 파일 | 콘텐츠 | 현재 상태 |
|------|------|--------|----------|
| **basenodes** | init.lua + 38 PNG | grass, dirt, stone, sand, desert_stone, tree, leaves, water, lava, ice, snow, coal_ore, iron_ore, gold_ore, diamond_ore, mese, clay, brick, bookshelf, glass, cobble, wool 16색, planks, sticks, etc. | 블록 정의됨 (blocks.json) |
| **basetools** | init.lua + 30 PNG | wood/stone/steel/mese/titanium sword, pick, axe, shovel, dagger, shears, + 특수 검 (fire, ice, heal, blood, element, superheal) | 도구 정의됨 (tools.json) |
| **stairs** | init.lua | basenodes 기반 계단/반블록 | 미구현 |
| **testnodes** | 13 Lua + 212 PNG | drawtype 전체 (solid, liquid, glasslike, plantlike, nodebox, mesh, etc.), param2 테스트, 오버레이, 빛 레벨, 노드박스, 애니메이션, 월드 정렬 | 텍스처 포함, 블록 일부 정의 |
| **bucket** | init.lua + 3 PNG | 물/용암 양동이 (pick_up, place liquid) | 미구현 |
| **chest** | init.lua + 2 PNG | 아이템 저장 상자 (27슬롯 formspec) + detached inventory | 부분 구현 |
| **give_initial_stuff** | init.lua | 조인 시 초기 아이템 지급 | 미구현 |
| **initial_message** | init.lua | 조인 시 환영 메시지 | 미구현 |

#### 테스트/개발 모드
| 모드 | 파일 | 콘텐츠 | 현재 상태 |
|------|------|--------|----------|
| **testentities** | 6 Lua + 11 PNG + 3 모델 | 엔티티 테스트: 시각적 타입, pointable, selectionbox, observers, armor | 미구현 |
| **testfood** | init.lua + 5 PNG | 음식 아이템 (good/bad/replace_with_item) | 아이템 정의됨 |
| **testtools** | 6 Lua + 27 PNG | 개발 도구: 노드 세터, param2, 엔티티 스포너/회전/스케일, 오브젝트 이동/편집, 파티클, 라이트 툴, 프라이버타이저, 낙하 블록 툴 | 미구현 |
| **testabms** | 6 Lua + 2 PNG | ABM 테스트: wait→after 변환, chance, interval, min_max, neighbors | 미구현 |
| **testformspec** | 4 Lua + 20 PNG + 2 모델 | FormSpec 전체 기능 테스트 (40+ 요소) | 미구현 |
| **testhud** | init.lua + 1 PNG | HUD 기능 테스트 (waypoint 등) | 미구현 |
| **testitems** | init.lua + 7 PNG | 도구/블록 외 아이템 테스트 | 미구현 |
| **callbacks** | 5 Lua + 5 PNG | 콜백 테스트: on_place, on_use, on_drop, on_punch, on_secondary_use | 미구현 |
| **testpathfinder** | init.lua + 4 PNG | A*/Dijkstra 길찾기 테스트 | 미구현 |
| **soundstuff** | 5 Lua + 13 PNG + 2 OGG | 사운드 테스트: bigfoot, jukebox, racecar, 이벤트 사운드 | 미구현 |
| **benchmarks** | init.lua | 벤치마크 명령어 | 미구현 |
| **broken** | init.lua | 빈 정의 엔티티/아이템 폴백 테스트 | 미구현 |
| **chest_of_everything** | init.lua + 2 PNG | 모든 아이템이 들어있는 상자/가방 | 미구현 |
| **dignodes** | init.lua + 8 PNG | 채굴 그룹 테스트 노드 (cracky, crumbly, choppy, etc.) | 미구현 |
| **gltf** | init.lua + 18 모델 + 4 PNG | glTF 모델 테스트 (cube, frog, spider, snow_man 등) | 미구현 |
| **lighting** | init.lua | 조명 파라미터 UI 디버그 | 미구현 |
| **log** | init.lua | DevTest 액션 로깅 | 미구현 |
| **mapgen** | init.lua | DevTest 전용 맵 생성기 | 미구현 |
| **modchannels** | init.lua | 모드 통신 채널 테스트 | 미구현 |
| **testeditor** | init.lua | 하늘 등 편집 formspec 명령어 | 미구현 |
| **testfullscreenfs** | init.lua | 플레이어 창 정보 테스트 | 미구현 |
| **testtranslations** | init.lua + 번역 파일 | 다국어 번역 테스트 | 미구현 |
| **tiled** | init.lua + 2 PNG | 월드 정렬 텍스처 노드 | 미구현 |
| **unittests** | 19 Lua + 10 PNG | 엔진 단위 테스트 (raycast, inventory, crafting, entity, 등) | 미구현 |
| **util_commands** | init.lua | 개발 편의 명령어 | 미구현 |

---

### 데이터 & 에셋 포팅

#### JSON 데이터 파일 (web/data/)
- [x] blocks.json: 226 블록 정의
- [x] items.json: 220+ 아이템 + 166+ 레시피 + 도구 + 연료
- [x] smelting.json: 20 제련 레시피
- [x] biomes.json: 10 바이옴
- [x] mobs.json: 6 몹
- [x] tools.json: 8 도구 재질
- [x] privileges.json: 19 권한
- [x] sounds.json: 15 사운드 그룹
- [x] physics_constants.json: 물리 상수
- [x] protection.json: 보호 구역
- [x] tree_schematics.json: 나무 구조
- [x] decorations.json: 장식 정의
- [x] ores.json: 광물 분포
- [x] game_constants.json: 게임 상수
- [x] sky_params.json: 하늘 파라미터
- [x] day_night_ratio.json: 낮밤 밝기
- [ ] **node_groups.json**: 블록 그룹 정의 (cracky, crumbly, choppy, snappy, bouncy, slippery, falling_node, float, attached_node, liquid, level_*, etc.)
- [ ] **node_callbacks.json**: 블록별 on_place, on_dig, on_punch 콜백 정의
- [ ] **crafting_recipes_comprehensive.json**: DevTest 모든 모드 레시피 완전 집계
- [ ] **spawn_config.json**: 스폰포인트 설정 (static_spawnpoint, 안전 스폰)

#### 텍스처 에셋 (web/client/public/textures/)
- [x] blocks/: 127 파일 (basenodes + basetools + default 블록)
- [x] testnodes/: 212 파일 (전체 testnodes 텍스처)
- [x] items/: 40 파일 (도구 + 양동이 + 음식)
- [x] ui/: ~190 파일 (하트, 버블, 미니맵, 버튼, 체크박스 등)
- [ ] **testentities 텍스처**: 11 PNG (sprite, cube, dungeon_master 등)
- [ ] **testtools 텍스처**: 27 PNG (remover, node_setter, param2tool, entity_spawner 등)
- [ ] **testformspec 텍스처**: 20 PNG + 1 JPG (버튼, 배경, 애니메이션, 상자, 캐릭터)
- [ ] **testhud 텍스처**: 1 PNG (waypoint)
- [ ] **testitems 텍스처**: 7 PNG (tree_spawner, telescope_stick, overlay 등)
- [ ] **callbacks 텍스처**: 5 PNG
- [ ] **soundstuff 텍스처**: 13 PNG
- [ ] **dignodes 텍스처**: 8 PNG
- [ ] **gltf 텍스처**: 4 PNG (snow_man, spider, frog, cube)
- [ ] **tiled 텍스처**: 2 PNG
- [ ] **testpathfinder 텍스처**: 4 PNG
- [ ] **chest/bucket 텍스처**: 2+3 PNG
- [ ] **unittests 텍스처**: 10 PNG

#### 3D 모델 에셋
- [ ] **testentities 모델**: testentities_sam.b3d, testentities_lava_flan.x, testentities_cool_guy.x
- [ ] **testformspec 모델**: testformspec_character.b3d, testformspec_chest.obj
- [ ] **testnodes 모델**: pyramid.obj, marble_metal.obj, marble_glass.obj, ocorner.obj
- [ ] **gltf 모델**: 14 glTF + 1 GLB (cube, frog, spider, snow_man 등)
  - Three.js GLTFLoader로 변환/로드 필요

---

### 빌드 & 테스트 & CI/CD
- [x] start.bat: 서버+클라이언트 동시 실행
- [x] build.bat: 서버(Release) + 클라이언트 프로덕션 빌드
- [ ] **test-protocol.bat**: 통신 프로토콜 자동 테스트
- [ ] **GitHub Actions**: 빌드 + 타입체크 + 린트 CI 파이프라인
- [ ] **README.md**: 현재 프로젝트 상태 정확히 반영

---

### 포팅 우선순위 (실행 순서)

#### P0 — 기본 플레이 가능 (현재 런타임 버그 수정)
1. 지형 생성 정상화 (NoiseWorldGenerator + GetGroundHeight)
2. 로그인 화면 단축키 비활성화
3. 핫바 키 바인딩 (1-8) + 핫바 UI 상호작용
4. 서버→클라이언트 스폰 위치 전송
5. 기본 블록 설치/채굴 플로우 검증

#### P1 — 코어 게임플레이
6. 노드 콜백 (on_dig, on_place, on_punch) 완벽
7. 아이템 콜백 (OnPlace, OnUse, OnDrop) 완벽
8. ABM/NodeTimer 시스템
9. 낙하 블록 + 아이템 엔티티 빌트인
10. 데스 스크린 + 리스폰
11. 플레이어 물리 오버라이드 + 게임 모드

#### P2 — 멀티플레이어 & UI
12. 원격 플레이어 위치 브로드캐스트
13. FormSpec 파서 (기본 요소)
14. 인벤토리 드래그앤드롭
15. 채팅 콘솔
16. 채팅 명령어 31개

#### P3 — 고급 기능
17. 보호 시스템
18. 롤백 시스템
19. 엔티티 시스템 완벽
20. DevTest 모드 콘텐츠 포팅
21. 그림자, 비동기 메시, GameUI

#### P4 — 폴리싱
22. 게임패드 지원
23. 키 바인딩 커스텀
24. 모든 텍스처/모델 에셋 포팅
25. 환경 사운드, 파티클 스포너

---

#data
- text, confing, 상수등의 하드코딩 성격을 가지는 경우 별도의 *.json 파일로 분리하십시오. web/data 아래 위치하게 하십시오. config 설정값이 중첩되지 않도록 하십시오.

#stability
- github action 기반으로 프로젝트 베이스의 코드 및 프로젝트 안정성을 확보하십시오. (논리적 정합성, github action 구성에 문제가 없어야합니다.)

#security
- 사용자 프로파일, key chain, secret key등 보안 측면에서 위험 사항이 없도록 프로젝트 베이스 기준 전체 검토 진행 후 문제가 있으면 개선하십시오.
