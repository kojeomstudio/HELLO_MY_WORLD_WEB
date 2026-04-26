import * as HubConnection from '@microsoft/signalr';
import * as THREE from 'three';
import { UIManager } from './ui/UIManager';
import { Renderer } from './rendering/Renderer';
import { PlayerController } from './player/PlayerController';
import { WorldManager } from './world/WorldManager';
import { InputManager } from './input/InputManager';
import { AudioManager } from './audio/AudioManager';
import { GameSettings } from './ui/SettingsPanel';
import { Minimap } from './ui/Minimap';
import { ParticleSystem } from './world/ParticleSystem';
import { WieldItem } from './rendering/WieldItem';
import { SelectionBox } from './rendering/SelectionBox';
import { WeatherSystem } from './world/WeatherSystem';
import { ItemRegistry } from './world/ItemRegistry';

export class GameClient {
    private connection: HubConnection.HubConnection | null = null;
    private renderer: Renderer;
    private playerController: PlayerController;
    private worldManager: WorldManager;
    private inputManager: InputManager;
    private uiManager: UIManager;
    private audioManager: AudioManager;
    private minimap: Minimap;
    private particleSystem: ParticleSystem;
    private wieldItem: WieldItem;
    private selectionBox: SelectionBox;
    private weatherSystem: WeatherSystem;
    private itemRegistry: ItemRegistry;
    private isRunning: boolean = false;
    private lastTime: number = 0;
    private frameCount: number = 0;
    private fps: number = 0;
    private fpsTimer: number = 0;
    private chunkRequestTimer: number = 0;
    private chunkUnloadTimer: number = 0;
    private weatherTimer: number = 0;
    private skyBrightness: number = 1;

    constructor(uiManager: UIManager) {
        this.uiManager = uiManager;
        this.renderer = new Renderer(document.getElementById('game-container')!);
        this.worldManager = new WorldManager(this.renderer);
        this.itemRegistry = new ItemRegistry(this.worldManager.getBlockRegistry());
        this.itemRegistry.load();
        this.inputManager = new InputManager();
        this.audioManager = new AudioManager();
        this.minimap = new Minimap(document.getElementById('game-container')!, this.worldManager);
        this.particleSystem = new ParticleSystem(this.renderer.getScene());
        this.wieldItem = new WieldItem(this.renderer.getScene(), this.renderer.getCamera());
        this.selectionBox = new SelectionBox(this.renderer.getScene());
        this.weatherSystem = new WeatherSystem(this.renderer.getScene());
        this.playerController = new PlayerController(this.renderer.getCamera(), this.inputManager);
        this.playerController.setWorldManager(this.worldManager);
        this.playerController.setSelectionBox(this.selectionBox);
        this.playerController.setParticleEmitter((x, y, z, type) => {
            this.onParticleEvent(x, y, z, type);
        });

        this.playerController.setAudioPlayer((soundName: string) => {
            this.audioManager.play(soundName);
        });

        this.applySettings(this.uiManager.getSettingsPanel().getSettings());
        this.uiManager.getSettingsPanel().setOnSettingsChanged((settings) => {
            this.applySettings(settings);
        });
    }

    get items() { return this.itemRegistry; }

    toggleWeather(): string {
        const weatherType = this.weatherSystem.toggleWeather();
        this.renderer.setRaining(weatherType === 'rain');
        return weatherType;
    }

    private applySettings(settings: GameSettings): void {
        this.renderer.setFov(settings.fov);
        this.playerController.setMouseSensitivity(settings.mouseSensitivity);
        this.worldManager.setRenderDistance(settings.renderDistance);
        this.worldManager.setAoEnabled(settings.aoEnabled);
        this.renderer.setCloudsEnabled(settings.cloudsEnabled);
        this.audioManager.setVolume(settings.soundVolume);
    }

    async connect(playerName: string, password?: string): Promise<void> {
        this.connection = new HubConnection.HubConnectionBuilder()
            .withUrl('/game')
            .withAutomaticReconnect()
            .configureLogging(HubConnection.LogLevel.Information)
            .build();

        this.worldManager.setConnection(this.connection);
        this.playerController.setConnection(this.connection);
        this.setupServerHandlers();
        this.uiManager.setConnection(this.connection);

        try {
            await this.connection.start();
            await this.connection.invoke('Join', playerName, password || '');
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
            this.playerController.setHealth(health, maxHealth);
        });

        this.connection.on('OnInventoryUpdate', (items: any[]) => {
            this.audioManager.play('pickup');
            this.uiManager.updateInventory(items);
            this.playerController.setInventory(items);
        });

        this.connection.on('OnTimeUpdate', (_time: number, _speed: number, skyBrightness: number) => {
            this.skyBrightness = skyBrightness;
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
            this.uiManager.showDeathScreen(message);
            this.playerController.handleDeath();
        });

        this.connection.on('OnBlockDefinitions', (json: string) => {
            this.worldManager.getBlockRegistry().loadFromServer(json);
        });

        this.connection.on('OnBreathUpdate', (breath: number, maxBreath: number) => {
            this.uiManager.updateBreath(breath, maxBreath);
        });

