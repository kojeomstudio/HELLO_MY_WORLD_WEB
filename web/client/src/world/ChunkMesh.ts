import * as THREE from 'three';

const CHUNK_SIZE = 16;
const BYTES_PER_BLOCK = 4;
const LIGHT_OFFSETS: [number, number][] = [[-1, -1], [-1, 0], [0, -1], [0, 0]];

let leavesStyle: 'fancy' | 'simple' = 'fancy';
let translucentLiquids: boolean = true;

const WOOL_COLORS: string[] = [
    '#FFFFFF', '#DB7D2E', '#B02E26', '#A4662D',
    '#243B53', '#6E8CBB', '#B1746A', '#575C5E',
    '#3E2912', '#3FAA73', '#8C7A42', '#9E6B38',
    '#3B49AF', '#7533B4', '#C76018', '#696969',
    '#C0C0C0', '#F0A030', '#E84040', '#D08850',
    '#5080C0', '#90B0E0', '#D09898', '#A0A0A0',
    '#6B4C2A', '#60D090', '#C0B060', '#C09060',
    '#6070D0', '#9050C0', '#E07030', '#909090'
];

function applyParam2Color(color: THREE.Color, blockDef: any, param2: number): THREE.Color {
    if (!blockDef.paramType2 || !blockDef.paramType2.includes('color')) return color;
    if (blockDef.palette === 'wool' || blockDef.palette === 'dye') {
        const idx = param2 & 0x0F;
        if (idx < WOOL_COLORS.length) {
            return new THREE.Color(WOOL_COLORS[idx]);
        }
    }
    if (blockDef.paramType2 === 'color' || blockDef.paramType2 === 'colored') {
        const r = ((param2 >> 5) & 0x07) / 7;
        const g = ((param2 >> 2) & 0x07) / 7;
        const b = (param2 & 0x03) / 3;
        return new THREE.Color(r, g, b);
    }
    if (blockDef.paramType2 === 'colorwallmounted' || blockDef.paramType2 === 'colorfacedir') {
        const paletteIdx = param2 >> 4;
        if (paletteIdx < WOOL_COLORS.length) {
            return new THREE.Color(WOOL_COLORS[paletteIdx]);
        }
    }
    return color;
}

export function setLeavesStyle(style: 'fancy' | 'simple'): void {
    leavesStyle = style;
}

export function setTranslucentLiquids(enabled: boolean): void {
    translucentLiquids = enabled;
}

let _blockRegistryCache: ((id: number) => any) | null = null;

function blockIdToDef(blockId: number): any {
    return _blockRegistryCache?.(blockId);
}

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

