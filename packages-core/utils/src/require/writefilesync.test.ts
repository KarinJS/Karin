import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { writeFileSync, requireFileSync } from './index'

describe('require/writeFileSync stringify and buffer', () => {
  it('writeFileSync with stringify clears cache', () => {
    const p = path.join(os.tmpdir(), `wfs-${Date.now()}.txt`)
    writeFileSync(p, { a: 1 }, { stringify: (d) => JSON.stringify(d) })
    expect(requireFileSync(p)).toBe('{"a":1}')
    fs.rmSync(p, { force: true })
  })

  it('writeFileSync with Buffer writes bytes', () => {
    const p = path.join(os.tmpdir(), `wfsb-${Date.now()}.bin`)
    writeFileSync(p, Buffer.from('abc'))
    const s = fs.readFileSync(p)
    expect(String(s)).toContain('abc')
    fs.rmSync(p, { force: true })
  })
})
