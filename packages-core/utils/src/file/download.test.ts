import { describe, it, expect, vi } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { downloadFile, downFile, download } from './download'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(async (url: string, opt: any) => {
      const { Readable } = await import('node:stream')
      const s = new Readable({ read () { this.push(Buffer.from('data')); this.push(null) } })
      return { data: s, status: 200 }
    }),
  },
}))

describe('file/download', () => {
  it('downloadFile returns boolean with returnBoolean true', async () => {
    const p = path.join(os.tmpdir(), `d-${Date.now()}.bin`)
    const ok = await downFile('http://example.com/file', p)
    expect(ok).toBe(true)
    fs.rmSync(p, { force: true })
  })

  it('downloadFile returns structured success and catches error', async () => {
    const p = path.join(os.tmpdir(), `e-${Date.now()}.bin`)
    const res = await downloadFile('http://example.com/file', p)
    expect((res as any).success).toBe(true)
    const mod = await import('axios')
    // @ts-expect-error
    mod.default.get.mockRejectedValueOnce(new Error('fail'))
    const fail = await download('http://bad', p)
    expect((fail as any).success).toBe(false)
  })
})
