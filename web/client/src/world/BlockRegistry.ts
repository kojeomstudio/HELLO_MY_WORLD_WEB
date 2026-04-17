export interface BlockDefinition {
    id: number;
    name: string;
    solid: boolean;
    transparent: boolean;
    color: string;
    textureName?: string;
    drawType?: string;
    liquid?: boolean;
    light?: number;
    hardness?: number;
    drops?: string;
    climbable?: boolean;
    damage?: number;
    breakable?: boolean;
    interactive?: boolean;
    drowning?: boolean;
    falling?: boolean;
    bouncy?: number;
    slippery?: boolean;
    moveResistance?: number;
    postEffectColor?: string;
    groups?: Record<string, number>;
    soundGroup?: string;
    liquidRange?: number;
    liquidViscosity?: number;
    liquidRenewable?: boolean;
    level?: number;
    maxLevel?: number;
}

export class BlockRegistry {
    private blocks: Map<number, BlockDefinition> = new Map();
    private byName: Map<string, BlockDefinition> = new Map();

    constructor() {
        this.loadDefaults();
    }

    private loadDefaults(): void {
        const defaultBlocks: BlockDefinition[] = [
            { id: 0, name: 'air', solid: false, transparent: true, color: '#000000' },
            { id: 1, name: 'stone', solid: true, transparent: false, color: '#808080', hardness: 1.5, drops: 'cobblestone', textureName: 'default_stone' },
            { id: 2, name: 'dirt', solid: true, transparent: false, color: '#8B4513', hardness: 0.5, textureName: 'default_dirt' },
            { id: 3, name: 'grass', solid: true, transparent: false, color: '#228B22', hardness: 0.6, textureName: 'default_grass' },
            { id: 4, name: 'water', solid: false, transparent: true, color: '#4169E1', liquid: true, textureName: 'default_water' },
            { id: 5, name: 'sand', solid: true, transparent: false, color: '#F4A460', hardness: 0.5, textureName: 'default_sand' },
            { id: 6, name: 'wood', solid: true, transparent: false, color: '#DEB887', hardness: 2.0, textureName: 'default_tree' },
            { id: 7, name: 'leaves', solid: true, transparent: true, color: '#32CD32', hardness: 0.2, textureName: 'default_leaves' },
            { id: 8, name: 'glass', solid: true, transparent: true, color: '#ADD8E6', hardness: 0.3, textureName: 'default_glass' },
            { id: 9, name: 'brick', solid: true, transparent: false, color: '#B22222', hardness: 2.0, textureName: 'default_brick' },
            { id: 10, name: 'ore_iron', solid: true, transparent: false, color: '#C4A882', hardness: 3.0, drops: 'iron_ingot', textureName: 'default_iron_ore' },
            { id: 11, name: 'coal', solid: true, transparent: false, color: '#2F4F4F', hardness: 3.0, textureName: 'default_coal_ore' },
            { id: 12, name: 'bedrock', solid: true, transparent: false, color: '#1C1C1C', breakable: false, textureName: 'default_bedrock' },
            { id: 13, name: 'snow', solid: true, transparent: false, color: '#FFFAFA', hardness: 0.2, textureName: 'default_snow' },
            { id: 14, name: 'ice', solid: true, transparent: true, color: '#B0E0E6', hardness: 0.5, textureName: 'default_ice' },
            { id: 15, name: 'lava', solid: false, transparent: true, color: '#FF4500', liquid: true, damage: 4, textureName: 'default_lava' },
            { id: 16, name: 'torch', solid: false, transparent: true, color: '#FFD700', light: 14, textureName: 'default_torch' },
            { id: 17, name: 'ladder', solid: false, transparent: true, color: '#8B4513', climbable: true, textureName: 'default_ladder' },
            { id: 18, name: 'fence', solid: true, transparent: true, color: '#8B4513', hardness: 2.0, textureName: 'default_fence' },
            { id: 19, name: 'door_wood', solid: true, transparent: true, color: '#8B6914', interactive: true, hardness: 3.0, textureName: 'default_door_wood' },
            { id: 20, name: 'chest', solid: true, transparent: false, color: '#8B4513', interactive: true, hardness: 2.5, textureName: 'default_chest' },
            { id: 21, name: 'crafting_table', solid: true, transparent: false, color: '#D2691E', interactive: true, hardness: 2.5, textureName: 'default_crafting_table_front' },
            { id: 22, name: 'furnace', solid: true, transparent: false, color: '#696969', interactive: true, hardness: 3.5, textureName: 'default_furnace' },
            { id: 23, name: 'ore_gold', solid: true, transparent: false, color: '#FFD700', hardness: 3.0, drops: 'gold_ingot', textureName: 'default_gold_ore' },
            { id: 24, name: 'ore_diamond', solid: true, transparent: false, color: '#00FFFF', hardness: 3.0, drops: 'diamond', textureName: 'default_diamond_ore' },
            { id: 25, name: 'planks', solid: true, transparent: false, color: '#BC8F5A', hardness: 2.0, textureName: 'default_planks' },
            { id: 26, name: 'cobblestone', solid: true, transparent: false, color: '#6B6B6B', hardness: 2.0, textureName: 'default_cobble' },
            { id: 27, name: 'stone_brick', solid: true, transparent: false, color: '#777777', hardness: 1.5, textureName: 'default_stone_brick' },
            { id: 28, name: 'wool_white', solid: true, transparent: false, color: '#EEEEEE', hardness: 0.8, textureName: 'default_wool_white' },
            { id: 29, name: 'wool_red', solid: true, transparent: false, color: '#CC2222', hardness: 0.8, textureName: 'default_wool_red' },
            { id: 30, name: 'wool_blue', solid: true, transparent: false, color: '#2222CC', hardness: 0.8, textureName: 'default_wool_blue' },
            { id: 31, name: 'wool_green', solid: true, transparent: false, color: '#22CC22', hardness: 0.8, textureName: 'default_wool_green' },
            { id: 32, name: 'bookshelf', solid: true, transparent: false, color: '#C4A050', hardness: 1.5, textureName: 'default_bookshelf' },
            { id: 33, name: 'gravel', solid: true, transparent: false, color: '#888078', hardness: 0.6, falling: true, groups: { crumbly: 3 }, soundGroup: 'gravel', textureName: 'default_gravel' },
            { id: 34, name: 'clay', solid: true, transparent: false, color: '#9BA5B0', hardness: 0.6, groups: { crumbly: 3 }, soundGroup: 'dirt', textureName: 'default_clay' },
            { id: 35, name: 'sandstone', solid: true, transparent: false, color: '#E8D5A3', hardness: 0.8, groups: { cracky: 3 }, soundGroup: 'sand', textureName: 'default_sandstone' },
            { id: 36, name: 'obsidian', solid: true, transparent: false, color: '#1A0A2E', hardness: 50.0, groups: { cracky: 5 }, soundGroup: 'stone', textureName: 'default_obsidian' },
            { id: 37, name: 'cactus', solid: true, transparent: false, color: '#0A5C0A', hardness: 0.4, damage: 1, groups: { choppy: 2 }, soundGroup: 'wood', textureName: 'default_cactus' },
            { id: 38, name: 'sugar_cane', solid: false, transparent: true, color: '#90EE90', hardness: 0.2, soundGroup: 'grass', textureName: 'default_sugar_cane' },
            { id: 39, name: 'pumpkin', solid: true, transparent: false, color: '#FF8C00', hardness: 1.0, groups: { choppy: 2 }, soundGroup: 'wood', textureName: 'default_pumpkin' },
            { id: 40, name: 'melon', solid: true, transparent: false, color: '#5C8A1E', hardness: 1.0, drops: 'melon_slice', groups: { choppy: 2 }, soundGroup: 'wood', textureName: 'default_melon' },
            { id: 41, name: 'mycelium', solid: true, transparent: false, color: '#6B5A8A', hardness: 0.6, drops: 'dirt', groups: { crumbly: 3 }, soundGroup: 'dirt', textureName: 'default_mycelium_top' },
            { id: 42, name: 'farmland', solid: true, transparent: false, color: '#6B4E2A', hardness: 0.6, groups: { crumbly: 3 }, soundGroup: 'dirt', textureName: 'default_farmland' },
            { id: 43, name: 'water_flowing', solid: false, transparent: true, color: '#4169E1', liquid: true, drowning: true, soundGroup: 'water', textureName: 'default_water_flowing' },
            { id: 44, name: 'lava_flowing', solid: false, transparent: true, color: '#FF4500', liquid: true, damage: 4, postEffectColor: '#FF4400', soundGroup: 'lava', textureName: 'default_lava_flowing' },
            { id: 45, name: 'coal_ore', solid: true, transparent: false, color: '#3A3A3A', hardness: 3.0, drops: 'coal', groups: { cracky: 3 }, soundGroup: 'stone', textureName: 'default_coal_ore' },
            { id: 46, name: 'mossy_cobblestone', solid: true, transparent: false, color: '#5E6E5E', hardness: 2.0, groups: { cracky: 3 }, soundGroup: 'stone', textureName: 'default_mossycobble' },
            { id: 47, name: 'iron_block', solid: true, transparent: false, color: '#D8D8D8', hardness: 5.0, groups: { cracky: 2 }, soundGroup: 'metal', textureName: 'default_iron_block' },
            { id: 48, name: 'gold_block', solid: true, transparent: false, color: '#FFD700', hardness: 3.0, groups: { cracky: 2 }, soundGroup: 'metal', textureName: 'default_gold_block' },
            { id: 49, name: 'diamond_block', solid: true, transparent: false, color: '#4AEDD9', hardness: 5.0, groups: { cracky: 2 }, soundGroup: 'metal', textureName: 'default_diamond_block' },
            { id: 50, name: 'wool_orange', solid: true, transparent: false, color: '#E8821C', hardness: 0.8, groups: { snappy: 2 }, soundGroup: 'cloth', textureName: 'default_wool_orange' },
            { id: 51, name: 'wool_yellow', solid: true, transparent: false, color: '#F2E63C', hardness: 0.8, groups: { snappy: 2 }, soundGroup: 'cloth', textureName: 'default_wool_yellow' },
            { id: 52, name: 'wool_cyan', solid: true, transparent: false, color: '#2CC4AD', hardness: 0.8, groups: { snappy: 2 }, soundGroup: 'cloth', textureName: 'default_wool_cyan' },
            { id: 53, name: 'wool_purple', solid: true, transparent: false, color: '#7B2FBE', hardness: 0.8, groups: { snappy: 2 }, soundGroup: 'cloth', textureName: 'default_wool_purple' },
            { id: 54, name: 'wool_black', solid: true, transparent: false, color: '#1D1D1D', hardness: 0.8, groups: { snappy: 2 }, soundGroup: 'cloth', textureName: 'default_wool_black' },
            { id: 55, name: 'wool_brown', solid: true, transparent: false, color: '#724528', hardness: 0.8, groups: { snappy: 2 }, soundGroup: 'cloth', textureName: 'default_wool_brown' },
            { id: 56, name: 'wool_pink', solid: true, transparent: false, color: '#F2A5C4', hardness: 0.8, groups: { snappy: 2 }, soundGroup: 'cloth', textureName: 'default_wool_pink' },
            { id: 57, name: 'wool_lime', solid: true, transparent: false, color: '#52B248', hardness: 0.8, groups: { snappy: 2 }, soundGroup: 'cloth', textureName: 'default_wool_lime' },
            { id: 58, name: 'wool_light_blue', solid: true, transparent: false, color: '#6689D3', hardness: 0.8, groups: { snappy: 2 }, soundGroup: 'cloth', textureName: 'default_wool_light_blue' },
            { id: 59, name: 'wool_magenta', solid: true, transparent: false, color: '#B24CBF', hardness: 0.8, groups: { snappy: 2 }, soundGroup: 'cloth', textureName: 'default_wool_magenta' },
            { id: 60, name: 'wool_gray', solid: true, transparent: false, color: '#6B6B6B', hardness: 0.8, groups: { snappy: 2 }, soundGroup: 'cloth', textureName: 'default_wool_gray' },
            { id: 61, name: 'wool_light_gray', solid: true, transparent: false, color: '#A0A0A0', hardness: 0.8, groups: { snappy: 2 }, soundGroup: 'cloth', textureName: 'default_wool_light_gray' },
            { id: 62, name: 'glowing_obsidian', solid: true, transparent: false, color: '#3A1A5E', hardness: 50.0, light: 14, groups: { cracky: 5 }, soundGroup: 'stone', textureName: 'default_burning_obsidian' },
            { id: 63, name: 'apple_block', solid: true, transparent: false, color: '#CC2222', hardness: 0.8, drops: 'apple', groups: { snappy: 3 }, soundGroup: 'grass', textureName: 'default_apple' },
            { id: 64, name: 'wheat_crop', solid: false, transparent: true, color: '#9ACD32', hardness: 0.0, drops: 'wheat', groups: { snappy: 3, dig_immediate: 3 }, soundGroup: 'grass', textureName: 'default_wheat' },
            { id: 65, name: 'carrot_crop', solid: false, transparent: true, color: '#FF8C00', hardness: 0.0, drops: 'carrot', groups: { snappy: 3, dig_immediate: 3 }, soundGroup: 'grass' },
            { id: 66, name: 'potato_crop', solid: false, transparent: true, color: '#DAA520', hardness: 0.0, drops: 'potato', groups: { snappy: 3, dig_immediate: 3 }, soundGroup: 'grass' },
            { id: 67, name: 'hay_bale', solid: true, transparent: false, color: '#DAA520', hardness: 0.5, groups: { snappy: 3 }, soundGroup: 'grass', textureName: 'default_hay' },
            { id: 68, name: 'desert_stone', solid: true, transparent: false, color: '#A0926B', hardness: 1.5, groups: { cracky: 3 }, soundGroup: 'stone', textureName: 'default_desert_stone' },
            { id: 69, name: 'dirt_with_snow', solid: true, transparent: false, color: '#8B8B8B', hardness: 0.6, drops: 'dirt', groups: { crumbly: 3 }, soundGroup: 'dirt' },
            { id: 70, name: 'junglegrass', solid: false, transparent: true, color: '#00AA00', hardness: 0.0, groups: { dig_immediate: 3 }, soundGroup: 'grass', textureName: 'default_junglegrass' },
            { id: 71, name: 'jungle_wood', solid: true, transparent: false, color: '#6B5030', hardness: 2.0, groups: { choppy: 3 }, soundGroup: 'wood', textureName: 'default_jungletree' },
            { id: 72, name: 'jungle_leaves', solid: true, transparent: true, color: '#1A8C1A', hardness: 0.2, groups: { snappy: 3 }, soundGroup: 'leaves', textureName: 'default_jungleleaves' },
            { id: 73, name: 'pine_wood', solid: true, transparent: false, color: '#5C3D1E', hardness: 2.0, groups: { choppy: 3 }, soundGroup: 'wood', textureName: 'default_pine_tree' },
            { id: 74, name: 'pine_needles', solid: true, transparent: true, color: '#1A5C1A', hardness: 0.2, groups: { snappy: 3 }, soundGroup: 'leaves', textureName: 'default_pine_needles' },
            { id: 75, name: 'river_water', solid: false, transparent: true, color: '#3060C0', liquid: true, drowning: true, soundGroup: 'water', textureName: 'default_river_water' },
            { id: 76, name: 'cobblestone_slab', solid: true, transparent: false, color: '#6B6B6B', hardness: 2.0, groups: { cracky: 3 }, soundGroup: 'stone', textureName: 'default_cobble' },
            { id: 77, name: 'wood_slab', solid: true, transparent: false, color: '#BC8F5A', hardness: 2.0, groups: { choppy: 2 }, soundGroup: 'wood', textureName: 'default_wood' },
            { id: 78, name: 'stone_slab', solid: true, transparent: false, color: '#808080', hardness: 2.0, groups: { cracky: 3 }, soundGroup: 'stone', textureName: 'default_stone' },
            { id: 79, name: 'brick_block', solid: true, transparent: false, color: '#B22222', hardness: 2.0, groups: { cracky: 2 }, soundGroup: 'stone', textureName: 'default_brick' },
            { id: 80, name: 'clay_block', solid: true, transparent: false, color: '#9BA5B0', hardness: 0.6, groups: { crumbly: 3 }, soundGroup: 'dirt', textureName: 'default_clay' },
            { id: 81, name: 'snow_layer', solid: true, transparent: true, color: '#FFFAFA', hardness: 0.2, groups: { crumbly: 3, oddly_breakable_by_hand: 3 }, soundGroup: 'snow', textureName: 'default_snow' },
            { id: 82, name: 'mossy_stone', solid: true, transparent: false, color: '#5E6E5E', hardness: 1.5, groups: { cracky: 3 }, soundGroup: 'stone', textureName: 'default_mossycobble' },
            { id: 83, name: 'cracked_stone', solid: true, transparent: false, color: '#777070', hardness: 1.5, groups: { cracky: 3 }, soundGroup: 'stone' },
            { id: 84, name: 'chiseled_stone', solid: true, transparent: false, color: '#999999', hardness: 1.5, groups: { cracky: 3 }, soundGroup: 'stone' },
            { id: 85, name: 'dark_prismarine', solid: true, transparent: false, color: '#0E4A5C', hardness: 1.5, groups: { cracky: 2 }, soundGroup: 'stone' },
            { id: 86, name: 'prismarine', solid: true, transparent: false, color: '#4E8CA8', hardness: 1.5, groups: { cracky: 2 }, soundGroup: 'stone' },
            { id: 87, name: 'prismarine_bricks', solid: true, transparent: false, color: '#3B7A94', hardness: 1.5, groups: { cracky: 2 }, soundGroup: 'stone' },
            { id: 88, name: 'sea_lantern', solid: true, transparent: true, color: '#BCC9C2', hardness: 0.3, light: 15, groups: { cracky: 3 }, soundGroup: 'glass' },
            { id: 89, name: 'glowstone', solid: true, transparent: true, color: '#FFC040', hardness: 0.3, light: 15, groups: { cracky: 2 }, soundGroup: 'glass' },
            { id: 90, name: 'redstone_lamp', solid: true, transparent: false, color: '#7A2020', hardness: 0.3, groups: { cracky: 3, oddly_breakable_by_hand: 3 }, soundGroup: 'stone' },
            { id: 91, name: 'redstone_lamp_on', solid: true, transparent: true, color: '#FF6040', hardness: 0.3, light: 12, groups: { cracky: 3, oddly_breakable_by_hand: 3 }, soundGroup: 'stone' },
            { id: 92, name: 'netherrack', solid: true, transparent: false, color: '#6B2A2A', hardness: 0.4, groups: { cracky: 2 }, soundGroup: 'stone' },
            { id: 93, name: 'soul_sand', solid: true, transparent: false, color: '#5C4827', hardness: 0.5, moveResistance: 0.5, groups: { crumbly: 3 }, soundGroup: 'sand' },
            { id: 94, name: 'nether_brick', solid: true, transparent: false, color: '#2A1A1A', hardness: 2.0, groups: { cracky: 2 }, soundGroup: 'stone' },
            { id: 95, name: 'end_stone', solid: true, transparent: false, color: '#E8E0B8', hardness: 3.0, groups: { cracky: 3 }, soundGroup: 'stone' },
            { id: 96, name: 'purpur_block', solid: true, transparent: false, color: '#A86FCF', hardness: 1.5, groups: { cracky: 2 }, soundGroup: 'stone' },
            { id: 97, name: 'purpur_pillar', solid: true, transparent: false, color: '#8B5CBF', hardness: 1.5, groups: { cracky: 2 }, soundGroup: 'stone' },
            { id: 98, name: 'mycelium', solid: true, transparent: false, color: '#6B5A8A', hardness: 0.6, drops: 'dirt', groups: { crumbly: 3 }, soundGroup: 'dirt', textureName: 'default_mycelium_top' },
            { id: 99, name: 'podzol', solid: true, transparent: false, color: '#5C4827', hardness: 0.5, drops: 'dirt', groups: { crumbly: 3 }, soundGroup: 'dirt' },
            { id: 100, name: 'coarse_dirt', solid: true, transparent: false, color: '#6B5C48', hardness: 0.5, groups: { crumbly: 3 }, soundGroup: 'dirt' },
            { id: 101, name: 'desert_sand', solid: true, transparent: false, color: '#E8D5A3', hardness: 0.5, falling: true, textureName: 'default_sand', groups: { crumbly: 3 }, soundGroup: 'sand' },
            { id: 102, name: 'river_water_flowing', solid: false, transparent: true, color: '#3060C0', liquid: true, drowning: true, liquidRange: 7, liquidViscosity: 1, liquidRenewable: true, level: 7, maxLevel: 8, textureName: 'default_river_water', soundGroup: 'water' },
            { id: 103, name: 'desert_stone_slab', solid: true, transparent: false, color: '#A0926B', hardness: 1.5, textureName: 'default_desert_stone', groups: { cracky: 3 }, soundGroup: 'stone' },
            { id: 104, name: 'jungle_wood_slab', solid: true, transparent: false, color: '#6B5030', hardness: 2.0, textureName: 'default_jungletree', groups: { choppy: 3 }, soundGroup: 'wood' },
            { id: 105, name: 'pine_wood_slab', solid: true, transparent: false, color: '#5C3D1E', hardness: 2.0, textureName: 'default_pine_tree', groups: { choppy: 3 }, soundGroup: 'wood' },
            { id: 106, name: 'coal_block', solid: true, transparent: false, color: '#2F2F2F', hardness: 5.0, groups: { cracky: 2 }, soundGroup: 'stone' },
            { id: 107, name: 'lapis_block', solid: true, transparent: false, color: '#1A3A8A', hardness: 5.0, groups: { cracky: 2 }, soundGroup: 'stone' },
            { id: 108, name: 'emerald_block', solid: true, transparent: false, color: '#1A8A3A', hardness: 5.0, groups: { cracky: 2 }, soundGroup: 'stone' },
            { id: 109, name: 'redstone_block', solid: true, transparent: false, color: '#AA0000', hardness: 5.0, groups: { cracky: 2 }, soundGroup: 'stone' },
            { id: 110, name: 'brick_stairs', solid: true, transparent: false, color: '#B22222', hardness: 2.0, textureName: 'default_brick', groups: { cracky: 2 }, soundGroup: 'stone' },
            { id: 111, name: 'sandstone_stairs', solid: true, transparent: false, color: '#E8D5A3', hardness: 0.8, textureName: 'default_sandstone', groups: { cracky: 3 }, soundGroup: 'sand' },
            { id: 112, name: 'wood_stairs', solid: true, transparent: false, color: '#BC8F5A', hardness: 2.0, textureName: 'default_planks', groups: { choppy: 2 }, soundGroup: 'wood' },
            { id: 113, name: 'cobblestone_stairs', solid: true, transparent: false, color: '#6B6B6B', hardness: 2.0, textureName: 'default_cobble', groups: { cracky: 3 }, soundGroup: 'stone' },
            { id: 114, name: 'desert_stone_stairs', solid: true, transparent: false, color: '#A0926B', hardness: 1.5, textureName: 'default_desert_stone', groups: { cracky: 3 }, soundGroup: 'stone' },
            { id: 115, name: 'nether_brick_stairs', solid: true, transparent: false, color: '#2A1A1A', hardness: 2.0, groups: { cracky: 2 }, soundGroup: 'stone' },
            { id: 116, name: 'pumpkin_block', solid: true, transparent: false, color: '#FF8C00', hardness: 1.0, textureName: 'default_pumpkin_top', groups: { choppy: 2 }, soundGroup: 'wood' },
            { id: 117, name: 'jack_o_lantern', solid: true, transparent: false, color: '#FF8C00', hardness: 1.0, light: 15, textureName: 'default_pumpkin', groups: { choppy: 2 }, soundGroup: 'wood' },
            { id: 118, name: 'cactus_block', solid: true, transparent: false, color: '#0A5C0A', hardness: 0.4, damage: 1, textureName: 'default_cactus', groups: { choppy: 2 }, soundGroup: 'wood' },
            { id: 119, name: 'sugar_cane_block', solid: false, transparent: true, color: '#90EE90', hardness: 0.2, textureName: 'default_sugar_cane', groups: { dig_immediate: 3 }, soundGroup: 'grass' },
            { id: 120, name: 'dead_bush', solid: false, transparent: true, color: '#8B7355', hardness: 0, groups: { dig_immediate: 3 }, soundGroup: 'grass' },
            { id: 121, name: 'tall_grass', solid: false, transparent: true, color: '#4A8C3A', hardness: 0, groups: { dig_immediate: 3 }, soundGroup: 'grass' },
            { id: 122, name: 'flower_red', solid: false, transparent: true, color: '#FF3333', hardness: 0, groups: { dig_immediate: 3, flower: 1 }, soundGroup: 'grass' },
            { id: 123, name: 'flower_yellow', solid: false, transparent: true, color: '#FFFF33', hardness: 0, groups: { dig_immediate: 3, flower: 1 }, soundGroup: 'grass' },
            { id: 124, name: 'flower_rose', solid: false, transparent: true, color: '#CC0000', hardness: 0, groups: { dig_immediate: 3, flower: 1 }, soundGroup: 'grass' },
            { id: 125, name: 'flower_tulip', solid: false, transparent: true, color: '#FF6699', hardness: 0, groups: { dig_immediate: 3, flower: 1 }, soundGroup: 'grass' },
            { id: 126, name: 'mushroom_red_block', solid: false, transparent: true, color: '#CC2222', hardness: 0, groups: { dig_immediate: 3 }, soundGroup: 'grass' },
            { id: 127, name: 'mushroom_brown_block', solid: false, transparent: true, color: '#8B6B4A', hardness: 0, groups: { dig_immediate: 3 }, soundGroup: 'grass' },
            { id: 128, name: 'gold_ore', solid: true, transparent: false, color: '#FFD700', hardness: 3.0, textureName: 'default_gold_ore', groups: { cracky: 3 }, soundGroup: 'stone' },
            { id: 129, name: 'lapis_ore', solid: true, transparent: false, color: '#1A3A8A', hardness: 3.0, groups: { cracky: 3 }, soundGroup: 'stone' },
            { id: 130, name: 'emerald_ore', solid: true, transparent: false, color: '#1A8A3A', hardness: 3.0, groups: { cracky: 3 }, soundGroup: 'stone' },
            { id: 131, name: 'redstone_ore', solid: true, transparent: false, color: '#AA0000', hardness: 3.0, groups: { cracky: 3 }, soundGroup: 'stone' },
            { id: 132, name: 'copper_ore', solid: true, transparent: false, color: '#B87333', hardness: 3.0, groups: { cracky: 3 }, soundGroup: 'stone' },
            { id: 133, name: 'copper_block', solid: true, transparent: false, color: '#B87333', hardness: 5.0, groups: { cracky: 2 }, soundGroup: 'metal' },
            { id: 134, name: 'raw_copper_block', solid: true, transparent: false, color: '#C4895A', hardness: 3.0, groups: { cracky: 2 }, soundGroup: 'stone' },
            { id: 135, name: 'tuff', solid: true, transparent: false, color: '#6B6B6B', hardness: 1.5, groups: { cracky: 2 }, soundGroup: 'stone' },
            { id: 136, name: 'dripstone', solid: true, transparent: false, color: '#8B7D6B', hardness: 1.5, groups: { cracky: 3 }, soundGroup: 'stone' },
            { id: 137, name: 'calcite', solid: true, transparent: false, color: '#D4CDC4', hardness: 0.75, groups: { cracky: 3 }, soundGroup: 'stone' },
            { id: 138, name: 'deepslate', solid: true, transparent: false, color: '#4A4A4A', hardness: 3.0, groups: { cracky: 3 }, soundGroup: 'stone' },
            { id: 139, name: 'cobweb', solid: false, transparent: true, color: '#DDDDDD', hardness: 0.4, groups: { snappy: 2 }, soundGroup: 'cloth' },
            { id: 140, name: 'fire', solid: false, transparent: true, color: '#FF6600', damage: 1, light: 15, groups: { dig_immediate: 3 }, soundGroup: 'default' },
            { id: 141, name: 'soul_torch', solid: false, transparent: true, color: '#6699FF', light: 10, groups: { dig_immediate: 3 }, soundGroup: 'default' },
            { id: 142, name: 'lantern', solid: true, transparent: true, color: '#FFCC66', hardness: 3.5, light: 15, groups: { cracky: 3 }, soundGroup: 'metal' },
            { id: 143, name: 'campfire', solid: true, transparent: true, color: '#8B4513', hardness: 2.0, light: 15, damage: 1, interactive: true, groups: { cracky: 2 }, soundGroup: 'wood' },
            { id: 144, name: 'soul_campfire', solid: true, transparent: true, color: '#4169E1', hardness: 2.0, light: 10, damage: 2, interactive: true, groups: { cracky: 2 }, soundGroup: 'wood' },
            { id: 145, name: 'blast_furnace', solid: true, transparent: false, color: '#4A4A4A', interactive: true, hardness: 3.5, groups: { cracky: 2 }, soundGroup: 'stone' },
            { id: 146, name: 'smoker', solid: true, transparent: false, color: '#696969', interactive: true, hardness: 3.5, groups: { cracky: 2 }, soundGroup: 'stone' },
            { id: 147, name: 'barrel', solid: true, transparent: false, color: '#8B6914', interactive: true, hardness: 2.5, groups: { choppy: 2 }, soundGroup: 'wood' },
            { id: 148, name: 'loom', solid: true, transparent: false, color: '#BC8F5A', interactive: true, hardness: 2.5, groups: { choppy: 2 }, soundGroup: 'wood' },
            { id: 149, name: 'cartography_table', solid: true, transparent: false, color: '#BC8F5A', interactive: true, hardness: 2.5, groups: { choppy: 2 }, soundGroup: 'wood' },
            { id: 150, name: 'fletching_table', solid: true, transparent: false, color: '#BC8F5A', interactive: true, hardness: 2.5, groups: { choppy: 2 }, soundGroup: 'wood' },
            { id: 151, name: 'smithing_table', solid: true, transparent: false, color: '#696969', interactive: true, hardness: 2.5, groups: { cracky: 2 }, soundGroup: 'stone' },
            { id: 152, name: 'grindstone', solid: true, transparent: false, color: '#808080', interactive: true, hardness: 2.0, groups: { cracky: 2 }, soundGroup: 'stone' },
            { id: 153, name: 'stonecutter', solid: true, transparent: false, color: '#696969', interactive: true, hardness: 3.5, groups: { cracky: 2 }, soundGroup: 'stone' },
            { id: 154, name: 'bell', solid: true, transparent: true, color: '#DAA520', hardness: 5.0, groups: { cracky: 2 }, soundGroup: 'metal' },
            { id: 155, name: 'iron_bars', solid: true, transparent: true, color: '#C0C0C0', hardness: 5.0, groups: { cracky: 2 }, soundGroup: 'metal' },
            { id: 156, name: 'chain', solid: false, transparent: true, color: '#808080', hardness: 5.0, groups: { cracky: 2 }, soundGroup: 'metal' },
            { id: 157, name: 'note_block', solid: true, transparent: false, color: '#8B4513', interactive: true, hardness: 2.0, groups: { choppy: 2 }, soundGroup: 'wood' },
            { id: 158, name: 'jukebox', solid: true, transparent: false, color: '#8B4513', interactive: true, hardness: 2.0, groups: { choppy: 2 }, soundGroup: 'wood' },
            { id: 159, name: 'target_block', solid: true, transparent: false, color: '#FFEEEE', hardness: 0.5, groups: { cracky: 3 }, soundGroup: 'cloth' },
            { id: 160, name: 'pointed_dripstone', solid: true, transparent: false, color: '#8B7D6B', hardness: 1.5, groups: { cracky: 3 }, soundGroup: 'stone' }
        ];

        for (const block of defaultBlocks) {
            this.blocks.set(block.id, block);
            this.byName.set(block.name, block);
        }
    }

