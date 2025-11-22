import { describe, it, expect, vi } from 'vitest'
import { uptime, formatTime } from './time'

describe('system/time', () => {
  it('uptime formats parts', () => {
    const spy = vi.spyOn(process, 'uptime').mockReturnValue(3661)
    const s = uptime()
    expect(s).toBe('1小时1分钟1秒')
    spy.mockRestore()
  })
  it('formatTime handles 10-digit and ms inputs', () => {
    const s1 = formatTime(0, 1000)
    expect(s1.endsWith('秒')).toBe(true)
    const s2 = formatTime(1700000000, 1700003600)
    expect(typeof s2).toBe('string')
  })
})