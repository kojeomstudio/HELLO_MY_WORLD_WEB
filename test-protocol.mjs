import { HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';

const SERVER_URL = 'http://localhost:5266';
const TEST_PLAYER = `TestBot_${Date.now()}`;
const TIMEOUT_MS = 10000;

let passed = 0;
let failed = 0;
let connection = null;

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

async function waitForEvent(eventName, setupFn, ms = TIMEOUT_MS) {
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

async function testApiStatus() {
    console.log('\n[1/8] Testing API Status Endpoint');
    try {
        const res = await fetch(`${SERVER_URL}/api/status`);
        assert(res.ok, 'GET /api/status returns 200');
        const data = await res.json();
        assert(typeof data.online === 'number', 'Response has "online" number field');
        assert(typeof data.maxPlayers === 'number', 'Response has "maxPlayers" number field');
        assert(typeof data.isRunning === 'boolean', 'Response has "isRunning" boolean field');
    } catch (e) {
        failed += 4;
        console.log(`  \u2717 FAIL: API status - ${e.message}`);
    }
}

async function testSignalRConnection() {
    console.log('\n[2/8] Testing SignalR Connection');
    try {
        connection = new HubConnectionBuilder()
            .withUrl(`${SERVER_URL}/game`, {
                transport: HttpTransportType.WebSockets
            })
            .withAutomaticRetry()
            .build();

        await withTimeout(connection.start());
        assert(connection.state === 'Connected', 'SignalR WebSocket connected');
    } catch (e) {
        assert(false, `SignalR connection: ${e.message}`);
        throw e;
    }
}

async function testJoinAndInitProtocol() {
    console.log('\n[3/8] Testing Join/Init Protocol');
    try {
        const blockDefsPromise = waitForEvent('OnBlockDefinitions');
        const healthPromise = waitForEvent('OnHealthUpdate');
        const invPromise = waitForEvent('OnInventoryUpdate');
        const timePromise = waitForEvent('OnTimeUpdate');
        const playerListPromise = waitForEvent('OnPlayerListUpdate');

        await connection.invoke('Join', TEST_PLAYER);

        const [defs] = await withTimeout(blockDefsPromise);
        assert(typeof defs === 'string' && defs.length > 0, 'OnBlockDefinitions received with data');

        const [health, maxHealth] = await withTimeout(healthPromise);
        assert(typeof health === 'number' && health > 0, `OnHealthUpdate received (hp=${health})`);

        const [items] = await withTimeout(invPromise);
        assert(Array.isArray(items), 'OnInventoryUpdate received as array');

        const [time, speed, brightness] = await withTimeout(timePromise);
        assert(typeof time === 'number', `OnTimeUpdate received (time=${time})`);
        assert(typeof speed === 'number', `Time speed received (speed=${speed})`);
        assert(typeof brightness === 'number', `Sky brightness received (${brightness})`);

        const [players] = await withTimeout(playerListPromise);
        assert(Array.isArray(players) && players.includes(TEST_PLAYER), 'OnPlayerListUpdate includes test player');
    } catch (e) {
        failed += 6;
        console.log(`  \u2717 FAIL: Join protocol - ${e.message}`);
    }
}

async function testPositionUpdate() {
    console.log('\n[4/8] Testing Position Update Protocol');
    try {
        await connection.invoke('UpdatePosition', 0, 50, 0, 0, 0, 0, 0, 70);
        await new Promise(r => setTimeout(r, 200));
        assert(true, 'UpdatePosition accepted without error');
    } catch (e) {
        assert(false, `UpdatePosition: ${e.message}`);
    }
}

async function testChatProtocol() {
    console.log('\n[5/8] Testing Chat Protocol');
    try {
        const chatPromise = waitForEvent('OnChatMessage');
        await connection.invoke('SendChat', 'Hello from test bot');
        const [sender, message] = await withTimeout(chatPromise);
        assert(sender === TEST_PLAYER || sender === 'server', `OnChatMessage sender=${sender}`);
        assert(message.includes('Hello from test bot'), `OnChatMessage content correct: "${message}"`);
    } catch (e) {
        failed += 2;
        console.log(`  \u2717 FAIL: Chat protocol - ${e.message}`);
    }
}

async function testChunkRequestProtocol() {
    console.log('\n[6/8] Testing Chunk Request Protocol');
    try {
        const chunkPromise = waitForEvent('OnChunkReceived');
        await connection.invoke('RequestChunk', 0, 0, 0);
        const [cx, cy, cz, data] = await withTimeout(chunkPromise, 15000);
        assert(typeof cx === 'number', `OnChunkReceived chunkX=${cx}`);
        assert(typeof cy === 'number', `OnChunkReceived chunkY=${cy}`);
        assert(typeof cz === 'number', `OnChunkReceived chunkZ=${cz}`);
        assert(data instanceof Uint8Array || data instanceof ArrayBuffer || typeof data === 'object', 'OnChunkReceived has block data');
    } catch (e) {
        failed += 4;
        console.log(`  \u2717 FAIL: Chunk protocol - ${e.message}`);
    }
}

async function testCraftingProtocol() {
    console.log('\n[7/8] Testing Crafting/Smelting Protocol');
    try {
        await connection.invoke('GetCraftingRecipes');
        const [recipes] = await withTimeout(waitForEvent('OnCraftingRecipes'), 5000);
        assert(Array.isArray(recipes), `OnCraftingRecipes received (${recipes.length} recipes)`);
    } catch (e) {
        assert(false, `GetCraftingRecipes: ${e.message}`);
    }

    try {
        await connection.invoke('GetSmeltingRecipes');
        const [recipes] = await withTimeout(waitForEvent('OnSmeltingRecipes'), 5000);
        assert(Array.isArray(recipes), `OnSmeltingRecipes received (${recipes.length} recipes)`);
    } catch (e) {
        assert(false, `GetSmeltingRecipes: ${e.message}`);
    }
}

async function testPrivilegeProtocol() {
    console.log('\n[8/8] Testing Privilege Protocol');
    try {
        await connection.invoke('GetPrivileges');
        const [privs] = await withTimeout(waitForEvent('OnPrivilegeList'), 5000);
        assert(Array.isArray(privs), `OnPrivilegeList received (${privs.length} privileges)`);
        assert(privs.includes('interact') || privs.includes('shout') || privs.length > 0, 'Privileges include expected entries');
    } catch (e) {
        failed += 2;
        console.log(`  \u2717 FAIL: Privilege protocol - ${e.message}`);
    }
}

async function cleanup() {
    if (connection && connection.state === 'Connected') {
        try {
            await connection.stop();
        } catch { }
    }
}

async function main() {
    console.log('=== HelloMyWorld Protocol Integration Test ===');
    console.log(`Server: ${SERVER_URL}`);
    console.log(`Player: ${TEST_PLAYER}`);
    console.log('=============================================');

    try {
        await testApiStatus();
        await testSignalRConnection();
        await testJoinAndInitProtocol();
        await testPositionUpdate();
        await testChatProtocol();
        await testChunkRequestProtocol();
        await testCraftingProtocol();
        await testPrivilegeProtocol();
    } catch (e) {
        console.log(`\nFatal error: ${e.message}`);
    } finally {
        await cleanup();
    }

    console.log('\n=============================================');
    console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
    console.log('=============================================');

    process.exit(failed > 0 ? 1 : 0);
}

main();
