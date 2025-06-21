import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        setupFiles: ['reflect-metadata'],
        include: ['**/?(*.)+(test).+(ts|js)'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
        },
    },
    resolve: {
        alias: {
            '@users': path.resolve(__dirname, './src/users'),
            '@videos': path.resolve(__dirname, './src/videos'),
            '@shared': path.resolve(__dirname, './src/shared'),
            '@tests': path.resolve(__dirname, './src/tests'),
        },
    },
});
