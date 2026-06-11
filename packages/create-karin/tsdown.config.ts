import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'tsdown'

const copyTemplates = () => {
  const templates = [
    {
      source: '../karin-plugin-ts',
      target: 'templates/karin-plugin-ts',
    },
    {
      source: '../karin-plugin-js',
      target: 'templates/karin-plugin-js',
    },
  ]

  const ignore = new Set([
    'node_modules',
    'lib',
    'dist',
    '@karinjs',
  ])

  const copyDir = (source: string, target: string) => {
    fs.mkdirSync(target, { recursive: true })

    const entries = fs.readdirSync(source, { withFileTypes: true })
    for (const entry of entries) {
      if (ignore.has(entry.name)) continue

      const sourcePath = path.join(source, entry.name)
      const targetPath = path.join(target, entry.name)

      if (entry.isDirectory()) {
        copyDir(sourcePath, targetPath)
        continue
      }

      fs.copyFileSync(sourcePath, targetPath)
    }
  }

  for (const item of templates) {
    const source = path.resolve(process.cwd(), item.source)
    const target = path.resolve(process.cwd(), item.target)

    fs.rmSync(target, { recursive: true, force: true })
    copyDir(source, target)
  }
}

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
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
  outDir: 'dist',
  clean: true,
  deps: {
    alwaysBundle: ['@karinjs/axios', 'kolorist', 'ora', 'prompts', 'strip-json-comments'],
    onlyBundle: false,
  },
  onSuccess: copyTemplates,
  outExtensions () {
    return {
      js: '.mjs',
      dts: '.d.ts',
    }
  },
})
