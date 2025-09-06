import defineConfig from 'tsdown-config'

export default defineConfig(
  import.meta.url,
  {
    entry: ['src/index.ts', 'src/exports/*.ts'],
  }
)
