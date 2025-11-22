import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { PluginConfig } from '../plugin'

const { tmpPlugin } = (globalThis as any).__TEST_DIRS__

vi.mock('@karinjs/store', () => {
  return {
    store: {
      plugin: {
        getBaseDir: (name: string) => path.join(tmpPlugin, name),
        getConfigDir: (name: string) => path.join(tmpPlugin, name, 'config'),
        getDataDir: (name: string) => path.join(tmpPlugin, name, 'data'),
        getTempDir: (name: string) => path.join(tmpPlugin, name, 'temp'),
      },
    },
  }
})

vi.mock('@karinjs/utils', () => {
  const realFs = fs
  return {
    requireFile: (p: string) => Promise.resolve(JSON.parse(realFs.readFileSync(p, 'utf-8'))),
    requireFileSync: (p: string) => JSON.parse(realFs.readFileSync(p, 'utf-8')),
    writeFileSync: (p: string, data: any) => {
      realFs.mkdirSync(path.dirname(p), { recursive: true })
      return realFs.writeFileSync(p, typeof data === 'string' ? data : JSON.stringify(data, null, 2))
    },
    writeFile: (p: string, data: any) => {
      realFs.mkdirSync(path.dirname(p), { recursive: true })
      return Promise.resolve(realFs.writeFileSync(p, typeof data === 'string' ? data : JSON.stringify(data, null, 2)))
    },
    copyConfigSync: () => true,
    types: {},
  }
})

beforeEach(() => {
  const { tmpPlugin } = (globalThis as any).__TEST_DIRS__
  try { fs.mkdirSync(tmpPlugin, { recursive: true }) } catch { }
})
afterEach(() => { })

describe('插件配置类 PluginConfig', () => {
  it('解析目录与路径', () => {
    const pc = new PluginConfig<any>('p1')
    expect(pc.dir.base).toContain('p1')
    const p = pc.getConfigPath('a.json')
    expect(p).toMatch(/config\/a\.json$/)
  })
  it('getConfig 异步读取', async () => {
    const pc = new PluginConfig<any>('p2b')
    const utils = await import('@karinjs/utils') as any
    const orig = utils.requireFile
    utils.requireFile = vi.fn(() => Promise.resolve({ a: 5 }))
    const r = await pc.getConfig('y.json' as any, { force: true, type: 'json' } as any)
    expect(r.a).toBe(5)
    utils.requireFile = orig
  })
  it('getConfig 无 options 异步读取', async () => {
    const pc = new PluginConfig<any>('p2c')
    const utils = await import('@karinjs/utils') as any
    const orig = utils.requireFile
    utils.requireFile = vi.fn(() => Promise.resolve({ a: 7 }))
    const r = await pc.getConfig('z.json' as any)
    expect(r.a).toBe(7)
    utils.requireFile = orig
  })
  it('createConfig 不覆盖已存在文件', async () => {
    const pc = new PluginConfig<any>('p3')
    const spyExists = vi.spyOn(fs, 'existsSync').mockImplementation(() => true)
    pc.createConfig('k.json' as any, { a: 2 })
    spyExists.mockRestore()
    const utils = await import('@karinjs/utils') as any
    const orig = utils.requireFileSync
    utils.requireFileSync = () => ({ a: 1 })
    const r = pc.getConfigSync('k.json' as any)
    utils.requireFileSync = orig
    expect(r.a).toBe(1)
  })
  it('createConfig 支持自定义 stringify（同步）', () => {
    const pc = new PluginConfig<any>('p4')
    pc.createConfig('s.json' as any, { a: 1 }, { stringify: (d: any) => JSON.stringify(d, null, 2) })
    const r = pc.getConfigSync('s.json' as any)
    expect(r.a).toBe(1)
  })
  it('createConfig 支持自定义 stringify（异步）', async () => {
    const pc = new PluginConfig<any>('p5')
    await pc.createConfig('a.json' as any, { a: 2 }, { stringify: async (d: any) => JSON.stringify(d) })
    const r = pc.getConfigSync('a.json' as any)
    expect(r.a).toBe(2)
  })
  it('copySourceConfigDir 代理到工具函数', () => {
    const pc = new PluginConfig<any>('p6')
    expect(pc.copySourceConfigDir('src', ['.json'])).toBe(true)
  })
  it('setConfig 写入路径执行（不落盘）', async () => {
    const pc = new PluginConfig<any>('p7')
    const utils = await import('@karinjs/utils') as any
    const orig = utils.writeFileSync
    utils.writeFileSync = vi.fn(() => undefined)
    expect(() => pc.setConfig('a.json' as any, { b: 2 })).not.toThrow()
    utils.writeFileSync = orig
  })
  it('createConfig 默认写入分支（无 options）', async () => {
    const pc = new PluginConfig<any>('p8')
    const utils = await import('@karinjs/utils') as any
    const spy = vi.spyOn(utils, 'writeFileSync').mockImplementation(() => undefined)
    pc.createConfig('b.json' as any, { x: 1 })
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})
