import { describe, it, expect, vi } from 'vitest'
import { split, getPackageName, urlToPath } from './parse'

describe('path/parse', () => {
  it('split returns dirname and basename', () => {
    expect(split('C:/Users/admin/file.txt')).toEqual({ dirname: 'C:/Users/admin', basename: 'file.txt' })
  })

  it('getPackageName handles normal and scoped packages', () => {
    expect(getPackageName('/project/node_modules/lodash/index.js')).toBe('lodash')
    expect(getPackageName('/project/node_modules/@karinjs/utils/index.js')).toBe('@karinjs/utils')
    expect(getPackageName('/project/src/index.ts')).toBeNull()
    expect(getPackageName('/project/node_modules/@scope/')).toBeNull()
    expect(getPackageName('/project/node_modules/')).toBeNull()
  })

  it('urlToPath computes up-levels from cwd', () => {
    const spy = vi.spyOn(process, 'cwd').mockReturnValue('C:/project')
    const url = 'file:///C:/project/src/utils/file.ts'
    const res = urlToPath(url)
    expect(res).toBe('../../')
    spy.mockRestore()
  })
})
