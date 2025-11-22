import { describe, it, expect, vi } from 'vitest'
import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs'
import { getNpmPackages, getNpmPackagesSync } from './file'

describe('npm/file fields branches', () => {
  it('getNpmPackages fields string abs/rel normalize slashes', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'nm-'))
    const nodeModules = path.join(dir, 'node_modules')
    fs.mkdirSync(nodeModules)
    fs.mkdirSync(path.join(nodeModules, 'express'))
    const spy = vi.spyOn(process, 'cwd').mockReturnValue(dir)
    const abs = await getNpmPackages({ fields: 'abs' })
    const rel = await getNpmPackages({ fields: 'rel' })
    expect(abs[0].includes('/')).toBe(true)
    expect(rel[0].includes('/')).toBe(true)
    spy.mockRestore()
    fs.rmSync(dir, { recursive: true, force: true })
  })

  it('getNpmPackagesSync fields array abs/rel normalize slashes', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'nms-'))
    const nodeModules = path.join(dir, 'node_modules')
    fs.mkdirSync(nodeModules)
    fs.mkdirSync(path.join(nodeModules, 'express'))
    const spy = vi.spyOn(process, 'cwd').mockReturnValue(dir)
    const list = getNpmPackagesSync({ fields: ['name','abs','rel'] })
    expect(list[0].abs!.includes('/')).toBe(true)
    expect(list[0].rel!.includes('/')).toBe(true)
    spy.mockRestore()
    fs.rmSync(dir, { recursive: true, force: true })
  })
})
