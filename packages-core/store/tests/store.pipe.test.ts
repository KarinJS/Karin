import fs from 'node:fs'
import path from 'node:path'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const dirs = (globalThis as any).__TEST_DIRS__

const importWithEnv = async (env: Record<string, string | undefined>) => {
  const oldEnv = { ...process.env }
  Object.assign(process.env, env)
  vi.resetModules()
  const mod = await import('../src/store')
  Object.assign(process.env, oldEnv)
  return mod
}

describe('store.pipe 命名管道', () => {
  beforeEach(() => {
    try { fs.rmSync(dirs.tmpRoot, { recursive: true, force: true }) } catch { }
    fs.mkdirSync(dirs.tmpRoot, { recursive: true })
  })
  afterEach(() => {
    try { fs.rmSync(dirs.tmpRoot, { recursive: true, force: true }) } catch { }
  })

  it('Windows 平台返回 \\\.\\pipe\\name', async () => {
    const { store } = await importWithEnv({ STORE_PLATFORM: 'win32' })
    const p = store.pipe.getPath('my')
    expect(p).toBe('\\\\.\\pipe\\my')
    expect(store.pipe.exists('my')).toBe(false)
    expect(store.pipe.list()).toEqual([])
    expect(store.pipe.cleanAll()).toBe(0)
    expect(store.pipe.clean('any')).toBe(true)
  })

  it('Unix 平台创建并管理 sock 文件', async () => {
    const base = path.join(dirs.tmpRoot, 'base')
    const { store } = await importWithEnv({ STORE_PLATFORM: 'linux', BASE_DIR: base })
    const p = store.pipe.getPath('app')
    expect(p.replaceAll('\\', '/').endsWith('/app.sock')).toBe(true)
    let deleted = false
    const origExists = fs.existsSync
    const spyExists = vi.spyOn(fs, 'existsSync').mockImplementation((x: any) => (x === p ? !deleted : origExists(x)))
    const spyRead = vi.spyOn(fs, 'readdirSync').mockImplementation(() => ['app.sock'])
    const spyUnlink = vi.spyOn(fs, 'unlinkSync').mockImplementation(() => { deleted = true })
    expect(store.pipe.exists('app')).toBe(true)
    expect(store.pipe.list()).toEqual(['app.sock'])
    expect(store.pipe.cleanAll()).toBeGreaterThanOrEqual(1)
    spyExists.mockRestore(); spyRead.mockRestore(); spyUnlink.mockRestore()
  })

  it('Unix 列表读取异常返回空', async () => {
    const base = path.join(dirs.tmpRoot, 'base2')
    const { store } = await importWithEnv({ STORE_PLATFORM: 'linux', BASE_DIR: base })
    const dir = store.pipe.getDir()
    fs.mkdirSync(dir, { recursive: true })
    const spy = vi.spyOn(fs, 'readdirSync').mockImplementation(() => { throw new Error('x') })
    expect(store.pipe.list()).toEqual([])
    spy.mockRestore()
  })

  it('Unix 列表目录不存在返回空', async () => {
    const base = path.join(dirs.tmpRoot, 'base4')
    const { store } = await importWithEnv({ STORE_PLATFORM: 'linux', BASE_DIR: base })
    const dir = store.pipe.getDir()
    const spy = vi.spyOn(fs, 'existsSync').mockImplementation((p: any) => {
      if (typeof p === 'string' && p === dir) return false
      return (fs as any).existsSync(p)
    })
    expect(store.pipe.list()).toEqual([])
    spy.mockRestore()
  })

  it('Unix clean 缺失文件返回 false', async () => {
    const base = path.join(dirs.tmpRoot, 'base5')
    const { store } = await importWithEnv({ STORE_PLATFORM: 'linux', BASE_DIR: base })
    expect(store.pipe.clean('missing')).toBe(false)
  })

  it('Unix exists 不存在返回 false', async () => {
    const base = path.join(dirs.tmpRoot, 'base3')
    const { store } = await importWithEnv({ STORE_PLATFORM: 'linux', BASE_DIR: base })
    expect(store.pipe.exists('missing')).toBe(false)
  })

  it('Unix cleanAll 清理失败返回 0', async () => {
    const base = path.join(dirs.tmpRoot, 'base6')
    const { store } = await importWithEnv({ STORE_PLATFORM: 'linux', BASE_DIR: base })
    const p = store.pipe.getPath('app')
    const dir = store.pipe.getDir()
    const spyRead = vi.spyOn(fs, 'readdirSync').mockImplementation(() => ['app.sock'])
    const origExists = fs.existsSync
    const spyExists = vi.spyOn(fs, 'existsSync').mockImplementation((x: any) => (x === p ? true : origExists(x)))
    const spyUnlink = vi.spyOn(fs, 'unlinkSync').mockImplementation(() => undefined)
    expect(store.pipe.cleanAll()).toBe(0)
    spyRead.mockRestore(); spyExists.mockRestore(); spyUnlink.mockRestore()
  })
})
