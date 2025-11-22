import fs from 'node:fs'
import path from 'node:path'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const dirs = (globalThis as any).__TEST_DIRS__

const withEnvImport = async (env: Record<string, string | undefined>, fn: (mod: any) => void | Promise<void>) => {
  const oldEnv = { ...process.env }
  Object.assign(process.env, env)
  vi.resetModules()
  const mod = await import('../store')
  try { await fn(mod) } finally {
    Object.assign(process.env, oldEnv)
    vi.resetModules()
  }
}

describe('store.core 基础路径', () => {
  beforeEach(() => {
    try { fs.rmSync(dirs.tmpRoot, { recursive: true, force: true }) } catch {}
    fs.mkdirSync(dirs.tmpRoot, { recursive: true })
  })
  afterEach(() => {
    try { fs.rmSync(dirs.tmpRoot, { recursive: true, force: true }) } catch {}
  })

  it('BASE_DIR 自定义为绝对路径', async () => {
    const base = path.join(dirs.tmpRoot, 'base')
    await withEnvImport({ BASE_DIR: base }, ({ store }) => {
      expect(store.baseDir.replaceAll('\\', '/')).toMatch(/\/\.tmp-test\/base$/)
      expect(store.core.config.endsWith('/core/config')).toBe(true)
      expect(store.core.temp.endsWith('/temp')).toBe(true)
    })
  })

  it('CORE_DIR_NAME/TEMP_DIR_NAME 自定义与非法值回退', async () => {
    const base = path.join(dirs.tmpRoot, 'base2')
    await withEnvImport({ BASE_DIR: base, CORE_DIR_NAME: 'coreX', TEMP_DIR_NAME: 'tempX' }, ({ store }) => {
      expect(store.core.dir.endsWith('/coreX')).toBe(true)
      expect(store.core.temp.endsWith('/tempX')).toBe(true)
    })
    await withEnvImport({ BASE_DIR: base, CORE_DIR_NAME: 'a/b', TEMP_DIR_NAME: 'c/d' }, ({ store }) => {
      expect(store.core.dir.endsWith('/core')).toBe(true)
      expect(store.core.temp.endsWith('/temp')).toBe(true)
    })
  })
})

describe('store.pkg 工程路径', () => {
  it('root/main/isPackaged/webui/pm2 计算', async () => {
    await withEnvImport({}, ({ store }) => {
      expect(store.pkg.root.replaceAll('\\', '/')).toMatch(/\/packages\/core$/)
      expect(store.pkg.isPackaged).toBe(false)
      expect(store.pkg.main.endsWith('/dist/index.js')).toBe(true)
      expect(store.pkg.webui.endsWith('/dist/webui')).toBe(true)
      expect(store.pkg.pm2.replaceAll('\\', '/').endsWith('/pm2.json')).toBe(true)
    })
    await withEnvImport({ STORE_PKG_PACKAGED: '1' }, ({ store }) => {
      expect(store.pkg.root.replaceAll('\\', '/')).toMatch(/\/node_modules\/karin$/)
      expect(store.pkg.isPackaged).toBe(true)
      expect(store.pkg.main.endsWith('/dist/index.js')).toBe(true)
      expect(store.pkg.karin.replaceAll('\\', '/').endsWith('/package.json')).toBe(true)
    })
  })
})
