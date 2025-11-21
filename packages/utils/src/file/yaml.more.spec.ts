import { describe, it, expect, vi } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import YAML from 'yaml'
import { YamlEditor, read, write, save, comment, applyComments } from './yaml'

// @ts-ignore
global.logger = { debug: vi.fn(), error: vi.fn() }

describe('file/yaml more', () => {
  it('set/add/del/append/remove/has/hasval variants', () => {
    const p = path.join(os.tmpdir(), `ym-${Date.now()}.yaml`)
    const ed = new YamlEditor('a: 1\narr: []\nmap: { k: v }')
    expect(ed.set('b.c', 2)).toBe(true)
    expect(ed.add('arr', 'x')).toBe(true)
    expect(ed.append('arr', 'y')).toBe(true)
    expect(ed.append('arr', 'z', true)).toBe(true)
    expect(ed.remove('arr', 'x')).toBe(false)
    expect(ed.has('b.c')).toBe(true)
    expect(ed.hasval('arr', 'y')).toBe(false)
    expect(ed.hasval('map', 'v')).toBe(false)
    expect(ed.hasVal('arr', 'y')).toBe(false)
    // do not save when constructed from content string
  })

  it('pusharr and delarr with errors', () => {
    const ed = new YamlEditor('a: 1')
    expect(ed.pusharr('x')).toBe(true)
    expect(ed.delarr(0)).toBe(true)
    expect(ed.delarr(99)).toBe(false)
  })

  it('getpair/comment/uncomment/hascomment/getcomment branches', () => {
    const ed = new YamlEditor('a: 1\nobj: { k: 1 }')
    expect(() => ed.getpair('obj.k')).not.toThrow()
    ed.comment('a', 'hello', true)
    expect(ed.hascomment('a', 'before')).toBe(true)
    expect(ed.getcomment('a')).toBeTypeOf('string')
    ed.uncomment('a', 'after')
    ed.comment('a', 'e', false)
    expect(ed.hascomment('a', 'after')).toBe(true)
    ed.uncomment('a', 'all')
    expect(ed.hascomment('a', 'before')).toBe(false)
  })

  it('read.save success and error, write failure branch', () => {
    const p = path.join(os.tmpdir(), `rd-${Date.now()}.yaml`)
    fs.writeFileSync(p, 'x: 1')
    const data = read(p)
    const cfg = { x: 'comment' }
    expect(read.save && read.save(cfg)).toBe(true)
    const spy = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => { throw new Error('fail') })
    expect(write(p, { a: 1 })).toBe(false)
    spy.mockRestore()
  })

  it('save and comment with options path and object', () => {
    const p = path.join(os.tmpdir(), `sv-${Date.now()}.yaml`)
    const j = path.join(os.tmpdir(), `sv-${Date.now()}.json`)
    save(p, { a: 1 }, { a: 'top' })
    expect(fs.existsSync(p)).toBe(true)
    fs.writeFileSync(j, JSON.stringify({ a: 'top' }))
    comment(p, j)
    const ed = new YamlEditor(p)
    expect(ed.hascomment('a', 'before') || ed.hascomment('a', 'after')).toBe(true)
    applyComments(ed, { a: { comment: 'again', type: 'end' } })
    expect(ed.hascomment('a', 'after')).toBe(true)
    fs.rmSync(p, { force: true })
    fs.rmSync(j, { force: true })
  })
})
