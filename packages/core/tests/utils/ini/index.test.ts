import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { ini, createINIParser } from '@/utils/ini/index'

let tmpDir: string

beforeAll(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'karin-ini-test-'))
})

afterAll(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true })
})

describe('utils/ini — read', () => {
  it('returns an empty object when the file does not exist', () => {
    const missing = path.join(tmpDir, 'no-such-file.ini')
    expect(ini.read(missing)).toEqual({})
  })

  it('parses key=value pairs and ignores comments and blanks', () => {
    const file = path.join(tmpDir, 'sample.ini')
    fs.writeFileSync(
      file,
      [
        '# comment',
        '; another comment',
        '',
        'registry=https://registry.npmjs.org/',
        '  store-dir = /opt/store  ',
        'empty-value=',
        'bad-line-without-equals',
      ].join('\n'),
    )
    const parsed = ini.read(file)
    expect(parsed.registry).toBe('https://registry.npmjs.org/')
    expect(parsed['store-dir']).toBe('/opt/store')
    expect(parsed['empty-value']).toBe('')
    expect(parsed).not.toHaveProperty('bad-line-without-equals')
  })
})

describe('utils/ini — write', () => {
  it('writes and round-trips key=value content', () => {
    const file = path.join(tmpDir, 'out.ini')
    const data = { foo: 'bar', baz: '1' }
    expect(ini.write(data, file)).toBe(true)
    expect(ini.read(file)).toEqual(data)
  })

  it('creates intermediate directories', () => {
    const file = path.join(tmpDir, 'nested', 'deep', 'file.ini')
    expect(ini.write({ a: 'b' }, file)).toBe(true)
    expect(fs.existsSync(file)).toBe(true)
    expect(ini.read(file)).toEqual({ a: 'b' })
  })
})

describe('utils/ini — createINIParser', () => {
  it('factory produces a parser with read/write', () => {
    const parser = createINIParser()
    expect(typeof parser.read).toBe('function')
    expect(typeof parser.write).toBe('function')
  })
})
