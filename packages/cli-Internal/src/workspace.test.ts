import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  BUILD_DEPENDENCIES,
  applyBuildCompat,
  applyKarinWorkspace,
  isVersionAtLeast,
  isWorkspaceCompatible,
  parseVersion,
  readYamlFile,
  updateYamlFile,
} from './workspace'

const v = (version: string) => parseVersion(version)

describe('parseVersion', () => {
  it('解析常规版本号', () => {
    expect(parseVersion('9.15.9')).toEqual({ major: 9, minor: 15, patch: 9 })
    expect(parseVersion('v10.4.0\n')).toEqual({ major: 10, minor: 4, patch: 0 })
    expect(parseVersion('11.0.0-rc.1')).toEqual({ major: 11, minor: 0, patch: 0 })
  })

  it('多行输出中取版本号所在行', () => {
    expect(parseVersion('warn: something\n10.26.1\n')).toEqual({ major: 10, minor: 26, patch: 1 })
  })

  it('无法解析时返回 null', () => {
    expect(parseVersion('')).toBeNull()
    expect(parseVersion(undefined)).toBeNull()
    expect(parseVersion(null)).toBeNull()
    expect(parseVersion([
      'ERROR: This version of pnpm requires at least Node.js v22.13',
      'The current version of Node.js is v18.20.0',
    ].join('\n'))).toBeNull()
  })
})

describe('isVersionAtLeast', () => {
  it('比较主版本号与次版本号', () => {
    expect(isVersionAtLeast(v('10.4.0'), 10, 4)).toBe(true)
    expect(isVersionAtLeast(v('10.3.9'), 10, 4)).toBe(false)
    expect(isVersionAtLeast(v('11.0.0'), 10, 26)).toBe(true)
    expect(isVersionAtLeast(v('9.15.9'), 10)).toBe(false)
  })

  it('版本未知时返回 false', () => {
    expect(isVersionAtLeast(null, 0)).toBe(false)
  })
})

describe('applyBuildCompat', () => {
  it('pnpm 11+: onlyBuiltDependencies 中的条目迁移到 allowBuilds 并移除旧字段', () => {
    const data = applyBuildCompat({ onlyBuiltDependencies: ['sharp', 'better-sqlite3'] }, v('11.0.0'))

    expect(data).not.toHaveProperty('onlyBuiltDependencies')
    expect(data.allowBuilds).toMatchObject({ sharp: true, 'better-sqlite3': true })
    for (const dep of BUILD_DEPENDENCIES) {
      expect(data.allowBuilds![dep]).toBe(true)
    }
  })

  it('pnpm 10: onlyBuiltDependencies 与 allowBuilds 保持一致 显式 false 的不写入', () => {
    const data = applyBuildCompat({
      onlyBuiltDependencies: ['better-sqlite3'],
      allowBuilds: { esbuild: true, sharp: false },
    }, v('10.20.0'))

    expect(data.allowBuilds).toMatchObject({ esbuild: true, sharp: false, 'better-sqlite3': true })
    expect(data.onlyBuiltDependencies![0]).toBe('better-sqlite3')
    expect([...data.onlyBuiltDependencies!].sort()).toEqual(
      ['better-sqlite3', 'esbuild', ...BUILD_DEPENDENCIES.filter(dep => dep !== 'sharp')].sort()
    )
  })

  it('版本未知时保留 onlyBuiltDependencies', () => {
    const data = applyBuildCompat({ onlyBuiltDependencies: ['better-sqlite3'] }, null)
    expect(data.onlyBuiltDependencies).toContain('better-sqlite3')
    expect(data.onlyBuiltDependencies).toEqual(expect.arrayContaining(BUILD_DEPENDENCIES))
  })

  it('用户显式设为 false 的内置依赖保持不变', () => {
    const data = applyBuildCompat({ allowBuilds: { puppeteer: false } }, v('12.9.1'))
    expect(data.allowBuilds!.puppeteer).toBe(false)
  })

  it('未配置时写入 pnpm 11+ 兼容项', () => {
    const data = applyBuildCompat({}, v('12.9.1'))
    expect(data).toMatchObject({ strictDepBuilds: false, minimumReleaseAge: 0, blockExoticSubdeps: false })
  })

  it('不覆盖用户自定义的 strictDepBuilds、minimumReleaseAge、blockExoticSubdeps', () => {
    const data = applyBuildCompat({
      strictDepBuilds: true,
      minimumReleaseAge: 1440,
      blockExoticSubdeps: true,
    }, v('12.9.1'))
    expect(data).toMatchObject({ strictDepBuilds: true, minimumReleaseAge: 1440, blockExoticSubdeps: true })
  })
})

