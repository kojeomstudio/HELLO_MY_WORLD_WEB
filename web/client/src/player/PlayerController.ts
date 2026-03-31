import * as THREE from 'three';
import * as HubConnection from '@microsoft/signalr';
import { InputManager } from '../input/InputManager';
import { WorldManager } from '../world/WorldManager';
import { SelectionBox } from '../rendering/SelectionBox';

const GRAVITY = 20.0;
const WALK_SPEED = 5.0;
const SPRINT_SPEED = 8.0;
const FLY_SPEED = 12.0;
const MOUSE_SENSITIVITY = 0.002;
const PLAYER_HEIGHT = 1.7;
const PLAYER_WIDTH = 0.6;
const PLAYER_FULL_HEIGHT = 1.8;
const STEP_HEIGHT = 0.6;

export class PlayerController {
    private _camera: THREE.PerspectiveCamera;
    private _input: InputManager;
    private _position: THREE.Vector3;
    private _velocity: THREE.Vector3;
    private _yaw: number = 0;
    private _pitch: number = 0;
    private _isFlying: boolean = false;
    private _selectedSlot: number = 0;
    private _selectedBlockType: number = 1;
    private _worldManager: WorldManager | null = null;
    private _onGround: boolean = false;
    private _knockbackVelocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    private _selectionBox: SelectionBox | null = null;
    private _particleEmitter: ((x: number, y: number, z: number, type: string) => void) | null = null;
    private _connection: HubConnection.HubConnection | null = null;
    private digStartTime: number = 0;
    private digTarget: { x: number; y: number; z: number } | null = null;
    private digDuration: number = 0;
    private isDigging: boolean = false;
    private isLeftMouseDown: boolean = false;
    health: number = 20;
    maxHealth: number = 20;
    inventory: any[] = [];
    isDead: boolean = false;

    constructor(camera: THREE.PerspectiveCamera, input: InputManager) {
        this._camera = camera;
        this._input = input;
        this._position = new THREE.Vector3(0, 50, 0);
        this._velocity = new THREE.Vector3(0, 0, 0);

        this.setupControls();
        this.requestPointerLock();
    }

    setWorldManager(worldManager: WorldManager): void {
        this._worldManager = worldManager;
    }

    setSelectionBox(box: SelectionBox): void {
        this._selectionBox = box;
    }

    setParticleEmitter(emitter: (x: number, y: number, z: number, type: string) => void): void {
        this._particleEmitter = emitter;
    }

    setConnection(connection: HubConnection.HubConnection): void {
        this._connection = connection;
    }

    private requestPointerLock(): void {
        const canvas = document.getElementById('game-canvas');
        if (canvas) {
            canvas.addEventListener('click', () => {
                canvas.requestPointerLock();
            });
        }
    }

