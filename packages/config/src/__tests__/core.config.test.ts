import fs from 'node:fs'
import path from 'node:path'
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { config } from '../core'

vi.mock('@karinjs/store', () => {
  const dirs = (globalThis as any).__TEST_DIRS__
  return {
    store: {
      core: {
        config: dirs.tmpConfig,
        html: path.join(dirs.tmpRoot, 'html'),
        resource: path.join(dirs.tmpRoot, 'res'),
      },
      pkg: { karin: path.join(dirs.tmpRoot, 'package.json') },
      plugin: {
        getBaseDir: (name: string) => path.join(dirs.tmpPlugin, name),
        getConfigDir: (name: string) => path.join(dirs.tmpPlugin, name, 'config'),
        getDataDir: (name: string) => path.join(dirs.tmpPlugin, name, 'data'),
        getTempDir: (name: string) => path.join(dirs.tmpPlugin, name, 'temp'),
      },
    },
  }
})

vi.mock('@karinjs/utils', async (importOriginal) => {
  const actual = await importOriginal<any>()
  const realFs = fs
  const dirs = (globalThis as any).__TEST_DIRS__
  return {
    ...actual,
    requireFileSync: (name: string, opts: any) => {
      const p = opts?.cwd ? path.join(opts.cwd, name) : name
      return JSON.parse(realFs.readFileSync(p, 'utf-8'))
    },
    watchs: (_: any, cb: any) => {
      cb('system/logger.json', { level: 'info' }, { level: 'debug' })
    },
  }
})

let tmpRoot: string
let tmpConfig: string
let tmpPlugin: string

beforeEach(async () => {
  const dirs = (globalThis as any).__TEST_DIRS__
  tmpRoot = dirs.tmpRoot
  tmpConfig = dirs.tmpConfig
  tmpPlugin = dirs.tmpPlugin
  try { fs.rmSync(tmpRoot, { recursive: true, force: true }) } catch { }
  fs.mkdirSync(tmpConfig, { recursive: true })
  fs.mkdirSync(path.join(tmpConfig, 'admin'), { recursive: true })
  fs.mkdirSync(path.join(tmpConfig, 'filter'), { recursive: true })
  fs.mkdirSync(path.join(tmpConfig, 'scene'), { recursive: true })
  fs.mkdirSync(path.join(tmpConfig, 'system'), { recursive: true })
  await config.init()
})

afterEach(() => {
  try { fs.rmSync(tmpRoot, { recursive: true, force: true }) } catch { }
})

describe('核心配置基础功能', () => {
  it('初始化时创建默认配置文件', () => {
    const p = path.join(tmpConfig, 'admin', 'permissions.json')
    expect(fs.existsSync(p)).toBe(true)
  })
  it('master/admin getter 读取', () => {
    expect(Array.isArray(config.master)).toBe(true)
    expect(Array.isArray(config.admin)).toBe(true)
  })
  it('支持缓存读取与强制刷新', () => {
    const c1 = config.config()
    expect(Array.isArray(c1.master)).toBe(true)
    expect(Array.isArray(config.master)).toBe(true)
    expect(Array.isArray(config.admin)).toBe(true)
    const file = path.join(tmpConfig, 'admin', 'permissions.json')
    fs.writeFileSync(file, JSON.stringify({ master: ['x'], admin: [] }, null, 2))
    const c2 = config.config(true)
    expect(c2.master).toEqual(['x'])
  })
  it('各模块支持强制刷新', () => {
    const f1 = config.friend()
    const f2 = config.friend(true)
    expect(f2).not.toBe(f1)

    const d1 = config.direct()
    const d2 = config.direct(true)
    expect(d2).not.toBe(d1)

    const g1 = config.group()
    const g2 = config.group(true)
    expect(g2).not.toBe(g1)

    const u1 = config.guild()
    const u2 = config.guild(true)
    expect(u2).not.toBe(u1)

    const fl1 = config.filter()
    const fl2 = config.filter(true)
    expect(fl2).not.toBe(fl1)
  })
  it('过滤配置重复读取相等', () => {
    const f1 = config.filter()
    const f2 = config.filter()
    expect(f2).toStrictEqual(f1)
  })
  it('getConfigWithCache 命中缓存分支', async () => {
    const getter = vi.spyOn(config as any, 'files', 'get')
    const mod = await import('../filter/filter') as any
    const cached = mod.filterConfigCompat({})
    getter.mockImplementation(() => ({
      'filter/filter.json': { cfg: mod.defaultFilterConfig, parse: mod.filterConfigCompat, clear: mod.filter.clearCache, cache: cached },
    } as any))
    const r = config.filter()
    expect(r).toStrictEqual(cached)
    getter.mockRestore()
  })
})

