import { describe, it, expect } from 'vitest'
import * as dep from './deprecated'

describe('deprecated re-exports', () => {
  it('path re-exports work', () => {
    expect(typeof dep.absPath).toBe('function')
    expect(typeof dep.formatPath).toBe('function')
    expect(typeof dep.getRelPath).toBe('function')
    expect(typeof dep.isPathEqual).toBe('function')
    expect(typeof dep.filesByExt).toBe('function')
    expect(typeof dep.getDirs).toBe('function')
    expect(typeof dep.getDirsSync).toBe('function')
  })

  it('file and module and network re-exports work', () => {
    expect(typeof dep.downloadFile).toBe('function')
    expect(typeof dep.downFile).toBe('function')
    expect(typeof dep.imports).toBe('function')
    expect(typeof dep.importWithStatus).toBe('function')
    expect(typeof dep.isIPv4Loop).toBe('function')
    expect(typeof dep.isIPv6Loop).toBe('function')
  })

  it('time and crypto re-exports work', () => {
    expect(typeof dep.formatTime).toBe('function')
    expect(typeof dep.uptime).toBe('function')
    expect(typeof dep.secretKey).toBe('function')
  })
})