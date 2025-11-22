import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
// dynamic import after mocking

describe('file/file', () => {
  it('createPluginDir supports org and non-org structure', async () => {
    const base = path.join(os.tmpdir(), `karin-${Date.now()}`)
    vi.doMock('@karinjs/store', async () => ({ karinPathBase: base }))
    const mod = await import('./file')
    await mod.createPluginDir('@org/pkg')
    await mod.createPluginDir('simple')
    const orgOld = path.join(base, '@org-pkg')
    const orgNew = path.join(base, '@org', 'pkg')
    const simple = path.join(base, 'simple')
    const exists = fs.existsSync(orgOld) || fs.existsSync(orgNew)
    expect(exists).toBe(true)
    expect(fs.existsSync(path.join(simple, 'config'))).toBe(true)
    fs.rmSync(base, { recursive: true, force: true })
  })

  it('getFiles filters suffixes', async () => {
    const mod = await import('./file')
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gf-'))
    fs.writeFileSync(path.join(dir, 'a.ts'), 'x')
    fs.writeFileSync(path.join(dir, 'b.js'), 'x')
    fs.mkdirSync(path.join(dir, 'sub'))
    const all = mod.getFiles(dir)
    expect(all.sort()).toEqual(['a.ts','b.js'])
    const ts = mod.getFiles(dir, ['ts'])
    expect(ts).toEqual(['a.ts'])
    const both = mod.getFiles(dir, ['.ts','.js'])
    expect(both.sort()).toEqual(['a.ts','b.js'])
    fs.rmSync(dir, { recursive: true, force: true })
  })

  it('copyFilesSync and copyFiles only when not exists', async () => {
    const mod = await import('./file')
    const src = fs.mkdtempSync(path.join(os.tmpdir(), 'src-'))
    const dst = fs.mkdtempSync(path.join(os.tmpdir(), 'dst-'))
    fs.writeFileSync(path.join(src, 'a.json'), '{}')
    fs.writeFileSync(path.join(src, 'b.yaml'), 'k: v')
    mod.copyFilesSync(['a.json','b.yaml'], src, dst)
    expect(fs.existsSync(path.join(dst, 'a.json'))).toBe(true)
    await mod.copyFiles(['a.json','b.yaml'], src, dst)
    fs.rmSync(src, { recursive: true, force: true })
    fs.rmSync(dst, { recursive: true, force: true })
  })

  it('copyConfigSync and copyConfig with suffixs and isThrow', async () => {
    const mod = await import('./file')
    const def = fs.mkdtempSync(path.join(os.tmpdir(), 'def-'))
    const user = fs.mkdtempSync(path.join(os.tmpdir(), 'usr-'))
    fs.writeFileSync(path.join(def, 'a.json'), '{}')
    fs.writeFileSync(path.join(def, 'b.yaml'), 'k: v')
    expect(mod.copyConfigSync(def, user, ['json'])).toBe(true)
    expect(fs.existsSync(path.join(user, 'a.json'))).toBe(true)
    expect(mod.copyConfigSync(user, def, ['ts'])).toBe(true)
    await expect(mod.copyConfig(def, user, ['yaml'])).resolves.toBe(true)
    await expect(mod.copyConfig(path.join(os.tmpdir(), 'missing'), user, [], true)).rejects.toThrow()
    fs.rmSync(def, { recursive: true, force: true })
    fs.rmSync(user, { recursive: true, force: true })
  })

  it('getAllFilesSync and getAllFiles suffix/exclude/returnType', async () => {
    const mod = await import('./file')
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'all-'))
    fs.mkdirSync(path.join(dir, 'sub'))
    fs.writeFileSync(path.join(dir, 'a.ts'), 'x')
    fs.writeFileSync(path.join(dir, 'b.js'), 'x')
    fs.writeFileSync(path.join(dir, 'sub', 'c.ts'), 'x')
    const rel = mod.getAllFilesSync(dir)
    expect(rel.length).toBe(3)
    const onlyTs = mod.getAllFilesSync(dir, { suffixs: ['ts'] })
    expect(onlyTs.length).toBe(2)
    const noJs = await mod.getAllFiles(dir, { exclude: ['js'], returnType: 'abs' })
    expect(noJs.every(p => path.isAbsolute(p))).toBe(true)
    fs.rmSync(dir, { recursive: true, force: true })
  })
})
