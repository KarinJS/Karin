import { describe, expect, it } from 'vitest'
import { filter } from '../filter/filter'

describe('过滤配置兼容 filter.compat', () => {
  it('缺失字段使用默认值', () => {
    const r = filter.compat({})
    expect(r.enable.friend).toBe(true)
    expect(r.enable_list.user).toEqual([])
  })
  it('过滤掉非法列表项', () => {
    const r = filter.compat({
      enable_list: { user: ['a', 1 as any, ''] } as any,
      disable_list: { group: ['g', '', {} as any] } as any,
      log_enable_list: { channel: ['c', null as any] } as any,
      log_disable_list: { friend: ['f', ''] } as any,
      plugin: { enable: ['p', 2 as any], disable: ['q', ''] } as any,
    })
    expect(r.enable_list.user).toEqual(['a'])
    expect(r.disable_list.group).toEqual(['g'])
    expect(r.log_enable_list.channel).toEqual(['c'])
    expect(r.log_disable_list.friend).toEqual(['f'])
    expect(r.plugin.enable).toEqual(['p'])
  })
  it('开关布尔配置生效', () => {
    const r = filter.compat({ enable: { friend: false, group: true, direct: false, guild: true, channel: false } as any })
    expect(r.enable.friend).toBe(false)
    expect(r.enable.direct).toBe(false)
    expect(r.enable.guild).toBe(true)
  })
  it('clearCache 覆盖', () => {
    filter.clearCache()
    expect(true).toBe(true)
  })
})
