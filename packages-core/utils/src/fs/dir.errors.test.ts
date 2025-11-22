import { describe, it, expect, vi } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { ensureDir, readDir, readDirRecursive, readDirRecursiveSync } from './dir'

describe('fs/dir errors', () => {
  it('ensureDir returns false on mkdir failure', async () => {
    const dir = path.join(os.tmpdir(), `ed-${Date.now()}`)
    const acc = vi.spyOn(fs.promises, 'access').mockRejectedValue(new Error('missing'))
    const mk = vi.spyOn(fs.promises, 'mkdir').mockRejectedValue(new Error('fail'))
    expect(await ensureDir(dir)).toBe(false)
    acc.mockRestore()
    mk.mockRestore()
  })

  it('readDir throws on missing path', () => {
    expect(() => readDir(path.join(os.tmpdir(), 'no-such'))).toThrow()
  })

  it('readDirRecursive throws on missing path', async () => {
    await expect(readDirRecursive(path.join(os.tmpdir(), 'no-such'))).rejects.toThrow()
  })

  it('readDirRecursiveSync throws on missing path', () => {
    expect(() => readDirRecursiveSync(path.join(os.tmpdir(), 'no-such'))).toThrow()
  })
})