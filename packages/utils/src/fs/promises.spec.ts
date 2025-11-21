import { describe, it, expect } from 'vitest'
import path from 'node:path'
import fs from 'node:fs'
import os from 'node:os'
import { exists, isDir, isFile, mkdir, existToMkdir } from './promises'

describe('fs/promises', () => {
  it('exists, isDir, isFile work', async () => {
    const tmp = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'utils-async-'))
    const file = path.join(tmp, 'a.txt')
    await fs.promises.writeFile(file, 'x')
    expect(await exists(tmp)).toBe(true)
    expect(await isDir(tmp)).toBe(true)
    expect(await isFile(tmp)).toBe(false)
    expect(await isFile(file)).toBe(true)
    await fs.promises.rm(tmp, { recursive: true, force: true })
  })

  it('mkdir and existToMkdir create directories safely', async () => {
    const dir = path.join(os.tmpdir(), `utils-async-${Date.now()}`)
    expect(await mkdir(dir)).toBe(true)
    expect(await existToMkdir(dir)).toBe(true)
    await fs.promises.rm(dir, { recursive: true, force: true })
  })

  it('exists, isDir, isFile return false for non-existent', async () => {
    const p = path.join(os.tmpdir(), `no-such-${Date.now()}`)
    expect(await exists(p)).toBe(false)
    expect(await isDir(p)).toBe(false)
    expect(await isFile(p)).toBe(false)
  })

  it('mkdir catch errors returns false', async () => {
    const spy = vi.spyOn(fs.promises, 'mkdir').mockRejectedValue(new Error('fail'))
    const dir = path.join(os.tmpdir(), `utils-async-${Date.now()}`)
    expect(await mkdir(dir)).toBe(false)
    spy.mockRestore()
  })

  it('existToMkdir returns true when mkdir fails silently', async () => {
    const dir = path.join(os.tmpdir(), `utils-async-${Date.now()}`)
    expect(await existToMkdir(dir)).toBe(true)
  })
})
