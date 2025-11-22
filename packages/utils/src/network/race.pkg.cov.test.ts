import { describe, it, expect, vi } from 'vitest'
import * as mod from './race'

vi.mock('axios', () => ({
  default: {
    request: vi.fn(async () => { throw new Error('net down') }),
  },
}))

describe('network/race getPackageJson catch coverage', () => {
  it('returns default version when axios rejects all', async () => {
    const pkg = await mod.getPackageJson('owner', 'repo')
    expect(pkg.version).toBe('0.0.0')
  })
})