import { describe, it, expect } from 'vitest'
import path from 'node:path'
import fs from 'node:fs'
import os from 'node:os'
import { existsSync, isDirSync, isFileSync, mkdirSync, existToMkdirSync, rmSync } from './sync'

describe('fs/sync', () => {
  it('existsSync, isDirSync, isFileSync work', () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'utils-sync-'))
    const file = path.join(tmp, 'a.txt')
    fs.writeFileSync(file, 'x')
    expect(existsSync(tmp)).toBe(true)
    expect(isDirSync(tmp)).toBe(true)
    expect(isFileSync(tmp)).toBe(false)
    expect(isFileSync(file)).toBe(true)
    rmSync(tmp, { recursive: true, force: true })
  })

  it('mkdirSync and existToMkdirSync create directories safely', () => {
    const dir = path.join(os.tmpdir(), `utils-sync-${Date.now()}`)
    expect(mkdirSync(dir)).toBe(true)
    expect(existToMkdirSync(dir)).toBe(true)
    rmSync(dir, { recursive: true, force: true })
  })

  it('handles errors via catch paths', () => {
    const fsMod = require('node:fs') as typeof import('node:fs')
    const mkdirSpy = vi.spyOn(fsMod, 'mkdirSync').mockImplementation(() => { throw new Error('fail') })
    expect(mkdirSync(path.join(os.tmpdir(), 'x'))).toBe(false)
    mkdirSpy.mockRestore()
  })

  it('isDirSync and isFileSync return false on missing path', () => {
    const p = path.join(os.tmpdir(), `missing-${Date.now()}`)
    expect(isDirSync(p)).toBe(false)
    expect(isFileSync(p)).toBe(false)
  })
})
