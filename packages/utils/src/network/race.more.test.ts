import { describe, it, expect, vi } from 'vitest'
import { pingRequest } from './race'

vi.mock('axios', () => ({
  default: {
    request: vi.fn(async (config: any) => {
      if (config.url.includes('bad')) return { status: 500, config }
      return { status: 200, config }
    }),
  },
}))

describe('network/race more', () => {
  it('pingRequest detailed and successCodes non-hit', async () => {
    const det = await pingRequest(['http://bad'], { detailed: true, successCodes: [200] }) as any
    expect(det[0].success).toBe(false)
    const urls = await pingRequest(['http://bad'], { successCodes: [201] }) as any
    expect(urls).toEqual([])
  })

  it('pingRequest race mode all fail returns null', async () => {
    const res = await pingRequest(['http://bad', 'http://bad2'], { isRace: true, successCodes: [201] }) as any
    expect(res).toBeNull()
  })
})
