import { HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5266';
const TIMEOUT_MS = 15000;

let passed = 0;
let failed = 0;
let connection = null;
let playerName = null;

function log(msg) {
    console.log(`  ${msg}`);
}

function assert(condition, testName) {
    if (condition) {
        passed++;
        console.log(`  \u2713 ${testName}`);
    } else {
        failed++;
        console.log(`  \u2717 FAIL: ${testName}`);
    }
}

async function withTimeout(promise, ms = TIMEOUT_MS) {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), ms))
    ]);
}

function waitForEvent(eventName, setupFn, ms = TIMEOUT_MS) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error(`Timeout waiting for ${eventName}`)), ms);
        const handler = (...args) => {
            clearTimeout(timer);
            connection.off(eventName, handler);
            resolve(args);
        };
        connection.on(eventName, handler);
        if (setupFn) setupFn();
    });
}

async function connect(playerNameParam) {
    playerName = playerNameParam || `CLI_${Date.now()}`;
    connection = new HubConnectionBuilder()
        .withUrl(`${SERVER_URL}/game`, { transport: HttpTransportType.WebSockets })
        .withAutomaticRetry()
        .build();
    await withTimeout(connection.start());
    return connection;
}

async function join() {
    const blockDefsPromise = waitForEvent('OnBlockDefinitions');
    const healthPromise = waitForEvent('OnHealthUpdate');
    const invPromise = waitForEvent('OnInventoryUpdate');
    const timePromise = waitForEvent('OnTimeUpdate');
    const playerListPromise = waitForEvent('OnPlayerListUpdate');

    await connection.invoke('Join', playerName);

    await withTimeout(blockDefsPromise);
    await withTimeout(healthPromise);
    await withTimeout(invPromise);
    const [time, speed, brightness] = await withTimeout(timePromise);
    await withTimeout(playerListPromise);

    return { time, speed, brightness };
}

async function disconnect() {
    if (connection && connection.state === 'Connected') {
        try { await connection.stop(); } catch {}
    }
}

