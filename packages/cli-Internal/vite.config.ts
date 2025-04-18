import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import { builtinModules } from 'node:module'

export default defineConfig({
  build: {
    target: 'node18',
    lib: {
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
      entry: ['src/index.ts'],
    },
    emptyOutDir: true,
    outDir: process.argv[4] === 'development' ? 'dist' : '../core/dist/cli',
    rollupOptions: {
      external: [
        ...builtinModules,
        ...builtinModules.map((mod) => `node:${mod}`),
      ],
      output: {
        inlineDynamicImports: true,
      },
      cache: false,
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
        if (process.argv[4] === 'development') {
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
})
