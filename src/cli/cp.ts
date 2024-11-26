#!/usr/bin/env node

import fs from 'node:fs'

const root = './src/global.d.ts'
const target = './lib/global.d.ts'

const content = fs.readFileSync(root, 'utf-8')
const newContent = content.replace(/declare global {[\s\S]*?}/ms, ''.trim())
fs.writeFileSync(target, newContent)

if (process.argv[2] === 'types') {
  /** 修改包名为单独的声明文件 */
  const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
  pkg.name = '@karinjs/types'
  fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2))
}
