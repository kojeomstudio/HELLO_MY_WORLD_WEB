# Game Content & Data Reference

> Luanti (Minetest) 게임 콘텐츠/데이터 시스템 상세 분석 문서

## 1. 제작 시스템 (`src/craftdef.h`)

### 1.1 제작 메서드

| 타입 | 설명 |
|------|------|
| CRAFT_METHOD_NORMAL | 제작 그리드 |
| CRAFT_METHOD_COOKING | 화로 제련 |
| CRAFT_METHOD_FUEL | 화로 연료 |

### 1.2 레시피 타입

| 타입 | 설명 | 우선순위 |
|------|------|----------|
| **CraftDefinitionShaped** | 형태 있는 레시피 (정확한 위치) | PRIORITY_SHAPED |
| **CraftDefinitionShapeless** | 형태 없는 레시피 (재료만) | PRIORITY_SHAPELESS |
| **CraftDefinitionToolRepair** | 도구 수리 | PRIORITY_TOOLREPAIR |
| **CraftDefinitionCooking** | 제련 | PRIORITY_SHAPELESS |
| **CraftDefinitionFuel** | 연료 | PRIORITY_SHAPELESS |

### 1.3 레시피 우선순위 (낮→높)

```
PRIORITY_NO_RECIPE
PRIORITY_TOOLREPAIR
PRIORITY_SHAPELESS_AND_GROUPS
PRIORITY_SHAPELESS
PRIORITY_SHAPED_AND_GROUPS
PRIORITY_SHAPED
```

### 1.4 도구 수리 공식

```
new_wear = 65536 - (item1_uses + item2_uses) + round(additional_wear × 65536)
```

같은 이름의 ITEM_TOOL 타입 2개, "disable_repair" 그룹 없는 경우에만 수리 가능.

### 1.5 해시 시스템

```
3계층 해시 구조:
1. CRAFT_HASH_TYPE_ITEM_NAMES  - 정규화된 아이템 이름 해시
2. CRAFT_HASH_TYPE_COUNT       - 비어있지 않은 슬롯 수
3. CRAFT_HASH_TYPE_UNHASHED    - 해시 적용 전 모든 레시피

해시 알고리즘: murmur_hash_64_ua (seed = 0xdeadbeef)
```

## 2. 인벤토리 시스템 (`src/inventory.h`)

### 2.1 ItemStack

| 필드 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `name` | string | "" | 아이템 식별자 |
| `count` | u16 | 0 | 스택 수량 |
| `wear` | u16 | 0 | 내구도 (0=새것, 65535=부서짐) |
| `metadata` | ItemStackMetadata | empty | 아이템 메타데이터 |

### 2.2 ItemStack 동작

- `count==0` 또는 `name==""` → 빈 스택
- 도구: 항상 count=1
- `addItem()`: 같은 이름+메타데이터 스택에 병합
- 직렬화: `name [count] [wear] [metadata]`

### 2.3 InventoryList

```
vector<ItemStack> m_items  - 슬롯 배열
name, size, width          - 목록 속성
addItem()                  - 기존 스택 우선, 빈 슬롯 차순
moveItem()                 - 슬롯 간 이동 (필요시 교체)
```

### 2.4 인벤토리 위치 타입

| 타입 | 필드 | 설명 |
|------|------|------|
| CURRENT_PLAYER | - | 현재 플레이어 |
| PLAYER | name | 이름 지정 플레이어 |
| NODEMETA | p (v3s16) | 노드 메타데이터 (상자 등) |
| DETACHED | name | 분리 인벤토리 |

### 2.5 인벤토리 액션

| 액션 | 설명 |
|------|------|
| IMoveAction | 슬롯 간 이동 (move_somewhere 변형 있음) |
| IDropAction | 아이템 드롭 |
| ICraftAction | 아이템 제작 |

## 3. DevTest 게임 - basenodes 모드

### 3.1 등록된 노드

