import { describe, it, expect, vi } from 'vitest'
import axios from 'axios'
import { raceRequest, pingRequest, getFastRegistry, getPackageJson } from './race'

vi.mock('axios', () => ({
  default: {
    request: vi.fn(async (config: any) => {
      if (config.url.includes('fast')) return { status: 200, config, data: { ok: true } }
      if (config.url.includes('slow')) {
        await new Promise(r => setTimeout(r, 10))
        return { status: 200, config, data: { ok: true } }
      }
      return { status: 200, config, data: { version: '1.2.3' } }
    }),
    get: vi.fn(async () => ({ data: { version: '1.2.3' } })),
  },
}))

describe('network/race', () => {
  it('raceRequest returns first success', async () => {
    const res = await raceRequest(['http://slow', 'http://fast'], { method: 'GET', timeout: 100, successCodes: [200] })
    expect(res?.config.url).toBe('http://fast')
  })

  it('pingRequest standard and detailed', async () => {
    const res = await pingRequest(['http://fast', 'http://slow'])
    expect(res).toEqual(['http://fast', 'http://slow'])
    const det = await pingRequest(['http://fast', 'http://slow'], { detailed: true }) as any
    expect(det[0].success).toBe(true)
  })

  it('pingRequest race mode returns single', async () => {
    const r = await pingRequest(['http://slow', 'http://fast'], { isRace: true })
    expect(r).toBe('http://fast')
  })

  it('getFastRegistry and getPackageJson', async () => {
    const reg = await getFastRegistry()
    expect(typeof reg).toBe('string')
    const pkg = await getPackageJson('owner', 'repo')
    expect(pkg.version).toBe('1.2.3')
  })
})
