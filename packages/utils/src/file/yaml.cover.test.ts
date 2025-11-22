import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import YAML from 'yaml'
import { YamlEditor, read, write, save, applyComments } from './yaml'

describe('file/yaml cover branches', () => {
  it('set/add/del error paths by throwing from document methods', () => {
    const ed = new YamlEditor('a: 1')
    // @ts-ignore
    ed.document.setIn = () => { throw new Error('set fail') }
    expect(ed.set('a.b', 1)).toBe(false)
    // @ts-ignore
    ed.document.addIn = () => { throw new Error('add fail') }
    expect(ed.add('a.b', 1)).toBe(false)
    // @ts-ignore
    ed.document.deleteIn = () => { throw new Error('del fail') }
    expect(ed.del('a.b')).toBe(false)
  })

  it('append catch path when getIn throws', () => {
    const ed = new YamlEditor('a: 1')
    // @ts-ignore
    ed.document.getIn = () => { throw new Error('get fail') }
    expect(ed.append('arr', 'x')).toBe(false)
  })

  it('append creates new seq when missing and fails on non-seq', () => {
    const ed = new YamlEditor('a: 1')
    expect(ed.append('newarr', 'x')).toBe(true)
    ed.set('notarr', 'x')
    expect(ed.append('notarr', 'y')).toBe(false)
  })

  it('remove success path and not found branch', () => {
    const ed = new YamlEditor('arr: []')
    const seq = new YAML.YAMLSeq()
    seq.items = [{ toJSON: () => 'y' } as any]
    // @ts-ignore
    ed.document.getIn = () => seq
    expect(ed.remove('arr', 'z')).toBe(false)
    expect(ed.remove('arr', 'y')).toBe(true)
  })
  it('remove missing path and non-seq path', () => {
    const ed = new YamlEditor('a: 1')
    expect(ed.remove('missing', 'x')).toBe(false)
    ed.set('notarr', 'x')
    expect(ed.remove('notarr', 'y')).toBe(false)
  })

  it('get catches toJSON error', () => {
    const ed = new YamlEditor('a: 1')
    // @ts-ignore
    ed.document.toJSON = () => { throw new Error('json fail') }
    expect(ed.get('a')).toBeNull()
  })

  it('hasval direct compare for primitive', () => {
    const ed = new YamlEditor('a: 1')
    ed.set('val', 1)
    expect(ed.hasval('val', 1)).toBe(true)
  })

  it('delarr catches non-seq root error', () => {
    const ed = new YamlEditor('a: 1')
    // @ts-ignore
    ed.document.contents = new YAML.YAMLMap()
    expect(ed.delarr(0)).toBe(false)
  })

  it('getpair sequence branch and uncomment before/hascomment invalid', () => {
    const seqYaml = '- a\n- b\n'
    const ed = new YamlEditor(seqYaml)
    const pair = ed.getpair('a')
    expect(pair).toBeTruthy()
    const ed2 = new YamlEditor('x: 1')
    ed2.comment('x', 'hello', true)
    ed2.uncomment('x', 'before')
    expect(ed2.hascomment('x', 'invalid' as any)).toBe(false)
  })

  it('save writes with comment options', () => {
    const p = path.join(os.tmpdir(), `ys2-${Date.now()}.yaml`)
    save(p, { a: 1 }, { a: 'top' })
    expect(fs.existsSync(p)).toBe(true)
    fs.rmSync(p, { force: true })
  })
  it('save without options writes raw yaml', () => {
    const p = path.join(os.tmpdir(), `ys3-${Date.now()}.yaml`)
    save(p, { a: 2 })
    expect(fs.existsSync(p)).toBe(true)
    fs.rmSync(p, { force: true })
  })

  it('has error path when document.hasIn throws', () => {
    const ed = new YamlEditor('a: 1')
    // @ts-ignore
    ed.document.hasIn = () => { throw new Error('has fail') }
    expect(ed.has('a')).toBe(false)
  })

  it('pusharr error path when contents manipulation throws', () => {
    const ed = new YamlEditor('a: 1')
    // @ts-ignore
    Object.defineProperty(ed.document, 'contents', {
      get () { throw new Error('contents fail') },
      set (_v) { throw new Error('set fail') },
    })
    expect(ed.pusharr('x')).toBe(false)
  })

  it('read.save success and error branch', () => {
    const p = path.join(os.tmpdir(), `ys-${Date.now()}.yaml`)
    fs.writeFileSync(p, 'x: 1')
    const data = read(p)
    const opt = { x: 'top' }
    expect(read.save && read.save(opt)).toBe(true)
    const jsonStr = JSON.stringify({ x: 'top' })
    expect(read.save && read.save(jsonStr)).toBe(true)
    const spy = jestSpyWrite()
    expect(read.save && read.save(opt)).toBe(false)
    spy.restore()
    fs.rmSync(p, { force: true })
  })

  it('applyComments catches editor.comment errors', () => {
    const ed = new YamlEditor('a: 1')
    const comments = { 'missing.key': { comment: 'x', type: 'top' as const } }
    applyComments(ed, comments)
    expect(true).toBe(true)
  })
})

function jestSpyWrite () {
  const orig = fs.writeFileSync
  // @ts-ignore
  fs.writeFileSync = (...args: any[]) => { throw new Error('fail') }
  return { restore: () => { fs.writeFileSync = orig } }
}
