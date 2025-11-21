import { describe, it, expect } from 'vitest'
import { isEqual, isSubPath } from './match'
import path from 'node:path'

describe('path/match', () => {
  it('isEqual compares normalized paths', () => {
    expect(isEqual('C:/Users/Admin', 'c:/Users/admin')).toBe(process.platform === 'win32')
    expect(isEqual('./folder', 'folder')).toBe(true)
    const url1 = 'file:///C:/temp/file.txt'
    const url2 = 'file://C:/temp/file.txt'
    expect(isEqual(url1, url2)).toBe(true)
    expect(isEqual('a/b', 'a/c')).toBe(false)
  })

  it('isEqual case-sensitive on non-win platform', () => {
    const original = Object.getOwnPropertyDescriptor(process, 'platform')
    // @ts-ignore
    Object.defineProperty(process, 'platform', { value: 'linux' })
    expect(isEqual('A/b', 'a/b')).toBe(false)
    if (original) Object.defineProperty(process, 'platform', original)
  })

  it('isSubPath detects subpath with resolve options', () => {
    const root = path.resolve('src')
    const child = path.resolve('src/utils')
    expect(isSubPath(root, child)).toBe(true)
    expect(isSubPath('src', 'src/utils', false)).toBe(true)
    expect(isSubPath(root, path.resolve('tests'))).toBe(false)
  })
})
