import { describe, it, expect, vi } from 'vitest'
import { raceRequest } from './race'

vi.mock('axios', () => ({
  default: {
    request: vi.fn(async (config: any) => ({ status: 200, config })),
  },
}))

describe('network/race raceRequest', () => {
  it('returns null when successCodes do not match', async () => {
    const res = await raceRequest(['http://a', 'http://b'], { method: 'GET', timeout: 50, successCodes: [201] })
    expect(res).toBeNull()
  })
})
