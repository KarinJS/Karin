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
          close: () => {},
        }
        return lastWatcher
      },
    },
  }
})

// @ts-ignore
global.logger = { info: vi.fn() }

import { watchs } from './watch'

describe('file/watch more', () => {
  it('change event uses cwd to compute rel path', async () => {
    const base = fs.mkdtempSync(path.join(os.tmpdir(), 'wm-'))
    const p = path.join(base, 'cfg.json')
    fs.writeFileSync(p, JSON.stringify({ a: 1 }))
    fs.writeFileSync(p, JSON.stringify({ a: 2 }))
    const events: any[] = []
    watchs(p, (rp, prev, next) => events.push({ rp, prev, next }), { chokidar: { cwd: base } })
    lastWatcher.triggerChange(p)
    expect(events[0].rp).toBe('cfg.json')
  })
})