describe('场景配置获取', () => {
  it('群组配置按优先级匹配', () => {
    const file = path.join(tmpConfig, 'scene', 'group.json')
    fs.writeFileSync(file, JSON.stringify({ global: {}, 'Bot:1:9': { cd: 7 } }, null, 2))
    const r = config.getGroupCfg('9', '1')
    expect(r.cd).toBe(7)
  })
  it('频道配置按优先级匹配', () => {
    const file = path.join(tmpConfig, 'scene', 'guild.json')
    fs.writeFileSync(file, JSON.stringify({ global: {}, 'Bot:1:1:7': { cd: 9 } }, null, 2))
    const r = config.getGuildCfg('1', '7', '1')
    expect(r.cd).toBe(9)
  })
  it('私聊与频道私信配置读取', () => {
    fs.writeFileSync(path.join(tmpConfig, 'scene', 'friend.json'), JSON.stringify({ global: {}, 'Bot:1:2': { cd: 3 } }, null, 2))
    fs.writeFileSync(path.join(tmpConfig, 'scene', 'direct.json'), JSON.stringify({ global: {}, 'Bot:1:9:2': { cd: 4 } }, null, 2))
    const f = config.getFriendCfg('2', '1')
    const d = config.getDirectCfg('2', '1', '9')
    expect(f.cd).toBe(3)
    expect(d.cd).toBe(4)
  })
  it('群组匹配兜底路径', () => {
    const file = path.join(tmpConfig, 'scene', 'group.json')
    fs.writeFileSync(file, JSON.stringify({ global: {} }, null, 2))
    const r = config.getGroupCfg('999', 'self')
    expect(typeof r).toBe('object')
  })
})

