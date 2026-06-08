import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'tsdown'

const writePm2Entry = () => {
  const file = path.join(process.cwd(), '../core/dist/cli/pm2.js')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, 'import \'node-karin/start\'')
}

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  target: 'node18',
  platform: 'node',
  dts: {
    build: false,
    compilerOptions: {
      declarationMap: false,
      sourceMap: false,
    },
  },
  sourcemap: false,
  minify: false,
  outDir: '../core/dist/cli',
  clean: true,
  deps: {
    alwaysBundle: ['commander', 'yaml'],
    onlyBundle: false,
  },
  onSuccess: writePm2Entry,
  outExtensions ({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.mjs',
      dts: '.d.ts',
    }
  },
})
