# 05 - 게임플레이 시스템 (거시적 설계)

## 포팅 방향성

Minetest의 Lua 기반 게임플레이 로직(builtin + mods)을 **C# 하드코딩 + JSON 데이터 구동**으로 포팅합니다.
Lua의 동적 등록/후킹 패턴은 정적 메서드 호출과 JSON 설정으로 대체합니다.

## 시스템 맵핑 (거시적)

```
Minetest (Lua + C++)                 웹 프로젝트 (C# + JSON)
─────────────────────                ─────────────────────
builtin/game/register.lua           BlockDefinitionManager (blocks.json)
builtin/game/item.lua               CraftingSystem (items.json)
builtin/game/auth.lua                AuthenticationService.cs
builtin/game/privileges.lua         PrivilegeSystem.cs (privileges.json)
builtin/game/chat.lua                ChatCommandManager.cs
builtin/game/falling.lua            ActiveBlockModifierSystem.cs
builtin/game/item_entity.lua        EntityManager.cs
builtin/game/knockback.lua          KnockbackSystem.cs
builtin/game/constants.lua          game_constants.json
builtin/game/features.lua           (컴파일 타임 결정)
src/craftdef.cpp                     CraftingSystem.cs + GridCraftingSystem.cs
src/inventory.h                      Inventory.cs
src/tool.cpp                         ToolWearSystem.cs
```

## 제작 시스템

### 포팅 전략
Minetest의 해시 기반 매칭(`craftdef.cpp`)을 JSON 레시피 순회 매칭으로 단순화.

| Minetest 레시피 타입 | 웹 프로젝트 대응 |
|--------------------|-----------------|
| Shaped (형태 있는) | `CraftingSystem` (재료 목록 매칭) |
| Shapeless (형태 없는) | `CraftingSystem` (재료 목록 매칭) |
| ToolRepair (도구 수리) | `CraftingSystem` (동일 도구 2개 매칭) |
| Cooking (제련) | `SmeltingSystem` (별도 시스템) |
| Fuel (연료) | `SmeltingSystem` (연료 레지스트리) |
| Grid (그리드 패턴) | `GridCraftingSystem` (패턴 오프셋 매칭) |

### 수리 공식 (Minetest와 동일)
```
new_wear = 65536 - (item1_uses + item2_uses) + round(bonus * 65536)
bonus = 0.1 (10% 추가 내구도)
```

## 도구 시스템

### 등급 체계

| 등급 | 채굴 레벨 | 내구도 | 채굴 속도 | 데미지 |
|------|----------|--------|----------|--------|
| Wooden | 1 | 60 | 2.0 | 1-4 |
| Stone | 2 | 132 | 4.0 | 2-5 |
| Iron | 3 | 251 | 6.0 | 3-6 |
| Steel | 3 | 400 | 6.0 | 4-6 |
| Diamond | 4 | 1562 | 8.0 | 4-7 |
| Mese | 255 | 1337 | 10.0 | 100 |
| Gold | 2 | 32 | 12.0 | 1 |

### 내구도 스케일
Minetest의 **65536 스케일** 유지 (0=새것, 65535=파손).
`ItemStack.metadata` 문자열로 직렬화.

## 전투 시스템

| 데미지 소스 | 수치 | Minetest 대응 |
|-----------|------|-------------|
| 주먹 | 1 | `builtin/game/knockback.lua` |
| 도구 | 1-7 | 도구의 `punch_attack_uses` 기반 |
| 추락 | (거리-3)*1.0 | `lua_api/l_player.cpp` (set_hp) |
| 용암 | 4/틱 | `nodedef.cpp` (damage_per_second) |
| 익사 | 1/틱 | `localplayer.cpp` (breathing) |
| 굶주림 | 0.5/틱 | `player_sao.cpp` (hunger) |

### 넉백
`builtin/game/knockback.lua`의 공식 포팅:
```
knockback = basedamage * distance_factor
```

## 배고픔 시스템

| 항목 | 값 |
|------|-----|
| 최대 식량 | 20 |
| 포만 > 18 | 0.2 HP/틱 회복, 포만 -0.5 |
| 포만 = 0 | 0.5 데미지/틱 (굶주림) |
| 포만 드레인 | 포만도 0.01/틱, 식량 0.05/틱 (포만도=0시) |

## 호흡 시스템

| 항목 | 값 |
|------|-----|
| 최대 호흡 | 10 |
| 수중 감소 | 0.05/틱 |
| 호흡=0 | 1 데미지/틱 (익사) |
| 수외 회복 | 0.2/틱 |

## 몹 시스템

### AI 상태 머신
```
Idle -> (플레이어 감지) -> Chase -> (공격 범위) -> Attack -> (쿨다운) -> Chase
Passive: Hit -> Flee (반대 방향, 속도 증가)
```

### 스폰 규칙
| 항목 | 적대적 | 수동적 |
|------|--------|--------|
| 시간 | 밤 (13000-23000틱) | 낮 |
| 지면 | 임의 | Grass 블록 |
| 최대 | 50마리 | - |
| 디스폰 | 128블록 이상 | 128블록 이상 |
| 주기 | 10초 | 10초 |

## 낮/밤 사이클

| 단계 | 틱 범위 | 하늘 밝기 |
|------|--------|----------|
| 새벽 | 4500-6000 | 0.2 -> 1.0 |
| 낮 | 6000-16500 | 1.0 |
| 해질녘 | 16500-18000 | 1.0 -> 0.2 |
| 밤 | 18000-4500 | 0.2 |

전체 주기: 24,000 게임 틱

## 인터랙티브 블록

| 블록 | 상호작용 | UI |
|------|---------|-----|
| Chest | 27슬롯 저장 | 상자 UI |
| Furnace | 제련 | 화로 UI (진행바) |
| CraftingTable | 제작 목록 | 제작 UI |
| DoorWood | 열림/닫힘 토글 | (애니메이션) |
| Bed | 스폰포인트 설정 | (메시지) |
| Sign | 텍스트 입력 | 텍스트 프롬프트 |
| NoteBlock | 소리 재생 | (Web Audio) |
| TNT | 폭발 | (반경 3 파괴) |

## 권한 시스템

19 권한 (`privileges.json`):

| 권한 | 기본 부여 | 설명 |
|------|----------|------|
| interact | O | 블록 상호작용 |
| shout | O | 채팅 |
| fly | X | 비행 |
| teleport | X | 텔레포트 |
| fast | X | 빠른 모드 |
| noclip | X | 노클립 |
| kick | X | 플레이어 추방 |
| ban | X | 플레이어 밴 |
| give | X | 아이템 지급 |
| server | X | 서버 관리 |
| ... | | |

## 상세 구현 참조

| 주제 | 참조 문서 |
|------|---------|
| 제작 시스템 해시/매칭 알고리즘 | `web/docs/reference/game-content.md` (craftdef) |
| 인벤토리 직렬화/액션 | `web/docs/reference/game-content.md` (inventory) |
| DevTest 도구/블록 정의 | `web/docs/reference/game-content.md` (basetools) |
| FormSpec GUI 요소 | `web/docs/reference/game-content.md` (formspec) |
| 물리/채팅 설정값 | `web/docs/reference/game-content.md` (settings) |
| Lua builtin 함수들 | `web/docs/reference/scripting-modding.md` |
