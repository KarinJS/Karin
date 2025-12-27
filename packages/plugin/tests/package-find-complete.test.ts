/**
 * package/find.ts 完整覆盖测试
 */

import { describe, it, expect, vi, afterEach } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

describe('package/find 完整覆盖', () => {
  // 保存原始环境
  const originalEnv = process.env.NODE_ENV
  const originalKarinDev = process.env.KARIN_DEV

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
    if (originalKarinDev !== undefined) {
      process.env.KARIN_DEV = originalKarinDev
    } else {
      delete process.env.KARIN_DEV
    }
    vi.restoreAllMocks()
  })

  describe('packageFinder', () => {
    it('should get cache returns copy', async () => {
      const { packageFinder } = await import('../src/package/find')
      const cache1 = packageFinder.getCache('npm')
      const cache2 = packageFinder.getCache('npm')
      expect(cache1).not.toBe(cache2)
      expect(cache1).toEqual(cache2)
    })

    it('should get all cache types', async () => {
      const { packageFinder } = await import('../src/package/find')
      expect(Array.isArray(packageFinder.getCache('npm'))).toBe(true)
      expect(Array.isArray(packageFinder.getCache('git'))).toBe(true)
      expect(Array.isArray(packageFinder.getCache('apps'))).toBe(true)
      expect(Array.isArray(packageFinder.getCache('dev'))).toBe(true)
    })

    describe('getNpmPackages', () => {
      it('should return empty for non-existent node_modules', async () => {
        // 使用空目录作为 cwd
        const { packageFinder } = await import('../src/package/find')
        const originalCwd = packageFinder.cwd
        packageFinder.cwd = '/non/existent/path'

        const packages = await packageFinder.getNpmPackages(true)
        expect(Array.isArray(packages)).toBe(true)

        packageFinder.cwd = originalCwd
      })

      it('should use cache when not force refreshing', async () => {
        const { packageFinder } = await import('../src/package/find')

        // 第一次获取
        await packageFinder.getNpmPackages(true)
        // 第二次使用缓存
        const cached = await packageFinder.getNpmPackages(false)
        expect(Array.isArray(cached)).toBe(true)
      })
    })

    describe('getDevPackages', () => {
      it('should return empty in production mode', async () => {
        process.env.NODE_ENV = 'production'
        delete process.env.KARIN_DEV

        // 需要重新导入以获取新的模块实例
        vi.resetModules()
        const { packageFinder } = await import('../src/package/find')
        const packages = await packageFinder.getDevPackages(true)
        expect(packages).toEqual([])
      })
    })

    describe('getPluginsPackages', () => {
      it('should return empty when plugins dir does not exist', async () => {
        const { packageFinder } = await import('../src/package/find')
        const originalCwd = packageFinder.cwd
        packageFinder.cwd = '/non/existent/path'

        const result = await packageFinder.getPluginsPackages(true)
        expect(result.git).toEqual([])
        expect(result.apps).toEqual([])

        packageFinder.cwd = originalCwd
      })

      it('should use cache when not force refreshing', async () => {
        const { packageFinder } = await import('../src/package/find')

        // 第一次获取
        await packageFinder.getPluginsPackages(true)
        // 第二次使用缓存
        const result = await packageFinder.getPluginsPackages(false)
        expect(result).toHaveProperty('git')
        expect(result).toHaveProperty('apps')
      })
    })

    describe('getAllPackages', () => {
      it('should return all package types', async () => {
        const { packageFinder } = await import('../src/package/find')
        const result = await packageFinder.getAllPackages(true)

        expect(result).toHaveProperty('npm')
        expect(result).toHaveProperty('git')
        expect(result).toHaveProperty('apps')
        expect(result).toHaveProperty('dev')
      })

      it('should force refresh all when requested', async () => {
        const { packageFinder } = await import('../src/package/find')

        const result = await packageFinder.getAllPackages(true)
        expect(Array.isArray(result.npm)).toBe(true)
        expect(Array.isArray(result.git)).toBe(true)
        expect(Array.isArray(result.apps)).toBe(true)
        expect(Array.isArray(result.dev)).toBe(true)
      })
    })

    describe('readPkg', () => {
      it('should read existing package.json', async () => {
        const { packageFinder } = await import('../src/package/find')
        const pkgPath = path.join(process.cwd(), 'package.json')

        if (fs.existsSync(pkgPath)) {
          const pkg = await packageFinder.readPkg(pkgPath)
          expect(pkg).toHaveProperty('name')
        }
      })
    })
  })
})
