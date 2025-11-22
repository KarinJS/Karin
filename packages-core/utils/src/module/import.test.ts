import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { imports, importWithStatus } from './import'

describe('module/import', () => {
  it('imports default, star, named and eager reload', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mimp-'))
    const mod = path.join(dir, 'm.js')
    fs.writeFileSync(mod, 'export default 1; export const x=2;')
    const d = await imports(mod, { import: 'default' })
    expect(d).toBe(1)
    const s = await imports(mod, { import: '*' }) as any
    expect(s.x).toBe(2)
    const n = await imports(mod, { import: 'x', eager: true })
    expect(n).toBe(2)
    fs.rmSync(dir, { recursive: true, force: true })
  })

  it('importWithStatus success and failure', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mimp2-'))
    const mod = path.join(dir, 'm.js')
    fs.writeFileSync(mod, 'export const ok=3;')
    const ok = await importWithStatus(mod)
    expect(ok.status).toBe(true)
    const fail = await importWithStatus('C:/no/such/module.js')
    expect(fail.status).toBe(false)
    fs.rmSync(dir, { recursive: true, force: true })
  })
})
