import { describe, it, expect } from 'vitest'
import { satisfies } from './range'

describe('system/range more branches', () => {
  it('wildcard with operator returns false', () => {
    expect(satisfies('>1.x.0', '1.2.0')).toBe(false)
    expect(satisfies('<*.*.*', '0.0.0')).toBe(false)
  })
  it('pattern has prerelease but version none returns false', () => {
    expect(satisfies('1.0.0-alpha', '1.0.0')).toBe(false)
  })
  it('caret upperBound computed for major 0 and >0', () => {
    expect(satisfies('^0.1.0', '0.1.9')).toBe(true)
    expect(satisfies('^0.1.0', '0.2.0')).toBe(false)
    expect(satisfies('^1.2.3', '1.9.9')).toBe(true)
    expect(satisfies('^1.2.3', '2.0.0')).toBe(false)
  })
  it('version has prerelease but pattern none returns false', () => {
    expect(satisfies('1.0.0', '1.0.0-alpha')).toBe(false)
  })
  it('matchesPattern minor mismatch returns false', () => {
    expect(satisfies('1.0.x', '1.1.0')).toBe(false)
  })
  it('matchesPattern fixed patch must match', () => {
    expect(satisfies('1.x.1', '1.0.2')).toBe(false)
    expect(satisfies('1.x.1', '1.0.1')).toBe(true)
  })
  it('wildcard with prerelease matches only same prerelease', () => {
    expect(satisfies('1.0.x-alpha', '1.0.0-alpha')).toBe(true)
    expect(satisfies('1.0.x-alpha', '1.0.0-beta')).toBe(true)
    expect(satisfies('1.0.x-alpha', '1.0.0')).toBe(false)
  })
})