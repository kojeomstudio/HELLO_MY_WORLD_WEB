interface FormspecElement {
    type: string;
    [key: string]: string | number | boolean;
}

type FormspecResponseCallback = (formName: string, fields: Record<string, string>) => void;

export class FormspecRenderer {
    private overlay: HTMLElement | null = null;
    private container: HTMLElement | null = null;
    private currentFormName: string = '';
    private fields: Record<string, string> = {};
    private onResponse: FormspecResponseCallback | null = null;
    private formWidth: number = 10;
    private formHeight: number = 8;
    private unitSize: number = 40;
    private containerOffsetX: number = 0;
    private containerOffsetY: number = 0;

    show(formName: string, elementsJson: string): void {
        this.hide();
        document.exitPointerLock();

        this.currentFormName = formName;
        this.fields = {};
        this.containerOffsetX = 0;
        this.containerOffsetY = 0;

        let elements: FormspecElement[];
        try {
            elements = JSON.parse(elementsJson) as FormspecElement[];
        } catch {
            return;
        }

        if (!elements || elements.length === 0) return;

        const sizeElement = elements.find(e => e.type === 'size');
        if (sizeElement) {
            this.formWidth = Number(sizeElement.width) || 10;
            this.formHeight = Number(sizeElement.height) || 8;
        }

        this.createOverlay();
        this.createContainer();
        this.renderElements(elements);
    }

    setResponseCallback(callback: FormspecResponseCallback): void {
        this.onResponse = callback;
    }

    hide(): void {
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
        this.overlay = null;
        this.container = null;
        this.currentFormName = '';
        this.fields = {};
        this.containerOffsetX = 0;
        this.containerOffsetY = 0;
    }

    getCurrentFormName(): string {
        return this.currentFormName;
    }

