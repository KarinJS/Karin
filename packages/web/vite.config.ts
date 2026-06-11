import { defineConfig } from 'vite'
// import { defineConfig, normalizePath } from 'vite'
import react from '@vitejs/plugin-react'
// import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { codeInspectorPlugin } from 'code-inspector-plugin'

const root = fileURLToPath(new URL('.', import.meta.url))

// const monacoEditorPath = normalizePath(
//   path.resolve(__dirname, 'node_modules/monaco-editor/min/vs')
// )

// https://vite.dev/config/
export default defineConfig({
  root,
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    react(),
    codeInspectorPlugin({
      bundler: 'vite',
      showSwitch: true,
      hotKeys: ['shiftKey', 'altKey']
    }),
  ],
  base: '/web/',
  build: {
    emptyOutDir: true,
    outDir: '../core/dist/web',
    rolldownOptions: {
      output: {
        codeSplitting: false,
        // 控制chunk的大小和命名
        entryFileNames: 'assets/js/entry-[hash].js',
        // 静态资源命名
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name || ''
          const extType = info.split('.').at(-1) || 'misc'
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(info)) {
            return 'assets/images/[name]-[hash][extname]'
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(info)) {
            return 'assets/fonts/[name]-[hash][extname]'
          }
          return `assets/${extType}/[name]-[hash][extname]`
        },
      },
    },
    // 禁用CSS代码分割，WebUI 直接注册访问时保持单入口产物。
    cssCodeSplit: false,
    // 启用源码映射（生产环境可设为false提高性能）
    sourcemap: false,
    // 不压缩、不混淆，WebUI 由后端直接注册静态目录访问。
    minify: false,
    cssMinify: false,
    // 设置chunk大小警告阈值
    chunkSizeWarningLimit: 1000,
  },
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:7777',
        changeOrigin: true,
      },
      // '/sandbox/data': {
      //   target: 'http://localhost:7777',
      //   changeOrigin: true,
      // },
      // '/sandbox': {
      //   target: 'ws://localhost:7777',
      //   ws: true,
      // },
      '/terminal/create': {
        target: 'ws://localhost:7777',
        ws: true,
      },
    },
  },
  optimizeDeps: {
    exclude: ['monaco-editor', '@monaco-editor/react'],
  },
})
