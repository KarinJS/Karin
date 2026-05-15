import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {
  readJsonSync,
  writeJsonSync,
  readJson,
  writeJson,
  json,
} from '@/utils/fs/json'

let tmpDir: string

beforeAll(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'karin-json-test-'))
})

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true })
})

describe('utils/fs/json — sync', () => {
  it('writes and reads JSON', () => {
    const file = path.join(tmpDir, 'sync.json')
    expect(writeJsonSync(file, { a: 1, b: 'two' })).toBe(true)
    expect(readJsonSync(file)).toEqual({ a: 1, b: 'two' })
  })

  it('returns null on missing file without throwing', () => {
    expect(readJsonSync(path.join(tmpDir, 'missing.json'))).toBeNull()
  })

  it('throws on missing file when isThrow=true', () => {
    expect(() => readJsonSync(path.join(tmpDir, 'missing.json'), true)).toThrow()
  })

  it('returns false on write failure (invalid target) without throwing', () => {
    // A directory cannot be written to as a file
    expect(writeJsonSync(tmpDir, { foo: 'bar' })).toBe(false)
  })

  it('throws on write failure when isThrow=true', () => {
    expect(() => writeJsonSync(tmpDir, { foo: 'bar' }, true)).toThrow()
  })
})

describe('utils/fs/json — async', () => {
  it('writes and reads JSON', async () => {
    const file = path.join(tmpDir, 'async.json')
    expect(await writeJson(file, { x: [1, 2, 3] })).toBe(true)
    await expect(readJson(file)).resolves.toEqual({ x: [1, 2, 3] })
  })

  it('returns null when missing without throwing', async () => {
    await expect(readJson(path.join(tmpDir, 'missing-async.json'))).resolves.toBeNull()
  })

  it('throws when isThrow=true on missing file', async () => {
    await expect(readJson(path.join(tmpDir, 'missing-async.json'), true)).rejects.toBeDefined()
  })
})

describe('utils/fs/json — namespace export', () => {
  it('exposes sync and async helpers', () => {
    expect(json.readSync).toBe(readJsonSync)
    expect(json.writeSync).toBe(writeJsonSync)
    expect(json.read).toBe(readJson)
    expect(json.write).toBe(writeJson)
  })
})
