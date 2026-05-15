import { describe, it, expect } from 'vitest'
import {
  clamp,
  random,
  formatNumber,
  percentage,
  formatUnit,
  isEven,
  average,
  round,
  isNumber,
  isNumberInArray,
  createIdGenerator,
} from '@/utils/common/number'

describe('utils/common/number — clamp', () => {
  it('returns value when inside range', () => {
    expect(clamp(5, 0, 10)).toBe(5)
  })
  it('returns min when below range', () => {
    expect(clamp(-1, 0, 10)).toBe(0)
  })
  it('returns max when above range', () => {
    expect(clamp(11, 0, 10)).toBe(10)
  })
  it('handles negative ranges', () => {
    expect(clamp(-5, -10, -1)).toBe(-5)
    expect(clamp(-20, -10, -1)).toBe(-10)
    expect(clamp(0, -10, -1)).toBe(-1)
  })
})

describe('utils/common/number — random', () => {
  it('returns integer within inclusive range', () => {
    for (let i = 0; i < 200; i++) {
      const r = random(1, 5)
      expect(Number.isInteger(r)).toBe(true)
      expect(r).toBeGreaterThanOrEqual(1)
      expect(r).toBeLessThanOrEqual(5)
    }
  })
  it('returns the only value when min === max', () => {
    expect(random(7, 7)).toBe(7)
  })
})

describe('utils/common/number — formatNumber', () => {
  it('adds thousands separators with no decimals by default', () => {
    expect(formatNumber(1234567)).toBe('1,234,567')
  })
  it('formats with the requested decimal precision', () => {
    expect(formatNumber(1234.567, 2)).toBe('1,234.57')
  })
  it('handles zero and negatives', () => {
    expect(formatNumber(0)).toBe('0')
    expect(formatNumber(-1234)).toBe('-1,234')
  })
})

describe('utils/common/number — percentage', () => {
  it('returns 0 when total is 0 (no NaN)', () => {
    expect(percentage(10, 0)).toBe(0)
  })
  it('computes basic percentages with 2 decimals by default', () => {
    expect(percentage(75, 200)).toBe(37.5)
  })
  it('honours the digits argument', () => {
    expect(percentage(1, 3, 4)).toBe(33.3333)
  })
})

describe('utils/common/number — formatUnit', () => {
  it('returns number string when under 1000', () => {
    expect(formatUnit(500)).toBe('500')
  })
  it('formats thousands as K', () => {
    expect(formatUnit(1234)).toBe('1.2K')
  })
  it('formats millions as M', () => {
    expect(formatUnit(1234567)).toBe('1.2M')
  })
  it('formats billions as B', () => {
    expect(formatUnit(1234567890)).toBe('1.2B')
  })
  it('respects digits parameter', () => {
    expect(formatUnit(1500, 0)).toBe('2K')
  })
})

describe('utils/common/number — isEven', () => {
  it('detects even numbers', () => {
    expect(isEven(0)).toBe(true)
    expect(isEven(2)).toBe(true)
    expect(isEven(-4)).toBe(true)
  })
  it('detects odd numbers', () => {
    expect(isEven(1)).toBe(false)
    expect(isEven(-3)).toBe(false)
  })
})

describe('utils/common/number — average', () => {
  it('returns 0 for empty arrays (no NaN)', () => {
    expect(average([])).toBe(0)
  })
  it('computes the arithmetic mean', () => {
    expect(average([1, 2, 3, 4, 5])).toBe(3)
    expect(average([10, 20])).toBe(15)
  })
})

describe('utils/common/number — round', () => {
  it('rounds half up at integer level by default', () => {
    expect(round(1.4)).toBe(1)
    expect(round(1.5)).toBe(2)
  })
  it('rounds to the requested number of decimals', () => {
    expect(round(1.234, 2)).toBe(1.23)
    expect(round(1.235, 2)).toBe(1.24)
  })
})

describe('utils/common/number — isNumber', () => {
  it('returns the value when it is a number', () => {
    expect(isNumber(42)).toBe(42)
    expect(isNumber(0)).toBe(0)
  })
  it('returns the default when not a number', () => {
    expect(isNumber('42')).toBe(0)
    expect(isNumber(null)).toBe(0)
    expect(isNumber(undefined, 7)).toBe(7)
  })
})

describe('utils/common/number — isNumberInArray', () => {
  it('returns the first numeric element', () => {
    expect(isNumberInArray([1, '2', 3])).toBe(1)
  })
  it('returns the default when no number is present', () => {
    expect(isNumberInArray(['1', '2', '3'], 0)).toBe(0)
    expect(isNumberInArray([null, undefined, 'x'], 99)).toBe(99)
  })
})

describe('utils/common/number — createIdGenerator', () => {
  it('starts at 1 by default and increments', () => {
    const next = createIdGenerator()
    expect(next()).toBe(1)
    expect(next()).toBe(2)
    expect(next()).toBe(3)
  })
  it('starts after the given seed', () => {
    const next = createIdGenerator(100)
    expect(next()).toBe(101)
    expect(next()).toBe(102)
  })
  it('keeps state per generator instance', () => {
    const a = createIdGenerator()
    const b = createIdGenerator()
    a()
    a()
    expect(b()).toBe(1)
    expect(a()).toBe(3)
  })
})
