import { describe, it, expect, vi } from 'vitest'
import * as mod from './race'

describe('network/race getFastRegistry catch logs', () => {
  it('returns fallback on rejection', async () => {
    const spyReq = vi.spyOn(mod, 'raceRequest')
    spyReq.mockRejectedValueOnce(new Error('fail'))
    const fast = await mod.getFastRegistry()
    expect(typeof fast).toBe('string')
    spyReq.mockRestore()
  })
})
