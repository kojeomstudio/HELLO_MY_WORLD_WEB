import { GameClient } from './GameClient';
import { UIManager } from './ui/UIManager';

class App {
    private gameClient: GameClient;
    private uiManager: UIManager;

    constructor() {
        this.uiManager = new UIManager();
        this.gameClient = new GameClient(this.uiManager);
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        const loginForm = document.getElementById('login-form') as HTMLFormElement;
        const chatInput = document.getElementById('chat-input') as HTMLInputElement;

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('player-name-input') as HTMLInputElement;
            const playerName = nameInput.value.trim();
            if (!playerName) return;

            const loginScreen = document.getElementById('login-screen')!;
            loginScreen.style.display = 'none';

            await this.gameClient.connect(playerName);
        });

        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const message = chatInput.value.trim();
                if (message) {
                    this.gameClient.sendChat(message);
                    chatInput.value = '';
                    chatInput.style.display = 'none';
                }
                chatInput.blur();
            }
            if (e.key === 'Escape') {
                chatInput.style.display = 'none';
                chatInput.blur();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 't' || e.key === 'T') {
                if (chatInput.style.display !== 'block') {
                    chatInput.style.display = 'block';
                    chatInput.focus();
                }
            }
            if (e.key === 'F3') {
                e.preventDefault();
                const debugInfo = document.getElementById('debug-info')!;
                debugInfo.style.display = debugInfo.style.display === 'none' ? 'block' : 'none';
            }
            if (e.key === 'Escape') {
                if (this.uiManager.isSettingsPanelOpen()) {
                    this.uiManager.hideSettingsPanel();
                } else {
                    this.uiManager.hideAllUIs();
                }
            }
            if (e.key === 'o' || e.key === 'O') {
                if (this.uiManager.isSettingsPanelOpen()) {
                    this.uiManager.hideSettingsPanel();
                } else {
                    this.uiManager.showSettingsPanel();
                }
            }
            if (e.key === 'i' || e.key === 'I') {
                this.gameClient.showCreativeInventory();
            }
            if (e.key === 'p' || e.key === 'P') {
                this.uiManager.toggleArmorPanel();
            }
        });

        document.addEventListener('respawnRequest', () => {
            this.gameClient.respawn();
        });

        document.addEventListener('contextmenu', (e) => {
            if (document.pointerLockElement) {
                e.preventDefault();
            }
        });
    }
}

new App();
