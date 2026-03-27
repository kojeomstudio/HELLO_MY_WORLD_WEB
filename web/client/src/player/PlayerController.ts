import * as THREE from 'three';
import { InputManager } from '../input/InputManager';

const GRAVITY = 20.0;
const WALK_SPEED = 5.0;
const SPRINT_SPEED = 8.0;
const FLY_SPEED = 12.0;
const MOUSE_SENSITIVITY = 0.002;
const PLAYER_HEIGHT = 1.7;

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

    constructor(camera: THREE.PerspectiveCamera, input: InputManager) {
        this._camera = camera;
        this._input = input;
        this._position = new THREE.Vector3(0, 50, 0);
        this._velocity = new THREE.Vector3(0, 0, 0);

        this.setupControls();
        this.requestPointerLock();
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
                case 'Digit1': case 'Digit2': case 'Digit3': case 'Digit4':
                case 'Digit5': case 'Digit6': case 'Digit7': case 'Digit8':
                    this._selectedSlot = parseInt(e.code.replace('Digit', '')) - 1;
                    break;
            }
        });

        document.addEventListener('mousedown', (e: MouseEvent) => {
            if (!this._input.isPointerLocked()) return;
            if (e.button === 0) {
                this.onDig();
            } else if (e.button === 2) {
                this.onPlace();
            }
        });

        document.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    private onDig(): void {
        const ray = this.castRay();
        if (ray) {
            this.emitBlockEvent('dig', ray.blockX, ray.blockY, ray.blockZ);
        }
    }

    private onPlace(): void {
        const ray = this.castRay();
        if (ray) {
            this.emitBlockEvent('place', ray.placeX, ray.placeY, ray.placeZ);
        }
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
        if (!this._input.isPointerLocked()) return;

        this.updateMovement(dt);
        this.updateCamera();
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
        } else {
            this._velocity.x = moveDir.x * speed;
            this._velocity.z = moveDir.z * speed;
            this._velocity.y -= GRAVITY * dt;
        }

        this._velocity.y = Math.max(this._velocity.y, -50);

        this._position.x += this._velocity.x * dt;
        this._position.y += this._velocity.y * dt;
        this._position.z += this._velocity.z * dt;

        if (this._position.y < -20) {
            this._position.set(0, 50, 0);
            this._velocity.set(0, 0, 0);
        }
    }

    private updateCamera(): void {
        this._camera.position.copy(this._position);
        this._camera.position.y += PLAYER_HEIGHT;

        const euler = new THREE.Euler(this._pitch, this._yaw, 0, 'YXZ');
        this._camera.quaternion.setFromEuler(euler);
    }

    getPosition(): THREE.Vector3 { return this._position.clone(); }
    getVelocity(): THREE.Vector3 { return this._velocity.clone(); }
    getYaw(): number { return this._yaw * 180 / Math.PI; }
    getPitch(): number { return this._pitch * 180 / Math.PI; }

    setHealth(_health: number): void { }
    setInventory(_items: any[]): void { }
    getSelectedSlot(): number { return this._selectedSlot; }
}
