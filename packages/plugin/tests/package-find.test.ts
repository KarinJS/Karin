/**
 * package/find.ts 测试
 * @note v11 移除 git 类型，getAllPackages 和 getCache 方法已删除
 */

import { describe, it, expect } from 'vitest'
import { packageFinder } from '../src/package/find'

describe('package/find', () => {
  describe('packageFinder', () => {
    describe('getNpmPackages', () => {
      it('should return npm packages array', async () => {
        const packages = await packageFinder.getNpmPackages()
        expect(Array.isArray(packages)).toBe(true)
      })

      it('should use cache on second call', async () => {
        const first = await packageFinder.getNpmPackages()
        const second = await packageFinder.getNpmPackages()
        // 应该返回相同的结果
        expect(first.length).toBe(second.length)
      })

      it('should force refresh when requested', async () => {
        const packages = await packageFinder.getNpmPackages(true)
        expect(Array.isArray(packages)).toBe(true)
      })
    })

    describe('getDevPackages', () => {
      it('should return empty array in production mode', async () => {
        const originalEnv = process.env.NODE_ENV
        const originalDev = process.env.KARIN_DEV
        process.env.NODE_ENV = 'production'
        delete process.env.KARIN_DEV

        const packages = await packageFinder.getDevPackages()
        expect(packages).toEqual([])

        process.env.NODE_ENV = originalEnv
        if (originalDev) process.env.KARIN_DEV = originalDev
      })

      it('should return dev packages in development mode', async () => {
        const originalEnv = process.env.NODE_ENV
        process.env.NODE_ENV = 'development'

        const packages = await packageFinder.getDevPackages()
        expect(Array.isArray(packages)).toBe(true)

        process.env.NODE_ENV = originalEnv
      })
    })

    describe('getPluginsPackages', () => {
      it('should return apps array only (git removed in v11)', async () => {
        const result = await packageFinder.getPluginsPackages()
        expect(result).toHaveProperty('apps')
        expect(Array.isArray(result.apps)).toBe(true)
        // git 类型已在 v11 移除
        expect(result).not.toHaveProperty('git')
      })

      it('should use cache on second call', async () => {
        const first = await packageFinder.getPluginsPackages()
        const second = await packageFinder.getPluginsPackages()
        expect(first.apps.length).toBe(second.apps.length)
      })
    })

    describe('readPkg', () => {
      it('should read existing package.json', async () => {
        const pkg = await packageFinder.readPkg(process.cwd() + '/package.json')
        expect(pkg).toHaveProperty('name')
      })
    })
  })
})
