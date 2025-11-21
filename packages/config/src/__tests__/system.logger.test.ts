import { describe, expect, it } from 'vitest'
import { configLoggerCompat } from '../system/logger'

describe('日志配置兼容 logger.compat', () => {
  it('类型非法时使用默认值', () => {
    const r = configLoggerCompat({ level: 1 as any, days_to_keep: 'x' as any, max_log_size: 'y' as any, fnc_color: 123 as any })
    expect(r.level).toBe('info')
    expect(r.days_to_keep).toBe(7)
    expect(r.max_log_size).toBe(0)
    expect(r.fnc_color).toBe('#E1D919')
  })
  it('保留有效输入值', () => {
    const r = configLoggerCompat({ level: 'debug', days_to_keep: 3, max_log_size: 10, fnc_color: '#fff' })
    expect(r.level).toBe('debug')
    expect(r.days_to_keep).toBe(3)
    expect(r.max_log_size).toBe(10)
    expect(r.fnc_color).toBe('#fff')
  })
  it('支持部分输入', () => {
    const r = configLoggerCompat({ level: 'warn' })
    expect(r.level).toBe('warn')
    expect(r.days_to_keep).toBe(7)
  })
})