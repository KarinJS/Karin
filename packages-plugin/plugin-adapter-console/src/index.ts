import pkg from '../package.json'
import { AdapterConsole } from './core'
import { registerBot } from '@karinjs/bot'

import type { } from '@karinjs/logger'

export const KARIN_ADAPTER_RUN = async () => {
  const name = pkg.name
  logger.debug(`${name} 开始加载...`)

  const consoleAdapter = AdapterConsole.getInstance()
  await consoleAdapter.init()
  registerBot('other', consoleAdapter)
  logger.debug(`${name} 加载完成~`)
}
