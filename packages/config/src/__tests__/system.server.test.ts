import fs from 'node:fs'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { configServerCompat } from '../system/server'

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

beforeEach(() => {
  tmpConfigDir = (globalThis as any).__TEST_DIRS__.tmpConfig as string
  fs.mkdirSync(tmpConfigDir, { recursive: true })
  // 避免 Windows CI 下 EPERM，交由 compat 写回时创建 system 目录
})

afterEach(() => {
  try { fs.rmSync(path.join(tmpConfigDir, 'system'), { recursive: true, force: true }) } catch { }
})

describe('服务器配置兼容 server.compat', () => {
  it('校验无效输入并自动生成安全值', () => {
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
  })
  it('通过环境查找解析 FFmpeg 路径', () => {
    const spy = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => undefined as any)
    const input = { http: {}, ws_server: {}, ffmpeg: { ffmpeg_path: '' } }
    const r = configServerCompat(input as any)
    expect(r.ffmpeg.ffmpeg_path).toMatch(/ffmpeg\.exe$/)
    spy.mockRestore()
  })
  it('保留已提供的有效 FFmpeg 路径', () => {
    const p = path.join(tmpConfigDir, 'ffmpeg.exe')
    fs.writeFileSync(p, '')
    const spy = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => undefined as any)
    const r = configServerCompat({ http: {}, ws_server: {}, ffmpeg: { ffmpeg_path: p } } as any)
    spy.mockRestore()
    expect(r.ffmpeg.ffmpeg_path).toBe(p)
  })
})
