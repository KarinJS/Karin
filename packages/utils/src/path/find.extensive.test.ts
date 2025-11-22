import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { findByExt, findFilesSync, findFiles, findDirs, findDirsSync } from './find'

describe('path/find extensive', () => {
  it('findByExt name returnType and exclude patterns', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fe-'))
    fs.mkdirSync(path.join(dir, 'sub'))
    fs.writeFileSync(path.join(dir, 'a.ts'), 'x')
    fs.writeFileSync(path.join(dir, 'b.js'), 'x')
    fs.writeFileSync(path.join(dir, 'sub', 'c.ts'), 'x')
    const names = findByExt(dir, undefined, 'name', true)
    expect(names.length).toBe(3)
    const filtered = findByExt(dir, 'ts', 'name', true, [/sub/])
    expect(filtered.length).toBe(2)
    fs.rmSync(dir, { recursive: true, force: true })
  })

  it('findFiles* with exclude strings and no ext', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fe2-'))
    fs.writeFileSync(path.join(dir, 'a.ts'), 'x')
    fs.writeFileSync(path.join(dir, 'b.js'), 'x')
    const all = await findFiles(dir, { pathsType: 'rel' })
    expect(all.length).toBe(2)
    const ex = findFilesSync(dir, { exclude: ['js'], pathsType: 'rel' })
    expect(ex.length).toBe(2)
    const names = await findFiles(dir)
    expect(names.sort()).toEqual(['a.ts','b.js'].sort())
    const fileOnly = await findFiles(path.join(dir, 'a.ts'))
    expect(fileOnly).toEqual([])
    fs.rmSync(dir, { recursive: true, force: true })
  })

  it('findDirs* recursive edge cases', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fe3-'))
    fs.mkdirSync(path.join(dir, 'a'))
    fs.mkdirSync(path.join(dir, 'b'))
    const d1 = await findDirs(dir)
    const d2 = findDirsSync(dir)
    expect(d1.length).toBe(2)
    expect(d2.length).toBe(2)
    fs.rmSync(dir, { recursive: true, force: true })
  })
})
