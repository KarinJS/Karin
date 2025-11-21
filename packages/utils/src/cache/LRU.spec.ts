import { describe, it, expect, vi } from 'vitest'
import { LRUCache } from './LRU'

describe('cache/LRU', () => {
  it('set/get/peek/has with ttl', async () => {
    const lru = new LRUCache<string, number>(10)
    // ttl=0 never expire
    lru.set('k0', 0, 0)
    expect(lru.get('k0')).toBe(0)
    expect(lru.has('k0')).toBe(true)

    // small ttl expires
    const spy = vi.spyOn(Date, 'now')
    spy.mockReturnValue(1000)
    lru.set('k1', 1, 10)
    expect(lru.peek('k1')).toBe(1)
    // advance time
    spy.mockReturnValue(1012)
    expect(lru.get('k1')).toBeUndefined()
    expect(lru.has('k1')).toBe(false)
    spy.mockRestore()
  })

  it('capacity eviction and LRU order update on get', async () => {
    const lru = new LRUCache<string, string>(2)
    lru.set('a', 'A', 0)
    lru.set('b', 'B', 0)
    // touch 'a' moves it to recent via microtask
    const val = lru.get('a')
    expect(val).toBe('A')
    await Promise.resolve()
    // add 'c' should evict oldest 'b'
    lru.set('c', 'C', 0)
    const a = lru.get('a')
    const b = lru.get('b')
    const c = lru.get('c')
    expect(c).toBe('C')
    expect([a, b]).toContain(undefined)
    expect([a, b]).toContain('A')
  })

  it('delete/clear/size/keys/values/entries/forEach/toJSON/toString', () => {
    const lru = new LRUCache<number, string>(5)
    lru.set(1, 'one', 0)
    lru.set(2, 'two', 0)
    lru.set(3, 'three', 0)
    expect(lru.size()).toBe(3)
    expect(lru.keys().sort()).toEqual([1,2,3])
    expect(lru.values().sort()).toEqual(['one','three','two'].sort())
    expect(lru.entries().length).toBe(3)
    const collected: Array<[number,string]> = []
    lru.forEach((v, k) => collected.push([k, v]))
    expect(collected.length).toBe(3)
    const json = lru.toJSON()
    expect(json['1']).toBe('one')
    const str = lru.toString()
    expect(str).toContain('one')
    expect(lru.delete(2)).toBe(true)
    expect(lru.size()).toBe(2)
    lru.clear()
    expect(lru.size()).toBe(0)
  })
})
