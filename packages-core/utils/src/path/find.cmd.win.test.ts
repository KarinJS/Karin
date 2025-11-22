import { describe, it, expect, vi } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

describe('path/find findCmdPath windows branch', () => {
  it('finds .exe in PATH and normalizes slashes', async () => {
    const original = Object.getOwnPropertyDescriptor(process, 'platform')
    const old = process.env.PATH || ''
    const tmpBin = fs.mkdtempSync(path.join(os.tmpdir(), 'bin-win-'))
    const exe = path.join(tmpBin, 'tool.exe')
    fs.writeFileSync(exe, '')
    // @ts-ignore
    Object.defineProperty(process, 'platform', { value: 'win32' })
    process.env.PATH = `${tmpBin};${old}`
    vi.resetModules()
    const mod = await import('./find')
    const found = mod.findCmdPath('tool')!
    expect(found.replace(/\\/g, '/')).toContain('/tool.exe')
    process.env.PATH = old
    if (original) Object.defineProperty(process, 'platform', original)
    fs.rmSync(tmpBin, { recursive: true, force: true })
  })
  it('returns null when not found in PATH', async () => {
    const original = Object.getOwnPropertyDescriptor(process, 'platform')
    const old = process.env.PATH || ''
    const tmpBin = fs.mkdtempSync(path.join(os.tmpdir(), 'bin-win-2-'))
    // @ts-ignore
    Object.defineProperty(process, 'platform', { value: 'win32' })
    process.env.PATH = `${tmpBin};${old}`
    vi.resetModules()
    const mod = await import('./find')
    const found = mod.findCmdPath('no-tool')
    expect(found).toBeNull()
    process.env.PATH = old
    if (original) Object.defineProperty(process, 'platform', original)
    fs.rmSync(tmpBin, { recursive: true, force: true })
  })
})
