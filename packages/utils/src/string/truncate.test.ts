import { describe, it, expect } from 'vitest'
import { truncate, isObject } from './truncate'

describe('string/truncate', () => {
  it('returns original when within length', () => {
    expect(truncate('hello', { length: 10 })).toBe('hello')
  })

  it('works with default options', () => {
    expect(truncate('hello')).toBe('hello')
  })

  it('returns omission if length smaller than omission', () => {
    expect(truncate('abcdef', { length: 1, omission: '...' })).toBe('...')
  })

  it('truncates with default omission', () => {
    expect(truncate('abcdefghij', { length: 5 })).toBe('abcd…')
  })

  it('truncates using string separator', () => {
    const s = 'alpha-beta-gamma-delta'
    expect(truncate(s, { length: 12, omission: '...', separator: '-' })).toBe('alpha...')
  })

  it('truncates using regex separator', () => {
    const s = 'abc123def456'
    expect(truncate(s, { length: 8, omission: '...', separator: /\d+/ })).toBe('abc...')
  })

  it('handles undefined input and missing separator', () => {
    expect(truncate(undefined as unknown as string, { length: 5 })).toBe('')
    const s = 'abcdefg'
    expect(truncate(s, { length: 5, omission: '...', separator: ',' })).toBe('ab...')
  })

  it('regex separator not matching end keeps original truncation', () => {
    const s = 'abcdefgh'
    expect(truncate(s, { length: 6, omission: '...', separator: /xyz/ })).toBe('abc...')
  })

  it('isObject type guard', () => {
    expect(isObject({})).toBe(true)
    expect(isObject(() => {})).toBe(true)
    expect(isObject(null)).toBe(false)
    expect(isObject(123)).toBe(false)
    expect(isObject('str')).toBe(false)
  })
})
