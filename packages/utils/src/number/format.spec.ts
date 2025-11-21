import { describe, it, expect } from 'vitest'
import { formatNumber, formatUnit } from './format'

describe('number/format', () => {
  it('formatNumber with grouping and decimals', () => {
    expect(formatNumber(1234567)).toBe('1,234,567')
    expect(formatNumber(1234.567, 2)).toBe('1,234.57')
  })

  it('formatUnit scales and formats', () => {
    expect(formatUnit(999)).toBe('999')
    expect(formatUnit(1234)).toBe('1.2K')
    expect(formatUnit(1234567)).toBe('1.2M')
    expect(formatUnit(1234567890)).toBe('1.2B')
    expect(formatUnit(-1234)).toBe('-1.2K')
    expect(formatUnit(1e15)).toBe('1.0')
  })
})
