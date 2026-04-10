# Game Systems

## Block Types

101→161 block types defined in `BlockType.cs` enum and `blocks.json` (IDs 0-160):

| ID | Type | ID | Type | ID | Type |
|----|------|----|------|----|------|
| 0 | Air | 34 | Clay | 67 | HayBale |
| 1 | Stone | 35 | SandStone | 68 | DesertStone |
| 2 | Dirt | 36 | Obsidian | 69 | DirtWithSnow |
| 3 | Grass | 37 | Cactus | 70 | JungleGrass |
| 4 | Water | 38 | SugarCane | 71 | JungleWood |
| 5 | Sand | 39 | Pumpkin | 72 | JungleLeaves |
| 6 | Wood | 40 | Melon | 73 | PineWood |
| 7 | Leaves | 41 | Mycelium | 74 | PineNeedles |
| 8 | Glass | 42 | Farmland | 75 | RiverWater |
| 9 | Brick | 43 | WaterFlowing | 76 | CobblestoneSlab |
| 10 | OreIron | 44 | LavaFlowing | 77 | WoodSlab |
| 11 | Coal | 45 | CoalOre | 78 | StoneSlab |
| 12 | Bedrock | 46 | MossyCobblestone | 79 | BrickBlock |
| 13 | Snow | 47 | IronBlock | 80 | ClayBlock |
| 14 | Ice | 48 | GoldBlock | 81 | SnowLayer |
| 15 | Lava | 49 | DiamondBlock | 82-100 | MossyStone..CoarseDirt |
| 16 | Torch | 50-61 | Wool colors | | |
| 17 | Ladder | 62 | GlowingObsidian | | |
| 18 | Fence | 63 | Apple | | |
| 19 | DoorWood | 64-66 | Crops (Wheat/Carrot/Potato) | | |
| 20 | Chest | | | | |
| 21 | CraftingTable | | | | |
| 22 | Furnace | | | | |
| 23 | OreGold | | | | |
| 24 | OreDiamond | | | | |
| 25 | Planks | | | | |
| 26 | Cobblestone | | | | |
| 27 | StoneBrick | | | | |
| 28-33 | Wool (White/Red/Blue/Green) + Bookshelf, Gravel | 82-100 | MossyStone..CoarseDirt | 101-160 | DesertSand, RiverWater, Ore variants (Gold/Lapis/Emerald/Redstone/Copper), Storage blocks, Stairs/Slabs, Decorative, Flowers, Mushrooms, Utility, Light sources, Fire, Cobweb | | | | |

### Block Groups
Blocks have groups that determine tool effectiveness:
- `cracky`: Mined by pickaxe (stone, ores, etc.)
- `choppy`: Mined by axe (wood, planks, etc.)
- `crumbly`: Mined by shovel (dirt, sand, gravel)
- `snappy`: Mined by sword (leaves, etc.)
- `dig_immediate`: Instant break (0.15s dig time)
- `oddly_breakable_by_hand`: Breakable by hand at 1x speed

## Biome System

4 biomes loaded from `biomes.json`, selected by heat/humidity noise in `NoiseWorldGenerator`:

| Biome | Description | Surface Block | Tree Types |
|-------|-------------|---------------|------------|
| Grassland | Default temperate biome | Grass | Oak, Birch |
| Desert | Hot, dry biome | DesertSand | None (cactus) |
| Snow | Cold biome | DirtWithSnow | Pine |
| Ocean | Deep water biome | Sand (below water) | None |

Biome selection uses two independent Perlin noise maps (heat and humidity), matching minetest's biome selection approach.

## World Generation

### Terrain
- Base height: Y=32, with Perlin noise variation (Height=20)
- Water level: Y=28
- Biome-based surface blocks and vegetation

