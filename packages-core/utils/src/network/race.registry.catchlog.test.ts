import { describe, it, expect, vi } from 'vitest'
import * as mod from './race'

describe('network/race getFastRegistry catch logs', () => {
  it('returns fallback url on rejection', async () => {
    const spyReq = vi.spyOn(mod, 'raceRequest')
    spyReq.mockImplementationOnce(async () => { throw new Error('fail') })
    const url = await mod.getFastRegistry()
    expect(typeof url).toBe('string')
    spyReq.mockRestore()
  })
})