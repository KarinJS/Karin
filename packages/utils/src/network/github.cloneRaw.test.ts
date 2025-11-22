import { describe, it, expect, vi } from 'vitest'
vi.mock('./race', () => ({
  pingRequest: vi.fn(),
}))

describe('network/github clone methods on raw-only configs', () => {
  it('clone method of jsd.cdn.zzko.cn/gh formats owner/repo', async () => {
    const rawUrl = 'https://jsd.cdn.zzko.cn/gh/github/docs/refs/heads/main/README.md'
    const race = await import('./race') as any
    race.pingRequest.mockResolvedValueOnce({ url: rawUrl, success: true, duration: 1, error: null })
    const gh = await import('./github')
    const cfg = await gh.getFastGithub('raw')
    const u = cfg.clone('https://github.com/owner/repo/path')
    expect(u).toContain('/owner/repo')
  })

  it('clone method of jsd.onmicrosoft.cn/gh formats owner/repo', async () => {
    const rawUrl = 'https://jsd.onmicrosoft.cn/gh/github/docs/refs/heads/main/README.md'
    const race = await import('./race') as any
    race.pingRequest.mockResolvedValueOnce({ url: rawUrl, success: true, duration: 1, error: null })
    const gh = await import('./github')
    const cfg = await gh.getFastGithub('raw')
    const u = cfg.clone('https://github.com/owner/repo/another')
    expect(u).toContain('/owner/repo')
  })
})