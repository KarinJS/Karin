import { describe, it, expect } from 'vitest'
import { strToBool } from '@/utils/common/string'

describe('utils/common/string — strToBool.array', () => {
  it('coerces mixed values to non-empty strings', () => {
    expect(strToBool.array([1, '2'])).toEqual(['1', '2'])
  })
  it('drops empty strings produced by String(null|undefined|NaN|"")', () => {
    // String(null) === 'null', String(undefined) === 'undefined' -> length > 0; NaN -> 'NaN'
    // Only literal empty string is dropped.
    expect(strToBool.array(['3', ''])).toEqual(['3'])
  })
})

describe('utils/common/string — strToBool.arrayExcludeNonString', () => {
  it('keeps only non-empty string elements', () => {
    expect(strToBool.arrayExcludeNonString(['1', '2', '3'])).toEqual(['1', '2', '3'])
    expect(strToBool.arrayExcludeNonString(['1', '2', '3', null, undefined, NaN, ''])).toEqual([
      '1',
      '2',
      '3',
    ])
  })
})

describe('utils/common/string — strToBool.string', () => {
  it.each([
    ['true', true],
    ['1', true],
    ['yes', true],
    ['on', true],
    ['false', false],
    ['0', false],
    ['no', false],
    ['off', false],
    ['', false],
  ])('strToBool.string(%j) === %j', (input, expected) => {
    expect(strToBool.string(input)).toBe(expected)
  })
})

describe('utils/common/string — strToBool.number', () => {
  it('parses numeric strings', () => {
    expect(strToBool.number('1')).toBe(1)
    expect(strToBool.number('2.5')).toBe(2.5)
  })
  it('returns NaN for non-numeric strings (current implementation)', () => {
    // The implementation uses Number() which returns NaN for non-numeric; typeof NaN === 'number'
    // so the default branch is never hit. This locks in current behavior.
    expect(Number.isNaN(strToBool.number('abc'))).toBe(true)
  })
})

describe('utils/common/string — strToBool.arrayNumber', () => {
  it('converts a string array into numbers', () => {
    expect(strToBool.arrayNumber(['1', '2', '3'])).toEqual([1, 2, 3])
  })
})

describe('utils/common/string — strToBool.arrayString', () => {
  it('returns the first nested array as a string array', () => {
    expect(strToBool.arrayString([['1', 2, '3']])).toEqual(['1', '3'])
  })
  it('returns an empty array when no nested array is found', () => {
    expect(strToBool.arrayString(['1', '2', '3'])).toEqual([])
  })
})

describe('utils/common/string — strToBool.mergeArray', () => {
  it('merges multiple arrays and removes duplicates', () => {
    expect(strToBool.mergeArray<string>(['1', '2', '3'], ['3', '4'])).toEqual(['1', '2', '3', '4'])
  })
  it('ignores non-array arguments', () => {
    expect(strToBool.mergeArray<number>([1, 2], 'not-array', [2, 3])).toEqual([1, 2, 3])
  })
})
