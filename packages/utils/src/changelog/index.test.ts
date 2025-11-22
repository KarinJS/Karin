import { describe, it, expect } from 'vitest'
import { log, logs, range, parseChangelog } from './index'

const data = `
# Changelog

## [2.0.0]
### Added
- Feature A

## [1.1.0]
### Fixed
- Bug X

## [1.0.0]
### Init
- First release
`

describe('changelog/index', () => {
  it('log extracts single version section', () => {
    const s = log('1.1.0', data)!
    expect(s).toContain('## [1.1.0]')
    expect(s).toContain('Bug X')
  })

  it('logs extracts range by length and direction', () => {
    const forward = logs('1.1.0', data, 2)
    expect(forward).toContain('## [1.1.0]')
    expect(forward).toContain('## [1.0.0]')
    const reverse = logs('1.1.0', data, 1, true)
    expect(reverse).toContain('## [2.0.0]')
  })

  it('range extracts between versions regardless of order', () => {
    const r1 = range(data, '1.0.0', '2.0.0')
    expect(r1).toContain('## [2.0.0]')
    expect(r1).toContain('## [1.1.0]')
    const r2 = range(data, '2.0.0', '1.0.0')
    expect(r2).toContain('## [1.1.0]')
  })

  it('parseChangelog returns map of versions to content', () => {
    const m = parseChangelog(data)
    expect(m['2.0.0']).toContain('Feature A')
    expect(Object.keys(m)).toEqual(['2.0.0', '1.1.0', '1.0.0'])
  })

  it('logs throws when length is not number', () => {
    // @ts-expect-error
    expect(() => logs('1.0.0', data, 'x')).toThrow()
  })
})