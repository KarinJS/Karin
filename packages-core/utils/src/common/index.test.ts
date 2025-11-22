import { describe, it, expect, vi } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { axios as axiosWrap, updateYaml, formatTime, mergeImage, getAbsPath } from './index'

vi.mock('axios', async () => {
  class AxiosError extends Error { response?: any }
  return {
    default: vi.fn(async (config: any) => {
      if (config.url?.includes('401')) {
        const e = new AxiosError('unauth')
        e.response = { status: 401 }
        throw e
      }
      if (config.url?.includes('fail')) throw new Error('fail')
      return { status: 200, data: 'ok', config }
    }),
    AxiosError,
  }
})

vi.mock('../system/ffmpeg', () => ({
  ffmpeg: vi.fn(async () => ({ status: true })),
  ffprobe: vi.fn(async () => ({ stdout: '100,200' })),
}))

// @ts-ignore
global.logger = { debug: vi.fn(), error: vi.fn() }

describe('common/index axios wrapper', () => {
  it('returns undefined for 401', async () => {
    const res = await axiosWrap('http://x/401', 'get')
    expect(res).toBeUndefined()
  })
  it('returns null on non-AxiosError', async () => {
    const res = await axiosWrap('http://x/fail', 'get')
    expect(res).toBeNull()
  })
  it('passes through for success', async () => {
    const res = await axiosWrap('http://x/ok', 'post', { data: { a: 1 } })
    expect(res?.status).toBe(200)
  })
})

describe('common/index yaml helpers', () => {
  it('updateYaml writes nodes and comments', () => {
    const p = path.join(os.tmpdir(), `y-${Date.now()}.yaml`)
    fs.writeFileSync(p, 'a: 1')
    updateYaml(p, [{ key: 'b.c', val: 2, comment: 'hello', type: 'top' }])
    const s = fs.readFileSync(p, 'utf-8')
    expect(typeof s).toBe('string')
    fs.rmSync(p, { force: true })
  })
})

describe('common/index mergeImage', () => {
  it('merges local and base64 images', async () => {
    process.env.tempPath = os.tmpdir()
    const base = fs.mkdtempSync(path.join(os.tmpdir(), 'img-'))
    const a = path.join(base, 'a.png')
    fs.writeFileSync(a, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAA==', 'base64'))
    const spy = vi.spyOn(fs.promises, 'readFile').mockResolvedValue('Zm9v' as any)
    const res = await mergeImage([a, 'base64://aGVsbG8='], 2)
    expect(res.base64.length > 0).toBe(true)
    spy.mockRestore()
    fs.rmSync(base, { recursive: true, force: true })
  })
  it('getAbsPath throws on missing file and non-string', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'img2-'))
    expect(() => getAbsPath([123 as any], root)).toThrow()
    expect(() => getAbsPath(['missing.png'], root)).toThrow()
    fs.rmSync(root, { recursive: true, force: true })
  })
})

describe('common/index formatTime proxy', () => {
  it('formatTime returns non-empty', () => {
    const s = formatTime(0, 2000)
    expect(typeof s).toBe('string')
  })
})