import { describe, it, expect } from 'vitest'
import { diffArray, diffSimpleArray, clamp, random, formatNumber, percentage, formatUnit, isEven, average, round, isNumber, isNumberInArray } from './number'

describe('common/number', () => {
  it('diffArray finds removed/added/common', () => {
    const a = [{ id: 1 }, { id: 2 }]
    const b = [{ id: 1 }, { id: 3 }]
    const r = diffArray(a, b)
    expect(r.removed).toEqual([{ id: 2 }])
    expect(r.added).toEqual([{ id: 3 }])
    expect(r.common).toEqual([{ id: 1 }])
  })
  it('diffSimpleArray works', () => {
    const r = diffSimpleArray([1, 2, 3], [2, 3, 4])
    expect(r.removed).toEqual([1])
    expect(r.added).toEqual([4])
    expect(r.common).toEqual([2, 3])
  })
  it('number helpers', () => {
    expect(clamp(5, 0, 10)).toBe(5)
    const rnd = random(1, 1)
    expect(rnd).toBe(1)
    expect(formatNumber(1234, 2)).toBe('1,234.00')
    expect(percentage(75, 200)).toBe(37.5)
    expect(formatUnit(1234)).toBe('1.2K')
    expect(isEven(2)).toBe(true)
    expect(average([1, 2, 3])).toBe(2)
    expect(round(1.235, 2)).toBe(1.24)
    expect(isNumber('x', 1)).toBe(1)
    expect(isNumberInArray([0, 'a'], 9)).toBe(0)
  })
})