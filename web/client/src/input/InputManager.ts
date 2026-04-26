export class InputManager {
    private keys: Set<string> = new Set();
    private pointerLocked: boolean = false;

    constructor() {
        this.setupListeners();
    }

    private setupListeners(): void {
        document.addEventListener('keydown', (e) => {
            this.keys.add(e.code);
        });

        document.addEventListener('keyup', (e) => {
            this.keys.delete(e.code);
        });

        window.addEventListener('blur', () => {
            this.keys.clear();
            this.pointerLocked = false;
            document.dispatchEvent(new CustomEvent('windowBlur'));
        });
    }

    isKeyDown(code: string): boolean {
        return this.keys.has(code);
    }

    isPointerLocked(): boolean {
        return this.pointerLocked;
    }

    setPointerLocked(locked: boolean): void {
        this.pointerLocked = locked;
    }
}
