import fs from 'node:fs'
import path from 'node:path'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const dirs = (globalThis as any).__TEST_DIRS__

const importWithBase = async (base: string) => {
  const oldEnv = { ...process.env }
  process.env.BASE_DIR = base
  vi.resetModules()
  const mod = await import('../store')
  Object.assign(process.env, oldEnv)
  return mod
}

describe('store.plugin 目录', () => {
  beforeEach(() => {
    try { fs.rmSync(dirs.tmpRoot, { recursive: true, force: true }) } catch {}
    fs.mkdirSync(dirs.tmpRoot, { recursive: true })
  })
  afterEach(() => {
    try { fs.rmSync(dirs.tmpRoot, { recursive: true, force: true }) } catch {}
  })

  it('创建插件目录与子目录', async () => {
    const base = path.join(dirs.tmpRoot, 'base')
    const { store } = await importWithBase(base)
    const spyMk = vi.spyOn(fs, 'mkdirSync').mockImplementation(() => undefined as any)
    const b = store.plugin.getBaseDir('p1')
    const c = store.plugin.getConfigDir('p1')
    const d = store.plugin.getDataDir('p1')
    const t = store.plugin.getTempDir('p1')
    const s = store.plugin.getCustomDir('p1', 'sub/x')
    expect(b.replaceAll('\\', '/').endsWith('/p1')).toBe(true)
    expect(c.replaceAll('\\', '/').endsWith('/config')).toBe(true)
    expect(d.replaceAll('\\', '/').endsWith('/data')).toBe(true)
    expect(t.replaceAll('\\', '/').endsWith('/temp')).toBe(true)
    expect(s.replaceAll('\\', '/').endsWith('/sub/x')).toBe(true)
    spyMk.mockRestore()
  })

  it('插件名称缺失抛错', async () => {
    const base = path.join(dirs.tmpRoot, 'base')
    const { store } = await importWithBase(base)
    expect(() => store.plugin.getBaseDir('')).toThrow()
  })
})
