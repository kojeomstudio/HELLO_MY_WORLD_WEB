import * as HubConnection from '@microsoft/signalr';
import { SettingsPanel } from './SettingsPanel';

interface CreativeInventoryEntry {
    id: number;
    name: string;
    color: string;
    solid: boolean;
}

export class UIManager {
    private _connection: HubConnection.HubConnection | null = null;
    private chatMessages: HTMLElement;
    private healthBar: HTMLElement;
    private hotbar: HTMLElement;
    private debugInfo: HTMLElement;
    private deathScreen: HTMLElement | null = null;
    private craftingUI: HTMLElement | null = null;
    private breathBar: HTMLElement | null = null;
    private hungerBar: HTMLElement | null = null;
    private furnaceUI: HTMLElement | null = null;
    private chestUI: HTMLElement | null = null;
    private creativeInventoryUI: HTMLElement | null = null;
    private chestPosition: { x: number; y: number; z: number } | null = null;
    private furnacePosition: { x: number; y: number; z: number } | null = null;
    private creativePage: number = 0;
    private creativeFilter: string = '';
    private creativeEntries: CreativeInventoryEntry[] = [];
    private onCreativeSelect: ((blockId: number) => void) | null = null;
    private settingsPanel: SettingsPanel;

    constructor() {
        this.chatMessages = document.getElementById('chat-messages')!;
        this.healthBar = document.getElementById('health-bar')!;
        this.hotbar = document.getElementById('hotbar')!;
        this.debugInfo = document.getElementById('debug-info')!;
        this.settingsPanel = new SettingsPanel();
        this.setupHotbar();
    }

    setConnection(connection: HubConnection.HubConnection): void {
        this._connection = connection;
        document.addEventListener('blockAction', ((e: CustomEvent) => {
            if (!this._connection) return;
            const { type, x, y, z, blockType } = e.detail;
            if (type === 'dig') {
                this._connection.invoke('DigBlock', x, y, z);
            } else if (type === 'place') {
                this._connection.invoke('PlaceBlock', x, y, z, blockType);
            }
        }) as EventListener);

        document.addEventListener('interactBlock', ((e: CustomEvent) => {
            if (!this._connection) return;
            const { x, y, z, blockName } = e.detail;
            if (blockName === 'chest') {
                this.showChestUI(x, y, z);
                this._connection.invoke('GetChestInventory', x, y, z);
            } else if (blockName === 'furnace') {
                this.showFurnaceUI(x, y, z);
                this._connection.invoke('GetSmeltingRecipes');
            } else if (blockName === 'crafting_table') {
                this.showCraftingUI();
                this._connection.invoke('GetCraftingRecipes');
            }
        }) as EventListener);

        document.addEventListener('openCrafting', () => {
            if (!this._connection) return;
            this.showCraftingUI();
            this._connection.invoke('GetCraftingRecipes');
        });
    }

