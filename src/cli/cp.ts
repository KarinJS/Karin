#!/usr/bin/env node

import fs from 'node:fs'

const root = './src/core/env/env.d.ts'
const target = './lib/global.d.ts'
fs.copyFileSync(root, target)
