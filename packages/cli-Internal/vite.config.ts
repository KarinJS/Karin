import fs from 'node:fs'
import path from 'node:path'
import { builtinModules } from 'node:module'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  const isCoreBuild = mode === 'core'
  const outDir = isCoreBuild ? '../core/dist/cli' : 'dist'

  return {
    build: {
      target: 'node18',
      lib: {
        formats: ['es', 'cjs'],
        fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
        entry: ['src/index.ts'],
      },
      emptyOutDir: true,
      outDir,
      sourcemap: false,
      rolldownOptions: {
        external: [
          ...builtinModules,
          ...builtinModules.map((mod) => `node:${mod}`),
        ],
        output: {
          codeSplitting: false,
        },
      },
      minify: 'terser',
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
          if (!isCoreBuild) {
            return
          }

          const file = path.join(process.cwd(), '../core/dist/cli/pm2.js')
          if (fs.existsSync(file)) {
            fs.unlinkSync(file)
          }
          const content = 'import \'node-karin/start\''
          fs.writeFileSync(file, content)
        },
      },
    ],
  }
})
