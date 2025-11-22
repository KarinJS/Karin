import { describe, it, expect, vi } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { findByExt, findFiles, findFilesSync, findCmdPath, findNodeModules, findNodeModulesSync } from './find'

describe('path/find branches', () => {
  it('findByExt returns [] when dir missing', () => {
    expect(findByExt(path.join(os.tmpdir(), 'no-such'))).toEqual([])
  })

  it('findFiles catch branch returns [] when dir missing', async () => {
    const res = await findFiles(path.join(os.tmpdir(), 'no-such'))
    expect(res).toEqual([])
  })

  it('findFiles recursive pushes sub results', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fb-'))
    fs.mkdirSync(path.join(dir, 'sub'))
    fs.writeFileSync(path.join(dir, 'sub', 'a.ts'), 'x')
    const res = await findFiles(dir, { ext: 'ts', recursive: true, pathsType: 'name' })
    expect(res.some(p => p.endsWith('a.ts'))).toBe(true)
    fs.rmSync(dir, { recursive: true, force: true })
  })

  it('findCmdPath non-win branch', async () => {
    const original = Object.getOwnPropertyDescriptor(process, 'platform')
    const old = process.env.PATH || ''
    const tmpBin = fs.mkdtempSync(path.join(os.tmpdir(), 'bin-nix-'))
    const exe = path.join(tmpBin, 'tool')
    fs.writeFileSync(exe, '')
    // @ts-ignore
    Object.defineProperty(process, 'platform', { value: 'linux' })
    process.env.PATH = `${tmpBin}:${old}`
    vi.resetModules()
    const mod = await import('./find')
    const found = mod.findCmdPath('tool')
    expect(found).toBeNull()
    process.env.PATH = old
    if (original) Object.defineProperty(process, 'platform', original)
    fs.rmSync(tmpBin, { recursive: true, force: true })
  })

  it('findNodeModules catch branch', async () => {
    const spy = vi.spyOn(process, 'cwd').mockReturnValue(path.join(os.tmpdir(), `no-${Date.now()}`))
    expect(await findNodeModules()).toEqual([])
    expect(findNodeModulesSync()).toEqual([])
    spy.mockRestore()
  })

  it('findNodeModules success aggregates deps', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pkg-'))
    const pkg = {
      dependencies: { a: '1.0.0' },
      devDependencies: { b: '1.0.0' },
      peerDependencies: { c: '1.0.0', 'node-karin-core': '1.0.0' },
    }
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg))
    const spy = vi.spyOn(process, 'cwd').mockReturnValue(dir)
    const list = await findNodeModules()
    const list2 = findNodeModulesSync()
    expect(list.sort()).toEqual(['a','b','c'])
    expect(list2.sort()).toEqual(['a','b','c'])
    spy.mockRestore()
    fs.rmSync(dir, { recursive: true, force: true })
  })
})