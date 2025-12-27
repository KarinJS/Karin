import fs from 'node:fs'
import { glob } from 'glob'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'tsdown/config'
import type { UserConfig } from 'tsdown/config'

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
    external: options.external || [...name, 'tsdown/config'],
    ...options,
    exports: {
      devExports: true,
      customExports: (pkg, context) => {
        if (!context.isPublish || typeof pkg !== 'object' || pkg === null) return pkg
        Object.entries(pkg || {}).forEach(([key, value]) => {
          if (key === './package.json') return
          if (typeof value !== 'string') return

          pkg[key] = {
            types: value.replace(/\.mjs$/, '.d.ts'),
            import: value,
            default: value,
          }
        })
        return pkg
      },
      ...(typeof options.exports === 'object' && options.exports !== null ? options.exports : {}),
    },
  })

  return cfg
}

export {
  config as defineConfig,
  config as default,
}
