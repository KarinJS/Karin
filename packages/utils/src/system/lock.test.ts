import { describe, it, expect } from 'vitest'
import { lockMethod, lockProp, lock } from './lock'

describe('system/lock', () => {
  it('lockMethod throws and unlock restores', () => {
    const obj = {
      greet () { return 'hi' },
    }
    expect(obj.greet()).toBe('hi')
    const unlock = lockMethod(obj, 'greet', 'locked')
    expect(() => obj.greet()).toThrow('locked')
    const res = unlock()
    expect(res.status).toBe(true)
    expect(obj.greet()).toBe('hi')
  })

  it('lockProp makes property non-writable', () => {
    const obj: any = { x: 1 }
    lockProp(obj, 'x')
    try { obj.x = 2 } catch {}
    expect(obj.x).toBe(1)
  })

  it('lock facade works', () => {
    const o: any = { val: 1, inc () { return this.val } }
    lock.prop(o, 'val')
    try { o.val = 99 } catch {}
    expect(o.val).toBe(1)
    const u = lock.method(o, 'inc')
    expect(() => o.inc()).toThrow()
    u()
    expect(o.inc()).toBe(1)
  })
})