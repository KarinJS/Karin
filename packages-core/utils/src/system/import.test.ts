import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { imports } from './import'

describe('system/imports', () => {
  it('imports default, star and named with eager', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'imp-'))
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

  it('importWithStatus returns status false on missing', async () => {
    const { importWithStatus } = await import('../module/import')
    const st = await importWithStatus('file:///C:/no/such/module.js')
    expect(st.status).toBe(false)
  })
})
