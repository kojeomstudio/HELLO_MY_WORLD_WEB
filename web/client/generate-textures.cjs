const { writeFileSync, mkdirSync, existsSync } = require('fs');
const { join, dirname } = require('path');
const zlib = require('zlib');

const OUTPUT_DIR = join(__dirname, 'public', 'textures', 'blocks');
mkdirSync(OUTPUT_DIR, { recursive: true });

function crc32(buf) {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) {
        crc ^= buf[i];
        for (let j = 0; j < 8; j++) {
            crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
        }
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
}

function createChunk(type, data) {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);
    const typeBuffer = Buffer.from(type, 'ascii');
    const crcData = Buffer.concat([typeBuffer, data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(crcData), 0);
    return Buffer.concat([length, typeBuffer, data, crc]);
}

function createPng(width, height, getPixel) {
    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    const ihdrData = Buffer.alloc(13);
    ihdrData.writeUInt32BE(width, 0);
    ihdrData.writeUInt32BE(height, 4);
    ihdrData[8] = 8;
    ihdrData[9] = 6;
    const ihdr = createChunk('IHDR', ihdrData);

    const rawData = Buffer.alloc(height * (1 + width * 4));
    for (let y = 0; y < height; y++) {
        rawData[y * (1 + width * 4)] = 0;
        for (let x = 0; x < width; x++) {
            const [r, g, b, a] = getPixel(x, y);
            const off = y * (1 + width * 4) + 1 + x * 4;
            rawData[off] = r;
            rawData[off + 1] = g;
            rawData[off + 2] = b;
            rawData[off + 3] = a !== undefined ? a : 255;
        }
    }

    const compressed = zlib.deflateSync(rawData);
    const idat = createChunk('IDAT', compressed);
    const iend = createChunk('IEND', Buffer.alloc(0));

    return Buffer.concat([signature, ihdr, idat, iend]);
}

function parseHex(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}

function solidColor(hex) {
    const [r, g, b] = parseHex(hex);
    return (x, y) => {
        const noise = Math.floor(Math.random() * 10) - 5;
        return [
            Math.max(0, Math.min(255, r + noise)),
            Math.max(0, Math.min(255, g + noise)),
            Math.max(0, Math.min(255, b + noise)),
            255
        ];
    };
}

function grassTop() {
    const base = parseHex('#228B22');
    return (x, y) => {
        const noise = Math.floor(Math.random() * 20) - 10;
        return [
            Math.max(0, Math.min(255, base[0] + noise)),
            Math.max(0, Math.min(255, base[1] + noise)),
            Math.max(0, Math.min(255, base[2] + noise - 5)),
            255
        ];
    };
}

function grassSide() {
    const top = parseHex('#228B22');
    const dirt = parseHex('#8B4513');
    return (x, y) => {
        const noise = Math.floor(Math.random() * 10) - 5;
        if (y < 4) {
            const mix = y / 4;
            return [
                Math.floor(top[0] * (1 - mix) + dirt[0] * mix) + noise,
                Math.floor(top[1] * (1 - mix) + dirt[1] * mix) + noise,
                Math.floor(top[2] * (1 - mix) + dirt[2] * mix) + noise,
                255
            ];
        }
        return [
            Math.max(0, Math.min(255, dirt[0] + noise)),
            Math.max(0, Math.min(255, dirt[1] + noise)),
            Math.max(0, Math.min(255, dirt[2] + noise)),
            255
        ];
    };
}

function orePattern(baseHex, oreHex) {
    const [br, bg, bb] = parseHex(baseHex);
    const [or, og, ob] = parseHex(oreHex);
    return (x, y) => {
        const noise = Math.floor(Math.random() * 10) - 5;
        const isOre = ((x + y * 3 + Math.floor(Math.random() * 2)) % 5 < 2) && Math.random() > 0.6;
        if (isOre) {
            return [
                Math.max(0, Math.min(255, or + noise)),
                Math.max(0, Math.min(255, og + noise)),
                Math.max(0, Math.min(255, ob + noise)),
                255
            ];
        }
        return [
            Math.max(0, Math.min(255, br + noise)),
            Math.max(0, Math.min(255, bg + noise)),
            Math.max(0, Math.min(255, bb + noise)),
            255
        ];
    };
}

