import { describe, it, expect } from 'vitest'
import { bool, boolean, number, string, array } from './index'

describe('types/index', () => {
  it('bool and boolean handle defaults and coercion', () => {
    expect(bool(true)).toBe(true)
    expect(bool('x')).toBe(true)
    expect(bool(0)).toBe(false)
    expect(bool(undefined, false)).toBe(false)
    expect(boolean(false)).toBe(false)
    expect(boolean(undefined, true)).toBe(true)
  })

  it('number handles NaN and default', () => {
    expect(number(12)).toBe(12)
    expect(number('12')).toBe(12)
    expect(number('x')).toBe(0)
    expect(number(undefined, 7)).toBe(7)
  })

  it('string returns proper string', () => {
    expect(string('a')).toBe('a')
    expect(string(1)).toBe('1')
    expect(string(undefined, 'd')).toBe('d')
  })

  it('array returns array or default', () => {
    expect(array([1, 2])).toEqual([1, 2])
    expect(array(undefined)).toEqual([])
    expect(array(undefined, ['x'])).toEqual(['x'])
  })
})
