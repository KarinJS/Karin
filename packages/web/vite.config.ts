import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  base: '/web/',
  build: {
    outDir: '../core/dist/web',
  },
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:7777',
        changeOrigin: true,
      },
      '/sandbox/data': {
        target: 'http://localhost:7777',
        changeOrigin: true,
      },
      '/sandbox': {
        target: 'ws://localhost:7777',
        ws: true,
      },
    },
  },
})
