import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const root = path.dirname(fileURLToPath(import.meta.url))
const resolve = (...paths: string[]) => path.resolve(root, ...paths)

export default defineConfig({
  test: {
    projects: [
      {
        resolve: {
          alias: {
            '@': resolve('packages/core/src'),
          },
        },
        test: {
          name: 'core',
          root: resolve('packages/core'),
          include: ['src/**/*.test.ts'],
        },
      },
      {
        test: {
          name: 'cli',
          root: resolve('packages/cli-Internal'),
          include: ['src/**/*.test.ts'],
        },
      },
      {
        test: {
          name: 'create-karin',
          root: resolve('packages/create-karin'),
          include: ['src/**/*.test.ts'],
        },
      },
    ],
  },
})
