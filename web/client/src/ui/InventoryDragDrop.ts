interface DragDropConfig {
    getSlotData: (slotIndex: number) => { itemId: string; count: number; color?: string } | null;
    onDrop: (fromSlot: number, toSlot: number) => void;
    slotCount: number;
    slotSelector: string;
    container: HTMLElement;
}

export class InventoryDragDrop {
    private config: DragDropConfig;
    private dragElement: HTMLElement | null = null;
    private isDragging: boolean = false;
    private dragSourceSlot: number = -1;
    private boundMouseMove: (e: MouseEvent) => void;
    private boundMouseUp: (e: MouseEvent) => void;

    constructor(config: DragDropConfig) {
        this.config = config;
        this.boundMouseMove = this.onMouseMove.bind(this);
        this.boundMouseUp = this.onMouseUp.bind(this);
        this.attach();
    }

    private attach(): void {
        const slots = this.config.container.querySelectorAll(this.config.slotSelector);
        slots.forEach((slot, index) => {
            slot.addEventListener('mousedown', (e: Event) => {
                const mouseEvent = e as MouseEvent;
                this.onMouseDown(mouseEvent, index);
            });
            slot.addEventListener('dblclick', (e: Event) => {
                const mouseEvent = e as MouseEvent;
                this.onDoubleClick(mouseEvent, index);
            });
        });
    }

    private onMouseDown(e: MouseEvent, slotIndex: number): void {
        if (e.button !== 0) return;

        const data = this.config.getSlotData(slotIndex);
        if (!data) return;

        e.preventDefault();
        this.isDragging = true;
        this.dragSourceSlot = slotIndex;

        this.dragElement = document.createElement('div');        this.dragElement.style.cssText = `position:fixed;pointer-events:none;z-index:10000;
            width:36px;height:36px;display:flex;align-items:center;justify-content:center;
            font-size:10px;color:white;border-radius:4px;
            background:${data.color || 'rgba(100,100,100,0.9)'};
            border:2px solid rgba(255,255,255,0.6);
            box-shadow:0 4px 12px rgba(0,0,0,0.5);
            text-shadow:1px 1px 1px black;
            transform:translate(-50%,-50%) scale(1.1);`;
        this.dragElement.textContent = this.formatName(data.itemId);
        if (data.count > 1) {
            const badge = document.createElement('span');
            badge.style.cssText = 'position:absolute;bottom:0;right:2px;font-size:9px;';
            badge.textContent = String(data.count);
            this.dragElement.appendChild(badge);
        }
        this.dragElement.style.left = `${e.clientX}px`;
        this.dragElement.style.top = `${e.clientY}px`;
        document.body.appendChild(this.dragElement);

        document.addEventListener('mousemove', this.boundMouseMove);
        document.addEventListener('mouseup', this.boundMouseUp);

        const sourceEl = this.getSlotElement(slotIndex);
        if (sourceEl) {
            sourceEl.style.opacity = '0.3';
        }
    }

    private onMouseMove(e: MouseEvent): void {
        if (!this.isDragging || !this.dragElement) return;
        this.dragElement.style.left = `${e.clientX}px`;
        this.dragElement.style.top = `${e.clientY}px`;

        const targetSlot = this.getSlotAtPosition(e.clientX, e.clientY);
        const slots = this.config.container.querySelectorAll(this.config.slotSelector);
        slots.forEach((slot) => {
            (slot as HTMLElement).style.border = '';
        });
        if (targetSlot >= 0) {
            const el = this.getSlotElement(targetSlot);
            if (el && targetSlot !== this.dragSourceSlot) {
                el.style.border = '2px solid #44ff44';
            }
        }
    }

    private onMouseUp(e: MouseEvent): void {
        document.removeEventListener('mousemove', this.boundMouseMove);
        document.removeEventListener('mouseup', this.boundMouseUp);

        if (!this.isDragging) return;

        const targetSlot = this.getSlotAtPosition(e.clientX, e.clientY);

        if (targetSlot >= 0 && targetSlot !== this.dragSourceSlot) {
            this.config.onDrop(this.dragSourceSlot, targetSlot);
        }

        const sourceEl = this.getSlotElement(this.dragSourceSlot);
        if (sourceEl) {
            sourceEl.style.opacity = '';
        }

        const slots = this.config.container.querySelectorAll(this.config.slotSelector);
        slots.forEach((slot) => {
            (slot as HTMLElement).style.border = '';
        });

        if (this.dragElement) {
            document.body.removeChild(this.dragElement);
            this.dragElement = null;
        }

        this.isDragging = false;
        this.dragSourceSlot = -1;
    }

    private onDoubleClick(_e: MouseEvent, slotIndex: number): void {
        const data = this.config.getSlotData(slotIndex);
        if (!data) return;

        const slots = this.config.container.querySelectorAll(this.config.slotSelector);
        for (let i = 0; i < slots.length; i++) {
            if (i === slotIndex) continue;
            const targetData = this.config.getSlotData(i);
            if (!targetData) {
                this.config.onDrop(slotIndex, i);
                return;
            }
        }
    }

    private getSlotAtPosition(clientX: number, clientY: number): number {
        const slots = this.config.container.querySelectorAll(this.config.slotSelector);
        for (let i = 0; i < slots.length; i++) {
            const rect = (slots[i] as HTMLElement).getBoundingClientRect();
            if (clientX >= rect.left && clientX <= rect.right &&
                clientY >= rect.top && clientY <= rect.bottom) {
                return i;
            }
        }
        return -1;
    }

    private getSlotElement(index: number): HTMLElement | null {
        const slots = this.config.container.querySelectorAll(this.config.slotSelector);
        return (slots[index] as HTMLElement) || null;
    }

    private formatName(itemId: string): string {
        return itemId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }

    destroy(): void {
        document.removeEventListener('mousemove', this.boundMouseMove);
        document.removeEventListener('mouseup', this.boundMouseUp);
        if (this.dragElement && this.dragElement.parentNode) {
            document.body.removeChild(this.dragElement);
        }
    }
}
