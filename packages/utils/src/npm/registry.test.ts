import { describe, it, expect, vi } from 'vitest'
import * as reg from './registry'

vi.mock('../system', () => ({
  exec: vi.fn(async () => ({ stdout: 'https://registry.npmjs.org', stderr: '', error: null, status: true })),
}))

vi.mock('axios', () => ({
  default: {
    get: vi.fn(async (url: string) => ({ data: { 'dist-tags': { latest: '1.0.0' } } })),
  },
}))

describe('npm/registry', () => {
  it('getRegistry uses env or exec', async () => {
    delete process.env.npm_config_registry
    const r = await reg.getRegistry()
    expect(r).toBe('https://registry.npmjs.org')
    process.env.npm_config_registry = 'https://mirror'
    const r2 = await reg.getRegistry()
    expect(r2).toBe('https://mirror')
  })

  it('getNpmRegistry and getNpmLatestVersion', async () => {
    const data = await reg.getNpmRegistry('vite')
    expect(typeof data).toBe('object')
    const latest = await reg.getNpmLatestVersion('vite')
    expect(latest).toBe('1.0.0')
  })
})