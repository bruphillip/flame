import { resolve } from 'path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import eslint from 'vite-plugin-eslint'
import viteTsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
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
      fileName: 'flame',
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
      include: ['src'],
      insertTypesEntry: true,
    }),
    viteTsconfigPaths(),
    eslint({
      exclude: ['/virtual:/', 'node_modules/**'],
    }),
  ],
})
