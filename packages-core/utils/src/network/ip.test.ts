import { describe, it, expect, vi } from 'vitest'
import { isIPv4Loopback, isIPv6Loopback, isLoopback, getRequestIp, isLocalRequest } from './ip'
import type { Request } from 'express'

vi.mock('node:dns/promises', () => {
  return {
    lookup: vi.fn(async (host: string) => {
      if (host === 'localhost') return [{ address: '127.0.0.1', family: 4 }]
      if (host === '::1') return [{ address: '::1', family: 6 }]
      if (host === '127.0.0.1') return [{ address: '127.0.0.1', family: 4 }]
      if (host === 'example.com') return [{ address: '93.184.216.34', family: 4 }]
      return []
    }),
  }
})

describe('network/ip', () => {
  it('isIPv4Loopback checks 127.x.x.x', () => {
    expect(isIPv4Loopback('127.0.0.1')).toBe(true)
    expect(isIPv4Loopback('127.0.0.255')).toBe(true)
    expect(isIPv4Loopback('192.168.1.1')).toBe(false)
    expect(isIPv4Loopback('127.0.0.-1')).toBe(false)
  })

  it('isIPv6Loopback checks ::1 and mapped IPv4', () => {
    expect(isIPv6Loopback('::1')).toBe(true)
    expect(isIPv6Loopback('::ffff:127.0.0.1')).toBe(true)
    expect(isIPv6Loopback('fe80::1')).toBe(false)
  })

  it('isLoopback resolves hostnames via mocked DNS', async () => {
    expect(await isLoopback('localhost')).toBe(true)
    expect(await isLoopback('::1')).toBe(true)
    expect(await isLoopback('example.com')).toBe(false)
  })

  it('getRequestIp extracts from headers and socket', () => {
    const req = {
      headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' },
      socket: { remoteAddress: '9.9.9.9' },
      ip: '10.0.0.1',
      hostname: 'localhost',
    } as unknown as Request
    const ips = getRequestIp(req)
    expect(ips).toEqual(['1.2.3.4', '5.6.7.8', '10.0.0.1', 'localhost', '9.9.9.9'])
  })

  it('isLocalRequest checks all IPs are loopback', async () => {
    const reqLocal = {
      headers: { 'x-forwarded-for': '127.0.0.1' },
      socket: { remoteAddress: '::1' },
      ip: '127.0.0.1',
      hostname: 'localhost',
    } as unknown as Request
    expect(await isLocalRequest(reqLocal)).toBe(true)

    const reqRemote = {
      headers: { 'x-forwarded-for': '93.184.216.34' },
      socket: { remoteAddress: '93.184.216.34' },
      ip: '93.184.216.34',
      hostname: 'example.com',
    } as unknown as Request
    expect(await isLocalRequest(reqRemote)).toBe(false)
  })

  it('isLoopback returns false on DNS error and array header branch', async () => {
    const mod = await import('node:dns/promises')
    // @ts-expect-error
    mod.lookup.mockImplementationOnce(async () => { throw new Error('dns fail') })
    expect(await isLoopback('badhost')).toBe(false)
    const req = { headers: { 'x-forwarded-for': ['127.0.0.1', '::1'] }, socket: { remoteAddress: undefined }, ip: undefined, hostname: undefined } as unknown as Request
    const ips = getRequestIp(req)
    expect(ips).toEqual(['127.0.0.1', '::1'])
  })
})
