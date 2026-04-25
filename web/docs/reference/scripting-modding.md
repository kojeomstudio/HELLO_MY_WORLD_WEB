# Scripting & Modding System Reference

> Luanti (Minetest) 스크립팅/모딩 시스템 상세 분석 문서

## 1. 스크립팅 환경 아키텍처

Luanti는 목적별로 **6개의 독립적인 Lua 환경**을 사용합니다.

### 1.1 환경 계층

```
ScriptApiBase (베이스: Lua 상태 관리)
  │
  ├── ServerScripting          (서버 모딩 - 가장 완전한 API)
  │    ├── ScriptApiAsync       (비동기 작업)
  │    ├── ScriptApiDetached    (분리 인벤토리)
  │    ├── ScriptApiEntity      (엔티티 콜백)
  │    ├── ScriptApiEnv         (환경/노드 조작)
  │    ├── ScriptApiModChannels (모드 채널)
  │    ├── ScriptApiNode        (노드 콜백)
  │    ├── ScriptApiPlayer      (플레이어 콜백)
  │    ├── ScriptApiServer      (서버 관리)
  │    └── ScriptApiSecurity    (파일 접근 샌드박싱)
  │
  ├── ClientScripting          (클라이언트 모딩 - 제한적)
  │    ├── ScriptApiClient      (클라이언트 API)
  │    ├── ScriptApiClientCommon
  │    └── ScriptApiModChannels
  │
  ├── EmergeScripting          (맵 생성 스레드 내부)
  │    └── ScriptApiMapgen      (VoxelManipulator 기반)
  │
  ├── MainMenuScripting        (메인 메뉴 UI)
  │    └── ScriptApiMainMenu
  │
  ├── PauseMenuScripting       (일시정지 메뉴)
  │    └── ScriptApiClientCommon
  │
  └── SSCSMScripting           (서버 전송 클라이언트 모드)
       └── ScriptApiSSCSM       (파일 시스템 접근 없음)
```

### 1.2 보안 모델

| 환경 | 파일 시스템 | 네트워크 | 제한 |
|------|------------|----------|------|
| ServerScripting | 샌드박스 | HTTP (CURL) | 경로 기반 접근 제어 |
| ClientScripting | **불가** | **불가** | IO API 명시적 차단 |
| EmergeScripting | 샌드박스 | 불가 | VoxelManip만 조작 |
| SSCSMScripting | **불가** | **불가** | 모든 파일 접근 차단 |

## 2. Lua API 바인딩 (C++ → Lua)

### 2.1 ObjectRef (`l_object.h`) - 80+ 메서드

#### 일반

| 메서드 | 시그니처 | 반환 |
|--------|----------|------|
| `remove` | `()` | - |
| `is_valid` | `()` | bool |
| `get_pos` | `()` | vector |
| `set_pos` | `(pos)` | - |
| `add_pos` | `(pos)` | - |
| `move_to` | `(pos, continuous)` | - |

#### 전투/체력

| 메서드 | 시그니처 | 반환 |
|--------|----------|------|
| `punch` | `(puncher, time, toolcaps, dir)` | - |
| `set_hp` | `(hp, reason)` | - |
| `get_hp` | `()` | number |

#### 인벤토리

| 메서드 | 시그니처 | 반환 |
|--------|----------|------|
| `get_inventory` | `()` | InvRef |
| `get_wielded_item` | `()` | ItemStack |
| `set_wielded_item` | `(item)` | bool |

#### 물리

| 메서드 | 시그니처 | 반환 |
|--------|----------|------|
| `set_armor_groups` | `(groups)` | - |
| `set_physics_override` | `(override)` | - |
| `get_physics_override` | `()` | table |

#### 애니메이션/본

| 메서드 | 시그니처 |
|--------|----------|
| `set_animation` | `(frame_range, speed, blend, loop)` |
| `set_bone_position` | `(bone, pos, rotation)` |
| `set_bone_override` | `(bone, override)` |

#### 부착

| 메서드 | 시그니처 |
|--------|----------|
| `set_attach` | `(parent, bone, pos, rotation)` |
| `get_attach` | `() → parent, bone, pos, rotation` |
| `get_children` | `() → table` |
| `set_detach` | `()` |

