import fs from 'node:fs'
import { glob } from 'glob'
import { fileURLToPath } from 'node:url'
import { defineConfig, UserConfig } from 'tsdown/config'

const list = glob.sync('*/package.json', {
  cwd: fileURLToPath(import.meta.url + '../../../..'),
  absolute: true,
})

const name = list.map(file => JSON.parse(fs.readFileSync(file, 'utf-8')).name)

/**
 * tsdown配置
 * @param fileUrl - import.meta.url
 * @param options - tsdown配置选项
 */
const config = (options: UserConfig = {}): UserConfig => {
  const cfg: UserConfig = defineConfig({
    entry: ['./src/index.ts'],
    outExtensions: (context) => {
      if (context.format === 'es') {
        return {
          js: '.mjs',
          dts: '.d.ts',
        }
      }

      return { js: '.js', dts: '.d.ts' }
    },
    dts: true,
    format: ['esm'],
    target: 'node18',
    platform: 'node',
    sourcemap: false,
    outDir: 'dist',
    clean: true,
    treeshake: true,
    external: [...name, 'tsdown/config'],
    ...options,
  })

  return cfg
}

export default config
