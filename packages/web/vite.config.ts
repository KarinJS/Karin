import { defineConfig } from 'vite'
// import { defineConfig, normalizePath } from 'vite'
// import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import viteCompression from 'vite-plugin-compression'
// import { viteStaticCopy } from 'vite-plugin-static-copy'
// import path from 'node:path'
import * as zlib from 'node:zlib'
import { qrcode } from 'vite-plugin-qrcode'
import react from '@vitejs/plugin-react-oxc'

// const monacoEditorPath = normalizePath(
//   path.resolve(__dirname, 'node_modules/monaco-editor/min/vs')
// )

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    qrcode(),
    viteCompression({
      deleteOriginFile: true,
      verbose: false,
      algorithm: 'brotliCompress',
      ext: '.br',
      filter: /\.(js|css|json|txt|svg|png|jpg|jpeg|gif|webp|woff|woff2|eot|ttf|otf)$/i,
      compressionOptions: {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        },
      },
      threshold: 10240, // 只有大于1kb的文件才会被压缩
    }),
    // viteStaticCopy({
    //   targets: [
    //     {
    //       src: monacoEditorPath,
    //       dest: 'monaco-editor/min',
    //     },
    //   ],
    // }),
  ],
  base: '/web/',
  build: {
    emptyOutDir: true,
    outDir: '../core/dist/web',
    rollupOptions: {
      output: {
        /**
         * 使用advancedChunks替代manualChunks进行拆包策略
         */
        advancedChunks: {
          groups: [
            // React相关库合并
            // { name: 'vendor-react', test: /[\\/]node_modules[\\/](react|redux|scheduler|@react-|@reduxjs)/ },
            // // Monaco Editor相关库
            // { name: 'monaco-editor-core', test: /[\\/]node_modules[\\/]monaco-editor[\\/]editor/ },
            // { name: 'monaco-languages', test: /[\\/]node_modules[\\/]monaco-editor[\\/]language/ },
            // { name: 'monaco-editor-features', test: /[\\/]node_modules[\\/]monaco-editor/ },
            // { name: 'monaco-react', test: /[\\/]node_modules[\\/]@monaco-editor[\\/]react/ },
            // // HeroUI组件库
            { name: 'vendor-heroui', test: /[\\/]node_modules[\\/]@heroui/ },
            // // 编辑器相关库
            // { name: 'vendor-editor', test: /[\\/]node_modules[\\/](quill|@xterm)/ },
            // // 可视化/图表相关库
            { name: 'vendor-visual', test: /[\\/]node_modules[\\/](echarts|three|ogl)/ },
            // // UI工具库
            // { name: 'vendor-ui-utils', test: /[\\/]node_modules[\\/](tailwind|framer-motion|lucide-react|dnd-kit|class-variance-authority|clsx)/ },
            // // 应用内部模块分组
            // { name: 'components', test: /[\\/]components[\\/]/ },
            // { name: 'hooks', test: /[\\/]hooks[\\/]/ },
            // { name: 'utils', test: /[\\/]utils[\\/]/ },
            // 页面分块 - 使用name函数代替nameTransformer
            // {
            //   name: (moduleId: string) => {
            //     const match = moduleId.match(/[\\/]pages[\\/]([^/]+)/)
            //     return match ? `page-${match[1]}` : 'other'
            //   },
            //   test: /[\\/]pages[\\/]([^/]+)/,
            // },
          ],
        },
        // 控制chunk的大小和命名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        // 入口文件命名
        entryFileNames: 'assets/js/entry-[hash].js',
        // 静态资源命名
        assetFileNames: (assetInfo) => {
          const info = assetInfo.names[0] || ''
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
    // 启用CSS代码分割
    cssCodeSplit: true,
    // 启用源码映射（生产环境可设为false提高性能）
    sourcemap: false,
    // 设置chunk大小警告阈值
    chunkSizeWarningLimit: 999,
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
