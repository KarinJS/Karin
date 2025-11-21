import { describe, expect, it } from 'vitest'
import { configPm2Compat, configDefaultPm2 } from '../system/pm2'

describe('PM2 配置兼容 pm2.compat', () => {
  it('返回输入对象的兼容转换', () => {
    const r = configPm2Compat({ lines: 10, apps: configDefaultPm2.apps })
    expect(r.lines).toBe(10)
    expect(Array.isArray(r.apps)).toBe(true)
  })
  it('空对象保持不变', () => {
    const r = configPm2Compat({})
    expect(r as any).toEqual({})
  })
  it('默认导出保持既定默认值', () => {
    expect(configDefaultPm2.lines).toBe(1000)
  })
})