| 노드 이름 | drawtype | 주요 그룹 | 특이사항 |
|-----------|----------|-----------|----------|
| basenodes:stone | normal | cracky=3 | |
| basenodes:desert_stone | normal | cracky=3 | |
| basenodes:dirt_with_grass | normal | crumbly=3, soil=1 | overlay_tiles |
| basenodes:dirt_with_snow | normal | crumbly=3, soil=1 | |
| basenodes:dirt | normal | crumbly=3, soil=1 | |
| basenodes:sand | normal | crumbly=3 | |
| basenodes:desert_sand | normal | crumbly=3 | |
| basenodes:gravel | normal | crumbly=2 | |
| basenodes:junglegrass | plantlike | snappy=3 | walkable=false |
| basenodes:tree | normal | choppy=2 | |
| basenodes:leaves | allfaces_optional | snappy=3 | |
| basenodes:jungletree | normal | choppy=2 | |
| basenodes:jungleleaves | allfaces_optional | snappy=3 | |
| basenodes:pine_tree | normal | choppy=2 | |
| basenodes:pine_needles | allfaces_optional | snappy=3 | |
| basenodes:water_source | liquid | water=3, liquid=3 | alpha=160, drowning=1 |
| basenodes:water_flowing | flowingliquid | water=3, liquid=3 | param2=flowingliquid |
| basenodes:river_water_source | liquid | water=3, liquid=3 | range=2 |
| basenodes:lava_source | liquid | lava=3, liquid=1 | light=14, damage=4 |
| basenodes:lava_flowing | flowingliquid | lava=3, liquid=1 | light=14, damage=4 |
| basenodes:cobble | normal | cracky=3 | |
| basenodes:mossycobble | normal | cracky=3 | |
| basenodes:apple | plantlike | dig_immediate=3 | on_use=eats(2HP) |
| basenodes:ice | normal | cracky=3 | |
| basenodes:snow | nodebox | crumbly=3 | 반높이 |
| basenodes:snowblock | normal | crumbly=3 | |

### 3.2 액체 상수

| 상수 | 값 |
|------|-----|
| WATER_ALPHA | 160 |
| WATER_VISC | 1 |
| LAVA_VISC | 7 |

## 4. DevTest 게임 - basetools 모드

### 4.1 크리에이티브 모드 손

모든 그룹 times=42, maxlevel=256, fleshy=10, range=10

### 4.2 서바이벌 모드 손

```
crumbly={[2]=3.0, [3]=0.7}
snappy={[3]=0.4}
oddly_breakable_by_hand={[1]=3.5, [2]=2.0, [3]=0.7}
fleshy=1
```

### 4.3 등록된 도구

#### 곡괭이 (cracky)

| 도구 | 레벨 | 사용 횟수 | maxlevel |
|------|------|-----------|----------|
| pick_wood | 3 | 30 | 0 |
| pick_stone | 2-3 | 60 | 0 |
| pick_steel | 1-3 | 90 | 0 |
| pick_steel_l1 | 1-3 | 90 | 1 |
| pick_steel_l2 | 1-3 | 90 | 2 |
| pick_mese | 1-3 (0.0s) | 무한 | 255 |

#### 삽 (crumbly)

| 도구 | 레벨 | 사용 횟수 |
|------|------|-----------|
| shovel_wood | 3 | 30 |
| shovel_stone | 2-3 | 60 |
| shovel_steel | 1-3 | 90 |

#### 도끼 (choppy)

| 도구 | 레벨 | 사용 횟수 |
|------|------|-----------|
| axe_wood | 3 | 30 |
| axe_stone | 2-3 | 60 |
| axe_steel | 1-3 | 90 |

#### 전설의 검 (damage)

| 도구 | fleshy | FPI |
|------|--------|-----|
| sword_wood | 2 | 1.0 |
| sword_stone | 5 | 1.0 |
| sword_steel | 10 | 1.0 |
| sword_titanium | 100 | 1.0 |
| sword_blood | 1000 | 1.0 |
| sword_mese | 32767 (fiery/icy 포함) | 0.0 |

#### 치유 무기

