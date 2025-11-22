import { describe, it, expect } from 'vitest'
import { strToBool } from './string'

describe('common/string', () => {
  it('array and arrayExcludeNonString', () => {
    expect(strToBool.array([1,'',null,undefined,'x'])).toEqual(['1','null','undefined','x'])
    expect(strToBool.arrayExcludeNonString(['a','',1,'b'])).toEqual(['a','b'])
  })
  it('string and number', () => {
    expect(strToBool.string('true')).toBe(true)
    expect(strToBool.string('no')).toBe(false)
    expect(strToBool.number('12', 3)).toBe(12)
    expect(Number.isNaN(strToBool.number('abc', 3) as any)).toBe(true)
  })
  it('arrayNumber and arrayString', () => {
    expect(strToBool.arrayNumber(['1','2','x'])).toEqual([1,2,NaN])
    expect(strToBool.arrayString([['a',1,'b'], 'x'])).toEqual(['a','b'])
    expect(strToBool.arrayString(['x'])).toEqual([])
  })
  it('mergeArray', () => {
    expect(strToBool.mergeArray(['a','b'], ['b','c'], 'x' as any)).toEqual(['a','b','c'])
  })
})