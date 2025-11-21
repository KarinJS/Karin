import { describe, it, expect, vi } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { readJsonSync, writeJsonSync, readJson, writeJson, json } from './json'

describe('file/json', () => {
  it('readJsonSync and writeJsonSync success', () => {
    const p = path.join(os.tmpdir(), `j-${Date.now()}.json`)
    fs.writeFileSync(p, JSON.stringify({ a: 1 }))
    expect(readJsonSync(p)).toEqual({ a: 1 })
    expect(writeJsonSync(p, { a: 2 })).toBe(true)
    expect(readJsonSync(p)).toEqual({ a: 2 })
    fs.rmSync(p, { force: true })
  })

  it('readJsonSync returns null on error and throws when isThrow', () => {
    const p = path.join(os.tmpdir(), `no-${Date.now()}.json`)
    expect(readJsonSync(p)).toBeNull()
    expect(() => readJsonSync(p, true)).toThrow()
  })

  it('writeJsonSync returns false on error and throws when isThrow', () => {
    const spy = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => { throw new Error('fail') })
    const p = path.join(os.tmpdir(), `w-${Date.now()}.json`)
    expect(writeJsonSync(p, { a: 1 })).toBe(false)
    expect(() => writeJsonSync(p, { a: 1 }, true)).toThrow()
    spy.mockRestore()
  })

  it('async readJson and writeJson', async () => {
    const p = path.join(os.tmpdir(), `ja-${Date.now()}.json`)
    await writeJson(p, { a: 3 })
    expect(await readJson(p)).toEqual({ a: 3 })
    expect(await writeJson(p, { a: 4 })).toBe(true)
    expect(await readJson(p)).toEqual({ a: 4 })
    fs.rmSync(p, { force: true })
  })

  it('async readJson throws when isThrow', async () => {
    const p = path.join(os.tmpdir(), `missing-${Date.now()}.json`)
    await expect(readJson(p, true)).rejects.toBeTruthy()
  })

  it('json object facade works', async () => {
    const p = path.join(os.tmpdir(), `jb-${Date.now()}.json`)
    expect(await json.write(p, { b: 1 })).toBe(true)
    expect(json.readSync(p)).toEqual({ b: 1 })
    fs.rmSync(p, { force: true })
  })
})
