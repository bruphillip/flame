import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import eslint from 'vite-plugin-eslint'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      src: '/src',
    },
  },
  logLevel: 'info',
  test: {
    globals: true,
    clearMocks: true,
    dir: 'tests',
    environment: 'jsdom',
    deps: {
      optimizer: {
        web: {
          include: ['react'],
        },
        ssr: {
          include: ['react'],
        },
      },
    },
  },
  plugins: [
    react(),
    viteTsconfigPaths(),
    dts({
      insertTypesEntry: true,
    }),
    eslint({
      exclude: ['/virtual:/', 'node_modules/**'],
    }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.ts': 'tsx' },
    },
    entries: ['react'],
  },
})
