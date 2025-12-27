/**
 * Context 单元测试
 * @module tests/context.test
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { setContext, getContext, clearContext, withContext } from '../src/create/context'

describe('Context', () => {
  beforeEach(() => {
    clearContext()
  })

  describe('setContext / getContext', () => {
    it('should set and get context', () => {
      setContext('test-pkg', '/path/to/file.ts')

      const ctx = getContext()
      expect(ctx.pkg).toBe('test-pkg')
      expect(ctx.file).toBe('/path/to/file.ts')
    })

    it('should return default context when not set', () => {
      const ctx = getContext()
      expect(ctx.pkg).toBe('unknown')
      expect(ctx.file).toBe('unknown')
    })

    it('should overwrite previous context', () => {
      setContext('pkg1', '/file1.ts')
      setContext('pkg2', '/file2.ts')

      const ctx = getContext()
      expect(ctx.pkg).toBe('pkg2')
      expect(ctx.file).toBe('/file2.ts')
    })
  })

  describe('clearContext', () => {
    it('should clear context', () => {
      setContext('test-pkg', '/path/to/file.ts')
      clearContext()

      const ctx = getContext()
      expect(ctx.pkg).toBe('unknown')
      expect(ctx.file).toBe('unknown')
    })

    it('should be safe to call multiple times', () => {
      clearContext()
      clearContext()
      clearContext()
    })
  })

  describe('withContext', () => {
    it('should execute function with context', async () => {
      const result = await withContext('test-pkg', '/file.ts', () => {
        const ctx = getContext()
        return { pkg: ctx.pkg, file: ctx.file }
      })

      expect(result.pkg).toBe('test-pkg')
      expect(result.file).toBe('/file.ts')
    })

    it('should restore previous context after execution', async () => {
      setContext('outer-pkg', '/outer.ts')

      await withContext('inner-pkg', '/inner.ts', () => {
        const ctx = getContext()
        expect(ctx.pkg).toBe('inner-pkg')
      })

      const ctx = getContext()
      expect(ctx.pkg).toBe('outer-pkg')
    })

    it('should restore context even if function throws', async () => {
      setContext('outer-pkg', '/outer.ts')

      try {
        await withContext('inner-pkg', '/inner.ts', () => {
          throw new Error('Test error')
        })
      } catch {
        // Expected
      }

      const ctx = getContext()
      expect(ctx.pkg).toBe('outer-pkg')
    })

    it('should work with async functions', async () => {
      const result = await withContext('test-pkg', '/file.ts', async () => {
        await new Promise(resolve => setTimeout(resolve, 10))
        return getContext().pkg
      })

      expect(result).toBe('test-pkg')
    })

    it('should handle nested withContext calls', async () => {
      const results: string[] = []

      await withContext('pkg1', '/file1.ts', async () => {
        results.push(getContext().pkg)

        await withContext('pkg2', '/file2.ts', async () => {
          results.push(getContext().pkg)

          await withContext('pkg3', '/file3.ts', () => {
            results.push(getContext().pkg)
          })

          results.push(getContext().pkg)
        })

        results.push(getContext().pkg)
      })

      expect(results).toEqual(['pkg1', 'pkg2', 'pkg3', 'pkg2', 'pkg1'])
    })

    it('should restore null context', async () => {
      clearContext()

      await withContext('test-pkg', '/file.ts', () => {
        expect(getContext().pkg).toBe('test-pkg')
      })

      expect(getContext().pkg).toBe('unknown')
    })
  })
})
