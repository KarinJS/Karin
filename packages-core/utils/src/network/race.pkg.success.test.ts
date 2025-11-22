import { describe, it, expect, vi } from 'vitest'
import * as mod from './race'

vi.mock('axios', () => ({
  default: {
    request: vi.fn(async () => ({ status: 200, data: { version: '9.9.9' } })),
  },
}))

describe('network/race getPackageJson success', () => {
  it('returns data on success', async () => {
    const pkg = await mod.getPackageJson('owner', 'repo')
    expect(pkg.version).toBe('9.9.9')
  })
})