const textures = {
    'default_stone.png': solidColor('#808080'),
    'default_dirt.png': solidColor('#8B4513'),
    'default_grass_top.png': grassTop(),
    'default_grass_side.png': grassSide(),
    'default_grass.png': grassTop(),
    'default_water.png': () => [65, 105, 225, 180],
    'default_water_flowing.png': () => [65, 105, 225, 160],
    'default_sand.png': solidColor('#F4A460'),
    'default_tree.png': solidColor('#DEB887'),
    'default_tree_top.png': solidColor('#C4A050'),
    'default_leaves.png': () => {
        const n = Math.floor(Math.random() * 30) - 15;
        return [50 + n, 205 + n, 50 + n, 230];
    },
    'default_glass.png': () => [173, 216, 230, 128],
    'default_brick.png': solidColor('#B22222'),
    'default_cobble.png': solidColor('#6B6B6B'),
    'default_snow.png': solidColor('#FFFAFA'),
    'default_ice.png': () => [176, 224, 230, 200],
    'default_lava.png': () => {
        const n = Math.floor(Math.random() * 40);
        return [255, 69 + n, 0, 255];
    },
    'default_lava_flowing.png': () => {
        const n = Math.floor(Math.random() * 40);
        return [255, 69 + n, 0, 230];
    },
    'default_obsidian.png': solidColor('#1A0A2E'),
    'default_wood.png': solidColor('#DEB887'),
    'default_planks.png': solidColor('#BC8F5A'),
    'default_gravel.png': solidColor('#888078'),
    'default_clay.png': solidColor('#9BA5B0'),
    'default_sandstone.png': solidColor('#E8D5A3'),
    'default_mossycobble.png': solidColor('#5E6E5E'),
    'default_iron_ore.png': orePattern('#808080', '#C4A882'),
    'default_coal_ore.png': orePattern('#808080', '#2F4F4F'),
    'default_gold_ore.png': orePattern('#808080', '#FFD700'),
    'default_diamond_ore.png': orePattern('#808080', '#00FFFF'),
    'default_torch.png': solidColor('#FFD700'),
    'default_ladder.png': solidColor('#8B4513'),
    'default_fence.png': solidColor('#8B4513'),
    'default_chest_top.png': solidColor('#8B4513'),
    'default_chest_side.png': solidColor('#8B6914'),
    'default_chest_front.png': solidColor('#8B6914'),
    'default_chest.png': solidColor('#8B6914'),
    'default_furnace.png': solidColor('#696969'),
    'default_furnace_front.png': solidColor('#555555'),
    'default_furnace_side.png': solidColor('#696969'),
    'default_crafting_table_top.png': solidColor('#D2691E'),
    'default_crafting_table_side.png': solidColor('#BC8F5A'),
    'default_crafting_table_front.png': solidColor('#8B4513'),
    'default_door_wood.png': solidColor('#8B6914'),
    'default_bookshelf.png': solidColor('#C4A050'),
    'default_mycelium_top.png': solidColor('#6B5A8A'),
    'default_farmland.png': solidColor('#6B4E2A'),
    'default_cactus.png': solidColor('#0A5C0A'),
    'default_pumpkin.png': solidColor('#FF8C00'),
    'default_pumpkin_top.png': solidColor('#FF8C00'),
    'default_melon.png': solidColor('#5C8A1E'),
    'default_melon_top.png': solidColor('#5C8A1E'),
    'default_wheat.png': solidColor('#DAA520'),
    'default_hay.png': solidColor('#DAA520'),
    'default_iron_block.png': solidColor('#D8D8D8'),
    'default_gold_block.png': solidColor('#FFD700'),
    'default_diamond_block.png': solidColor('#4AEDD9'),
    'default_stone_brick.png': solidColor('#777777'),
    'default_wool_white.png': solidColor('#EEEEEE'),
    'default_wool_red.png': solidColor('#CC2222'),
    'default_wool_blue.png': solidColor('#2222CC'),
    'default_wool_green.png': solidColor('#22CC22'),
    'default_wool_orange.png': solidColor('#E8821C'),
    'default_wool_yellow.png': solidColor('#F2E63C'),
    'default_wool_cyan.png': solidColor('#2CC4AD'),
    'default_wool_purple.png': solidColor('#7B2FBE'),
    'default_wool_black.png': solidColor('#1D1D1D'),
    'default_wool_brown.png': solidColor('#724528'),
    'default_wool_pink.png': solidColor('#F2A5C4'),
    'default_wool_lime.png': solidColor('#52B248'),
    'default_wool_light_blue.png': solidColor('#6689D3'),
    'default_wool_magenta.png': solidColor('#B24CBF'),
    'default_wool_gray.png': solidColor('#6B6B6B'),
    'default_wool_light_gray.png': solidColor('#A0A0A0'),
    'default_burning_obsidian.png': () => {
        const n = Math.floor(Math.random() * 30);
        return [58 + n, 26 + n, 94 + n, 255];
    },
    'default_apple.png': solidColor('#CC2222'),
    'default_sugar_cane.png': solidColor('#90EE90'),
    'default_bedrock.png': solidColor('#1C1C1C'),
};

for (const [name, getPixel] of Object.entries(textures)) {
    const filePath = join(OUTPUT_DIR, name);
    if (existsSync(filePath)) {
        continue;
    }
    const png = createPng(16, 16, getPixel);
    writeFileSync(filePath, png);
    console.log(`Generated ${name}`);
}

console.log(`\nDone. Skipped existing files.`);