### Ore Distribution (9 types)
| Ore | Max Y | Rarity | Cluster Size |
|-----|-------|--------|-------------|
| Diamond | 16 | Rare | 1-2 |
| Emerald | 32 | Very Rare | 1 |
| Gold | 32 | Uncommon | 1-3 |
| Lapis | 32 | Uncommon | 1-5 |
| Redstone | 16 | Uncommon | 1-5 |
| Iron | 48 | Common | 1-4 |
| Copper | 48 | Common | 1-6 |
| Coal | 64 | Very Common | 1-6 |

### New Block Categories (IDs 101-160)
- **Ore variants**: gold_ore, lapis_ore, emerald_ore, redstone_ore, copper_ore
- **Storage blocks**: gold_block (existing), lapis_block, redstone_block, copper_block
- **Stairs/Slabs**: For all wood types (oak, birch, pine, jungle) and stone variants
- **Decorative**: various colored blocks, wool extensions
- **Flowers & Mushrooms**: rose, dandelion, tulips, red/brown mushroom
- **Utility blocks**: blast_furnace, smoker, barrel, loom, stonecutter, fletching_table
- **Light sources**: lantern, soul_torch, campfire, glowstone
- **Special blocks**: fire, cobweb

### Special Weapons & Tools
| Weapon | Damage | Special Effect |
|--------|--------|---------------|
| Fire Sword | High | Fire damage on hit |
| Ice Sword | High | Slowing effect |
| Blood Sword | High | Lifesteal |
| Heal Sword | Medium | Heals on hit |
| Elemental Sword | Very High | Multi-element damage |
| Daggers (various) | Medium | Fast attack speed |
| Steel Shears | - | Shears sheep/leaves |

## Crafting Recipes

125+ recipes from `web/data/items.json`. Key categories:

### Tools
| Result | Ingredients |
|--------|-------------|
| Wooden Pickaxe | 3 Planks + 2 Sticks |
| Stone Pickaxe | 3 Cobblestone + 2 Sticks |
| Iron Pickaxe | 3 Iron Ingot + 2 Sticks |
| Diamond Pickaxe | 3 Diamond + 2 Sticks |
| Wooden/Stone/Iron/Diamond Sword, Axe, Shovel, Hoe | Same pattern |
| Mese Pickaxe | 3 Diamond + 2 Sticks (damage 100) |
| Steel Pickaxe/Sword/Axe/Shovel | 3/2 Steel Ingot + Sticks |

### Building Blocks
| Result | Ingredients |
|--------|-------------|
| Planks (x4) | 1 Wood |
| Stick (x4) | 2 Planks |
| Crafting Table | 4 Planks |
| Furnace | 8 Cobblestone |
| Chest | 8 Planks |
| Torch (x4) | 1 Coal/Charcoal + 1 Stick |
| Ladder (x3) | 7 Sticks |
| Fence (x3) | 2 Planks + 2 Sticks |
| Door (Wood) | 6 Planks |
| Stone Brick (x4) | 4 Stone |
| Sandstone (x4) | 4 Sand |
| Slabs (x6) | 3 of base block |
| Wool (White) | 4 String |
| Wool (Colored) | White Wool + dye |

### Resources & Armor
| Result | Ingredients |
|--------|-------------|
| Iron/Diamond/Leather Armor | 5/8/7/4 Ingots/Leather |
| Golden Apple | 1 Apple + 8 Gold Ingot |
| Bucket | 3 Iron Ingot |
| Glowstone | 4 Glowstone Dust |
| Sea Lantern | 4 Prismarine Shard + 3 Prismarine Crystals |
| Redstone Lamp | 4 Redstone + 1 Glowstone Dust |

### Food
| Result | Ingredients |
|--------|-------------|
| Bread | 3 Wheat |
| Cake | 3 Iron Ingot + 3 Wheat + 1 Egg + 2 Sugar |
| Cookie (x8) | 2 Wheat + 1 Iron Ingot |
| Mushroom Stew | 1 Red + 1 Brown Mushroom + 1 Bowl |
| Hay Bale | 9 Wheat |

## Smelting Recipes

25 recipes from `web/data/smelting.json`. All cook in 10 seconds except wood (15s).