function getSmoothLight(ctx: BuildCtx, wx: number, wy: number, wz: number, face: string): number {
    if (ctx.isLight) return 1.0;

    let offsets: [number, number, number][];
    switch (face) {
        case 'top':
            offsets = [[-1, 1, -1], [0, 1, -1], [-1, 1, 0], [0, 1, 0]];
            break;
        case 'bottom':
            offsets = [[-1, -1, -1], [0, -1, -1], [-1, -1, 0], [0, -1, 0]];
            break;
        case 'north':
            offsets = [[-1, -1, -1], [0, -1, -1], [-1, 0, -1], [0, 0, -1]];
            break;
        case 'south':
            offsets = [[-1, -1, 0], [0, -1, 0], [-1, 0, 0], [0, 0, 0]];
            break;
        case 'east':
            offsets = [[0, -1, -1], [0, -1, 0], [0, 0, -1], [0, 0, 0]];
            break;
        case 'west':
            offsets = [[-1, -1, -1], [-1, -1, 0], [-1, 0, -1], [-1, 0, 0]];
            break;
        default:
            return getBlockLight(ctx, wx, wy, wz);
    }

    let total = 0;
    for (const [dx, dy, dz] of offsets) {
        total += ctx.getNeighborLight(wx + dx, wy + dy, wz + dz);
    }
    return Math.max(total / (offsets.length * 15.0), 0.1);
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
    const topLight = Math.max(lightMult, getSmoothLight(ctx, wx, wy, wz, 'top'));
    const bottomLight = Math.max(lightMult, getSmoothLight(ctx, wx, wy, wz, 'bottom'));
    const northLight = Math.max(lightMult, getSmoothLight(ctx, wx, wy, wz, 'north'));
    const southLight = Math.max(lightMult, getSmoothLight(ctx, wx, wy, wz, 'south'));
    const eastLight = Math.max(lightMult, getSmoothLight(ctx, wx, wy, wz, 'east'));
    const westLight = Math.max(lightMult, getSmoothLight(ctx, wx, wy, wz, 'west'));

    pushQuad(ctx, wx, wy, wz, [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1], [0, 1, 0], color, topLight, 1.1);
    pushQuad(ctx, wx, wy, wz, [x0, y0, z1], [x1, y0, z1], [x1, y0, z0], [x0, y0, z0], [0, -1, 0], color, bottomLight, 0.7);
    pushQuad(ctx, wx, wy, wz, [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [0, 0, -1], color, northLight, 1.0);
    pushQuad(ctx, wx, wy, wz, [x1, y0, z1], [x0, y0, z1], [x0, y1, z1], [x1, y1, z1], [0, 0, 1], color, southLight, 1.0);
    pushQuad(ctx, wx, wy, wz, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1], [1, 0, 0], color, eastLight, 1.0);
    pushQuad(ctx, wx, wy, wz, [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [x0, y0, z0], [-1, 0, 0], color, westLight, 1.0);
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

function isConnectedBlock(blockId: number, neighborId: number): boolean {
    if (neighborId === blockId) return true;
    if (blockId === 0 || neighborId === 0) return false;
    const def = blockIdToDef(blockId);
    const ndef = blockIdToDef(neighborId);
    if (!def || !ndef) return false;
    if (def.connectsTo && def.connectsTo.includes(ndef.name)) return true;
    if (ndef.connectsTo && ndef.connectsTo.includes(def.name)) return true;
    return false;
}

function buildFence(ctx: BuildCtx, wx: number, wy: number, wz: number, blockId: number, color: THREE.Color): void {
    const lm = getBlockLight(ctx, wx, wy, wz);
    const nb = ctx.getNeighborBlock;
    const north = isConnectedBlock(blockId, nb(wx, wy, wz - 1));
    const south = isConnectedBlock(blockId, nb(wx, wy, wz + 1));
    const east = isConnectedBlock(blockId, nb(wx + 1, wy, wz));
    const west = isConnectedBlock(blockId, nb(wx - 1, wy, wz));

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
    const north = isConnectedBlock(blockId, nb(wx, wy, wz - 1));
    const south = isConnectedBlock(blockId, nb(wx, wy, wz + 1));
    const east = isConnectedBlock(blockId, nb(wx + 1, wy, wz));
    const west = isConnectedBlock(blockId, nb(wx - 1, wy, wz));

    pushBox(ctx, wx, wy, wz, 0.375, 0, 0.375, 0.625, 1, 0.625, color, lm);

    if (north) pushBox(ctx, wx, wy, wz, 0.25, 0, 0, 0.75, 1, 0.375, color, lm);
    if (south) pushBox(ctx, wx, wy, wz, 0.25, 0, 0.625, 0.75, 1, 1, color, lm);
    if (east) pushBox(ctx, wx, wy, wz, 0.625, 0, 0.25, 1, 1, 0.75, color, lm);
    if (west) pushBox(ctx, wx, wy, wz, 0, 0, 0.25, 0.375, 1, 0.75, color, lm);
}

function buildGlassPane(ctx: BuildCtx, wx: number, wy: number, wz: number, blockId: number, color: THREE.Color): void {
    const lm = getBlockLight(ctx, wx, wy, wz);
    const nb = ctx.getNeighborBlock;
    const north = isConnectedBlock(blockId, nb(wx, wy, wz - 1));
    const south = isConnectedBlock(blockId, nb(wx, wy, wz + 1));
    const east = isConnectedBlock(blockId, nb(wx + 1, wy, wz));
    const west = isConnectedBlock(blockId, nb(wx - 1, wy, wz));

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

function buildGlasslikeFramed(
    ctx: BuildCtx, wx: number, wy: number, wz: number,
    blockId: number, color: THREE.Color, frameColor: THREE.Color
): void {
    const faces = [
        { dir: [0, 1, 0], corners: [[0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1]], normal: [0, 1, 0] },
        { dir: [0, -1, 0], corners: [[0, 0, 1], [1, 0, 1], [1, 0, 0], [0, 0, 0]], normal: [0, -1, 0] },
        { dir: [1, 0, 0], corners: [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]], normal: [1, 0, 0] },
        { dir: [-1, 0, 0], corners: [[0, 0, 1], [0, 1, 1], [0, 1, 0], [0, 0, 0]], normal: [-1, 0, 0] },
        { dir: [0, 0, 1], corners: [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]], normal: [0, 0, 1] },
        { dir: [0, 0, -1], corners: [[1, 0, 0], [0, 0, 0], [0, 1, 0], [1, 1, 0]], normal: [0, 0, -1] },
    ];

    const frameW = 0.0625;

    for (const face of faces) {
        const nx = wx + face.dir[0];
        const ny = wy + face.dir[1];
        const nz = wz + face.dir[2];
        const neighborId = ctx.getNeighborBlock(nx, ny, nz);

        if (neighborId === blockId) continue;

        const lm = getBlockLight(ctx, wx, wy, wz);

        const c = face.corners;
        const n = face.normal;

        const topFrame = [
            [c[0][0], c[0][1], c[0][2]],
            [c[1][0], c[1][1], c[1][2]],
            [c[2][0], c[2][1], c[2][2]],
            [c[3][0], c[3][1], c[3][2]]
        ];
        pushQuad(ctx, wx, wy, wz, topFrame[0], topFrame[1], topFrame[2], topFrame[3], n, frameColor, lm, 1.0);

        const innerCorners = c.map(corner => {
            return corner.map((v, i) => {
                if (n[i] !== 0) return v;
                return v < 0.5 ? v + frameW : v - frameW;
            });
        });

        pushQuad(ctx, wx, wy, wz,
            innerCorners[0], innerCorners[1], innerCorners[2], innerCorners[3],
            n, color, lm, 0.85);
    }
}

function buildSignlike(ctx: BuildCtx, wx: number, wy: number, wz: number, param2: number, color: THREE.Color): void {
    const lm = getBlockLight(ctx, wx, wy, wz);
    const thickness = 0.0625;

    let nx = 0, nz = -1;
    switch (param2 % 4) {
        case 0: nx = 0; nz = -1; break;
        case 1: nx = 1; nz = 0; break;
        case 2: nx = 0; nz = 1; break;
        case 3: nx = -1; nz = 0; break;
    }

    const x0 = nx > 0 ? 1 - thickness : 0;
    const x1 = nx > 0 ? 1 : thickness;
    const z0 = nz > 0 ? 1 - thickness : 0;
    const z1 = nz > 0 ? 1 : thickness;

    if (nx !== 0) {
        pushQuad(ctx, wx, wy, wz,
            [x0, 0, 0.15], [x0, 1, 0.15],
            [x0, 1, 0.85], [x0, 0, 0.85],
            [nx, 0, 0], color, lm, 1.0);
        pushQuad(ctx, wx, wy, wz,
            [x1, 0, 0.85], [x1, 1, 0.85],
            [x1, 1, 0.15], [x1, 0, 0.15],
            [-nx, 0, 0], color, lm, 0.8);
    } else {
        pushQuad(ctx, wx, wy, wz,
            [0.15, 0, z0], [0.85, 0, z0],
            [0.85, 1, z0], [0.15, 1, z0],
            [0, 0, nz], color, lm, 1.0);
        pushQuad(ctx, wx, wy, wz,
            [0.85, 0, z1], [0.15, 0, z1],
            [0.15, 1, z1], [0.85, 1, z1],
            [0, 0, -nz], color, lm, 0.8);
    }
}

function buildRaillike(ctx: BuildCtx, wx: number, wy: number, wz: number, blockId: number, color: THREE.Color): void {
    const lm = getBlockLight(ctx, wx, wy, wz);
    const nb = ctx.getNeighborBlock;
    const north = nb(wx, wy, wz - 1) === blockId;
    const south = nb(wx, wy, wz + 1) === blockId;
    const east = nb(wx + 1, wy, wz) === blockId;
    const west = nb(wx - 1, wy, wz) === blockId;

    const railY = 0.0;
    const railH = 0.125;
    const railW = 0.125;

    pushBox(ctx, wx, wy, wz, 0.5 - railW, railY, 0.5 - railW, 0.5 + railW, railY + railH, 0.5 + railW, color, lm);

    if (north || south) {
        const z0 = north ? 0 : 0.5 - railW;
        const z1 = south ? 1 : 0.5 + railW;
        pushBox(ctx, wx, wy, wz, 0.5 - railW, railY, z0, 0.5 + railW, railY + railH, z1, color, lm);
    }
    if (east || west) {
        const x0 = west ? 0 : 0.5 - railW;
        const x1 = east ? 1 : 0.5 + railW;
        pushBox(ctx, wx, wy, wz, x0, railY, 0.5 - railW, x1, railY + railH, 0.5 + railW, color, lm);
    }
}

function buildGlasslike(
    ctx: BuildCtx, wx: number, wy: number, wz: number,
    blockId: number, color: THREE.Color
): void {
    const faces = [
        { dir: [0, 1, 0], corners: [[0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1]], normal: [0, 1, 0] },
        { dir: [0, -1, 0], corners: [[0, 0, 1], [1, 0, 1], [1, 0, 0], [0, 0, 0]], normal: [0, -1, 0] },
        { dir: [1, 0, 0], corners: [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]], normal: [1, 0, 0] },
        { dir: [-1, 0, 0], corners: [[0, 0, 1], [0, 1, 1], [0, 1, 0], [0, 0, 0]], normal: [-1, 0, 0] },
        { dir: [0, 0, 1], corners: [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]], normal: [0, 0, 1] },
        { dir: [0, 0, -1], corners: [[1, 0, 0], [0, 0, 0], [0, 1, 0], [1, 1, 0]], normal: [0, 0, -1] },
    ];

    for (const face of faces) {
        const nx = wx + face.dir[0];
        const ny = wy + face.dir[1];
        const nz = wz + face.dir[2];
        const neighborId = ctx.getNeighborBlock(nx, ny, nz);

        if (neighborId === blockId) continue;

        const lm = getBlockLight(ctx, wx, wy, wz);
        pushQuad(ctx, wx, wy, wz,
            face.corners[0], face.corners[1], face.corners[2], face.corners[3],
            face.normal, color, lm, 1.0);
    }
}

