import { builtinModules } from 'node:module'
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
  },
  format: ['esm'],
  target: 'node18',
  platform: 'node',
  clean: true,
  dts: {
    compilerOptions: {
      declarationMap: false,
      sourceMap: false,
    },
  },
  sourcemap: false,
  treeshake: true,
  minify: false,
  shims: true,
  deps: {
    neverBundle: [
      ...builtinModules,
      ...builtinModules.map(name => `node:${name}`),
      'ws',
    ],
    skipNodeModulesBundle: true,
  },
  outExtensions () {
    return {
      js: '.mjs',
      dts: '.d.ts',
    }
  },
})
