import { describe, it, expect, vi } from 'vitest'
import { PortManager } from './port'

vi.mock('../system/exec', () => ({ exec: vi.fn(async () => ({ stdout: 'TCP    0.0.0.0:3000      0.0.0.0:0      LISTENING       1234', status: true })) }))

describe('network/port', () => {
  it('getPortPid parses output and handles inUse/available/freePort', async () => {
    const d = Object.getOwnPropertyDescriptor(process, 'platform')!
    Object.defineProperty(process, 'platform', { value: 'win32' })
    const pm = new PortManager()
    const pid = await pm.getPortPid(3000)
    expect(pid).toBe(1234)
    expect(await pm.isPortInUse(3000)).toBe(true)
    const spy = vi.spyOn(pm, 'isPortAvailable').mockResolvedValueOnce(true)
    const fp = await pm.getFreePort(3000, 2)
    expect(typeof fp).toBe('number')
    spy.mockRestore()
    Object.defineProperty(process, 'platform', d)
  })

  it('linux path parses first line pid', async () => {
    const d = Object.getOwnPropertyDescriptor(process, 'platform')!
    Object.defineProperty(process, 'platform', { value: 'linux' })
    const { exec } = await import('../system/exec') as any
    vi.mocked(exec).mockResolvedValueOnce({ stdout: '1234\n', status: true })
    const pm = new PortManager()
    const pid = await pm.getPortPid(3000)
    expect(pid).toBe(1234)
    Object.defineProperty(process, 'platform', d)
  })
  it('windows path returns null on exec status false', async () => {
    const d = Object.getOwnPropertyDescriptor(process, 'platform')!
    Object.defineProperty(process, 'platform', { value: 'win32' })
    const { exec } = await import('../system/exec') as any
    vi.mocked(exec).mockResolvedValueOnce({ stdout: '', status: false })
    const pm = new PortManager()
    const pid = await pm.getPortPid(3001)
    expect(pid).toBeNull()
    Object.defineProperty(process, 'platform', d)
  })
  it('windows path first line pid fallback without LISTENING', async () => {
    const d = Object.getOwnPropertyDescriptor(process, 'platform')!
    Object.defineProperty(process, 'platform', { value: 'win32' })
    const { exec } = await import('../system/exec') as any
    vi.mocked(exec).mockResolvedValueOnce({ stdout: 'TCP    0.0.0.0:3002      0.0.0.0:0      CLOSED       4321\n', status: true })
    const pm = new PortManager()
    const pid = await pm.getPortPid(3002)
    expect(pid).toBe(4321)
    Object.defineProperty(process, 'platform', d)
  })
  it('linux path returns null on exec status false', async () => {
    const d = Object.getOwnPropertyDescriptor(process, 'platform')!
    Object.defineProperty(process, 'platform', { value: 'linux' })
    const { exec } = await import('../system/exec') as any
    vi.mocked(exec).mockResolvedValueOnce({ stdout: '', status: false })
    const pm = new PortManager()
    const pid = await pm.getPortPid(3003)
    expect(pid).toBeNull()
    Object.defineProperty(process, 'platform', d)
  })
  it('windows LISTENING line parses pid', async () => {
    const d = Object.getOwnPropertyDescriptor(process, 'platform')!
    Object.defineProperty(process, 'platform', { value: 'win32' })
    const { exec } = await import('../system/exec') as any
    vi.mocked(exec).mockResolvedValueOnce({ stdout: 'TCP    0.0.0.0:3006      0.0.0.0:0      LISTENING       5678\n', status: true })
    const pm = new PortManager()
    const pid = await pm.getPortPid(3006)
    expect(pid).toBe(5678)
    Object.defineProperty(process, 'platform', d)
  })
  it('linux parses stdout pid', async () => {
    const d = Object.getOwnPropertyDescriptor(process, 'platform')!
    Object.defineProperty(process, 'platform', { value: 'linux' })
    const { exec } = await import('../system/exec') as any
    vi.mocked(exec).mockResolvedValueOnce({ stdout: '7777\n', status: true })
    const pm = new PortManager()
    const pid = await pm.getPortPid(7777)
    expect(typeof pid).toBe('number')
    Object.defineProperty(process, 'platform', d)
  })
  it('isPortAvailable toggles on isPortInUse', async () => {
    const pm = new PortManager()
    const spy = vi.spyOn(pm, 'isPortInUse').mockResolvedValueOnce(true).mockResolvedValueOnce(false)
    expect(await pm.isPortAvailable(3004)).toBe(false)
    expect(await pm.isPortAvailable(3005)).toBe(true)
    spy.mockRestore()
  })
  it('getFreePort exceeds maxAttempts throws', async () => {
    const pm = new PortManager()
    const spy = vi.spyOn(pm, 'isPortAvailable').mockResolvedValue(false)
    await expect(pm.getFreePort(3000, 1)).rejects.toBeTruthy()
    spy.mockRestore()
  })
  it('getFreePort overflows 65535 throws error', async () => {
    const pm = new PortManager()
    const spy = vi.spyOn(pm, 'isPortAvailable').mockResolvedValue(false)
    await expect(pm.getFreePort(65535, 2)).rejects.toBeTruthy()
    spy.mockRestore()
  })
  it('getFreePort throws on invalid inputs', async () => {
    const pm = new PortManager()
    await expect(pm.getFreePort(0)).rejects.toThrow()
    await expect(pm.getFreePort(3000, 0)).rejects.toThrow()
  })
})