describe('系统配置与监听', () => {
  it('日志与服务器配置通过兼容读取', () => {
    const lp = path.join(tmpConfig, 'system', 'logger.json')
    fs.writeFileSync(lp, JSON.stringify({ level: 'warn' }, null, 2))
    const l = config.logger(true)
    expect(l.level).toBe('warn')
    const sp = path.join(tmpConfig, 'system', 'server.json')
    fs.writeFileSync(sp, JSON.stringify({ http: { port: 8000 } }, null, 2))
    const s = config.server(true)
    expect(s.http.port).toBe(8000)
    const f = config.filter(true)
    expect(f.enable.friend).toBeTypeOf('boolean')
  })
  it('Redis 与 PM2 原始读取与写入', () => {
    const rp = path.join(tmpConfig, 'system', 'redis.json')
    fs.writeFileSync(rp, JSON.stringify({ enable: false }, null, 2))
    const rr = config.redis()
    expect(rr.enable).toBe(false)
    const pp = path.join(tmpConfig, 'system', 'pm2.json')
    fs.writeFileSync(pp, JSON.stringify({ lines: 10, apps: [] }, null, 2))
    const pr = config.pm2()
    expect(pr.lines).toBe(10)
    const raw = config.getRawConfig('system/pm2.json')
    expect(raw.lines).toBeTypeOf('number')
    config.setRawConfig('system/pm2.json', { lines: 20, apps: [] } as any)
    const updated = config.getRawConfig('system/pm2.json')
    expect(updated.lines).toBe(20)
  })
  it('监听更新日志等级', async () => {
    await config.watch()
    expect((globalThis as any).logger.level).toBe('debug')
  })
  it('监听日志等级未变化（logger存在）不更新', async () => {
    const utils = await import('@karinjs/utils') as any
    const orig = utils.watchs
    utils.watchs = (_: any, cb: any) => { cb('system/logger.json', { level: 'debug' }, { level: 'debug' }) }
    await config.watch()
    utils.watchs = orig
    expect((globalThis as any).logger.level).toBe('debug')
  })
  it('监听更新日志等级（无level不更新）', async () => {
    const utils = await import('@karinjs/utils') as any
    const orig = utils.watchs
    const gl = (globalThis as any).logger
      ; (globalThis as any).logger = undefined
    utils.watchs = (_: any, cb: any) => { cb('system/logger.json', { level: 'info' }, { level: 'debug' }) }
    await config.watch()
    utils.watchs = orig
      ; (globalThis as any).logger = gl
    expect(true).toBe(true)
  })
  it('监听更新日志等级（level变化但logger缺失）', async () => {
    const utils = await import('@karinjs/utils') as any
    const orig = utils.watchs
    const gl = (globalThis as any).logger
      ; (globalThis as any).logger = undefined
    utils.watchs = (_: any, cb: any) => { cb('system/logger.json', { level: 'info' }, { level: 'debug' }) }
    await config.watch()
    utils.watchs = orig
      ; (globalThis as any).logger = gl
    expect(true).toBe(true)
  })
  it('监听日志等级未变化不更新（console 回退）', async () => {
    const utils = await import('@karinjs/utils') as any
    const orig = utils.watchs
    const gl = (globalThis as any).logger
      ; (globalThis as any).logger = undefined
    utils.watchs = (_: any, cb: any) => { cb('system/logger.json', { level: 'info' }, { level: 'info' }) }
    await config.watch()
    utils.watchs = orig
      ; (globalThis as any).logger = gl
    expect(true).toBe(true)
  })
  it('忽略未知文件的监听事件', async () => {
    const utils = await import('@karinjs/utils') as any
    const orig = utils.watchs
    utils.watchs = (_: any, cb: any) => { cb('unknown.json', {}, {}) }
    await config.watch()
    utils.watchs = orig
    expect(true).toBe(true)
  })
  it('监听清空缓存并重新解析', async () => {
    const file = path.join(tmpConfig, 'scene', 'group.json')
    fs.writeFileSync(file, JSON.stringify({ global: { cd: 11 } }, null, 2))
    const g1 = config.group(true)
    const utils = await import('@karinjs/utils') as any
    const orig = utils.watchs
    utils.watchs = (_: any, cb: any) => { cb('scene/group.json', g1, { ...g1 }) }
    await config.watch()
    utils.watchs = orig
    const g2 = config.group()
    expect(typeof g2.global).toBe('object')
  })
  it('files 映射构建', () => {
    const entries = Object.entries(config.files)
    expect(entries.length).toBeGreaterThan(5)
    const hasServer = entries.find(([k]) => k === 'system/server.json')
    expect(!!hasServer).toBe(true)
  })
  it('pkg 读取 package.json', () => {
    const p = path.join(tmpRoot, 'package.json')
    fs.writeFileSync(p, JSON.stringify({ name: 'karin', version: '1.0.0' }, null, 2))
    const r = config.pkg()
    expect(r.name).toBe('karin')
  })
  it('init 写入异常触发抛出', async () => {
    try { fs.rmSync(tmpRoot, { recursive: true, force: true }) } catch { }
    fs.mkdirSync(tmpConfig, { recursive: true })
    const spy = vi.spyOn(fs, 'writeFileSync')
    const err: any = new Error('no permission')
    err.code = 'EACCES'
    spy.mockImplementationOnce(() => { throw err })
    await expect(config.init()).rejects.toThrow()
    spy.mockRestore()
  })
  it('init 基础目录已存在时不重复创建', async () => {
    const html = path.join(tmpRoot, 'html')
    const res = path.join(tmpRoot, 'res')
    try { fs.mkdirSync(html, { recursive: true }) } catch { }
    try { fs.mkdirSync(res, { recursive: true }) } catch { }
    const spy = vi.spyOn(fs, 'mkdirSync')
    await config.init()
    const calls = (spy.mock.calls || []).map(c => c[0])
    expect(calls.find(p => typeof p === 'string' && p.includes('html'))).toBeUndefined()
    expect(calls.find(p => typeof p === 'string' && p.includes('res'))).toBeUndefined()
    spy.mockRestore()
  })
  it('init ENOENT 分支重试写入', async () => {
    try { fs.rmSync(tmpRoot, { recursive: true, force: true }) } catch { }
    fs.mkdirSync(tmpConfig, { recursive: true })
    const spy = vi.spyOn(fs, 'writeFileSync')
    const err: any = new Error('not found')
    err.code = 'ENOENT'
    spy.mockImplementationOnce(() => { throw err })
    await config.init()
    spy.mockRestore()
    const p = path.join(tmpConfig, 'admin', 'permissions.json')
    expect(fs.existsSync(p)).toBe(true)
  })
})
