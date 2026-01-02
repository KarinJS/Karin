/**
 * package/find.ts 深度单元测试
 * @description PackageFinder 类的完整测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { packageFinder } from '../src/package/find'
import { packageList } from '../src/store'
import fs from 'node:fs'
import path from 'node:path'

// Mock dependencies
vi.mock('node:fs', async () => {
  const actual = await vi.importActual<typeof import('node:fs')>('node:fs')
  return {
    ...actual,
    default: {
      ...actual,
      existsSync: vi.fn(),
      promises: {
        writeFile: vi.fn(),
      },
    },
    existsSync: vi.fn(),
    promises: {
      writeFile: vi.fn(),
    },
  }
})

vi.mock('@karinjs/utils', () => ({
  getDirs: vi.fn().mockResolvedValue([]),
  requireFile: vi.fn().mockResolvedValue({}),
  npm: {
    getNpmPackages: vi.fn().mockResolvedValue([]),
  },
}))

vi.mock('@karinjs/envs', () => ({
  NPM_EXCLUDE_LIST: [],
  isDev: vi.fn().mockReturnValue(false),
}))

describe('package/find 深度测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    packageList.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    packageList.clear()
  })

  describe('packageFinder 对象', () => {
    it('应该存在 cwd 属性', () => {
      expect(packageFinder.cwd).toBeDefined()
      expect(typeof packageFinder.cwd).toBe('string')
    })

    it('cwd 应该使用正斜杠', () => {
      expect(packageFinder.cwd).not.toContain('\\')
    })
  })

  describe('readPkg', () => {
    it('应该是一个异步函数', () => {
      expect(typeof packageFinder.readPkg).toBe('function')
    })

    it('应该读取存在的 package.json', async () => {
      const { requireFile } = await import('@karinjs/utils')
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(requireFile).mockResolvedValue({ name: 'test-pkg', version: '1.0.0' })

      const result = await packageFinder.readPkg('/path/to/package.json')

      expect(result.name).toBe('test-pkg')
      expect(result.version).toBe('1.0.0')
    })

    it('应该为不存在的文件创建默认 package.json', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false)

      const result = await packageFinder.readPkg('/path/to/plugin/package.json')

      expect(result).toHaveProperty('name')
      expect(result).toHaveProperty('version')
      expect(result.karinType).toBe('apps')
    })

    it('默认 package.json 应该使用目录名作为包名', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false)

      const result = await packageFinder.readPkg('/path/to/my-plugin/package.json')

      expect(result.name).toBe('my-plugin')
    })
  })

  describe('getNpmPackages', () => {
    it('应该返回空数组当没有 npm 包时', async () => {
      const { npm } = await import('@karinjs/utils')
      vi.mocked(npm.getNpmPackages).mockResolvedValue([])

      const result = await packageFinder.getNpmPackages(true)

      expect(result).toEqual([])
    })

    it('应该过滤非 Karin 插件', async () => {
      const { npm, requireFile } = await import('@karinjs/utils')
      vi.mocked(npm.getNpmPackages).mockResolvedValue([
        { name: 'some-package', abs: '/path/to/some-package' },
      ])
      vi.mocked(requireFile).mockResolvedValue({
        name: 'some-package',
        // 没有 exports['./karin.config'] 或 karin 属性
      })

      const result = await packageFinder.getNpmPackages(true)

      expect(result).toEqual([])
    })

    it('应该识别有 karin.config 导出的插件', async () => {
      const { npm, requireFile } = await import('@karinjs/utils')
      vi.mocked(npm.getNpmPackages).mockResolvedValue([
        { name: 'karin-plugin', abs: '/path/to/karin-plugin' },
      ])
      vi.mocked(requireFile).mockResolvedValue({
        name: 'karin-plugin',
        exports: { './karin.config': './karin.config.js' },
      })

      const result = await packageFinder.getNpmPackages(true)

      expect(result.length).toBe(1)
      expect(result[0].name).toBe('karin-plugin')
    })

    it('应该识别有 karin 对象的插件', async () => {
      const { npm, requireFile } = await import('@karinjs/utils')
      vi.mocked(npm.getNpmPackages).mockResolvedValue([
        { name: 'karin-plugin-2', abs: '/path/to/karin-plugin-2' },
      ])
      vi.mocked(requireFile).mockResolvedValue({
        name: 'karin-plugin-2',
        karin: { type: 'plugin' },
      })

      const result = await packageFinder.getNpmPackages(true)

      expect(result.length).toBe(1)
    })

    it('应该使用缓存当不强制刷新时', async () => {
      // 先添加缓存
      packageList.add('npm', { name: 'cached-pkg', abs: '/cached', pkg: '/cached/package.json' })

      const result = await packageFinder.getNpmPackages(false)

      expect(result.length).toBe(1)
      expect(result[0].name).toBe('cached-pkg')
    })
  })

  describe('getDevPackages', () => {
    it('应该在非开发环境返回空数组', async () => {
      const { isDev } = await import('@karinjs/envs')
      vi.mocked(isDev).mockReturnValue(false)

      const result = await packageFinder.getDevPackages()

      expect(result).toEqual([])
    })

    it('应该在开发环境检查 package.json', async () => {
      const { isDev } = await import('@karinjs/envs')
      const { requireFile } = await import('@karinjs/utils')
      vi.mocked(isDev).mockReturnValue(true)
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(requireFile).mockResolvedValue({
        name: 'dev-plugin',
        karin: { type: 'plugin' },
      })

      const result = await packageFinder.getDevPackages(true)

      expect(result.length).toBe(1)
    })

    it('应该在 package.json 不存在时返回空数组', async () => {
      const { isDev } = await import('@karinjs/envs')
      vi.mocked(isDev).mockReturnValue(true)
      vi.mocked(fs.existsSync).mockReturnValue(false)

      const result = await packageFinder.getDevPackages(true)

      expect(result).toEqual([])
    })

    it('应该使用缓存当不强制刷新时', async () => {
      const { isDev } = await import('@karinjs/envs')
      vi.mocked(isDev).mockReturnValue(true)

      // 先添加缓存
      packageList.add('dev', { name: 'cached-dev', abs: '/dev', pkg: '/dev/package.json' })

      const result = await packageFinder.getDevPackages(false)

      expect(result.length).toBe(1)
      expect(result[0].name).toBe('cached-dev')
    })
  })

  describe('getPluginsPackages', () => {
    it('应该在 plugins 目录不存在时返回空对象', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false)

      const result = await packageFinder.getPluginsPackages()

      expect(result.apps).toEqual([])
    })

    it('应该扫描 plugins 目录', async () => {
      const { getDirs, requireFile } = await import('@karinjs/utils')
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(getDirs).mockResolvedValue(['plugin-a', 'plugin-b'])
      vi.mocked(requireFile).mockResolvedValue({ name: 'test-plugin', version: '1.0.0' })

      const result = await packageFinder.getPluginsPackages(true)

      expect(result.apps.length).toBe(2)
    })

    it('应该使用缓存当不强制刷新时', async () => {
      // 先添加缓存
      packageList.add('apps', { name: 'cached-app', abs: '/app', pkg: '/app/package.json' })

      const result = await packageFinder.getPluginsPackages(false)

      expect(result.apps.length).toBe(1)
      expect(result.apps[0].name).toBe('cached-app')
    })

    it('应该正确规范化路径', async () => {
      const { getDirs, requireFile } = await import('@karinjs/utils')
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(getDirs).mockResolvedValue(['test-plugin'])
      vi.mocked(requireFile).mockResolvedValue({ name: 'test-plugin', version: '1.0.0' })

      const result = await packageFinder.getPluginsPackages(true)

      expect(result.apps[0].abs).not.toContain('\\')
      expect(result.apps[0].pkg).not.toContain('\\')
    })
  })

  describe('边缘情况', () => {
    it('应该处理空的 plugins 目录', async () => {
      const { getDirs } = await import('@karinjs/utils')
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(getDirs).mockResolvedValue([])

      const result = await packageFinder.getPluginsPackages(true)

      expect(result.apps).toEqual([])
    })

    it('应该处理 readPkg 错误', async () => {
      const { requireFile } = await import('@karinjs/utils')
      vi.mocked(fs.existsSync).mockReturnValue(true)
      vi.mocked(requireFile).mockRejectedValue(new Error('Read error'))

      await expect(packageFinder.readPkg('/path/to/package.json')).rejects.toThrow()
    })
  })
})
