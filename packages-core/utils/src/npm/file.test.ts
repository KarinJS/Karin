import { describe, it, expect, vi } from 'vitest'
import { getNpmPackages, getNpmPackagesSync } from './file'

vi.mock('../path', () => ({
  getDirs: vi.fn(async (p: string) => {
    if (p.endsWith('node_modules')) return ['express', '@types', '@scope']
    if (p.endsWith('@scope')) return ['pkg1']
    if (p.endsWith('@types')) return ['node']
    return []
  }),
  getDirsSync: vi.fn((p: string) => {
    if (p.endsWith('node_modules')) return ['express', '@types', '@scope']
    if (p.endsWith('@scope')) return ['pkg1']
    if (p.endsWith('@types')) return ['node']
    return []
  }),
}))

describe('npm/file', () => {
  it('getNpmPackages returns names and fields', async () => {
    const names = await getNpmPackages()
    expect(names).toContain('express')
    const abs = await getNpmPackages({ fields: 'abs' })
    expect(abs.every(s => typeof s === 'string')).toBe(true)
    const rel = await getNpmPackages({ fields: ['name', 'rel'] })
    expect(rel[0].name).toBeTruthy()
  })

  it('getNpmPackagesSync works and ignores patterns', () => {
    const names = getNpmPackagesSync()
    expect(names).toContain('express')
    const filtered = getNpmPackagesSync({ ignore: [/^@types\//] })
    expect(filtered).not.toContain('@types/node')
  })
})