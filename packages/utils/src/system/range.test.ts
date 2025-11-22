import { describe, it, expect } from 'vitest'
import { satisfies } from './range'

describe('system/range satisfies', () => {
  it('basic comparisons', () => {
    expect(satisfies('>1.0.0', '1.0.1')).toBe(true)
    expect(satisfies('>=1.0.0', '1.0.0')).toBe(true)
    expect(satisfies('<1.0.0', '0.9.9')).toBe(true)
    expect(satisfies('<=1.0.0', '1.0.0')).toBe(true)
    expect(satisfies('1.0.0', '1.0.0')).toBe(true)
  })
  it('caret ranges', () => {
    expect(satisfies('^1.0.0', '1.2.3')).toBe(true)
    expect(satisfies('^1.0.0', '2.0.0')).toBe(false)
    expect(satisfies('^0.1.0', '0.1.9')).toBe(true)
    expect(satisfies('^0.1.0', '0.2.0')).toBe(false)
  })
  it('prerelease comparisons', () => {
    expect(satisfies('1.0.0-alpha', '1.0.0-alpha')).toBe(true)
    expect(satisfies('1.0.0-beta', '1.0.0-alpha')).toBe(false)
    expect(satisfies('1.0.0-alpha', '1.0.0-beta')).toBe(false)
    expect(satisfies('1.0.0-rc', '1.0.0-beta')).toBe(false)
  })
  it('wildcards', () => {
    expect(satisfies('1.0.x', '1.0.1')).toBe(true)
    expect(satisfies('1.x.0', '1.2.0')).toBe(true)
    expect(satisfies('1.x.0', '2.0.0')).toBe(false)
    expect(satisfies('1.*.*', '1.2.3')).toBe(true)
  })
  it('compound conditions', () => {
    expect(satisfies('>=1.0.0 <2.0.0', '1.5.0')).toBe(true)
    expect(satisfies('>=1.0.0 <2.0.0', '2.0.0')).toBe(false)
  })
})