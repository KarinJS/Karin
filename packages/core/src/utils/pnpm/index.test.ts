import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isPnpmAtLeast } from '@/env'
import { backupWorkspaceFile, isPnpmAllowBuildSupported, prepareAllowBuild } from './index'

vi.mock('@/env', () => ({ isPnpmAtLeast: vi.fn() }))

/**
 * 模拟当前pnpm版本
 * @param version 版本号
 */
const mockPnpm = (version: string) => {
  const [major, minor] = version.split('.').map(Number)
  vi.mocked(isPnpmAtLeast).mockImplementation((m, n = 0) => major > m || (major === m && minor >= n))
}

describe('utils/pnpm', () => {
  let dir: string
  let file: string

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'karin-pnpm-'))
    file = path.join(dir, 'pnpm-workspace.yaml')
    vi.spyOn(process, 'cwd').mockReturnValue(dir)
    vi.stubGlobal('logger', { error: vi.fn() })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    fs.rmSync(dir, { recursive: true, force: true })
  })

  it('isPnpmAllowBuildSupported: --allow-build 需要 pnpm 10.4+', () => {
    mockPnpm('10.3.0')
    expect(isPnpmAllowBuildSupported()).toBe(false)
    mockPnpm('10.4.0')
    expect(isPnpmAllowBuildSupported()).toBe(true)
  })

  describe('prepareAllowBuild', () => {
    it('pnpm 10.4 以下不生成参数', () => {
      mockPnpm('9.15.9')
      expect(prepareAllowBuild(['sharp']).args).toEqual([])
      mockPnpm('10.3.0')
      expect(prepareAllowBuild(['sharp']).args).toEqual([])
    })

    it('pnpm 10.4+ 生成参数 并去重、忽略无效条目', () => {
      mockPnpm('12.9.1')
      expect(prepareAllowBuild(['sharp', ' canvas ', 'sharp', '', 1, null]).args).toEqual([
        '--allow-build=sharp',
        '--allow-build=canvas',
      ])
      expect(prepareAllowBuild(undefined).args).toEqual([])
      expect(prepareAllowBuild('sharp').args).toEqual([])
    })

    it('跳过 allowBuilds 中显式设为 false 的包 否则 pnpm 会以 ERR_PNPM_OVERRIDING_IGNORED_BUILT_DEPENDENCIES 中断安装', () => {
      mockPnpm('12.9.1')
      fs.writeFileSync(file, 'allowBuilds:\n  sharp: false\n  canvas: true\n')
      expect(prepareAllowBuild(['sharp', 'canvas', 'puppeteer']).args).toEqual([
        '--allow-build=canvas',
        '--allow-build=puppeteer',
      ])
    })

    it('不会在安装前修改 pnpm-workspace.yaml', () => {
      mockPnpm('12.9.1')
      const content = '# 注释\npackages:\n  - plugins/*\n'
      fs.writeFileSync(file, content)
      prepareAllowBuild(['sharp'])
      expect(fs.readFileSync(file, 'utf-8')).toBe(content)
    })

    it('restore 将 pnpm 写入的白名单还原为安装前的内容', () => {
      mockPnpm('12.9.1')
      const content = '# 注释\npackages:\n  - plugins/*\n'
      fs.writeFileSync(file, content)

      const { restore } = prepareAllowBuild(['sharp'])
      /** 模拟 pnpm 在安装失败前已写入 allowBuilds */
      fs.writeFileSync(file, 'packages:\n  - plugins/*\nallowBuilds:\n  sharp: true\n')
      restore()

      expect(fs.readFileSync(file, 'utf-8')).toBe(content)
    })

    it('全部被跳过时 restore 不做任何事', () => {
      mockPnpm('12.9.1')
      fs.writeFileSync(file, 'allowBuilds:\n  sharp: false\n')
      const { args, restore } = prepareAllowBuild(['sharp'])
      expect(args).toEqual([])

      fs.writeFileSync(file, 'changed: true\n')
      restore()
      expect(fs.readFileSync(file, 'utf-8')).toBe('changed: true\n')
    })
  })

  describe('backupWorkspaceFile', () => {
    it('备份时文件不存在 还原时删除 pnpm 创建的文件', () => {
      const restore = backupWorkspaceFile()
      fs.writeFileSync(file, 'allowBuilds:\n  sharp: true\n')
      restore()
      expect(fs.existsSync(file)).toBe(false)
    })

    it('文件被删除时重新写回', () => {
      fs.writeFileSync(file, 'packages: []\n')
      const restore = backupWorkspaceFile()
      fs.rmSync(file)
      restore()
      expect(fs.readFileSync(file, 'utf-8')).toBe('packages: []\n')
    })

    it('内容未变化时不写入', () => {
      fs.writeFileSync(file, 'packages: []\n')
      const restore = backupWorkspaceFile()
      const writeSpy = vi.spyOn(fs, 'writeFileSync')
      restore()
      expect(writeSpy).not.toHaveBeenCalled()
    })
  })
})
