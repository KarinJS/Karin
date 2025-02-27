import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import reactScan from '@react-scan/vite-plugin-react-scan'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), reactScan()],
  base: '/web/',
  build: {
    emptyOutDir: true,
    outDir: '../core/dist/web',
  },
  server: {
    host: false,
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true,
    },
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
