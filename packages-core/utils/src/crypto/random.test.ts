import { describe, it, expect } from 'vitest'
import { randomString, randomHex, randomUUID, generateSecret } from './random'

describe('crypto/random', () => {
  it('randomString respects options and length', () => {
    const s1 = randomString()
    expect(s1).toHaveLength(16)
    const s2 = randomString({ length: 32, onlyLetters: true })
    expect(s2).toHaveLength(32)
    expect(/^[A-Za-z]+$/.test(s2)).toBe(true)
    const s3 = randomString({ length: 20, includeSymbols: true })
    expect(s3).toHaveLength(20)
    const s4 = randomString({ length: 10, onlyLetters: true, onlyLowercase: true })
    expect(/^[a-z]+$/.test(s4)).toBe(true)
    const s5 = randomString({ length: 10, onlyLetters: true, onlyUppercase: true })
    expect(/^[A-Z]+$/.test(s5)).toBe(true)
    const s6 = randomString({ length: 16, excludeSimilar: true })
    expect(/[O0Il1]/.test(s6)).toBe(false)
    const s7 = randomString({ length: 12, onlyLowercase: true, includeNumbers: false })
    expect(/^[a-z]+$/.test(s7)).toBe(true)
    const s8 = randomString({ length: 12, onlyUppercase: true, includeNumbers: false })
    expect(/^[A-Z]+$/.test(s8)).toBe(true)
  })

  it('randomHex returns hex string of given length', () => {
    const h = randomHex(16)
    expect(h).toHaveLength(16)
    expect(/^[0-9a-f]+$/.test(h)).toBe(true)
  })

  it('randomUUID returns valid v4 uuid', () => {
    const u = randomUUID()
    expect(u).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  })

  it('generateSecret returns requested length', () => {
    const k = generateSecret(24)
    expect(k).toHaveLength(24)
  })
})
