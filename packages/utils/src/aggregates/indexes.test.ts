import { describe, it, expect } from 'vitest'

describe('aggregated index modules import', () => {
  it('root index default and named exports', async () => {
    const mod = await import('../index')
    expect(typeof mod.default).toBe('object')
    expect(typeof mod.sleep).toBe('function')
  }, 20000)

  it('module indexes import and expose members', async () => {
    const mods = [
      '../crypto/index', '../file/index', '../fs/index', '../handler/index', '../media/index', '../module/index', '../network/index', '../npm/index', '../number/index', '../string/index', '../time/index', '../system/index'
    ]
    for (const p of mods) {
      const m = await import(p)
      expect(typeof m).toBe('object')
    }
  })
})
