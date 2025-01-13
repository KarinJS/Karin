#!/usr/bin/env node

import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { pm2 } from './pm2'
import { init } from './init'
import { dev, start, tsStart, tsWatch } from './start'
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
  if (process.env.npm_package_version) return process.env.npm_package_version

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

addEnvOption(program.command('.').description('前台启动'))
  .action((options: { env: string | undefined }) => start(options.env))
addEnvOption(program.command('app').description('前台启动'))
  .action((options: { env: string | undefined }) => start(options.env))
addEnvOption(program.command('start').description('前台启动'))
  .action((options: { env: string | undefined }) => start(options.env))
addEnvOption(program.command('dev').description('JavaScript开发模式'))
  .action((options: { env: string | undefined }) => dev(options.env))
addEnvOption(
  program.command('ts')
    .description('TypeScript开发模式')
    .addHelpText('after', `
示例:
  $ karin ts                     # 使用默认 .env 文件启动
  $ karin ts -e .env.dev        # 使用指定的环境变量文件启动
  $ karin ts -e .env.dev,.env.local  # 使用多个环境变量文件启动
`)
)
  .action((options: { env: string | undefined }) => tsStart(options.env))

addEnvOption(
  program.command('watch')
    .description('TypeScript监视模式')
    .option('--include <patterns>', '添加要监视的文件/目录，多个用逗号分隔')
    .option('--exclude <patterns>', '排除要监视的文件/目录，多个用逗号分隔')
    .option('--clear-screen', '重新运行时是否清屏', true)
    .addHelpText('after', `
示例:
  $ karin watch                  # 默认监视模式
  $ karin watch --include src   # 监视 src 目录
  $ karin watch --exclude node_modules,dist  # 排除指定目录
  $ karin watch --no-clear-screen # 禁用清屏
`)
)
  .action((options: {
    env: string | undefined
    include?: string
    exclude?: string
    clearScreen: boolean
  }) => tsWatch(options))

program.parse(process.argv)
