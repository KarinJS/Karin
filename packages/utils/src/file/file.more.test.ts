import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import * as f from './file'

describe('file/file more', () => {
  it('copyFilesSync throws when src missing', () => {
    const src = fs.mkdtempSync(path.join(os.tmpdir(), 'sm-'))
    const dst = fs.mkdtempSync(path.join(os.tmpdir(), 'dm-'))
    expect(() => f.copyFilesSync(['no.json'], src, dst)).toThrow()
    fs.rmSync(src, { recursive: true, force: true })
    fs.rmSync(dst, { recursive: true, force: true })
  })

  it('copyFiles rejects when src missing', async () => {
    const src = fs.mkdtempSync(path.join(os.tmpdir(), 'sm2-'))
    const dst = fs.mkdtempSync(path.join(os.tmpdir(), 'dm2-'))
    await expect(f.copyFiles(['no.json'], src, dst)).rejects.toBeTruthy()
    fs.rmSync(src, { recursive: true, force: true })
    fs.rmSync(dst, { recursive: true, force: true })
  })
})
