import { describe, it, expect, vi } from 'vitest'
import * as mod from './race'

vi.mock('axios', () => ({
  default: {
    request: vi.fn(async () => { throw new Error('net down') }),
  },
}))

describe('network/race getFastRegistry catch coverage', () => {
  it('returns fallback when axios rejects all', async () => {
    const url = await mod.getFastRegistry()
    expect(typeof url).toBe('string')
  })
})