function buildLeveled(ctx: BuildCtx, wx: number, wy: number, wz: number, param2: number, color: THREE.Color): void {
    const lm = getBlockLight(ctx, wx, wy, wz);
    const height = Math.max(0.0625, Math.min(1.0, param2 / 8.0));

    pushQuad(ctx, wx, wy, wz,
        [0, height, 0], [1, height, 0],
        [1, height, 1], [0, height, 1],
        [0, 1, 0], color, lm, 1.1);
    pushQuad(ctx, wx, wy, wz,
        [0, 0, 1], [1, 0, 1],
        [1, 0, 0], [0, 0, 0],
        [0, -1, 0], color, lm, 0.7);

    const aboveId = ctx.getNeighborBlock(wx, wy + 1, wz);
    if (aboveId === 0) {
        pushQuad(ctx, wx, wy, wz,
            [0, height, 0], [1, height, 0],
            [1, height, 1], [0, height, 1],
            [0, 1, 0], color, lm, 1.1);
    }

    const nb = ctx.getNeighborBlock;
    const front = nb(wx, wy, wz - 1);
    const back = nb(wx, wy, wz + 1);
    const left = nb(wx - 1, wy, wz);
    const right = nb(wx + 1, wy, wz);

    if (front === 0 || front !== ctx.getNeighborBlock(wx, wy, wz)) {
        pushQuad(ctx, wx, wy, wz,
            [1, 0, 0], [0, 0, 0],
            [0, height, 0], [1, height, 0],
            [0, 0, -1], color, lm, 0.9);
    }
    if (back === 0 || back !== ctx.getNeighborBlock(wx, wy, wz)) {
        pushQuad(ctx, wx, wy, wz,
            [0, 0, 1], [1, 0, 1],
            [1, height, 1], [0, height, 1],
            [0, 0, 1], color, lm, 0.9);
    }
    if (left === 0 || left !== ctx.getNeighborBlock(wx, wy, wz)) {
        pushQuad(ctx, wx, wy, wz,
            [0, 0, 0], [0, 0, 1],
            [0, height, 1], [0, height, 0],
            [-1, 0, 0], color, lm, 0.95);
    }
    if (right === 0 || right !== ctx.getNeighborBlock(wx, wy, wz)) {
        pushQuad(ctx, wx, wy, wz,
            [1, 0, 1], [1, 0, 0],
            [1, height, 0], [1, height, 1],
            [1, 0, 0], color, lm, 0.95);
    }
}

