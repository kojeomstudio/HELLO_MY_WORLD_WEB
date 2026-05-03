interface GridItem {
    itemId: string;
    count: number;
    blockId?: number | null;
}

interface CraftResult {
    itemId: string;
    count: number;
}

export class CraftingGridUI {
    private container: HTMLDivElement;
    private grid: (HTMLDivElement | null)[];
    private resultSlot: HTMLDivElement | null;
    private overlay: HTMLDivElement | null;
    private isVisible: boolean = false;
    private gridItems: (GridItem | null)[];
    private onCraftCallback: (recipe: CraftResult) => void;
    private onGridChangeCallback: (items: (string | null)[]) => void;
    private currentResult: CraftResult | null;

    constructor(
        container: HTMLElement,
        onCraft: (recipe: CraftResult) => void,
        onGridChange: (items: (string | null)[]) => void
    ) {
        this.container = container as HTMLDivElement;
        this.grid = new Array(9).fill(null);
        this.resultSlot = null;
        this.overlay = null;
        this.gridItems = new Array(9).fill(null);
        this.onCraftCallback = onCraft;
        this.onGridChangeCallback = onGridChange;
        this.currentResult = null;
        this.buildUI();
    }

    private buildUI(): void {
        this.container.style.cssText = 'position:fixed;top:45%;left:50%;transform:translate(-50%,-50%);background:rgba(60,40,20,0.95);color:white;padding:20px;border-radius:8px;z-index:500;display:none;pointer-events:auto;';

        const header = document.createElement('div');
        header.style.cssText = 'font-size:18px;font-weight:bold;margin-bottom:12px;text-align:center;position:relative;';
        header.textContent = 'Crafting Grid';

        const closeBtn = document.createElement('button');
        closeBtn.style.cssText = 'position:absolute;top:-2px;right:0;cursor:pointer;background:none;border:none;color:white;font-size:20px;';
        closeBtn.textContent = 'X';
        closeBtn.addEventListener('click', () => {
            this.hide();
        });
        header.appendChild(closeBtn);

        const body = document.createElement('div');
        body.style.cssText = 'display:flex;align-items:center;gap:16px;';

        const gridContainer = document.createElement('div');
        gridContainer.style.cssText = 'display:grid;grid-template-columns:repeat(3,48px);grid-template-rows:repeat(3,48px);gap:4px;';

        for (let i = 0; i < 9; i++) {
            const slot = document.createElement('div');
            slot.style.cssText = 'width:48px;height:48px;background:rgba(0,0,0,0.4);border:2px solid #555;border-radius:4px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:9px;color:#aaa;text-align:center;position:relative;';
            const slotIndex = i;
            slot.addEventListener('click', () => {
                if (this.gridItems[slotIndex]) {
                    this.removeFromGrid(slotIndex);
                }
            });
            slot.addEventListener('mouseenter', () => {
                slot.style.borderColor = '#aaddff';
                slot.style.background = 'rgba(100,150,200,0.3)';
            });
            slot.addEventListener('mouseleave', () => {
                slot.style.borderColor = '#555';
                slot.style.background = 'rgba(0,0,0,0.4)';
            });
            this.grid[i] = slot;
            gridContainer.appendChild(slot);
        }

        const arrow = document.createElement('div');
        arrow.style.cssText = 'font-size:24px;color:#ffdd44;';
        arrow.textContent = '\u2192';

        const resultContainer = document.createElement('div');
        resultContainer.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:4px;';

        this.resultSlot = document.createElement('div');
        this.resultSlot.style.cssText = 'width:48px;height:48px;background:rgba(0,0,0,0.4);border:2px solid #886600;border-radius:4px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:9px;color:#aaa;text-align:center;position:relative;';
        const resultSlot = this.resultSlot;
        resultSlot.addEventListener('click', () => {
            if (this.currentResult && this.currentResult.itemId) {
                this.onCraftCallback(this.currentResult);
            }
        });
        resultSlot.addEventListener('mouseenter', () => {
            if (this.currentResult && this.currentResult.itemId) {
                resultSlot.style.borderColor = '#ffdd44';
                resultSlot.style.background = 'rgba(100,100,40,0.4)';
            }
        });
        resultSlot.addEventListener('mouseleave', () => {
            resultSlot.style.borderColor = '#886600';
            resultSlot.style.background = 'rgba(0,0,0,0.4)';
        });

        const resultLabel = document.createElement('div');
        resultLabel.style.cssText = 'font-size:10px;color:#888;';
        resultLabel.textContent = 'Result';

        resultContainer.appendChild(this.resultSlot);
        resultContainer.appendChild(resultLabel);

        body.appendChild(gridContainer);
        body.appendChild(arrow);
        body.appendChild(resultContainer);

        this.container.appendChild(header);
        this.container.appendChild(body);
    }

