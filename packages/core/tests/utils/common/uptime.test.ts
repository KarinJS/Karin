import { describe, it, expect, vi, afterEach } from 'vitest'
import { uptime } from '@/utils/common/uptime'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('utils/common/uptime', () => {
  it('formats just seconds when uptime is short', () => {
    vi.spyOn(process, 'uptime').mockReturnValue(45)
    expect(uptime()).toBe('45秒')
  })

  it('formats minutes and seconds', () => {
    vi.spyOn(process, 'uptime').mockReturnValue(3 * 60 + 4)
    expect(uptime()).toBe('3分钟4秒')
  })

  it('formats hours/minutes/seconds', () => {
    vi.spyOn(process, 'uptime').mockReturnValue(2 * 3600 + 3 * 60 + 4)
    expect(uptime()).toBe('2小时3分钟4秒')
  })

  it('omits seconds once day is non-zero', () => {
    vi.spyOn(process, 'uptime').mockReturnValue(86400 + 7200 + 180 + 5)
    expect(uptime()).toBe('1天2小时3分钟')
  })

  it('returns an empty string for zero uptime', () => {
    vi.spyOn(process, 'uptime').mockReturnValue(0)
    expect(uptime()).toBe('')
  })
})
