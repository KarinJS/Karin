import { describe, it, expect } from 'vitest'
import { getCaller } from './stack'

describe('system/stack more branches', () => {
  it('fails when stack too short', () => {
    const err = new Error()
    Object.assign(err, { stack: ['Error: x'].join('\n') })
    expect(() => getCaller('file:///C:/project/src/index.ts', err)).toThrow()
  })

  it('fails when filtered paths empty', () => {
    const base = 'file:///C:/project/src/index.ts'
    const err = new Error()
    Object.assign(err, {
      stack: [
        'Error: test',
        '    at Object.<anonymous> (file:///C:/project/src/index.ts:1:1)'
      ].join('\n')
    })
    expect(() => getCaller(base, err)).toThrow()
  })

  it('fails when caller empty', () => {
    const base = 'file:///C:/project/src/index.ts'
    const err = new Error()
    Object.assign(err, {
      stack: [
        'Error: test',
        '    at Object.<anonymous> (file:///C:/project/src/index.ts:1:1)',
        '    at Module.run (node:internal:fs:2:2)'
      ].join('\n')
    })
    expect(() => getCaller(base, err)).toThrow()
  })
})
