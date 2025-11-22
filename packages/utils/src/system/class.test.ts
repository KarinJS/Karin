import { describe, it, expect } from 'vitest'
import { isClass } from './class'

describe('system/class', () => {
  it('detects class', () => {
    class A {}
    expect(isClass(A)).toBe(true)
    const fn = function () {}
    expect(isClass(fn)).toBe(false)
  })
})