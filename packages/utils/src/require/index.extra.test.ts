import { describe, it, expect, vi } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { clearRequire, requireFile, requireFileSync, writeFile, writeFileSync } from './index'

// @ts-ignore
global.logger = { info: vi.fn(), error: vi.fn() }

describe('require/index extra', () => {
  it('readCache returns undefined when not cached', () => {
    const p = path.join(os.tmpdir(), `r-${Date.now()}.json`)
    fs.writeFileSync(p, JSON.stringify({ a: 1 }))
    const u = requireFileSync(p, { readCache: true })
    expect(u).toBeUndefined()
    fs.rmSync(p, { force: true })
  })

  it('size limit avoids caching and parser/type paths', async () => {
    const p = path.join(os.tmpdir(), `s-${Date.now()}.json`)
    fs.writeFileSync(p, JSON.stringify({ a: 1 }))
    const v1 = await requireFile(p, { size: 1 })
    clearRequire(p)
    expect(v1).toEqual({ a: 1 })
    const txt = path.join(os.tmpdir(), `t-${Date.now()}.txt`)
    fs.writeFileSync(txt, 'a: 1')
    const y = await requireFile(txt, { type: 'yaml' })
    expect(y.a).toBe(1)
    clearRequire(txt)
    const parsed = await requireFile(txt, { parser: (c) => c.toUpperCase(), type: 'json' as any })
    expect(parsed).toBe('A: 1')
    fs.rmSync(p, { force: true })
    fs.rmSync(txt, { force: true })
  })

  it('writeFileSync/writeFile branches and clear cache', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wf2-'))
    const jp = path.join(dir, 'a.json')
    writeFileSync(jp, { a: 1 })
    expect(requireFileSync(jp)).toEqual({ a: 1 })
    writeFileSync(jp, JSON.stringify({ b: 2 }))
    expect(requireFileSync(jp)).toEqual({ b: 2 })
    const yp = path.join(dir, 'b.yaml')
    await writeFile(yp, { c: 3 })
    expect(requireFileSync(yp)).toEqual({ c: 3 })
    const bp = path.join(dir, 'c.bin')
    await writeFile(bp, Buffer.from('x'))
    expect(requireFileSync(bp)).toBeTypeOf('string')
    const tp = path.join(dir, 'd.txt')
    await writeFile(tp, 'hello')
    expect(requireFileSync(tp)).toBe('hello')
    await writeFile(tp, { x: 1 }, { stringify: async (d) => JSON.stringify(d) })
    expect(requireFileSync(tp)).toBe('{"x":1}')
    fs.rmSync(dir, { recursive: true, force: true })
  })
})
