import { describe, it, expect } from 'vitest'
import { lockMethod, lockProp } from './lock'

describe('system/lock errors', () => {
  it('lockMethod throws when property is not function', () => {
    const obj: any = { x: 1 }
    expect(() => lockMethod(obj, 'x')).toThrow()
  })

  it('lockProp throws when property missing', () => {
    const obj: any = { }
    expect(() => lockProp(obj, 'x' as any)).toThrow()
  })
})
