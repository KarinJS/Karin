import { describe, it, expect, vi } from 'vitest'
import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs'
import { getNpmPackages, getNpmPackagesSync } from './file'

describe('npm/file fields=name coverage', () => {
  it('getNpmPackages fields name', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'npmf-name-'))
    const nm = path.join(dir, 'node_modules')
    fs.mkdirSync(nm)
    fs.mkdirSync(path.join(nm, 'express'))
    const spy = vi.spyOn(process, 'cwd').mockReturnValue(dir)
    const names = await getNpmPackages({ fields: 'name' })
    expect(names).toContain('express')
    spy.mockRestore()
    fs.rmSync(dir, { recursive: true, force: true })
  })

  it('getNpmPackagesSync fields name', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'npmf2-name-'))
    const nm = path.join(dir, 'node_modules')
    fs.mkdirSync(nm)
    fs.mkdirSync(path.join(nm, 'express'))
    const spy = vi.spyOn(process, 'cwd').mockReturnValue(dir)
    const names = getNpmPackagesSync({ fields: 'name' })
    expect(names).toContain('express')
    spy.mockRestore()
    fs.rmSync(dir, { recursive: true, force: true })
  })
})