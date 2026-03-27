export interface BlockDefinition {
    id: number;
    name: string;
    solid: boolean;
    transparent: boolean;
    color: string;
    liquid?: boolean;
    light?: number;
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
            { id: 1, name: 'stone', solid: true, transparent: false, color: '#808080' },
            { id: 2, name: 'dirt', solid: true, transparent: false, color: '#8B4513' },
            { id: 3, name: 'grass', solid: true, transparent: false, color: '#228B22' },
            { id: 4, name: 'water', solid: false, transparent: true, color: '#4169E1', liquid: true },
            { id: 5, name: 'sand', solid: true, transparent: false, color: '#F4A460' },
            { id: 6, name: 'wood', solid: true, transparent: false, color: '#DEB887' },
            { id: 7, name: 'leaves', solid: true, transparent: true, color: '#32CD32' },
            { id: 8, name: 'glass', solid: true, transparent: true, color: '#ADD8E6' },
            { id: 9, name: 'brick', solid: true, transparent: false, color: '#B22222' },
            { id: 10, name: 'ore', solid: true, transparent: false, color: '#8B8989' },
            { id: 11, name: 'coal', solid: true, transparent: false, color: '#2F4F4F' },
            { id: 12, name: 'bedrock', solid: true, transparent: false, color: '#1C1C1C' },
            { id: 13, name: 'snow', solid: true, transparent: false, color: '#FFFAFA' },
            { id: 14, name: 'ice', solid: true, transparent: true, color: '#B0E0E6' },
            { id: 15, name: 'lava', solid: false, transparent: true, color: '#FF4500', liquid: true },
            { id: 16, name: 'torch', solid: false, transparent: true, color: '#FFD700', light: 14 },
            { id: 17, name: 'ladder', solid: false, transparent: true, color: '#8B4513' },
            { id: 18, name: 'fence', solid: true, transparent: true, color: '#8B4513' },
            { id: 19, name: 'door', solid: true, transparent: true, color: '#8B4513' },
            { id: 20, name: 'chest', solid: true, transparent: false, color: '#8B4513' },
            { id: 21, name: 'crafting_table', solid: true, transparent: false, color: '#D2691E' },
            { id: 22, name: 'furnace', solid: true, transparent: false, color: '#696969' },
        ];

        for (const block of defaultBlocks) {
            this.blocks.set(block.id, block);
            this.byName.set(block.name, block);
        }
    }

    get(id: number): BlockDefinition | undefined { return this.blocks.get(id); }
    getByName(name: string): BlockDefinition | undefined { return this.byName.get(name); }
    isSolid(id: number): boolean { return this.blocks.get(id)?.solid ?? false; }
    isTransparent(id: number): boolean { return this.blocks.get(id)?.transparent ?? true; }
    getAll(): Map<number, BlockDefinition> { return this.blocks; }
}
