import * as HubConnection from '@microsoft/signalr';

export class UIManager {
    private _connection: HubConnection.HubConnection | null = null;
    private chatMessages: HTMLElement;
    private healthBar: HTMLElement;
    private hotbar: HTMLElement;
    private debugInfo: HTMLElement;

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

    updatePlayerList(_players: string[]): void { }

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
