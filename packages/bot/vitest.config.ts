import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: [
      'test/**/*.ts',
      'src/**/*.spec.ts',
    ],
    exclude: [
      'node_modules',
      'dist',
      '**/dist/**',
    ],
    environment: 'node',
    reporters: ['default'],
    coverage: {
      provider: 'v8',
      enabled: true,
      reportsDirectory: 'coverage',
      reporter: ['text', 'html', 'json'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.d.ts',
      ],
    },
  },
})