        this.connection.on('OnFoodUpdate', (foodLevel: number, maxFood: number) => {
            this.uiManager.updateHunger(foodLevel, maxFood);
        });

        this.connection.on('OnKnockback', (vx: number, vy: number, vz: number) => {
            this.playerController.applyKnockback(vx, vy, vz);
            this.audioManager.play('hurt');
            this.renderer.flashDamage(0.6);
        });

        this.connection.on('OnPrivilegeList', (_privileges: string[]) => {
            this.uiManager.addChatMessage('Server', `Your privileges: ${_privileges.join(', ')}`);
        });

        this.connection.on('OnGameModeChanged', (mode: string) => {
            this.uiManager.addChatMessage('Server', `Game mode changed to: ${mode}`);
            if (mode === 'creative' || mode === 'spectator') {
                this.playerController.setFlying(true);
            } else {
                this.playerController.setFlying(false);
            }
        });

        this.connection.on('OnTeleported', (x: number, y: number, z: number) => {
            this.playerController.setPosition(x, y, z);
        });

        this.connection.on('OnPositionCorrection', (x: number, y: number, z: number) => {
            if (this.playerController) {
                this.playerController.applyServerCorrection(x, y, z);
            }
        });

        this.connection.on('OnCraftingRecipes', (recipes: any[]) => {
            this.uiManager.populateCraftingRecipes(recipes);
        });

        this.connection.on('OnSmeltingRecipes', (recipes: any[]) => {
            this.uiManager.populateSmeltingRecipes(recipes);
        });

        this.connection.on('OnChestInventory', (items: any[]) => {
            this.uiManager.updateChestInventory(items);
            this.uiManager.updateChestPlayerInventory(this.playerController.inventory);
        });

        this.connection.on('OnFurnaceUpdate', (input: string, fuel: string, output: string, progress: number) => {
            this.uiManager.updateFurnaceState(input, fuel, output, progress);
        });

        this.connection.on('OnFallingBlock', (fromX: number, fromY: number, fromZ: number, toX: number, toY: number, toZ: number, blockType: number) => {
            this.worldManager.onFallingBlock(fromX, fromY, fromZ, toX, toY, toZ, blockType);
        });

        this.connection.on('OnArmorUpdate', (items: any[]) => {
            this.uiManager.updateArmor(items);
        });

        this.connection.on('OnExperienceUpdate', (_level: number, _totalExp: number) => {
            this.uiManager.updateExperience(_level, _totalExp);
        });

        this.connection.on('OnSignEditorOpened', (x: number, y: number, z: number, text: string) => {
            this.uiManager.showSignEditor(x, y, z, text, (newText) => {
                this.connection?.invoke('SetSignText', x, y, z, newText);
            });
        });

