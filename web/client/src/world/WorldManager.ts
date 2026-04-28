import * as THREE from 'three';
import * as HubConnection from '@microsoft/signalr';
import { Renderer } from '../rendering/Renderer';
import { ChunkMesh, TextureAtlas } from './ChunkMesh';
import { BlockRegistry } from './BlockRegistry';

const ATLAS_COLS = 16;
const TILE_SIZE = 16;

const TEXTURE_NAMES: string[] = [
    'default_stone', 'default_dirt', 'default_grass', 'default_grass_top', 'default_grass_side',
    'default_water', 'default_sand', 'default_tree', 'default_tree_top', 'default_leaves',
    'default_snow', 'default_snow_side', 'default_ice', 'default_lava', 'default_lava_flowing',
    'default_water_flowing', 'default_cobble', 'default_gravel', 'default_mossycobble',
    'default_desert_sand', 'default_desert_stone', 'default_junglegrass',
    'default_jungletree', 'default_jungletree_top', 'default_jungleleaves',
    'default_pine_tree', 'default_pine_tree_top', 'default_pine_needles',
    'default_river_water', 'default_river_water_flowing', 'default_apple',
    'default_planks', 'default_brick', 'default_bookshelf', 'default_glass',
    'default_obsidian', 'default_clay', 'default_sandstone',
    'default_cactus', 'default_pumpkin', 'default_pumpkin_top', 'default_melon', 'default_melon_top',
    'default_sugar_cane', 'default_fence', 'default_ladder', 'default_door_wood',
    'default_chest', 'default_chest_top', 'default_crafting_table_top',
    'default_furnace', 'default_furnace_front', 'default_torch',
    'default_farmland', 'default_hay', 'default_wheat',
    'default_iron_ore', 'default_coal_ore', 'default_gold_ore', 'default_diamond_ore',
    'default_iron_block', 'default_gold_block', 'default_diamond_block',
    'default_stone_brick', 'default_bedrock', 'default_burning_obsidian',
    'default_mycelium_top', 'basenodes_snow_sheet',
    'default_wool_white', 'default_wool_red', 'default_wool_blue', 'default_wool_green',
    'default_wool_orange', 'default_wool_yellow', 'default_wool_cyan', 'default_wool_purple',
    'default_wool_black', 'default_wool_brown', 'default_wool_pink', 'default_wool_lime',
    'default_wool_light_blue', 'default_wool_magenta', 'default_wool_gray', 'default_wool_light_gray'
];

const FALL_GRAVITY = 9.81;

class FallingBlockAnimation {
    mesh: THREE.Mesh;
    fromX: number;
    fromY: number;
    fromZ: number;
    toX: number;
    toY: number;
    toZ: number;
    blockType: number;
    elapsedTime: number = 0;
    startY: number;
    velocityY: number = 0;
    completed: boolean = false;

    constructor(
        fromX: number, fromY: number, fromZ: number,
        toX: number, toY: number, toZ: number,
        blockType: number, color: number
    ) {
        this.fromX = fromX;
        this.fromY = fromY;
        this.fromZ = fromZ;
        this.toX = toX;
        this.toY = toY;
        this.toZ = toZ;
        this.blockType = blockType;
        this.startY = fromY;

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshLambertMaterial({ color });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(fromX + 0.5, fromY + 0.5, fromZ + 0.5);
    }

    update(dt: number): void {
        if (this.completed) return;

        this.elapsedTime += dt;
        this.velocityY -= FALL_GRAVITY * dt;
        const newY = this.mesh.position.y + this.velocityY * dt;

        if (newY <= this.toY + 0.5)
        {
            this.mesh.position.y = this.toY + 0.5;
            this.completed = true;
        }
        else
        {
            this.mesh.position.y = newY;
        }
    }
}

export interface PlayerInfo {
    mesh: THREE.Group;
    label: THREE.Sprite;
    head: THREE.Mesh;
    leftLeg: THREE.Mesh;
    rightLeg: THREE.Mesh;
    leftArm: THREE.Mesh;
    rightArm: THREE.Mesh;
}