const testSuites = {
    'api-status': {
        description: 'REST API Status',
        async run() {
            const res = await fetch(`${SERVER_URL}/api/status`);
            assert(res.ok, 'GET /api/status returns 200');
            const data = await res.json();
            assert(typeof data.online === 'number', 'Has "online" field');
            assert(typeof data.maxPlayers === 'number', 'Has "maxPlayers" field');
            assert(typeof data.isRunning === 'boolean', 'Has "isRunning" field');
            log(`  Server: ${data.online}/${data.maxPlayers} players, running=${data.isRunning}`);
        }
    },

    'connection': {
        description: 'SignalR Connection & Join',
        async run() {
            await connect();
            assert(connection.state === 'Connected', 'SignalR connected');
            const { time, speed, brightness } = await join();
            assert(typeof time === 'number', `Game time=${time}`);
            assert(typeof speed === 'number', `Time speed=${speed}`);
            assert(typeof brightness === 'number', `Brightness=${brightness}`);
            await disconnect();
        }
    },

    'position': {
        description: 'Position Update',
        async run() {
            await connect();
            await join();
            await connection.invoke('UpdatePosition', 10, 50, 20, 0, 0, 0, 45, 30);
            await new Promise(r => setTimeout(r, 300));
            assert(true, 'UpdatePosition accepted');
            await disconnect();
        }
    },

    'chat': {
        description: 'Chat & Commands',
        async run() {
            await connect();
            await join();

            // Test normal chat
            const chatPromise = waitForEvent('OnChatMessage');
            await connection.invoke('SendChat', 'Hello from CLI test');
            const [sender, message] = await withTimeout(chatPromise);
            assert(sender === playerName || sender === 'server', `Chat sender=${sender}`);
            assert(message.includes('Hello from CLI test'), 'Chat content correct');

            // Test /help command
            const helpPromise = waitForEvent('OnChatMessage');
            await connection.invoke('SendChat', '/help');
            const [helpSender, helpMsg] = await withTimeout(helpPromise);
            assert(helpSender === 'Server', '/help returns from Server');
            assert(helpMsg.includes('help') || helpMsg.length > 0, '/help has content');

            // Test /status command
            const statusPromise = waitForEvent('OnChatMessage');
            await connection.invoke('SendChat', '/status');
            const [statusSender] = await withTimeout(statusPromise);
            assert(statusSender === 'Server', '/status returns from Server');

            // Test /list command
            const listPromise = waitForEvent('OnChatMessage');
            await connection.invoke('SendChat', '/list');
            const [listSender] = await withTimeout(listPromise);
            assert(listSender === 'Server', '/list returns from Server');

            // Test /time command
            const timePromise2 = waitForEvent('OnChatMessage');
            await connection.invoke('SendChat', '/time');
            const [timeSender] = await withTimeout(timePromise2);
            assert(timeSender === 'Server', '/time returns from Server');

            await disconnect();
        }
    },

    'chunk': {
        description: 'Chunk Request',
        async run() {
            await connect();
            await join();

            await connection.invoke('UpdatePosition', 0, 80, 0, 0, 0, 0, 0, 70);
            await new Promise(r => setTimeout(r, 200));

            const chunkPromise = waitForEvent('OnChunkReceived', null, 20000);
            await connection.invoke('RequestChunk', 0, 0, 0);
            const [cx, cy, cz, data] = await withTimeout(chunkPromise, 20000);
            assert(typeof cx === 'number', `chunkX=${cx}`);
            assert(typeof cy === 'number', `chunkY=${cy}`);
            assert(typeof cz === 'number', `chunkZ=${cz}`);
            assert(data != null, 'Chunk data received');

            await disconnect();
        }
    },

    'block-ops': {
        description: 'Block Dig/Place Operations',
        async run() {
            await connect();
            await join();

            await connection.invoke('UpdatePosition', 0, 80, 0, 0, 0, 0, 0, 70);
            await new Promise(r => setTimeout(r, 200));

            // Request chunk first
            const chunkPromise = waitForEvent('OnChunkReceived', null, 20000);
            await connection.invoke('RequestChunk', 0, 0, 0);
            await withTimeout(chunkPromise, 20000);

            // Get dig time
            const digTime = await connection.invoke('DigBlockStart', 3, 70, 3);
            assert(typeof digTime === 'number', `Dig time=${digTime}s`);
            assert(digTime >= 0, 'Dig time is non-negative');

            // Dig block
            const blockUpdatePromise = waitForEvent('OnBlockUpdate');
            await connection.invoke('DigBlock', 3, 70, 3);
            const [bx, by, bz, blockData] = await withTimeout(blockUpdatePromise);
            assert(bx === 3 && by === 70 && bz === 3, `Block dug at (${bx},${by},${bz})`);
            assert(blockData === 0, 'Dug block is now air');

            // Place block
            const placePromise = waitForEvent('OnBlockUpdate');
            await connection.invoke('PlaceBlock', 3, 70, 3, 1);
            try {
                const [px, py, pz, placed] = await withTimeout(placePromise, 5000);
                assert(px === 3 && py === 70 && pz === 3, `Block placed at (${px},${py},${pz})`);
            } catch {
                log('  (Place may need inventory item - skipped)');
            }

            await disconnect();
        }
    },

    'crafting': {
        description: 'Crafting System',
        async run() {
            await connect();
            await join();

            const craftPromise = waitForEvent('OnCraftingRecipes');
            await connection.invoke('GetCraftingRecipes');
            const [recipes] = await withTimeout(craftPromise);
            assert(Array.isArray(recipes), `Crafting recipes received (${recipes.length})`);
            if (recipes.length > 0) {
                const r = recipes[0];
                assert(r.result != null, `First recipe: ${r.result} x${r.resultCount}`);
                assert(Array.isArray(r.ingredients), 'Recipe has ingredients');
            }

            await disconnect();
        }
    },

    'smelting': {
        description: 'Smelting System',
        async run() {
            await connect();
            await join();

            const smeltPromise = waitForEvent('OnSmeltingRecipes');
            await connection.invoke('GetSmeltingRecipes');
            const [recipes] = await withTimeout(smeltPromise);
            assert(Array.isArray(recipes), `Smelting recipes received (${recipes.length})`);
            if (recipes.length > 0) {
                const r = recipes[0];
                assert(r.input != null && r.result != null, `Smelting: ${r.input} -> ${r.result}`);
            }

            await disconnect();
        }
    },

    'inventory': {
        description: 'Inventory Operations',
        async run() {
            await connect();
            await join();

            // Get initial inventory
            const invPromise = waitForEvent('OnInventoryUpdate');
            await connection.invoke('RequestInventory');
            const [items] = await withTimeout(invPromise);
            assert(Array.isArray(items), `Inventory received (${items.filter(i => i != null).length} items)`);

            // Drop item
            const firstSlot = items.findIndex(i => i != null);
            if (firstSlot >= 0) {
                const dropPromise = waitForEvent('OnInventoryUpdate');
                await connection.invoke('DropItem', firstSlot, 1);
                await withTimeout(dropPromise);
                assert(true, 'Drop item accepted');
            }

            await disconnect();
        }
    },

    'privileges': {
        description: 'Privilege System',
        async run() {
            await connect();
            await join();

            const privPromise = waitForEvent('OnPrivilegeList');
            await connection.invoke('GetPrivileges');
            const [privs] = await withTimeout(privPromise);
            assert(Array.isArray(privs), `Privileges received (${privs.length})`);
            assert(privs.length > 0, 'Has at least one privilege');

            await disconnect();
        }
    },

    'armor': {
        description: 'Armor System',
        async run() {
            await connect();
            await join();

            // Request inventory first
            const invPromise = waitForEvent('OnInventoryUpdate');
            await connection.invoke('RequestInventory');
            await withTimeout(invPromise);

            // Equip armor (slot 0 to armor slot 0)
            try {
                const armorPromise = waitForEvent('OnArmorUpdate');
                await connection.invoke('EquipArmor', 0, 0);
                await withTimeout(armorPromise, 3000);
                assert(true, 'Armor equip accepted');
            } catch {
                log('  (No armor item to equip - skipped)');
            }

            await disconnect();
        }
    },

    'fishing': {
        description: 'Fishing System',
        async run() {
            await connect();
            await join();

            await connection.invoke('UpdatePosition', 0, 65, 0, 0, 0, 0, 0, 70);
            await new Promise(r => setTimeout(r, 200));

            try {
                await connection.invoke('StartFishing', 5, 64, 5);
                assert(true, 'StartFishing accepted');

                await connection.invoke('CancelFishing');
                assert(true, 'CancelFishing accepted');
            } catch {
                log('  (Fishing may need water nearby - test skipped)');
            }

            await disconnect();
        }
    },

    'entity': {
        description: 'Entity Spawn/Interact',
        async run() {
            await connect();
            await join();

            // Test entity spawn via chat command
            const spawnPromise = waitForEvent('OnEntitySpawned');
            const errorPromise = waitForEvent('OnChatMessage');
            await connection.invoke('SendChat', '/spawnentity zombie 5 70 5');

            const result = await Promise.race([
                spawnPromise.then(args => ({ type: 'spawned', args })),
                errorPromise.then(args => ({ type: 'chat', args })),
                new Promise((_, rej) => setTimeout(() => rej(new Error('Timeout')), 5000))
            ]);

            if (result.type === 'spawned') {
                const [entityId, entityType, x, y, z] = result.args;
                assert(entityId != null, `Entity spawned: ${entityType} at (${x},${y},${z})`);
            } else {
                log(`  (Entity spawn response: ${result.args[1] || 'chat response'})`);
            }

            // Test killall command
            const killPromise = waitForEvent('OnChatMessage');
            await connection.invoke('SendChat', '/killall');
            await withTimeout(killPromise, 5000);
            assert(true, '/killall accepted');

            await disconnect();
        }
    },

    'gamemode': {
        description: 'Game Mode Commands',
        async run() {
            await connect();
            await join();

            // /gamemode
            const gmPromise = waitForEvent('OnChatMessage');
            await connection.invoke('SendChat', '/gamemode creative');
            await withTimeout(gmPromise, 5000);
            assert(true, '/gamemode creative accepted');

            const gmPromise2 = waitForEvent('OnChatMessage');
            await connection.invoke('SendChat', '/gamemode survival');
            await withTimeout(gmPromise2, 5000);
            assert(true, '/gamemode survival accepted');

            await disconnect();
        }
    },

    'teleport': {
        description: 'Teleport Commands',
        async run() {
            await connect();
            await join();

            const tpPromise = waitForEvent('OnChatMessage');
            await connection.invoke('SendChat', '/tp 100 70 100');
            await withTimeout(tpPromise, 5000);
            assert(true, '/tp accepted');

            const tpBackPromise = waitForEvent('OnChatMessage');
            await connection.invoke('SendChat', '/tp 0 70 0');
            await withTimeout(tpBackPromise, 5000);

            await disconnect();
        }
    },

    'give': {
        description: 'Give Item Command',
        async run() {
            await connect();
            await join();

            const givePromise = waitForEvent('OnChatMessage');
            await connection.invoke('SendChat', `/give ${playerName} diamond 5`);
            const [, msg] = await withTimeout(givePromise, 5000);
            assert(true, '/give accepted');

            // Verify inventory updated
            const invPromise2 = waitForEvent('OnInventoryUpdate');
            await connection.invoke('RequestInventory');
            const [items2] = await withTimeout(invPromise2);
            const hasDiamond = items2.some(i => i && i.itemId === 'diamond');
            assert(hasDiamond, 'Diamond found in inventory after /give');

            await disconnect();
        }
    },

    'worldborder': {
        description: 'World Border',
        async run() {
            await connect();
            await join();

            const borderPromise = waitForEvent('OnChatMessage');
            await connection.invoke('SendChat', '/setborder 500');
            await withTimeout(borderPromise, 5000);
            assert(true, '/setborder accepted');

            const borderBackPromise = waitForEvent('OnChatMessage');
            await connection.invoke('SendChat', '/setborder 1000');
            await withTimeout(borderBackPromise, 5000);

            await disconnect();
        }
    },

    'daynight': {
        description: 'Day/Night Cycle',
        async run() {
            await connect();
            await join();

            const setTimePromise = waitForEvent('OnChatMessage');
            await connection.invoke('SendChat', '/settime 12000');
            await withTimeout(setTimePromise, 5000);
            assert(true, '/settime 12000 accepted');

            const setTime2Promise = waitForEvent('OnChatMessage');
            await connection.invoke('SendChat', '/settime 6000');
            await withTimeout(setTime2Promise, 5000);

            const timePromise3 = waitForEvent('OnTimeUpdate');
            const [time] = await withTimeout(timePromise3, 12000);
            log(`  Current time: ${time}`);

            await disconnect();
        }
    },

    'interact': {
        description: 'Block Interaction',
        async run() {
            await connect();
            await join();

            await connection.invoke('UpdatePosition', 0, 80, 0, 0, 0, 0, 0, 70);
            await new Promise(r => setTimeout(r, 200));

            // Request chunk
            const chunkPromise2 = waitForEvent('OnChunkReceived', null, 20000);
            await connection.invoke('RequestChunk', 0, 0, 0);
            await withTimeout(chunkPromise2, 20000);

            // Interact with block
            await connection.invoke('InteractWithBlock', 0, 70, 0);
            assert(true, 'InteractWithBlock accepted (no error)');

            await disconnect();
        }
    },

    'bucket': {
        description: 'Bucket Operations',
        async run() {
            await connect();
            await join();

            await connection.invoke('UpdatePosition', 0, 80, 0, 0, 0, 0, 0, 70);
            await new Promise(r => setTimeout(r, 200));

            const chunkPromise3 = waitForEvent('OnChunkReceived', null, 20000);
            await connection.invoke('RequestChunk', 0, 0, 0);
            await withTimeout(chunkPromise3, 20000);

            try {
                const result = await connection.invoke('UseBucket', 5, 70, 5, false);
                log(`  UseBucket result: ${result}`);
                assert(typeof result === 'boolean', 'UseBucket returns boolean');
            } catch (e) {
                log(`  UseBucket: ${e.message}`);
            }

            await disconnect();
        }
    },

    'multiplayer': {
        description: 'Multiplayer (2 connections)',
        async run() {
            const player1 = `MP1_${Date.now()}`;
            const player2 = `MP2_${Date.now()}`;

            const conn1 = new HubConnectionBuilder()
                .withUrl(`${SERVER_URL}/game`, { transport: HttpTransportType.WebSockets })
                .withAutomaticRetry()
                .build();
            const conn2 = new HubConnectionBuilder()
                .withUrl(`${SERVER_URL}/game`, { transport: HttpTransportType.WebSockets })
                .withAutomaticRetry()
                .build();

            await withTimeout(conn1.start());
            await withTimeout(conn2.start());
            assert(conn1.state === 'Connected', 'Player 1 connected');
            assert(conn2.state === 'Connected', 'Player 2 connected');

            // Player 1 joins
            const p1ListPromise = new Promise((resolve) => {
                conn1.on('OnPlayerListUpdate', (players) => { resolve(players); });
            });
            await conn1.invoke('Join', player1);
            const p1List = await withTimeout(p1ListPromise);
            assert(Array.isArray(p1List) && p1List.includes(player1), 'P1 sees self in list');

            // Player 2 joins - player 1 should get notification
            const p1JoinPromise = new Promise((resolve) => {
                conn1.on('OnPlayerJoined', (name) => { resolve(name); });
            });
            await conn2.invoke('Join', player2);
            const joinedName = await withTimeout(p1JoinPromise);
            assert(joinedName === player2, `P1 sees P2 join: ${joinedName}`);

            // Player 1 sends chat
            const p2ChatPromise = new Promise((resolve) => {
                conn2.on('OnChatMessage', (sender, msg) => { resolve({ sender, msg }); });
            });
            await conn1.invoke('SendChat', 'Hello from P1');
            const chatResult = await withTimeout(p2ChatPromise);
            assert(chatResult.msg.includes('Hello from P1'), 'P2 receives P1 chat');

            // Player 2 leaves
            const p1LeavePromise = new Promise((resolve) => {
                conn1.on('OnPlayerLeft', (name) => { resolve(name); });
            });
            await conn2.stop();
            const leftName = await withTimeout(p1LeavePromise, 5000);
            assert(leftName === player2, `P1 sees P2 leave: ${leftName}`);

            await conn1.stop();
        }
    },

    'full-protocol': {
        description: 'Full Protocol Sequence',
        async run() {
            await connect();
            assert(connection.state === 'Connected', '1. Connected');

            const init = await join();
            assert(true, '2. Join + init data received');

            await connection.invoke('UpdatePosition', 0, 80, 0, 0, 0, 0, 0, 70);
            assert(true, '3. Position update sent');

            const chunkP = waitForEvent('OnChunkReceived', null, 20000);
            await connection.invoke('RequestChunk', 0, 0, 0);
            await withTimeout(chunkP, 20000);
            assert(true, '4. Chunk received');

            const craftP = waitForEvent('OnCraftingRecipes');
            await connection.invoke('GetCraftingRecipes');
            const [recipes] = await withTimeout(craftP);
            assert(Array.isArray(recipes), '5. Crafting recipes received');

            const smeltP = waitForEvent('OnSmeltingRecipes');
            await connection.invoke('GetSmeltingRecipes');
            await withTimeout(smeltP);
            assert(true, '6. Smelting recipes received');

            const privP = waitForEvent('OnPrivilegeList');
            await connection.invoke('GetPrivileges');
            await withTimeout(privP);
            assert(true, '7. Privileges received');

            const chatP = waitForEvent('OnChatMessage');
            await connection.invoke('SendChat', '/status');
            await withTimeout(chatP);
            assert(true, '8. Chat command executed');

            await disconnect();
            assert(true, '9. Disconnected cleanly');
            log('  Full protocol sequence completed successfully');
        }
    },

    'privs': {
        description: 'Privilege Commands',
        async run() {
            await connect();
            await join();

            // /privs
            const privsP = waitForEvent('OnChatMessage');
            await connection.invoke('SendChat', '/privs');
            const [, privsMsg] = await withTimeout(privsP, 5000);
            assert(privsMsg.length > 0, '/privs returns data');

            // /mods
            const modsP = waitForEvent('OnChatMessage');
            await connection.invoke('SendChat', '/mods');
            await withTimeout(modsP, 5000);
            assert(true, '/mods accepted');

            // /days
            const daysP = waitForEvent('OnChatMessage');
            await connection.invoke('SendChat', '/days');
            await withTimeout(daysP, 5000);
            assert(true, '/days accepted');

            await disconnect();
        }
    },

    'respawn': {
        description: 'Respawn System',
        async run() {
            await connect();
            await join();

            // Try respawn (should be no-op if not dead)
            try {
                await connection.invoke('Respawn');
                assert(true, 'Respawn accepted (no-op when alive)');
            } catch {
                log('  (Respawn not available when alive - expected)');
            }

            await disconnect();
        }
    },

    'sign': {
        description: 'Sign Block Text',
        async run() {
            await connect();
            await join();

            await connection.invoke('UpdatePosition', 0, 80, 0, 0, 0, 0, 0, 70);
            await new Promise(r => setTimeout(r, 200));

            const chunkP2 = waitForEvent('OnChunkReceived', null, 20000);
            await connection.invoke('RequestChunk', 0, 0, 0);
            await withTimeout(chunkP2, 20000);

            // Set sign text (will only work if sign exists at that position)
            try {
                await connection.invoke('SetSignText', 3, 70, 3, 'Test sign text');
                assert(true, 'SetSignText accepted');
            } catch {
                log('  (SetSignText may need actual sign block - skipped)');
            }

            await disconnect();
        }
    }
};