    loadFromServer(json: string): void {
        const parsed = JSON.parse(json);
        this.blocks.clear();
        this.byName.clear();

        const blockEntries = parsed.blocks || parsed;
        for (const key of Object.keys(blockEntries)) {
            const raw = blockEntries[key];
            const id = parseInt(key);
            const block: BlockDefinition = {
                id,
                name: raw.name,
                solid: raw.solid,
                transparent: raw.transparent,
                color: raw.color
            };
            if (raw.liquid !== undefined) block.liquid = raw.liquid;
            if (raw.light !== undefined) block.light = raw.light;
            if (raw.hardness !== undefined) block.hardness = raw.hardness;
            if (raw.drops !== undefined) block.drops = raw.drops;
            if (raw.climbable !== undefined) block.climbable = raw.climbable;
            if (raw.damage !== undefined) block.damage = raw.damage;
            if (raw.breakable !== undefined) block.breakable = raw.breakable;
            if (raw.interactive !== undefined) block.interactive = raw.interactive;
            if (raw.drowning !== undefined) block.drowning = raw.drowning;
            if (raw.falling !== undefined) block.falling = raw.falling;
            if (raw.bouncy !== undefined) block.bouncy = raw.bouncy;
            if (raw.slippery !== undefined) block.slippery = raw.slippery;
            if (raw.moveResistance !== undefined) block.moveResistance = raw.moveResistance;
            if (raw.postEffectColor !== undefined) block.postEffectColor = raw.postEffectColor;
            if (raw.groups !== undefined) block.groups = raw.groups;
            if (raw.soundGroup !== undefined) block.soundGroup = raw.soundGroup;
            if (raw.textureName !== undefined) block.textureName = raw.textureName;
        if (raw.drawType !== undefined) block.drawType = raw.drawType;

            this.blocks.set(id, block);
            this.byName.set(block.name, block);
        }
    }

