import { describe, expect, it } from 'vitest'
import { group } from '../scene/group'

describe('群组配置兼容 group.compat', () => {
  it('配置损坏时回退到默认', () => {
    const result = group.compat(null as any)
    expect(result.global.cd).toBe(1)
  })
  it('继承为真时合并并规范化', () => {
    const cfg = group.compat({
      global: { cd: 2, user_cd: 3, alias: ['x'], enable: ['a'], disable: ['b'], member_enable: ['u'], member_disable: ['v'] } as any,
      'group:1': { mode: 3 },
    })
    expect(cfg.global.cd).toBe(2)
    expect(cfg['group:1'].mode).toBe(3)
    expect(Array.isArray(cfg['group:1'].alias)).toBe(true)
  })
  it('继承为假时使用默认值', () => {
    const cfg = group.compat({
      global: { cd: 5 } as any,
      'group:1': { inherit: false, mode: 2 },
    } as any)
    expect(cfg['group:1'].cd).toBe(1)
    expect(cfg['group:1'].mode).toBe(2)
  })
})

describe('群组配置获取 group.get', () => {
  it('按优先级匹配并缓存', () => {
    const cfg = group.compat({
      global: {},
      'group:9': { cd: 9 } as any,
      'Bot:1': { cd: 8 } as any,
      'Bot:1:9': { cd: 7 } as any,
    } as any)
    const r1 = group.get(cfg, '1', '9')
    expect(r1.cd).toBe(7)
    const r2 = group.get(cfg, '1', '9')
    expect(r2).toBe(r1)
  })
  it('未命中时回退到全局', () => {
    const cfg = group.compat({ global: {} } as any)
    const r = group.get(cfg, 'x', 'y')
    expect(r).toEqual(cfg.global)
  })
})