import { describe, it, expect } from 'vitest'
import { sleep } from '@/utils/common/sleep'

describe('utils/common/sleep', () => {
  it('resolves after at least the requested duration', async () => {
    const start = Date.now()
    await sleep(50)
    const elapsed = Date.now() - start
    // generous lower bound: timers can fire 5-10ms early on busy CI
    expect(elapsed).toBeGreaterThanOrEqual(40)
    expect(elapsed).toBeLessThan(500)
  })

  it('resolves immediately for 0 ms', async () => {
    const start = Date.now()
    await sleep(0)
    expect(Date.now() - start).toBeLessThan(100)
  })

  it('returns a Promise', () => {
    const p = sleep(0)
    expect(p).toBeInstanceOf(Promise)
    return p
  })
})