#### 엔티티 전용 (LuaEntitySAO)

| 메서드 | 시그니처 |
|--------|----------|
| `set_velocity` | `(vel)` |
| `add_velocity` | `(vel)` |
| `get_velocity` | `() → vector` |
| `set_acceleration` | `(acc)` |
| `set_rotation` | `(rot)` |
| `set_texture_mod` | `(mod)` |
| `set_sprite` | `(start, count, length, camera)` |
| `get_luaentity` | `() → table or nil` |

#### 플레이어 전용

| 메서드 | 시그니처 |
|--------|----------|
| `get_player_name` | `() → string` |
| `set_fov` | `(degrees, is_multiplier, transition)` |
| `get_look_dir` | `() → vector` |
| `set_look_vertical` | `(radians)` |
| `get_breath` / `set_breath` | `() → number` |
| `get_player_control` | `() → table` |
| `respawn` | `()` |

#### HUD (플레이어 전용)

| 메서드 | 시그니처 |
|--------|----------|
| `hud_add` | `(def) → id` |
| `hud_remove` | `(id) → bool` |
| `hud_change` | `(id, stat, data)` |
| `hud_set_flags` | `(flags)` |
| `hud_set_hotbar_image` | `(image)` |

#### 환경 (플레이어 전용)

| 메서드 | 시그니처 |
|--------|----------|
| `set_sky` / `get_sky` | 하늘 파라미터 |
| `set_sun` / `set_moon` / `set_stars` | 천체 파라미터 |
| `set_clouds` / `get_clouds` | 구름 파라미터 |
| `override_day_night_ratio` | 낮/밤 비율 |
| `set_lighting` | 조명 오버라이드 |
| `set_minimap_modes` | 미니맵 모드 |

### 2.2 환경 API (`l_env.h`)

#### 노드 조작

| 함수 | 설명 |
|------|------|
| `set_node(pos, node)` | 노드 설정 |
| `remove_node(pos)` | 노드 제거 (공기) |
| `swap_node(pos, node)` | 콜백 없이 교체 |
| `get_node_raw(x,y,z)` | content, param1, param2 반환 |
| `get_node_light(pos, time)` | 조명 레벨 |
| `place_node(pos, node, placer)` | 콜백과 함께 배치 |
| `dig_node(pos, digger)` | 콜백과 함께 파기 |
| `bulk_set_node(positions, node)` | 다중 노드 설정 |
| `bulk_swap_node(positions, node)` | 다중 교체 |

#### 엔티티/오브젝트

| 함수 | 설명 |
|------|------|
| `add_entity(pos, name)` | 엔티티 생성 |
| `add_item(pos, stack)` | 아이템 드롭 |
| `get_connected_players()` | 접속 플레이어 목록 |
| `get_player_by_name(name)` | 이름으로 플레이어 검색 |
| `get_objects_inside_radius(pos, r)` | 반경 내 오브젝트 |
| `get_objects_in_area(minp, maxp)` | 영역 내 오브젝트 |

#### 시간

| 함수 | 설명 |
|------|------|
| `set_timeofday(val)` | 시간 설정 [0,1] |
| `get_timeofday()` | 시간 조회 [0,1] |
| `get_gametime()` | 경과 시간 (초) |

#### 검색/경로

| 함수 | 설명 |
|------|------|
| `find_node_near(pos, radius, names)` | 근처 노드 검색 |
| `find_nodes_in_area(minp, maxp, names)` | 영역 내 노드 검색 |
| `find_path(pos1, pos2, ...)` | A* 경로 탐색 |
| `line_of_sight(pos1, pos2)` | 시야 확인 |
| `raycast(pos1, pos2, objects, liquids)` | 레이캐스트 반복자 |
| `spawn_tree(pos, treedef)` | 나무 생성 |

### 2.3 인벤토리 API (`l_inventory.h`)

#### InvRef 메서드

