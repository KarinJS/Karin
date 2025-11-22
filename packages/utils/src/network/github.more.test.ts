import { describe, it, expect } from 'vitest'
import { getFastGithub } from './github'

describe('network/github clone builders', () => {
  it('clone builder formats for cdn proxy', async () => {
    const cfg = await getFastGithub('clone')
    const urls = [
      'https://github.com/owner/repo',
      'https://github.com/owner/repo/extra',
    ]
    for (const u of urls) {
      const c = cfg.clone(u)
      expect(typeof c).toBe('string')
    }
  })
})
