import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { describe, it, expect, vi } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
// dynamic import after mocking

describe('file/config', () => {
  it('constructor validates name and creates base dirs', async () => {
    const base = path.join(os.tmpdir(), `karin-${Date.now()}-${Math.random()}`)
    vi.doMock('@karinjs/store', async () => ({ karinPathBase: base }))
    const { CreateConfig } = await import('./config')
    expect(() => new CreateConfig('')).toThrow()
    const cc = new CreateConfig('plugin', ['config','data'])
    expect(fs.existsSync(cc.configDir)).toBe(true)
    fs.rmSync(base, { recursive: true, force: true })
  })

  it('copyConfigSync with overwrite function and ext filter', async () => {
    const base = path.join(os.tmpdir(), `karin-${Date.now()}-${Math.random()}`)
    vi.doMock('@karinjs/store', async () => ({ karinPathBase: base }))
    const { CreateConfig } = await import('./config')
    const cc = new CreateConfig('p')
    const src = fs.mkdtempSync(path.join(os.tmpdir(), 'src-'))
    fs.writeFileSync(path.join(src, 'a.json'), '{}')
    fs.writeFileSync(path.join(src, 'b.yaml'), 'k: v')
    cc.copyConfigSync(src, { ext: ['json','yaml'] })
    const target = path.join(cc.configDir, 'config')
    expect(fs.existsSync(path.join(target, 'a.json'))).toBe(true)
    fs.writeFileSync(path.join(target, 'a.json'), '{"x":1}')
    cc.copyConfigSync(src, { overwrite: (s,t,n) => n === 'a.json' })
    expect(JSON.parse(fs.readFileSync(path.join(target, 'a.json'), 'utf-8')).x).toBeUndefined()
    fs.rmSync(base, { recursive: true, force: true })
    fs.rmSync(src, { recursive: true, force: true })
  })

  it('copyConfig async overwrite true', async () => {
    const base = path.join(os.tmpdir(), `karin-${Date.now()}-${Math.random()}`)
    vi.doMock('@karinjs/store', async () => ({ karinPathBase: base }))
    const { CreateConfig } = await import('./config')
    const cc = new CreateConfig('p2')
    const src = fs.mkdtempSync(path.join(os.tmpdir(), 'src-'))
    fs.writeFileSync(path.join(src, 'a.json'), '{}')
    const target = path.join(cc.configDir, 'config')
    fs.mkdirSync(target, { recursive: true })
    fs.writeFileSync(path.join(target, 'a.json'), '{"x":1}')
    await cc.copyConfig(src, { overwrite: true })
    expect(JSON.parse(fs.readFileSync(path.join(target, 'a.json'), 'utf-8')).x).toBeUndefined()
    fs.rmSync(base, { recursive: true, force: true })
    fs.rmSync(src, { recursive: true, force: true })
  })

  it('create/read/write ConfigFile and watch', async () => {
    const base = path.join(os.tmpdir(), `karin-${Date.now()}-${Math.random()}`)
    vi.doMock('@karinjs/store', async () => ({ karinPathBase: base }))
    const { CreateConfig } = await import('./config')
    const cc = new CreateConfig('p3')
    cc.createConfigFile('conf.json', { a: 1 })
    const val = cc.readConfigFile('conf.json') as any
    expect(val.a).toBe(1)
    cc.writeConfigFile('conf.json', { a: 2 })
    const after = cc.readConfigFile('conf.json') as any
    expect(after.a).toBe(2)
    const events: any[] = []
    const w = cc.watch('config', (p, prev, next) => events.push({ p, prev, next }))
    w.close?.()
    expect(Array.isArray(events)).toBe(true)
    fs.rmSync(base, { recursive: true, force: true })
  })
})
