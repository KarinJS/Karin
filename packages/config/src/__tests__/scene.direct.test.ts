import { describe, expect, it } from 'vitest'
import { direct } from '../scene/direct'

describe('频道私信配置兼容 direct.compat', () => {
  it('配置损坏时回退到默认', () => {
    const result = direct.compat(null as any)
    expect(result.global.cd).toBe(1)
  })
  it('合并并规范化配置', () => {
    const cfg = direct.compat({
      global: { cd: 2, alias: ['x'] } as any,
      'Bot:1:2:3': { mode: 3 },
    } as any)
    expect(cfg.global.cd).toBe(2)
    expect(cfg['Bot:1:2:3'].mode).toBe(3)
  })
  it('继承为假使用默认值', () => {
    const cfg = direct.compat({
      global: { cd: 5 } as any,
      'Bot:1:2:3': { inherit: false, mode: 2 },
    } as any)
    expect(cfg['Bot:1:2:3'].cd).toBe(1)
  })
})

describe('频道私信配置获取 direct.get', () => {
  it('含频道信息按优先级匹配并缓存', () => {
    const cfg = direct.compat({
      global: {},
      'Bot:1:9': { cd: 8 } as any,
      'Bot:1:9:7': { cd: 6 } as any,
      'guild:9': { cd: 5 } as any,
    } as any)
    const r1 = direct.get(cfg, '1', '7', '9')
    expect(r1.cd).toBe(6)
    const r2 = direct.get(cfg, '1', '7', '9')
    expect(r2).toBe(r1)
  })
  it('不含频道信息按优先级匹配', () => {
    const cfg = direct.compat({
      global: {},
      'Bot:1:7': { cd: 6 } as any,
    } as any)
    const r = direct.get(cfg, '1', '7')
    expect(r.cd).toBe(6)
  })
  it('未命中时回退到全局', () => {
    const cfg = direct.compat({ global: {} } as any)
    const r = direct.get(cfg, 'x', 'y')
    expect(r).toEqual(cfg.global)
  })
})