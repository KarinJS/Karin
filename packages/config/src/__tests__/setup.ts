import fs from 'node:fs'
import path from 'node:path'

process.env.NODE_ENV = 'test'

const tmpRoot = path.join(process.cwd(), '.tmp-test')
const tmpConfig = path.join(tmpRoot, 'config')
const tmpPlugin = path.join(tmpRoot, 'plugin')

try { fs.mkdirSync(tmpConfig, { recursive: true }) } catch {}
// do not pre-create plugin dir to avoid EPERM on Windows in CI

// @ts-ignore
globalThis.__TEST_DIRS__ = { tmpRoot, tmpConfig, tmpPlugin }

// @ts-ignore
globalThis.logger = {
  ...console,
  level: 'info',
  mark: (...args: any[]) => console.log(...args),
  debug: (...args: any[]) => console.log(...args),
  error: (...args: any[]) => console.error(...args),
}

console.log('测试环境已初始化')