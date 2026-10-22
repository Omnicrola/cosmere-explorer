import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        // mirror the import map in index.html: "jsm/..." -> three's examples/jsm addons
        alias: [
            { find: /^jsm\/(.*)$/, replacement: 'three/examples/jsm/$1' },
        ],
    },
    test: {
        environment: 'jsdom',
        include: ['test/**/*.test.js'],
        setupFiles: ['./test/setup.js'],
    },
});
