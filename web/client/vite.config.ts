import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        port: 5173,
        proxy: {
            '/game': {
                target: 'http://localhost:5000',
                ws: true
            }
        }
    },
    build: {
        outDir: 'dist',
        sourcemap: true
    }
});
