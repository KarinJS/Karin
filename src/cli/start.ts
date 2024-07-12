#!/usr/bin/env node

import fs from 'fs'
import { execSync } from 'child_process'
import { karinDir } from 'karin/core/dir'

let config = process.cwd() + '/config/config/pm2.yaml'
if (!fs.existsSync(config)) {
  config = `${karinDir}/config/config/pm2.yaml`
}

const cmd = `pm2 start ${config}`
execSync(cmd, { stdio: 'inherit', cwd: process.cwd(), env: process.env })
