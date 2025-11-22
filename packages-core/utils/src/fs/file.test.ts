import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { readFile, writeFile, copyFiles, copyFilesSync } from './file'

describe('fs/file', () => {
  it('read and write file async', async () => {
    const p = path.join(os.tmpdir(), `fs-${Date.now()}.txt`)
    await writeFile(p, 'hello')
    const s = await readFile(p)
    expect(s).toBe('hello')
    fs.rmSync(p, { force: true })
  })

  it('copyFiles and copyFilesSync only when target not exists', async () => {
    const src = fs.mkdtempSync(path.join(os.tmpdir(), 'src-'))
    const dst = fs.mkdtempSync(path.join(os.tmpdir(), 'dst-'))
    fs.writeFileSync(path.join(src, 'a.json'), '{}')
    fs.writeFileSync(path.join(src, 'b.yaml'), 'k: v')
    await copyFiles(['a.json','b.yaml'], src, dst)
    expect(fs.existsSync(path.join(dst, 'a.json'))).toBe(true)
    copyFilesSync(['a.json','b.yaml'], src, dst)
    fs.rmSync(src, { recursive: true, force: true })
    fs.rmSync(dst, { recursive: true, force: true })
  })
})