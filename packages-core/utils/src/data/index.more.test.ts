import { describe, it, expect } from 'vitest'
import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs'
import { base64, buffer as toBuffer } from './index'

describe('data/index more', () => {
  it('base64 handles relative path and sep normalization', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dmr-'))
    const p = path.join(dir, 'x.txt')
    fs.writeFileSync(p, 'x')
    const s = await base64(p.replaceAll('/', path.sep))
    expect(typeof s).toBe('string')
    fs.rmSync(dir, { recursive: true, force: true })
  })

  it('buffer handles file path normalization', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dmr2-'))
    const p = path.join(dir, 'x.txt')
    fs.writeFileSync(p, 'x')
    const b = await toBuffer(p.replaceAll('/', path.sep))
    expect(Buffer.isBuffer(b)).toBe(true)
    fs.rmSync(dir, { recursive: true, force: true })
  })
})
