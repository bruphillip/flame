"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const vite_1 = require("vite");
exports.default = ({ mode }) => {
    process.env = Object.assign(Object.assign({}, process.env), (0, vite_1.loadEnv)(mode, process.cwd()));
    return (0, vite_1.defineConfig)({
        resolve: {
            alias: {
                src: '/src',
            },
        },
        plugins: [
        // react(),
        // svgr({
        //   svgrOptions: {},
        // }),
        // viteTsconfigPaths(),
        ],
        build: {
            lib: {
                entry: (0, path_1.resolve)(process.cwd(), '.', 'src', 'index.ts'),
                name: 'flame',
            },
            rollupOptions: {
                external: ['react', 'react-dom'],
            },
        },
        server: {
            proxy: {
                '/api/admin': {
                    target: `${process.env.VITE_APP_PROXY_API_BASE_URL}/admin`,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api\/admin/, ''),
                },
                '/api/nf': {
                    target: `${process.env.VITE_APP_PROXY_API_BASE_URL}/nf`,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api\/nf/, ''),
                },
                '/api/es': {
                    target: `${process.env.VITE_APP_PROXY_API_BASE_URL}/es`,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api\/es/, ''),
                },
                '/api/core': {
                    target: `${process.env.VITE_APP_PROXY_API_BASE_URL}/core`,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api\/core/, ''),
                },
            },
        },
    });
};
