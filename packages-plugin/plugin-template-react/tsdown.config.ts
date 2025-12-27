import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'tsdown-config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const html = fs.readFileSync(path.join(__dirname, 'src/public', 'react.html'), 'utf-8')
const tailwind = fs.readFileSync(path.join(__dirname, 'src/public', 'tailwindcss.js'), 'utf-8')

export default defineConfig({
  entry: ['src/index.ts'],
  shims: true,
  external: [
    'esbuild-wasm',
  ],
  define: {
    'process.env.__HTML__': JSON.stringify(html),
    'process.env.__TAILWIND__': JSON.stringify(tailwind),
  },
})
