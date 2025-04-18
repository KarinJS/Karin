#!/usr/bin/env node

import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { pm2 } from './pm2'
import { init } from './init'
import { start } from './start'
import { updateAll } from './update'
import { program } from 'commander'

/** 讨厌的报错 */
if (!process.argv?.[2]) process.argv.push('-h')

/** 获取版本号 */
const getVersion = () => {
  try {
    /* @vite-ignore */
    const file = fileURLToPath(new URL('../../package.json', import.meta.url))
    const packageJson = JSON.parse(fs.readFileSync(file, 'utf-8'))
    return packageJson.version
  } catch {
    return 'unknown'
  }
}

program.version(getVersion(), '-v, --version', '显示版本号')
program.command('.').description('前台启动').action(start)
program.command('app').description('前台启动').action(start)
program.command('start').description('前台启动').action(start)
program.command('pm2').description('后台运行').action(pm2.start)
program.command('stop').description('停止后台服务').action(pm2.stop)
program.command('rs')
  .description('重启后台服务')
  .option('-f, --force', '强制重启')
  .action((options) => pm2.restart(options.force))

program.command('log').description('查看日志').action(pm2.log)

program.command('up')
  .description('更新插件')
  .option('-f, --force', '强制更新')
  .option('-s, --serial', '并发更新')
  .action((options) => updateAll(options.force, !options.serial))

program.command('init')
  .description('初始化项目')
  .option('-f, --force', '强制初始化')
  .option('-d, --dev', '开发模式')
  .action((options) => {
    process.env.NODE_ENV = 'development'
    process.env.KARIN_CLI = 'true'
    init(options.force)
  })

program.parse(process.argv)