    private setupHotbar(): void {
        this.hotbar.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            const slot = document.createElement('div');
            slot.className = 'hotbar-slot';
            slot.innerHTML = `<span style="font-size:12px;color:#aaa">${i + 1}</span>`;
            if (i === 0) slot.classList.add('selected');
            this.hotbar.appendChild(slot);
        }
    }

    addChatMessage(sender: string, message: string): void {
        const msgEl = document.createElement('div');
        msgEl.className = 'chat-message';
        const senderSpan = document.createElement('span');
        senderSpan.className = 'sender';
        senderSpan.textContent = sender + ':';
        const textNode = document.createTextNode(' ' + message);
        msgEl.appendChild(senderSpan);
        msgEl.appendChild(textNode);
        this.chatMessages.appendChild(msgEl);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;

        while (this.chatMessages.children.length > 100) {
            this.chatMessages.removeChild(this.chatMessages.firstChild!);
        }
    }

    updateHealth(health: number, maxHealth: number): void {
        const hearts = Math.ceil(maxHealth / 2);
        this.healthBar.innerHTML = '';
        for (let i = 0; i < hearts; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart';
            const heartHealth = health - i * 2;
            if (heartHealth <= 0) heart.classList.add('empty');
            this.healthBar.appendChild(heart);
        }
    }

    updateInventory(items: any[]): void {
        for (let i = 0; i < 8; i++) {
            const slot = this.hotbar.children[i] as HTMLElement;
            if (items[i] && items[i].itemId) {
                const item = items[i];
                const nameSpan = document.createElement('span');
                nameSpan.style.cssText = 'font-size:11px;color:white';
                nameSpan.textContent = item.itemId.replace(/_/g, ' ');
                slot.innerHTML = '';
                slot.appendChild(nameSpan);
                if (item.count > 1) {
                    const countSpan = document.createElement('span');
                    countSpan.style.cssText = 'position:absolute;bottom:2px;right:4px;font-size:10px;color:white';
                    countSpan.textContent = String(item.count);
                    slot.appendChild(countSpan);
                }
                if (item.metadata) {
                    slot.style.borderBottom = '2px solid #00ff00';
                }
            } else {
                slot.innerHTML = `<span style="font-size:12px;color:#aaa">${i + 1}</span>`;
                slot.style.borderBottom = '';
            }
        }
    }

    updatePlayerList(players: string[]): void {
        let panel = document.getElementById('player-list-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'player-list-panel';
            panel.style.cssText = 'position:fixed;top:10px;right:10px;background:rgba(0,0,0,0.6);color:white;padding:8px 12px;border-radius:4px;font-size:13px;max-height:300px;overflow-y:auto;z-index:100;display:none;';
            document.body.appendChild(panel);
        }

        if (players.length === 0) {
            panel.style.display = 'none';
            return;
        }

        panel.style.display = 'block';
        panel.innerHTML = '';
        const titleDiv = document.createElement('div');
        titleDiv.style.cssText = 'font-weight:bold;margin-bottom:4px';
        titleDiv.textContent = `Players (${players.length})`;
        panel.appendChild(titleDiv);
        for (const name of players) {
            const row = document.createElement('div');
            row.textContent = name;
            panel.appendChild(row);
        }
    }

    setSelectedSlot(slot: number): void {
        const children = this.hotbar.children;
        for (let i = 0; i < children.length; i++) {
            children[i].classList.toggle('selected', i === slot);
        }
    }

    updateHotbarSelection(slot: number): void {
        const children = this.hotbar.children;
        for (let i = 0; i < children.length; i++) {
            children[i].classList.toggle('selected', i === slot);
        }
    }

    showDeathScreen(message: string): void {
        this.hideDeathScreen();

        this.deathScreen = document.createElement('div');
        this.deathScreen.id = 'death-screen';
        this.deathScreen.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(150,0,0,0.5);display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:1000;';

        const title = document.createElement('div');
        title.style.cssText = 'font-size:48px;color:#ff4444;font-weight:bold;margin-bottom:16px;text-shadow:2px 2px 4px black;';
        title.textContent = 'You Died!';

        const msg = document.createElement('div');
        msg.style.cssText = 'font-size:20px;color:#ffaaaa;margin-bottom:24px;';
        msg.textContent = message;

        const respawnBtn = document.createElement('button');
        respawnBtn.id = 'respawn-button';
        respawnBtn.style.cssText = 'padding:12px 32px;font-size:18px;cursor:pointer;background:#cc2222;color:white;border:2px solid #ff4444;border-radius:4px;';
        respawnBtn.textContent = 'Respawn';
        respawnBtn.addEventListener('click', () => {
            const event = new CustomEvent('respawnRequest');
            document.dispatchEvent(event);
        });

        this.deathScreen.appendChild(title);
        this.deathScreen.appendChild(msg);
        this.deathScreen.appendChild(respawnBtn);
        document.body.appendChild(this.deathScreen);

        document.exitPointerLock();
    }

    hideDeathScreen(): void {
        if (this.deathScreen && this.deathScreen.parentNode) {
            this.deathScreen.parentNode.removeChild(this.deathScreen);
            this.deathScreen = null;
        }
    }

    showCraftingUI(): void {
        this.hideCraftingUI();
        this.hideFurnaceUI();
        this.hideChestUI();
        document.exitPointerLock();

        this.craftingUI = document.createElement('div');
        this.craftingUI.id = 'crafting-ui';
        this.craftingUI.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(60,40,20,0.95);color:white;padding:20px;border-radius:8px;z-index:500;width:420px;max-height:80vh;display:flex;flex-direction:column;';

        const header = document.createElement('div');
        header.style.cssText = 'font-size:20px;font-weight:bold;margin-bottom:12px;text-align:center;';
        header.textContent = 'Crafting';

        const closeBtn = document.createElement('button');
        closeBtn.style.cssText = 'position:absolute;top:8px;right:12px;cursor:pointer;background:none;border:none;color:white;font-size:20px;';
        closeBtn.textContent = 'X';
        closeBtn.addEventListener('click', () => {
            this.hideCraftingUI();
        });

        const body = document.createElement('div');
        body.id = 'crafting-body';
        body.style.cssText = 'font-size:13px;overflow-y:auto;flex:1;';
        body.textContent = 'Loading recipes...';

        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:499;';
        overlay.addEventListener('click', () => {
            this.hideCraftingUI();
        });

        this.craftingUI.appendChild(closeBtn);
        this.craftingUI.appendChild(header);
        this.craftingUI.appendChild(body);
        document.body.appendChild(overlay);
        document.body.appendChild(this.craftingUI);
    }

    hideCraftingUI(): void {
        if (this.craftingUI && this.craftingUI.parentNode) {
            const overlay = this.craftingUI.previousElementSibling as HTMLElement | null;
            if (overlay && overlay.style?.zIndex === '499') {
                overlay.parentNode?.removeChild(overlay);
            }
            this.craftingUI.parentNode.removeChild(this.craftingUI);
            this.craftingUI = null;
        }
    }

    populateCraftingRecipes(recipes: any[]): void {
        if (!this.craftingUI) return;
        const body = document.getElementById('crafting-body');
        if (!body) return;

        body.innerHTML = '';
        if (recipes.length === 0) {
            body.textContent = 'No crafting recipes available.';
            return;
        }

        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];
            const row = document.createElement('div');
            row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:6px 8px;margin:3px 0;background:rgba(0,0,0,0.3);border-radius:4px;cursor:pointer;';
            row.addEventListener('mouseenter', () => {
                row.style.background = 'rgba(100,80,40,0.6)';
            });
            row.addEventListener('mouseleave', () => {
                row.style.background = 'rgba(0,0,0,0.3)';
            });

            const info = document.createElement('div');
            info.style.cssText = 'flex:1;';

            const resultLine = document.createElement('div');
            resultLine.style.cssText = 'font-weight:bold;color:#ffdd44;';
            const count = recipe.resultCount > 1 ? ` x${recipe.resultCount}` : '';
            resultLine.textContent = `${this.formatItemName(recipe.result)}${count}`;

            const ingLine = document.createElement('div');
            ingLine.style.cssText = 'font-size:11px;color:#aaa;margin-top:2px;';
            const ings = (recipe.ingredients as [string, number][]).map(
                ([id, cnt]) => `${cnt}x ${this.formatItemName(id)}`
            ).join(', ');
            ingLine.textContent = ings;

            info.appendChild(resultLine);
            info.appendChild(ingLine);

            const craftBtn = document.createElement('button');
            craftBtn.style.cssText = 'padding:4px 12px;cursor:pointer;background:#556b2f;color:white;border:1px solid #6b8e23;border-radius:3px;font-size:12px;';
            craftBtn.textContent = 'Craft';
            const recipeIndex = i;
            craftBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this._connection?.invoke('CraftRecipe', recipeIndex);
            });

            row.appendChild(info);
            row.appendChild(craftBtn);
            body.appendChild(row);
        }
    }

    showFurnaceUI(x: number, y: number, z: number): void {
        this.hideCraftingUI();
        this.hideFurnaceUI();
        this.hideChestUI();
        document.exitPointerLock();

        this.furnacePosition = { x, y, z };

        this.furnaceUI = document.createElement('div');
        this.furnaceUI.id = 'furnace-ui';
        this.furnaceUI.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(50,50,50,0.95);color:white;padding:20px;border-radius:8px;z-index:500;width:400px;max-height:80vh;display:flex;flex-direction:column;';

        const header = document.createElement('div');
        header.style.cssText = 'font-size:20px;font-weight:bold;margin-bottom:12px;text-align:center;';
        header.textContent = 'Furnace';

        const closeBtn = document.createElement('button');
        closeBtn.style.cssText = 'position:absolute;top:8px;right:12px;cursor:pointer;background:none;border:none;color:white;font-size:20px;';
        closeBtn.textContent = 'X';
        closeBtn.addEventListener('click', () => {
            this.hideFurnaceUI();
        });

        const slotsArea = document.createElement('div');
        slotsArea.style.cssText = 'display:flex;gap:16px;justify-content:center;margin-bottom:12px;align-items:center;';

        const inputSlot = document.createElement('div');
        inputSlot.id = 'furnace-input-slot';
        inputSlot.style.cssText = 'width:50px;height:50px;background:rgba(0,0,0,0.4);border:2px solid #555;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;color:#aaa;text-align:center;';
        inputSlot.textContent = 'Input';

        const arrow = document.createElement('div');
        arrow.style.cssText = 'font-size:20px;color:#ff8800;';
        arrow.textContent = '\u2192';

        const fuelSlot = document.createElement('div');
        fuelSlot.id = 'furnace-fuel-slot';
        fuelSlot.style.cssText = 'width:50px;height:50px;background:rgba(0,0,0,0.4);border:2px solid #555;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;color:#aaa;text-align:center;';
        fuelSlot.textContent = 'Fuel';

        const arrow2 = document.createElement('div');
        arrow2.style.cssText = 'font-size:20px;color:#ff8800;';
        arrow2.textContent = '\u2192';

        const outputSlot = document.createElement('div');
        outputSlot.id = 'furnace-output-slot';
        outputSlot.style.cssText = 'width:50px;height:50px;background:rgba(0,0,0,0.4);border:2px solid #555;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;color:#aaa;text-align:center;';
        outputSlot.textContent = 'Output';

        slotsArea.appendChild(inputSlot);
        slotsArea.appendChild(arrow);
        slotsArea.appendChild(fuelSlot);
        slotsArea.appendChild(arrow2);
        slotsArea.appendChild(outputSlot);

        const progressBar = document.createElement('div');
        progressBar.style.cssText = 'width:100%;height:16px;background:rgba(0,0,0,0.4);border-radius:8px;margin-bottom:12px;overflow:hidden;';
        const progressFill = document.createElement('div');
        progressFill.id = 'furnace-progress-fill';
        progressFill.style.cssText = 'width:0%;height:100%;background:linear-gradient(90deg,#ff4400,#ff8800);border-radius:8px;transition:width 0.5s;';
        progressBar.appendChild(progressFill);

        const recipesHeader = document.createElement('div');
        recipesHeader.style.cssText = 'font-size:14px;font-weight:bold;margin-bottom:6px;color:#ccc;';
        recipesHeader.textContent = 'Smelting Recipes';

        const recipesList = document.createElement('div');
        recipesList.id = 'smelting-recipes-list';
        recipesList.style.cssText = 'font-size:12px;overflow-y:auto;flex:1;';
        recipesList.textContent = 'Loading recipes...';

        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:499;';
        overlay.addEventListener('click', () => {
            this.hideFurnaceUI();
        });

        this.furnaceUI.appendChild(closeBtn);
        this.furnaceUI.appendChild(header);
        this.furnaceUI.appendChild(slotsArea);
        this.furnaceUI.appendChild(progressBar);
        this.furnaceUI.appendChild(recipesHeader);
        this.furnaceUI.appendChild(recipesList);
        document.body.appendChild(overlay);
        document.body.appendChild(this.furnaceUI);
    }

    hideFurnaceUI(): void {
        if (this.furnaceUI && this.furnaceUI.parentNode) {
            this.furnaceUI.parentNode.removeChild(this.furnaceUI);
            this.furnaceUI = null;
        }
        this.furnacePosition = null;
    }

    populateSmeltingRecipes(recipes: any[]): void {
        if (!this.furnaceUI) return;
        const list = document.getElementById('smelting-recipes-list');
        if (!list) return;

        list.innerHTML = '';
        if (recipes.length === 0) {
            list.textContent = 'No smelting recipes available.';
            return;
        }

        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];
            const row = document.createElement('div');
            row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:5px 8px;margin:2px 0;background:rgba(0,0,0,0.3);border-radius:4px;';

            const info = document.createElement('div');
            info.style.cssText = 'flex:1;font-size:12px;';
            info.textContent = `${this.formatItemName(recipe.input)} \u2192 ${this.formatItemName(recipe.result)} (${recipe.cookTime}s)`;

            const smeltBtn = document.createElement('button');
            smeltBtn.style.cssText = 'padding:3px 10px;cursor:pointer;background:#8b4513;color:white;border:1px solid #a0522d;border-radius:3px;font-size:11px;';
            smeltBtn.textContent = 'Smelt';
            smeltBtn.addEventListener('click', () => {
                if (!this.furnacePosition) return;
                this._connection?.invoke(
                    'StartSmelting',
                    recipe.input,
                    recipe.result,
                    this.furnacePosition.x,
                    this.furnacePosition.y,
                    this.furnacePosition.z
                );
                smeltBtn.textContent = '...';
                smeltBtn.disabled = true;
            });

            row.appendChild(info);
            row.appendChild(smeltBtn);
            list.appendChild(row);
        }
    }

    updateFurnaceState(input: string, fuel: string, output: string, progress: number): void {
        if (!this.furnaceUI) return;

        const inputSlot = document.getElementById('furnace-input-slot');
        const fuelSlot = document.getElementById('furnace-fuel-slot');
        const outputSlot = document.getElementById('furnace-output-slot');
        const progressFill = document.getElementById('furnace-progress-fill');

        if (inputSlot) {
            inputSlot.textContent = input ? this.formatItemName(input) : 'Input';
            inputSlot.style.color = input ? '#ffdd44' : '#aaa';
        }
        if (fuelSlot) {
            fuelSlot.textContent = fuel ? this.formatItemName(fuel) : 'Fuel';
            fuelSlot.style.color = fuel ? '#44dd44' : '#aaa';
        }
        if (outputSlot) {
            outputSlot.textContent = output ? this.formatItemName(output) : 'Output';
            outputSlot.style.color = output ? '#44aaff' : '#aaa';
        }
        if (progressFill) {
            progressFill.style.width = `${Math.round(progress * 100)}%`;
        }
    }

    showChestUI(x: number, y: number, z: number): void {
        this.hideCraftingUI();
        this.hideFurnaceUI();
        this.hideChestUI();
        document.exitPointerLock();

        this.chestPosition = { x, y, z };

        this.chestUI = document.createElement('div');
        this.chestUI.id = 'chest-ui';
        this.chestUI.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(101,67,33,0.95);color:white;padding:20px;border-radius:8px;z-index:500;width:380px;max-height:80vh;display:flex;flex-direction:column;';

        const header = document.createElement('div');
        header.style.cssText = 'font-size:20px;font-weight:bold;margin-bottom:12px;text-align:center;';
        header.textContent = 'Chest';

        const closeBtn = document.createElement('button');
        closeBtn.style.cssText = 'position:absolute;top:8px;right:12px;cursor:pointer;background:none;border:none;color:white;font-size:20px;';
        closeBtn.textContent = 'X';
        closeBtn.addEventListener('click', () => {
            this.hideChestUI();
        });

        const chestLabel = document.createElement('div');
        chestLabel.style.cssText = 'font-size:12px;color:#ccc;margin-bottom:6px;';
        chestLabel.textContent = 'Chest Inventory';

        const chestGrid = document.createElement('div');
        chestGrid.id = 'chest-grid';
        chestGrid.style.cssText = 'display:grid;grid-template-columns:repeat(9,1fr);gap:3px;margin-bottom:16px;';
        for (let i = 0; i < 27; i++) {
            const slot = document.createElement('div');
            slot.className = 'chest-slot';
            slot.dataset.slot = String(i);
            slot.style.cssText = 'width:36px;height:36px;background:rgba(0,0,0,0.4);border:1px solid #555;border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:9px;color:#aaa;text-align:center;cursor:pointer;position:relative;';
            slot.textContent = '';
            const slotIndex = i;
            slot.addEventListener('click', () => {
                if (!this.chestPosition) return;
                this._connection?.invoke(
                    'TakeItemFromChest',
                    slotIndex,
                    0,
                    this.chestPosition.x,
                    this.chestPosition.y,
                    this.chestPosition.z
                );
            });
            chestGrid.appendChild(slot);
        }

        const invLabel = document.createElement('div');
        invLabel.style.cssText = 'font-size:12px;color:#ccc;margin-bottom:6px;';
        invLabel.textContent = 'Your Inventory (click to store)';

        const invGrid = document.createElement('div');
        invGrid.id = 'chest-inv-grid';
        invGrid.style.cssText = 'display:grid;grid-template-columns:repeat(8,1fr);gap:3px;';
        for (let i = 0; i < 8; i++) {
            const slot = document.createElement('div');
            slot.className = 'chest-inv-slot';
            slot.dataset.slot = String(i);
            slot.style.cssText = 'width:36px;height:36px;background:rgba(0,0,0,0.4);border:1px solid #555;border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:9px;color:#aaa;text-align:center;cursor:pointer;position:relative;';
            slot.textContent = '';
            const slotIndex = i;
            slot.addEventListener('click', () => {
                if (!this.chestPosition) return;
                this._connection?.invoke(
                    'MoveItemToChest',
                    slotIndex,
                    -1,
                    this.chestPosition.x,
                    this.chestPosition.y,
                    this.chestPosition.z
                );
            });
            invGrid.appendChild(slot);
        }

        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:499;';
        overlay.addEventListener('click', () => {
            this.hideChestUI();
        });

        this.chestUI.appendChild(closeBtn);
        this.chestUI.appendChild(header);
        this.chestUI.appendChild(chestLabel);
        this.chestUI.appendChild(chestGrid);
        this.chestUI.appendChild(invLabel);
        this.chestUI.appendChild(invGrid);
        document.body.appendChild(overlay);
        document.body.appendChild(this.chestUI);
    }

    hideChestUI(): void {
        if (this.chestUI && this.chestUI.parentNode) {
            this.chestUI.parentNode.removeChild(this.chestUI);
            this.chestUI = null;
        }
        this.chestPosition = null;
    }

    updateChestInventory(items: any[]): void {
        if (!this.chestUI) return;
        const grid = document.getElementById('chest-grid');
        if (!grid) return;

        const slots = grid.children;
        for (let i = 0; i < 27; i++) {
            const slot = slots[i] as HTMLElement;
            if (items[i] && items[i].itemId) {
                const item = items[i];
                slot.textContent = this.formatItemName(item.itemId);
                slot.style.color = '#ffdd44';
                slot.style.fontSize = '8px';
                if (item.count > 1) {
                    const countBadge = document.createElement('span');
                    countBadge.style.cssText = 'position:absolute;bottom:1px;right:2px;font-size:9px;color:white;text-shadow:1px 1px 1px black;';
                    countBadge.textContent = String(item.count);
                    slot.appendChild(countBadge);
                }
            } else {
                slot.textContent = '';
                slot.style.color = '#aaa';
                slot.style.fontSize = '9px';
            }
        }
    }

    updateChestPlayerInventory(items: any[]): void {
        if (!this.chestUI) return;
        const grid = document.getElementById('chest-inv-grid');
        if (!grid) return;

        const slots = grid.children;
        for (let i = 0; i < 8; i++) {
            const slot = slots[i] as HTMLElement;
            if (items[i] && items[i].itemId) {
                const item = items[i];
                slot.textContent = this.formatItemName(item.itemId);
                slot.style.color = '#44ddff';
                slot.style.fontSize = '8px';
                if (item.count > 1) {
                    const countBadge = document.createElement('span');
                    countBadge.style.cssText = 'position:absolute;bottom:1px;right:2px;font-size:9px;color:white;text-shadow:1px 1px 1px black;';
                    countBadge.textContent = String(item.count);
                    slot.appendChild(countBadge);
                }
            } else {
                slot.textContent = '';
                slot.style.color = '#aaa';
                slot.style.fontSize = '9px';
            }
        }
    }

    hideAllUIs(): void {
        this.hideCraftingUI();
        this.hideFurnaceUI();
        this.hideChestUI();
        this.hideCreativeInventory();
        this.hideSignEditor();
    }

    setCreativeSelectHandler(handler: (blockId: number) => void): void {
        this.onCreativeSelect = handler;
    }

    showCreativeInventory(allBlocks: CreativeInventoryEntry[]): void {
        this.hideCraftingUI();
        this.hideFurnaceUI();
        this.hideChestUI();
        this.hideCreativeInventory();
        document.exitPointerLock();

        this.creativeEntries = allBlocks.filter(b => b.id > 0);
        this.creativePage = 0;
        this.creativeFilter = '';

        this.creativeInventoryUI = document.createElement('div');
        this.creativeInventoryUI.id = 'creative-inventory-ui';
        this.creativeInventoryUI.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(40,40,60,0.95);color:white;padding:20px;border-radius:8px;z-index:500;width:520px;max-height:80vh;display:flex;flex-direction:column;';

        const header = document.createElement('div');
        header.style.cssText = 'font-size:20px;font-weight:bold;margin-bottom:12px;text-align:center;display:flex;justify-content:space-between;align-items:center;';
        const title = document.createElement('span');
        title.textContent = 'Creative Inventory';
        const closeBtn = document.createElement('button');
        closeBtn.style.cssText = 'cursor:pointer;background:none;border:none;color:white;font-size:20px;';
        closeBtn.textContent = 'X';
        closeBtn.addEventListener('click', () => {
            this.hideCreativeInventory();
        });
        header.appendChild(title);
        header.appendChild(closeBtn);

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search blocks...';
        searchInput.style.cssText = 'width:100%;padding:8px;margin-bottom:12px;background:rgba(0,0,0,0.4);border:1px solid #555;border-radius:4px;color:white;font-size:14px;outline:none;box-sizing:border-box;';
        searchInput.addEventListener('input', () => {
            this.creativeFilter = searchInput.value.toLowerCase();
            this.creativePage = 0;
            this.renderCreativeGrid();
        });

        const gridContainer = document.createElement('div');
        gridContainer.id = 'creative-grid-container';
        gridContainer.style.cssText = 'flex:1;overflow-y:auto;';

        const pageControls = document.createElement('div');
        pageControls.style.cssText = 'display:flex;justify-content:center;gap:12px;margin-top:12px;align-items:center;';

        const prevBtn = document.createElement('button');
        prevBtn.style.cssText = 'padding:6px 16px;cursor:pointer;background:#555;color:white;border:1px solid #777;border-radius:4px;font-size:13px;';
        prevBtn.textContent = '\u2190 Prev';
        prevBtn.addEventListener('click', () => {
            if (this.creativePage > 0) {
                this.creativePage--;
                this.renderCreativeGrid();
            }
        });

        const pageInfo = document.createElement('span');
        pageInfo.id = 'creative-page-info';
        pageInfo.style.cssText = 'font-size:13px;color:#aaa;';

        const nextBtn = document.createElement('button');
        nextBtn.style.cssText = 'padding:6px 16px;cursor:pointer;background:#555;color:white;border:1px solid #777;border-radius:4px;font-size:13px;';
        nextBtn.textContent = 'Next \u2192';
        nextBtn.addEventListener('click', () => {
            this.creativePage++;
            this.renderCreativeGrid();
        });

        pageControls.appendChild(prevBtn);
        pageControls.appendChild(pageInfo);
        pageControls.appendChild(nextBtn);

        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:499;';
        overlay.addEventListener('click', () => {
            this.hideCreativeInventory();
        });

        this.creativeInventoryUI.appendChild(header);
        this.creativeInventoryUI.appendChild(searchInput);
        this.creativeInventoryUI.appendChild(gridContainer);
        this.creativeInventoryUI.appendChild(pageControls);
        document.body.appendChild(overlay);
        document.body.appendChild(this.creativeInventoryUI);

        this.renderCreativeGrid();
    }

    private renderCreativeGrid(): void {
        const container = document.getElementById('creative-grid-container');
        if (!container) return;
        container.innerHTML = '';

        let filtered = this.creativeEntries;
        if (this.creativeFilter) {
            filtered = this.creativeEntries.filter(b => b.name.toLowerCase().includes(this.creativeFilter));
        }

        const itemsPerPage = 32;
        const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
        if (this.creativePage >= totalPages) this.creativePage = totalPages - 1;

        const start = this.creativePage * itemsPerPage;
        const pageItems = filtered.slice(start, start + itemsPerPage);

        const grid = document.createElement('div');
        grid.style.cssText = 'display:grid;grid-template-columns:repeat(8,1fr);gap:4px;';

        for (const entry of pageItems) {
            const slot = document.createElement('div');
            slot.style.cssText = 'width:52px;height:52px;background:rgba(0,0,0,0.4);border:2px solid #555;border-radius:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;position:relative;transition:border-color 0.1s;';

            const colorSwatch = document.createElement('div');
            colorSwatch.style.width = '28px';
            colorSwatch.style.height = '28px';
            colorSwatch.style.borderRadius = '3px';
            colorSwatch.style.border = '1px solid rgba(255,255,255,0.2)';
            if (/^#[0-9a-fA-F]{3,8}$/.test(entry.color)) {
                colorSwatch.style.background = entry.color;
            } else {
                colorSwatch.style.background = '#888';
            }
            slot.appendChild(colorSwatch);

            const label = document.createElement('span');
            label.style.cssText = 'font-size:8px;color:#ccc;margin-top:2px;text-align:center;line-height:1.1;max-width:48px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
            label.textContent = entry.name.replace(/_/g, ' ');
            slot.appendChild(label);

            slot.addEventListener('mouseenter', () => {
                slot.style.borderColor = '#aaddff';
                slot.style.background = 'rgba(100,150,200,0.3)';
            });
            slot.addEventListener('mouseleave', () => {
                slot.style.borderColor = '#555';
                slot.style.background = 'rgba(0,0,0,0.4)';
            });
            slot.addEventListener('click', () => {
                this.onCreativeSelect?.(entry.id);
                this.hideCreativeInventory();
            });

            grid.appendChild(slot);
        }

        container.appendChild(grid);

        const pageInfo = document.getElementById('creative-page-info');
        if (pageInfo) {
            pageInfo.textContent = `${this.creativePage + 1} / ${totalPages} (${filtered.length} items)`;
        }
    }

    hideCreativeInventory(): void {
        if (this.creativeInventoryUI && this.creativeInventoryUI.parentNode) {
            const overlay = this.creativeInventoryUI.previousElementSibling as HTMLElement | null;
            if (overlay && overlay.style?.zIndex === '499') {
                overlay.parentNode?.removeChild(overlay);
            }
            this.creativeInventoryUI.parentNode.removeChild(this.creativeInventoryUI);
            this.creativeInventoryUI = null;
        }
    }

    showSettingsPanel(): void {
        this.settingsPanel.show();
    }

    hideSettingsPanel(): void {
        this.settingsPanel.hide();
    }

    isSettingsPanelOpen(): boolean {
        return this.settingsPanel.isOpen();
    }

    getSettingsPanel(): SettingsPanel {
        return this.settingsPanel;
    }

    updateHunger(foodLevel: number, maxFood: number): void {
        if (!this.hungerBar) {
            this.hungerBar = document.createElement('div');
            this.hungerBar.id = 'hunger-bar';
            this.hungerBar.style.cssText = 'position:fixed;bottom:76px;left:50%;transform:translateX(-50%);display:none;gap:1px;z-index:100;';
            document.body.appendChild(this.hungerBar);
        }

        if (foodLevel >= maxFood) {
            this.hungerBar.style.display = 'none';
            return;
        }

        this.hungerBar.style.display = 'flex';
        this.hungerBar.innerHTML = '';

        const icons = Math.ceil(maxFood / 2);
        for (let i = 0; i < icons; i++) {
            const icon = document.createElement('div');
            const iconValue = foodLevel - i * 2;
            icon.style.cssText = 'width:12px;height:12px;';
            icon.style.background = iconValue > 0 ? '#b87333' : '#333';
            icon.style.border = iconValue > 0 ? '1px solid #8B4513' : '1px solid #555';
            this.hungerBar.appendChild(icon);
        }
    }

    updateBreath(breath: number, maxBreath: number): void {
        if (!this.breathBar) {
            this.breathBar = document.createElement('div');
            this.breathBar.id = 'breath-bar';
            this.breathBar.style.cssText = 'position:fixed;bottom:60px;left:50%;transform:translateX(-50%);display:none;gap:2px;';
            document.body.appendChild(this.breathBar);
        }

        if (breath >= maxBreath) {
            this.breathBar.style.display = 'none';
            return;
        }

        this.breathBar.style.display = 'flex';
        this.breathBar.innerHTML = '';

        const bubbles = Math.ceil(maxBreath / 2);
        for (let i = 0; i < bubbles; i++) {
            const bubble = document.createElement('div');
            const bubbleValue = breath - i * 2;
            bubble.style.cssText = 'width:10px;height:10px;border-radius:50%;border:1px solid #4488ff;';
            bubble.style.background = bubbleValue > 0 ? '#4488ff' : 'transparent';
            this.breathBar.appendChild(bubble);
        }
    }

    updateDebugInfo(fps: number, position: any, chunkCount: number): void {
        if (this.debugInfo.style.display === 'none') return;

        const pos = position as { x: number; y: number; z: number };
        this.debugInfo.innerHTML = `
            <div>FPS: ${fps}</div>
            <div>XYZ: ${pos.x.toFixed(1)} / ${pos.y.toFixed(1)} / ${pos.z.toFixed(1)}</div>
            <div>Chunks: ${chunkCount}</div>
            <div>Memory: ${(() => { const memInfo = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory; return memInfo ? `${(memInfo.usedJSHeapSize / 1048576).toFixed(1)} MB` : 'N/A'; })()}</div>
        `;
    }

    private formatItemName(itemId: string): string {
        return itemId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    }

    private static armorSlotNames = ['Helmet', 'Chestplate', 'Leggings', 'Boots'];

    private static getDefenseValue(itemId: string): number {
        const id = itemId.toLowerCase();
        switch (id) {
            case 'leather_helmet': case 'leather_chestplate': case 'leather_leggings': case 'leather_boots': return 1;
            case 'iron_helmet': return 2;
            case 'iron_chestplate': return 6;
            case 'iron_leggings': return 5;
            case 'iron_boots': return 2;
            case 'diamond_helmet': return 3;
            case 'diamond_chestplate': return 8;
            case 'diamond_leggings': return 6;
            case 'diamond_boots': return 3;
            default: return 0;
        }
    }

    updateArmor(items: any[]): void {
        const slots = document.querySelectorAll('.armor-slot');
        let totalDefense = 0;

        for (let i = 0; i < 4; i++) {
            const slot = slots[i] as HTMLElement | undefined;
            if (!slot) continue;

            if (items[i] && items[i].itemId) {
                const item = items[i];
                const def = UIManager.getDefenseValue(item.itemId);
                totalDefense += def;
                slot.innerHTML = '';
                const armorSpan = document.createElement('span');
                armorSpan.style.cssText = 'font-size:9px;color:#fff;text-align:center;';
                armorSpan.textContent = this.formatItemName(item.itemId);
                slot.appendChild(armorSpan);
                slot.style.background = 'rgba(100,150,255,0.3)';
                slot.style.borderColor = '#6699ff';
            } else {
                slot.innerHTML = UIManager.armorSlotNames[i];
                slot.style.background = 'rgba(0,0,0,0.5)';
                slot.style.borderColor = '#555';
            }
        }

        const defenseEl = document.getElementById('armor-defense');
        if (defenseEl) {
            defenseEl.textContent = `Defense: ${totalDefense}`;
        }
    }

    updateExperience(level: number, totalExp: number): void {
        const xpFill = document.querySelector('.xp-fill') as HTMLElement | null;
        const xpText = document.querySelector('.xp-text') as HTMLElement | null;
        if (xpFill) {
            const progress = (totalExp % 100) / 100 * 100;
            xpFill.style.width = `${progress}%`;
        }
        if (xpText) {
            xpText.textContent = String(level);
        }
    }

    showArmorPanel(): void {
        const panel = document.getElementById('armor-panel');
        if (!panel) return;
        panel.style.display = 'block';
        document.exitPointerLock();

        const slots = panel.querySelectorAll('.armor-slot');
        slots.forEach(slot => {
            const newSlot = slot as HTMLElement;
            newSlot.onclick = () => {
                const armorSlot = parseInt(newSlot.dataset.slot || '0');
                this._connection?.invoke('UnequipArmor', armorSlot);
            };
        });
    }

    hideArmorPanel(): void {
        const panel = document.getElementById('armor-panel');
        if (panel) {
            panel.style.display = 'none';
        }
    }

    toggleArmorPanel(): void {
        const panel = document.getElementById('armor-panel');
        if (!panel || panel.style.display === 'none') {
            this.showArmorPanel();
        } else {
            this.hideArmorPanel();
        }
    }

    showSignEditor(_x: number, _y: number, _z: number, existingText: string, onSave: (text: string) => void): void {
        this.hideSignEditor();
        document.exitPointerLock();

        const overlay = document.createElement('div');
        overlay.id = 'sign-editor-overlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:500;display:flex;align-items:center;justify-content:center;';

        const container = document.createElement('div');
        container.style.cssText = 'background:rgba(101,67,33,0.95);color:white;padding:20px;border-radius:8px;width:360px;display:flex;flex-direction:column;gap:12px;';

        const header = document.createElement('div');
        header.style.cssText = 'font-size:18px;font-weight:bold;text-align:center;';
        header.textContent = 'Edit Sign';

        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 100;
        input.placeholder = 'Enter sign text...';
        input.value = existingText;
        input.style.cssText = 'width:100%;padding:10px;background:rgba(0,0,0,0.4);border:2px solid #8B6914;border-radius:4px;color:white;font-size:14px;outline:none;box-sizing:border-box;';

        const buttons = document.createElement('div');
        buttons.style.cssText = 'display:flex;gap:10px;justify-content:flex-end;';

        const saveBtn = document.createElement('button');
        saveBtn.style.cssText = 'padding:8px 20px;cursor:pointer;background:#556b2f;color:white;border:1px solid #6b8e23;border-radius:4px;font-size:14px;';
        saveBtn.textContent = 'Save';
        saveBtn.addEventListener('click', () => {
            const text = input.value.trim();
            if (text) {
                onSave(text);
            }
            this.hideSignEditor();
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.style.cssText = 'padding:8px 20px;cursor:pointer;background:#8b0000;color:white;border:1px solid #a52a2a;border-radius:4px;font-size:14px;';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.addEventListener('click', () => {
            this.hideSignEditor();
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                saveBtn.click();
            } else if (e.key === 'Escape') {
                this.hideSignEditor();
            }
        });

        buttons.appendChild(cancelBtn);
        buttons.appendChild(saveBtn);
        container.appendChild(header);
        container.appendChild(input);
        container.appendChild(buttons);
        overlay.appendChild(container);
        document.body.appendChild(overlay);
        input.focus();
        input.select();
    }

    hideSignEditor(): void {
        const overlay = document.getElementById('sign-editor-overlay');
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }
}
