import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        port: 5173,
        proxy: {
            '/game': {
                target: 'http://localhost:5266',
                ws: true
            }
        }
    },
    build: {
        outDir: 'dist',
        sourcemap: process.env.NODE_ENV !== 'production',
        rollupOptions: {
            output: {
                manualChunks: {
                    three: ['three'],
                    signalr: ['@microsoft/signalr'],
                    game: ['./src/GameClient.ts', './src/player/PlayerController.ts'],
                    world: ['./src/world/WorldManager.ts', './src/world/ChunkMesh.ts', './src/world/BlockRegistry.ts'],
                    ui: ['./src/ui/UIManager.ts', './src/ui/CraftingGridUI.ts', './src/ui/Minimap.ts', './src/ui/SettingsPanel.ts'],
                    rendering: ['./src/rendering/Renderer.ts', './src/rendering/WieldItem.ts', './src/rendering/SelectionBox.ts', './src/rendering/CloudSystem.ts']
                }
            }
        }
    }
});
