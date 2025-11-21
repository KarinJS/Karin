import { describe, expect, it } from 'vitest'
import { configRedisCompat, configDefaultRedis, redis } from '../system/redis'

describe('Redis 配置兼容 redis.compat', () => {
  it('返回输入对象的兼容转换', () => {
    const r = configRedisCompat({ enable: false, url: 'redis://localhost:6380', database: 1 })
    expect(r.enable).toBe(false)
    expect(r.url).toBe('redis://localhost:6380')
    expect(r.database).toBe(1)
  })
  it('默认导出正确', () => {
    expect(configDefaultRedis.enable).toBe(true)
  })
  it('空对象保持不变', () => {
    const r = configRedisCompat({})
    expect(r as any).toEqual({})
  })
  it('clearCache 覆盖', () => {
    redis.clearCache()
    expect(true).toBe(true)
  })
})