    private createOverlay(): void {
        this.overlay = document.createElement('div');
        this.overlay.id = 'formspec-overlay';
        this.overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:600;display:flex;align-items:center;justify-content:center;';
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.submitFields();
            }
        });
        document.body.appendChild(this.overlay);
    }

    private createContainer(): void {
        this.container = document.createElement('div');
        this.container.id = 'formspec-container';
        const pixelWidth = this.formWidth * this.unitSize;
        const pixelHeight = this.formHeight * this.unitSize;
        this.container.style.cssText = `position:relative;width:${pixelWidth}px;height:${pixelHeight}px;background:rgba(30,30,30,0.95);color:white;border:2px solid #555;border-radius:6px;overflow:hidden;font-family:Arial,sans-serif;font-size:14px;`;
        this.overlay!.appendChild(this.container);
    }

    private renderElements(elements: FormspecElement[]): void {
        for (const element of elements) {
            this.renderElement(element);
        }
    }

    private renderElement(element: FormspecElement): void {
        switch (element.type) {
            case 'bgcolor':
                this.renderBgcolor(element);
                break;
            case 'box':
                this.renderBox(element);
                break;
            case 'label':
                this.renderLabel(element);
                break;
            case 'button':
                this.renderButton(element);
                break;
            case 'field':
                this.renderField(element);
                break;
            case 'textarea':
                this.renderTextarea(element);
                break;
            case 'dropdown':
                this.renderDropdown(element);
                break;
            case 'checkbox':
                this.renderCheckbox(element);
                break;
            case 'list':
                this.renderList(element);
                break;
            case 'image':
                this.renderImage(element);
                break;
            case 'container':
                this.renderContainer(element);
                break;
        }
    }

    private renderBgcolor(element: FormspecElement): void {
        const color = String(element.color || '#000000');
        const fullscreen = element.fullscreen === true;
        if (fullscreen && this.overlay) {
            this.overlay.style.background = color;
        } else if (this.container) {
            this.container.style.background = color;
        }
    }

    private renderBox(element: FormspecElement): void {
        const div = document.createElement('div');
        const x = Number(element.x || 0) * this.unitSize;
        const y = Number(element.y || 0) * this.unitSize;
        const w = Number(element.width || 1) * this.unitSize;
        const h = Number(element.height || 1) * this.unitSize;
        const color = String(element.color || '#333333');
        div.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${color};pointer-events:none;`;
        this.container!.appendChild(div);
    }

    private renderLabel(element: FormspecElement): void {
        const div = document.createElement('div');
        const x = Number(element.x || 0) * this.unitSize;
        const y = Number(element.y || 0) * this.unitSize;
        const text = String(element.text || '');
        div.style.cssText = `position:absolute;left:${x}px;top:${y}px;color:white;font-size:13px;white-space:nowrap;pointer-events:none;text-shadow:1px 1px 2px rgba(0,0,0,0.8);`;
        div.textContent = text;
        this.container!.appendChild(div);
    }

    private renderButton(element: FormspecElement): void {
        const btn = document.createElement('button');
        const x = Number(element.x || 0) * this.unitSize;
        const y = Number(element.y || 0) * this.unitSize;
        const w = Number(element.width || 1) * this.unitSize;
        const h = Number(element.height || 1) * this.unitSize;
        const name = String(element.name || '');
        const label = String(element.label || name);
        btn.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:rgba(80,80,80,0.9);color:white;border:1px solid #888;border-radius:3px;cursor:pointer;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;`;
        btn.textContent = label;
        btn.addEventListener('mouseenter', () => {
            btn.style.background = 'rgba(120,120,120,0.9)';
            btn.style.borderColor = '#aaa';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = 'rgba(80,80,80,0.9)';
            btn.style.borderColor = '#888';
        });
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.fields[name] = label;
            this.submitFields();
        });
        this.container!.appendChild(btn);
    }

    private renderField(element: FormspecElement): void {
        const wrapper = document.createElement('div');
        const x = Number(element.x || 0) * this.unitSize;
        const y = Number(element.y || 0) * this.unitSize;
        const w = Number(element.width || 1) * this.unitSize;
        const h = Number(element.height || 1) * this.unitSize;
        const name = String(element.name || '');
        const label = String(element.label || '');
        const defaultVal = String(element.default || '');

        wrapper.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;`;

        if (label) {
            const labelEl = document.createElement('div');
            labelEl.style.cssText = 'font-size:11px;color:#ccc;margin-bottom:2px;';
            labelEl.textContent = label;
            wrapper.appendChild(labelEl);
        }

        const input = document.createElement('input');
        input.type = 'text';
        input.value = defaultVal;
        input.style.cssText = `width:100%;height:${h - (label ? 16 : 0)}px;padding:4px 6px;background:rgba(0,0,0,0.5);border:1px solid #666;border-radius:3px;color:white;font-size:13px;outline:none;box-sizing:border-box;`;
        input.addEventListener('input', () => {
            this.fields[name] = input.value;
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.stopPropagation();
                this.fields[name] = input.value;
                this.submitFields();
            }
        });
        wrapper.appendChild(input);

        this.fields[name] = defaultVal;
        this.container!.appendChild(wrapper);
    }

    private renderTextarea(element: FormspecElement): void {
        const wrapper = document.createElement('div');
        const x = Number(element.x || 0) * this.unitSize;
        const y = Number(element.y || 0) * this.unitSize;
        const w = Number(element.width || 1) * this.unitSize;
        const h = Number(element.height || 1) * this.unitSize;
        const name = String(element.name || '');
        const label = String(element.label || '');
        const defaultVal = String(element.default || '');

        wrapper.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;`;

        if (label) {
            const labelEl = document.createElement('div');
            labelEl.style.cssText = 'font-size:11px;color:#ccc;margin-bottom:2px;';
            labelEl.textContent = label;
            wrapper.appendChild(labelEl);
        }

        const textarea = document.createElement('textarea');
        textarea.value = defaultVal;
        textarea.style.cssText = `width:100%;height:${h - (label ? 16 : 0)}px;padding:4px 6px;background:rgba(0,0,0,0.5);border:1px solid #666;border-radius:3px;color:white;font-size:13px;outline:none;resize:none;box-sizing:border-box;font-family:Arial,sans-serif;`;
        textarea.addEventListener('input', () => {
            this.fields[name] = textarea.value;
        });
        wrapper.appendChild(textarea);

        this.fields[name] = defaultVal;
        this.container!.appendChild(wrapper);
    }

    private renderDropdown(element: FormspecElement): void {
        const wrapper = document.createElement('div');
        const x = Number(element.x || 0) * this.unitSize;
        const y = Number(element.y || 0) * this.unitSize;
        const w = Number(element.width || 1) * this.unitSize;
        const h = Number(element.height || 1) * this.unitSize;
        const name = String(element.name || '');
        const optionsStr = String(element.options || '');
        const selectedIdx = Number(element.selectedIndex || 0);

        wrapper.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;`;

        const select = document.createElement('select');
        select.style.cssText = `width:100%;height:${h}px;padding:4px 6px;background:rgba(0,0,0,0.6);border:1px solid #666;border-radius:3px;color:white;font-size:13px;outline:none;cursor:pointer;box-sizing:border-box;`;

        const options = optionsStr.split(',');
        for (let i = 0; i < options.length; i++) {
            const option = document.createElement('option');
            option.value = String(i);
            option.textContent = options[i].trim();
            option.style.cssText = 'background:#2a2a2a;color:white;';
            select.appendChild(option);
        }
        select.selectedIndex = Math.min(selectedIdx, options.length - 1);

        select.addEventListener('change', () => {
            this.fields[name] = options[select.selectedIndex].trim();
        });

        this.fields[name] = options[Math.min(selectedIdx, options.length - 1)].trim();
        wrapper.appendChild(select);
        this.container!.appendChild(wrapper);
    }

    private renderCheckbox(element: FormspecElement): void {
        const wrapper = document.createElement('div');
        const x = Number(element.x || 0) * this.unitSize;
        const y = Number(element.y || 0) * this.unitSize;
        const name = String(element.name || '');
        const label = String(element.label || '');
        const selected = element.selected === true;

        wrapper.style.cssText = `position:absolute;left:${x}px;top:${y}px;display:flex;align-items:center;gap:6px;cursor:pointer;`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = selected;
        checkbox.style.cssText = 'width:16px;height:16px;cursor:pointer;accent-color:#5588cc;';

        const labelEl = document.createElement('span');
        labelEl.style.cssText = 'color:white;font-size:13px;';
        labelEl.textContent = label;

        checkbox.addEventListener('change', () => {
            this.fields[name] = checkbox.checked ? 'true' : 'false';
        });

        this.fields[name] = selected ? 'true' : 'false';

        wrapper.appendChild(checkbox);
        wrapper.appendChild(labelEl);
        this.container!.appendChild(wrapper);
    }

    private renderList(element: FormspecElement): void {
        const grid = document.createElement('div');
        const x = Number(element.x || 0) * this.unitSize;
        const y = Number(element.y || 0) * this.unitSize;
        const w = Number(element.width || 1);
        const h = Number(element.height || 1);
        const invLocation = String(element.inventoryLocation || '');
        const listName = String(element.listName || '');
        const startIndex = Number(element.startIndex || 0);

        const slotSize = this.unitSize;
        grid.style.cssText = `position:absolute;left:${x}px;top:${y}px;display:grid;grid-template-columns:repeat(${w},${slotSize}px);grid-template-rows:repeat(${h},${slotSize}px);gap:2px;`;

        const totalSlots = w * h;
        for (let i = 0; i < totalSlots; i++) {
            const slot = document.createElement('div');
            slot.style.cssText = 'width:40px;height:40px;background:rgba(0,0,0,0.4);border:1px solid #555;border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:9px;color:#aaa;text-align:center;cursor:pointer;position:relative;';
            slot.textContent = '';
            const slotIndex = startIndex + i;
            const fullName = `${invLocation}:${listName}`;
            slot.dataset.inventory = fullName;
            slot.dataset.slot = String(slotIndex);
            slot.addEventListener('click', () => {
                this.fields[fullName] = String(slotIndex);
            });
            grid.appendChild(slot);
        }

        this.container!.appendChild(grid);
    }

    private renderImage(element: FormspecElement): void {
        const img = document.createElement('div');
        const x = Number(element.x || 0) * this.unitSize;
        const y = Number(element.y || 0) * this.unitSize;
        const w = Number(element.width || 1) * this.unitSize;
        const h = Number(element.height || 1) * this.unitSize;
        const texture = String(element.texture || '');

        img.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:rgba(60,60,60,0.5);border:1px solid rgba(255,255,255,0.1);pointer-events:none;overflow:hidden;`;

        if (texture && !texture.endsWith('.png')) {
            try {
                img.style.background = texture;
            } catch {
            }
        }

        this.container!.appendChild(img);
    }

    private renderContainer(element: FormspecElement): void {
        this.containerOffsetX += Number(element.x || 0) * this.unitSize;
        this.containerOffsetY += Number(element.y || 0) * this.unitSize;
    }

    private submitFields(): void {
        if (!this.currentFormName) return;

        const formName = this.currentFormName;
        const fields = { ...this.fields };

        this.hide();

        if (this.onResponse) {
            this.onResponse(formName, fields);
        }
    }
}