describe('applyKarinWorkspace', () => {
  it('生产环境: 新文件包含 packages 并按固定顺序写入', () => {
    const data = applyKarinWorkspace({}, { isDev: false, version: v('12.9.1') })
    expect(Object.keys(data)).toEqual([
      'lockfile',
      'packages',
      'publicHoistPattern',
      'allowBuilds',
      'strictDepBuilds',
      'minimumReleaseAge',
      'blockExoticSubdeps',
    ])
    expect(data.lockfile).toBe(false)
    expect(data.packages).toEqual(['plugins/*'])
    expect(data.publicHoistPattern).toEqual(['*sqlite3*', '*express*'])
  })

  it('生产环境: plugins/** 统一为 plugins/* 并保留其他条目', () => {
    const data = applyKarinWorkspace({ packages: ['plugins/**', 'apps/*'] }, { isDev: false, version: v('9.15.9') })
    expect(data.packages).toEqual(['plugins/*', 'apps/*'])
  })

  it('开发环境: 不加入 plugins/* 但保留 packages 字段 (pnpm 10.5 以下缺少该字段时会报错)', () => {
    const data = applyKarinWorkspace({}, { isDev: true, version: v('9.15.9') })
    expect(data.packages).toEqual([])
  })

  it('保留用户自定义的 lockfile、publicHoistPattern 与其他配置', () => {
    const data = applyKarinWorkspace({
      lockfile: true,
      publicHoistPattern: ['*eslint*'],
      catalog: { lodash: '^4.0.0' },
    }, { isDev: false, version: v('10.20.0') })

    expect(data.lockfile).toBe(true)
    expect(data.publicHoistPattern).toEqual(['*sqlite3*', '*express*', '*eslint*'])
    expect(data.catalog).toEqual({ lodash: '^4.0.0' })
    expect(Object.keys(data).at(-1)).toBe('catalog')
  })

  it('生成的配置满足兼容性检查', () => {
    expect(isWorkspaceCompatible(applyKarinWorkspace({}, { isDev: false, version: v('10.20.0') }))).toBe(true)
    expect(isWorkspaceCompatible(applyKarinWorkspace({}, { isDev: false, version: v('12.9.1') }))).toBe(true)
  })
})

describe('isWorkspaceCompatible', () => {
  it('缺少 allowBuilds 时不兼容', () => {
    expect(isWorkspaceCompatible(null)).toBe(false)
    expect(isWorkspaceCompatible({})).toBe(false)
    expect(isWorkspaceCompatible({ allowBuilds: ['sharp'] })).toBe(false)
    expect(isWorkspaceCompatible({ onlyBuiltDependencies: ['sharp'] })).toBe(false)
  })

  it('onlyBuiltDependencies 中存在未迁移的条目时不兼容', () => {
    expect(isWorkspaceCompatible({
      allowBuilds: { sharp: true },
      onlyBuiltDependencies: ['sharp', 'better-sqlite3'],
    })).toBe(false)
    /** 原型链上的属性不能算作已迁移 */
    expect(isWorkspaceCompatible({ allowBuilds: {}, onlyBuiltDependencies: ['constructor'] })).toBe(false)
  })

  it('所有条目均已迁移时兼容', () => {
    expect(isWorkspaceCompatible({ allowBuilds: {} })).toBe(true)
    expect(isWorkspaceCompatible({
      allowBuilds: { sharp: true, canvas: false },
      onlyBuiltDependencies: ['sharp', 'canvas'],
    })).toBe(true)
  })
})

describe('yaml 读写', () => {
  let dir: string
  let file: string

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'karin-workspace-'))
    file = path.join(dir, 'pnpm-workspace.yaml')
  })

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true })
  })

  it('updateYamlFile: 保留注释与未改动的内容', () => {
    fs.writeFileSync(file, [
      '# 顶部注释',
      'packages:',
      '  - plugins/*',
      'allowBuilds:',
      '  # sharp 注释',
      '  sharp: true',
      'minimumReleaseAge: 1440 # 用户自定义',
      '',
    ].join('\n'))

    const changed = updateYamlFile(file, (data) => {
      data.allowBuilds!.canvas = true
      return data
    })

    const content = fs.readFileSync(file, 'utf-8')
    expect(changed).toBe(true)
    expect(content).toContain('# 顶部注释')
    expect(content).toContain('# sharp 注释')
    expect(content).toContain('minimumReleaseAge: 1440 # 用户自定义')
    expect(readYamlFile(file).allowBuilds).toEqual({ sharp: true, canvas: true })
  })

  it('updateYamlFile: 删除键与子键', () => {
    fs.writeFileSync(file, 'a: 1\nallowBuilds:\n  sharp: true\n  canvas: true\nonlyBuiltDependencies:\n  - sharp\n')
    updateYamlFile(file, (data) => {
      delete data.onlyBuiltDependencies
      delete data.allowBuilds!.canvas
      return data
    })
    expect(readYamlFile(file)).toEqual({ a: 1, allowBuilds: { sharp: true } })
  })

  it('updateYamlFile: 内容无变化时不写入文件', () => {
    const content = '# 注释\npackages:   [ "plugins/*" ]\n'
    fs.writeFileSync(file, content)
    expect(updateYamlFile(file, data => data)).toBe(false)
    expect(fs.readFileSync(file, 'utf-8')).toBe(content)
  })

  it('updateYamlFile: 文件不存在时创建', () => {
    expect(updateYamlFile(file, data => ({ ...data, lockfile: false }))).toBe(true)
    expect(readYamlFile(file)).toEqual({ lockfile: false })
  })

  it('updateYamlFile: 文件为空或无法解析时重新生成', () => {
    fs.writeFileSync(file, '')
    updateYamlFile(file, data => ({ ...data, lockfile: false }))
    expect(readYamlFile(file)).toEqual({ lockfile: false })

    fs.writeFileSync(file, 'packages: [\n')
    updateYamlFile(file, data => ({ ...data, lockfile: true }))
    expect(readYamlFile(file)).toEqual({ lockfile: true })
  })

  it('readYamlFile: 文件不存在、无法解析或顶层不是对象时返回空对象', () => {
    expect(readYamlFile(file)).toEqual({})
    fs.writeFileSync(file, 'packages: [\n')
    expect(readYamlFile(file)).toEqual({})
    fs.writeFileSync(file, '- a\n- b\n')
    expect(readYamlFile(file)).toEqual({})
  })
})
