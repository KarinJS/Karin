import { describe, it, expect, vi } from 'vitest'
import { exec } from './exec'

vi.mock('child_process', () => ({
  exec: (cmd: string, opts: any, cb: Function) => {
    setImmediate(() => cb(null, 'out\n', ''))
  },
}))

// @ts-ignore
global.logger = { info: vi.fn(), warn: vi.fn() }

describe('system/exec', () => {
  it('returns full result and simple boolean', async () => {
    const res = await exec('echo ok')
    expect(res.status).toBe(true)
    const ok = await exec('echo ok', { simple: true })
    expect(ok).toBe(true)
  })

  it('trim output and validators', async () => {
    const res = await exec('cmd', { trim: true, verbose: true })
    expect(res.stdout).toBe('out')
    const ig = await exec('cmd', { validator: 'ignoreStderr', simple: true })
    expect(ig).toBe(true)
    const ignErr = await exec('cmd', { validator: 'ignoreError' })
    expect(ignErr.status).toBe(true)
    const custom = await exec('cmd', { validator: () => true, simple: true })
    expect(custom).toBe(true)
  })

  it('deprecated options normalized with warnings', async () => {
    const ok = await exec('cmd', { log: true, booleanResult: true })
    expect(ok).toBe(true)
  })
})
