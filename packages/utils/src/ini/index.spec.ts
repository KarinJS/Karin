import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { ini } from './index'

describe('ini/index', () => {
  it('parse/decode/encode/stringify/safe/unsafe', () => {
    const txt = 'key=value\n[section]\nfoo=bar\n'
    const obj = ini.parse(txt)
    expect(obj.key).toBe('value')
    const obj2 = ini.decode(txt)
    expect(obj2.section.foo).toBe('bar')
    const encoded = ini.encode({ key: 'value', section: { foo: 'bar' } })
    expect(encoded).toContain('[section]')
    const str = ini.stringify({ a: 'b' })
    expect(str).toContain('a=b')
    const safe = ini.safe('"unsafe"')
    expect(safe).toContain('\\"')
    const unsafe = ini.unsafe(safe)
    expect(unsafe).toBe('"unsafe"')
  })

  it('readFile/writeFile works', () => {
    const p = path.join(os.tmpdir(), `cfg-${Date.now()}.ini`)
    ini.writeFile(p, { database: { host: 'localhost' }, app: { name: 'myapp' } })
    const cfg = ini.readFile(p)
    expect(cfg.database.host).toBe('localhost')
    fs.rmSync(p, { force: true })
  })
})
