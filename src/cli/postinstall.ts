#!/usr/bin/env node

import fs from 'fs'
import { KarinInit } from 'karin/utils/init'

async function main () {
  /** 捕获错误 打印日志 */
  process.on('uncaughtException', err => console.error(err))
  process.on('unhandledRejection', err => console.error(err))

  /** 在src目录说明为开发环境 不执行任何初始化操作 */
  if (fs.existsSync('./src')) return

  const init = new KarinInit()
  init.init()

  /** 判断锁文件 优先度: pnpm > yarn > cnpm > npm */
  let pkg: 'pnpm' | 'yarn' | 'cnpm' | 'npm'
  if (fs.existsSync('pnpm-lock.yaml')) {
    pkg = 'pnpm'
  } else if (fs.existsSync('yarn.lock')) {
    pkg = 'yarn'
  } else if (fs.existsSync('cnpm-lock.yaml')) {
    pkg = 'cnpm'
  } else {
    pkg = 'npm'
  }

  await init.install(pkg)
}
main().then(() => process.exit(0)).catch(() => process.exit(0))
