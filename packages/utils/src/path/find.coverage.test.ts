import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

describe('path/find coverage', () => {
  let tmp: string
  beforeEach(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'find-'))
  })
  afterEach(() => {
    try { fs.rmSync(tmp, { recursive: true, force: true }) } catch {}
  })

  it('findByExt string and array filters, name/abs/rel', async () => {
    const a = path.join(tmp, 'a.ts')
    const b = path.join(tmp, 'b.js')
    const c = path.join(tmp, 'c.txt')
    fs.writeFileSync(a, 'a')
    fs.writeFileSync(b, 'b')
    fs.writeFileSync(c, 'c')

    const mod = await import('./find')
    const onlyTs = mod.findByExt(tmp, 'ts')
    expect(onlyTs).toEqual(['a.ts'])

    const tsJs = mod.findByExt(tmp, ['ts', '.js'])
    expect(tsJs.sort()).toEqual(['a.ts', 'b.js'].sort())

    const rel = mod.findByExt(tmp, 'js', 'rel')
    // 相对路径格式化后去掉 ./ 和反斜杠
    expect(rel[0].replace(/\\+/g, '/')).toContain('find-')

    const abs = mod.findByExt(tmp, 'js', 'abs')
    expect(abs.every(v => path.isAbsolute(v))).toBe(true)
  })

  it('findFiles async string/array filters and skip non-match', async () => {
    const a = path.join(tmp, 'a.ts')
    const b = path.join(tmp, 'b.js')
    const c = path.join(tmp, 'c.txt')
    fs.writeFileSync(a, 'a')
    fs.writeFileSync(b, 'b')
    fs.writeFileSync(c, 'c')

    const mod = await import('./find')
    const onlyJs = await mod.findFiles(tmp, { ext: 'js' })
    expect(onlyJs).toEqual(['b.js'])

    const both = await mod.findFiles(tmp, { ext: ['ts', 'js'] })
    expect(both.sort()).toEqual(['a.ts', 'b.js'].sort())
  })

  it('findFiles recursive forces abs paths', async () => {
    const sub = path.join(tmp, 'sub')
    fs.mkdirSync(sub)
    const f = path.join(sub, 'x.ts')
    fs.writeFileSync(f, 'x')
    const mod = await import('./find')
    const res = await mod.findFiles(tmp, { ext: 'ts', recursive: true, pathsType: 'name' })
    expect(res.every(p => path.isAbsolute(p))).toBe(true)
  })

  it('findDirs and findDirsSync isAbs option', async () => {
    const d1 = path.join(tmp, 'a')
    const d2 = path.join(tmp, 'b')
    fs.mkdirSync(d1)
    fs.mkdirSync(d2)
    const mod = await import('./find')
    const names = await mod.findDirs(tmp)
    expect(names.sort()).toEqual(['a', 'b'])
    const abs = await mod.findDirs(tmp, { isAbs: true })
    expect(abs.every(v => path.isAbsolute(v))).toBe(true)
    const namesSync = mod.findDirsSync(tmp)
    expect(namesSync.sort()).toEqual(['a', 'b'])
    const absSync = mod.findDirsSync(tmp, { isAbs: true })
    expect(absSync.every(v => path.isAbsolute(v))).toBe(true)
  })

  it('findNodeModules and findNodeModulesSync read package.json and filter', async () => {
    const pkgDir = tmp
    const pkgPath = path.join(pkgDir, 'package.json')
    const pkg = {
      dependencies: { lodash: '1.0.0', 'node-karin-foo': '1.0.0' },
      devDependencies: { axios: '1.0.0' },
      peerDependencies: { '@types/node': '20.0.0' },
    }
    fs.writeFileSync(pkgPath, JSON.stringify(pkg))
    const spy = vi.spyOn(process, 'cwd').mockReturnValue(pkgDir)
    const mod = await import('./find')
    const asyncPkgs = await mod.findNodeModules()
    expect(asyncPkgs).toContain('lodash')
    expect(asyncPkgs).not.toContain('node-karin-foo')
    const syncPkgs = mod.findNodeModulesSync()
    expect(syncPkgs).toContain('axios')
    expect(syncPkgs).not.toContain('node-karin-foo')
    spy.mockRestore()
  })

  it('findCmdPath returns null for missing cmd on Windows', async () => {
    const name = `no-such-cmd-${Date.now()}`
    const mod = await import('./find')
    const res = mod.findCmdPath(name)
    expect(res).toBeNull()
  })

  it('findCmdPath finds executable in custom PATH on Windows', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'path-'))
    const cmdName = 'mycmd'
    const exe = path.join(dir, `${cmdName}.exe`)
    fs.writeFileSync(exe, 'echo')
    const prev = process.env.PATH || ''
    process.env.PATH = `${dir};${prev}`
    vi.resetModules()
    const mod = await import('./find')
    const full = mod.findCmdPath(cmdName)
    expect(typeof full).toBe('string')
    expect(full && full.toLowerCase()).toContain(cmdName)
    process.env.PATH = prev
    try { fs.rmSync(dir, { recursive: true, force: true }) } catch {}
  })
})