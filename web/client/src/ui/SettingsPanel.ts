export interface GameSettings {
    mouseSensitivity: number;
    renderDistance: number;
    fov: number;
    musicVolume: number;
    soundVolume: number;
    cloudsEnabled: boolean;
    aoEnabled: boolean;
}

const DEFAULT_SETTINGS: GameSettings = {
    mouseSensitivity: 0.002,
    renderDistance: 4,
    fov: 70,
    musicVolume: 0.5,
    soundVolume: 0.5,
    cloudsEnabled: true,
    aoEnabled: true
};

const STORAGE_KEY = 'helloworld_settings';

export class SettingsPanel {
    private element: HTMLElement | null = null;
    private overlay: HTMLElement | null = null;
    private settings: GameSettings;
    private onSettingsChanged: ((settings: GameSettings) => void) | null = null;

    constructor() {
        this.settings = this.loadSettings();
    }

    getSettings(): GameSettings {
        return { ...this.settings };
    }

    setOnSettingsChanged(callback: (settings: GameSettings) => void): void {
        this.onSettingsChanged = callback;
    }

    isOpen(): boolean {
        return this.element !== null;
    }

    show(): void {
        if (this.element) return;

        this.overlay = document.createElement('div');
        this.overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:599;';
        this.overlay.addEventListener('click', () => this.hide());

        this.element = document.createElement('div');
        this.element.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(40,40,50,0.95);color:white;padding:24px 28px;border-radius:8px;z-index:600;width:380px;font-family:monospace;';

        const header = document.createElement('div');
        header.style.cssText = 'font-size:20px;font-weight:bold;margin-bottom:16px;text-align:center;';
        header.textContent = 'Settings';

        const closeBtn = document.createElement('button');
        closeBtn.style.cssText = 'position:absolute;top:8px;right:14px;cursor:pointer;background:none;border:none;color:white;font-size:22px;';
        closeBtn.textContent = 'X';
        closeBtn.addEventListener('click', () => this.hide());

        this.element.appendChild(closeBtn);
        this.element.appendChild(header);

        this.element.appendChild(this.createSlider('Mouse Sensitivity', this.settings.mouseSensitivity, 0.001, 0.01, 0.001, (v) => { this.settings.mouseSensitivity = v; }));
        this.element.appendChild(this.createSlider('Render Distance', this.settings.renderDistance, 2, 8, 1, (v) => { this.settings.renderDistance = Math.round(v); }));
        this.element.appendChild(this.createSlider('FOV', this.settings.fov, 50, 110, 1, (v) => { this.settings.fov = Math.round(v); }));
        this.element.appendChild(this.createSlider('Music Volume', this.settings.musicVolume, 0, 1, 0.05, (v) => { this.settings.musicVolume = v; }));
        this.element.appendChild(this.createSlider('Sound Volume', this.settings.soundVolume, 0, 1, 0.05, (v) => { this.settings.soundVolume = v; }));

        this.element.appendChild(this.createToggle('Clouds', this.settings.cloudsEnabled, (v) => { this.settings.cloudsEnabled = v; }));
        this.element.appendChild(this.createToggle('Ambient Occlusion', this.settings.aoEnabled, (v) => { this.settings.aoEnabled = v; }));

        document.body.appendChild(this.overlay);
        document.body.appendChild(this.element);
        document.exitPointerLock();
    }

    hide(): void {
        if (this.element) {
            this.element.parentNode?.removeChild(this.element);
            this.element = null;
        }
        if (this.overlay) {
            this.overlay.parentNode?.removeChild(this.overlay);
            this.overlay = null;
        }
        this.saveSettings();
        if (this.onSettingsChanged) {
            this.onSettingsChanged(this.settings);
        }
    }

    private createSlider(label: string, value: number, min: number, max: number, step: number, onChange: (v: number) => void): HTMLElement {
        const container = document.createElement('div');
        container.style.cssText = 'margin-bottom:14px;';

        const labelRow = document.createElement('div');
        labelRow.style.cssText = 'display:flex;justify-content:space-between;margin-bottom:4px;font-size:13px;';

        const labelEl = document.createElement('span');
        labelEl.textContent = label;

        const valueEl = document.createElement('span');
        valueEl.style.cssText = 'color:#88aaff;';
        valueEl.textContent = String(value);

        labelRow.appendChild(labelEl);
        labelRow.appendChild(valueEl);

        const input = document.createElement('input');
        input.type = 'range';
        input.min = String(min);
        input.max = String(max);
        input.step = String(step);
        input.value = String(value);
        input.style.cssText = 'width:100%;cursor:pointer;';
        input.addEventListener('input', () => {
            const v = parseFloat(input.value);
            valueEl.textContent = step < 1 ? v.toFixed(3) : String(Math.round(v));
            onChange(v);
        });

        container.appendChild(labelRow);
        container.appendChild(input);
        return container;
    }

    private createToggle(label: string, value: boolean, onChange: (v: boolean) => void): HTMLElement {
        const container = document.createElement('div');
        container.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;font-size:13px;';

        const labelEl = document.createElement('span');
        labelEl.textContent = label;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = value;
        checkbox.style.cssText = 'width:18px;height:18px;cursor:pointer;';
        checkbox.addEventListener('change', () => {
            onChange(checkbox.checked);
        });

        container.appendChild(labelEl);
        container.appendChild(checkbox);
        return container;
    }

    private loadSettings(): GameSettings {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                return {
                    mouseSensitivity: parsed.mouseSensitivity ?? DEFAULT_SETTINGS.mouseSensitivity,
                    renderDistance: parsed.renderDistance ?? DEFAULT_SETTINGS.renderDistance,
                    fov: parsed.fov ?? DEFAULT_SETTINGS.fov,
                    musicVolume: parsed.musicVolume ?? DEFAULT_SETTINGS.musicVolume,
                    soundVolume: parsed.soundVolume ?? DEFAULT_SETTINGS.soundVolume,
                    cloudsEnabled: parsed.cloudsEnabled ?? DEFAULT_SETTINGS.cloudsEnabled,
                    aoEnabled: parsed.aoEnabled ?? DEFAULT_SETTINGS.aoEnabled
                };
            }
        } catch {
            // ignore
        }
        return { ...DEFAULT_SETTINGS };
    }

    private saveSettings(): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
        } catch {
            // ignore
        }
    }
}
