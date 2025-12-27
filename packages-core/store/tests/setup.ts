import fs from 'node:fs'
import path from 'node:path'

const root = path.join(process.cwd(), '.tmp-test')
try { fs.rmSync(root, { recursive: true, force: true }) } catch {}
fs.mkdirSync(root, { recursive: true })

;(globalThis as any).__TEST_DIRS__ = {
  tmpRoot: root,
  tmpBase: path.join(root, 'base'),
}

console.log('store 测试环境已初始化')
