import { describe, it, expect, vi, afterEach } from 'vitest'
import { uptime, formatTime } from '@/utils/system/time'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('utils/system/time — uptime', () => {
  it('formats just seconds when short', () => {
    vi.spyOn(process, 'uptime').mockReturnValue(45)
    expect(uptime()).toBe('45秒')
  })

  it('formats hours/minutes/seconds', () => {
    vi.spyOn(process, 'uptime').mockReturnValue(2 * 3600 + 3 * 60 + 4)
    expect(uptime()).toBe('2小时3分钟4秒')
  })

  it('omits seconds when day is non-zero', () => {
    vi.spyOn(process, 'uptime').mockReturnValue(86400 + 7200 + 180 + 5)
    expect(uptime()).toBe('1天2小时3分钟')
  })
})

describe('utils/system/time — formatTime', () => {
  it('returns the elapsed gap between two ms timestamps', () => {
    // 1 hour 2 minutes 3 seconds apart
    const t1 = 1_700_000_000_000
    const t2 = t1 + (1 * 3600 + 2 * 60 + 3) * 1000
    expect(formatTime(t1, t2)).toBe('1小时2分钟3秒')
  })

  // The implementation's regex /0[天时分秒]/ never matches the '小' in '小时',
  // so a zero hour stays as the (misspelt) '0小时'. Lock in the current behavior
  // rather than asserting an idealized result.
  it('drops zero day/min/sec but keeps a quirky "0小时钟" segment for zero hour', () => {
    const t1 = 1_700_000_000_000
    const t2 = t1 + 5_000 // 5 seconds
    expect(formatTime(t1, t2)).toBe('0小时钟5秒')
  })

  it('defaults to now() for the second argument', () => {
    const now = 1_800_000_000_000
    vi.spyOn(Date, 'now').mockReturnValue(now)
    const t1 = now - 65_000 // 1 minute 5 seconds ago
    expect(formatTime(t1)).toBe('0小时1分钟5秒')
  })

  it('accepts 13-digit ms timestamps and returns a non-empty formatted string', () => {
    const t2 = 1_700_000_000_000
    const t1 = t2 - 3_600_000 // 1 hour earlier
    const result = formatTime(t1, t2)
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
    expect(result).toContain('1小时')
  })
})
