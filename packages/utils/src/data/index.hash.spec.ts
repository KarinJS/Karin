import { describe, it, expect } from 'vitest'
import { secureRandomStr } from './index'

describe('data/index hash variants', () => {
  it('secureRandomStr with base64url and entropyFromTime returns raw+hash', () => {
    const res = secureRandomStr({ length: 12, hash: 'sha256', hashFormat: 'base64url', returnRawAndHash: true, entropyFromTime: true, salt: 's' }) as any
    expect(typeof res.raw).toBe('string')
    expect(typeof res.hash).toBe('string')
    expect(/^[A-Za-z0-9_-]+$/.test(res.hash)).toBe(true)
  })
})
