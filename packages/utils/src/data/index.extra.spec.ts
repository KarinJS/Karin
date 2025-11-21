import { describe, it, expect, vi } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { base64, buffer as toBuffer, stream } from './index'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(async (url: string, opt: any) => {
      if (opt.responseType === 'stream') {
        const p = path.join(os.tmpdir(), `s-${Date.now()}`)
        fs.writeFileSync(p, 'abc')
        return { data: fs.createReadStream(p) }
      }
      return { data: Buffer.from('def') }
    }),
  },
}))

describe('data/index extra', () => {
  it('base64 with http option returns original url', async () => {
    const s = await base64('http://example.com/x.png', { http: true })
    expect(s).toBe('http://example.com/x.png')
  })

  it('buffer with http option returns original url', async () => {
    const s = await toBuffer('http://example.com/x.png', { http: true } as any)
    expect(s).toBe('http://example.com/x.png')
  })

  it('buffer supports Uint8Array and stream error', async () => {
    const ua = new Uint8Array([97,98,99])
    const b = await toBuffer(ua)
    expect(Buffer.isBuffer(b)).toBe(true)
    await expect(stream(fs.createReadStream(path.join(os.tmpdir(), 'missing')))).rejects.toBeTruthy()
  })
})
