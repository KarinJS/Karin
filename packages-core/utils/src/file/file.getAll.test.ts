import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { getAllFiles, getAllFilesSync } from './file'

describe('file/file getAllFiles name/abs coverage', () => {
  it('getAllFilesSync returnType name', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ga-'))
    fs.writeFileSync(path.join(dir, 'a.ts'), 'x')
    fs.writeFileSync(path.join(dir, 'b.js'), 'x')
    const names = getAllFilesSync(dir, { returnType: 'name' })
    expect(names.sort()).toEqual(['a.ts','b.js'].sort())
    fs.rmSync(dir, { recursive: true, force: true })
  })
  it('getAllFiles async abs paths', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ga2-'))
    fs.writeFileSync(path.join(dir, 'a.ts'), 'x')
    const abs = await getAllFiles(dir, { returnType: 'abs' })
    expect(abs.every(p => path.isAbsolute(p))).toBe(true)
    fs.rmSync(dir, { recursive: true, force: true })
  })
})