| 도구 | fleshy |
|------|--------|
| dagger_heal | -1 |
| sword_heal | -10 |
| sword_heal_super | -32768 (모든 그룹) |

## 5. DevTest 게임 - 기타 모드

### 5.1 bucket 모드

- `bucket:bucket`: 도구, stack_max=1, liquids_pointable=true
- on_use: 액체 소스 파괴 → 아이템으로 획득

### 5.2 chest 모드

- `chest:chest`: paramtype2=4dir, 32슬롯 (8×4)
- Formspec: 8×4 상자 + 8×4 플레이어 인벤토리
- 메타데이터 인벤토리 제한 (put=10, take=20, move=30)

### 5.3 stairs 모드

- 계단: 하단 절반 + 상단 뒤쪽 1/4 (facedir)
- 반블록: 하단 절반 (-0.5 to 0.0)
- 등록: stone, desert_stone, cobble

### 5.4 give_initial_stuff 모드

신규 플레이어 초기 아이템:

1. basetools:pick_mese
2. basetools:axe_steel
3. basetools:shovel_steel
4. bucket:bucket
5. testnodes:light14
6. chest_of_everything:bag

## 6. 텍스처 에셋

### 6.1 basenodes 텍스처 (36개)

default_stone, default_desert_stone, default_dirt, default_sand, default_grass, default_snow, default_ice, default_tree, default_leaves, default_water, default_lava 등

### 6.2 basetools 텍스처 (32개)

basetools_woodpick, basetools_steelpick, basetools_mesepick, basetools_woodsword, basetools_steelsword 등

### 6.3 베이스 팩 텍스처 (96개)

**UI/아이콘:** logo, menu_header, player, wieldhand, heart, bubble

**서버 브라우저:** server_favorite, server_public, server_ping_1-4

**HUD 버튼:** dig_btn, place_btn, fly_btn, fast_btn, camera_btn, minimap_btn

**미니맵:** minimap_mask_round/square, minimap_overlay_round/square

## 7. 셰이더 프로그램 (25개)

| 셰이더 | 정점 | 프래그먼트 | 용도 |
|--------|------|-----------|------|
| nodes_shader | .glsl | .glsl | 월드 노드 |
| object_shader | .glsl | .glsl | 엔티티 |
| inventory_shader | .glsl | .glsl | 인벤토리 |
| minimap_shader | .glsl | .glsl | 미니맵 |
| cloud_shader | .glsl | .glsl | 구름 |
| stars_shader | .glsl | .glsl | 별 |
| selection_shader | .glsl | .glsl | 선택 하이라이트 |
| shadow/pass1 | .glsl | .glsl | 그림자 맵 |
| second_stage | .glsl | .glsl | 후처리 |
| fxaa | .glsl | .glsl | 안티에일리어싱 |
| extract_bloom | .glsl | .glsl | 블룸 추출 |
| bloom_downsample | .glsl | .glsl | 블룸 다운 |
| bloom_upsample | .glsl | .glsl | 블룸 업 |
| volumetric_light | .glsl | .glsl | 신광 |
| update_exposure | .glsl | .glsl | 자동 노출 |

## 8. FormSpec GUI 시스템

### 8.1 엘리먼트 타입

| 엘리먼트 | 파서 | 설명 |
|----------|------|------|
| `size[]` | parseSize | 폼 크기 |
| `container[]` | parseContainer | 컨테이너 |
| `list[]` | parseList | 인벤토리 목록 |
| `listring[]` | parseListRing | 목록 순환 |
| `checkbox[]` | parseCheckbox | 체크박스 |
| `image[]` | parseImage | 이미지 |
| `button[]` | parseButton | 버튼 |
| `field[]` | parseField | 텍스트 입력 |
| `textarea[]` | parseField | 여러 줄 입력 |
| `pwdfield[]` | parsePwdField | 비밀번호 입력 |
| `dropdown[]` | parseDropDown | 드롭다운 |
| `table[]` | parseTable | 테이블 |
| `tabheader[]` | parseTabHeader | 탭 헤더 |
| `scrollbar[]` | parseScrollBar | 스크롤바 |
| `box[]` | parseBox | 색상 박스 |
| `label[]` | parseLabel | 텍스트 라벨 |
| `tooltip[]` | parseTooltip | 툴팁 |
| `model[]` | parseModel | 3D 모델 뷰 |
| `hypertext[]` | parseHyperText | 하이퍼텍스트 |
| `animated_image[]` | parseAnimatedImage | 애니메이션 이미지 |
| `background[]` | parseBackground | 배경 |
| `item_image[]` | parseItemImage | 아이템 이미지 |
| `style[]` | parseStyle | 스타일 |
| `bgcolor[]` | parseBackgroundColor | 배경색 |

