import fs from 'node:fs'
import { builtinModules } from 'node:module'
import { defineConfig } from 'tsdown'

const pkg = JSON.parse(fs.readFileSync(new URL('package.json', import.meta.url), 'utf-8'))

const moduleEntries = [
  'art-template',
  'axios',
  'chalk',
  'chokidar',
  'express',
  'lodash',
  'log4js',
  'moment',
  'node-schedule',
  'redis',
  'sqlite3',
  'ws',
  'yaml',
].reduce<Record<string, string>>((entries, name) => {
  entries[`module/${name}`] = `module/${name}.ts`
  return entries
}, {})

const external = [
  ...builtinModules,
  ...builtinModules.map(name => `node:${name}`),
  ...Object.keys(pkg.dependencies ?? {}),
  '@karinjs/node-pty',
  '@karinjs/plugin-webui-network-monitor',
  '@karinjs/plugin-ffmpeg',
]

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    root: 'src/root.ts',
    'start/index': 'src/start/index.ts',
    'start/app': 'src/start/app.ts',
    ...moduleEntries,
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
  shims: false,
  deps: {
    neverBundle: external,
    skipNodeModulesBundle: true,
    dts: {
      neverBundle: external,
    },
  },
  outExtensions () {
    return {
      js: '.mjs',
      dts: '.d.ts',
    }
  },
})
