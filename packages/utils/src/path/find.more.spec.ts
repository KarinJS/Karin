import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { findByExt, findFilesSync, findFiles } from './find'

describe('path/find more', () => {
  it('recursive with pathsType name returns abs', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pfm-'))
    fs.mkdirSync(path.join(dir, 'sub'))
    fs.writeFileSync(path.join(dir, 'a.ts'), 'x')
    fs.writeFileSync(path.join(dir, 'sub', 'b.ts'), 'x')
    const res = findByExt(dir, 'ts', 'name', true)
    expect(res.every(p => path.isAbsolute(p))).toBe(true)
    fs.rmSync(dir, { recursive: true, force: true })
  })

  it('findFilesSync findFiles with ext arrays and null', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pfm2-'))
    fs.writeFileSync(path.join(dir, 'a.ts'), 'x')
    fs.writeFileSync(path.join(dir, 'b.js'), 'x')
    const both = findFilesSync(dir, { ext: ['.ts', 'js'] })
    expect(both.length).toBe(2)
    const all = await findFiles(dir, { ext: undefined, pathsType: 'rel' })
    expect(all.length).toBe(2)
    fs.rmSync(dir, { recursive: true, force: true })
  })
})
