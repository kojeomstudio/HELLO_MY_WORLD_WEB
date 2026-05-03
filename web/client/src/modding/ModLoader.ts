export interface GameMod {
    name: string;
    version: string;
    description: string;
    onInit?(api: ModAPI): void;
    onUpdate?(dt: number, api: ModAPI): void;
    onChatMessage?(message: string, api: ModAPI): void;
    onDestroy?(): void;
}

export interface ModAPI {
    registerCommand(name: string, handler: (args: string[]) => string): void;
    sendChat(message: string): void;
    getPlayerPosition(): { x: number; y: number; z: number };
    getBlockAt(x: number, y: number, z: number): number;
    setBlockAt(x: number, y: number, z: number, blockType: number): void;
    log(message: string): void;
}

class ModLoaderImpl {
    private mods: Map<string, GameMod> = new Map();
    private commandHandlers: Map<string, (args: string[]) => string> = new Map();
    private positionProvider: (() => { x: number; y: number; z: number }) | null = null;
    private blockGetter: ((x: number, y: number, z: number) => number) | null = null;
    private blockSetter: ((x: number, y: number, z: number, blockType: number) => void) | null = null;
    private chatSender: ((message: string) => void) | null = null;

    getAPI(): ModAPI {
        return {
            registerCommand: (name, handler) => this.commandHandlers.set(name, handler),
            sendChat: (message) => this.chatSender?.(message),
            getPlayerPosition: () => this.positionProvider?.() ?? { x: 0, y: 0, z: 0 },
            getBlockAt: (x, y, z) => this.blockGetter?.(x, y, z) ?? 0,
            setBlockAt: (x, y, z, blockType) => this.blockSetter?.(x, y, z, blockType),
            log: (message) => console.log(`[Mod] ${message}`)
        };
    }

    setPositionProvider(provider: () => { x: number; y: number; z: number }): void {
        this.positionProvider = provider;
    }

    setBlockGetter(getter: (x: number, y: number, z: number) => number): void {
        this.blockGetter = getter;
    }

    setBlockSetter(setter: (x: number, y: number, z: number, blockType: number) => void): void {
        this.blockSetter = setter;
    }

    setChatSender(sender: (message: string) => void): void {
        this.chatSender = sender;
    }

    loadMod(mod: GameMod): void {
        this.mods.set(mod.name, mod);
        mod.onInit?.(this.getAPI());
    }

    update(dt: number): void {
        const api = this.getAPI();
        for (const mod of this.mods.values()) {
            mod.onUpdate?.(dt, api);
        }
    }

    handleChatMessage(message: string): boolean {
        if (message.startsWith('/')) {
            const parts = message.substring(1).split(' ');
            const cmd = parts[0];
            const handler = this.commandHandlers.get(cmd);
            if (handler) {
                const result = handler(parts.slice(1));
                if (result) this.chatSender?.(result);
                return true;
            }
        }
        const api = this.getAPI();
        for (const mod of this.mods.values()) {
            mod.onChatMessage?.(message, api);
        }
        return false;
    }

    destroy(): void {
        for (const mod of this.mods.values()) {
            mod.onDestroy?.();
        }
        this.mods.clear();
        this.commandHandlers.clear();
    }

    getLoadedMods(): string[] {
        return Array.from(this.mods.keys());
    }
}

export const ModLoader = new ModLoaderImpl();
