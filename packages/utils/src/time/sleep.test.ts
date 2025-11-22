import { describe, it, expect, vi } from 'vitest'
import { sleep } from './sleep'

describe('time/sleep', () => {
  it('sleep resolves after timeout', async () => {
    vi.useFakeTimers()
    const p = sleep(1000)
    vi.advanceTimersByTime(1000)
    await expect(p).resolves.toBeUndefined()
    vi.useRealTimers()
  })
})
