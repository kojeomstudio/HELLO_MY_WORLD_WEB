import * as THREE from 'three';

const CHUNK_SIZE = 16;
const BYTES_PER_BLOCK = 4;

export interface TextureAtlas {
    texture: THREE.CanvasTexture;
    getUV(blockId: number): [number, number, number, number];
    hasTexture(blockId: number): boolean;
}

function computeAO(side1: boolean, side2: boolean, corner: boolean): number {
    if (side1 && side2) return 0;
    return 3 - (side1 ? 1 : 0) - (side2 ? 1 : 0) - (corner ? 1 : 0);
}

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
        getNeighborBlock: (wx: number, wy: number, wz: number) => number,
        textureAtlas: TextureAtlas | null = null
    ): void {
        const hasAtlas = textureAtlas !== null;

        const solidPositions: number[] = [];
        const solidNormals: number[] = [];
        const solidColors: number[] = [];
        const solidUVs: number[] = [];
        const solidIndices: number[] = [];
        let solidVertexCount = 0;

        const transPositions: number[] = [];
        const transNormals: number[] = [];
        const transColors: number[] = [];
        const transUVs: number[] = [];
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
                    const uvs = isTransparent ? transUVs : solidUVs;
                    const indices = isTransparent ? transIndices : solidIndices;

                    let blockUV: [number, number, number, number] | null = null;
                    let useWhiteColor = false;
                    if (hasAtlas) {
                        blockUV = textureAtlas!.getUV(blockId);
                        useWhiteColor = textureAtlas!.hasTexture(blockId);
                    }

                    const cornerUVs: [number, number][] = blockUV !== null ? [
                        [blockUV[0], blockUV[1]],
                        [blockUV[2], blockUV[1]],
                        [blockUV[2], blockUV[3]],
                        [blockUV[0], blockUV[3]]
                    ] : [];

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

                        for (let ci = 0; ci < 4; ci++) {
                            const corner = face.corners[ci];

                            let ao = 1.0;
                            if (!isTransparent) {
                                const cx = worldX + corner[0] - face.dir[0] * 0.5;
                                const cy = worldY + corner[1] - face.dir[1] * 0.5;
                                const cz = worldZ + corner[2] - face.dir[2] * 0.5;

                                const side1Id = getNeighborBlock(
                                    worldX + corner[0] * 0.5 + face.dir[0] * 0.5 - face.dir[0],
                                    worldY + corner[1] * 0.5 + face.dir[1] * 0.5 - face.dir[1],
                                    worldZ + corner[2] * 0.5 + face.dir[2] * 0.5 - face.dir[2]
                                );
                                const side2Id = getNeighborBlock(
                                    worldX + face.dir[0],
                                    worldY + face.dir[1],
                                    worldZ + face.dir[2]
                                );

                                const s1def = blockRegistry.get(side1Id);
                                const s2def = blockRegistry.get(side2Id);
                                const cdef = blockRegistry.get(getNeighborBlock(
                                    Math.round(cx), Math.round(cy), Math.round(cz)
                                ));

                                const side1 = s1def?.solid === true && s1def?.transparent !== true;
                                const side2 = s2def?.solid === true && s2def?.transparent !== true;
                                const cornerSolid = cdef?.solid === true && cdef?.transparent !== true;

                                ao = computeAO(side1, side2, cornerSolid) / 3.0;
                            }

                            const cr = useWhiteColor ? 1 : faceColor.r * ao;
                            const cg = useWhiteColor ? 1 : faceColor.g * ao;
                            const cb = useWhiteColor ? 1 : faceColor.b * ao;

                            positions.push(
                                worldX + corner[0],
                                worldY + corner[1],
                                worldZ + corner[2]
                            );
                            normals.push(face.normal[0], face.normal[1], face.normal[2]);
                            colors.push(cr, cg, cb);
                            if (hasAtlas && blockUV !== null) {
                                uvs.push(cornerUVs[ci][0], cornerUVs[ci][1]);
                            }
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

        const atlasTexture = hasAtlas ? textureAtlas!.texture : null;
        this.mesh = this.buildGeometry(solidPositions, solidNormals, solidColors, solidUVs, solidIndices, solidVertexCount, false, atlasTexture);
        this.transparentMesh = this.buildGeometry(transPositions, transNormals, transColors, transUVs, transIndices, transVertexCount, true, atlasTexture);
    }

    private buildGeometry(
        positions: number[], normals: number[], colors: number[], uvs: number[],
        indices: number[], vertexCount: number, transparent: boolean,
        atlasTexture: THREE.CanvasTexture | null
    ): THREE.Mesh | null {
        if (vertexCount === 0) return null;

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        if (uvs.length > 0) {
            geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        }
        geometry.setIndex(indices);

        const material = new THREE.MeshLambertMaterial({
            map: atlasTexture,
            vertexColors: true,
            transparent: transparent,
            opacity: transparent ? 0.6 : 1.0,
            side: transparent ? THREE.DoubleSide : THREE.FrontSide,
            depthWrite: !transparent
        });

        return new THREE.Mesh(geometry, material);
    }

}
