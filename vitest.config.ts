import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'packages/core/src'),
    },
  },
  test: {
    include: ['packages/**/tests/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    globals: false,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['packages/core/src/utils/**/*.ts'],
      exclude: [
        '**/*.d.ts',
        'packages/core/src/utils/logger/**',
        'packages/core/src/utils/debug/**',
      ],
    },
  },
})
