import { describe, it, expect, vi } from 'vitest'
import * as github from './github'

vi.mock('./race', () => ({
  pingRequest: vi.fn(async (urls: string[], opts: any) => {
    return { url: urls[0] }
  }),
}))

describe('network/github', () => {
  it('buildGithub and parseGithubUrl', () => {
    const cfg = github.buildGithub('https://proxy')
    expect(cfg.raw('https://github.com/a/b/c')).toContain('https://proxy/')
    const p = github.parseGithubUrl('https://github.com/owner/repo/path/to/file')
    expect(p).toEqual({ owner: 'owner', repo: 'repo', path: 'path/to/file' })
  })

  it('getFastGithub returns config', async () => {
    const cfg = await github.getFastGithub('raw')
    expect(typeof cfg.proxy).toBe('string')
  })
})
