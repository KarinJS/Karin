import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
  ],
  build: {
    target: 'es2015', // 设置目标环境为浏览器
    lib: {
      // 设置入口文件
      entry: resolve(__dirname, 'src/index.tsx'),
      // 输出的文件名
      fileName: 'index',
      formats: ['umd'],
      name: 'KarinPlugin', // UMD格式需要一个全局变量名
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['react', 'react-dom'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    // 输出目录
    outDir: 'D:/Github/karin-plugin-basic/test',
    // 不生成source map
    sourcemap: false,
    // 清空输出目录
    emptyOutDir: true,
    // 资源处理 - 40KB以下的资源内联到JS中，超过的提取为单独文件
    assetsInlineLimit: 40 * 1024, // 40KB
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
})
