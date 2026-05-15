import { describe, it, expect } from 'vitest'
import path from 'node:path'
import {
  splitPath,
  getRelPath,
  formatPath,
  isPathEqual,
  isSubPath,
} from '@/utils/fs/path'

describe('utils/fs/path — splitPath', () => {
  it('returns the dirname and basename', () => {
    const filePath = path.join('foo', 'bar', 'file.txt')
    const { dirname, basename } = splitPath(filePath)
    expect(basename).toBe('file.txt')
    // dirname may have native separators stripped — just verify it doesn't include the basename
    expect(dirname).not.toContain('file.txt')
    expect(dirname.length).toBeGreaterThan(0)
  })
})

describe('utils/fs/path — getRelPath', () => {
  it('normalizes backslashes and strips ./ and trailing slashes', () => {
    expect(getRelPath('./plugins/karin-plugin-example/index.ts')).toBe(
      'plugins/karin-plugin-example/index.ts',
    )
    expect(getRelPath('.\\plugins\\karin-plugin-example\\index.ts')).toBe(
      'plugins/karin-plugin-example/index.ts',
    )
    expect(getRelPath('foo/bar/')).toBe('foo/bar')
  })
})

describe('utils/fs/path — formatPath', () => {
  it('returns an absolute path with forward slashes', () => {
    const result = formatPath('./foo/bar')
    expect(path.isAbsolute(result)).toBe(true)
    expect(result).not.toContain('\\')
  })
})

describe('utils/fs/path — isPathEqual', () => {
  it('returns true for identical strings', () => {
    expect(isPathEqual('foo/bar', 'foo/bar')).toBe(true)
  })

  it('compares paths after normalization', () => {
    expect(isPathEqual('./foo/bar', 'foo/bar')).toBe(true)
  })

  it('is case-insensitive on Windows, case-sensitive elsewhere', () => {
    const result = isPathEqual('FOO/BAR', 'foo/bar')
    if (process.platform === 'win32') {
      expect(result).toBe(true)
    } else {
      expect(result).toBe(false)
    }
  })
})

describe('utils/fs/path — isSubPath', () => {
  it('returns truthy for paths under the root', () => {
    expect(isSubPath(process.cwd(), path.join(process.cwd(), 'a', 'b'))).toBeTruthy()
  })

  it('returns falsy for paths outside the root', () => {
    expect(isSubPath(path.join(process.cwd(), 'a'), path.join(process.cwd(), 'b'))).toBeFalsy()
  })

  it('returns falsy when target equals root (relative is empty)', () => {
    expect(isSubPath(process.cwd(), process.cwd())).toBeFalsy()
  })
})
