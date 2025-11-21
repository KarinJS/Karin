import { describe, it, expect } from 'vitest'
import { createStdinController } from './index'

describe('stdin/index', () => {
  it('remove and resume stdin listeners', () => {
    const handler = () => {}
    process.stdin.on('data', handler)
    const before = process.stdin.listeners('data').includes(handler)
    expect(before).toBe(true)
    const ctl = createStdinController()
    ctl.remove()
    const removed = process.stdin.listeners('data').includes(handler)
    expect(removed).toBe(false)
    ctl.resume()
    const resumed = process.stdin.listeners('data').includes(handler)
    expect(resumed).toBe(true)
    process.stdin.removeListener('data', handler)
  })
})