| 메서드 | 설명 |
|--------|------|
| `is_empty(listname)` | 목록 비었는지 |
| `get_size(listname)` | 목록 크기 |
| `set_size(listname, size)` | 목록 크기 설정 |
| `get_stack(listname, i)` | 스택 조회 |
| `set_stack(listname, i, stack)` | 스택 설정 |
| `add_item(listname, stack)` | 아이템 추가 (잔여 반환) |
| `room_for_item(listname, stack)` | 공간 확인 |
| `remove_item(listname, stack)` | 아이템 제거 |
| `contains_item(listname, stack)` | 포함 확인 |

### 2.4 제작 API (`l_craft.h`)

| 함수 | 설명 |
|------|------|
| `register_craft(def)` | 제작 레시피 등록 |
| `get_craft_recipe(output)` | 레시피 조회 |
| `get_all_craft_recipes(output)` | 모든 레시피 조회 |
| `get_craft_result(input)` | 제작 결과 조회 |
| `clear_craft(def)` | 레시피 제거 |

### 2.5 맵젠 API (`l_mapgen.h`)

| 함수 | 설명 |
|------|------|
| `register_biome(def)` | 생물군계 등록 |
| `register_ore(def)` | 광석 등록 |
| `register_decoration(def)` | 장식 등록 |
| `register_schematic(def)` | 도면 등록 |
| `get_biome_data(pos)` | 열/습도/생물군계 |
| `get_mapgen_params()` | 맵젠 파라미터 |
| `get_seed()` | 맵 시드 |
| `generate_ores(vm, p1, p2)` | 광석 수동 생성 |
| `place_schematic(pos, schem)` | 도면 수동 배치 |

### 2.6 아이템 API (`l_item.h`)

#### LuaItemStack

| 메서드 | 설명 |
|--------|------|
| `get_name()` / `set_name(name)` | 아이템 이름 |
| `get_count()` / `set_count(n)` | 수량 |
| `get_wear()` / `set_wear(n)` | 내구도 (0-65535) |
| `get_meta()` | 아이템 메타데이터 |
| `add_wear(amount)` | 내구도 감소 |
| `add_item(item)` | 아이템 추가 |
| `take_item(n)` | 아이템 꺼내기 |
| `to_table()` | 테이블로 변환 |

### 2.7 서버 API (`l_server.h`)

| 함수 | 설명 |
|------|------|
| `chat_send_all(text)` | 전체 채팅 |
| `chat_send_player(name, text)` | 개인 채팅 |
| `show_formspec(name, form, spec)` | 폼스펙 표시 |
| `get_player_privs(name)` | 권한 조회 |
| `ban_player(name)` | 밴 |
| `disconnect_player(name, reason)` | 강제 퇴장 |
| `request_shutdown(msg, reconnect)` | 서버 종료 |
| `dynamic_add_media(path)` | 동적 미디어 추가 |

### 2.8 클라이언트 API (`l_client.h`)

| 함수 | 설명 |
|------|------|
| `display_chat_message(msg)` | 로컬 채팅 표시 |
| `send_chat_message(msg)` | 서버에 채팅 전송 |
| `get_wielded_item()` | 장착 아이템 |
| `get_node_or_nil(pos)` | 클라이언트 측 노드 |
| `get_item_def(name)` | 아이템 정의 |
| `get_node_def(name)` | 노드 정의 |

### 2.9 파티클 API (`l_particles.h`)

| 함수 | 설명 |
|------|------|
| `add_particle(def)` | 단일 파티클 생성 |
| `add_particlespawner(def)` | 파티클 스포너 생성 |
| `delete_particlespawner(id)` | 스포너 제거 |

### 2.10 유틸리티 API (`l_util.h`)

| 함수 | 설명 |
|------|------|
| `log([level,] text)` | 로그 |
| `parse_json(str)` | JSON 파싱 |
| `write_json(data)` | JSON 직렬화 |
| `get_dig_params(groups, toolcaps)` | 파기 파라미터 |
| `get_hit_params(groups, toolcaps)` | 타격 파라미터 |
| `compress/decompress(data)` | 데이터 압축/해제 |
| `sha1/sha256(string)` | 해시 |
| `encode_base64/decode_base64(s)` | Base64 |
| `get_version()` | 엔진 버전 |

## 3. Builtin Lua 스크립트

### 3.1 register.lua - 코어 등록 시스템

#### 등록 테이블

