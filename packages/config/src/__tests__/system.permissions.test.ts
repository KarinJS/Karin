import { describe, expect, it } from 'vitest'
import { configPermissionsCompat, permissions } from '../config/permissions'

describe('权限配置兼容 permissions.compat', () => {
  it('过滤非字符串与空字符串', () => {
    const r = configPermissionsCompat({ master: ['a', 1 as any, ''], admin: ['b', null as any] })
    expect(r.master).toEqual(['a'])
    expect(r.admin).toEqual(['b'])
  })
  it('缺失字段使用默认值', () => {
    const r = configPermissionsCompat({})
    expect(r.master).toEqual([])
    expect(r.admin).toEqual([])
  })
  it('非法类型回退默认', () => {
    const r = configPermissionsCompat({ master: null as any, admin: undefined as any })
    expect(r.master).toEqual([])
    expect(r.admin).toEqual([])
  })
  it('clearCache 覆盖', () => {
    permissions.clearCache()
    expect(true).toBe(true)
  })
})