| Input | Output | XP |
|-------|--------|-----|
| Ore Iron | Iron Ingot | 0.7 |
| Ore Gold | Gold Ingot | 1.0 |
| Sand | Glass | 0.1 |
| Cobblestone | Stone | 0.1 |
| Raw Beef | Cooked Porkchop | 0.35 |
| Raw Chicken | Cooked Chicken | 0.35 |
| Raw Pork | Cooked Pork | 0.35 |
| Raw Mutton | Cooked Mutton | 0.35 |
| Raw Fish | Cooked Fish | 0.35 |
| Wood | Coal (Charcoal) | 0.15 |
| Stone Brick | Stone | 0.1 |
| Clay Block/Ball | Brick | 0.3 |
| Iron/Gold/Diamond Block | Ingot/Diamond | 0.1 |
| Potato | Baked Potato | 0.35 |

Fuel: Coal or Charcoal (1 per operation).

## Tool Tiers

| Material | Max Level | Durability | Mining Speed | Damage |
|----------|-----------|------------|-------------|--------|
| Wooden | 1 | 60 | 2.0 | 1 |
| Stone | 2 | 132 | 4.0 | 2 |
| Iron | 3 | 251 | 6.0 | 3 |
| Steel | 3 | 400 | 6.0 | 4 |
| Diamond | 4 | 1562 | 8.0 | 4 |
| Mese | 255 | 1337 | 10.0 | 100 |

Tool types and their block groups:
- **Pickaxe**: `cracky` blocks (stone, ores, bricks)
- **Axe**: `choppy` blocks (wood, planks)
- **Shovel**: `crumbly` blocks (dirt, sand, gravel)
- **Sword**: `snappy` blocks (leaves)
- **Hoe**: `crumbly` blocks

### Tool Repair
- Damaged tools can be repaired by combining two tools of the same type and material in the crafting grid
- Result: one tool with combined durability plus a 10% bonus
- Repairable via standard crafting (no special UI required)
- Both input tools are consumed in the process

### Weapon Damage (PunchPlayer)
| Weapon | Damage |
|--------|--------|
| Wooden Sword | 4 |
| Stone Sword | 5 |
| Iron Sword | 6 |
| Diamond Sword | 7 |
| Wooden/Stone/Iron/Diamond Axe | 3/4/5/6 |
| Wooden/Stone/Iron/Diamond Pickaxe | 2/3/4/5 |
| Other | 1 |

## Food and Hunger

### Hunger System
- Max food level: 20
- Food level > 18: heals 0.2 HP/tick, costs 0.5 saturation
- Food level <= 0: deals 0.5 damage/tick (starvation)

### Food Values
| Food | Nutrition | Saturation |
|------|-----------|------------|
| Apple | 4 | 2.4 |
| Bread | 5 | 6.0 |
| Raw Beef | 3 | 1.8 |
| Cooked Porkchop | 8 | 12.8 |
| Cooked Chicken | 6 | 7.2 |
| Cooked Pork | 8 | 12.8 |
| Cookie | 2 | 0.4 |
| Cake | 14 | 2.8 |
| Mushroom Stew | 6 | 7.2 |
| Carrot | 3 | 3.6 |
| Baked Potato | 5 | 6.0 |
| Melon Slice | 2 | 1.2 |
| Golden Apple | 4 | 9.6 |
| Rabbit Stew | 10 | 12.0 |

### Food Effects (UseItem hub method)
- Food items: heal 2 HP + feed 4 hunger
- Milk Bucket: heal 4 HP, returns empty bucket
- Water/Lava Bucket: returns empty bucket

## Combat and Damage

### Damage Sources
- **Player punch**: 1-7 based on held tool
- **Fall damage**: `(fallDistance - 3.0) * 1.0` (threshold: 3 blocks)
- **Lava**: 4 damage/tick (configurable per block via `BlockDefinition.Damage`)
- **Starvation**: 0.5 damage/tick when food level is 0
- **Drowning**: 1 damage/tick when breath reaches 0

### Knockback
Calculated by `KnockbackSystem` based on attacker-to-target distance and damage amount. Applied as velocity impulse on client.

