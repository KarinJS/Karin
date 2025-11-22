import { describe, it, expect, vi } from 'vitest'
import { toTimeUnits, formatTimeDiff, getUptime } from './format'

describe('time/format', () => {
  it('toTimeUnits splits seconds', () => {
    expect(toTimeUnits(90061)).toEqual({ days: 1, hours: 1, minutes: 1, seconds: 1 })
  })

  it('formatTimeDiff formats with defaults and options', () => {
    const start = 0
    const end = 90061 * 1000
    expect(formatTimeDiff(start, end)).toBe('1天1小时1分钟')
    expect(formatTimeDiff(start, end, { showZero: true, separator: ' ' })).toBe('1天 1小时 1分钟')
    expect(formatTimeDiff(start, start)).toBe('0秒')
  })

  it('getUptime formats mocked uptime', () => {
    const spy = vi.spyOn(process, 'uptime').mockReturnValue(3661)
    const res = getUptime({ separator: ' ' })
    expect(res).toBe('1小时 1分钟 1秒')
    spy.mockRestore()
  })

  it('formatTimeDiff includes seconds when days is zero', () => {
    expect(formatTimeDiff(0, 1000)).toBe('1秒')
  })

  it('getUptime includes days when applicable', () => {
    const spy = vi.spyOn(process, 'uptime').mockReturnValue(86400)
    const res = getUptime()
    expect(res.includes('1天')).toBe(true)
    spy.mockRestore()
  })
})
