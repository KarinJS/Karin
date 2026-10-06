import { exec } from 'node:child_process'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isWorkspace } from '@/env'
import { updateNpmPackage, updateNpmPackages } from './upgrade'

vi.mock('@/env', () => ({ isWorkspace: vi.fn() }))
vi.mock('node:child_process', () => ({ exec: vi.fn() }))

/** 获取执行的命令 */
const commands = () => vi.mocked(exec).mock.calls.map(call => call[0])

describe('upgrade', () => {
  beforeEach(() => {
    vi.mocked(exec).mockImplementation(((_cmd: string, _options: unknown, callback: (...args: unknown[]) => void) => {
      callback(null, '', '')
      return { stdin: { write: vi.fn() } }
    }) as unknown as typeof exec)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('updateNpmPackage: 工作区根目录追加 -w', async () => {
    vi.mocked(isWorkspace).mockReturnValue(true)
    const result = await updateNpmPackage('karin-plugin-foo')
    expect(result.status).toBe(true)
    expect(commands()).toEqual(['pnpm add karin-plugin-foo@latest -w'])
  })

  it('updateNpmPackage: 非工作区不追加 -w', async () => {
    vi.mocked(isWorkspace).mockReturnValue(false)
    await updateNpmPackage('karin-plugin-foo', { tag: 'beta', registry: 'https://registry.npmmirror.com' })
    expect(commands()).toEqual(['pnpm add karin-plugin-foo@beta --registry=https://registry.npmmirror.com'])
  })

  it('updateNpmPackages: 工作区根目录追加 -w', async () => {
    vi.mocked(isWorkspace).mockReturnValue(true)
    await updateNpmPackages(['a', 'b'])
    expect(commands()).toEqual(['pnpm add a@latest b@latest -w'])
  })

  it('updateNpmPackages: 未指定包时执行 pnpm up', async () => {
    vi.mocked(isWorkspace).mockReturnValue(true)
    await updateNpmPackages([])
    expect(commands()).toEqual(['pnpm up'])
  })
})
