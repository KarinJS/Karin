import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { findByExt, findFilesSync, findFiles, findDirs, findDirsSync, findCmdPath } from './find'

describe('path/find', () => {
  it('findByExt and findFiles sync/async with options', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'find-'))
    fs.writeFileSync(path.join(dir, 'a.ts'), 'x')
    fs.writeFileSync(path.join(dir, 'b.js'), 'x')
    const sub = path.join(dir, 'sub')
    fs.mkdirSync(sub)
    fs.writeFileSync(path.join(sub, 'c.ts'), 'x')
    const names = findByExt(dir)
    expect(names.sort()).toEqual(['a.ts', 'b.js'])
    const rel = findFilesSync(dir, { ext: 'ts', pathsType: 'rel', recursive: true })
    expect(rel.some(p => p.includes('sub'))).toBe(true)
    const abs = await findFiles(dir, { ext: ['ts', 'js'], pathsType: 'abs' })
    expect(abs.every(p => path.isAbsolute(p))).toBe(true)
    fs.rmSync(dir, { recursive: true, force: true })
  })

  it('findDirs sync/async', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dirs-'))
    fs.mkdirSync(path.join(dir, 'a'))
    fs.mkdirSync(path.join(dir, 'b'))
    const asyncDirs = await findDirs(dir)
    expect(asyncDirs.sort()).toEqual(['a', 'b'])
    const absDirs = findDirsSync(dir, { isAbs: true })
    expect(absDirs.every(p => path.isAbsolute(p))).toBe(true)
    fs.rmSync(dir, { recursive: true, force: true })
  })

  it('findCmdPath finds tool in PATH', async () => {
    const tmpBin = fs.mkdtempSync(path.join(os.tmpdir(), 'bin-'))
    const exe = path.join(tmpBin, process.platform === 'win32' ? 'tool.exe' : 'tool')
    fs.writeFileSync(exe, '')
    const old = process.env.PATH || ''
    process.env.PATH = `${tmpBin}${process.platform === 'win32' ? ';' : ':'}${old}`
    vi.resetModules()
    const mod = await import('./find')
    const found = mod.findCmdPath('tool')
    expect(found).toBeTruthy()
    process.env.PATH = old
    fs.rmSync(tmpBin, { recursive: true, force: true })
  })
})