import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { readDirRecursive, readDirRecursiveSync } from './dir'

describe('fs/dir more', () => {
  it('readDirRecursive exclude and suffixs combos', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dm-'))
    fs.mkdirSync(path.join(dir, 'sub'))
    fs.writeFileSync(path.join(dir, 'a.ts'), 'x')
    fs.writeFileSync(path.join(dir, 'b.js'), 'x')
    fs.writeFileSync(path.join(dir, 'sub', 'c.ts'), 'x')
    const rel = await readDirRecursive(dir, { suffixs: ['ts'], exclude: ['sub'] })
    expect(rel.sort()).toEqual(['a.ts', path.join('sub', 'c.ts')].sort())
    const abs = readDirRecursiveSync(dir, { suffixs: ['ts'], exclude: ['.js'], returnType: 'abs' })
    expect(abs.every(p => path.isAbsolute(p))).toBe(true)
    fs.rmSync(dir, { recursive: true, force: true })
  })
})
