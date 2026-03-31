export interface BlockDefinition {
    id: number;
    name: string;
    solid: boolean;
    transparent: boolean;
    color: string;
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
            { id: 1, name: 'stone', solid: true, transparent: false, color: '#808080', hardness: 1.5, drops: 'cobblestone' },
            { id: 2, name: 'dirt', solid: true, transparent: false, color: '#8B4513', hardness: 0.5 },
            { id: 3, name: 'grass', solid: true, transparent: false, color: '#228B22', hardness: 0.6 },
            { id: 4, name: 'water', solid: false, transparent: true, color: '#4169E1', liquid: true },
            { id: 5, name: 'sand', solid: true, transparent: false, color: '#F4A460', hardness: 0.5 },
            { id: 6, name: 'wood', solid: true, transparent: false, color: '#DEB887', hardness: 2.0 },
            { id: 7, name: 'leaves', solid: true, transparent: true, color: '#32CD32', hardness: 0.2 },
            { id: 8, name: 'glass', solid: true, transparent: true, color: '#ADD8E6', hardness: 0.3 },
            { id: 9, name: 'brick', solid: true, transparent: false, color: '#B22222', hardness: 2.0 },
            { id: 10, name: 'ore_iron', solid: true, transparent: false, color: '#C4A882', hardness: 3.0, drops: 'iron_ingot' },
            { id: 11, name: 'coal', solid: true, transparent: false, color: '#2F4F4F', hardness: 3.0 },
            { id: 12, name: 'bedrock', solid: true, transparent: false, color: '#1C1C1C', breakable: false },
            { id: 13, name: 'snow', solid: true, transparent: false, color: '#FFFAFA', hardness: 0.2 },
            { id: 14, name: 'ice', solid: true, transparent: true, color: '#B0E0E6', hardness: 0.5 },
            { id: 15, name: 'lava', solid: false, transparent: true, color: '#FF4500', liquid: true, damage: 4 },
            { id: 16, name: 'torch', solid: false, transparent: true, color: '#FFD700', light: 14 },
            { id: 17, name: 'ladder', solid: false, transparent: true, color: '#8B4513', climbable: true },
            { id: 18, name: 'fence', solid: true, transparent: true, color: '#8B4513', hardness: 2.0 },
            { id: 19, name: 'door_wood', solid: true, transparent: true, color: '#8B6914', interactive: true, hardness: 3.0 },
            { id: 20, name: 'chest', solid: true, transparent: false, color: '#8B4513', interactive: true, hardness: 2.5 },
            { id: 21, name: 'crafting_table', solid: true, transparent: false, color: '#D2691E', interactive: true, hardness: 2.5 },
            { id: 22, name: 'furnace', solid: true, transparent: false, color: '#696969', interactive: true, hardness: 3.5 },
            { id: 23, name: 'ore_gold', solid: true, transparent: false, color: '#FFD700', hardness: 3.0, drops: 'gold_ingot' },
            { id: 24, name: 'ore_diamond', solid: true, transparent: false, color: '#00FFFF', hardness: 3.0, drops: 'diamond' },
            { id: 25, name: 'planks', solid: true, transparent: false, color: '#BC8F5A', hardness: 2.0 },
            { id: 26, name: 'cobblestone', solid: true, transparent: false, color: '#6B6B6B', hardness: 2.0 },
            { id: 27, name: 'stone_brick', solid: true, transparent: false, color: '#777777', hardness: 1.5 },
            { id: 28, name: 'wool_white', solid: true, transparent: false, color: '#EEEEEE', hardness: 0.8 },
            { id: 29, name: 'wool_red', solid: true, transparent: false, color: '#CC2222', hardness: 0.8 },
            { id: 30, name: 'wool_blue', solid: true, transparent: false, color: '#2222CC', hardness: 0.8 },
            { id: 31, name: 'wool_green', solid: true, transparent: false, color: '#22CC22', hardness: 0.8 },
            { id: 32, name: 'bookshelf', solid: true, transparent: false, color: '#C4A050', hardness: 1.5 },
            { id: 33, name: 'gravel', solid: true, transparent: false, color: '#888078', hardness: 0.6, falling: true, groups: { crumbly: 3 }, soundGroup: 'gravel' },
            { id: 34, name: 'clay', solid: true, transparent: false, color: '#9BA5B0', hardness: 0.6, groups: { crumbly: 3 }, soundGroup: 'dirt' },
            { id: 35, name: 'sandstone', solid: true, transparent: false, color: '#E8D5A3', hardness: 0.8, groups: { cracky: 3 }, soundGroup: 'sand' },
            { id: 36, name: 'obsidian', solid: true, transparent: false, color: '#1A0A2E', hardness: 50.0, groups: { cracky: 5 }, soundGroup: 'stone' },
            { id: 37, name: 'cactus', solid: true, transparent: false, color: '#0A5C0A', hardness: 0.4, damage: 1, groups: { choppy: 2 }, soundGroup: 'wood' },
            { id: 38, name: 'sugar_cane', solid: false, transparent: true, color: '#90EE90', hardness: 0.2, soundGroup: 'grass' },
            { id: 39, name: 'pumpkin', solid: true, transparent: false, color: '#FF8C00', hardness: 1.0, groups: { choppy: 2 }, soundGroup: 'wood' },
            { id: 40, name: 'melon', solid: true, transparent: false, color: '#5C8A1E', hardness: 1.0, drops: 'melon_slice', groups: { choppy: 2 }, soundGroup: 'wood' },
            { id: 41, name: 'mycelium', solid: true, transparent: false, color: '#6B5A8A', hardness: 0.6, drops: 'dirt', groups: { crumbly: 3 }, soundGroup: 'dirt' },
            { id: 42, name: 'farmland', solid: true, transparent: false, color: '#6B4E2A', hardness: 0.6, groups: { crumbly: 3 }, soundGroup: 'dirt' },
            { id: 43, name: 'water_flowing', solid: false, transparent: true, color: '#4169E1', liquid: true, drowning: true, soundGroup: 'water' },
            { id: 44, name: 'lava_flowing', solid: false, transparent: true, color: '#FF4500', liquid: true, damage: 4, postEffectColor: '#FF4400', soundGroup: 'lava' },
            { id: 45, name: 'coal_ore', solid: true, transparent: false, color: '#3A3A3A', hardness: 3.0, drops: 'coal', groups: { cracky: 3 }, soundGroup: 'stone' },
            { id: 46, name: 'mossy_cobblestone', solid: true, transparent: false, color: '#5E6E5E', hardness: 2.0, groups: { cracky: 3 }, soundGroup: 'stone' },
            { id: 47, name: 'iron_block', solid: true, transparent: false, color: '#D8D8D8', hardness: 5.0, groups: { cracky: 2 }, soundGroup: 'metal' },
            { id: 48, name: 'gold_block', solid: true, transparent: false, color: '#FFD700', hardness: 3.0, groups: { cracky: 2 }, soundGroup: 'metal' },
            { id: 49, name: 'diamond_block', solid: true, transparent: false, color: '#4AEDD9', hardness: 5.0, groups: { cracky: 2 }, soundGroup: 'metal' },
            { id: 50, name: 'wool_orange', solid: true, transparent: false, color: '#E8821C', hardness: 0.8, groups: { snappy: 2 }, soundGroup: 'cloth' },
            { id: 51, name: 'wool_yellow', solid: true, transparent: false, color: '#F2E63C', hardness: 0.8, groups: { snappy: 2 }, soundGroup: 'cloth' },
            { id: 52, name: 'wool_cyan', solid: true, transparent: false, color: '#2CC4AD', hardness: 0.8, groups: { snappy: 2 }, soundGroup: 'cloth' },
            { id: 53, name: 'wool_purple', solid: true, transparent: false, color: '#7B2FBE', hardness: 0.8, groups: { snappy: 2 }, soundGroup: 'cloth' },
            { id: 54, name: 'wool_black', solid: true, transparent: false, color: '#1D1D1D', hardness: 0.8, groups: { snappy: 2 }, soundGroup: 'cloth' },
            { id: 55, name: 'wool_brown', solid: true, transparent: false, color: '#724528', hardness: 0.8, groups: { snappy: 2 }, soundGroup: 'cloth' },
            { id: 56, name: 'wool_pink', solid: true, transparent: false, color: '#F2A5C4', hardness: 0.8, groups: { snappy: 2 }, soundGroup: 'cloth' },
            { id: 57, name: 'wool_lime', solid: true, transparent: false, color: '#52B248', hardness: 0.8, groups: { snappy: 2 }, soundGroup: 'cloth' },
            { id: 58, name: 'wool_light_blue', solid: true, transparent: false, color: '#6689D3', hardness: 0.8, groups: { snappy: 2 }, soundGroup: 'cloth' },
            { id: 59, name: 'wool_magenta', solid: true, transparent: false, color: '#B24CBF', hardness: 0.8, groups: { snappy: 2 }, soundGroup: 'cloth' },
            { id: 60, name: 'wool_gray', solid: true, transparent: false, color: '#6B6B6B', hardness: 0.8, groups: { snappy: 2 }, soundGroup: 'cloth' },
            { id: 61, name: 'wool_light_gray', solid: true, transparent: false, color: '#A0A0A0', hardness: 0.8, groups: { snappy: 2 }, soundGroup: 'cloth' },
            { id: 62, name: 'glowing_obsidian', solid: true, transparent: false, color: '#3A1A5E', hardness: 50.0, light: 14, groups: { cracky: 5 }, soundGroup: 'stone' },
            { id: 63, name: 'apple_block', solid: true, transparent: false, color: '#CC2222', hardness: 0.8, drops: 'apple', groups: { snappy: 3 }, soundGroup: 'grass' }
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
    getGroups(id: number): Record<string, number> { return this.blocks.get(id)?.groups ?? {}; }
    getAll(): Map<number, BlockDefinition> { return this.blocks; }
}