## 9. 서버 설정 (`minetest.conf.example`)

### 9.1 물리 설정

| 설정 | 기본값 | 설명 |
|------|--------|------|
| movement_acceleration_default | 3.0 | 지면 가속도 |
| movement_acceleration_air | 2.0 | 공중 가속도 |
| movement_acceleration_fast | 10.0 | 빠른 모드 가속도 |
| movement_speed_walk | 4.0 | 걷기 속도 |
| movement_speed_crouch | 1.35 | 웅크리기 속도 |
| movement_speed_fast | 20.0 | 빠른 모드 속도 |
| movement_speed_climb | 3.0 | 오르기 속도 |
| movement_speed_jump | 6.5 | 점프 속도 |
| movement_liquid_fluidity | 1.0 | 액체 유동성 |
| movement_liquid_sink | 10.0 | 가라앉는 속도 |
| movement_gravity | 9.81 | 중력 |

### 9.2 클라이언트 렌더링

| 설정 | 기본값 | 설명 |
|------|--------|------|
| fps_max | 60 | 최대 FPS |
| viewing_range | 190 | 시야 거리 |
| fov | 72 | 시야각 |
| enable_dynamic_shadows | false | 동적 그림자 |
| enable_post_processing | true | 후처리 |
| enable_bloom | false | 블룸 |
| tone_mapping | reinhard | 톤매핑 |
| antialiasing | none | 안티에일리어싱 |
| translucent_liquids | true | 반투명 액체 |
| leaves_style | fancy | 나뭇잎 스타일 |
| smooth_lighting | true | 부드러운 조명 |
| enable_waving_leaves | false | 나뭇잎 흔들림 |
| enable_waving_plants | false | 식물 흔들림 |
| enable_waving_water | false | 물결 |

### 9.3 서버 설정

| 설정 | 기본값 | 설명 |
|------|--------|------|
| max_users | 15 | 최대 플레이어 |
| port | 30000 | UDP 포트 |
| default_privs | interact, shout | 기본 권한 |
| disallow_empty_password | false | 빈 비밀번호 금지 |
| max_block_generate_distance | 10 | 블록 생성 거리 |
| chat_message_max_size | 500 | 채팅 최대 크기 |
| chat_message_limit_per_10sec | 8.0 | 10초당 채팅 제한 |

### 9.4 보안 설정

| 설정 | 기본값 | 설명 |
|------|--------|------|
| csm_restriction_flags | 62 | CSM 제한 비트마스크 |
| anticheat_flags | all | 안티치트 플래그 |
| anticheat_movement_tolerance | 1.0 | 이동 치트 허용 오차 |
| strip_color_codes | true | 색상 코드 제거 |

## 10. 레거시 노드 ID 매핑 (v19 이하)

| ID | 이름 | ID | 이름 |
|----|------|----|------|
| 0 | default:stone | 0x800 | default:dirt_with_grass |
| 2 | default:water_flowing | 0x801 | default:tree |
| 3 | default:torch | 0x802 | default:leaves |
| 9 | default:water_source | 0x805 | default:dirt |
| 15 | default:chest | 0x809 | default:sand |
| 16 | default:furnace | 0x80c | default:glass |
| 33 | default:lava_source | 0x80e | default:gravel |