export class WorldManager {
    private chunks: Map<string, ChunkMesh> = new Map();
    private renderer: Renderer;
    private blockRegistry: BlockRegistry;
    private playerMeshes: Map<string, PlayerInfo> = new Map();
    private entityMeshes: Map<string, THREE.Mesh> = new Map();
    private pendingChunks: Set<string> = new Set();
    private connection: HubConnection.HubConnection | null = null;
    private textureAtlas: TextureAtlas | null = null;
    private fallingBlocks: FallingBlockAnimation[] = [];
    private animatedChunks: Set<string> = new Set();
    private renderDistance: number = 4;
    private aoEnabled: boolean = true;

    constructor(renderer: Renderer) {
        this.renderer = renderer;
        this.blockRegistry = new BlockRegistry();
        this.loadTextureAtlas();
    }

    setConnection(connection: HubConnection.HubConnection): void {
        this.connection = connection;
    }

    getBlockRegistry(): BlockRegistry { return this.blockRegistry; }

    setRenderDistance(distance: number): void {
        this.renderDistance = distance;
    }

    setAoEnabled(enabled: boolean): void {
        this.aoEnabled = enabled;
        for (const [key] of this.chunks) {
            this.rebuildChunkMesh(key);
        }
    }

    private loadTextureAtlas(): void {
        const loadedImages: Map<string, HTMLImageElement> = new Map();
        const loadPromises = TEXTURE_NAMES.map(name => {
            return new Promise<void>((resolve) => {
                const img = new Image();
                img.onload = () => {
                    loadedImages.set(name, img);
                    resolve();
                };
                img.onerror = () => resolve();
                img.src = `/textures/blocks/${name}.png`;
            });
        });

        Promise.all(loadPromises).then(() => {
            if (loadedImages.size === 0) return;

            const totalTiles = loadedImages.size + 1;
            const atlasRows = Math.ceil(totalTiles / ATLAS_COLS);
            const canvas = document.createElement('canvas');
            canvas.width = ATLAS_COLS * TILE_SIZE;
            canvas.height = atlasRows * TILE_SIZE;
            const ctx = canvas.getContext('2d')!;

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

            const tilePositions: Map<string, { col: number; row: number }> = new Map();
            let index = 1;
            for (const name of TEXTURE_NAMES) {
                const img = loadedImages.get(name);
                if (!img) continue;
                const col = index % ATLAS_COLS;
                const row = Math.floor(index / ATLAS_COLS);
                ctx.drawImage(img, col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                tilePositions.set(name, { col, row });
                index++;
            }

            const canvasTexture = new THREE.CanvasTexture(canvas);
            canvasTexture.magFilter = THREE.NearestFilter;
            canvasTexture.minFilter = THREE.NearestFilter;

            const whiteTileUV: [number, number, number, number] = [
                0, 1 - 1 / atlasRows, 1 / ATLAS_COLS, 1
            ];

            this.textureAtlas = {
                texture: canvasTexture,
                getUV: (blockId: number): [number, number, number, number] => {
                    const blockDef = this.blockRegistry.get(blockId);
                    const textureName = blockDef?.textureName;
                    if (textureName) {
                        const pos = tilePositions.get(textureName);
                        if (pos) {
                            return [
                                pos.col / ATLAS_COLS,
                                1 - (pos.row + 1) / atlasRows,
                                (pos.col + 1) / ATLAS_COLS,
                                1 - pos.row / atlasRows
                            ];
                        }
                    }
                    return whiteTileUV;
                },
                hasTexture: (blockId: number): boolean => {
                    const blockDef = this.blockRegistry.get(blockId);
                    const textureName = blockDef?.textureName;
                    return textureName !== undefined && textureName !== null && tilePositions.has(textureName);
                }
            };

            for (const [key] of this.chunks) {
                this.rebuildChunkMesh(key);
            }
        });
    }

    loadChunk(chunkX: number, chunkY: number, chunkZ: number, data: Uint8Array): void {
        const expectedSize = 16 * 16 * 16 * 4;
        if (data.byteLength < expectedSize) return;

        const key = `${chunkX},${chunkY},${chunkZ}`;

        const existing = this.chunks.get(key);
        if (existing && existing.mesh) {
            this.renderer.removeFromScene(existing.mesh);
        }
        if (existing && existing.transparentMesh) {
            this.renderer.removeFromScene(existing.transparentMesh);
        }

        const chunk = ChunkMesh.fromServerData(chunkX, chunkY, chunkZ, data);
        chunk.buildMesh(this.blockRegistry, (wx, wy, wz) => this.getBlock(wx, wy, wz), this.textureAtlas, (wx, wy, wz) => this.getBlockLight(wx, wy, wz), this.aoEnabled);

        if (chunk.mesh) {
            this.renderer.addToScene(chunk.mesh);
        }
        if (chunk.transparentMesh) {
            this.renderer.addToScene(chunk.transparentMesh);
        }

        this.chunks.set(key, chunk);
        this.pendingChunks.delete(key);

        if (chunk.isWater || chunk.isLava) {
            this.animatedChunks.add(key);
        }

        this.rebuildNeighborChunks(chunkX, chunkY, chunkZ);
    }

    private rebuildNeighborChunks(chunkX: number, chunkY: number, chunkZ: number): void {
        const neighbors = [
            [chunkX - 1, chunkY, chunkZ],
            [chunkX + 1, chunkY, chunkZ],
            [chunkX, chunkY - 1, chunkZ],
            [chunkX, chunkY + 1, chunkZ],
            [chunkX, chunkY, chunkZ - 1],
            [chunkX, chunkY, chunkZ + 1],
        ];

        for (const [nx, ny, nz] of neighbors) {
            const neighborKey = `${nx},${ny},${nz}`;
            if (this.chunks.has(neighborKey)) {
                this.rebuildChunkMesh(neighborKey);
            } else if (this.connection && !this.pendingChunks.has(neighborKey)) {
                this.pendingChunks.add(neighborKey);
                this.connection.invoke('RequestChunk', nx, ny, nz);
            }
        }
    }

    rebuildChunkMesh(key: string): void {
        const chunk = this.chunks.get(key);
        if (!chunk) return;

        if (chunk.mesh) {
            this.renderer.removeFromScene(chunk.mesh);
        }
        if (chunk.transparentMesh) {
            this.renderer.removeFromScene(chunk.transparentMesh);
        }

        chunk.buildMesh(this.blockRegistry, (wx, wy, wz) => this.getBlock(wx, wy, wz), this.textureAtlas, (wx, wy, wz) => this.getBlockLight(wx, wy, wz), this.aoEnabled);

        if (chunk.mesh) {
            this.renderer.addToScene(chunk.mesh);
        }
        if (chunk.transparentMesh) {
            this.renderer.addToScene(chunk.transparentMesh);
        }

        if (chunk.isWater || chunk.isLava) {
            this.animatedChunks.add(key);
        } else {
            this.animatedChunks.delete(key);
        }
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
            chunk.blocks[index] = blockData & 0xFF;
            chunk.blocks[index + 1] = (blockData >> 8) & 0xFF;
            chunk.blocks[index + 2] = (blockData >> 16) & 0xFF;
            chunk.blocks[index + 3] = (blockData >> 24) & 0xFF;

            this.rebuildChunkMesh(key);

            if (localX === 0) this.rebuildChunkMesh(`${chunkX - 1},${chunkY},${chunkZ}`);
            if (localX === 15) this.rebuildChunkMesh(`${chunkX + 1},${chunkY},${chunkZ}`);
            if (localY === 0) this.rebuildChunkMesh(`${chunkX},${chunkY - 1},${chunkZ}`);
            if (localY === 15) this.rebuildChunkMesh(`${chunkX},${chunkY + 1},${chunkZ}`);
            if (localZ === 0) this.rebuildChunkMesh(`${chunkX},${chunkY},${chunkZ - 1}`);
            if (localZ === 15) this.rebuildChunkMesh(`${chunkX},${chunkY},${chunkZ + 1}`);
        }
    }

