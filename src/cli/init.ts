#!/usr/bin/env node

import { KarinCfgInit } from '../core/init/config'

/**
 * 休眠函数
 * @param ms 毫秒
 */
function sleep (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main () {
  /** 捕获错误 打印日志 */
  process.on('uncaughtException', err => console.error(err))
  process.on('unhandledRejection', err => console.error(err))

  const init = new KarinCfgInit()
  init.init()

  await sleep(1000)

  const pkg = init.getRegistry()

  /** 结果 */
  await init.install(pkg)
}
main().then(() => process.exit(0)).catch(() => process.exit(0))
