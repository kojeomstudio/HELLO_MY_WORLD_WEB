import * as THREE from 'three';

const CHUNK_SIZE = 16;
const BYTES_PER_BLOCK = 4;
const LIGHT_OFFSETS: [number, number][] = [[-1, -1], [-1, 0], [0, -1], [0, 0]];

export interface TextureAtlas {
    texture: THREE.CanvasTexture;
    getUV(blockId: number): [number, number, number, number];
    hasTexture(blockId: number): boolean;
}

function computeAO(side1: boolean, side2: boolean, corner: boolean): number {
    if (side1 && side2) return 0;
    return 3 - (side1 ? 1 : 0) - (side2 ? 1 : 0) - (corner ? 1 : 0);
}

interface BuildCtx {
    positions: number[];
    normals: number[];
    colors: number[];
    uvs: number[];
    indices: number[];
    vc: { count: number };
    blockUV: [number, number, number, number] | null;
    useWhite: boolean;
    isLight: boolean;
    getNeighborBlock: (wx: number, wy: number, wz: number) => number;
    getNeighborLight: (wx: number, wy: number, wz: number) => number;
}

function getBlockLight(ctx: BuildCtx, wx: number, wy: number, wz: number): number {
    if (ctx.isLight) return 1.0;
    return Math.max(ctx.getNeighborLight(wx, wy, wz) / 15.0, 0.1);
}

function pushQuad(
    ctx: BuildCtx, wx: number, wy: number, wz: number,
    c0: number[], c1: number[], c2: number[], c3: number[],
    n: number[], color: THREE.Color, lightMult: number, brightness: number
): void {
    const base = ctx.vc.count;
    const corners = [c0, c1, c2, c3];
    const r = ctx.useWhite ? lightMult : color.r * brightness * lightMult;
    const g = ctx.useWhite ? lightMult : color.g * brightness * lightMult;
    const b = ctx.useWhite ? lightMult : color.b * brightness * lightMult;
    for (let i = 0; i < 4; i++) {
        ctx.positions.push(wx + corners[i][0], wy + corners[i][1], wz + corners[i][2]);
        ctx.normals.push(n[0], n[1], n[2]);
        ctx.colors.push(r, g, b);
        if (ctx.blockUV !== null) {
            const u = i === 0 || i === 3 ? ctx.blockUV[0] : ctx.blockUV[2];
            const v = i < 2 ? ctx.blockUV[1] : ctx.blockUV[3];
            ctx.uvs.push(u, v);
        }
    }
    ctx.indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
    ctx.vc.count += 4;
}

