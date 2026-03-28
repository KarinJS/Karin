import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { codeInspectorPlugin } from 'code-inspector-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    codeInspectorPlugin({
      bundler: 'vite',
      showSwitch: true,
      hotKeys: ['shiftKey', 'altKey'],
    }),
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  build: {
    outDir: '../loader/dist/web_chunk',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // 2.0 WebUI 新接口代理到 1.0 后端 (7777 端口)
      // '/api/v2': {
      //   target: 'http://127.0.0.1:7777',
      //   changeOrigin: true,
      // },
      '/api/v2': {
        target: 'https://m1.apifoxmock.com/m1/8014685-7769200-default',
        changeOrigin: true,
      },
      // 1.0 后端的其他接口也代理过去
      '/api/v1': {
        target: 'http://127.0.0.1:7777',
        changeOrigin: true,
      },
      // WebSocket 连接
      '/ws': {
        target: 'ws://127.0.0.1:7777',
        ws: true,
        changeOrigin: true
      },
    }
  }
})