    private setupControls(): void {
        document.addEventListener('pointerlockchange', () => {
            this._input.setPointerLocked(document.pointerLockElement !== null);
        });

        document.addEventListener('mousemove', (e: MouseEvent) => {
            if (!this._input.isPointerLocked()) return;

            this._yaw -= e.movementX * MOUSE_SENSITIVITY;
            this._pitch -= e.movementY * MOUSE_SENSITIVITY;
            this._pitch = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, this._pitch));
        });

        document.addEventListener('keydown', (e: KeyboardEvent) => {
            switch (e.code) {
                case 'KeyF':
                    this._isFlying = !this._isFlying;
                    break;
                case 'KeyE':
                    const event = new CustomEvent('openCrafting');
                    document.dispatchEvent(event);
                    break;
                case 'Digit1': case 'Digit2': case 'Digit3': case 'Digit4':
                case 'Digit5': case 'Digit6': case 'Digit7': case 'Digit8':
                    this._selectedSlot = parseInt(e.code.replace('Digit', '')) - 1;
                    break;
            }
        });

        document.addEventListener('mousedown', (e: MouseEvent) => {
            if (!this._input.isPointerLocked()) return;
            if (this.isDead) return;
            if (e.button === 0) {
                this.isLeftMouseDown = true;
                this.startDig();
            } else if (e.button === 2) {
                this.onPlace();
            }
        });

        document.addEventListener('mouseup', (e: MouseEvent) => {
            if (e.button === 0) {
                this.isLeftMouseDown = false;
                this.resetDig();
            }
        });

        document.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    private startDig(): void {
        const ray = this.castRay();
        if (!ray) return;

        const target = { x: ray.blockX, y: ray.blockY, z: ray.blockZ };

        if (this.digTarget &&
            this.digTarget.x === target.x &&
            this.digTarget.y === target.y &&
            this.digTarget.z === target.z &&
            this.isDigging)
        {
            return;
        }

        this.resetDig();
        this.digTarget = target;

        if (!this._connection) {
            this.instantDig(ray);
            return;
        }

        this._connection.invoke('DigBlockStart', ray.blockX, ray.blockY, ray.blockZ)
            .then((digTime: number) => {
                if (digTime < 0) return;
                this.digStartTime = performance.now() / 1000;
                this.digDuration = digTime;
                this.isDigging = true;
            })
            .catch(() => {
                this.instantDig(ray);
            });
    }

    private instantDig(ray: { blockX: number; blockY: number; blockZ: number }): void {
        this._particleEmitter?.(ray.blockX, ray.blockY, ray.blockZ, 'dig');
        this.emitBlockEvent('dig', ray.blockX, ray.blockY, ray.blockZ);
    }

    private completeDig(): void {
        if (!this.digTarget) return;
        this._particleEmitter?.(this.digTarget.x, this.digTarget.y, this.digTarget.z, 'dig');
        this.emitBlockEvent('dig', this.digTarget.x, this.digTarget.y, this.digTarget.z);
        this.resetDig();
    }

    private resetDig(): void {
        this.digStartTime = 0;
        this.digTarget = null;
        this.digDuration = 0;
        this.isDigging = false;
        this._selectionBox?.setDigProgress(0);
    }

    private updateDig(): void {
        if (!this.isLeftMouseDown || !this.isDigging || !this.digTarget) {
            if (this.isDigging) {
                this.resetDig();
            }
            return;
        }

        const ray = this.castRay();
        if (!ray ||
            ray.blockX !== this.digTarget.x ||
            ray.blockY !== this.digTarget.y ||
            ray.blockZ !== this.digTarget.z)
        {
            this.resetDig();
            return;
        }

        const elapsed = performance.now() / 1000 - this.digStartTime;
        const progress = Math.min(elapsed / this.digDuration, 1.0);
        this._selectionBox?.setDigProgress(progress);

        if (progress >= 1.0)
        {
            this.completeDig();
        }
    }

    private onPlace(): void {
        const ray = this.castRay();
        if (!ray) return;

        if (this._worldManager) {
            const blockId = this._worldManager.getBlock(ray.blockX, ray.blockY, ray.blockZ);
            const blockDef = this._worldManager.getBlockRegistry().get(blockId);
            if (blockDef && blockDef.interactive) {
                const event = new CustomEvent('interactBlock', {
                    detail: {
                        x: ray.blockX,
                        y: ray.blockY,
                        z: ray.blockZ,
                        blockId: blockId,
                        blockName: blockDef.name
                    }
                });
                document.dispatchEvent(event);
                return;
            }
        }

        this._particleEmitter?.(ray.placeX, ray.placeY, ray.placeZ, 'place');
        this.emitBlockEvent('place', ray.placeX, ray.placeY, ray.placeZ);
    }

    private emitBlockEvent(type: string, x: number, y: number, z: number): void {
        const event = new CustomEvent('blockAction', {
            detail: { type, x, y, z, blockType: this._selectedBlockType }
        });
        document.dispatchEvent(event);
    }

    private castRay(): { blockX: number; blockY: number; blockZ: number; placeX: number; placeY: number; placeZ: number } | null {
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(this._camera.quaternion);

        const raycaster = new THREE.Raycaster(this._camera.position, direction, 0, 8);
        const scene = this._camera.parent;

        if (!scene) return null;

        const meshes: THREE.Mesh[] = [];
        scene.traverse((child) => {
            if (child instanceof THREE.Mesh && child.name !== 'sky' && child.name !== 'sun' && !child.userData.entityId) {
                meshes.push(child);
            }
        });

        const intersects = raycaster.intersectObjects(meshes, false);
        if (intersects.length === 0) return null;

        const hit = intersects[0];
        const normal = hit.face?.normal;

        if (!normal) return null;

        const blockX = Math.floor(hit.point.x - normal.x * 0.5);
        const blockY = Math.floor(hit.point.y - normal.y * 0.5);
        const blockZ = Math.floor(hit.point.z - normal.z * 0.5);

        const placeX = Math.floor(hit.point.x + normal.x * 0.5);
        const placeY = Math.floor(hit.point.y + normal.y * 0.5);
        const placeZ = Math.floor(hit.point.z + normal.z * 0.5);

        return { blockX, blockY, blockZ, placeX, placeY, placeZ };
    }

    update(dt: number): void {
        if (!this._input.isPointerLocked()) {
            this._selectionBox?.setVisible(false);
            return;
        }
        if (this.isDead) {
            this._selectionBox?.setVisible(false);
            return;
        }

        this.updateMovement(dt);
        this.updateCamera();
        this.updateSelectionBox();
        this.updateDig();
    }

    private updateMovement(dt: number): void {
        const forward = new THREE.Vector3(-Math.sin(this._yaw), 0, -Math.cos(this._yaw));
        const right = new THREE.Vector3(Math.cos(this._yaw), 0, -Math.sin(this._yaw));

        const moveDir = new THREE.Vector3(0, 0, 0);
        if (this._input.isKeyDown('KeyW')) moveDir.add(forward);
        if (this._input.isKeyDown('KeyS')) moveDir.sub(forward);
        if (this._input.isKeyDown('KeyA')) moveDir.sub(right);
        if (this._input.isKeyDown('KeyD')) moveDir.add(right);

        const speed = this._isFlying ? FLY_SPEED :
            (this._input.isKeyDown('ShiftLeft') ? SPRINT_SPEED : WALK_SPEED);

        if (this._isFlying) {
            this._velocity.x = moveDir.x * speed;
            this._velocity.z = moveDir.z * speed;
            this._velocity.y *= 0.9;

            if (this._input.isKeyDown('Space')) this._velocity.y = speed;
            else if (this._input.isKeyDown('ShiftLeft')) this._velocity.y = -speed;
        } else if (this.isClimbing()) {
            this._velocity.x = moveDir.x * WALK_SPEED * 0.5;
            this._velocity.z = moveDir.z * WALK_SPEED * 0.5;
            this._velocity.y *= 0.9;
            if (this._input.isKeyDown('Space')) {
                this._velocity.y = 2.0;
            } else if (this._input.isKeyDown('ShiftLeft')) {
                this._velocity.y = -2.0;
            } else {
                this._velocity.y = 0;
            }
            this._onGround = true;
        } else {
            this._velocity.x = moveDir.x * speed;
            this._velocity.z = moveDir.z * speed;
            this._velocity.y -= GRAVITY * dt;
        }

        this._velocity.y = Math.max(this._velocity.y, -50);

        const newX = this._position.x + this._velocity.x * dt;
        const newY = this._position.y + this._velocity.y * dt;
        const newZ = this._position.z + this._velocity.z * dt;

        if (this._worldManager) {
            if (!this.checkCollision(newX, this._position.y, this._position.z)) {
                this._position.x = newX;
            } else {
                this._velocity.x = 0;
            }

            if (!this.checkCollision(this._position.x, newY, this._position.z)) {
                this._position.y = newY;
                this._onGround = false;
            } else {
                if (this._velocity.y < 0) {
                    if (this._onGround && Math.abs(this._velocity.y) < 8) {
                        if (!this.checkCollision(this._position.x, newY + STEP_HEIGHT, this._position.z)) {
                            this._position.y = newY + STEP_HEIGHT;
                            this._velocity.y = 0;
                        } else {
                            this._onGround = true;
                            this._velocity.y = 0;
                        }
                    } else {
                        this._onGround = true;
                        this._velocity.y = 0;
                    }
                } else {
                    this._velocity.y = 0;
                }
            }

            if (!this.checkCollision(this._position.x, this._position.y, newZ)) {
                this._position.z = newZ;
            } else {
                if (this._onGround && Math.abs(this._velocity.z) > 0.1) {
                    if (!this.checkCollision(this._position.x, this._position.y + STEP_HEIGHT, newZ)) {
                        this._position.z = newZ;
                        this._position.y += STEP_HEIGHT;
                    } else {
                        this._velocity.z = 0;
                    }
                } else {
                    this._velocity.z = 0;
                }
            }
        } else {
            this._position.x = newX;
            this._position.y = newY;
            this._position.z = newZ;
        }

        this._position.add(this._knockbackVelocity.clone().multiplyScalar(dt));
        this._knockbackVelocity.multiplyScalar(0.85);

        if (this._position.y < -20) {
            this._position.set(0, 50, 0);
            this._velocity.set(0, 0, 0);
        }
    }

    private checkCollision(x: number, y: number, z: number): boolean {
        const halfW = PLAYER_WIDTH / 2;
        const minX = Math.floor(x - halfW);
        const maxX = Math.floor(x + halfW);
        const minY = Math.floor(y);
        const maxY = Math.floor(y + PLAYER_FULL_HEIGHT - 0.01);
        const minZ = Math.floor(z - halfW);
        const maxZ = Math.floor(z + halfW);

        for (let bx = minX; bx <= maxX; bx++) {
            for (let by = minY; by <= maxY; by++) {
                for (let bz = minZ; bz <= maxZ; bz++) {
                    if (this._worldManager && this._worldManager.isSolid(bx, by, bz)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    private isClimbing(): boolean {
        if (!this._worldManager) return false;
        const px = Math.floor(this._position.x);
        const py = Math.floor(this._position.y);
        const pz = Math.floor(this._position.z);
        for (let dx = -1; dx <= 1; dx++) {
            for (let dz = -1; dz <= 1; dz++) {
                const blockId = this._worldManager.getBlock(px + dx, py, pz + dz);
                if (this._worldManager.getBlockRegistry().isClimbable(blockId)) {
                    return true;
                }
            }
        }
        return false;
    }

    private updateCamera(): void {
        this._camera.position.copy(this._position);
        this._camera.position.y += PLAYER_HEIGHT;

        const euler = new THREE.Euler(this._pitch, this._yaw, 0, 'YXZ');
        this._camera.quaternion.setFromEuler(euler);
    }

    private updateSelectionBox(): void {
        if (!this._selectionBox) return;

        const ray = this.castRay();
        if (ray) {
            const normal = this.getBlockNormal(ray);
            const hitPoint = new THREE.Vector3(
                ray.blockX + 0.5 + normal.x * 0.5,
                ray.blockY + 0.5 + normal.y * 0.5,
                ray.blockZ + 0.5 + normal.z * 0.5
            );
            this._selectionBox.update(hitPoint, normal);
        } else {
            this._selectionBox.update(null, null);
        }
    }

    private getBlockNormal(ray: { blockX: number; blockY: number; blockZ: number; placeX: number; placeY: number; placeZ: number }): THREE.Vector3 {
        return new THREE.Vector3(
            ray.placeX - ray.blockX,
            ray.placeY - ray.blockY,
            ray.placeZ - ray.blockZ
        );
    }

    getPosition(): THREE.Vector3 { return this._position.clone(); }
    getVelocity(): THREE.Vector3 { return this._velocity.clone(); }
    getYaw(): number { return this._yaw * 180 / Math.PI; }
    getPitch(): number { return this._pitch * 180 / Math.PI; }
    getOnGround(): boolean { return this._onGround; }

    applyKnockback(vx: number, vy: number, vz: number): void {
        this._knockbackVelocity.set(vx, vy, vz);
    }

    setFlying(flying: boolean): void {
        this._isFlying = flying;
    }

    setHealth(health: number, maxHealth?: number): void {
        this.health = health;
        if (maxHealth !== undefined) {
            this.maxHealth = maxHealth;
        }
        if (this.health <= 0) {
            this.isDead = true;
        }
    }

    setInventory(items: any[]): void {
        this.inventory = items;
        for (let i = 0; i < Math.min(8, items.length); i++) {
            if (items[i] && items[i].blockId) {
                this._selectedBlockType = items[i].blockId;
                break;
            }
        }
    }

    handleDeath(): void {
        this.isDead = true;
        this._velocity.set(0, 0, 0);
    }

    respawn(): void {
        this._position.set(0, 50, 0);
        this._velocity.set(0, 0, 0);
        this.health = this.maxHealth;
        this.isDead = false;
    }

    getSelectedSlot(): number { return this._selectedSlot; }
    getSelectedBlockType(): number { return this._selectedBlockType; }
    setSelectedBlockType(blockType: number): void { this._selectedBlockType = blockType; }
}
