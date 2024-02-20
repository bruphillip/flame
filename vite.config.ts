import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

import dts from 'vite-plugin-dts';

import viteTsconfigPaths from 'vite-tsconfig-paths';

// import eslint from 'vite-plugin-eslint';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    resolve: {
      alias: {
        src: '/src',
      },
    },
    build: {
      target: ['es2018'],
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'flame',
        formats: ['es'],
        fileName: 'flame-lib',
      },
      rollupOptions: {
        external: ['react', 'react-dom'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
      },
    },
    plugins: [
      react(),
      dts({
        // insertTypesEntry: true,
        rollupTypes: true,
        copyDtsFiles: true,
      }),
      viteTsconfigPaths(),
      // eslint({
      //   exclude: ['/virtual:/', 'node_modules/**'],
      // }),
    ],
  });
};