```lua
core.registered_abms = {}
core.registered_lbms = {}
core.registered_entities = {}
core.registered_items = {}
core.registered_nodes = {}
core.registered_craftitems = {}
core.registered_tools = {}
core.registered_aliases = {}
```

#### 등록 함수

| 함수 | 설명 |
|------|------|
| `core.register_abm(spec)` | Active Block Modifier 등록 |
| `core.register_lbm(spec)` | Loading Block Modifier 등록 |
| `core.register_entity(name, proto)` | 엔티티 등록 |
| `core.register_node(name, def)` | 노드 등록 |
| `core.register_tool(name, def)` | 도구 등록 |
| `core.register_craftitem(name, def)` | 제작 아이템 등록 |
| `core.register_alias(name, to)` | 이름 별칭 등록 |
| `core.override_item(name, redef)` | 아이템 오버라이드 |

#### 콜백 등록

```lua
-- 서버 콜백
core.register_globalstep(func(dtime))
core.register_on_mods_loaded(func())
core.register_on_shutdown(func())
core.register_on_joinplayer(func(player, last_login))
core.register_on_leaveplayer(func(player, timed_out))
core.register_on_newplayer(func(player))
core.register_on_dieplayer(func(player, reason))
core.register_on_respawnplayer(func(player))
core.register_on_chat_message(func(name, message))
core.register_on_punchnode(func(pos, node, puncher))
core.register_on_placenode(func(pos, node, placer))
core.register_on_dignode(func(pos, oldnode, digger))
core.register_on_player_receive_fields(func(player, form, fields))
core.register_on_craft(func(itemstack, player, old_list, craft_inv))
core.register_on_item_eat(func(hp_change, replace, itemstack, user, pointed))
core.register_on_cheat(func(player, cheat))
core.register_on_authplayer(func(name, ip, is_success))

-- HP 변경 시스템
core.register_on_player_hpchange(func(player, hp_change, reason), modifier)
```

### 3.2 item.lua - 아이템 동작

| 함수 | 설명 |
|------|------|
| `core.item_place_node(stack, placer, pointed, param2)` | 노드 배치 (콜백 포함) |
| `core.item_place(stack, placer, pointed, param2)` | 배치 진입점 |
| `core.item_drop(stack, dropper, pos)` | 아이템 드롭 |
| `core.item_eat(hp_change, replace)` | 음식 on_use 클로저 반환 |
| `core.do_item_eat(hp, replace, stack, user, pointed)` | 섭취 로직 |
| `core.node_dig(pos, node, digger)` | 파기 로직 (내구도, 콜백, 파티클) |
| `core.get_node_drops(node, toolname)` | 드롭 목록 계산 |
| `core.handle_node_drops(pos, drops, digger)` | 드롭 분배 |

### 3.3 item_entity.lua - 아이템 엔티티

`__builtin:item` 엔티티:

```
시각: "wielditem"
물리: true
충돌: {-0.3, -0.3, -0.3, 0.3, 0.3, 0.3}
TTL: 900초 (설정 가능)
```

| 메서드 | 설명 |
|--------|------|
| `set_item(item)` | 아이템 설정 |
| `try_merge_with(stack, obj, entity)` | 스택 병합 |
| `on_step(dtime, moveresult)` | 노화, 만료, 미끄러짐, 병합 |
| `on_punch(hitter)` | 줍기 콜백 |

### 3.4 falling.lua - 낙하 노드

`__builtin:falling_node` 엔티티:

```
시각: "node"
물리: true
중력 가속도 적용
```

| 함수 | 설명 |
|------|------|
| `core.spawn_falling_node(pos)` | 낙하 노드 생성 |
| `core.check_single_for_falling(p)` | 단일 위치 낙하 확인 |
| `core.check_for_falling(p)` | 반복적 홍수 채우기 낙하 확인 |

### 3.5 auth.lua - 인증 핸들러

```lua
core.builtin_auth_handler = {
    get_auth(name) → {password, privileges, last_login}
    create_auth(name, password)
    set_password(name, password)
    set_privileges(name, privs)
    record_login(name)
}

core.register_authentication_handler(handler)
core.get_auth_handler()
core.change_player_privs(name, changes)
```

### 3.6 chat.lua - 채팅 명령어

