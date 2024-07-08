#!/usr/bin/env node

import fs from 'fs'
import yaml from 'yaml'
import path from 'path'
import { spawn } from 'child_process'

const cwd = process.cwd()
const _path = path.resolve(cwd + '/config/config/pm2.yaml')
const data = yaml.parse(fs.readFileSync(_path, 'utf8'))

const name = data.apps[0].name
const lines = data.lines || 1000
const cmd = process.platform === 'win32' ? 'pm2.cmd' : 'pm2'
spawn(cmd, ['logs', '--lines', lines, name], { stdio: 'inherit', shell: true, cwd })
