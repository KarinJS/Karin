import { describe, it, expect } from 'vitest'
import * as pid from './pid'

import { vi } from 'vitest'
vi.mock('./exec', () => ({ exec: vi.fn(async () => ({ stdout: 'TCP    0.0.0.0:3000      0.0.0.0:0      LISTENING       1234', status: true })) }))

describe('system/pid', () => {
  it('getPid parses windows output', async () => {
    const d = Object.getOwnPropertyDescriptor(process, 'platform')!
    Object.defineProperty(process, 'platform', { value: 'win32' })
    const p = await pid.getPid(3000)
    expect(p).toBe(1234)
    Object.defineProperty(process, 'platform', d)
  })

  it('getPidByPort and isPortInUse and killProcess', async () => {
    const d = Object.getOwnPropertyDescriptor(process, 'platform')!
    Object.defineProperty(process, 'platform', { value: 'win32' })
    const p = await pid.getPidByPort(3000)
    expect(p).toBe(1234)
    const inUse = await pid.isPortInUse(3000)
    expect(inUse).toBe(true)
    vi.mocked((await import('./exec')).exec).mockResolvedValueOnce({ status: true, stdout: '', error: null } as any)
    const ok = await pid.killProcess(1234)
    expect(ok).toBe(true)
    Object.defineProperty(process, 'platform', d)
  })
})