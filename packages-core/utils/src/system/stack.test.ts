import { describe, it, expect } from 'vitest'
import { getCaller } from './stack'

describe('system/stack getCaller', () => {
  it('throws when no url', () => {
    expect(() => getCaller('' as any)).toThrow()
  })
  it('parses stack and returns first caller', () => {
    const err = new Error()
    Object.assign(err, {
      stack: [
        'Error: test',
        '    at Object.<anonymous> (file:///C:/project/src/index.ts:1:1)',
        '    at Module.run (file:///C:/project/src/caller.ts:2:2)'
      ].join('\n')
    })
    const caller = getCaller('file:///C:/project/src/index.ts', err)
    expect(caller.endsWith('/caller.ts')).toBe(true)
  })
})