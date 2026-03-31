import * as THREE from 'three';

const CHUNK_SIZE = 16;
const BYTES_PER_BLOCK = 4;

export class ChunkMesh {
    public mesh: THREE.Mesh | null = null;
    public transparentMesh: THREE.Mesh | null = null;
    public chunkX: number;
    public chunkY: number;
    public chunkZ: number;
    public blocks: Uint8Array;

    constructor(chunkX: number, chunkY: number, chunkZ: number, data: Uint8Array) {
        this.chunkX = chunkX;
        this.chunkY = chunkY;
        this.chunkZ = chunkZ;
        this.blocks = data;
    }

    static fromServerData(chunkX: number, chunkY: number, chunkZ: number, data: Uint8Array): ChunkMesh {
        return new ChunkMesh(chunkX, chunkY, chunkZ, data);
    }

    getBlock(localX: number, localY: number, localZ: number): number {
        const index = (localX * CHUNK_SIZE * CHUNK_SIZE + localY * CHUNK_SIZE + localZ) * BYTES_PER_BLOCK;
        return this.blocks[index];
    }

    buildMesh(
        blockRegistry: any,
        getNeighborBlock: (wx: number, wy: number, wz: number) => number
    ): void {
        const solidPositions: number[] = [];
        const solidNormals: number[] = [];
        const solidColors: number[] = [];
        const solidIndices: number[] = [];
        let solidVertexCount = 0;

        const transPositions: number[] = [];
        const transNormals: number[] = [];
        const transColors: number[] = [];
        const transIndices: number[] = [];
        let transVertexCount = 0;

        const faceData = [
            { dir: [0, 1, 0], corners: [[0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1]], normal: [0, 1, 0] },
            { dir: [0, -1, 0], corners: [[0, 0, 1], [1, 0, 1], [1, 0, 0], [0, 0, 0]], normal: [0, -1, 0] },
            { dir: [1, 0, 0], corners: [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]], normal: [1, 0, 0] },
            { dir: [-1, 0, 0], corners: [[0, 0, 1], [0, 1, 1], [0, 1, 0], [0, 0, 0]], normal: [-1, 0, 0] },
            { dir: [0, 0, 1], corners: [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]], normal: [0, 0, 1] },
            { dir: [0, 0, -1], corners: [[1, 0, 0], [0, 0, 0], [0, 1, 0], [1, 1, 0]], normal: [0, 0, -1] },
        ];

        for (let x = 0; x < CHUNK_SIZE; x++) {
            for (let y = 0; y < CHUNK_SIZE; y++) {
                for (let z = 0; z < CHUNK_SIZE; z++) {
                    const blockId = this.getBlock(x, y, z);
                    if (blockId === 0) continue;

                    const blockDef = blockRegistry.get(blockId);
                    if (!blockDef) continue;

                    const isTransparent = blockDef.transparent === true;
                    const isLiquid = blockDef.liquid === true;

                    const worldX = this.chunkX * CHUNK_SIZE + x;
                    const worldY = this.chunkY * CHUNK_SIZE + y;
                    const worldZ = this.chunkZ * CHUNK_SIZE + z;

                    const positions = isTransparent ? transPositions : solidPositions;
                    const normals = isTransparent ? transNormals : solidNormals;
                    const colors = isTransparent ? transColors : solidColors;
                    const indices = isTransparent ? transIndices : solidIndices;

                    for (const face of faceData) {
                        const neighborX = worldX + face.dir[0];
                        const neighborY = worldY + face.dir[1];
                        const neighborZ = worldZ + face.dir[2];

                        const neighborId = getNeighborBlock(neighborX, neighborY, neighborZ);
                        const neighborDef = blockRegistry.get(neighborId);

                        if (isTransparent) {
                            if (neighborDef && !neighborDef.transparent && !neighborDef.liquid) continue;
                            if (neighborId === blockId && !isLiquid) continue;
                        } else {
                            if (neighborDef && neighborDef.solid && !neighborDef.transparent) continue;
                        }

                        const color = new THREE.Color(blockDef.color);
                        let faceColor = color;
                        if (face.dir[1] === 1) faceColor = color.clone().multiplyScalar(1.1);
                        if (face.dir[1] === -1) faceColor = color.clone().multiplyScalar(0.7);

                        for (const corner of face.corners) {
                            positions.push(
                                worldX + corner[0],
                                worldY + corner[1],
                                worldZ + corner[2]
                            );
                            normals.push(face.normal[0], face.normal[1], face.normal[2]);
                            colors.push(faceColor.r, faceColor.g, faceColor.b);
                        }

                        const vc = isTransparent ? transVertexCount : solidVertexCount;
                        indices.push(
                            vc, vc + 1, vc + 2,
                            vc, vc + 2, vc + 3
                        );
                        if (isTransparent) {
                            transVertexCount += 4;
                        } else {
                            solidVertexCount += 4;
                        }
                    }
                }
            }
        }

        this.mesh = this.buildGeometry(solidPositions, solidNormals, solidColors, solidIndices, solidVertexCount, false);
        this.transparentMesh = this.buildGeometry(transPositions, transNormals, transColors, transIndices, transVertexCount, true);
    }

    private buildGeometry(
        positions: number[], normals: number[], colors: number[],
        indices: number[], vertexCount: number, transparent: boolean
    ): THREE.Mesh | null {
        if (vertexCount === 0) return null;

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setIndex(indices);

        const material = new THREE.MeshLambertMaterial({
            vertexColors: true,
            transparent: transparent,
            opacity: transparent ? 0.6 : 1.0,
            side: transparent ? THREE.DoubleSide : THREE.FrontSide,
            depthWrite: !transparent
        });

        return new THREE.Mesh(geometry, material);
    }

}
