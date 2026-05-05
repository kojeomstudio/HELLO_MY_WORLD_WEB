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
    private anchorX: number = 0;
    private anchorY: number = 0;
    private containerStack: Array<{x: number, y: number}> = [];
    private formspecVersion: number = 1;
    private realCoordinates: boolean = false;
    private allowClose: boolean = true;

    show(formName: string, elementsJson: string): void {
        this.hide();
        document.exitPointerLock();

        this.currentFormName = formName;
        this.fields = {};
        this.containerOffsetX = 0;
        this.containerOffsetY = 0;
        this.anchorX = 0;
        this.anchorY = 0;
        this.containerStack = [];
        this.formspecVersion = 1;
        this.realCoordinates = false;
        this.allowClose = true;
        void this.formspecVersion;
        void this.realCoordinates;

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
        this.anchorX = 0;
        this.anchorY = 0;
        this.containerStack = [];
        this.formspecVersion = 1;
        this.realCoordinates = false;
        this.allowClose = true;
    }

    canClose(): boolean {
        return this.allowClose;
    }

    getCurrentFormName(): string {
        return this.currentFormName;
    }

    private createOverlay(): void {
        this.overlay = document.createElement('div');
        this.overlay.id = 'formspec-overlay';
        this.overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:600;display:flex;align-items:center;justify-content:center;';
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay && this.allowClose) {
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
            case 'pwdfield':
                this.renderPwdfield(element);
                break;
            case 'table':
                this.renderTable(element);
                break;
            case 'tabheader':
                this.renderTabheader(element);
                break;
            case 'scrollbar':
                this.renderScrollbar(element);
                break;
            case 'tooltip':
                this.renderTooltip(element);
                break;
            case 'background':
                this.renderBackground(element);
                break;
            case 'item_image':
                this.renderItemImage(element);
                break;
            case 'hypertext':
                this.renderHypertext(element);
                break;
            case 'animated_image':
                this.renderAnimatedImage(element);
                break;
            case 'style':
                this.applyStyle(element);
                break;
            case 'listring':
                break;
            case 'vertlabel':
                this.renderVertlabel(element);
                break;
            case 'image_button':
                this.renderImageButton(element);
                break;
            case 'item_image_button':
                this.renderItemImageButton(element);
                break;
            case 'button_exit':
                this.renderButton(element);
                break;
            case 'button_url':
                this.renderButton(element);
                break;
            case 'no_prepend':
                break;
            case 'anchor':
                this.handleAnchor(element);
                break;
            case 'position':
                this.handlePosition(element);
                break;
            case 'style_type':
                this.applyStyle(element);
                break;
            case 'formspec_version':
                this.formspecVersion = Number(element.version || 1);
                break;
            case 'scroll_container':
                this.renderScrollContainer(element);
                break;
            case 'real_coordinates':
                this.realCoordinates = element.enabled === true;
                break;
            case 'container_end':
                this.handleContainerEnd();
                break;
            case 'textlist':
                this.renderTextlist(element);
                break;
            case 'background9':
                this.renderBackground9(element);
                break;
            case 'allow_close':
                this.allowClose = element.enabled !== false;
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
        div.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;pointer-events:none;`;
        if (this.isValidCssColor(color)) {
            div.style.background = color;
        }
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
            if (element.indexEvent === true) {
                this.fields[name] = String(select.selectedIndex);
            } else {
                this.fields[name] = options[select.selectedIndex].trim();
            }
        });

        if (element.indexEvent === true) {
            this.fields[name] = String(Math.min(selectedIdx, options.length - 1));
        } else {
            this.fields[name] = options[Math.min(selectedIdx, options.length - 1)].trim();
        }
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

        if (texture && this.isValidCssColor(texture)) {
            img.style.background = texture;
        }

        this.container!.appendChild(img);
    }

    private renderContainer(element: FormspecElement): void {
        this.containerOffsetX += Number(element.x || 0) * this.unitSize;
        this.containerOffsetY += Number(element.y || 0) * this.unitSize;
    }

    private renderPwdfield(element: FormspecElement): void {
        const wrapper = document.createElement('div');
        const x = Number(element.x || 0) * this.unitSize;
        const y = Number(element.y || 0) * this.unitSize;
        const w = Number(element.width || 1) * this.unitSize;
        const h = Number(element.height || 1) * this.unitSize;
        const name = String(element.name || '');
        const label = String(element.label || '');

        wrapper.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;`;

        if (label) {
            const labelEl = document.createElement('div');
            labelEl.style.cssText = 'font-size:11px;color:#ccc;margin-bottom:2px;';
            labelEl.textContent = label;
            wrapper.appendChild(labelEl);
        }

        const input = document.createElement('input');
        input.type = 'password';
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

        this.fields[name] = '';
        this.container!.appendChild(wrapper);
    }

    private renderTable(element: FormspecElement): void {
        const wrapper = document.createElement('div');
        const x = Number(element.x || 0) * this.unitSize;
        const y = Number(element.y || 0) * this.unitSize;
        const w = Number(element.width || 1) * this.unitSize;
        const h = Number(element.height || 1) * this.unitSize;
        const name = String(element.name || '');
        const columnsStr = String(element.columns || '');
        const rowsStr = String(element.rows || '');

        wrapper.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;overflow:auto;background:rgba(0,0,0,0.3);border:1px solid #555;border-radius:3px;`;

        const table = document.createElement('table');
        table.style.cssText = 'width:100%;border-collapse:collapse;font-size:12px;';

        const columns = columnsStr.split(',').map(c => c.trim());

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        for (const col of columns) {
            const th = document.createElement('th');
            th.style.cssText = 'padding:4px 8px;text-align:left;background:rgba(80,80,80,0.8);color:white;border-bottom:1px solid #666;position:sticky;top:0;';
            th.textContent = col;
            headerRow.appendChild(th);
        }
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const rows = rowsStr.split('|').map(r => r.trim()).filter(r => r.length > 0);
        const tbody = document.createElement('tbody');
        for (const rowStr of rows) {
            const cells = rowStr.split(',').map(c => c.trim());
            const tr = document.createElement('tr');
            tr.style.cssText = 'cursor:pointer;';
            tr.addEventListener('mouseenter', () => {
                tr.style.background = 'rgba(80,120,180,0.4)';
            });
            tr.addEventListener('mouseleave', () => {
                tr.style.background = 'transparent';
            });
            tr.addEventListener('click', () => {
                this.fields[name] = cells[0] || '';
            });
            for (let i = 0; i < columns.length; i++) {
                const td = document.createElement('td');
                td.style.cssText = 'padding:3px 8px;color:#ddd;border-bottom:1px solid rgba(100,100,100,0.3);';
                td.textContent = cells[i] || '';
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        wrapper.appendChild(table);
        this.container!.appendChild(wrapper);
    }

    private renderTabheader(element: FormspecElement): void {
        const wrapper = document.createElement('div');
        const x = Number(element.x || 0) * this.unitSize;
        const y = Number(element.y || 0) * this.unitSize;
        const name = String(element.name || '');
        const tabsStr = String(element.tabs || '');
        const selectedIdx = Number(element.selected || 0);

        wrapper.style.cssText = `position:absolute;left:${x}px;top:${y}px;display:flex;gap:0;`;

        const tabs = tabsStr.split(',');
        for (let i = 0; i < tabs.length; i++) {
            const tab = document.createElement('button');
            const isActive = i === selectedIdx;
            tab.style.cssText = `padding:6px 16px;background:${isActive ? 'rgba(80,120,180,0.9)' : 'rgba(50,50,50,0.9)'};color:white;border:1px solid #666;border-bottom:${isActive ? '2px solid #5588cc' : '1px solid #666'};cursor:pointer;font-size:13px;border-radius:3px 3px 0 0;`;
            tab.textContent = tabs[i].trim();
            tab.addEventListener('mouseenter', () => {
                if (!isActive) tab.style.background = 'rgba(70,70,70,0.9)';
            });
            tab.addEventListener('mouseleave', () => {
                if (!isActive) tab.style.background = 'rgba(50,50,50,0.9)';
            });
            tab.addEventListener('click', (e) => {
                e.stopPropagation();
                this.fields[name] = String(i);
            });
            wrapper.appendChild(tab);
        }

        this.fields[name] = String(selectedIdx);
        this.container!.appendChild(wrapper);
    }

    private renderScrollbar(element: FormspecElement): void {
        const wrapper = document.createElement('div');
        const x = Number(element.x || 0) * this.unitSize;
        const y = Number(element.y || 0) * this.unitSize;
        const w = Number(element.width || 1) * this.unitSize;
        const h = Number(element.height || 1) * this.unitSize;
        const name = String(element.name || '');
        const value = Number(element.value || 0);
        const min = Number(element.min || 0);
        const max = Number(element.max || 100);
        const orientation = String(element.orientation || 'vertical');
        const isVertical = orientation !== 'horizontal';

        const input = document.createElement('input');
        input.type = 'range';
        input.min = String(min);
        input.max = String(max);
        input.value = String(value);

        if (isVertical) {
            const size = Math.max(w, h);
            input.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${size}px;height:${size}px;transform:rotate(-90deg);transform-origin:top left;accent-color:#5588cc;cursor:pointer;`;
        } else {
            input.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;accent-color:#5588cc;cursor:pointer;`;
        }

        input.addEventListener('input', () => {
            this.fields[name] = input.value;
        });

        this.fields[name] = String(value);
        wrapper.appendChild(input);
        this.container!.appendChild(wrapper);
    }

    private renderTooltip(element: FormspecElement): void {
        const span = document.createElement('span');
        const x = Number(element.x || 0) * this.unitSize;
        const y = Number(element.y || 0) * this.unitSize;
        const text = String(element.text || '');

        span.style.cssText = `position:absolute;left:${x}px;top:${y}px;cursor:help;border-bottom:1px dotted #aaa;`;
        span.textContent = '?';

        const tip = document.createElement('span');
        tip.style.cssText = 'visibility:hidden;position:absolute;bottom:120%;left:50%;transform:translateX(-50%);background:rgba(20,20,20,0.95);color:white;padding:4px 8px;border-radius:3px;font-size:12px;white-space:nowrap;border:1px solid #666;z-index:10;pointer-events:none;';
        tip.textContent = text;

        span.addEventListener('mouseenter', () => {
            tip.style.visibility = 'visible';
        });
        span.addEventListener('mouseleave', () => {
            tip.style.visibility = 'hidden';
        });

        span.appendChild(tip);
        this.container!.appendChild(span);
    }

    private renderBackground(element: FormspecElement): void {
        const div = document.createElement('div');
        const x = Number(element.x || 0) * this.unitSize;
        const y = Number(element.y || 0) * this.unitSize;
        const w = Number(element.width || 1) * this.unitSize;
        const h = Number(element.height || 1) * this.unitSize;
        const texture = String(element.texture || '');

        div.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;pointer-events:none;overflow:hidden;`;

        if (texture && texture.endsWith('.png') && !texture.includes('..') && !texture.includes('/') && /^[a-zA-Z0-9_\-]+\.png$/.test(texture)) {
            div.style.backgroundImage = `url(${texture})`;
            div.style.backgroundSize = 'cover';
            div.style.backgroundPosition = 'center';
        }

        this.container!.appendChild(div);
    }

    private renderItemImage(element: FormspecElement): void {
        const div = document.createElement('div');
        const x = Number(element.x || 0) * this.unitSize;
        const y = Number(element.y || 0) * this.unitSize;
        const w = Number(element.width || 1) * this.unitSize;
        const h = Number(element.height || 1) * this.unitSize;
        const itemName = String(element.itemName || '');

        div.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:rgba(60,60,60,0.5);border:1px solid rgba(255,255,255,0.1);pointer-events:none;overflow:hidden;display:flex;align-items:center;justify-content:center;`;

        const label = document.createElement('span');
        label.style.cssText = 'font-size:9px;color:#aaa;text-align:center;word-break:break-all;padding:2px;';
        label.textContent = itemName;
        div.appendChild(label);

        this.container!.appendChild(div);
    }

    private isValidCssColor(color: string): boolean {
        if (!color || color.length === 0) return false;
        if (color === 'transparent') return true;
        if (color.startsWith('#')) {
            return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(color);
        }
        if (color.startsWith('rgb')) {
            return /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(\s*,\s*[\d.]+)?\s*\)$/.test(color);
        }
        const safeColors = new Set([
            'red', 'blue', 'green', 'black', 'white', 'gray', 'grey',
            'yellow', 'orange', 'purple', 'pink', 'brown', 'cyan', 'magenta',
            'navy', 'teal', 'maroon', 'olive', 'lime', 'aqua', 'silver', 'fuchsia'
        ]);
        return safeColors.has(color.toLowerCase());
    }

    private renderHypertext(element: FormspecElement): void {
        const div = document.createElement('div');
        const x = Number(element.x || 0) * this.unitSize;
        const y = Number(element.y || 0) * this.unitSize;
        const w = Number(element.width || 1) * this.unitSize;
        const h = Number(element.height || 1) * this.unitSize;
        const name = String(element.name || '');
        const content = String(element.content || '');

        div.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;overflow:auto;background:rgba(0,0,0,0.3);border:1px solid #555;border-radius:3px;padding:8px;color:#ddd;font-size:13px;line-height:1.4;`;

        const lines = content.split('\n');
        for (const line of lines) {
            const boldMatch = line.match(/^<b>(.*)<\/b>$/);
            const italicMatch = line.match(/^<i>(.*)<\/i>$/);
            const linkMatch = line.match(/^<a\s+href="([^"]*)">(.*?)<\/a>$/);

            if (boldMatch) {
                const strong = document.createElement('strong');
                strong.textContent = boldMatch[1];
                div.appendChild(strong);
            } else if (italicMatch) {
                const em = document.createElement('em');
                em.textContent = italicMatch[1];
                div.appendChild(em);
            } else if (linkMatch) {
                const link = document.createElement('a');
                link.href = '#';
                link.style.cssText = 'color:#5588cc;text-decoration:underline;cursor:pointer;';
                link.textContent = linkMatch[2];
                const capturedHref = linkMatch[1];
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.fields[name] = 'action:' + capturedHref;
                });
                div.appendChild(link);
            } else {
                const span = document.createElement('span');
                span.textContent = line;
                div.appendChild(span);
            }
            div.appendChild(document.createElement('br'));
        }

        this.container!.appendChild(div);
    }

    private renderAnimatedImage(element: FormspecElement): void {
        const div = document.createElement('div');
        const x = Number(element.x || 0) * this.unitSize;
        const y = Number(element.y || 0) * this.unitSize;
        const w = Number(element.width || 1) * this.unitSize;
        const h = Number(element.height || 1) * this.unitSize;
        const name = String(element.name || '');
        const frameCount = Number(element.frameCount || 1);
        const frameDuration = Number(element.frameDuration || 100);

        div.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;pointer-events:none;overflow:hidden;background:rgba(60,60,60,0.5);border:1px solid rgba(255,255,255,0.1);`;

        const frameLabel = document.createElement('span');
        frameLabel.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:10px;color:#888;';
        frameLabel.textContent = `[${name}]`;
        div.appendChild(frameLabel);

        let currentFrame = 0;
        const interval = setInterval(() => {
            if (!div.parentNode) {
                clearInterval(interval);
                return;
            }
            currentFrame = (currentFrame + 1) % frameCount;
            this.fields[name] = String(currentFrame);
        }, frameDuration);

        this.container!.appendChild(div);
    }

    private isValidCssValue(value: string, type: 'color' | 'font' | 'size'): boolean {
        if (!value || value.length > 128) return false;
        if (type === 'color') {
            return /^(#[0-9a-fA-F]{3,8}|rgb(a?\([^)]*\))?|[a-zA-Z]+)$/.test(value) &&
                !value.includes('url(') && !value.includes('expression(');
        }
        if (type === 'font') {
            return /^[a-zA-Z0-9_\-\s,"']+$/.test(value) &&
                !value.includes('url(') && !value.includes('expression(');
        }
        if (type === 'size') {
            return /^[0-9]+(px|em|rem|%|pt|vh|vw)?$/.test(value);
        }
        return false;
    }

    private applyStyle(element: FormspecElement): void {
        const name = String(element.name || '');
        const propertiesStr = String(element.properties || '');

        if (!this.container || !name) return;

        const props = propertiesStr.split(',').reduce<Record<string, string>>((acc, prop) => {
            const parts = prop.split('=');
            if (parts.length === 2) {
                acc[parts[0].trim()] = parts[1].trim();
            }
            return acc;
        }, {});

        const elements = this.container.querySelectorAll(`[data-name="${name}"]`);
        elements.forEach(el => {
            const htmlEl = el as HTMLElement;
            for (const [key, value] of Object.entries(props)) {
                switch (key) {
                    case 'bgcolor':
                        if (this.isValidCssValue(value, 'color')) htmlEl.style.backgroundColor = value;
                        break;
                    case 'fgcolor':
                        if (this.isValidCssValue(value, 'color')) htmlEl.style.color = value;
                        break;
                    case 'bordercolor':
                        if (this.isValidCssValue(value, 'color')) htmlEl.style.borderColor = value;
                        break;
                    case 'font':
                        if (this.isValidCssValue(value, 'font')) htmlEl.style.fontFamily = value;
                        break;
                    case 'fontsize':
                        if (this.isValidCssValue(value, 'size')) htmlEl.style.fontSize = value;
                        break;
                }
            }
        });
    }

    private renderVertlabel(element: FormspecElement): void {
        const span = document.createElement('span');
        const x = Number(element.x || 0) * this.unitSize;
        const y = Number(element.y || 0) * this.unitSize;
        const text = String(element.text || '');

        span.style.cssText = `position:absolute;left:${x}px;top:${y}px;color:white;font-size:13px;writing-mode:vertical-rl;text-orientation:mixed;pointer-events:none;text-shadow:1px 1px 2px rgba(0,0,0,0.8);`;
        span.textContent = text;
        this.container!.appendChild(span);
    }

    private renderImageButton(element: FormspecElement): void {
        const btn = document.createElement('button');
        const x = Number(element.x || 0) * this.unitSize;
        const y = Number(element.y || 0) * this.unitSize;
        const w = Number(element.width || 1) * this.unitSize;
        const h = Number(element.height || 1) * this.unitSize;
        const name = String(element.name || '');
        const label = String(element.label || name);
        const texture = String(element.texture || '');

        let background = 'rgba(80,80,80,0.9)';
        if (texture && this.isValidCssColor(texture)) {
            background = texture;
        }

        btn.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${background};color:white;border:1px solid #888;border-radius:3px;cursor:pointer;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;`;
        btn.textContent = label;
        btn.dataset.name = name;
        btn.addEventListener('mouseenter', () => {
            btn.style.borderColor = '#aaa';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.borderColor = '#888';
        });
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.fields[name] = label;
            this.submitFields();
        });
        this.container!.appendChild(btn);
    }

    private renderItemImageButton(element: FormspecElement): void {
        const btn = document.createElement('button');
        const x = Number(element.x || 0) * this.unitSize;
        const y = Number(element.y || 0) * this.unitSize;
        const w = Number(element.width || 1) * this.unitSize;
        const h = Number(element.height || 1) * this.unitSize;
        const itemName = String(element.itemName || '');
        const name = String(element.name || '');
        const label = String(element.label || '');

        btn.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:rgba(60,60,60,0.5);border:1px solid rgba(255,255,255,0.1);border-radius:3px;cursor:pointer;font-size:13px;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;`;
        btn.dataset.name = name;

        const itemLabel = document.createElement('span');
        itemLabel.style.cssText = 'font-size:9px;color:#aaa;text-align:center;word-break:break-all;padding:2px;';
        itemLabel.textContent = itemName;
        btn.appendChild(itemLabel);

        if (label) {
            const textLabel = document.createElement('span');
            textLabel.style.cssText = 'font-size:11px;color:white;margin-top:2px;';
            textLabel.textContent = label;
            btn.appendChild(textLabel);
        }

        btn.addEventListener('mouseenter', () => {
            btn.style.borderColor = '#aaa';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.borderColor = 'rgba(255,255,255,0.1)';
        });
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.fields[name] = label;
            this.submitFields();
        });
        this.container!.appendChild(btn);
    }

    private handleAnchor(element: FormspecElement): void {
        this.anchorX = Number(element.x || 0) * this.unitSize;
        this.anchorY = Number(element.y || 0) * this.unitSize;
    }

    private handlePosition(element: FormspecElement): void {
        if (!this.container) return;
        const x = Number(element.x || 0) * this.unitSize + this.anchorX;
        const y = Number(element.y || 0) * this.unitSize + this.anchorY;
        this.container.style.left = `${x}px`;
        this.container.style.top = `${y}px`;
    }

    private renderScrollContainer(element: FormspecElement): void {
        const div = document.createElement('div');
        const x = Number(element.x || 0) * this.unitSize;
        const y = Number(element.y || 0) * this.unitSize;
        const w = Number(element.width || 1) * this.unitSize;
        const h = Number(element.height || 1) * this.unitSize;
        const orientation = String(element.orientation || 'vertical');
        const scrollDir = orientation === 'horizontal' ? 'overflow-x:auto;overflow-y:hidden;' : 'overflow-y:auto;overflow-x:hidden;';

        div.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;${scrollDir}background:rgba(0,0,0,0.2);border:1px solid rgba(100,100,100,0.3);border-radius:2px;`;
        div.dataset.scrollContainer = String(element.scrollbarName || '');
        this.container!.appendChild(div);
    }

    private handleContainerEnd(): void {
        if (this.containerStack.length > 0) {
            const prev = this.containerStack.pop()!;
            this.containerOffsetX = prev.x;
            this.containerOffsetY = prev.y;
        }
    }

    private renderTextlist(element: FormspecElement): void {
        const wrapper = document.createElement('div');
        const x = Number(element.x || 0) * this.unitSize;
        const y = Number(element.y || 0) * this.unitSize;
        const w = Number(element.width || 1) * this.unitSize;
        const h = Number(element.height || 1) * this.unitSize;
        const name = String(element.name || '');
        const itemsStr = String(element.items || '');
        const selectedIdx = Number(element.selectedIndex || 0);
        const transparent = element.transparent === true;

        const bgStyle = transparent ? 'background:transparent;' : 'background:rgba(0,0,0,0.3);';
        wrapper.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;overflow-y:auto;${bgStyle}border:1px solid #555;border-radius:3px;`;

        const items = itemsStr.split(',');
        for (let i = 0; i < items.length; i++) {
            const itemDiv = document.createElement('div');
            const isSelected = i === selectedIdx;
            itemDiv.style.cssText = `padding:4px 8px;color:white;font-size:13px;cursor:pointer;border-bottom:1px solid rgba(100,100,100,0.3);${isSelected ? 'background:rgba(80,120,180,0.5);' : ''}`;
            itemDiv.textContent = items[i].trim();
            const capturedIndex = i;
            itemDiv.addEventListener('mouseenter', () => {
                if (!itemDiv.dataset.selected) {
                    itemDiv.style.background = 'rgba(80,120,180,0.3)';
                }
            });
            itemDiv.addEventListener('mouseleave', () => {
                if (!itemDiv.dataset.selected) {
                    itemDiv.style.background = 'transparent';
                }
            });
            itemDiv.addEventListener('click', () => {
                const allItems = wrapper.querySelectorAll('[data-selected]');
                allItems.forEach(el => {
                    const htmlEl = el as HTMLElement;
                    htmlEl.style.background = 'transparent';
                    delete htmlEl.dataset.selected;
                });
                itemDiv.style.background = 'rgba(80,120,180,0.5)';
                itemDiv.dataset.selected = 'true';
                this.fields[name] = String(capturedIndex);
            });
            if (isSelected) {
                itemDiv.dataset.selected = 'true';
            }
            wrapper.appendChild(itemDiv);
        }

        this.fields[name] = String(selectedIdx);
        this.container!.appendChild(wrapper);
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

    private renderBackground9(element: FormspecElement): void {
        const div = document.createElement('div');
        const x = Number(element.x || 0) * this.unitSize;
        const y = Number(element.y || 0) * this.unitSize;
        const w = Number(element.width || 1) * this.unitSize;
        const h = Number(element.height || 1) * this.unitSize;
        const texture = String(element.texture || '');

        div.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;pointer-events:none;overflow:hidden;`;

        if (texture && texture.endsWith('.png') && !texture.includes('..') && !texture.includes('/') && /^[a-zA-Z0-9_\-]+\.png$/.test(texture)) {
            div.style.backgroundImage = `url(${texture})`;
            div.style.backgroundSize = `${w}px ${h}px`;
            div.style.backgroundPosition = 'center';
        }

        this.container!.appendChild(div);
    }
}
