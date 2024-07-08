#!/usr/bin/env node

import { select } from '@inquirer/prompts'
import { KarinInit } from 'karin/utils/init'

async function main () {
  /** 捕获错误 打印日志 */
  process.on('uncaughtException', err => console.error(err))
  process.on('unhandledRejection', err => console.error(err))

  const init = new KarinInit()
  init.init()

  const prompt = await select({
    message: '请选择npm源 中国大陆服务器一定要更换!!!',
    choices: [
      { name: '淘宝源(推荐)', value: 'https://registry.npmmirror.com' },
      { name: '官方源', value: 'https://registry.npmjs.org' },
    ],
  })

  /** 结果 */
  await init.changeRegistry(prompt)

  const pkg = await select({
    message: '请选择包管理器 如果不知道怎么选 请选pnpm',
    choices: [
      { name: 'pnpm', value: 'pnpm' },
      { name: 'yarn', value: 'yarn' },
    ],
  }) as 'pnpm' | 'yarn'

  /** 结果 */
  await init.install(pkg)
}
main().then(() => process.exit(0)).catch(() => process.exit(0))