    show(): void {
        this.container.style.display = 'block';
        this.isVisible = true;

        if (!this.overlay) {
            this.overlay = document.createElement('div');
            this.overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:499;pointer-events:auto;';
            this.overlay.addEventListener('click', () => {
                this.hide();
            });
        }
        document.body.appendChild(this.overlay);
        document.body.appendChild(this.container);
        document.exitPointerLock();
    }

    hide(): void {
        this.container.style.display = 'none';
        this.isVisible = false;
        this.clearGrid();

        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
        if (this.container.parentNode && this.container.parentNode !== document.body) {
            // already in body
        }
    }

    getIsVisible(): boolean {
        return this.isVisible;
    }

    getGridItemIds(): (string | null)[] {
        return this.gridItems.map(item => item ? item.itemId : null);
    }

    addToGrid(item: GridItem, slotIndex: number): void {
        if (!this.isVisible) return;

        let targetIndex = slotIndex;
        if (targetIndex < 0 || targetIndex >= 9 || this.gridItems[targetIndex]) {
            for (let i = 0; i < 9; i++) {
                if (!this.gridItems[i]) {
                    targetIndex = i;
                    break;
                }
            }
        }

        if (this.gridItems[targetIndex]) return;

        this.gridItems[targetIndex] = { ...item };
        this.renderSlot(targetIndex);
        this.notifyGridChange();
    }

    removeFromGrid(slotIndex: number): void {
        if (slotIndex < 0 || slotIndex >= 9) return;
        if (!this.gridItems[slotIndex]) return;

        this.gridItems[slotIndex] = null;
        this.renderSlot(slotIndex);
        this.notifyGridChange();

        const event = new CustomEvent('gridItemReturned', {
            detail: { slotIndex }
        });
        document.dispatchEvent(event);
    }

    clearGrid(): void {
        for (let i = 0; i < 9; i++) {
            this.gridItems[i] = null;
            this.renderSlot(i);
        }
        this.setResult(null);
        this.currentResult = null;
    }

    setResult(result: CraftResult | null): void {
        this.currentResult = result;
        if (!this.resultSlot) return;

        if (result && result.itemId) {
            this.resultSlot.textContent = this.formatItemName(result.itemId);
            this.resultSlot.style.color = '#ffdd44';
            this.resultSlot.style.fontSize = '9px';
            this.resultSlot.style.borderColor = '#886600';

            if (result.count > 1) {
                const countBadge = document.createElement('span');
                countBadge.style.cssText = 'position:absolute;bottom:1px;right:2px;font-size:10px;color:white;text-shadow:1px 1px 1px black;';
                countBadge.textContent = String(result.count);
                this.resultSlot.appendChild(countBadge);
            }
        } else {
            this.resultSlot.textContent = '';
            this.resultSlot.style.color = '#aaa';
            this.resultSlot.style.fontSize = '9px';
            this.resultSlot.style.borderColor = '#886600';
        }
    }

    private renderSlot(index: number): void {
        const slot = this.grid[index];
        if (!slot) return;

        const item = this.gridItems[index];
        if (item) {
            slot.textContent = this.formatItemName(item.itemId);
            slot.style.color = '#ffdd44';
            slot.style.fontSize = '8px';

            if (item.count > 1) {
                const countBadge = document.createElement('span');
                countBadge.style.cssText = 'position:absolute;bottom:1px;right:2px;font-size:10px;color:white;text-shadow:1px 1px 1px black;';
                countBadge.textContent = String(item.count);
                slot.appendChild(countBadge);
            }
        } else {
            slot.textContent = '';
            slot.style.color = '#aaa';
            slot.style.fontSize = '9px';
        }
    }

    private notifyGridChange(): void {
        const items: (string | null)[] = this.gridItems.map(item => item ? item.itemId : null);
        this.onGridChangeCallback(items);
    }

    private formatItemName(itemId: string): string {
        return itemId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }
}