        this.connection.on('OnBlockSound', (blockType: string, _x: number, _y: number, _z: number) => {
            this.audioManager.playBlockSound(blockType);
        });
    }

    sendChat(message: string): void {
        this.connection?.invoke('SendChat', message);
    }

    respawn(): void {
        this.connection?.invoke('Respawn');
        this.playerController.respawn();
        this.uiManager.hideDeathScreen();
    }

    useItem(slotIndex: number): void {
        this.connection?.invoke('UseItem', slotIndex);
    }

    craft(): void {
        this.connection?.invoke('Craft', '');
    }

    getCraftingRecipes(): void {
        this.connection?.invoke('GetCraftingRecipes');
    }

    craftRecipe(recipeIndex: number): void {
        this.connection?.invoke('CraftRecipe', recipeIndex);
    }

    getSmeltingRecipes(): void {
        this.connection?.invoke('GetSmeltingRecipes');
    }

    startSmelting(inputItemId: string, resultItemId: string, x: number, y: number, z: number): void {
        this.connection?.invoke('StartSmelting', inputItemId, resultItemId, x, y, z);
    }

    getChestInventory(x: number, y: number, z: number): void {
        this.connection?.invoke('GetChestInventory', x, y, z);
    }

    moveItemToChest(slotIndex: number, chestSlot: number, x: number, y: number, z: number): void {
        this.connection?.invoke('MoveItemToChest', slotIndex, chestSlot, x, y, z);
    }

    takeItemFromChest(chestSlot: number, slotIndex: number, x: number, y: number, z: number): void {
        this.connection?.invoke('TakeItemFromChest', chestSlot, slotIndex, x, y, z);
    }

    getPrivileges(): void {
        this.connection?.invoke('GetPrivileges');
    }

    equipArmor(slotIndex: number, armorSlot: number): void {
        this.connection?.invoke('EquipArmor', slotIndex, armorSlot);
    }

    unequipArmor(armorSlot: number): void {
        this.connection?.invoke('UnequipArmor', armorSlot);
    }

    showCreativeInventory(): void {
        const registry = this.worldManager.getBlockRegistry();
        const allBlocks: { id: number; name: string; color: string; solid: boolean }[] = [];
        registry.getAll().forEach((def, id) => {
            if (id > 0) {
                allBlocks.push({ id, name: def.name, color: def.color, solid: def.solid });
            }
        });
        allBlocks.sort((a, b) => a.id - b.id);
        this.uiManager.setCreativeSelectHandler((blockId: number) => {
            this.playerController.setSelectedBlockType(blockId);
        });
        this.uiManager.showCreativeInventory(allBlocks);
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

        if (!this.playerController.isDead) {
            this.playerController.update(dt);
        }

        this.minimap.setPosition(
            this.playerController.getPosition().x,
            this.playerController.getPosition().y,
            this.playerController.getPosition().z,
            this.playerController.getYaw() * Math.PI / 180
        );
        this.minimap.update(dt);
        this.particleSystem.update(dt);

        const selectedSlot = this.playerController.getSelectedSlot();
        const inventory = this.playerController.inventory;
        if (inventory[selectedSlot]) {
            this.wieldItem.updateItem(
                inventory[selectedSlot].itemId || '',
                inventory[selectedSlot].blockId || null,
                inventory[selectedSlot].itemName || ''
            );
        } else {
            this.wieldItem.updateItem('', null, '');
        }
        this.wieldItem.update(dt, this.playerController.getOnGround());

        this.chunkRequestTimer += dt;
        if (this.chunkRequestTimer >= 2.0) {
            this.chunkRequestTimer = 0;
            this.worldManager.requestChunksAroundPlayer(this.playerController.getPosition());
        }

        this.chunkUnloadTimer += dt;
        if (this.chunkUnloadTimer >= 10.0) {
            this.chunkUnloadTimer = 0;
            this.worldManager.unloadDistantChunks(this.playerController.getPosition());
        }

        this.worldManager.update(dt);
        this.renderer.updateClouds(dt);
        this.renderer.updateEffects(dt);

        this.weatherTimer += dt;
        if (this.weatherTimer >= 5.0) {
            this.weatherTimer = 0;
            this.weatherSystem.setRaining(this.skyBrightness < 0.3 || Math.random() < 0.2);
            this.renderer.setRaining(this.weatherSystem.getIsRaining());
        }

        const playerPos = this.playerController.getPosition();
        this.renderer.updatePlayerLight(playerPos.x, playerPos.y, playerPos.z);
        this.weatherSystem.update(dt, playerPos.x, playerPos.y, playerPos.z);

        const vel = this.playerController.getVelocity();
        const isMoving = (vel.x * vel.x + vel.z * vel.z) > 0.5;
        this.worldManager.animatePlayer('__local__', isMoving, dt);

        if (playerPos.y < 30) {
            const hasSkyAccess = this.checkSkyAccess(
                Math.floor(playerPos.x),
                Math.floor(playerPos.y) + 2,
                Math.floor(playerPos.z)
            );
            this.renderer.updateCaveDarkness(playerPos.y, !hasSkyAccess);
        } else {
            this.renderer.updateCaveDarkness(playerPos.y, false);
        }

        this.renderer.updateLavaEffect(this.checkNearLava(playerPos));

        this.renderer.render();
        this.uiManager.updateDebugInfo(
            this.fps,
            this.playerController.getPosition(),
            this.worldManager.getChunkCount()
        );

        this.sendPositionUpdate();
    }

    private lastPositionSendTime: number = 0;

    private sendPositionUpdate(): void {
        if (!this.connection) return;
        const now = performance.now();
        if (now - this.lastPositionSendTime < 50) return;
        this.lastPositionSendTime = now;

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

    private onParticleEvent(x: number, y: number, z: number, type: string): void {
        const color = new THREE.Color(this.worldManager.getBlockRegistry().get(
            this.worldManager.getBlock(x, y, z)
        )?.color || '#888888');

        switch (type) {
            case 'dig':
                this.particleSystem.emitBlockParticles(x, y, z, color, 8);
                break;
            case 'place':
                this.particleSystem.emitPlaceParticles(x, y, z, color, 6);
                break;
            case 'damage':
                this.particleSystem.emitDamageParticles(
                    this.playerController.getPosition().x,
                    this.playerController.getPosition().y,
                    this.playerController.getPosition().z
                );
                break;
            case 'smoke':
                this.particleSystem.emitSmokeParticles(x, y, z, 4);
                break;
        }
    }

    private checkSkyAccess(x: number, startY: number, z: number): boolean {
        for (let y = startY; y < 80; y += 3) {
            if (this.worldManager.isSolid(x, y, z)) {
                return false;
            }
        }
        return true;
    }

    private checkNearLava(pos: THREE.Vector3): boolean {
        const range = 4;
        const px = Math.floor(pos.x);
        const py = Math.floor(pos.y);
        const pz = Math.floor(pos.z);
        for (let dx = -range; dx <= range; dx++) {
            for (let dy = -range; dy <= range; dy++) {
                for (let dz = -range; dz <= range; dz++) {
                    if (dx * dx + dy * dy + dz * dz > range * range) continue;
                    const blockId = this.worldManager.getBlock(px + dx, py + dy, pz + dz);
                    const blockDef = this.worldManager.getBlockRegistry().get(blockId);
                    if (blockDef && (blockDef.name === 'lava' || blockDef.name === 'lava_flowing')) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
