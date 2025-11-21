import { describe, it, expect, vi } from 'vitest'
import { buildGithub, getFastGithub, parseGithubUrl } from './github'

vi.mock('./race', () => ({
  pingRequest: vi.fn(async (urls: string[], opts: any) => {
    if (opts?.isRace) return { url: urls[0] }
    return { url: urls[urls.length - 1] }
  }),
}))

describe('network/github extra', () => {
  it('buildGithub clone/raw methods', () => {
    const cfg = buildGithub('https://proxy')
    expect(cfg.clone('https://github.com/owner/repo')).toContain('https://proxy/')
    expect(cfg.raw('https://github.com/owner/repo/path')).toContain('https://proxy/')
  })

  it('getFastGithub returns fallback when ping returns null', async () => {
    const mod = await import('./race')
    // @ts-expect-error
    mod.pingRequest.mockResolvedValueOnce(null)
    const fast = await getFastGithub('raw')
    expect(typeof fast.proxy).toBe('string')
  })

  it('getFastGithub clone mode returns clone-capable config', async () => {
    const fast = await getFastGithub('clone')
    const u = fast.clone('https://github.com/owner/repo')
    expect(typeof u).toBe('string')
  })

  it('parseGithubUrl parses owner/repo/path', () => {
    const p = parseGithubUrl('https://github.com/a/b/c/d')
    expect(p).toEqual({ owner: 'a', repo: 'b', path: 'c/d' })
  })
})
