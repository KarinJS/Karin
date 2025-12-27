/**
 * marketplace/market.ts 测试
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('marketplace/market', () => {
  describe('getPluginMarket', () => {
    let originalFetch: typeof global.fetch

    beforeEach(() => {
      originalFetch = global.fetch
    })

    afterEach(() => {
      global.fetch = originalFetch
      vi.restoreAllMocks()
    })

    it('should fetch from plugin sources', async () => {
      // 模拟成功响应
      const mockPlugins = {
        plugins: [
          { name: 'test-plugin', type: 'npm' },
          { name: 'test-app', type: 'app' },
        ],
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockPlugins,
      })

      const { getPluginMarket } = await import('../src/marketplace/market')
      const result = await getPluginMarket(true)

      expect(result).toBeDefined()
      expect(result.plugins).toBeDefined()
    })

    it('should normalize app type to apps', async () => {
      const mockPlugins = {
        plugins: [
          { name: 'test-app', type: 'app' },
        ],
      }

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => mockPlugins,
      })

      const { getPluginMarket } = await import('../src/marketplace/market')
      const result = await getPluginMarket(true)

      expect(result.plugins[0].type).toBe('apps')
    })

    it('should throw when all sources fail', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      const { getPluginMarket } = await import('../src/marketplace/market')

      await expect(getPluginMarket(true)).rejects.toThrow('无法从任何源获取插件列表')
    })

    it('should return null for non-ok response', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      })

      const { getPluginMarket } = await import('../src/marketplace/market')

      await expect(getPluginMarket(true)).rejects.toThrow()
    })
  })
})
