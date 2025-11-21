import { describe, expect, it } from 'vitest'
import { guild } from '../scene/guild'

describe('频道配置兼容 guild.compat', () => {
  it('配置损坏时回退到默认', () => {
    const result = guild.compat(null as any)
    expect(result.global.cd).toBe(1)
  })
  it('合并并规范化配置', () => {
    const cfg = guild.compat({
      global: { cd: 2, user_cd: 3, alias: ['x'] } as any,
      'guild:1': { mode: 3 },
    } as any)
    expect(cfg.global.cd).toBe(2)
    expect(cfg['guild:1'].mode).toBe(3)
  })
  it('继承为假使用默认值', () => {
    const cfg = guild.compat({
      global: { cd: 5 } as any,
      'guild:1': { inherit: false, mode: 2 },
    } as any)
    expect(cfg['guild:1'].cd).toBe(1)
  })
})

describe('频道配置获取 guild.get', () => {
  it('按优先级匹配并缓存', () => {
    const cfg = guild.compat({
      global: {},
      'channel:7': { cd: 4 } as any,
      'guild:1': { cd: 3 } as any,
      'guild:1:7': { cd: 5 } as any,
      'Bot:1': { cd: 2 } as any,
      'Bot:1:1': { cd: 6 } as any,
      'Bot:1:1:7': { cd: 9 } as any,
    } as any)
    const r1 = guild.get(cfg, '1', '1', '7')
    expect(r1.cd).toBe(9)
    const r2 = guild.get(cfg, '1', '1', '7')
    expect(r2).toBe(r1)
  })
  it('未命中时回退到全局', () => {
    const cfg = guild.compat({ global: {} } as any)
    const r = guild.get(cfg, 'x', 'y', 'z')
    expect(r).toEqual(cfg.global)
  })
})