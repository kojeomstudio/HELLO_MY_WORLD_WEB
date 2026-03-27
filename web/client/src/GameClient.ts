import * as HubConnection from '@microsoft/signalr';
import { UIManager } from './ui/UIManager';
import { Renderer } from './rendering/Renderer';
import { PlayerController } from './player/PlayerController';
import { WorldManager } from './world/WorldManager';
import { InputManager } from './input/InputManager';

export class GameClient {
    private connection: HubConnection.HubConnection | null = null;
    private renderer: Renderer;
    private playerController: PlayerController;
    private worldManager: WorldManager;
    private inputManager: InputManager;
    private uiManager: UIManager;
    private isRunning: boolean = false;
    private lastTime: number = 0;
    private frameCount: number = 0;
    private fps: number = 0;
    private fpsTimer: number = 0;

    constructor(uiManager: UIManager) {
        this.uiManager = uiManager;
        this.renderer = new Renderer(document.getElementById('game-container')!);
        this.worldManager = new WorldManager(this.renderer);
        this.inputManager = new InputManager();
        this.playerController = new PlayerController(this.renderer.getCamera(), this.inputManager);
    }

    async connect(playerName: string): Promise<void> {
        this.connection = new HubConnection.HubConnectionBuilder()
            .withUrl('/game')
            .withAutomaticReconnect()
            .configureLogging(HubConnection.LogLevel.Information)
            .build();

        this.setupServerHandlers();
        this.uiManager.setConnection(this.connection);

        try {
            await this.connection.start();
            await this.connection.invoke('Join', playerName);
            this.isRunning = true;
            this.lastTime = performance.now();
            this.gameLoop();
        } catch (err) {
            this.uiManager.addChatMessage('Server', `Connection failed: ${err}`);
            this.showLoginScreen();
        }
    }

    private setupServerHandlers(): void {
        if (!this.connection) return;

        this.connection.on('OnChunkReceived', (chunkX: number, chunkY: number, chunkZ: number, data: Uint8Array) => {
            this.worldManager.loadChunk(chunkX, chunkY, chunkZ, data);
        });

        this.connection.on('OnPlayerJoined', (name: string) => {
            this.uiManager.addChatMessage('Server', `${name} joined the game`);
        });

        this.connection.on('OnPlayerLeft', (name: string) => {
            this.uiManager.addChatMessage('Server', `${name} left the game`);
            this.worldManager.removePlayer(name);
        });

        this.connection.on('OnPlayerListUpdate', (players: string[]) => {
            this.uiManager.updatePlayerList(players);
        });

        this.connection.on('OnPlayerPositionUpdate', (name: string, x: number, y: number, z: number, yaw: number, pitch: number) => {
            this.worldManager.updatePlayerPosition(name, x, y, z, yaw, pitch);
        });

        this.connection.on('OnChatMessage', (sender: string, message: string) => {
            this.uiManager.addChatMessage(sender, message);
        });

        this.connection.on('OnBlockUpdate', (x: number, y: number, z: number, blockData: number) => {
            this.worldManager.updateBlock(x, y, z, blockData);
        });

        this.connection.on('OnHealthUpdate', (health: number, maxHealth: number) => {
            this.uiManager.updateHealth(health, maxHealth);
            this.playerController.setHealth(health);
        });

        this.connection.on('OnInventoryUpdate', (items: any[]) => {
            this.uiManager.updateInventory(items);
            this.playerController.setInventory(items);
        });

        this.connection.on('OnTimeUpdate', (_time: number, _speed: number, skyBrightness: number) => {
            this.renderer.updateSkyBrightness(skyBrightness);
        });

        this.connection.on('OnEntitySpawned', (entityId: string, entityType: string, x: number, y: number, z: number) => {
            this.worldManager.spawnEntity(entityId, entityType, x, y, z);
        });

        this.connection.on('OnEntityDespawned', (entityId: string) => {
            this.worldManager.removeEntity(entityId);
        });

        this.connection.on('OnEntityUpdate', (entityId: string, x: number, y: number, z: number) => {
            this.worldManager.updateEntityPosition(entityId, x, y, z);
        });

        this.connection.on('OnCraftResult', (itemId: string, count: number) => {
            this.uiManager.addChatMessage('Server', `Crafted ${count}x ${itemId}`);
        });

        this.connection.on('OnDeath', (message: string) => {
            this.uiManager.addChatMessage('Server', message);
        });
    }

    sendChat(message: string): void {
        this.connection?.invoke('SendChat', message);
    }

    private gameLoop(): void {
        if (!this.isRunning) return;
        requestAnimationFrame(() => this.gameLoop());

        const now = performance.now();
        const dt = (now - this.lastTime) / 1000;
        this.lastTime = now;

        this.frameCount++;
        this.fpsTimer += dt;
        if (this.fpsTimer >= 1.0) {
            this.fps = Math.round(this.frameCount / this.fpsTimer);
            this.frameCount = 0;
            this.fpsTimer = 0;
        }

        this.playerController.update(dt);
        this.worldManager.update(dt);
        this.renderer.render();
        this.uiManager.updateDebugInfo(
            this.fps,
            this.playerController.getPosition(),
            this.worldManager.getChunkCount()
        );

        this.sendPositionUpdate();
    }

    private sendPositionUpdate(): void {
        if (!this.connection) return;
        const pos = this.playerController.getPosition();
        const vel = this.playerController.getVelocity();
        const yaw = this.playerController.getYaw();
        const pitch = this.playerController.getPitch();

        this.connection.invoke('UpdatePosition', pos.x, pos.y, pos.z, vel.x, vel.y, vel.z, yaw, pitch);
    }

    private showLoginScreen(): void {
        const loginScreen = document.getElementById('login-screen')!;
        loginScreen.style.display = 'flex';
    }
}
