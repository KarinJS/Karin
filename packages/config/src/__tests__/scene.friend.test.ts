import { describe, expect, it } from 'vitest'
import { friend } from '../scene/friend'

describe('私聊配置兼容 friend.compat', () => {
  it('配置损坏时回退到默认', () => {
    const result = friend.compat(null as any)
    expect(result.global.cd).toBe(1)
  })
  it('合并并规范化配置', () => {
    const cfg = friend.compat({
      global: { cd: 2, alias: ['x'] } as any,
      'Bot:1:2': { mode: 3 },
    } as any)
    expect(cfg.global.cd).toBe(2)
    expect(cfg['Bot:1:2'].mode).toBe(3)
  })
  it('继承为假使用默认值', () => {
    const cfg = friend.compat({
      global: { cd: 5 } as any,
      'Bot:1:2': { inherit: false, mode: 2 },
    } as any)
    expect(cfg['Bot:1:2'].cd).toBe(1)
  })
})

describe('私聊配置获取 friend.get', () => {
  it('按优先级匹配并缓存', () => {
    const cfg = friend.compat({
      global: {},
      'Bot:1': { cd: 8 } as any,
      'Bot:1:9': { cd: 7 } as any,
    } as any)
    const r1 = friend.get(cfg, '1', '9')
    expect(r1.cd).toBe(7)
    const r2 = friend.get(cfg, '1', '9')
    expect(r2).toBe(r1)
  })
  it('未命中时回退到全局', () => {
    const cfg = friend.compat({ global: {} } as any)
    const r = friend.get(cfg, 'x', 'y')
    expect(r).toEqual(cfg.global)
  })
})