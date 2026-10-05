import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getPnpmVersion } from './pnpm'
import { createWorkspace } from './init'
import { BUILD_DEPENDENCIES, parseVersion, readYamlFile } from './workspace'

vi.mock('./pnpm', () => ({ getPnpmVersion: vi.fn() }))

const mockPnpm = (version: string | null) => {
  vi.mocked(getPnpmVersion).mockReturnValue(version ? parseVersion(version) : null)
}

/** 旧版 karin init 生成的配置 用户额外加入了 better-sqlite3 与自定义的安全配置 */
const LEGACY_WORKSPACE = [
  '# 用户注释',
  'lockfile: false',
  'packages:',
  '  - plugins/*',
  'onlyBuiltDependencies:',
  '  - sharp',
  '  - better-sqlite3',
  'publicHoistPattern:',
  '  - "*sqlite3*"',
  '  - "*express*"',
  'strictDepBuilds: true',
  'minimumReleaseAge: 1440',
  '',
].join('\n')

describe('createWorkspace', () => {
  let dir: string
  let file: string

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'karin-init-'))
    file = path.join(dir, 'pnpm-workspace.yaml')
  })

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true })
    vi.clearAllMocks()
  })

  it('pnpm 12: 迁移旧白名单并移除 onlyBuiltDependencies 保留用户配置与注释', () => {
    mockPnpm('12.9.1')
    fs.writeFileSync(file, LEGACY_WORKSPACE)

    createWorkspace(false, dir)

    const data = readYamlFile(file)
    expect(data).not.toHaveProperty('onlyBuiltDependencies')
    expect(data.allowBuilds).toMatchObject({ sharp: true, 'better-sqlite3': true })
    expect(data.strictDepBuilds).toBe(true)
    expect(data.minimumReleaseAge).toBe(1440)
    expect(data.blockExoticSubdeps).toBe(false)
    expect(fs.readFileSync(file, 'utf-8')).toContain('# 用户注释')
  })

  it('pnpm 10: 保留 onlyBuiltDependencies 并补全内置构建依赖', () => {
    mockPnpm('10.20.0')
    fs.writeFileSync(file, LEGACY_WORKSPACE)

    createWorkspace(false, dir)

    const data = readYamlFile(file)
    expect(data.onlyBuiltDependencies).toEqual(expect.arrayContaining(['better-sqlite3', ...BUILD_DEPENDENCIES]))
    expect(data.allowBuilds).toMatchObject({ 'better-sqlite3': true })
  })

  it('pnpm 9: 新项目写入 packages 字段', () => {
    mockPnpm('9.15.9')
    createWorkspace(false, dir)
    expect(readYamlFile(file).packages).toEqual(['plugins/*'])
  })

  it('获取pnpm版本失败时保留 onlyBuiltDependencies', () => {
    mockPnpm(null)
    createWorkspace(true, dir)
    const data = readYamlFile(file)
    expect(data.packages).toEqual([])
    expect(data.onlyBuiltDependencies).toEqual(BUILD_DEPENDENCIES)
  })

  it('重复执行时不修改文件', () => {
    mockPnpm('12.9.1')
    fs.writeFileSync(file, LEGACY_WORKSPACE)
    createWorkspace(false, dir)
    const first = fs.readFileSync(file, 'utf-8')
    createWorkspace(false, dir)
    expect(fs.readFileSync(file, 'utf-8')).toBe(first)
  })
})
