import { describe, it, expect } from 'vitest'
import { satisfies } from '@/utils/system/range'

describe('utils/system/range — satisfies (basic operators)', () => {
  it('matches caret upper bounds', () => {
    expect(satisfies('^1.0.0', '1.0.1')).toBe(true)
    expect(satisfies('^1.0.0', '1.9.9')).toBe(true)
    expect(satisfies('^1.0.0', '2.0.0')).toBe(false)
    expect(satisfies('^1.0.0', '0.0.1')).toBe(false)
  })

  it('handles 0.x caret semantics (^0.y.z → >=0.y.z <0.(y+1).0)', () => {
    expect(satisfies('^0.1.0', '0.1.5')).toBe(true)
    expect(satisfies('^0.1.0', '0.2.0')).toBe(false)
  })

  it('respects gte/lte/gt/lt', () => {
    expect(satisfies('>=1.0.0', '1.0.0')).toBe(true)
    expect(satisfies('>=1.0.0', '0.0.1')).toBe(false)
    expect(satisfies('<=1.0.0', '1.0.0')).toBe(true)
    expect(satisfies('<=1.0.0', '2.0.0')).toBe(false)
    expect(satisfies('>1.0.0', '1.0.1')).toBe(true)
    expect(satisfies('>1.0.0', '1.0.0')).toBe(false)
    expect(satisfies('<1.0.0', '0.9.9')).toBe(true)
    expect(satisfies('<1.0.0', '1.0.0')).toBe(false)
  })

  it('composes whitespace-separated conditions with AND semantics', () => {
    expect(satisfies('>=1.0.0 <2.0.0', '1.0.0')).toBe(true)
    expect(satisfies('>=1.0.0 <2.0.0', '2.0.0')).toBe(false)
  })
})

describe('utils/system/range — satisfies (prereleases)', () => {
  it('treats no-prerelease as greater than prerelease', () => {
    expect(satisfies('1.0.0-alpha', '1.0.0-beta')).toBe(false)
    expect(satisfies('1.0.0-beta', '1.0.0-alpha')).toBe(false)
  })

  it('orders alpha < beta < rc', () => {
    expect(satisfies('^1.0.0-alpha', '1.0.0-beta')).toBe(true)
    expect(satisfies('^1.0.0-beta', '1.0.0-alpha')).toBe(false)
  })

  it('matches identical prerelease', () => {
    expect(satisfies('^1.0.0-beta', '1.0.0-beta')).toBe(true)
    expect(satisfies('^1.0.0-alpha', '1.0.0-alpha')).toBe(true)
  })

  it('refuses prerelease-vs-release mix when the range demands prerelease', () => {
    expect(satisfies('>=1.0.0-beta', '1.0.0-alpha')).toBe(false)
  })
})

describe('utils/system/range — satisfies (wildcards)', () => {
  it('matches patch wildcards', () => {
    expect(satisfies('1.0.x', '1.0.1')).toBe(true)
    expect(satisfies('1.0.x', '1.1.0')).toBe(false)
  })
  it('matches minor wildcards', () => {
    expect(satisfies('1.x.x', '1.2.3')).toBe(true)
  })
  it('matches single-position wildcards even at minor', () => {
    expect(satisfies('1.x.0', '1.2.0')).toBe(true)
    expect(satisfies('1.x.0', '1.2.1')).toBe(false)
  })
})
