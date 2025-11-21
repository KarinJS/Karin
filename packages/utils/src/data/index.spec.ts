import { describe, it, expect, vi } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { base64, buffer as toBuffer, stream, readFile, randomStr, secureRandomStr } from './index'

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

describe('data/index', () => {
  it('base64 from string, buffer, stream, http and file', async () => {
    const buf = Buffer.from('xyz')
    expect(await base64(buf)).toBe(buf.toString('base64'))
    const s = await base64('base64://aGVsbG8=')
    expect(s).toBe('aGVsbG8=')
    const st = await stream(fs.createReadStream(__filename))
    expect(Buffer.isBuffer(st)).toBe(true)
    const http = await base64('http://example.com/x.png')
    expect(typeof http).toBe('string')
    const p = path.join(os.tmpdir(), `f-${Date.now()}.txt`)
    fs.writeFileSync(p, 'content')
    const fromFile = await base64(p)
    expect(typeof fromFile).toBe('string')
    fs.rmSync(p, { force: true })
  })

  it('buffer from inputs and http', async () => {
    const b = await toBuffer('base64://YQ==')
    expect(b.toString()).toBe('a')
    const httpB = await toBuffer('http://example.com/x.png')
    expect(Buffer.isBuffer(httpB)).toBe(true)
  })

  it('readFile returns buffer or null', async () => {
    const p = path.join(os.tmpdir(), `rf-${Date.now()}.txt`)
    fs.writeFileSync(p, 'a')
    const ok = await readFile(p)
    expect(Buffer.isBuffer(ok)).toBe(true)
    // @ts-ignore
    global.logger = { error: vi.fn() }
    const miss = await readFile(path.join(os.tmpdir(), `no-${Date.now()}.txt`))
    expect(miss).toBeNull()
    fs.rmSync(p, { force: true })
  })

  it('randomStr and secureRandomStr variants', () => {
    expect(typeof randomStr()).toBe('string')
    const h1 = secureRandomStr({ hash: 'sha256' })
    expect(typeof h1).toBe('string')
    const both = secureRandomStr({ hash: 'md5', returnRawAndHash: true }) as any
    expect(typeof both.raw).toBe('string')
    expect(typeof both.hash).toBe('string')
    const s = secureRandomStr({ onlyLetters: false, includeNumbers: false, includeSymbols: false })
    expect(typeof s).toBe('string')
  })
})
