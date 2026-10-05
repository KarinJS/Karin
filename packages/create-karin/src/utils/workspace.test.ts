import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanPkgAfterPnpmInit, prepareWorkspace } from './workspace'
import { BUILD_DEPENDENCIES, parseVersion, readYamlFile } from '../../../cli-Internal/src/workspace'

const v = (version: string) => parseVersion(version)

describe('prepareWorkspace', () => {
  let dir: string
  let file: string
  const read = () => readYamlFile(file)

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'create-karin-'))
    file = path.join(dir, 'pnpm-workspace.yaml')
  })

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true })
  })

  it('pnpm 9: 新项目写入 packages 字段 否则 pnpm 会报 packages field missing or empty', () => {
    prepareWorkspace(dir, v('9.15.9'))
    const data = read()
    expect(data.packages).toEqual(['plugins/*'])
    expect(data.onlyBuiltDependencies).toEqual(BUILD_DEPENDENCIES)
  })

  it('插件开发项目同样包含 packages 字段 但不加入 plugins/*', () => {
    prepareWorkspace(dir, v('10.0.0'), true)
    expect(read().packages).toEqual([])
  })

  it('pnpm 11+: 写入 allowBuilds 与兼容项 不写入 onlyBuiltDependencies', () => {
    prepareWorkspace(dir, v('12.9.1'))
    const data = read()
    expect(data).not.toHaveProperty('onlyBuiltDependencies')
    expect(Object.keys(data.allowBuilds ?? {})).toEqual(BUILD_DEPENDENCIES)
    expect(data).toMatchObject({ strictDepBuilds: false, minimumReleaseAge: 0, blockExoticSubdeps: false })
  })

  it('已存在的旧配置会被合并 而不是跳过', () => {
    fs.writeFileSync(file, [
      '# 旧版本生成',
      'packages:',
      '  - plugins/*',
      'onlyBuiltDependencies:',
      '  - better-sqlite3',
      'allowBuilds:',
      '  sharp: false',
      '',
    ].join('\n'))

    expect(prepareWorkspace(dir, v('11.28.2'))).toBe(true)

    const data = read()
    expect(data.packages).toEqual(['plugins/*'])
    expect(data).not.toHaveProperty('onlyBuiltDependencies')
    expect(data.allowBuilds).toMatchObject({ 'better-sqlite3': true, sharp: false, canvas: true })
    expect(data).toMatchObject({ strictDepBuilds: false, minimumReleaseAge: 0, blockExoticSubdeps: false })
    expect(fs.readFileSync(file, 'utf-8')).toContain('# 旧版本生成')
  })

  it('缺少 packages 字段的已有配置会补全 packages', () => {
    fs.writeFileSync(file, 'allowBuilds:\n  sharp: true\n')
    prepareWorkspace(dir, v('9.15.9'))
    expect(read().packages).toEqual(['plugins/*'])
  })
})

describe('cleanPkgAfterPnpmInit', () => {
  let dir: string

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'create-karin-pkg-'))
  })

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true })
  })

  const write = (pkg: Record<string, unknown>) => fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg))
  const read = () => JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf-8'))

  it('移除 devEngines 与 pnpm 的 packageManager', () => {
    write({ name: 'a', devEngines: { runtime: { name: 'node' } }, packageManager: 'pnpm@12.9.1' })
    expect(cleanPkgAfterPnpmInit(dir)).toBe(true)
    expect(read()).toEqual({ name: 'a' })
  })

  it('保留其他包管理器的 packageManager', () => {
    write({ name: 'a', packageManager: 'yarn@4.0.0' })
    expect(cleanPkgAfterPnpmInit(dir)).toBe(false)
    expect(read()).toEqual({ name: 'a', packageManager: 'yarn@4.0.0' })
  })

  it('package.json 不存在时返回 false', () => {
    expect(cleanPkgAfterPnpmInit(dir)).toBe(false)
  })
})
