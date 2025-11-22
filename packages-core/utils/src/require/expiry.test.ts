import { describe, it, expect, vi } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { requireFileSync } from './index'

describe('require/index expiry', () => {
  it('expired cache is deleted and refreshed', () => {
    const p = path.join(os.tmpdir(), `ex-${Date.now()}.json`)
    fs.writeFileSync(p, JSON.stringify({ a: 1 }))
    const spy = vi.spyOn(Date, 'now')
    spy.mockReturnValue(1000)
    const v1 = requireFileSync(p, { ex: 1 })
    expect(v1.a).toBe(1)
    spy.mockReturnValue(3000)
    const v2 = requireFileSync(p, { ex: 1 })
    expect(v2.a).toBe(1)
    spy.mockRestore()
    fs.rmSync(p, { force: true })
  })
})
