import { describe, it, expect, vi } from 'vitest'
import * as mod from './race'
vi.mock('axios', () => ({
  default: {
    request: vi.fn(async () => ({ status: 200, data: { version: '1.2.3' } })),
  },
}))

describe('network/race getPackageJson success (restore)', () => {
  it('returns data when axios succeeds', async () => {
    const pkg = await mod.getPackageJson('owner', 'repo')
    expect(pkg.version).toBe('1.2.3')
  })
})
