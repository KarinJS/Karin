import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'tsdown/config'

export default defineConfig({
  entry: ['src/index.ts', 'src/exports/*.ts'],
  fixedExtension: true, // 固定为mjs
  dts: true,
  format: ['esm'],
  target: 'node18',
  platform: 'node',
  sourcemap: false,
  clean: true,
  treeshake: true,
  hooks: {
    'build:done': async () => {
      /** 递归获取全部d.mts文件 */
      const getAllDMtsFiles = (dir: string): string[] => {
        let results: string[] = []

        const list = fs.readdirSync(dir)

        for (const file of list) {
          const filePath = path.join(dir, file)
          const stat = fs.statSync(filePath)

          if (stat.isDirectory()) {
            /* 如果是目录，则递归获取子目录中的文件 */
            results = results.concat(getAllDMtsFiles(filePath))
          } else if (filePath.endsWith('.d.mts')) {
            /* 如果是 d.mts 文件，则添加到结果中 */
            results.push(filePath)
          }
        }

        return results
      }

      /* 从 dist 目录开始递归搜索 */
      const files = getAllDMtsFiles(path.resolve('./dist'))

      /** 将d.mts重命名为d.ts */
      files.forEach(file => {
        if (fs.existsSync(file)) {
          fs.renameSync(file, file.replace('.d.mts', '.d.ts'))
        }
      })
    },
  },
})
