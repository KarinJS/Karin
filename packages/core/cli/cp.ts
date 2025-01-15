#!/usr/bin/env node

import fs from 'node:fs'

const root = './src/global.d.ts'
const target = './lib/global.d.ts'

const content = fs.readFileSync(root, 'utf-8')
const newContent = content.replace(/declare global {[\s\S]*?}/ms, ''.trim())
fs.writeFileSync(target, newContent)
