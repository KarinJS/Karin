import { describe, it, expect } from 'vitest'
import { format, resolve as resolvePath, relative, normalize } from './format'
import path from 'node:path'

describe('path/format', () => {
  it('format returns abs by default', () => {
    const p = format('C:/Users/admin/project/../file.txt')
    expect(p.endsWith('/Users/admin/file.txt')).toBe(true)
  })

  it('format supports type rel and fileURL', () => {
    const rel = format('./file.txt', { type: 'rel' })
    expect(rel).toBe('file.txt')
    const url = format('./file.txt', { type: 'fileURL' })
    expect(url.startsWith('file://')).toBe(true)
  })

  it('format with custom cwd', () => {
    const p = format('./file.txt', { type: 'abs', cwd: 'C:/custom/dir' })
    expect(p).toBe('C:/custom/dir/file.txt')
  })

  it('resolve adds prefix optionally', () => {
    const abs = resolvePath('./src/index.ts')
    expect(abs.includes('/src/index.ts')).toBe(true)
    const url = resolvePath('./src/index.ts', true)
    expect(url.startsWith('file://')).toBe(true)
  })

  it('relative cleans dot prefixes and trailing slashes', () => {
    expect(relative('./plugins/example/')).toBe('plugins/example')
    expect(relative('\\a\\b\\')).toBe('/a/b')
  })

  it('normalize converts backslashes to slashes', () => {
    const n = normalize('C\\Users\\..\\admin\\file.txt')
    expect(n.includes('C/')).toBe(true)
  })

  it('format falls back on unknown type', () => {
    const p = format('./x.txt', { type: 'unknown' as any })
    expect(p.endsWith('/x.txt')).toBe(true)
  })
})
