import * as THREE from 'three';

const CHUNK_SIZE = 16;

export class OcclusionCuller {
    private enabled: boolean = true;
    private stepFactor: number = 1.05;
    private neededCount: number = 2;
    private maxDistance: number = 160;
    private isOcclusionBlocking: (blockId: number) => boolean;

    constructor(isOcclusionBlocking: (blockId: number) => boolean) {
        this.isOcclusionBlocking = isOcclusionBlocking;
    }

    isChunkOccluded(
        chunkCenterX: number, chunkCenterY: number, chunkCenterZ: number,
        cameraPos: THREE.Vector3,
        getBlock: (x: number, y: number, z: number) => number
    ): boolean {
        if (!this.enabled) return false;

        const dx = chunkCenterX - cameraPos.x;
        const dy = chunkCenterY - cameraPos.y;
        const dz = chunkCenterZ - cameraPos.z;
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq > this.maxDistance * this.maxDistance) return false;
        if (distSq < 16) return false;

        const halfChunk = CHUNK_SIZE * 0.5 + 1;

        const offsets = [
            [0, 0, 0],
            [-halfChunk, -halfChunk, -halfChunk],
            [-halfChunk, -halfChunk, halfChunk],
            [-halfChunk, halfChunk, -halfChunk],
            [-halfChunk, halfChunk, halfChunk],
            [halfChunk, -halfChunk, -halfChunk],
            [halfChunk, -halfChunk, halfChunk],
            [halfChunk, halfChunk, -halfChunk],
            [halfChunk, halfChunk, halfChunk]
        ];

        for (let i = 0; i < 9; i++) {
            const off = offsets[i];
            const targetX = chunkCenterX + off[0];
            const targetY = chunkCenterY + off[1];
            const targetZ = chunkCenterZ + off[2];

            const dirX = targetX - cameraPos.x;
            const dirY = targetY - cameraPos.y;
            const dirZ = targetZ - cameraPos.z;
            const len = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);

            if (len < 1) return false;

            const invLen = 1 / len;
            const ndx = dirX * invLen;
            const ndy = dirY * invLen;
            const ndz = dirZ * invLen;

            if (!this.isRayOccluded(cameraPos.x, cameraPos.y, cameraPos.z, ndx, ndy, ndz, len, getBlock)) {
                return false;
            }
        }

        return true;
    }

    private isRayOccluded(
        startX: number, startY: number, startZ: number,
        dirX: number, dirY: number, dirZ: number,
        distance: number,
        getBlock: (x: number, y: number, z: number) => number
    ): boolean {
        let step = 1.2;
        let t = 1.0;
        let consecutiveSolid = 0;

        while (t < distance - 1.0) {
            const x = startX + dirX * t;
            const y = startY + dirY * t;
            const z = startZ + dirZ * t;

            const bx = Math.floor(x);
            const by = Math.floor(y);
            const bz = Math.floor(z);

            const blockId = getBlock(bx, by, bz);

            if (blockId !== 0 && this.isOcclusionBlocking(blockId)) {
                consecutiveSolid++;
                if (consecutiveSolid >= this.neededCount) {
                    return true;
                }
            } else {
                consecutiveSolid = 0;
            }

            step *= this.stepFactor;
            t += step;
        }

        return false;
    }

    setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }

    isEnabled(): boolean {
        return this.enabled;
    }
}
