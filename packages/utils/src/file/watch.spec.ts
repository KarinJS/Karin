import { describe, it, expect, vi } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

let lastWatcher: any
vi.mock('chokidar', () => {
  return {
    default: {
      watch: (_paths: any, _opts: any) => {
        const handlers: Record<string, Function> = {}
        lastWatcher = {
          on: (evt: string, cb: Function) => { handlers[evt] = cb; return lastWatcher },
          triggerChange: (p: string) => handlers.change?.(p, {} as any),
          triggerUnlink: (p: string) => handlers.unlink?.(p),
          close: () => {},
        }
        return lastWatcher
      },
    },
  }
})

// capture logger
// @ts-ignore
global.logger = { info: vi.fn(), error: vi.fn() }

import { watchs } from './watch'
import { requireFileSync } from '../require'

describe('file/watch', () => {
  it('watchs change event with sync and unlink clears cache', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'w-'))
    const p = path.join(dir, 'a.json')
    fs.writeFileSync(p, JSON.stringify({ a: 1 }))
    requireFileSync(p)
    fs.writeFileSync(p, JSON.stringify({ a: 2 }))
    const events: any[] = []
    const w = watchs(p, (rp, prev, next, opt) => events.push({ rp, prev, next, opt }))
    lastWatcher.triggerChange(p)
    expect(events[0].prev.a).toBe(1)
    expect(events[0].next.a).toBe(2)
    expect(events[0].opt.extname).toBe('.json')
    expect(events[0].opt.dirname.length > 0).toBe(true)
    expect(events[0].opt.formattedPath.endsWith('.json')).toBe(true)
    lastWatcher.triggerUnlink(p)
    w.close?.()
    fs.rmSync(dir, { recursive: true, force: true })
  })

  it('watchs change event with async requireFile', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'w2-'))
    const p = path.join(dir, 'b.json')
    fs.writeFileSync(p, JSON.stringify({ a: 1 }))
    requireFileSync(p)
    fs.writeFileSync(p, JSON.stringify({ a: 3 }))
    const events: any[] = []
    const w2 = watchs(p, (rp, prev, next) => events.push({ rp, prev, next }), { write: 'requireFile' })
    lastWatcher.triggerChange(p)
    await new Promise(r => setTimeout(r, 50))
    expect(events.length > 0).toBe(true)
    expect(events[0].prev.a).toBe(1)
    expect(events[0].next.a).toBe(3)
    w2.close?.()
    fs.rmSync(dir, { recursive: true, force: true })
  })
})
