import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { exec } from './utils/exec'
import { detectPnpm } from './utils/pnpm'
import { createProject, fixProject } from './project'
import { parseVersion, readYamlFile } from '../../cli-Internal/src/workspace'
import type { WorkspaceData } from '../../cli-Internal/src/workspace'

const spinner = vi.hoisted(() => {
  const instance: Record<string, any> = {}
  for (const key of ['start', 'succeed', 'fail', 'info', 'stop']) {
    instance[key] = (..._: unknown[]) => instance
  }
  return instance
})

vi.mock('ora', () => ({ default: () => spinner }))
vi.mock('./utils/pnpm', () => ({ detectPnpm: vi.fn() }))
vi.mock('./utils/exec', async (importOriginal) => ({
  ...await importOriginal<typeof import('./utils/exec')>(),
  exec: vi.fn(),
}))

type ExecResult = Awaited<ReturnType<typeof exec>>

/** 命令执行记录 */
interface Call {
  cmd: string
  cwd: string
  /** 执行时的 pnpm-workspace.yaml 内容 */
  workspace: WorkspaceData | null
}

const ok = (stdout = ''): ExecResult => ({ status: true, error: null, stdout, stderr: '' })
const fail = (stderr: string): ExecResult => ({ status: false, error: new Error('Command failed'), stdout: '', stderr })

/**
 * 模拟命令执行 记录每条命令以及执行时的 pnpm-workspace.yaml
 * @param handler 返回自定义结果 未返回时视为执行成功
 */
const mockExec = (handler: (cmd: string, cwd: string) => ExecResult | void = () => { }) => {
  const calls: Call[] = []
  vi.mocked(exec).mockImplementation(async (cmd, options = {}) => {
    const cwd = String(options.cwd)
    const file = path.join(cwd, 'pnpm-workspace.yaml')
    calls.push({ cmd, cwd, workspace: fs.existsSync(file) ? readYamlFile(file) : null })
    return handler(cmd, cwd) || ok()
  })
  return calls
}

describe('create-karin 项目流程', () => {
  let root: string

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'create-karin-project-'))
    vi.spyOn(process, 'cwd').mockReturnValue(root)
    vi.spyOn(console, 'log').mockImplementation(() => { })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.mocked(exec).mockReset()
    fs.rmSync(root, { recursive: true, force: true })
  })

  describe('fixProject', () => {
    const LEGACY_WORKSPACE = [
      'packages:',
      '  - plugins/*',
      'onlyBuiltDependencies:',
      '  - better-sqlite3',
      '',
    ].join('\n')

    it('合并已有的旧配置后再安装 并使用 -w 安装到工作区根目录', async () => {
      fs.writeFileSync(path.join(root, 'pnpm-workspace.yaml'), LEGACY_WORKSPACE)
      const calls = mockExec()

      expect(await fixProject(root, 'latest', '', parseVersion('11.28.2'))).toBe(true)

      const install = calls.find(call => call.cmd.startsWith('pnpm add'))!
      expect(install.cmd).toBe('pnpm add node-karin@latest -w')
      expect(install.workspace?.allowBuilds).toMatchObject({ 'better-sqlite3': true, sharp: true })
      expect(install.workspace).toMatchObject({ strictDepBuilds: false, minimumReleaseAge: 0 })
      expect(install.workspace).not.toHaveProperty('onlyBuiltDependencies')
      expect(calls.map(call => call.cmd)).toEqual(['pnpm add node-karin@latest -w', 'npx karin init'])
    })

    it('安装失败时返回 false 并且不执行 karin init', async () => {
      const failSpy = vi.spyOn(spinner, 'fail')
      const calls = mockExec(cmd => cmd.startsWith('pnpm add') ? fail('ERR_PNPM_ADDING_TO_ROOT') : undefined)

      expect(await fixProject(root, 'latest', ' --registry=https://registry.npmmirror.com', null)).toBe(false)

      expect(calls.map(call => call.cmd)).toEqual(['pnpm add node-karin@latest --registry=https://registry.npmmirror.com -w'])
      expect(failSpy).toHaveBeenCalledWith(expect.stringContaining('ERR_PNPM_ADDING_TO_ROOT'))
    })

    it('karin init 失败时返回 false', async () => {
      const failSpy = vi.spyOn(spinner, 'fail')
      mockExec(cmd => cmd === 'npx karin init' ? fail('init error') : undefined)

      expect(await fixProject(root, 'latest', '', parseVersion('9.15.9'))).toBe(false)
      expect(failSpy).toHaveBeenCalledWith(expect.stringContaining('init error'))
    })
  })

  describe('createProject', () => {
    it('pnpm 9: 安装前写入包含 packages 的配置 并使用 -w 安装', async () => {
      vi.mocked(detectPnpm).mockResolvedValue({ version: '9.15.9', parsed: parseVersion('9.15.9'), requiredNode: '' })
      const calls = mockExec((cmd, cwd) => {
        /** setAuthKey 需要读取 karin init 生成的 .env */
        if (cmd === 'npx karin init') fs.writeFileSync(path.join(cwd, '.env'), 'HTTP_AUTH_KEY=a\nWS_SERVER_AUTH_KEY=b\n')
      })

      await createProject('bot', '', 'http', 'ws')

      const install = calls.find(call => call.cmd.startsWith('pnpm add'))!
      expect(install.cmd).toBe('pnpm add node-karin@latest -w')
      expect(install.workspace?.packages).toEqual(['plugins/*'])
      expect(fs.readFileSync(path.join(root, 'bot', '.env'), 'utf-8')).toContain('HTTP_AUTH_KEY=http')
    })

    it('karin init 失败时抛出错误', async () => {
      vi.mocked(detectPnpm).mockResolvedValue({ version: '12.9.1', parsed: parseVersion('12.9.1'), requiredNode: '' })
      mockExec(cmd => cmd === 'npx karin init' ? fail('init error') : undefined)

      await expect(createProject('bot', '', 'http', 'ws')).rejects.toThrow('init error')
    })
  })
})
