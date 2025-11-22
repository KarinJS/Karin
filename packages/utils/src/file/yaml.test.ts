import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { YamlEditor, read, write, save, comment, applyComments } from './yaml'
import YAML from 'yaml'

describe('file/yaml', () => {
  it('YamlEditor basic operations', () => {
    const p = path.join(os.tmpdir(), `e-${Date.now()}.yaml`)
    fs.writeFileSync(p, 'a: 1')
    const ed = new YamlEditor(p)
    expect(ed.get('')).toEqual({ a: 1 })
    expect(ed.set('b.c', 2)).toBe(true)
    expect(ed.add('arr', new YAML.YAMLSeq())).toBe(true)
    expect(ed.append('arr', 'y')).toBe(true)
    expect(ed.has('b.c')).toBe(true)
    ed.add('m.k', 'yy')
    expect(ed.hasval('m', 'yy')).toBe(false)
    expect(() => ed.comment('a', 'c')).not.toThrow()
    expect(ed.hascomment('a', 'before')).toBe(true)
    expect(ed.getcomment('a')).toBeTypeOf('string')
    ed.uncomment('a', 'all')
    ed.save()
    const rd = read(p)
    expect(rd.a).toBe(1)
    expect(typeof read.save).toBe('function')
    write(p, { k: 'v' })
    const cm = { k: 'comment' }
    save(p, { k: 'v' }, cm)
    comment(p, cm)
    fs.rmSync(p, { force: true })
  })

  it('applyComments attaches comments', () => {
    const ed = new YamlEditor('foo: bar')
    applyComments(ed, { foo: { comment: 'hello', type: 'top' } })
    expect(ed.hascomment('foo', 'before')).toBe(true)
  })
})