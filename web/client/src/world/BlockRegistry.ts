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
            { id: 32, name: 'bookshelf', solid: true, transparent: false, color: '#C4A050', hardness: 1.5 }
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

            this.blocks.set(id, block);
            this.byName.set(block.name, block);
        }
    }

    get(id: number): BlockDefinition | undefined { return this.blocks.get(id); }
    getByBlockId(blockId: number): BlockDefinition | undefined { return this.blocks.get(blockId); }
    getByName(name: string): BlockDefinition | undefined { return this.byName.get(name); }
    isSolid(id: number): boolean { return this.blocks.get(id)?.solid ?? false; }
    isTransparent(id: number): boolean { return this.blocks.get(id)?.transparent ?? true; }
    getAll(): Map<number, BlockDefinition> { return this.blocks; }
}