    requestChunksAroundPlayer(position: THREE.Vector3): string[] {
        const playerChunkX = Math.floor(position.x / 16);
        const playerChunkY = Math.floor(position.y / 16);
        const playerChunkZ = Math.floor(position.z / 16);

        const renderDistance = this.renderDistance;
        const requests: string[] = [];

        for (let dx = -renderDistance; dx <= renderDistance; dx++) {
            for (let dy = -1; dy <= 2; dy++) {
                for (let dz = -renderDistance; dz <= renderDistance; dz++) {
                    if (dx * dx + dz * dz > renderDistance * renderDistance) continue;

                    const key = `${playerChunkX + dx},${playerChunkY + dy},${playerChunkZ + dz}`;
                    if (!this.chunks.has(key) && !this.pendingChunks.has(key)) {
                        this.pendingChunks.add(key);
                        requests.push(key);

                        if (this.connection) {
                            this.connection.invoke('RequestChunk', playerChunkX + dx, playerChunkY + dy, playerChunkZ + dz);
                        }
                    }
                }
            }
        }

        return requests;
    }

    hasChunk(key: string): boolean { return this.chunks.has(key); }

    getChunk(key: string): ChunkMesh | undefined { return this.chunks.get(key); }

    addPlayer(name: string): void {
        if (this.playerMeshes.has(name)) return;

        const group = new THREE.Group();

        const bodyGeo = new THREE.BoxGeometry(0.6, 0.75, 0.3);
        const bodyMat = new THREE.MeshLambertMaterial({ color: 0x2244aa });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.375;
        group.add(body);

        const headGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const headMat = new THREE.MeshLambertMaterial({ color: 0xffcc99 });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = 0.875;
        group.add(head);

        const legGeo = new THREE.BoxGeometry(0.25, 0.75, 0.25);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x112266 });

        const leftLeg = new THREE.Mesh(legGeo, legMat);
        leftLeg.position.set(-0.15, -0.375, 0);
        group.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeo, legMat);
        rightLeg.position.set(0.15, -0.375, 0);
        group.add(rightLeg);

        const armGeo = new THREE.BoxGeometry(0.25, 0.75, 0.25);
        const armMat = new THREE.MeshLambertMaterial({ color: 0xffcc99 });

        const leftArm = new THREE.Mesh(armGeo, armMat);
        leftArm.position.set(-0.425, 0.375, 0);
        group.add(leftArm);

        const rightArm = new THREE.Mesh(armGeo, armMat);
        rightArm.position.set(0.425, 0.375, 0);
        group.add(rightArm);

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

        group.add(label);
        group.position.y = 0.9;
        this.renderer.addToScene(group);

        this.playerMeshes.set(name, { mesh: group, label, head, leftLeg, rightLeg, leftArm, rightArm });
    }

    removePlayer(name: string): void {
        const playerInfo = this.playerMeshes.get(name);
        if (playerInfo) {
            this.renderer.removeFromScene(playerInfo.mesh);
            this.playerMeshes.delete(name);
        }
    }

    updatePlayerPosition(name: string, x: number, y: number, z: number, yaw: number, pitch: number): void {
        if (!this.playerMeshes.has(name)) {
            this.addPlayer(name);
        }

        const playerInfo = this.playerMeshes.get(name)!;
        playerInfo.mesh.position.set(x, y, z);
        playerInfo.mesh.rotation.y = yaw * Math.PI / 180;
        playerInfo.head.rotation.x = pitch * Math.PI / 180;
    }

    private playerAnimTime: number = 0;

    animatePlayer(name: string, isMoving: boolean, dt: number): void {
        const info = this.playerMeshes.get(name);
        if (!info) return;

        if (isMoving) {
            this.playerAnimTime += dt;
            const walkSpeed = 8;
            const swing = Math.sin(this.playerAnimTime * walkSpeed) * 0.5236;
            const legPivotY = -0.375 + 0.375;
            const armPivotY = 0.375 + 0.375;

            info.leftLeg.position.set(-0.15, legPivotY, 0);
            info.leftLeg.rotation.x = swing;
            info.rightLeg.position.set(0.15, legPivotY, 0);
            info.rightLeg.rotation.x = -swing;
            info.leftArm.position.set(-0.425, armPivotY, 0);
            info.leftArm.rotation.x = -swing;
            info.rightArm.position.set(0.425, armPivotY, 0);
            info.rightArm.rotation.x = swing;
        } else {
            info.leftLeg.rotation.x = 0;
            info.rightLeg.rotation.x = 0;
            info.leftArm.rotation.x = 0;
            info.rightArm.rotation.x = 0;
            info.leftLeg.position.set(-0.15, -0.375, 0);
            info.rightLeg.position.set(0.15, -0.375, 0);
            info.leftArm.position.set(-0.425, 0.375, 0);
            info.rightArm.position.set(0.425, 0.375, 0);
        }
    }

    spawnEntity(entityId: string, entityType: string, x: number, y: number, z: number): void {
        if (entityType === 'Item') {
            const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
            const material = new THREE.MeshLambertMaterial({ color: 0xFFAA00 });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, y + 0.15, z);
            mesh.userData.entityId = entityId;
            this.renderer.addToScene(mesh);
            this.entityMeshes.set(entityId, mesh);
            return;
        }

        const group = new THREE.Group();
        group.userData.entityId = entityId;

        switch (entityType) {
            case 'Zombie': {
                const body = new THREE.Mesh(
                    new THREE.BoxGeometry(0.6, 0.75, 0.3),
                    new THREE.MeshLambertMaterial({ color: 0x3B7A3B })
                );
                body.position.y = 0.75;
                group.add(body);
                const head = new THREE.Mesh(
                    new THREE.BoxGeometry(0.5, 0.5, 0.5),
                    new THREE.MeshLambertMaterial({ color: 0x448844 })
                );
                head.position.y = 1.25;
                group.add(head);
                const leftArm = new THREE.Mesh(
                    new THREE.BoxGeometry(0.25, 0.7, 0.25),
                    new THREE.MeshLambertMaterial({ color: 0x3B7A3B })
                );
                leftArm.position.set(-0.425, 0.85, 0);
                leftArm.rotation.x = -0.5;
                group.add(leftArm);
                const rightArm = new THREE.Mesh(
                    new THREE.BoxGeometry(0.25, 0.7, 0.25),
                    new THREE.MeshLambertMaterial({ color: 0x3B7A3B })
                );
                rightArm.position.set(0.425, 0.85, 0);
                rightArm.rotation.x = -0.5;
                group.add(rightArm);
                const leftLeg = new THREE.Mesh(
                    new THREE.BoxGeometry(0.25, 0.7, 0.25),
                    new THREE.MeshLambertMaterial({ color: 0x2244AA })
                );
                leftLeg.position.set(-0.15, 0.1, 0);
                group.add(leftLeg);
                const rightLeg = new THREE.Mesh(
                    new THREE.BoxGeometry(0.25, 0.7, 0.25),
                    new THREE.MeshLambertMaterial({ color: 0x2244AA })
                );
                rightLeg.position.set(0.15, 0.1, 0);
                group.add(rightLeg);
                group.add(this.createNameTag('Zombie'));
                break;
            }
            case 'Skeleton': {
                const body = new THREE.Mesh(
                    new THREE.BoxGeometry(0.5, 0.7, 0.2),
                    new THREE.MeshLambertMaterial({ color: 0xBBBBBB })
                );
                body.position.y = 0.75;
                group.add(body);
                const head = new THREE.Mesh(
                    new THREE.BoxGeometry(0.5, 0.5, 0.5),
                    new THREE.MeshLambertMaterial({ color: 0xDDDDDD })
                );
                head.position.y = 1.25;
                group.add(head);
                const leftArm = new THREE.Mesh(
                    new THREE.BoxGeometry(0.2, 0.7, 0.2),
                    new THREE.MeshLambertMaterial({ color: 0xBBBBBB })
                );
                leftArm.position.set(-0.35, 0.85, 0);
                group.add(leftArm);
                const rightArm = new THREE.Mesh(
                    new THREE.BoxGeometry(0.2, 0.7, 0.2),
                    new THREE.MeshLambertMaterial({ color: 0xBBBBBB })
                );
                rightArm.position.set(0.35, 0.85, 0);
                group.add(rightArm);
                const leftLeg = new THREE.Mesh(
                    new THREE.BoxGeometry(0.2, 0.7, 0.2),
                    new THREE.MeshLambertMaterial({ color: 0xBBBBBB })
                );
                leftLeg.position.set(-0.12, 0.1, 0);
                group.add(leftLeg);
                const rightLeg = new THREE.Mesh(
                    new THREE.BoxGeometry(0.2, 0.7, 0.2),
                    new THREE.MeshLambertMaterial({ color: 0xBBBBBB })
                );
                rightLeg.position.set(0.12, 0.1, 0);
                group.add(rightLeg);
                group.add(this.createNameTag('Skeleton'));
                break;
            }
            case 'Spider': {
                const body = new THREE.Mesh(
                    new THREE.BoxGeometry(1.0, 0.4, 0.6),
                    new THREE.MeshLambertMaterial({ color: 0x332233 })
                );
                body.position.y = 0.3;
                group.add(body);
                const head = new THREE.Mesh(
                    new THREE.BoxGeometry(0.4, 0.35, 0.4),
                    new THREE.MeshLambertMaterial({ color: 0x443344 })
                );
                head.position.set(0, 0.35, -0.5);
                group.add(head);
                for (let i = 0; i < 4; i++) {
                    const legL = new THREE.Mesh(
                        new THREE.BoxGeometry(0.1, 0.1, 0.6),
                        new THREE.MeshLambertMaterial({ color: 0x332233 })
                    );
                    legL.position.set(-0.55, 0.25, -0.2 + i * 0.25);
                    legL.rotation.y = 0.3;
                    group.add(legL);
                    const legR = new THREE.Mesh(
                        new THREE.BoxGeometry(0.1, 0.1, 0.6),
                        new THREE.MeshLambertMaterial({ color: 0x332233 })
                    );
                    legR.position.set(0.55, 0.25, -0.2 + i * 0.25);
                    legR.rotation.y = -0.3;
                    group.add(legR);
                }
                group.add(this.createNameTag('Spider'));
                break;
            }
            case 'Cow': {
                const body = new THREE.Mesh(
                    new THREE.BoxGeometry(0.7, 0.6, 1.2),
                    new THREE.MeshLambertMaterial({ color: 0x886644 })
                );
                body.position.y = 0.8;
                group.add(body);
                const head = new THREE.Mesh(
                    new THREE.BoxGeometry(0.45, 0.45, 0.45),
                    new THREE.MeshLambertMaterial({ color: 0x886644 })
                );
                head.position.set(0, 1.0, -0.7);
                group.add(head);
                for (const [dx] of [[-0.25], [0.25]]) {
                    const leg = new THREE.Mesh(
                        new THREE.BoxGeometry(0.2, 0.5, 0.2),
                        new THREE.MeshLambertMaterial({ color: 0x664422 })
                    );
                    leg.position.set(dx, 0.25, -0.4);
                    group.add(leg);
                }
                for (const [dx] of [[-0.25], [0.25]]) {
                    const leg = new THREE.Mesh(
                        new THREE.BoxGeometry(0.2, 0.5, 0.2),
                        new THREE.MeshLambertMaterial({ color: 0x664422 })
                    );
                    leg.position.set(dx, 0.25, 0.4);
                    group.add(leg);
                }
                group.add(this.createNameTag('Cow'));
                break;
            }
            case 'Pig': {
                const body = new THREE.Mesh(
                    new THREE.BoxGeometry(0.55, 0.45, 0.8),
                    new THREE.MeshLambertMaterial({ color: 0xFFAAAA })
                );
                body.position.y = 0.55;
                group.add(body);
                const head = new THREE.Mesh(
                    new THREE.BoxGeometry(0.4, 0.4, 0.4),
                    new THREE.MeshLambertMaterial({ color: 0xFFAAAA })
                );
                head.position.set(0, 0.65, -0.5);
                group.add(head);
                const nose = new THREE.Mesh(
                    new THREE.BoxGeometry(0.25, 0.15, 0.1),
                    new THREE.MeshLambertMaterial({ color: 0xFF8888 })
                );
                nose.position.set(0, 0.6, -0.75);
                group.add(nose);
                for (const [dx, dz] of [[-0.2, -0.25], [0.2, -0.25], [-0.2, 0.25], [0.2, 0.25]]) {
                    const leg = new THREE.Mesh(
                        new THREE.BoxGeometry(0.15, 0.35, 0.15),
                        new THREE.MeshLambertMaterial({ color: 0xFF9999 })
                    );
                    leg.position.set(dx, 0.175, dz);
                    group.add(leg);
                }
                group.add(this.createNameTag('Pig'));
                break;
            }
            case 'Chicken': {
                const body = new THREE.Mesh(
                    new THREE.BoxGeometry(0.3, 0.3, 0.4),
                    new THREE.MeshLambertMaterial({ color: 0xFFFFFF })
                );
                body.position.y = 0.4;
                group.add(body);
                const head = new THREE.Mesh(
                    new THREE.BoxGeometry(0.2, 0.2, 0.2),
                    new THREE.MeshLambertMaterial({ color: 0xFFFFFF })
                );
                head.position.set(0, 0.6, -0.25);
                group.add(head);
                const beak = new THREE.Mesh(
                    new THREE.BoxGeometry(0.08, 0.05, 0.1),
                    new THREE.MeshLambertMaterial({ color: 0xFFAA00 })
                );
                beak.position.set(0, 0.55, -0.4);
                group.add(beak);
                const comb = new THREE.Mesh(
                    new THREE.BoxGeometry(0.05, 0.1, 0.08),
                    new THREE.MeshLambertMaterial({ color: 0xFF0000 })
                );
                comb.position.set(0, 0.72, -0.25);
                group.add(comb);
                const leftLeg = new THREE.Mesh(
                    new THREE.BoxGeometry(0.05, 0.25, 0.05),
                    new THREE.MeshLambertMaterial({ color: 0xFFAA00 })
                );
                leftLeg.position.set(-0.08, 0.125, 0);
                group.add(leftLeg);
                const rightLeg = new THREE.Mesh(
                    new THREE.BoxGeometry(0.05, 0.25, 0.05),
                    new THREE.MeshLambertMaterial({ color: 0xFFAA00 })
                );
                rightLeg.position.set(0.08, 0.125, 0);
                group.add(rightLeg);
                group.add(this.createNameTag('Chicken'));
                break;
            }
            default: {
                const mesh = new THREE.Mesh(
                    new THREE.BoxGeometry(0.8, 1.6, 0.8),
                    new THREE.MeshLambertMaterial({ color: 0xFF4444 })
                );
                mesh.position.y = 0.8;
                group.add(mesh);
                group.add(this.createNameTag(entityType));
                break;
            }
        }

        group.position.set(x, y, z);
        this.renderer.addToScene(group);
        this.entityMeshes.set(entityId, group as unknown as THREE.Mesh);
    }

    private createNameTag(name: string): THREE.Sprite {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 32;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, 128, 32);
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(name, 64, 22);
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(material);
        sprite.position.y = 2.0;
        sprite.scale.set(1.5, 0.375, 1);
        return sprite;
    }

    removeEntity(entityId: string): void {
        const mesh = this.entityMeshes.get(entityId);
        if (mesh) {
            this.renderer.removeFromScene(mesh);
            if (mesh instanceof THREE.Group) {
                mesh.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.geometry.dispose();
                        if (child.material instanceof THREE.Material) {
                            child.material.dispose();
                        }
                    }
                });
            } else {
                mesh.geometry.dispose();
                if (mesh.material instanceof THREE.Material) {
                    mesh.material.dispose();
                }
            }
            this.entityMeshes.delete(entityId);
        }
    }

    updateEntityPosition(entityId: string, x: number, y: number, z: number): void {
        const obj = this.entityMeshes.get(entityId);
        if (obj) {
            obj.position.set(x, y, z);
            if (entityId.startsWith('item_')) {
                obj.position.y += 0.15;
            }
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

    getBlockLight(worldX: number, worldY: number, worldZ: number): number {
        const chunkX = Math.floor(worldX / 16);
        const chunkY = Math.floor(worldY / 16);
        const chunkZ = Math.floor(worldZ / 16);
        const key = `${chunkX},${chunkY},${chunkZ}`;

        const chunk = this.chunks.get(key);
        if (!chunk) return 15;

        const localX = ((worldX % 16) + 16) % 16;
        const localY = ((worldY % 16) + 16) % 16;
        const localZ = ((worldZ % 16) + 16) % 16;

        return chunk.getLight(localX, localY, localZ);
    }

    isSolid(worldX: number, worldY: number, worldZ: number): boolean {
        const blockId = this.getBlock(worldX, worldY, worldZ);
        return this.blockRegistry.isSolid(blockId);
    }

    onFallingBlock(fromX: number, fromY: number, fromZ: number, toX: number, toY: number, toZ: number, blockType: number): void {
        const blockDef = this.blockRegistry.get(blockType);
        const colorHex = blockDef?.color || '#888888';
        const color = new THREE.Color(colorHex).getHex();

        const anim = new FallingBlockAnimation(fromX, fromY, fromZ, toX, toY, toZ, blockType, color);
        this.renderer.addToScene(anim.mesh);
        this.fallingBlocks.push(anim);
    }

    private entityAnimTime: number = 0;

    update(dt: number): void {
        this.entityAnimTime += dt;

        for (const [entityId, mesh] of this.entityMeshes) {
            if (entityId.startsWith('item_')) {
                mesh.position.y += Math.sin(this.entityAnimTime * 3.0) * 0.002;
                mesh.rotation.y += dt * 2.0;
            } else if (entityId.startsWith('mob_')) {
                const bob = Math.sin(this.entityAnimTime * 2.0) * 0.002;
                mesh.position.y += bob;
            }
        }

        for (let i = this.fallingBlocks.length - 1; i >= 0; i--) {
            const anim = this.fallingBlocks[i];
            anim.update(dt);

            if (anim.completed) {
                this.renderer.removeFromScene(anim.mesh);
                anim.mesh.geometry.dispose();
                (anim.mesh.material as THREE.Material).dispose();
                this.updateBlock(anim.toX, anim.toY, anim.toZ, anim.blockType);
                this.fallingBlocks.splice(i, 1);
            }
        }

        const time = performance.now() / 1000;
        for (const chunk of this.chunks.values()) {
            if (chunk.isVegetation) {
                chunk.animateVegetation(time);
            }
        }
        for (const key of this.animatedChunks) {
            const chunk = this.chunks.get(key);
            if (!chunk) continue;
            if (chunk.isWater) chunk.animateWater(time);
            if (chunk.isLava) chunk.animateLava(time);
        }
    }

    unloadDistantChunks(playerPos: THREE.Vector3): void {
        const playerChunkX = Math.floor(playerPos.x / 16);
        const playerChunkZ = Math.floor(playerPos.z / 16);
        const maxDistance = this.renderDistance + 3;

        const keysToRemove: string[] = [];
        for (const [key, chunk] of this.chunks) {
            const dx = chunk.chunkX - playerChunkX;
            const dz = chunk.chunkZ - playerChunkZ;
            if (Math.abs(dx) > maxDistance || Math.abs(dz) > maxDistance) {
                keysToRemove.push(key);
            }
        }

        for (const key of keysToRemove) {
            const chunk = this.chunks.get(key);
            if (chunk) {
                if (chunk.mesh) {
                    this.renderer.removeFromScene(chunk.mesh);
                }
                if (chunk.transparentMesh) {
                    this.renderer.removeFromScene(chunk.transparentMesh);
                }
                this.animatedChunks.delete(key);
                this.chunks.delete(key);
            }
        }
    }

    getChunkCount(): number { return this.chunks.size; }
    getPendingChunkKeys(): Set<string> { return this.pendingChunks; }
}
