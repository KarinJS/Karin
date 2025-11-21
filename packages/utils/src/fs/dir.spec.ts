import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { mkdir, ensureDir, readDir, readDirRecursive, readDirRecursiveSync } from './dir'

describe('fs/dir', () => {
  it('mkdir and ensureDir create directories', async () => {
    const dir = path.join(os.tmpdir(), `dir-${Date.now()}`)
    expect(await mkdir(dir)).toBe(true)
    expect(await ensureDir(dir)).toBe(true)
    fs.rmSync(dir, { recursive: true, force: true })
  })

  it('readDir filters suffixes', () => {
    const base = fs.mkdtempSync(path.join(os.tmpdir(), 'readDir-'))
    fs.writeFileSync(path.join(base, 'a.ts'), 'x')
    fs.writeFileSync(path.join(base, 'b.js'), 'x')
    fs.mkdirSync(path.join(base, 'sub'))
    const all = readDir(base)
    expect(all.sort()).toEqual(['a.ts', 'b.js'])
    const onlyTs = readDir(base, ['ts'])
    expect(onlyTs).toEqual(['a.ts'])
    const mixed = readDir(base, ['.js', '.ts'])
    expect(mixed.sort()).toEqual(['a.ts', 'b.js'])
    fs.rmSync(base, { recursive: true, force: true })
  })

  it('readDirRecursive and sync return rel and abs', async () => {
    const base = fs.mkdtempSync(path.join(os.tmpdir(), 'recursive-'))
    fs.mkdirSync(path.join(base, 'x'))
    fs.writeFileSync(path.join(base, 'x', 'a.ts'), 'x')
    fs.writeFileSync(path.join(base, 'b.ts'), 'x')
    const rel = await readDirRecursive(base, { suffixs: ['ts'] })
    expect(rel.sort()).toEqual(['b.ts', path.join('x', 'a.ts')].sort())
    const abs = await readDirRecursive(base, { suffixs: ['ts'], returnType: 'abs' })
    expect(abs.every(p => path.isAbsolute(p))).toBe(true)
    const syncRel = readDirRecursiveSync(base, { exclude: ['.js'] })
    expect(syncRel.length).toBe(2)
    fs.rmSync(base, { recursive: true, force: true })
  })
})
