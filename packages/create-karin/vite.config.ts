import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import { builtinModules } from 'node:module'

export default defineConfig({
  build: {
    target: 'node18',
    lib: {
      formats: ['es'],
      fileName: () => 'index.mjs',
      entry: ['src/index.ts'],
    },
    emptyOutDir: true,
    outDir: 'dist',
    rollupOptions: {
      external: [
        ...builtinModules,
        ...builtinModules.map((mod) => `node:${mod}`),
      ],
      output: {
        inlineDynamicImports: true,
      },
      cache: false,
    },
    minify: false,
    commonjsOptions: {
      include: [
        /node_modules/,
      ],
    },
  },
  plugins: [
    {
      name: 'karin-cli-plugin',
      closeBundle: () => {
        const tsDir = '../karin-plugin-ts'
        const tsTarget = path.join(process.cwd(), 'templates/karin-plugin-ts')

        const jsDir = '../karin-plugin-js'
        const jsTarget = path.join(process.cwd(), 'templates/karin-plugin-js')

        /** 不复制的文件夹、文件 */
        const ignore = [
          'node_modules',
          'lib',
          'dist',
          '@karinjs',
        ]

        const rmSync = (dir: string) => {
          if (fs.existsSync(dir)) {
            fs.rmSync(dir, { recursive: true, force: true })
          }
        }

        const mkdirSync = (dir: string) => {
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
          }
        }

        /**
         * 复制目录及文件
         * @param src 源目录
         * @param dest 目标目录
         */
        const copyDir = (src: string, dest: string) => {
          mkdirSync(dest)

          /** 源目录文件列表 */
          const entries = fs.readdirSync(src, { withFileTypes: true })

          for (const entry of entries) {
            const srcPath = path.join(src, entry.name)
            const destPath = path.join(dest, entry.name)

            /** 跳过忽略的文件或目录 */
            if (ignore.includes(entry.name)) {
              continue
            }

            if (entry.isDirectory()) {
              /** 递归复制 */
              mkdirSync(destPath)
              copyDir(srcPath, destPath)
            } else {
              fs.copyFileSync(srcPath, destPath)
            }
          }
        }

        try {
          /** 复制 TS 模板 */
          rmSync(tsTarget)
          copyDir(tsDir, tsTarget)

          /** 复制 JS 模板 */
          rmSync(jsTarget)
          copyDir(jsDir, jsTarget)
        } catch (err) {
          console.error('复制模板时出错:', err)
        }
      },
    },
  ],
})
