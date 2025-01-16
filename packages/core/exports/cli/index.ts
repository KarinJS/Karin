#!/usr/bin/env node

import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { pm2 } from './pm2'
import { init } from './init'
import { start } from './start'
import { updateAll } from './update'
import { program } from 'commander'
import type { Command } from 'commander'

/** 讨厌的报错 */
if (!process.argv?.[2]) process.argv.push('-h')

/**
 * @description 添加环境变量文件选项
 * @example
 * ```bash
 * karin start -e .env.dev
 * karin start --env .env.dev,.env.local
 * ```
 */
const addEnvOption = (command: Command) => {
  return command.option('-e, --env <files>', '指定环境变量文件，多个文件用逗号分隔')
}

/** 获取版本号 */
const getVersion = () => {
  try {
    const file = fileURLToPath(new URL('../../package.json', import.meta.url))
    const packageJson = JSON.parse(fs.readFileSync(file, 'utf-8'))
    return packageJson.version
  } catch {
    return 'unknown'
  }
}

program.version(getVersion(), '-v, --version', '显示版本号')
program.command('pm2').description('后台运行').action(pm2.start)
program.command('stop').description('停止后台运行').action(pm2.stop)
program.command('rs').description('重启pm2服务').action(pm2.restart)
program.command('log').description('查看日志').action(pm2.log)
program.command('up').description('更新插件').action(updateAll)
program.command('init').description('初始化项目').action(init)

addEnvOption(program.command('.').description('前台启动')).action(
  (options: { env: string | undefined }) => start(options.env),
)
addEnvOption(program.command('app').description('前台启动')).action(
  (options: { env: string | undefined }) => start(options.env),
)
addEnvOption(program.command('start').description('前台启动'))

program.parse(process.argv)
