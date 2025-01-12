import fs from 'node:fs'
import { URL } from 'node:url'
import { Options } from 'tsup'
import { defineConfig } from 'tsup'

// 排除掉`package.json`文件不删除 输出目录其他文件删除
const files = fs.readdirSync(new URL('packages/types', import.meta.url))
files.forEach((file) => {
  if (file !== 'package.json') {
    fs.rmSync(new URL(`packages/types/${file}`, import.meta.url), { recursive: true })
  }
})
// 创建空的`index.d.ts`文件
fs.writeFileSync(new URL('packages/types/index.d.ts', import.meta.url), '', 'utf-8')

const pkg = JSON.parse(fs.readFileSync(new URL('package.json', import.meta.url), 'utf-8'))

/**
 * @description `tsup` configuration options
 */
export const options: Options = {
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node16',
  splitting: false,
  sourcemap: false,
  clean: false,
  dts: true,
  outDir: 'packages/types',
  treeshake: false,
  external: Object.keys(pkg.dependencies),
  ignoreWatch: ['src/modules'],
}

export default defineConfig(options)