function buildAllfaces(ctx: BuildCtx, wx: number, wy: number, wz: number, color: THREE.Color): void {
    const lm = getBlockLight(ctx, wx, wy, wz);
    pushBox(ctx, wx, wy, wz, 0, 0, 0, 1, 1, 1, color, lm);
}

function buildTorchlike(ctx: BuildCtx, wx: number, wy: number, wz: number, param2: number, color: THREE.Color): void {
    buildTorch(ctx, wx, wy, wz, param2, color);
}

function buildPlantlikeRooted(ctx: BuildCtx, wx: number, wy: number, wz: number, color: THREE.Color): void {
    const lm = getBlockLight(ctx, wx, wy, wz);
    pushBox(ctx, wx, wy, wz, 0.3, 0, 0.3, 0.7, 0.3, 0.7, color, lm);
    pushQuad(ctx, wx, wy, wz,
        [0.15, 0.3, 0.15], [0.85, 0.3, 0.85],
        [0.85, 1, 0.85], [0.15, 1, 0.15],
        [0, 0, 1], color, lm, 1.0);
    pushQuad(ctx, wx, wy, wz,
        [0.85, 0.3, 0.85], [0.15, 0.3, 0.15],
        [0.15, 1, 0.15], [0.85, 1, 0.85],
        [0, 0, -1], color, lm, 1.0);
    pushQuad(ctx, wx, wy, wz,
        [0.85, 0.3, 0.15], [0.15, 0.3, 0.85],
        [0.15, 1, 0.85], [0.85, 1, 0.15],
        [0, 0, 1], color, lm, 1.0);
    pushQuad(ctx, wx, wy, wz,
        [0.15, 0.3, 0.85], [0.85, 0.3, 0.15],
        [0.85, 1, 0.15], [0.15, 1, 0.85],
        [0, 0, -1], color, lm, 1.0);
}

