import os from 'node:os'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { exec } from './exec'
import { detectPnpm, getPnpmNodeWarning } from './pnpm'
import type { PnpmInfo } from './pnpm'

vi.mock('./exec', () => ({ exec: vi.fn() }))

const mockExec = (result: { stdout?: string, stderr?: string, error?: Error | null }) => {
  vi.mocked(exec).mockResolvedValue({
    status: !result.error,
    error: result.error ?? null,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  })
}

describe('detectPnpm', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('在系统临时目录获取版本号 避免当前目录损坏的 pnpm-workspace.yaml 影响检测', async () => {
    mockExec({ stdout: '12.9.1\n' })

    const info = await detectPnpm()

    expect(info).toEqual({ version: '12.9.1', parsed: { major: 12, minor: 9, patch: 1 }, requiredNode: '' })
    expect(exec).toHaveBeenCalledWith('pnpm --version', { cwd: os.tmpdir() })
  })

  it('pnpm 11 在低版本 Node.js 下无法启动时 识别出所需的 Node.js 版本', async () => {
    mockExec({
      error: new Error('Command failed: pnpm --version'),
      stderr: [
        'ERROR: This version of pnpm requires at least Node.js v22.13',
        'The current version of Node.js is v18.20.0',
        'Visit https://r.pnpm.io/comp to see the list of past pnpm versions with respective Node.js version support.',
      ].join('\n'),
    })

    expect(await detectPnpm()).toEqual({ version: '', parsed: null, requiredNode: '22.13' })
  })

  it('未安装时版本号为空', async () => {
    mockExec({ error: new Error('not found'), stderr: "'pnpm' 不是内部或外部命令，也不是可运行的程序" })
    expect(await detectPnpm()).toEqual({ version: '', parsed: null, requiredNode: '' })
  })
})

describe('getPnpmNodeWarning', () => {
  const info = (version: string): PnpmInfo => {
    const [major, minor, patch] = version.split('.').map(Number)
    return { version, parsed: { major, minor, patch }, requiredNode: '' }
  }

  it('pnpm 无法启动时提示所需的 Node.js 版本', () => {
    const warning = getPnpmNodeWarning({ version: '', parsed: null, requiredNode: '22.13' }, '18.20.0')
    expect(warning).toContain('Node.js >= 22.13')
    expect(warning).toContain('v18.20.0')
  })

  it('pnpm 11 搭配 Node.js < 22.13 时提示', () => {
    expect(getPnpmNodeWarning(info('11.28.2'), '20.11.0')).toContain('Node.js >= 22.13')
    expect(getPnpmNodeWarning(info('11.28.2'), '22.12.0')).toContain('Node.js >= 22.13')
    expect(getPnpmNodeWarning(info('11.28.2'), '22.13.0')).toBe('')
  })

  it('pnpm 12 为原生二进制 不受 Node.js 版本限制', () => {
    expect(getPnpmNodeWarning(info('12.9.1'), '20.11.0')).toBe('')
  })

  it('pnpm 9 不提示', () => {
    expect(getPnpmNodeWarning(info('9.15.9'), '18.20.0')).toBe('')
  })
})
