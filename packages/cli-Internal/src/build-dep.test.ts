import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getPnpmVersion } from './pnpm'
import { buildDep } from './build-dep'
import { parseVersion, readYamlFile } from './workspace'

vi.mock('./pnpm', () => ({ getPnpmVersion: vi.fn() }))

const mockPnpm = (version: string) => {
  vi.mocked(getPnpmVersion).mockReturnValue(parseVersion(version))
}

describe('buildDep', () => {
  let dir: string
  let file: string

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'karin-build-dep-'))
    file = path.join(dir, 'pnpm-workspace.yaml')
    vi.spyOn(process, 'cwd').mockReturnValue(dir)
    vi.spyOn(console, 'log').mockImplementation(() => { })
    vi.spyOn(console, 'error').mockImplementation(() => { })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    fs.rmSync(dir, { recursive: true, force: true })
  })

  describe('add', () => {
    it('pnpm 12: 写入 allowBuilds 不创建 onlyBuiltDependencies', () => {
      mockPnpm('12.9.1')
      fs.writeFileSync(file, '# 注释\npackages:\n  - plugins/*\n')

      const result = buildDep.add('foo bar')

      expect(result).toEqual({ added: ['foo', 'bar'], existed: [] })
      const data = readYamlFile(file)
      expect(data.allowBuilds).toEqual({ foo: true, bar: true })
      expect(data).not.toHaveProperty('onlyBuiltDependencies')
      expect(fs.readFileSync(file, 'utf-8')).toContain('# 注释')
    })

    it('pnpm 10: 同时写入 allowBuilds 与 onlyBuiltDependencies', () => {
      mockPnpm('10.20.0')
      fs.writeFileSync(file, 'onlyBuiltDependencies:\n  - sharp\n')

      buildDep.add('foo')

      const data = readYamlFile(file)
      expect(data.allowBuilds).toEqual({ foo: true })
      expect(data.onlyBuiltDependencies).toEqual(['sharp', 'foo'])
    })

    it('支持逗号分隔 并覆盖之前显式设为 false 的条目', () => {
      mockPnpm('12.9.1')
      fs.writeFileSync(file, 'allowBuilds:\n  foo: false\n  bar: true\n')

      const result = buildDep.add('foo,bar , baz')

      expect(result).toEqual({ added: ['foo', 'baz'], existed: ['bar'] })
      expect(readYamlFile(file).allowBuilds).toEqual({ foo: true, bar: true, baz: true })
    })

    it('全部已存在时不修改文件', () => {
      mockPnpm('12.9.1')
      const content = 'allowBuilds:\n  foo: true # 注释\n'
      fs.writeFileSync(file, content)

      expect(buildDep.add('foo')).toEqual({ added: [], existed: ['foo'] })
      expect(fs.readFileSync(file, 'utf-8')).toBe(content)
    })

    it('文件不存在时报错且不抛出', () => {
      mockPnpm('12.9.1')
      expect(buildDep.add('foo')).toEqual({ added: [], existed: [] })
      expect(console.error).toHaveBeenCalledWith(expect.stringContaining('pnpm-workspace.yaml 文件不存在'))
    })
  })

  describe('rm', () => {
    it('内置构建依赖在 allowBuilds 中设为 false 其他依赖直接移除', () => {
      mockPnpm('12.9.1')
      fs.writeFileSync(file, 'allowBuilds:\n  sharp: true\n  foo: true\n')

      const result = buildDep.rm('sharp foo')

      expect(result).toEqual({ removed: ['sharp', 'foo'], notExist: [] })
      expect(readYamlFile(file).allowBuilds).toEqual({ sharp: false })
    })

    it('pnpm 10: 同时从 onlyBuiltDependencies 中移除', () => {
      mockPnpm('10.20.0')
      fs.writeFileSync(file, 'allowBuilds:\n  sharp: true\nonlyBuiltDependencies:\n  - sharp\n  - foo\n')

      const result = buildDep.rm('sharp,foo')

      expect(result.removed).toEqual(['sharp', 'foo'])
      const data = readYamlFile(file)
      expect(data.allowBuilds).toEqual({ sharp: false })
      expect(data.onlyBuiltDependencies).toEqual([])
    })

    it('不存在于白名单中的依赖不做修改', () => {
      mockPnpm('12.9.1')
      const content = 'allowBuilds:\n  canvas: false\n'
      fs.writeFileSync(file, content)

      expect(buildDep.rm('canvas foo')).toEqual({ removed: [], notExist: ['canvas', 'foo'] })
      expect(fs.readFileSync(file, 'utf-8')).toBe(content)
    })
  })

  describe('ls', () => {
    const content = 'allowBuilds:\n  sharp: true\n  canvas: false\nonlyBuiltDependencies:\n  - sharp\n  - legacy\n  - canvas\n'

    it('pnpm 12: 只读取 allowBuilds', () => {
      mockPnpm('12.9.1')
      fs.writeFileSync(file, content)
      expect(buildDep.ls()).toEqual({ allowed: ['sharp'], denied: ['canvas'] })
    })

    it('pnpm 10: 合并 onlyBuiltDependencies 显式 false 的不算在白名单中', () => {
      mockPnpm('10.20.0')
      fs.writeFileSync(file, content)
      expect(buildDep.ls()).toEqual({ allowed: ['sharp', 'legacy'], denied: ['canvas'] })
    })
  })
})