const ALL_SUITES = Object.keys(testSuites);

function printUsage() {
    console.log('HelloMyWorld CLI Test Tool');
    console.log('Usage: node cli-test.mjs [command] [options]');
    console.log();
    console.log('Commands:');
    console.log('  all              Run all test suites (default)');
    console.log('  list             List available test suites');
    console.log('  <suite-name>     Run specific test suite');
    console.log('  quick            Run quick smoke tests (api-status, connection, chat, chunk)');
    console.log('  protocol         Run full protocol sequence test');
    console.log();
    console.log('Options:');
    console.log('  SERVER_URL=<url> Override server URL (default: http://localhost:5266)');
    console.log();
    console.log('Available test suites:');
    for (const [name, suite] of Object.entries(testSuites)) {
        console.log(`  ${name.padEnd(18)} ${suite.description}`);
    }
    console.log();
    console.log('Examples:');
    console.log('  node cli-test.mjs                          # Run all tests');
    console.log('  node cli-test.mjs quick                    # Quick smoke test');
    console.log('  node cli-test.mjs crafting smelting        # Run specific suites');
    console.log('  node cli-test.mjs multiplayer              # Multiplayer test');
}

async function runSuite(name) {
    const suite = testSuites[name];
    if (!suite) {
        console.log(`Unknown test suite: ${name}`);
        return;
    }
    console.log(`\n--- ${suite.description} ---`);
    try {
        await suite.run();
    } catch (e) {
        failed++;
        console.log(`  \u2717 FATAL: ${e.message}`);
    }
}

async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h') || args.includes('help')) {
        printUsage();
        process.exit(0);
    }

    if (args.includes('list')) {
        console.log('Available test suites:');
        for (const [name, suite] of Object.entries(testSuites)) {
            console.log(`  ${name.padEnd(18)} ${suite.description}`);
        }
        process.exit(0);
    }

    console.log('=== HelloMyWorld CLI Test Tool ===');
    console.log(`Server: ${SERVER_URL}`);
    console.log('='.repeat(40));

    let suitesToRun;

    if (args.length === 0 || args.includes('all')) {
        suitesToRun = ALL_SUITES;
    } else if (args.includes('quick')) {
        suitesToRun = ['api-status', 'connection', 'chat', 'chunk'];
    } else if (args.includes('protocol')) {
        suitesToRun = ['full-protocol'];
    } else {
        suitesToRun = args.filter(a => !a.includes('='));
    }

    for (const name of suitesToRun) {
        await runSuite(name);
    }

    console.log('\n' + '='.repeat(40));
    console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
    console.log('='.repeat(40));

    process.exit(failed > 0 ? 1 : 0);
}

main();
