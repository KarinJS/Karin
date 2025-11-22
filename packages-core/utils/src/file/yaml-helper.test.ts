import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { readYaml, readYamlSync, writeYaml, writeYamlSync } from './yaml-helper'

describe('file/yaml-helper', () => {
  it('read/write yaml async and sync', async () => {
    const p = path.join(os.tmpdir(), `y-${Date.now()}.yaml`)
    await writeYaml(p, { a: 1 })
    const r = await readYaml(p)
    expect(r).toEqual({ a: 1 })
    writeYamlSync(p, { b: 2 })
    const r2 = readYamlSync(p)
    expect(r2).toEqual({ b: 2 })
    fs.rmSync(p, { force: true })
  })

  it('read default value on error', async () => {
    const p = path.join(os.tmpdir(), `missing-${Date.now()}.yaml`)
    const r = await readYaml(p, { defaultValue: { x: 1 } })
    expect(r).toEqual({ x: 1 })
    const r2 = readYamlSync(p, { defaultValue: { y: 2 } })
    expect(r2).toEqual({ y: 2 })
  })
})