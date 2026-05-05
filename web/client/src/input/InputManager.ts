export class InputManager {
    private keys: Set<string> = new Set();
    private virtualKeys: Set<string> = new Set();
    private pointerLocked: boolean = false;
    private _screenshotCallback: (() => void) | null = null;
    private _scrollCallback: ((delta: number) => void) | null = null;
    private _virtualMoveX: number = 0;
    private _virtualMoveZ: number = 0;
    private _virtualLookX: number = 0;
    private _virtualLookY: number = 0;
    private _virtualJump: boolean = false;
    private _virtualDig: boolean = false;
    private _virtualPlace: boolean = false;
    private _gamepadIndex: number = -1;
    private _gamepadConnected: boolean = false;

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
            this.virtualKeys.clear();
            this.pointerLocked = false;
            document.dispatchEvent(new CustomEvent('windowBlur'));
        });

        window.addEventListener('gamepadconnected', (e: GamepadEvent) => {
            this._gamepadIndex = e.gamepad.index;
            this._gamepadConnected = true;
        });

        window.addEventListener('gamepaddisconnected', () => {
            this._gamepadIndex = -1;
            this._gamepadConnected = false;
        });
    }

    isKeyDown(code: string): boolean {
        return this.keys.has(code) || this.virtualKeys.has(code);
    }

    setVirtualKey(code: string, pressed: boolean): void {
        if (pressed) {
            this.virtualKeys.add(code);
        } else {
            this.virtualKeys.delete(code);
        }
    }

    setVirtualMove(x: number, z: number): void {
        this._virtualMoveX = Math.max(-1, Math.min(1, x));
        this._virtualMoveZ = Math.max(-1, Math.min(1, z));
    }

    getVirtualMove(): { x: number; z: number } {
        return { x: this._virtualMoveX, z: this._virtualMoveZ };
    }

    setVirtualLook(x: number, y: number): void {
        this._virtualLookX = x;
        this._virtualLookY = y;
    }

    getVirtualLook(): { x: number; y: number } {
        return { x: this._virtualLookX, y: this._virtualLookY };
    }

    setVirtualJump(jumping: boolean): void {
        this._virtualJump = jumping;
    }

    isVirtualJump(): boolean {
        return this._virtualJump;
    }

    setVirtualDig(digging: boolean): void {
        this._virtualDig = digging;
    }

    isVirtualDig(): boolean {
        return this._virtualDig;
    }

    setVirtualPlace(placing: boolean): void {
        this._virtualPlace = placing;
    }

    isVirtualPlace(): boolean {
        return this._virtualPlace;
    }

    isGamepadConnected(): boolean {
        return this._gamepadConnected;
    }

    updateGamepad(): void {
        if (this._gamepadIndex < 0) return;
        const gamepads = navigator.getGamepads();
        if (!gamepads) return;
        const gp = gamepads[this._gamepadIndex];
        if (!gp) return;

        const deadzone = 0.15;
        const applyDeadzone = (val: number) => Math.abs(val) < deadzone ? 0 : val;

        this._virtualMoveX = applyDeadzone(gp.axes[0] || 0);
        this._virtualMoveZ = applyDeadzone(gp.axes[1] || 0);

        const lookX = applyDeadzone(gp.axes[2] || 0);
        const lookY = applyDeadzone(gp.axes[3] || 0);
        this._virtualLookX = lookX * 3.0;
        this._virtualLookY = lookY * 3.0;

        if (gp.buttons.length > 0) this._virtualJump = gp.buttons[0].pressed;
        if (gp.buttons.length > 1) this._virtualDig = gp.buttons[1].pressed;
        if (gp.buttons.length > 2) this._virtualPlace = gp.buttons[2].pressed;

        if (gp.buttons.length > 10 && gp.buttons[10].pressed) {
            this._virtualJump = true;
        }

        if (gp.buttons.length > 9) {
            const leftTrigger = gp.buttons[6]?.value || 0;
            const rightTrigger = gp.buttons[7]?.value || 0;
            if (leftTrigger > 0.5) this.virtualKeys.add('ShiftLeft');
            else this.virtualKeys.delete('ShiftLeft');
            if (rightTrigger > 0.5) this.virtualKeys.add('ControlLeft');
            else this.virtualKeys.delete('ControlLeft');
        }

        for (let i = 0; i < gp.buttons.length && i < 4; i++) {
            const btnName = `Gamepad${i}`;
            if (gp.buttons[i].pressed) this.virtualKeys.add(btnName);
            else this.virtualKeys.delete(btnName);
        }
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
