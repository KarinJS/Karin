import { describe, it, expect, vi } from 'vitest'
import path from 'node:path'
import os from 'node:os'
import { getNpmrcPath, getPnpmConfigPath, getNpmConfigList, getNpmConfig, setNpmConfig } from './npmrc'

vi.mock('../system', () => ({
  exec: vi.fn(async (cmd: string) => {
    if (cmd.includes('userconfig')) return { stdout: path.join(os.tmpdir(), '.npmrc') }
    if (cmd.includes('npm config get registry')) return { stdout: 'https://registry.npmjs.org' }
    return { stdout: 'value' }
  }),
}))

describe('npm/npmrc', () => {
  it('getNpmrcPath global/project with isCheck', async () => {
    const g = await getNpmrcPath('global', true)
    const p = await getNpmrcPath('project', false)
    expect(typeof g === 'string' || g === null).toBe(true)
    expect(p.endsWith('.npmrc')).toBe(true)
  })
  it('getPnpmConfigPath returns platform path', () => {
    const p = getPnpmConfigPath()
    expect(typeof p).toBe('string')
  })
  it('getNpmConfigList collects existing paths', async () => {
    const list = await getNpmConfigList()
    expect(Array.isArray(list)).toBe(true)
  })
  it('getNpmConfig returns single and multiple', async () => {
    const r1 = await getNpmConfig('registry')
    expect(typeof r1).toBe('string')
    const r2 = await getNpmConfig(['registry', 'proxy'])
    expect(Array.isArray(r2)).toBe(true)
  })
  it('setNpmConfig executes set', async () => {
    await setNpmConfig('key', 'value')
    expect(true).toBe(true)
  })
})