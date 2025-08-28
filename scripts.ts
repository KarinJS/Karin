#! /usr/bin/env node

/**
 * pnpm run pkg "key" "value"
 */
import fs from 'node:fs'
import { exec } from 'node:child_process'
import { promisify } from 'node:util'

const execAsync = promisify(exec)

const [key, value] = process.argv.slice(2)

if (!key || !value) {
  console.error('pnpm run pkg "key" "value"')
  process.exit(1)
}

/**
 * 给packages下的每个package.json添加key和value
 */
const packages = fs.readdirSync('./packages')

await Promise.all(packages.map(async (pkg) => {
  const cwd = `./packages/${pkg}`
  const dir = `${cwd}/package.json`
  if (!fs.existsSync(dir)) return

  const packageJson = fs.readFileSync(dir, 'utf-8')
  const json = JSON.parse(packageJson)
  if (!json.scripts) json.scripts = {}
  json.scripts[key] = value
  fs.writeFileSync(dir, JSON.stringify(json, null, 2))
  await execAsync('npx sort-package-json', {
    cwd,
  })
}))
