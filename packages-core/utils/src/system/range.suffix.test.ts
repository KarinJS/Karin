import { describe, it, expect } from 'vitest'
import { satisfies } from './range'

describe('system/range prerelease numeric suffix', () => {
  it('alpha.2 greater than alpha.1', () => {
    expect(satisfies('1.0.0-alpha.2', '1.0.0-alpha.1')).toBe(false)
    expect(satisfies('1.0.0-alpha.1', '1.0.0-alpha.2')).toBe(false)
    expect(satisfies('1.0.0-alpha.1', '1.0.0-alpha.1')).toBe(true)
  })
})
