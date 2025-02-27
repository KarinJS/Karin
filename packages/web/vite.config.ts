import { defineConfig, normalizePath } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import reactScan from '@react-scan/vite-plugin-react-scan'
import viteCompression from 'vite-plugin-compression'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'node:path'

const monacoEditorPath = normalizePath(
  path.resolve(__dirname, 'node_modules/monaco-editor/min/vs')
)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    reactScan(),
    viteCompression({ deleteOriginFile: true }),
    viteStaticCopy({
      targets: [
        {
          src: monacoEditorPath,
          dest: 'monaco-editor/min',
        }
      ]
    })
  ],
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
