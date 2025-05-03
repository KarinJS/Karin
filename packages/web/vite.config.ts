import { defineConfig, normalizePath } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import viteCompression from 'vite-plugin-compression'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'node:path'
import * as zlib from 'node:zlib'

const monacoEditorPath = normalizePath(
  path.resolve(__dirname, 'node_modules/monaco-editor/min/vs')
)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
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
    }),
    viteStaticCopy({
      targets: [
        {
          src: monacoEditorPath,
          dest: 'monaco-editor/min',
        },
      ],
    }),
  ],
  base: '/web/',
  build: {
    emptyOutDir: true,
    outDir: '../core/dist/web',
    rollupOptions: {
      output: {
        /**
         * 自定义拆包策略，根据依赖类型和关联性进行分组
         * @param id - 模块ID
         * @returns chunk名称
         */
        manualChunks: (id) => {
          // 处理node_modules中的依赖
          if (id.includes('node_modules')) {
            // Monaco Editor相关库单独处理
            if (id.includes('monaco-editor')) {
              // 基础编辑器功能
              if (id.includes('/editor/')) {
                return 'monaco-editor-core'
              }
              // 语言相关功能（分开打包避免文件过大）
              if (id.includes('/language/')) {
                const lang = id.match(/\/language\/([^/]+)/)?.[1]
                if (lang) {
                  return `monaco-language-${lang}`
                }
                return 'monaco-languages'
              }
              // 其他Monaco功能
              return 'monaco-editor-features'
            }

            // @monaco-editor/react单独打包
            if (id.includes('@monaco-editor/react')) {
              return 'monaco-react'
            }

            // HeroUI组件库合并
            if (id.includes('@heroui/')) {
              return 'vendor-heroui'
            }

            // React相关库合并
            if (id.includes('react') ||
              id.includes('redux') ||
              id.includes('scheduler') ||
              id.includes('@react-') ||
              id.includes('@reduxjs/')) {
              return 'vendor-react'
            }

            // 编辑器相关库合并（除Monaco外）
            if (id.includes('quill') ||
              id.includes('@xterm/')) {
              return 'vendor-editor'
            }

            // 可视化/图表相关库
            if (id.includes('echarts') ||
              id.includes('three') ||
              id.includes('ogl')) {
              return 'vendor-visual'
            }

            // UI工具库
            if (id.includes('tailwind') ||
              id.includes('framer-motion') ||
              id.includes('lucide-react') ||
              id.includes('dnd-kit') ||
              id.includes('class-variance-authority') ||
              id.includes('clsx')) {
              return 'vendor-ui-utils'
            }

            // 其他工具库
            return 'vendor-others'
          }

          // 应用内部模块分组
          if (id.includes('/components/')) {
            return 'components'
          }

          if (id.includes('/hooks/')) {
            return 'hooks'
          }

          if (id.includes('/utils/')) {
            return 'utils'
          }

          // 创建较大的页面分块
          if (id.includes('/pages/')) {
            const segments = id.split('/')
            const pageName = segments[segments.findIndex(s => s === 'pages') + 1]
            if (pageName) {
              return `page-${pageName}`
            }
          }
        },
        // 控制chunk的大小和命名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        // 入口文件命名
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
    // 启用CSS代码分割
    cssCodeSplit: true,
    // 启用源码映射（生产环境可设为false提高性能）
    sourcemap: false,
    // 最小化混淆
    minify: 'esbuild',
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
