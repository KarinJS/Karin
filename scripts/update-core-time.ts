import { execFileSync } from 'node:child_process'
import fs from 'node:fs'

const corePackageFile = 'packages/core/package.json'

const watchPrefixes = [
  'packages/web/',
  'packages/cli-Internal/',
  'packages/onebot/',
  'packages/pm2/',
  '.github/workflows/',
]

const stagedFiles = execFileSync('git', ['diff', '--cached', '--name-only'], {
  encoding: 'utf8',
})
  .split(/\r?\n/)
  .filter(Boolean)

const shouldUpdate = stagedFiles.some(file => watchPrefixes.some(prefix => file.startsWith(prefix)))

if (!shouldUpdate) process.exit(0)

const pkg = JSON.parse(fs.readFileSync(corePackageFile, 'utf8'))
pkg.time = new Date().toISOString()

fs.writeFileSync(corePackageFile, `${JSON.stringify(pkg, null, 2)}\n`)
execFileSync('git', ['add', corePackageFile], { stdio: 'inherit' })
