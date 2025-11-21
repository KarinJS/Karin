import { describe, it, expect, vi } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { filesByExt, findFilesSync, findFiles, absPath, splitPath, getRelPath, urlToPath, isSubPath, formatFileURL, formatPath, isPathEqual, getDirs, getDirsSync, getNodeModules, getNodeModulesSync, getPackageName } from './index'

describe('path/index', () => {
  it('filesByExt and findFiles* variants', async () => {
    const dir = fs.mkdtempSync(path.join(process.cwd(), 'p-'))
    fs.writeFileSync(path.join(dir, 'a.ts'), 'x')
    fs.writeFileSync(path.join(dir, 'b.js'), 'x')
    fs.mkdirSync(path.join(dir, 'sub'))
    fs.writeFileSync(path.join(dir, 'sub', 'c.ts'), 'x')
    expect(filesByExt(dir).length).toBe(2)
    expect(filesByExt(dir, 'ts').length).toBe(1)
    expect(filesByExt(dir, undefined, 'name', true).length).toBe(3)
    expect(findFilesSync(dir, { ext: '.js', pathsType: 'rel' })[0]).toContain('p-')
    const abs = await findFiles(dir, { ext: ['.ts','.js'], pathsType: 'abs' })
    expect(abs.every(p => path.isAbsolute(p))).toBe(true)
    fs.rmSync(dir, { recursive: true, force: true })
  })

  it('absPath/splitPath/getRelPath/isSubPath', () => {
    const a = absPath('./x.txt')
    expect(a.endsWith('/x.txt')).toBe(true)
    const s = splitPath('C:/Users/a/b.txt')
    expect(s.basename).toBe('b.txt')
    expect(getRelPath('./plugins/example/')).toBe('plugins/example')
    expect(isSubPath('src', 'src/utils', false)).toBe(true)
  })

  it('formatFileURL and formatPath and isPathEqual', () => {
    const url = formatFileURL('./x.txt', { cwd: 'C:/Users/admin' })
    expect(url.startsWith('file://')).toBe(true)
    const rel = formatPath('./file.txt', { type: 'rel' })
    expect(['file.txt','.'].includes(rel)).toBe(true)
    expect(isPathEqual('C:/A', 'c:/a')).toBe(process.platform === 'win32')
  })

  it('urlToPath depends on cwd', () => {
    const spy = vi.spyOn(process, 'cwd').mockReturnValue('C:/project')
    const res = urlToPath('file:///C:/project/src/utils/a.ts')
    expect(res).toBe('../../')
    spy.mockRestore()
  })

  it('getDirs and getDirsSync list folders', async () => {
    const dir = fs.mkdtempSync(path.join(process.cwd(), 'd-'))
    fs.mkdirSync(path.join(dir, 'a'))
    const asyncDirs = await getDirs(dir)
    expect(asyncDirs).toContain('a')
    const syncDirs = getDirsSync(dir)
    expect(syncDirs).toContain('a')
    fs.rmSync(dir, { recursive: true, force: true })
  })

  it('findNodeModules and findNodeModulesSync return [] when missing', async () => {
    const spy = vi.spyOn(process, 'cwd').mockReturnValue(path.join(os.tmpdir(), `no-${Date.now()}`))
    const { findNodeModules, findNodeModulesSync } = await import('./find')
    expect(await findNodeModules()).toEqual([])
    expect(findNodeModulesSync()).toEqual([])
    spy.mockRestore()
  })

  it('getNodeModules* reads package.json and filters', async () => {
    vi.mock('../require', () => ({
      requireFileSync: vi.fn(() => ({ dependencies: { a: '1' }, devDependencies: { 'node-karin-core': '1' }, peerDependencies: { b: '1' } })),
    }))
    const list = await getNodeModules()
    expect(list).toContain('a')
    expect(list).toContain('b')
    const list2 = getNodeModulesSync()
    expect(list2).toContain('a')
  })

  it('getPackageName returns scoped or plain', () => {
    expect(getPackageName('/a/node_modules/@scope/pkg/index.js')).toBe('@scope/pkg')
    expect(getPackageName('/a/node_modules/lodash/index.js')).toBe('lodash')
    expect(getPackageName('/a/src/index.ts')).toBeNull()
  })
})
