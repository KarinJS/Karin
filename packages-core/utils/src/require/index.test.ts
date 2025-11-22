import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { clearRequire, requireFile, requireFileSync, writeFile, writeFileSync } from './index'

describe('require/index', () => {
  it('requireFile json and yaml with cache and force', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'req-'))
    const jp = path.join(dir, 'a.json')
    const yp = path.join(dir, 'b.yaml')
    fs.writeFileSync(jp, JSON.stringify({ x: 1 }))
    fs.writeFileSync(yp, 'y: 2')
    const j1 = await requireFile(jp)
    expect(j1).toEqual({ x: 1 })
    const j2 = await requireFile(jp, { readCache: true })
    expect(j2).toEqual({ x: 1 })
    const j3 = await requireFile(jp, { force: true })
    expect(j3).toEqual({ x: 1 })
    const y1 = requireFileSync(yp)
    expect(y1).toEqual({ y: 2 })
    clearRequire(jp)
    clearRequire()
    fs.rmSync(dir, { recursive: true, force: true })
  })

  it('requireFile size limit and parser override', async () => {
    const p = path.join(os.tmpdir(), `c-${Date.now()}.txt`)
    fs.writeFileSync(p, 'hello')
    const s1 = await requireFile(p, { size: 1, parser: (c) => c.toUpperCase(), type: 'json' as any })
    expect(s1).toBe('HELLO')
    fs.rmSync(p, { force: true })
  })

  it('writeFileSync and writeFile clear cache and format', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wf-'))
    const jp = path.join(dir, 'a.json')
    writeFileSync(jp, { a: 1 })
    const s = fs.readFileSync(jp, 'utf-8')
    expect(JSON.parse(s).a).toBe(1)
    await writeFile(jp, { a: 2 })
    expect(JSON.parse(fs.readFileSync(jp, 'utf-8')).a).toBe(2)
    const yp = path.join(dir, 'b.yaml')
    writeFileSync(yp, { b: 2 })
    expect(fs.readFileSync(yp, 'utf-8')).toContain('b: 2')
    fs.rmSync(dir, { recursive: true, force: true })
  })
})