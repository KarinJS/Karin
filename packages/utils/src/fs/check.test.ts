import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { exists, isDir, isFile } from './check'

describe('fs/check', () => {
  it('exists, isDir, isFile resolve true/false', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ck-'))
    const file = path.join(dir, 'a.txt')
    fs.writeFileSync(file, 'x')
    expect(await exists(dir)).toBe(true)
    expect(await isDir(dir)).toBe(true)
    expect(await isFile(dir)).toBe(false)
    expect(await isFile(file)).toBe(true)
    expect(await exists(path.join(os.tmpdir(), 'no-such'))).toBe(false)
    fs.rmSync(dir, { recursive: true, force: true })
  })

  it('isDir and isFile return false on missing path', async () => {
    const p = path.join(os.tmpdir(), `missing-${Date.now()}`)
    expect(await isDir(p)).toBe(false)
    expect(await isFile(p)).toBe(false)
  })
})