function pushBox(
    ctx: BuildCtx, wx: number, wy: number, wz: number,
    x0: number, y0: number, z0: number, x1: number, y1: number, z1: number,
    color: THREE.Color, lightMult: number
): void {
    pushQuad(ctx, wx, wy, wz, [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1], [0, 1, 0], color, lightMult, 1.1);
    pushQuad(ctx, wx, wy, wz, [x0, y0, z1], [x1, y0, z1], [x1, y0, z0], [x0, y0, z0], [0, -1, 0], color, lightMult, 0.7);
    pushQuad(ctx, wx, wy, wz, [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [0, 0, -1], color, lightMult, 1.0);
    pushQuad(ctx, wx, wy, wz, [x1, y0, z1], [x0, y0, z1], [x0, y1, z1], [x1, y1, z1], [0, 0, 1], color, lightMult, 1.0);
    pushQuad(ctx, wx, wy, wz, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [1, 0, 0], color, lightMult, 1.0);
    pushQuad(ctx, wx, wy, wz, [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [x0, y0, z0], [-1, 0, 0], color, lightMult, 1.0);
}

function rotateStairCoord(x: number, y: number, z: number, rot: number): number[] {
    switch (rot) {
        case 0: return [x, y, z];
        case 1: return [z, y, x];
        case 2: return [1 - x, y, z];
        case 3: return [z, y, 1 - x];
        default: return [x, y, z];
    }
}

function rotateStairNorm(nx: number, ny: number, nz: number, rot: number): number[] {
    switch (rot) {
        case 0: return [nx, ny, nz];
        case 1: return [nz, ny, nx];
        case 2: return [-nx, ny, nz];
        case 3: return [nz, ny, -nx];
        default: return [nx, ny, nz];
    }
}

function buildStair(ctx: BuildCtx, wx: number, wy: number, wz: number, param2: number, color: THREE.Color): void {
    const rot = param2 % 4;
    const lm = getBlockLight(ctx, wx, wy, wz);

    pushQuad(ctx, wx, wy, wz,
        rotateStairCoord(0, 0, 1, rot), rotateStairCoord(0, 1, 1, rot),
        rotateStairCoord(0, 1, 0, rot), rotateStairCoord(0, 0, 0, rot),
        rotateStairNorm(-1, 0, 0, rot), color, lm, 1.0);
    pushQuad(ctx, wx, wy, wz,
        rotateStairCoord(0, 0, 0, rot), rotateStairCoord(0.5, 0, 0, rot),
        rotateStairCoord(0.5, 1, 0, rot), rotateStairCoord(0, 1, 0, rot),
        rotateStairNorm(0, 0, -1, rot), color, lm, 1.0);
    pushQuad(ctx, wx, wy, wz,
        rotateStairCoord(0.5, 0, 1, rot), rotateStairCoord(0, 0, 1, rot),
        rotateStairCoord(0, 1, 1, rot), rotateStairCoord(0.5, 1, 1, rot),
        rotateStairNorm(0, 0, 1, rot), color, lm, 1.0);
    pushQuad(ctx, wx, wy, wz,
        rotateStairCoord(0, 1, 0, rot), rotateStairCoord(0.5, 1, 0, rot),
        rotateStairCoord(0.5, 1, 1, rot), rotateStairCoord(0, 1, 1, rot),
        rotateStairNorm(0, 1, 0, rot), color, lm, 1.1);
    pushQuad(ctx, wx, wy, wz,
        rotateStairCoord(0.5, 0, 1, rot), rotateStairCoord(0.5, 0, 0, rot),
        rotateStairCoord(0, 0, 0, rot), rotateStairCoord(0, 0, 1, rot),
        rotateStairNorm(0, -1, 0, rot), color, lm, 0.7);
    pushQuad(ctx, wx, wy, wz,
        rotateStairCoord(1, 0, 0, rot), rotateStairCoord(1, 0.5, 0, rot),
        rotateStairCoord(1, 0.5, 1, rot), rotateStairCoord(1, 0, 1, rot),
        rotateStairNorm(1, 0, 0, rot), color, lm, 1.0);
    pushQuad(ctx, wx, wy, wz,
        rotateStairCoord(0.5, 0, 0, rot), rotateStairCoord(1, 0, 0, rot),
        rotateStairCoord(1, 0.5, 0, rot), rotateStairCoord(0.5, 0.5, 0, rot),
        rotateStairNorm(0, 0, -1, rot), color, lm, 1.0);
    pushQuad(ctx, wx, wy, wz,
        rotateStairCoord(1, 0, 1, rot), rotateStairCoord(0.5, 0, 1, rot),
        rotateStairCoord(0.5, 0.5, 1, rot), rotateStairCoord(1, 0.5, 1, rot),
        rotateStairNorm(0, 0, 1, rot), color, lm, 1.0);
    pushQuad(ctx, wx, wy, wz,
        rotateStairCoord(0.5, 0.5, 1, rot), rotateStairCoord(1, 0.5, 1, rot),
        rotateStairCoord(1, 0.5, 0, rot), rotateStairCoord(0.5, 0.5, 0, rot),
        rotateStairNorm(0, 1, 0, rot), color, lm, 1.1);
    pushQuad(ctx, wx, wy, wz,
        rotateStairCoord(1, 0, 0, rot), rotateStairCoord(0.5, 0, 0, rot),
        rotateStairCoord(0.5, 0, 1, rot), rotateStairCoord(1, 0, 1, rot),
        rotateStairNorm(0, -1, 0, rot), color, lm, 0.7);
}

function buildSlab(ctx: BuildCtx, wx: number, wy: number, wz: number, param2: number, color: THREE.Color): void {
    const lm = getBlockLight(ctx, wx, wy, wz);
    const y0 = param2 === 1 ? 0.5 : 0;
    const y1 = param2 === 1 ? 1.0 : 0.5;
    pushBox(ctx, wx, wy, wz, 0, y0, 0, 1, y1, 1, color, lm);
}

function buildFence(ctx: BuildCtx, wx: number, wy: number, wz: number, blockId: number, color: THREE.Color): void {
    const lm = getBlockLight(ctx, wx, wy, wz);
    const nb = ctx.getNeighborBlock;
    const north = nb(wx, wy, wz - 1) === blockId;
    const south = nb(wx, wy, wz + 1) === blockId;
    const east = nb(wx + 1, wy, wz) === blockId;
    const west = nb(wx - 1, wy, wz) === blockId;

    pushBox(ctx, wx, wy, wz, 0.4, 0, 0.4, 0.6, 1, 0.6, color, lm);

    const railY = 0.625;
    const railH = 0.125;
    if (north) pushBox(ctx, wx, wy, wz, 0.35, railY - railH, 0, 0.65, railY + railH, 0.4, color, lm);
    if (south) pushBox(ctx, wx, wy, wz, 0.35, railY - railH, 0.6, 0.65, railY + railH, 1, color, lm);
    if (east) pushBox(ctx, wx, wy, wz, 0.6, railY - railH, 0.35, 1, railY + railH, 0.65, color, lm);
    if (west) pushBox(ctx, wx, wy, wz, 0, railY - railH, 0.35, 0.4, railY + railH, 0.65, color, lm);
}

function buildWall(ctx: BuildCtx, wx: number, wy: number, wz: number, blockId: number, color: THREE.Color): void {
    const lm = getBlockLight(ctx, wx, wy, wz);
    const nb = ctx.getNeighborBlock;
    const north = nb(wx, wy, wz - 1) === blockId;
    const south = nb(wx, wy, wz + 1) === blockId;
    const east = nb(wx + 1, wy, wz) === blockId;
    const west = nb(wx - 1, wy, wz) === blockId;

    pushBox(ctx, wx, wy, wz, 0.375, 0, 0.375, 0.625, 1, 0.625, color, lm);

    if (north) pushBox(ctx, wx, wy, wz, 0.25, 0, 0, 0.75, 1, 0.375, color, lm);
    if (south) pushBox(ctx, wx, wy, wz, 0.25, 0, 0.625, 0.75, 1, 1, color, lm);
    if (east) pushBox(ctx, wx, wy, wz, 0.625, 0, 0.25, 1, 1, 0.75, color, lm);
    if (west) pushBox(ctx, wx, wy, wz, 0, 0, 0.25, 0.375, 1, 0.75, color, lm);
}

function buildGlassPane(ctx: BuildCtx, wx: number, wy: number, wz: number, blockId: number, color: THREE.Color): void {
    const lm = getBlockLight(ctx, wx, wy, wz);
    const nb = ctx.getNeighborBlock;
    const north = nb(wx, wy, wz - 1) === blockId;
    const south = nb(wx, wy, wz + 1) === blockId;
    const east = nb(wx + 1, wy, wz) === blockId;
    const west = nb(wx - 1, wy, wz) === blockId;

    pushBox(ctx, wx, wy, wz, 0.45, 0, 0.45, 0.55, 1, 0.55, color, lm);

    if (north) pushBox(ctx, wx, wy, wz, 0.45, 0, 0, 0.55, 1, 0.45, color, lm);
    if (south) pushBox(ctx, wx, wy, wz, 0.45, 0, 0.55, 0.55, 1, 1, color, lm);
    if (east) pushBox(ctx, wx, wy, wz, 0.55, 0, 0.45, 1, 1, 0.55, color, lm);
    if (west) pushBox(ctx, wx, wy, wz, 0, 0, 0.45, 0.45, 1, 0.55, color, lm);
}

function buildDoor(ctx: BuildCtx, wx: number, wy: number, wz: number, param2: number, color: THREE.Color): void {
    const lm = getBlockLight(ctx, wx, wy, wz);
    const facing = param2 % 4;
    const isOpen = (param2 & 4) !== 0;
    let x0: number, z0: number, x1: number, z1: number;

    if (isOpen) {
        switch (facing) {
            case 0: x0 = 0.6; z0 = 0; x1 = 0.8; z1 = 1; break;
            case 1: x0 = 0; z0 = 0.6; x1 = 1; z1 = 0.8; break;
            case 2: x0 = 0.2; z0 = 0; x1 = 0.4; z1 = 1; break;
            case 3: x0 = 0; z0 = 0.2; x1 = 1; z1 = 0.4; break;
            default: x0 = 0.6; z0 = 0; x1 = 0.8; z1 = 1;
        }
    } else {
        switch (facing) {
            case 0: x0 = 0.8; z0 = 0; x1 = 1; z1 = 1; break;
            case 1: x0 = 0; z0 = 0; x1 = 1; z1 = 0.2; break;
            case 2: x0 = 0; z0 = 0; x1 = 0.2; z1 = 1; break;
            case 3: x0 = 0; z0 = 0.8; x1 = 1; z1 = 1; break;
            default: x0 = 0.8; z0 = 0; x1 = 1; z1 = 1;
        }
    }

    pushBox(ctx, wx, wy, wz, x0, 0, z0, x1, 1, z1, color, lm);
}

function buildLadder(ctx: BuildCtx, wx: number, wy: number, wz: number, param2: number, color: THREE.Color): void {
    const lm = getBlockLight(ctx, wx, wy, wz);
    const thickness = 0.05;
    const offset = 0.025;

    switch (param2) {
        case 2: pushBox(ctx, wx, wy, wz, 1 - offset - thickness, 0, 0, 1 - offset, 1, 1, color, lm); break;
        case 3: pushBox(ctx, wx, wy, wz, offset, 0, 0, offset + thickness, 1, 1, color, lm); break;
        case 4: pushBox(ctx, wx, wy, wz, 0, 0, 1 - offset - thickness, 1, 1, 1 - offset, color, lm); break;
        case 5: pushBox(ctx, wx, wy, wz, 0, 0, offset, 1, 1, offset + thickness, color, lm); break;
        default: pushBox(ctx, wx, wy, wz, 1 - offset - thickness, 0, 0, 1 - offset, 1, 1, color, lm);
    }
}

function buildTorch(ctx: BuildCtx, wx: number, wy: number, wz: number, param2: number, color: THREE.Color): void {
    const lm = 1.0;
    const s = 0.1;
    let ox = 0.5;
    let oz = 0.5;

    if (param2 === 2) ox = 0.8;
    else if (param2 === 3) ox = 0.2;
    else if (param2 === 4) oz = 0.8;
    else if (param2 === 5) oz = 0.2;

    const y0 = 0.1;
    const y1 = 0.7;

    pushQuad(ctx, wx, wy, wz,
        [ox - s, y0, oz - s], [ox + s, y0, oz + s],
        [ox + s, y1, oz + s], [ox - s, y1, oz - s],
        [0, 0, 1], color, lm, 1.0);
    pushQuad(ctx, wx, wy, wz,
        [ox - s, y0, oz + s], [ox + s, y0, oz - s],
        [ox + s, y1, oz - s], [ox - s, y1, oz + s],
        [0, 0, -1], color, lm, 1.0);
    pushQuad(ctx, wx, wy, wz,
        [ox - s, y0, oz - s], [ox - s, y0, oz + s],
        [ox - s, y1, oz + s], [ox - s, y1, oz - s],
        [-1, 0, 0], color, lm, 1.0);
    pushQuad(ctx, wx, wy, wz,
        [ox + s, y0, oz + s], [ox + s, y0, oz - s],
        [ox + s, y1, oz - s], [ox + s, y1, oz + s],
        [1, 0, 0], color, lm, 1.0);
}

function buildPlantlike(ctx: BuildCtx, wx: number, wy: number, wz: number, color: THREE.Color): void {
    const lm = getBlockLight(ctx, wx, wy, wz);

    pushQuad(ctx, wx, wy, wz,
        [0.15, 0, 0.15], [0.85, 0, 0.85],
        [0.85, 1, 0.85], [0.15, 1, 0.15],
        [0, 0, 1], color, lm, 1.0);
    pushQuad(ctx, wx, wy, wz,
        [0.85, 0, 0.85], [0.15, 0, 0.15],
        [0.15, 1, 0.15], [0.85, 1, 0.85],
        [0, 0, -1], color, lm, 1.0);
    pushQuad(ctx, wx, wy, wz,
        [0.85, 0, 0.15], [0.15, 0, 0.85],
        [0.15, 1, 0.85], [0.85, 1, 0.15],
        [0, 0, 1], color, lm, 1.0);
    pushQuad(ctx, wx, wy, wz,
        [0.15, 0, 0.85], [0.85, 0, 0.15],
        [0.85, 1, 0.15], [0.15, 1, 0.85],
        [0, 0, -1], color, lm, 1.0);
}

function buildFirelike(ctx: BuildCtx, wx: number, wy: number, wz: number, color: THREE.Color): void {
    const lm = 1.0;

    pushQuad(ctx, wx, wy, wz,
        [0.15, 0, 0.15], [0.85, 0, 0.85],
        [0.85, 0.5, 0.85], [0.15, 0.5, 0.15],
        [0, 0, 1], color, lm, 1.0);
    pushQuad(ctx, wx, wy, wz,
        [0.85, 0, 0.15], [0.15, 0, 0.85],
        [0.15, 0.5, 0.85], [0.85, 0.5, 0.15],
        [0, 0, 1], color, lm, 1.0);
}

export class ChunkMesh {
    public mesh: THREE.Mesh | null = null;
    public transparentMesh: THREE.Mesh | null = null;
    public chunkX: number;
    public chunkY: number;
    public chunkZ: number;
    public blocks: Uint8Array;
    public isVegetation: boolean = false;
    public isWater: boolean = false;
    public isLava: boolean = false;

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

    getLight(localX: number, localY: number, localZ: number): number {
        const index = (localX * CHUNK_SIZE * CHUNK_SIZE + localY * CHUNK_SIZE + localZ) * BYTES_PER_BLOCK;
        return this.blocks[index + 3];
    }

    getParam2(localX: number, localY: number, localZ: number): number {
        const index = (localX * CHUNK_SIZE * CHUNK_SIZE + localY * CHUNK_SIZE + localZ) * BYTES_PER_BLOCK;
        return this.blocks[index + 2];
    }

    buildMesh(
        blockRegistry: any,
        getNeighborBlock: (wx: number, wy: number, wz: number) => number,
        textureAtlas: TextureAtlas | null = null,
        getNeighborLight: (wx: number, wy: number, wz: number) => number = () => 15,
        aoEnabled: boolean = true
    ): void {
        const hasAtlas = textureAtlas !== null;
        this.isVegetation = false;
        this.isWater = false;
        this.isLava = false;

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

        const solidTopVertexIndices: number[] = [];
        const transTopVertexIndices: number[] = [];
        const waterTopVertexIndices: number[] = [];
        const lavaTopVertexIndices: number[] = [];
        let hasVegetationBlocks = false;
        let hasWaterBlocks = false;
        let hasLavaBlocks = false;

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

                    const drawType: string = blockRegistry.getDrawType
                        ? blockRegistry.getDrawType(blockId)
                        : 'normal';
                    if (drawType !== 'normal') continue;

                    const isTransparent = blockDef.transparent === true;
                    const isLiquid = blockDef.liquid === true;
                    const isLightSourceBlock = blockRegistry.isLightSource(blockId);

                    const blockName = blockDef.name || '';
                    const isVegetationBlock = blockName.includes('leaves') || blockName.includes('pine_needles') || blockName === 'default:sugar_cane';
                    if (isVegetationBlock) {
                        hasVegetationBlocks = true;
                        this.isVegetation = true;
                    }

                    const isWaterBlock = blockName.includes('water');
                    const isLavaBlock = blockName.includes('lava');
                    if (isWaterBlock) hasWaterBlocks = true;
                    if (isLavaBlock) hasLavaBlocks = true;

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
                        if (isLavaBlock) {
                            faceColor = faceColor.clone().multiplyScalar(1.5);
                            faceColor.r = Math.min(faceColor.r, 1.0);
                            faceColor.g = Math.min(faceColor.g, 1.0);
                            faceColor.b = Math.min(faceColor.b, 1.0);
                        }

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

                                ao = aoEnabled ? computeAO(side1, side2, cornerSolid) / 3.0 : 1.0;
                            }

                            let lightMult: number;
                            if (isLightSourceBlock) {
                                lightMult = 1.0;
                            } else {
                                const vx = worldX + corner[0];
                                const vy = worldY + corner[1];
                                const vz = worldZ + corner[2];
                                const fnx = face.dir[0];
                                const fny = face.dir[1];
                                const fnz = face.dir[2];
                                let lightSum = 0;
                                for (const [a, b] of LIGHT_OFFSETS) {
                                    let bx: number;
                                    let by: number;
                                    let bz: number;
                                    if (fnx !== 0) {
                                        bx = fnx > 0 ? vx : vx - 1;
                                        by = vy + a;
                                        bz = vz + b;
                                    } else if (fny !== 0) {
                                        bx = vx + a;
                                        by = fny > 0 ? vy : vy - 1;
                                        bz = vz + b;
                                    } else {
                                        bx = vx + a;
                                        by = vy + b;
                                        bz = fnz > 0 ? vz : vz - 1;
                                    }
                                    lightSum += getNeighborLight(bx, by, bz);
                                }
                                lightMult = Math.max((lightSum / 4) / 15.0, 0.1);
                            }

                            const cr = useWhiteColor ? ao * lightMult : faceColor.r * ao * lightMult;
                            const cg = useWhiteColor ? ao * lightMult : faceColor.g * ao * lightMult;
                            const cb = useWhiteColor ? ao * lightMult : faceColor.b * ao * lightMult;

                            let posY = worldY + corner[1];
                            if (isWaterBlock && face.dir[1] === 1) {
                                posY -= 0.1;
                            }
                            positions.push(
                                worldX + corner[0],
                                posY,
                                worldZ + corner[2]
                            );
                            normals.push(face.normal[0], face.normal[1], face.normal[2]);
                            colors.push(cr, cg, cb);
                            if (hasAtlas && blockUV !== null) {
                                uvs.push(cornerUVs[ci][0], cornerUVs[ci][1]);
                            }

                            if (isVegetationBlock && face.dir[1] === 1) {
                                const topIndices = isTransparent ? transTopVertexIndices : solidTopVertexIndices;
                                const vc = isTransparent ? transVertexCount : solidVertexCount;
                                topIndices.push(vc + ci);
                            }
                            if (isWaterBlock && face.dir[1] === 1 && isTransparent) {
                                waterTopVertexIndices.push(transVertexCount + ci);
                            }
                            if (isLavaBlock && face.dir[1] === 1 && isTransparent) {
                                lavaTopVertexIndices.push(transVertexCount + ci);
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

        const solidVC = { count: solidVertexCount };
        const transVC = { count: transVertexCount };

        for (let x = 0; x < CHUNK_SIZE; x++) {
            for (let y = 0; y < CHUNK_SIZE; y++) {
                for (let z = 0; z < CHUNK_SIZE; z++) {
                    const blockId = this.getBlock(x, y, z);
                    if (blockId === 0) continue;

                    const blockDef = blockRegistry.get(blockId);
                    if (!blockDef) continue;

                    const drawType: string = blockRegistry.getDrawType
                        ? blockRegistry.getDrawType(blockId)
                        : 'normal';
                    if (drawType === 'normal') continue;

                    const worldX = this.chunkX * CHUNK_SIZE + x;
                    const worldY = this.chunkY * CHUNK_SIZE + y;
                    const worldZ = this.chunkZ * CHUNK_SIZE + z;
                    const param2 = this.getParam2(x, y, z);
                    const color = new THREE.Color(blockDef.color);
                    const isLight = blockRegistry.isLightSource(blockId);
                    const isTransparent = blockDef.transparent === true;

                    const positions = isTransparent ? transPositions : solidPositions;
                    const normals = isTransparent ? transNormals : solidNormals;
                    const colors = isTransparent ? transColors : solidColors;
                    const uvs = isTransparent ? transUVs : solidUVs;
                    const indices = isTransparent ? transIndices : solidIndices;
                    const vc = isTransparent ? transVC : solidVC;

                    let blockUV: [number, number, number, number] | null = null;
                    let useWhite = false;
                    if (hasAtlas) {
                        blockUV = textureAtlas!.getUV(blockId);
                        useWhite = textureAtlas!.hasTexture(blockId);
                    }

                    const ctx: BuildCtx = {
                        positions, normals, colors, uvs, indices, vc,
                        blockUV, useWhite, isLight,
                        getNeighborBlock, getNeighborLight
                    };

                    switch (drawType) {
                        case 'stair':
                            buildStair(ctx, worldX, worldY, worldZ, param2, color);
                            break;
                        case 'slab':
                            buildSlab(ctx, worldX, worldY, worldZ, param2, color);
                            break;
                        case 'fence':
                            buildFence(ctx, worldX, worldY, worldZ, blockId, color);
                            break;
                        case 'wall':
                            buildWall(ctx, worldX, worldY, worldZ, blockId, color);
                            break;
                        case 'glass_pane':
                            buildGlassPane(ctx, worldX, worldY, worldZ, blockId, color);
                            break;
                        case 'door':
                            buildDoor(ctx, worldX, worldY, worldZ, param2, color);
                            break;
                        case 'ladder':
                            buildLadder(ctx, worldX, worldY, worldZ, param2, color);
                            break;
                        case 'torch':
                            buildTorch(ctx, worldX, worldY, worldZ, param2, color);
                            break;
                        case 'plantlike':
                            buildPlantlike(ctx, worldX, worldY, worldZ, color);
                            break;
                        case 'firelike':
                            buildFirelike(ctx, worldX, worldY, worldZ, color);
                            break;
                    }
                }
            }
        }

        solidVertexCount = solidVC.count;
        transVertexCount = transVC.count;

        const atlasTexture = hasAtlas ? textureAtlas!.texture : null;
        this.mesh = this.buildGeometry(solidPositions, solidNormals, solidColors, solidUVs, solidIndices, solidVertexCount, false, atlasTexture);
        this.transparentMesh = this.buildGeometry(transPositions, transNormals, transColors, transUVs, transIndices, transVertexCount, true, atlasTexture);

        if (hasVegetationBlocks) {
            this.isVegetation = true;
            if (this.mesh && solidTopVertexIndices.length > 0) {
                this.mesh.userData.isVegetation = true;
                this.mesh.userData.topVertexIndices = solidTopVertexIndices;
                this.mesh.userData.topBasePositions = new Float32Array(solidPositions);
            }
            if (this.transparentMesh && transTopVertexIndices.length > 0) {
                this.transparentMesh.userData.isVegetation = true;
                this.transparentMesh.userData.topVertexIndices = transTopVertexIndices;
                this.transparentMesh.userData.topBasePositions = new Float32Array(transPositions);
            }
        }

        if (hasWaterBlocks) {
            this.isWater = true;
            if (this.transparentMesh && waterTopVertexIndices.length > 0) {
                this.transparentMesh.userData.isWater = true;
                this.transparentMesh.userData.waterVertices = waterTopVertexIndices;
                this.transparentMesh.userData.waterBasePositions = new Float32Array(transPositions);
            }
        }
        if (hasLavaBlocks) {
            this.isLava = true;
            if (this.transparentMesh && lavaTopVertexIndices.length > 0) {
                this.transparentMesh.userData.isLava = true;
                this.transparentMesh.userData.lavaVertices = lavaTopVertexIndices;
                this.transparentMesh.userData.lavaBasePositions = new Float32Array(transPositions);
            }
        }
    }

    static updateAnimations(_time: number, _dt: number): void {
    }

    animateVegetation(time: number): void {
        if (!this.isVegetation) return;

        const targets: THREE.Mesh[] = [];
        if (this.mesh) targets.push(this.mesh);
        if (this.transparentMesh) targets.push(this.transparentMesh);

        const amplitude = 0.05;
        for (const mesh of targets) {
            if (!mesh.userData.isVegetation) continue;

            const posAttr = mesh.geometry.getAttribute('position') as THREE.BufferAttribute;
            if (!posAttr) continue;

            const indices: number[] = mesh.userData.topVertexIndices;
            const basePositions: Float32Array = mesh.userData.topBasePositions;
            if (!indices || !basePositions) continue;

            for (let i = 0; i < indices.length; i++) {
                const idx = indices[i];
                if (idx * 3 + 1 >= posAttr.array.length) continue;
                if (idx * 3 + 1 >= basePositions.length) continue;
                const baseY = basePositions[idx * 3 + 1];
                const wx = basePositions[idx * 3];
                posAttr.array[idx * 3 + 1] = baseY + Math.sin(time * 1.5 + wx * 0.5) * amplitude;
            }
            posAttr.needsUpdate = true;
        }
    }

    animateWater(time: number): void {
        if (!this.transparentMesh) return;
        const mesh = this.transparentMesh;
        if (!mesh.userData.isWater) return;

        const posAttr = mesh.geometry.getAttribute('position') as THREE.BufferAttribute;
        if (!posAttr) return;

        const indices: number[] = mesh.userData.waterVertices;
        const basePositions: Float32Array = mesh.userData.waterBasePositions;
        if (!indices || !basePositions) return;

        const amplitude = 0.04;
        for (let i = 0; i < indices.length; i++) {
            const idx = indices[i];
            if (idx * 3 + 1 >= posAttr.array.length) continue;
            if (idx * 3 + 1 >= basePositions.length) continue;
            const baseY = basePositions[idx * 3 + 1];
            const wx = basePositions[idx * 3];
            const wz = basePositions[idx * 3 + 2];
            posAttr.array[idx * 3 + 1] = baseY + Math.sin(time * 1.5 + wx * 0.5 + wz * 0.3) * amplitude;
        }
        posAttr.needsUpdate = true;
    }

    animateLava(time: number): void {
        if (!this.transparentMesh) return;
        const mesh = this.transparentMesh;
        if (!mesh.userData.isLava) return;

        const posAttr = mesh.geometry.getAttribute('position') as THREE.BufferAttribute;
        if (!posAttr) return;

        const indices: number[] = mesh.userData.lavaVertices;
        const basePositions: Float32Array = mesh.userData.lavaBasePositions;
        if (!indices || !basePositions) return;

        const amplitude = 0.02;
        for (let i = 0; i < indices.length; i++) {
            const idx = indices[i];
            if (idx * 3 + 1 >= posAttr.array.length) continue;
            if (idx * 3 + 1 >= basePositions.length) continue;
            const baseY = basePositions[idx * 3 + 1];
            const wx = basePositions[idx * 3];
            posAttr.array[idx * 3 + 1] = baseY + Math.sin(time * 2.0 + wx * 0.8) * amplitude;
        }
        posAttr.needsUpdate = true;
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
            opacity: transparent ? 0.45 : 1.0,
            side: transparent ? THREE.DoubleSide : THREE.FrontSide,
            depthWrite: !transparent
        });

        return new THREE.Mesh(geometry, material);
    }

}
