import * as THREE from 'three';
import { WorldManager } from '../world/WorldManager';

const MINIMAP_SIZE = 160;
const SCAN_RANGE = 32;

export class Minimap {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private worldManager: WorldManager;
    private mode: 'surface' | 'radar' | 'normal' = 'surface';
    private updateTimer: number = 0;
    private updateInterval: number = 0.5;
    private container: HTMLElement;
    private position: THREE.Vector3 = new THREE.Vector3();
    private yaw: number = 0;

    constructor(container: HTMLElement, worldManager: WorldManager) {
        this.worldManager = worldManager;
        this.container = container;

        this.canvas = document.createElement('canvas');
        this.canvas.width = MINIMAP_SIZE;
        this.canvas.height = MINIMAP_SIZE;
        this.canvas.id = 'minimap';
        this.canvas.style.cssText = `
            position: fixed; top: 10px; right: 10px;
            width: ${MINIMAP_SIZE}px; height: ${MINIMAP_SIZE}px;
            border: 2px solid rgba(255,255,255,0.5);
            border-radius: ${this.mode === 'surface' ? '50%' : '4px'};
            z-index: 100; image-rendering: pixelated;
            cursor: pointer; opacity: 0.85;
        `;
        this.ctx = this.canvas.getContext('2d')!;
        this.container.appendChild(this.canvas);

        this.canvas.addEventListener('click', () => {
            const modes: Array<'surface' | 'radar' | 'normal'> = ['surface', 'radar', 'normal'];
            const currentIdx = modes.indexOf(this.mode);
            this.mode = modes[(currentIdx + 1) % modes.length];
            this.canvas.style.borderRadius = this.mode === 'surface' ? '50%' : '4px';
        });
    }

    setPosition(x: number, y: number, z: number, yaw: number): void {
        this.position.set(x, y, z);
        this.yaw = yaw;
    }

    update(dt: number): void {
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) return;
        this.updateTimer = 0;

        const px = Math.floor(this.position.x);
        const py = Math.floor(this.position.y);
        const pz = Math.floor(this.position.z);

        const halfRange = Math.floor(SCAN_RANGE / 2);
        const scale = MINIMAP_SIZE / SCAN_RANGE;

        const imageData = this.ctx.createImageData(MINIMAP_SIZE, MINIMAP_SIZE);
        const data = imageData.data;

        for (let dz = -halfRange; dz < halfRange; dz++) {
            for (let dx = -halfRange; dx < halfRange; dx++) {
                const rotatedDx = Math.round(dx * Math.cos(-this.yaw) - dz * Math.sin(-this.yaw));
                const rotatedDz = Math.round(dx * Math.sin(-this.yaw) + dz * Math.cos(-this.yaw));

                const wx = px + rotatedDx;
                const wz = pz + rotatedDz;

                let blockId = 0;
                if (this.mode === 'surface') {
                    for (let wy = py + 30; wy >= py - 30; wy--) {
                        const id = this.worldManager.getBlock(wx, wy, wz);
                        if (id !== 0 && !this.worldManager.getBlockRegistry().isLiquid(id)) {
                            blockId = id;
                            break;
                        }
                    }
                } else if (this.mode === 'radar') {
                    const id = this.worldManager.getBlock(wx, py, wz);
                    blockId = id;
                } else {
                    const id = this.worldManager.getBlock(wx, py + 1, wz);
                    if (id === 0) {
                        blockId = this.worldManager.getBlock(wx, py, wz);
                    } else {
                        blockId = id;
                    }
                }

                const screenX = Math.floor((dx + halfRange) * scale);
                const screenY = Math.floor((dz + halfRange) * scale);

                if (screenX < 0 || screenX >= MINIMAP_SIZE || screenY < 0 || screenY >= MINIMAP_SIZE) continue;

                const color = this.getBlockColor(blockId);
                const idx = (screenY * MINIMAP_SIZE + screenX) * 4;
                data[idx] = color[0];
                data[idx + 1] = color[1];
                data[idx + 2] = color[2];
                data[idx + 3] = 255;
            }
        }

        this.ctx.putImageData(imageData, 0, 0);

        const centerX = MINIMAP_SIZE / 2;
        const centerY = MINIMAP_SIZE / 2;

        this.ctx.fillStyle = '#FF0000';
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.lineTo(
            centerX + Math.sin(this.yaw) * 12,
            centerY - Math.cos(this.yaw) * 12
        );
        this.ctx.stroke();
    }

    private getBlockColor(blockId: number): [number, number, number] {
        if (blockId === 0) return [30, 100, 200];
        const def = this.worldManager.getBlockRegistry().get(blockId);
        if (!def) return [0, 0, 0];

        const hex = def.color;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return [r, g, b];
    }

    setVisible(visible: boolean): void {
        this.canvas.style.display = visible ? 'block' : 'none';
    }

    destroy(): void {
        this.canvas.remove();
    }
}
