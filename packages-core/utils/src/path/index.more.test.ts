import { describe, it, expect, vi } from 'vitest'
import path from 'node:path'
import { filesByExt, formatFileURL, formatPath } from './index'
import fs from 'node:fs'
import os from 'node:os'

describe('path/index extra branches', () => {
  it('filesByExt recursive with name forces abs path', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'fx-'))
    fs.mkdirSync(path.join(dir, 'sub'))
    fs.writeFileSync(path.join(dir, 'sub', 'a.ts'), 'x')
    const res = filesByExt(dir, 'ts', 'name', true)
    expect(res.every(p => path.isAbsolute(p))).toBe(true)
    fs.rmSync(dir, { recursive: true, force: true })
  })

  it('formatFileURL keeps file prefix', () => {
    const u = formatFileURL('file:///C:/Users/a.txt')
    expect(u.startsWith('file:///')).toBe(true)
  })

  it('formatPath rel returns dot on empty', () => {
    const spy = vi.spyOn(process, 'cwd').mockReturnValue('C:/project')
    const p = formatPath('', { type: 'rel', cwd: 'C:/project' })
    expect(p).toBe('.')
    spy.mockRestore()
  })
})