    get(id: number): BlockDefinition | undefined { return this.blocks.get(id); }
    getByBlockId(blockId: number): BlockDefinition | undefined { return this.blocks.get(blockId); }
    getByName(name: string): BlockDefinition | undefined { return this.byName.get(name); }
    isSolid(id: number): boolean { return this.blocks.get(id)?.solid ?? false; }
    isTransparent(id: number): boolean { return this.blocks.get(id)?.transparent ?? true; }
    isLiquid(id: number): boolean { return this.blocks.get(id)?.liquid ?? false; }
    isClimbable(id: number): boolean { return this.blocks.get(id)?.climbable ?? false; }
    isFalling(id: number): boolean { return this.blocks.get(id)?.falling ?? false; }
    isInteractive(id: number): boolean { return this.blocks.get(id)?.interactive ?? false; }
    isLightSource(id: number): boolean { return (this.blocks.get(id)?.light ?? 0) > 0; }
    getLightLevel(id: number): number { return this.blocks.get(id)?.light ?? 0; }
    lightPropagates(id: number): boolean {
        const block = this.blocks.get(id);
        if (!block) return true;
        return block.transparent === true || block.liquid === true;
    }
    getGroups(id: number): Record<string, number> { return this.blocks.get(id)?.groups ?? {}; }
    getAll(): Map<number, BlockDefinition> { return this.blocks; }

    getDrawType(id: number): string {
        const block = this.blocks.get(id);
        if (!block) return 'normal';
        if (block.drawType) return block.drawType;
        const name = block.name;
        if (name === 'torch' || name === 'soul_torch') return 'torch';
        if (name === 'ladder') return 'ladder';
        if (name === 'fence') return 'fence';
        if (name.startsWith('door_')) return 'door';
        if (name === 'iron_bars') return 'glass_pane';
        if (name.includes('slab') || name === 'snow_layer') return 'slab';
        if (name.includes('stairs')) return 'stair';
        if (name === 'fire') return 'firelike';
        if (name.includes('crop') || name.includes('flower') || name.includes('mushroom') ||
            name === 'dead_bush' || name === 'tall_grass' || name === 'junglegrass' ||
            name === 'sugar_cane' || name === 'sugar_cane_block') return 'plantlike';
        return 'normal';
    }
}
