import * as THREE from 'three';
import { Renderer } from '../rendering/Renderer';
import { ChunkMesh } from './ChunkMesh';
import { BlockRegistry } from './BlockRegistry';

export interface PlayerInfo {
    mesh: THREE.Mesh;
    label: THREE.Sprite;
}

export class WorldManager {
    private chunks: Map<string, ChunkMesh> = new Map();
    private renderer: Renderer;
    private blockRegistry: BlockRegistry;
    private playerMeshes: Map<string, PlayerInfo> = new Map();
    private entityMeshes: Map<string, THREE.Mesh> = new Map();
    private pendingChunks: Set<string> = new Set();

    constructor(renderer: Renderer) {
        this.renderer = renderer;
        this.blockRegistry = new BlockRegistry();
    }

    loadChunk(chunkX: number, chunkY: number, chunkZ: number, data: Uint8Array): void {
        const key = `${chunkX},${chunkY},${chunkZ}`;

        const existing = this.chunks.get(key);
        if (existing && existing.mesh) {
            this.renderer.removeFromScene(existing.mesh);
        }

        const chunk = ChunkMesh.fromServerData(chunkX, chunkY, chunkZ, data);
        chunk.buildMesh(this.blockRegistry);

        if (chunk.mesh) {
            this.renderer.addToScene(chunk.mesh);
        }

        this.chunks.set(key, chunk);
        this.pendingChunks.delete(key);
    }

    updateBlock(x: number, y: number, z: number, blockData: number): void {
        const chunkX = Math.floor(x / 16);
        const chunkY = Math.floor(y / 16);
        const chunkZ = Math.floor(z / 16);
        const key = `${chunkX},${chunkY},${chunkZ}`;

        const chunk = this.chunks.get(key);
        if (chunk) {
            const localX = ((x % 16) + 16) % 16;
            const localY = ((y % 16) + 16) % 16;
            const localZ = ((z % 16) + 16) % 16;
            const index = (localX * 16 * 16 + localY * 16 + localZ) * 4;
            chunk.blocks[index] = (blockData >> 8) & 0xFF;
            chunk.blocks[index + 1] = blockData & 0xFF;

            if (chunk.mesh) {
                this.renderer.removeFromScene(chunk.mesh);
            }
            chunk.buildMesh(this.blockRegistry);
            if (chunk.mesh) {
                this.renderer.addToScene(chunk.mesh);
            }
        }
    }

    requestChunksAroundPlayer(position: THREE.Vector3): string[] {
        const playerChunkX = Math.floor(position.x / 16);
        const playerChunkY = Math.floor(position.y / 16);
        const playerChunkZ = Math.floor(position.z / 16);

        const renderDistance = 4;
        const requests: string[] = [];

        for (let dx = -renderDistance; dx <= renderDistance; dx++) {
            for (let dy = -1; dy <= 2; dy++) {
                for (let dz = -renderDistance; dz <= renderDistance; dz++) {
                    if (dx * dx + dz * dz > renderDistance * renderDistance) continue;

                    const key = `${playerChunkX + dx},${playerChunkY + dy},${playerChunkZ + dz}`;
                    if (!this.chunks.has(key) && !this.pendingChunks.has(key)) {
                        this.pendingChunks.add(key);
                        requests.push(key);
                    }
                }
            }
        }

        return requests;
    }

    addPlayer(name: string): void {
        if (this.playerMeshes.has(name)) return;

        const geometry = new THREE.BoxGeometry(0.6, 1.8, 0.6);
        const material = new THREE.MeshLambertMaterial({ color: 0x4488ff });
        const mesh = new THREE.Mesh(geometry, material);

        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(name, 128, 40);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const label = new THREE.Sprite(spriteMaterial);
        label.position.y = 2.2;
        label.scale.set(3, 0.75, 1);

        const group = new THREE.Group();
        group.add(mesh);
        group.add(label);
        group.position.y = 0.9;
        this.renderer.addToScene(group);

        this.playerMeshes.set(name, { mesh: group as any, label });
    }

    removePlayer(name: string): void {
        const playerInfo = this.playerMeshes.get(name);
        if (playerInfo) {
            this.renderer.removeFromScene(playerInfo.mesh);
            this.playerMeshes.delete(name);
        }
    }

    updatePlayerPosition(name: string, x: number, y: number, z: number, _yaw: number, _pitch: number): void {
        if (!this.playerMeshes.has(name)) {
            this.addPlayer(name);
        }

        const playerInfo = this.playerMeshes.get(name)!;
        playerInfo.mesh.position.set(x, y, z);
        playerInfo.mesh.rotation.y = _yaw * Math.PI / 180;
    }

    spawnEntity(entityId: string, entityType: string, x: number, y: number, z: number): void {
        const geometry = entityType === 'Item'
            ? new THREE.BoxGeometry(0.3, 0.3, 0.3)
            : new THREE.BoxGeometry(0.8, 1.6, 0.8);

        const color = entityType === 'Item' ? 0xFFAA00 : 0xFF4444;
        const material = new THREE.MeshLambertMaterial({ color });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.userData.entityId = entityId;
        this.renderer.addToScene(mesh);
        this.entityMeshes.set(entityId, mesh);
    }

    removeEntity(entityId: string): void {
        const mesh = this.entityMeshes.get(entityId);
        if (mesh) {
            this.renderer.removeFromScene(mesh);
            this.entityMeshes.delete(entityId);
        }
    }

    updateEntityPosition(entityId: string, x: number, y: number, z: number): void {
        const mesh = this.entityMeshes.get(entityId);
        if (mesh) {
            mesh.position.set(x, y, z);
        }
    }

    getBlock(worldX: number, worldY: number, worldZ: number): number {
        const chunkX = Math.floor(worldX / 16);
        const chunkY = Math.floor(worldY / 16);
        const chunkZ = Math.floor(worldZ / 16);
        const key = `${chunkX},${chunkY},${chunkZ}`;

        const chunk = this.chunks.get(key);
        if (!chunk) return 0;

        const localX = ((worldX % 16) + 16) % 16;
        const localY = ((worldY % 16) + 16) % 16;
        const localZ = ((worldZ % 16) + 16) % 16;

        return chunk.getBlock(localX, localY, localZ);
    }

    isSolid(worldX: number, worldY: number, worldZ: number): boolean {
        const blockId = this.getBlock(worldX, worldY, worldZ);
        return this.blockRegistry.isSolid(blockId);
    }

    update(dt: number): void {
        for (const mesh of this.entityMeshes.values()) {
            mesh.position.y += Math.sin(Date.now() * 0.003) * 0.002;
            mesh.rotation.y += dt;
        }
    }

    getChunkCount(): number { return this.chunks.size; }
    getPendingChunkKeys(): Set<string> { return this.pendingChunks; }
}
