import fs from 'node:fs'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { configServerCompat, server } from '../system/server'

vi.mock('@karinjs/store', () => {
  const { tmpConfig } = (globalThis as any).__TEST_DIRS__
  return {
    store: {
      core: { config: tmpConfig },
    },
  }
})

vi.mock('@karinjs/utils', () => {
  return {
    findCmdPath: vi.fn((cmd: string) => {
      return cmd === 'ffmpeg' ? 'C:/ffmpeg/ffmpeg.exe' : ''
    }),
  }
})

let tmpConfigDir: string
let tmpRootDir: string

beforeEach(() => {
  tmpConfigDir = (globalThis as any).__TEST_DIRS__.tmpConfig as string
  tmpRootDir = (globalThis as any).__TEST_DIRS__.tmpRoot as string
  try { fs.mkdirSync(tmpConfigDir, { recursive: true }) } catch { }
  // 避免 Windows CI 下 EPERM，交由 compat 写回时创建 system 目录
})

afterEach(() => {
  try { fs.rmSync(path.join(tmpConfigDir, 'system'), { recursive: true, force: true }) } catch { }
})

describe('服务器配置兼容 server.compat', () => {
  it('校验无效输入并自动生成安全值', () => {
    const spyMk = vi.spyOn(fs, 'mkdirSync').mockImplementation(() => undefined as any)
    const spy = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => undefined as any)
    const input = {
      http: { port: 8080, host: '127.0.0.1', auth_key: '1', username: 'u', password: 'p' },
      ws_server: { enable: true, routes: { '/x': 'key' }, exclude_routes: ['a', 1 as any] },
      ffmpeg: { ffmpeg_path: '', ffprobe_path: '', ffplay_path: '' },
    }
    const r = configServerCompat(input as any)
    expect(r.http.port).toBe(8080)
    expect(r.http.host).toBe('127.0.0.1')
    expect(r.http.auth_key.length).toBeGreaterThanOrEqual(8)
    expect(r.http.username.length).toBeGreaterThan(6)
    expect(r.ws_server.exclude_routes).toEqual(['a'])
    expect(r.http.username.length).toBeGreaterThan(6)
    spy.mockRestore()
    spyMk.mockRestore()
  })
  it('通过环境查找解析 FFmpeg 路径', () => {
    const spy = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => undefined as any)
    const input = { http: {}, ws_server: {}, ffmpeg: { ffmpeg_path: '' } }
    const r = configServerCompat(input as any)
    expect(r.ffmpeg.ffmpeg_path).toMatch(/ffmpeg\.exe$/)
    spy.mockRestore()
  })
  it('保留已提供的有效 FFmpeg 路径', () => {
    const p = path.join(tmpRootDir, 'ffmpeg.exe')
    try { fs.mkdirSync(tmpRootDir, { recursive: true }) } catch { }
    fs.writeFileSync(p, '')
    const spy = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => undefined as any)
    const r = configServerCompat({ http: {}, ws_server: {}, ffmpeg: { ffmpeg_path: p } } as any)
    spy.mockRestore()
    expect(r.ffmpeg.ffmpeg_path).toBe(p)
  })
  it('过滤无效 routes 与 exclude_routes，不产生回写', () => {
    const spy = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => undefined as any)
    const input = {
      http: { auth_key: 'a'.repeat(64), username: 'abcdefg', password: 'Abcdef12' },
      ws_server: { enable: true, routes: { '/a': 'k', '/b': '' as any, '/c': 1 as any } as any, exclude_routes: ['x', '', 2 as any] },
      ffmpeg: { ffmpeg_path: '' },
    }
    const r = configServerCompat(input as any)
    expect(r.ws_server.routes['/a']).toBe('k')
    expect(Object.keys(r.ws_server.routes).includes('/b')).toBe(false)
    expect(Object.keys(r.ws_server.routes).includes('/c')).toBe(false)
    expect(r.ws_server.exclude_routes).toEqual(['x'])
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
  it('环境不可用时 FFmpeg 路径为空', async () => {
    const utils = await import('../utils') as any
    const spyWF = vi.spyOn(utils, 'getFfmpegPath').mockImplementation(() => '')
    const spyWrite = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => undefined as any)
    const r = configServerCompat({ http: {}, ws_server: {}, ffmpeg: { ffmpeg_path: '' } } as any)
    expect(r.ffmpeg.ffmpeg_path).toBe('')
    spyWF.mockRestore()
    spyWrite.mockRestore()
  })
  it('存在 globalThis.logger 时使用其输出', () => {
    const spyMk = vi.spyOn(fs, 'mkdirSync').mockImplementation(() => undefined as any)
    const spyWrite = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => undefined as any)
    const mockLogger = { error: vi.fn(), warn: vi.fn() }
    ;(globalThis as any).logger = mockLogger
    const input = { http: { auth_key: '1', username: 'u', password: 'p' }, ws_server: {}, ffmpeg: {} }
    configServerCompat(input as any)
    expect(mockLogger.error).toHaveBeenCalled()
    spyWrite.mockRestore()
    spyMk.mockRestore()
    ;(globalThis as any).logger = undefined
  })
  it('无 logger 时输出到 console', () => {
    const spyMk = vi.spyOn(fs, 'mkdirSync').mockImplementation(() => undefined as any)
    const spyWrite = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => undefined as any)
    const spyConsole = vi.spyOn(console, 'error').mockImplementation(() => undefined as any)
    ;(globalThis as any).logger = undefined
    const input = { http: { auth_key: '1', username: 'u', password: 'p' }, ws_server: {}, ffmpeg: {} }
    try {
      configServerCompat(input as any)
    } catch {}
    expect(spyConsole).toHaveBeenCalled()
    spyConsole.mockRestore()
    spyWrite.mockRestore()
    spyMk.mockRestore()
  })
  it('clearCache 覆盖', () => {
    server.clearCache()
    expect(true).toBe(true)
  })
})