function buildGlasslikeFramedOptional(
    ctx: BuildCtx, wx: number, wy: number, wz: number,
    blockId: number, color: THREE.Color
): void {
    buildGlasslikeFramed(ctx, wx, wy, wz, blockId, color, new THREE.Color('#8B8B8B'));
}

function buildNodebox(ctx: BuildCtx, wx: number, wy: number, wz: number, blockDef: any, color: THREE.Color): void {
    const boxes = blockDef.nodeBoxes;
    if (!boxes || !Array.isArray(boxes) || boxes.length === 0) {
        const lm = getBlockLight(ctx, wx, wy, wz);
        pushBox(ctx, wx, wy, wz, 0, 0, 0, 1, 1, 1, color, lm);
        return;
    }
    for (const box of boxes) {
        const lm = getBlockLight(ctx, wx, wy, wz);
        pushBox(ctx, wx, wy, wz, box.x1, box.y1, box.z1, box.x2, box.y2, box.z2, color, lm);
    }
}

function buildFlowingLiquid(ctx: BuildCtx, wx: number, wy: number, wz: number, param2: number, color: THREE.Color): void {
    const lm = getBlockLight(ctx, wx, wy, wz);
    const level = 8 - (param2 & 0x07);
    const height = level >= 8 ? 1.0 : level / 8.0;
    const correctedHeight = Math.max(0.1, height);

    pushQuad(ctx, wx, wy, wz,
        [0, correctedHeight, 0], [1, correctedHeight, 0],
        [1, correctedHeight, 1], [0, correctedHeight, 1],
        [0, 1, 0], color, lm, 1.1);

    const aboveId = ctx.getNeighborBlock(wx, wy + 1, wz);
    if (aboveId === 0 || (blockIdToDef(aboveId)?.liquid !== true)) {
        pushQuad(ctx, wx, wy, wz,
            [1, 0, 0], [0, 0, 0],
            [0, correctedHeight, 0], [1, correctedHeight, 0],
            [0, 0, -1], color, lm, 0.9);
        pushQuad(ctx, wx, wy, wz,
            [0, 0, 1], [1, 0, 1],
            [1, correctedHeight, 1], [0, correctedHeight, 1],
            [0, 0, 1], color, lm, 0.9);
        pushQuad(ctx, wx, wy, wz,
            [0, 0, 0], [0, 0, 1],
            [0, correctedHeight, 1], [0, correctedHeight, 0],
            [-1, 0, 0], color, lm, 0.95);
        pushQuad(ctx, wx, wy, wz,
            [1, 0, 1], [1, 0, 0],
            [1, correctedHeight, 0], [1, correctedHeight, 1],
            [1, 0, 0], color, lm, 0.95);
    }

    pushQuad(ctx, wx, wy, wz,
        [0, 0, 1], [1, 0, 1],
        [1, 0, 0], [0, 0, 0],
        [0, -1, 0], color, lm, 0.7);
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
    public hasPlantWaving: boolean = false;

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

        const getDef = (id: number) => blockRegistry?.get?.(id);
        _blockRegistryCache = getDef;

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
        this.hasPlantWaving = false;

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
                    if (drawType !== 'normal' && !(drawType === 'allfaces' && leavesStyle === 'simple')) continue;

                    const isTransparent = blockDef.transparent === true && !(blockDef.liquid === true && !translucentLiquids);
                    const isLiquid = blockDef.liquid === true;
                    const isLightSourceBlock = blockRegistry.isLightSource(blockId);

                    const blockName = blockDef.name || '';
                    const wavingType = blockDef.waving ?? 0;
                    const isVegetationBlock = wavingType === 2;
                    if (isVegetationBlock) {
                        hasVegetationBlocks = true;
                        this.isVegetation = true;
                    }

                    const isWaterBlock = wavingType === 3 && blockDef.liquid === true && blockName.includes('water');
                    const isLavaBlock = wavingType === 3 && blockDef.liquid === true && blockName.includes('lava');
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
                    const isFurnaceBlock = blockName === 'furnace' || blockName === 'blast_furnace' || blockName === 'smoker';
                    if (isFurnaceBlock) {
                        const param2 = this.getParam2(x, y, z);
                        if (param2 > 0) {
                            faceColor = faceColor.clone();
                            faceColor.r = Math.min(faceColor.r + 0.4, 1.0);
                            faceColor.g = Math.min(faceColor.g + 0.2, 1.0);
                            faceColor.b = Math.min(faceColor.b * 0.5, 1.0);
                        }
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

        const plantVertexIndices: number[] = [];
        const plantMeshTypes: ('solid' | 'trans')[] = [];
        const plantWorldPositions: [number, number, number][] = [];

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
                    if (drawType === 'normal' || (drawType === 'allfaces' && leavesStyle === 'simple')) continue;

                    const worldX = this.chunkX * CHUNK_SIZE + x;
                    const worldY = this.chunkY * CHUNK_SIZE + y;
                    const worldZ = this.chunkZ * CHUNK_SIZE + z;
                    const param2 = this.getParam2(x, y, z);
                    const baseColor = new THREE.Color(blockDef.color);
                    const color = applyParam2Color(baseColor, blockDef, param2);
                    const isLight = blockRegistry.isLightSource(blockId);
                    const isTransparent = blockDef.transparent === true && !(blockDef.liquid === true && !translucentLiquids);

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

                    const startVC = ctx.vc.count;

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
                            if ((blockDef.waving ?? 0) === 1) {
                                const baseVC = isTransparent ? transVertexCount : solidVertexCount;
                                for (let vi = 0; vi < 8; vi++) {
                                    plantVertexIndices.push(baseVC + vi);
                                    plantMeshTypes.push(isTransparent ? 'trans' : 'solid');
                                    plantWorldPositions.push([worldX, worldY, worldZ]);
                                }
                                this.hasPlantWaving = true;
                            }
                            break;
                        case 'firelike':
                            buildFirelike(ctx, worldX, worldY, worldZ, color);
                            break;
                        case 'glasslike':
                            buildGlasslike(ctx, worldX, worldY, worldZ, blockId, color);
                            break;
                        case 'glasslike_framed':
                            buildGlasslikeFramed(ctx, worldX, worldY, worldZ, blockId, color, new THREE.Color('#8B8B8B'));
                            break;
                        case 'signlike':
                            buildSignlike(ctx, worldX, worldY, worldZ, param2, color);
                            break;
                        case 'raillike':
                            buildRaillike(ctx, worldX, worldY, worldZ, blockId, color);
                            break;
                        case 'leveled':
                            buildLeveled(ctx, worldX, worldY, worldZ, param2, color);
                            break;
                        case 'allfaces':
                            buildAllfaces(ctx, worldX, worldY, worldZ, color);
                            break;
                        case 'torchlike':
                            buildTorchlike(ctx, worldX, worldY, worldZ, param2, color);
                            break;
                        case 'plantlike_rooted':
                            buildPlantlikeRooted(ctx, worldX, worldY, worldZ, color);
                            break;
                        case 'glasslike_framed_optional':
                            buildGlasslikeFramedOptional(ctx, worldX, worldY, worldZ, blockId, color);
                            break;
                        case 'nodebox':
                            buildNodebox(ctx, worldX, worldY, worldZ, blockDef, color);
                            break;
                        case 'flowingliquid':
                            buildFlowingLiquid(ctx, worldX, worldY, worldZ, param2, color);
                            break;
                    }

                    if (blockDef.param2Type === 'degrotate') {
                        const angle = (param2 % 240) * 1.5 * Math.PI / 180;
                        const cosA = Math.cos(angle);
                        const sinA = Math.sin(angle);
                        const endVC = ctx.vc.count;
                        for (let vi = startVC; vi < endVC; vi++) {
                            const idx = vi * 3;
                            const px = ctx.positions[idx] - (worldX + 0.5);
                            const pz = ctx.positions[idx + 2] - (worldZ + 0.5);
                            ctx.positions[idx] = px * cosA - pz * sinA + (worldX + 0.5);
                            ctx.positions[idx + 2] = px * sinA + pz * cosA + (worldZ + 0.5);
                            const nx = ctx.normals[idx];
                            const nz = ctx.normals[idx + 2];
                            ctx.normals[idx] = nx * cosA - nz * sinA;
                            ctx.normals[idx + 2] = nx * sinA + nz * cosA;
                        }
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

        if (this.hasPlantWaving && plantVertexIndices.length > 0) {
            if (this.transparentMesh) {
                this.transparentMesh.userData.isPlantWaving = true;
                this.transparentMesh.userData.plantVertexIndices = plantVertexIndices;
                this.transparentMesh.userData.plantWorldPositions = plantWorldPositions;
                this.transparentMesh.userData.plantBasePositions = new Float32Array(transPositions);
            }
            if (this.mesh) {
                this.mesh.userData.isPlantWaving = true;
                this.mesh.userData.plantVertexIndices = plantVertexIndices;
                this.mesh.userData.plantWorldPositions = plantWorldPositions;
                this.mesh.userData.plantBasePositions = new Float32Array(solidPositions);
            }
        }
    }

    get hasAnimatedBlocks(): boolean {
        return this.isVegetation || this.isWater || this.isLava || this.hasPlantWaving;
    }

    static updateAnimations(chunks: Map<string, ChunkMesh>, time: number): void {
        for (const chunk of chunks.values()) {
            if (!chunk.hasAnimatedBlocks) continue;

            const meshes: THREE.Mesh[] = [];
            if (chunk.mesh) meshes.push(chunk.mesh);
            if (chunk.transparentMesh) meshes.push(chunk.transparentMesh);

            for (const mesh of meshes) {
                const posAttr = mesh.geometry.getAttribute('position') as THREE.BufferAttribute;
                if (!posAttr) continue;

                if (mesh.userData.isVegetation) {
                    const indices: number[] = mesh.userData.topVertexIndices;
                    const basePositions: Float32Array = mesh.userData.topBasePositions;
                    if (!indices || !basePositions) continue;
                    const amplitude = 0.05;
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

                if (mesh.userData.isWater) {
                    const indices: number[] = mesh.userData.waterVertices;
                    const basePositions: Float32Array = mesh.userData.waterBasePositions;
                    if (!indices || !basePositions) continue;
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

                if (mesh.userData.isLava) {
                    const indices: number[] = mesh.userData.lavaVertices;
                    const basePositions: Float32Array = mesh.userData.lavaBasePositions;
                    if (!indices || !basePositions) continue;
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

                if (mesh.userData.isPlantWaving) {
                    const indices: number[] = mesh.userData.plantVertexIndices;
                    const worldPositions: [number, number, number][] = mesh.userData.plantWorldPositions;
                    const basePositions: Float32Array = mesh.userData.plantBasePositions;
                    if (!indices || !basePositions) continue;
                    for (let i = 0; i < indices.length; i++) {
                        const idx = indices[i];
                        if (idx * 3 + 2 >= posAttr.array.length) continue;
                        if (idx * 3 + 2 >= basePositions.length) continue;
                        const baseX = basePositions[idx * 3];
                        const baseY = basePositions[idx * 3 + 1];
                        const baseZ = basePositions[idx * 3 + 2];
                        const wp = worldPositions[i];
                        if (!wp) continue;
                        const heightFactor = (baseY - wp[1]) * 0.7;
                        const swayX = Math.sin(time * 2.0 + wp[0] * 0.7 + wp[2] * 0.3) * 0.04 * heightFactor;
                        const swayZ = Math.cos(time * 1.8 + wp[0] * 0.3 + wp[2] * 0.7) * 0.04 * heightFactor;
                        posAttr.array[idx * 3] = baseX + swayX;
                        posAttr.array[idx * 3 + 1] = baseY + Math.sin(time * 1.5 + wp[0] * 0.5) * 0.015 * heightFactor;
                        posAttr.array[idx * 3 + 2] = baseZ + swayZ;
                    }
                    posAttr.needsUpdate = true;
                }
            }
        }
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

    animatePlants(time: number): void {
        if (!this.hasPlantWaving) return;

        const targets: THREE.Mesh[] = [];
        if (this.mesh) targets.push(this.mesh);
        if (this.transparentMesh) targets.push(this.transparentMesh);

        for (const mesh of targets) {
            if (!mesh.userData.isPlantWaving) continue;
            const posAttr = mesh.geometry.getAttribute('position') as THREE.BufferAttribute;
            if (!posAttr) continue;

            const indices: number[] = mesh.userData.plantVertexIndices;
            const worldPositions: [number, number, number][] = mesh.userData.plantWorldPositions;
            const basePositions: Float32Array = mesh.userData.plantBasePositions;
            if (!indices || !basePositions || !worldPositions) continue;

            for (let i = 0; i < indices.length; i++) {
                const idx = indices[i];
                if (idx * 3 + 2 >= posAttr.array.length) continue;
                if (idx * 3 + 2 >= basePositions.length) continue;
                const baseX = basePositions[idx * 3];
                const baseY = basePositions[idx * 3 + 1];
                const baseZ = basePositions[idx * 3 + 2];
                const wp = worldPositions[i];
                if (!wp) continue;
                const heightFactor = (baseY - wp[1]) * 0.7;
                const swayX = Math.sin(time * 2.0 + wp[0] * 0.7 + wp[2] * 0.3) * 0.04 * heightFactor;
                const swayZ = Math.cos(time * 1.8 + wp[0] * 0.3 + wp[2] * 0.7) * 0.04 * heightFactor;
                posAttr.array[idx * 3] = baseX + swayX;
                posAttr.array[idx * 3 + 1] = baseY + Math.sin(time * 1.5 + wp[0] * 0.5) * 0.015 * heightFactor;
                posAttr.array[idx * 3 + 2] = baseZ + swayZ;
            }
            posAttr.needsUpdate = true;
        }
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

        const mesh = new THREE.Mesh(geometry, material);
        mesh.userData.isChunk = true;
        return mesh;
    }

}
