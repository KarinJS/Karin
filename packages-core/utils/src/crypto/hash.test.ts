import { describe, it, expect } from 'vitest'
import { createHash, md5, sha256 } from './hash'

describe('crypto/hash', () => {
  it('createHash supports algorithms and encodings', () => {
    const h1 = createHash('hello world')
    expect(h1).toBe('5eb63bbbe01eeed093cb22bb8f5acdc3')
    const h2 = createHash('hello world', { algorithm: 'sha256' })
    expect(h2).toHaveLength(64)
    const h3 = createHash('hello world', { encoding: 'base64' })
    expect(typeof h3).toBe('string')
  })

  it('md5 returns expected hash', () => {
    expect(md5('hello world')).toBe('5eb63bbbe01eeed093cb22bb8f5acdc3')
  })

  it('sha256 returns hex or base64', () => {
    const h = sha256('hello world')
    expect(h).toHaveLength(64)
    const b = sha256('hello world', 'base64')
    expect(typeof b).toBe('string')
  })
})
