import { describe, it, expect, vi } from 'vitest'
import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs'
import { mkdir } from './dir'

describe('fs/dir mkdir errors', () => {
  it('mkdir returns false on error', async () => {
    const spy = vi.spyOn(fs.promises, 'mkdir').mockRejectedValue(new Error('fail'))
    const ok = await mkdir(path.join(os.tmpdir(), `mk-${Date.now()}`))
    expect(ok).toBe(false)
    spy.mockRestore()
  })
})