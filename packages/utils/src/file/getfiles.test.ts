import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { getFiles } from './file'

describe('file/file getFiles', () => {
  it('throws on missing dir', () => {
    expect(() => getFiles(path.join(os.tmpdir(), 'no-such'))).toThrow()
  })
  it('filters suffixs normalized', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gf3-'))
    fs.writeFileSync(path.join(dir, 'a.ts'), 'x')
    fs.writeFileSync(path.join(dir, 'b.js'), 'x')
    const s = getFiles(dir, ['ts'])
    expect(s).toEqual(['a.ts'])
    const s2 = getFiles(dir, ['.js'])
    expect(s2).toEqual(['b.js'])
    fs.rmSync(dir, { recursive: true, force: true })
  })
})
