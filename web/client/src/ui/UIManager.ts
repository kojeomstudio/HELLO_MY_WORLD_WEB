import * as HubConnection from '@microsoft/signalr';

export class UIManager {
    private _connection: HubConnection.HubConnection | null = null;
    private chatMessages: HTMLElement;
    private healthBar: HTMLElement;
    private hotbar: HTMLElement;
    private debugInfo: HTMLElement;
    private deathScreen: HTMLElement | null = null;
    private craftingUI: HTMLElement | null = null;
    private breathBar: HTMLElement | null = null;

    constructor() {
        this.chatMessages = document.getElementById('chat-messages')!;
        this.healthBar = document.getElementById('health-bar')!;
        this.hotbar = document.getElementById('hotbar')!;
        this.debugInfo = document.getElementById('debug-info')!;
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
        msgEl.innerHTML = `<span class="sender">${sender}:</span> ${message}`;
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
                slot.innerHTML = `<span style="font-size:11px">${item.itemId.replace(/_/g, ' ')}</span>`;
                if (item.count > 1) {
                    slot.innerHTML += `<span style="position:absolute;bottom:2px;right:4px;font-size:10px;color:white">${item.count}</span>`;
                }
            } else {
                slot.innerHTML = `<span style="font-size:12px;color:#aaa">${i + 1}</span>`;
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
        panel.innerHTML = `<div style="font-weight:bold;margin-bottom:4px">Players (${players.length})</div>`;
        for (const name of players) {
            const row = document.createElement('div');
            row.textContent = name;
            panel.appendChild(row);
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

        this.craftingUI = document.createElement('div');
        this.craftingUI.id = 'crafting-ui';
        this.craftingUI.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(60,40,20,0.95);color:white;padding:20px;border-radius:8px;z-index:500;min-width:300px;';

        const header = document.createElement('div');
        header.style.cssText = 'font-size:20px;font-weight:bold;margin-bottom:12px;text-align:center;';
        header.textContent = 'Crafting';

        const closeBtn = document.createElement('button');
        closeBtn.style.cssText = 'position:absolute;top:8px;right:12px;cursor:pointer;background:none;border:none;color:white;font-size:20px;';
        closeBtn.textContent = 'X';
        closeBtn.addEventListener('click', () => this.hideCraftingUI());

        const body = document.createElement('div');
        body.id = 'crafting-body';
        body.style.cssText = 'font-size:14px;';
        body.textContent = 'Crafting recipes loaded from server.';

        this.craftingUI.appendChild(closeBtn);
        this.craftingUI.appendChild(header);
        this.craftingUI.appendChild(body);
        document.body.appendChild(this.craftingUI);
    }

    hideCraftingUI(): void {
        if (this.craftingUI && this.craftingUI.parentNode) {
            this.craftingUI.parentNode.removeChild(this.craftingUI);
            this.craftingUI = null;
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
            <div>Memory: N/A</div>
        `;
    }
}
