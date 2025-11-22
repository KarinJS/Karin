import { describe, it, expect, vi } from 'vitest'

describe('path/parse platform branches', async () => {
  it('handles sep branch when path.sep is /', async () => {
    vi.resetModules()
    vi.doMock('node:path', async () => {
      const real = await vi.importActual<any>('node:path')
      return { ...real, sep: '/' }
    })
    const mod = await import('./parse')
    expect(mod.split('file:///a/b')).toEqual({ dirname: 'a', basename: 'b' })
  })
})