### Death
- Health reaches 0 → drops entire inventory + armor as entities
- Creative mode players are immune to damage
- Respawn at (0, groundHeight+2, 0)

### Breath System
- Max breath: 10
- In drowning blocks (water): breath decreases by 0.05/tick
- Breath 0 → 1 damage/tick (drowning)
- Out of water: breath regenerates at 0.2/tick

## Agriculture

### Crops
- Wheat, Carrot, Potato crops (BlockType 64-66)
- Growth rate controlled by `AgricultureSystem.GrowAllCrops()`
- Harvested crops drop corresponding items

### Farmland
- Created by hoeing grass/dirt
- Requires nearby water (4-block radius) to stay moist
- Node timer: reverts to dirt after 30 seconds without water

## Mob Spawning

### Mob Types
| Type | Min Y | Max Y | Weight |
|------|-------|-------|--------|
| Zombie | -20 | 40 | 3.0 |
| Skeleton | -20 | 40 | 2.0 |
| Spider | -10 | 50 | 2.0 |
| Cow | 30 | 60 | 3.0 |
| Pig | 30 | 60 | 3.0 |
| Chicken | 30 | 60 | 2.0 |

- Spawn interval: 10 seconds
- Max mobs: 50
- Despawn distance: 128 blocks from all players
- Spawn height validation: mobs only spawn at valid Y ranges and on solid ground
- Spawn surface check: avoids spawning inside blocks or on invalid surfaces
- Hostile mobs attack nearby players (AI pathfinding)

## Day/Night Cycle

| Phase | Tick Range | Brightness |
|-------|-----------|------------|
| Dawn | 4500-6000 | 0.2 → 1.0 (linear) |
| Day | 6000-16500 | 1.0 |
| Dusk | 16500-18000 | 1.0 → 0.2 (linear) |
| Night | 18000-4500 | 0.2 |

Full cycle: 24,000 ticks. Time broadcast to clients every 100 ticks.

Client effects:
- Sky brightness < 0.3 → rain triggers
- Cave darkness overlay when underground with no sky access

## Physics Constants

From `server_config.json` / `PhysicsEngine.cs`:

| Constant | Value |
|----------|-------|
| Gravity | 20.0 m/s^2 |
| Jump Force | 8.0 m/s |
| Walk Speed | 5.0 m/s (client) / 4.317 m/s (server) |
| Sprint Speed | 8.0 m/s |
| Fly Speed | 12.0 m/s |
| Climb Speed | 2.0 m/s |
| Terminal Velocity | 50.0 m/s |
| Player Width | 0.6 m |
| Player Height | 1.8 m |
| Drag | 0.1 |
| Liquid Drag | 0.8 |
| Fall Damage Threshold | 3.0 blocks |
| Fall Damage Multiplier | 1.0 |

### Movement Modes
- **Walking**: Horizontal movement + gravity, jump when on ground
- **Sprinting**: 8.0 m/s, same physics
- **Flying**: No gravity, 6-directional movement at 12.0 m/s
- **Climbing** (ladder): Reduced speed (50%), vertical movement only
- **Swimming** (liquid): Reduced speed (50%), reduced gravity (20%), upward with jump

## Server Physics Validation

The server validates all client movement to prevent cheating and desync:

### Validation Checks
- **Speed limit**: Client position change per tick cannot exceed max speed (walk: 5.0, sprint: 8.0, fly: 12.0 m/s)
- **Teleportation detection**: Large position deltas beyond speed limits are rejected
- **Collision boundaries**: Server checks the target position for solid block collisions
- **Flying consistency**: Clients must have fly privilege to move without gravity
- **Fall damage**: Server tracks fall distance independently for accurate damage calculation

### Position Correction
- When validation fails, server sends `OnPositionCorrection` with the last known valid position
- Client interpolates to the corrected position to avoid visual snapping
- Correction threshold: 0.5 blocks positional difference triggers correction
- Rotation (yaw/pitch) is client-authoritative (not validated by server)
