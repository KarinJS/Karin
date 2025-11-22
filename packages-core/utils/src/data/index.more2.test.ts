import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { base64, buffer as toBuffer } from './index'

describe('data/index additional coverage', () => {
  it('base64 handles file:// URL', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'di-'))
    const p = path.join(dir, 'x.txt')
    fs.writeFileSync(p, 'hello')
    const url = `file://${p}`
    const s = await base64(url)
    expect(typeof s).toBe('string')
    fs.rmSync(dir, { recursive: true, force: true })
  })
  it('buffer handles base64 raw string', async () => {
    const raw = Buffer.from('hello').toString('base64')
    const b = await toBuffer(raw as any)
    expect(Buffer.isBuffer(b)).toBe(true)
  })
})