import { InputManager } from './InputManager';

interface TouchButton {
    element: HTMLElement;
    key: string;
    active: boolean;
}

export class TouchControls {
    private input: InputManager;
    private container: HTMLElement | null = null;
    private joystickZone: HTMLElement | null = null;
    private joystickKnob: HTMLElement | null = null;
    private joystickTouchId: number | null = null;
    private joystickCenterX: number = 0;
    private joystickCenterY: number = 0;
    private buttons: TouchButton[] = [];
    private lookTouchId: number | null = null;
    private lastLookX: number = 0;
    private lastLookY: number = 0;
    private enabled: boolean = false;
    private readonly JOYSTICK_RADIUS = 50;

    constructor(input: InputManager) {
        this.input = input;
        this.detectTouch();
    }

    private detectTouch(): void {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) {
            this.enabled = true;
            this.createUI();
        }
    }

    isEnabled(): boolean {
        return this.enabled;
    }

    private createUI(): void {
        this.container = document.createElement('div');
        this.container.id = 'touch-controls';
        this.container.style.cssText = 'position:fixed;inset:0;z-index:200;pointer-events:none;display:none;';

        this.createJoystick();
        this.createActionButtons();

        document.body.appendChild(this.container);
        this.setupListeners();
    }

    private createJoystick(): void {
        const zoneSize = 150;
        this.joystickZone = document.createElement('div');
        this.joystickZone.style.cssText = `position:fixed;bottom:30px;left:30px;width:${zoneSize}px;height:${zoneSize}px;border-radius:50%;background:rgba(255,255,255,0.12);border:2px solid rgba(255,255,255,0.2);pointer-events:auto;touch-action:none;`;

        this.joystickKnob = document.createElement('div');
        this.joystickKnob.style.cssText = `position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:50px;height:50px;border-radius:50%;background:rgba(255,255,255,0.4);border:2px solid rgba(255,255,255,0.5);`;
        this.joystickZone.appendChild(this.joystickKnob);
        this.container!.appendChild(this.joystickZone);
    }

    private createActionButton(key: string, label: string, color: string, right: string, bottom: string): HTMLElement {
        const btn = document.createElement('div');
        btn.style.cssText = `position:fixed;right:${right};bottom:${bottom};width:56px;height:56px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.3);pointer-events:auto;touch-action:none;display:flex;align-items:center;justify-content:center;color:white;font-size:11px;font-weight:bold;text-shadow:1px 1px 2px rgba(0,0,0,0.5);user-select:none;`;
        btn.textContent = label;
        btn.dataset.key = key;
        this.container!.appendChild(btn);
        this.buttons.push({ element: btn, key, active: false });
        return btn;
    }

    private createActionButtons(): void {
        this.createActionButton('Space', 'JUMP', 'rgba(100,180,255,0.4)', '20px', '120px');
        this.createActionButton('dig', 'DIG', 'rgba(255,100,100,0.4)', '90px', '120px');
        this.createActionButton('place', 'USE', 'rgba(100,255,100,0.4)', '20px', '50px');
        this.createActionButton('ShiftLeft', 'RUN', 'rgba(255,200,50,0.4)', '90px', '50px');
    }

    show(): void {
        if (this.container) {
            this.container.style.display = 'block';
        }
    }

    hide(): void {
        if (this.container) {
            this.container.style.display = 'none';
        }
        this.input.setVirtualMove(0, 0);
        this.input.setVirtualLook(0, 0);
        this.input.setVirtualJump(false);
        this.input.setVirtualDig(false);
        this.input.setVirtualPlace(false);
    }

    private setupListeners(): void {
        if (!this.container) return;

        this.joystickZone!.addEventListener('touchstart', (e: TouchEvent) => {
            e.preventDefault();
            if (this.joystickTouchId !== null) return;
            const touch = e.changedTouches[0];
            this.joystickTouchId = touch.identifier;
            const rect = this.joystickZone!.getBoundingClientRect();
            this.joystickCenterX = rect.left + rect.width / 2;
            this.joystickCenterY = rect.top + rect.height / 2;
            this.updateJoystick(touch.clientX, touch.clientY);
        }, { passive: false });

        this.joystickZone!.addEventListener('touchmove', (e: TouchEvent) => {
            e.preventDefault();
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                if (touch.identifier === this.joystickTouchId) {
                    this.updateJoystick(touch.clientX, touch.clientY);
                    break;
                }
            }
        }, { passive: false });

        const endJoystick = (e: TouchEvent) => {
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === this.joystickTouchId) {
                    this.joystickTouchId = null;
                    this.input.setVirtualMove(0, 0);
                    if (this.joystickKnob) {
                        this.joystickKnob.style.transform = 'translate(-50%,-50%)';
                    }
                    break;
                }
            }
        };
        this.joystickZone!.addEventListener('touchend', endJoystick);
        this.joystickZone!.addEventListener('touchcancel', endJoystick);

        this.container.addEventListener('touchstart', (e: TouchEvent) => {
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                const target = touch.target as HTMLElement;

                for (const btn of this.buttons) {
                    if (target === btn.element || btn.element.contains(target)) {
                        btn.active = true;
                        if (btn.key === 'dig') {
                            this.input.setVirtualDig(true);
                        } else if (btn.key === 'place') {
                            this.input.setVirtualPlace(true);
                        } else {
                            this.input.setVirtualKey(btn.key, true);
                        }
                        break;
                    }
                }

                if (this.joystickTouchId === null && this.lookTouchId === null) {
                    const isInButton = this.buttons.some(b => b.element === target || b.element.contains(target));
                    const isInJoystick = this.joystickZone!.contains(target);
                    if (!isInButton && !isInJoystick) {
                        this.lookTouchId = touch.identifier;
                        this.lastLookX = touch.clientX;
                        this.lastLookY = touch.clientY;
                    }
                }
            }
        }, { passive: true });

        this.container.addEventListener('touchmove', (e: TouchEvent) => {
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                if (touch.identifier === this.lookTouchId) {
                    const dx = touch.clientX - this.lastLookX;
                    const dy = touch.clientY - this.lastLookY;
                    this.input.setVirtualLook(dx * 0.01, dy * 0.01);
                    this.lastLookX = touch.clientX;
                    this.lastLookY = touch.clientY;
                    break;
                }
            }
        }, { passive: true });

        const endTouch = (e: TouchEvent) => {
            for (let i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                if (touch.identifier === this.lookTouchId) {
                    this.lookTouchId = null;
                    this.input.setVirtualLook(0, 0);
                }
                for (const btn of this.buttons) {
                    if (btn.active) {
                        btn.active = false;
                        if (btn.key === 'dig') {
                            this.input.setVirtualDig(false);
                        } else if (btn.key === 'place') {
                            this.input.setVirtualPlace(false);
                        } else {
                            this.input.setVirtualKey(btn.key, false);
                        }
                    }
                }
            }
        };
        this.container.addEventListener('touchend', endTouch);
        this.container.addEventListener('touchcancel', endTouch);
    }

    private updateJoystick(touchX: number, touchY: number): void {
        let dx = touchX - this.joystickCenterX;
        let dy = touchY - this.joystickCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > this.JOYSTICK_RADIUS) {
            dx = (dx / dist) * this.JOYSTICK_RADIUS;
            dy = (dy / dist) * this.JOYSTICK_RADIUS;
        }

        const normX = dx / this.JOYSTICK_RADIUS;
        const normY = dy / this.JOYSTICK_RADIUS;
        this.input.setVirtualMove(normX, normY);

        if (this.joystickKnob) {
            this.joystickKnob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
        }
    }
}
