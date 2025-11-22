import { describe, it, expect, vi } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

vi.mock('../file/yaml', () => {
  class YamlEditor {
    constructor (_s: string) { }
    has () { throw new Error('fail') }
    set () { return true }
    comment () { throw new Error('fail') }
    save () { return true }
  }
  return { YamlEditor }
})

const mod = await import('./index')

describe('common/index error branches', () => {
  it('updateYaml handles editor errors', () => {
    const p = path.join(os.tmpdir(), `y-${Date.now()}.yaml`)
    fs.writeFileSync(p, 'a: 1')
    mod.updateYaml(p, [{ key: 'b.c', val: 2, comment: 'x', type: 'top' }])
    fs.rmSync(p, { force: true })
  })

  it('mergeImage handles ffmpeg failure', async () => {
    process.env.tempPath = os.tmpdir()
    vi.resetModules()
    vi.doMock('../system/ffmpeg', async (importOriginal) => {
      const actual = await importOriginal()
      return { ...actual, ffmpeg: vi.fn(async () => ({ status: false, error: new Error('x') })) }
    })
    const m = await import('./index')
    const base = fs.mkdtempSync(path.join(os.tmpdir(), 'img-'))
    const a = path.join(base, 'a.png')
    fs.writeFileSync(a, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAA==', 'base64'))
    await expect(m.mergeImage([a, 'base64://aGVsbG8='], 1)).rejects.toThrow()
    fs.rmSync(base, { recursive: true, force: true })
  })
})
