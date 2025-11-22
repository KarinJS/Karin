import { describe, it, expect, vi } from 'vitest'
import path from 'node:path'
import os from 'node:os'

describe('file/config errors', () => {
  it('copyConfigSync throws on invalid src and target type', async () => {
    const base = path.join(os.tmpdir(), `karin-${Date.now()}-${Math.random()}`)
    vi.doMock('@karinjs/store', async () => ({ karinPathBase: base }))
    const { CreateConfig } = await import('./config')
    const cc = new CreateConfig('p')
    expect(() => cc.copyConfigSync(path.join(os.tmpdir(), 'missing'))).toThrow()
    expect(() => cc.copyConfigSync(os.tmpdir(), { target: 123 as any })).toThrow()
  })

  it('copyConfig throws on invalid src and target type', async () => {
    const base = path.join(os.tmpdir(), `karin-${Date.now()}-${Math.random()}`)
    vi.doMock('@karinjs/store', async () => ({ karinPathBase: base }))
    const { CreateConfig } = await import('./config')
    const cc = new CreateConfig('p')
    await expect(cc.copyConfig(os.tmpdir(), { target: 123 as any })).rejects.toThrow()
    await expect(cc.copyConfig(path.join(os.tmpdir(), 'missing'))).rejects.toThrow()
  })
})