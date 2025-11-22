import { describe, it, expect, vi } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { readJson, writeJson } from './json'

describe('file/json more', () => {
  it('readJson returns null when missing and isThrow=false', async () => {
    const p = path.join(os.tmpdir(), `missing-${Date.now()}.json`)
    const v = await readJson(p)
    expect(v).toBeNull()
  })

  it('writeJson returns false on error and isThrow=false', async () => {
    const spy = vi.spyOn(fs.promises, 'writeFile').mockRejectedValue(new Error('fail'))
    const p = path.join(os.tmpdir(), `err-${Date.now()}.json`)
    const ok = await writeJson(p, { a: 1 })
    expect(ok).toBe(false)
    spy.mockRestore()
  })
  it('writeJson throws when isThrow=true', async () => {
    const spy = vi.spyOn(fs.promises, 'writeFile').mockRejectedValue(new Error('fail'))
    const p = path.join(os.tmpdir(), `err-${Date.now()}.json`)
    await expect(writeJson(p, { a: 1 }, true)).rejects.toBeTruthy()
    spy.mockRestore()
  })
})
