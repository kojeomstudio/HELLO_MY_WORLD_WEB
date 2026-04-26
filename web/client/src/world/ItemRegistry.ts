import { BlockRegistry } from './BlockRegistry';

interface ItemDefinition {
    name: string;
    type: string;
    stackable?: boolean;
    maxStack?: number;
    blockId?: number;
}

export class ItemRegistry {
    private items: Map<string, ItemDefinition> = new Map();
    private blockRegistry: BlockRegistry | null;
    private loaded: boolean = false;

    constructor(blockRegistry?: BlockRegistry) {
        this.blockRegistry = blockRegistry ?? null;
    }

    setBlockRegistry(registry: BlockRegistry): void {
        this.blockRegistry = registry;
    }

    async load(): Promise<void> {
        if (this.loaded) return;
        try {
            const resp = await fetch('/data/items.json');
            if (!resp.ok) return;
            const data = await resp.json();
            const entries = data.items || data;
            for (const [id, def] of Object.entries(entries)) {
                this.items.set(id, def as ItemDefinition);
            }
        } catch {
        }
        this.loaded = true;
    }

    getItemTextureUrl(itemId: string, blockId: number | null): string | null {
        if (blockId !== null && blockId > 0 && this.blockRegistry) {
            const blockDef = this.blockRegistry.get(blockId);
            if (blockDef?.textureName) {
                return `/textures/blocks/${blockDef.textureName}.png`;
            }
        }
        const toolTexture = this.getToolTextureUrl(itemId);
        if (toolTexture) return toolTexture;
        const itemDef = this.items.get(itemId);
        if (itemDef?.blockId && this.blockRegistry) {
            const blockDef = this.blockRegistry.get(itemDef.blockId);
            if (blockDef?.textureName) {
                return `/textures/blocks/${blockDef.textureName}.png`;
            }
        }
        return null;
    }

    private getToolTextureUrl(itemId: string): string | null {
        const mapping: Record<string, string> = {
            'wooden_pickaxe': 'basetools_woodpick',
            'stone_pickaxe': 'basetools_stonepick',
            'iron_pickaxe': 'basetools_ironpick',
            'steel_pickaxe': 'basetools_steelpick',
            'mese_pickaxe': 'basetools_mesepick',
            'diamond_pickaxe': 'basetools_diamondpick',
            'titanium_pickaxe': 'basetools_titaniumpick',
            'wooden_sword': 'basetools_woodsword',
            'stone_sword': 'basetools_stonesword',
            'iron_sword': 'basetools_ironsword',
            'steel_sword': 'basetools_steelsword',
            'mese_sword': 'basetools_mesesword',
            'diamond_sword': 'basetools_diamondsword',
            'titanium_sword': 'basetools_titaniumsword',
            'fire_sword': 'basetools_firesword',
            'ice_sword': 'basetools_icesword',
            'blood_sword': 'basetools_bloodsword',
            'heal_sword': 'basetools_healsword',
            'elemental_sword': 'basetools_elementalsword',
            'wooden_axe': 'basetools_woodaxe',
            'stone_axe': 'basetools_stoneaxe',
            'iron_axe': 'basetools_ironaxe',
            'steel_axe': 'basetools_steelaxe',
            'diamond_axe': 'basetools_diamondaxe',
            'wooden_shovel': 'basetools_woodshovel',
            'stone_shovel': 'basetools_stoneshovel',
            'iron_shovel': 'basetools_ironshovel',
            'steel_shovel': 'basetools_steelshovel',
            'diamond_shovel': 'basetools_diamondshovel',
            'wooden_hoe': 'basetools_woodhoe',
            'stone_hoe': 'basetools_stonehoe',
            'iron_hoe': 'basetools_ironhoe',
            'steel_hoe': 'basetools_steelhoe',
            'diamond_hoe': 'basetools_diamondhoe',
            'shears': 'basetools_woodshears',
            'wooden_shears': 'basetools_woodshears',
            'stone_shears': 'basetools_stoneshears',
            'steel_shears': 'basetools_steelshears',
            'wood_dagger': 'basetools_wooddagger',
            'steel_dagger': 'basetools_steeldagger',
            'diamond_dagger': 'basetools_diamonddagger'
        };
        const textureName = mapping[itemId];
        if (textureName) return `/textures/items/${textureName}.png`;
        return null;
    }

    get(itemId: string): ItemDefinition | undefined {
        return this.items.get(itemId);
    }
}