| 명령 | 권한 | 설명 |
|------|------|------|
| `/me` | shout | 액션 표시 |
| `/privs [name]` | none | 권한 목록 |
| `/grant <name> <privs>` | basic_privs | 권한 부여 |
| `/revoke <name> <privs>` | basic_privs | 권한 회수 |
| `/setpassword <name> <pw>` | password | 비밀번호 설정 |
| `/teleport` | teleport | 텔레포트 |
| `/give <name> <item>` | give | 아이템 지급 |
| `/time <time>` | settime | 시간 설정 |
| `/spawnentity <name>` | give, interact | 엔티티 소환 |
| `/set <name> <value>` | server | 설정 변경 |
| `/mods` | none | 모드 목록 |
| `/emergeblocks` | server | 블록 생성 |
| `/fixlight` | server | 조명 수정 |
| `/rollback_check` | rollback | 롤백 확인 |
| `/ban <name>` | ban | 밴 |
| `/kick <name>` | kick | 강제 퇴장 |
| `/shutdown` | server | 서버 종료 |
| `/clearobjects` | server | 오브젝트 제거 |

## 4. 등록 패턴 요약

### 4.1 노드 등록

```lua
core.register_node("modname:nodename", {
    description = "Display Name",
    tiles = {"texture.png"},
    groups = {cracky = 3},
    drop = "modname:nodename",
    sounds = default.node_sound_stone_defaults(),
    on_construct = function(pos) end,
    on_destruct = function(pos) end,
    on_rightclick = function(pos, node, clicker) end,
    can_dig = function(pos, player) end,
})
```

### 4.2 도구 등록

```lua
core.register_tool("modname:tool", {
    description = "Tool",
    inventory_image = "texture.png",
    tool_capabilities = {
        full_punch_interval = 1.0,
        max_drop_level = 0,
        groupcaps = {cracky = {times = {[1]=4.0, [2]=1.5, [3]=0.5}, uses = 30}},
        damage_groups = {fleshy = 5},
    },
})
```

### 4.3 제작 등록

```lua
-- 형태 레시피
core.register_craft({
    output = "modname:item 4",
    recipe = {
        {"modname:a", "modname:b"},
        {"modname:c", "modname:d"},
    },
})

-- 형태 없는 레시피
core.register_craft({
    type = "shapeless",
    output = "modname:item",
    recipe = {"modname:a", "modname:b", "modname:c"},
})

-- 제련 레시피
core.register_craft({
    type = "cooking",
    output = "modname:result",
    recipe = "modname:input",
    cooktime = 10,
})

-- 연료
core.register_craft({
    type = "fuel",
    recipe = "modname:fuel",
    burntime = 30,
})
```

### 4.4 ABM 등록

```lua
core.register_abm({
    nodenames = {"modname:node"},
    neighbors = {"air"},
    interval = 10.0,
    chance = 50,
    action = function(pos, node, active_object_count, active_object_count_wider)
    end,
})
```

### 4.5 엔티티 등록

```lua
core.register_entity("modname:entity", {
    initial_properties = {
        visual = "mesh",
        mesh = "model.obj",
        textures = {"texture.png"},
        hp_max = 20,
        physical = true,
        collisionbox = {-0.3, -0.3, -0.3, 0.3, 0.9, 0.3},
    },
    on_activate = function(self, staticdata, dtime_s) end,
    on_step = function(self, dtime, moveresult) end,
    on_punch = function(self, puncher, time, toolcaps, dir) end,
    on_rightclick = function(self, clicker) end,
    get_staticdata = function(self) end,
})
```

## 5. 크로스 참조 해결 흐름

```
1. 모든 모드가 아이템/노드/별칭/레시피 등록
2. NodeDefManager::updateAliases()     - 별칭 해결
3. NodeDefManager::resolveCrossrefs()  - 액체/연결 노드박스 해결
4. NodeDefManager::runNodeResolveCallbacks() - NodeResolver 콜백 실행
5. CraftDefManager::initHashes()       - 레시피 해시 인덱스 구축
```

## 6. 모드 로딩 후 동결

`on_mods_loaded` 이후 모든 등록 테이블이 동결되고, 등록 함수가 에러 발생 함수로 교체됩니다.
