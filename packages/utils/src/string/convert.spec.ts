import { describe, it, expect } from 'vitest'
import { toBoolean, toNumber, toStringArray, filterStrings } from './convert'

describe('string/convert', () => {
  it('toBoolean works for truthy strings', () => {
    expect(toBoolean('true')).toBe(true)
    expect(toBoolean('1')).toBe(true)
    expect(toBoolean('yes')).toBe(true)
    expect(toBoolean('on')).toBe(true)
  })

  it('toBoolean returns false for other strings', () => {
    expect(toBoolean('false')).toBe(false)
    expect(toBoolean('0')).toBe(false)
    expect(toBoolean('no')).toBe(false)
    expect(toBoolean('random')).toBe(false)
    expect(toBoolean('')).toBe(false)
  })

  it('toNumber parses numbers and applies default for NaN', () => {
    expect(toNumber('123')).toBe(123)
    expect(toNumber('123.45')).toBe(123.45)
    expect(toNumber('abc')).toBe(0)
    expect(toNumber('abc', 99)).toBe(99)
  })

  it('toStringArray maps items to strings and filters nullish', () => {
    const arr = [1, 0, null, undefined, 'test', true]
    expect(toStringArray(arr)).toEqual(['1', '0', 'test', 'true'])
  })

  it('filterStrings returns only non-empty strings', () => {
    const arr = [1, 'hello', '', 'world', null]
    expect(filterStrings(arr)).toEqual(['hello', 'world'])
  })
})
