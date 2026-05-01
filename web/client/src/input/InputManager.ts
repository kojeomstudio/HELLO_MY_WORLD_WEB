export class InputManager {
    private keys: Set<string> = new Set();
    private pointerLocked: boolean = false;
    private _screenshotCallback: (() => void) | null = null;
    private _scrollCallback: ((delta: number) => void) | null = null;

    constructor() {
        this.setupListeners();
    }

    private setupListeners(): void {
        document.addEventListener('keydown', (e) => {
            this.keys.add(e.code);
            if (e.code === 'F12' && this._screenshotCallback) {
                e.preventDefault();
                this._screenshotCallback();
            }
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

    setScreenshotCallback(cb: (() => void) | null): void {
        this._screenshotCallback = cb;
    }

    setScrollCallback(cb: ((delta: number) => void) | null): void {
        this._scrollCallback = cb;
    }

    handleWheel(e: WheelEvent): void {
        if (!this.pointerLocked) return;
        const delta = Math.sign(e.deltaY);
        this._scrollCallback?.(delta);
    }
}
