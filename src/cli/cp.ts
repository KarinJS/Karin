import fs from 'node:fs'

const root = './src/global.d.ts'
const target = './lib/global.d.ts'
fs.copyFileSync(root, target)
