import path from 'node:path'
import chokidar from 'chokidar'
import { register } from '../register/register'
import { formatPath } from '@karinjs/utils'
import { getModuleType } from '@karinjs/envs'

import type { FSWatcher } from 'chokidar'

/**
 * 生产环境热重载监听器
 * @param list 要监听的目录列表
 * @returns 监听器实例
 */
export const hmrProduction = (list: string[]): FSWatcher | null => {
  const logger = global.logger.prefix('[hmr]')

  if (list.length === 0) {
    logger.info('没有需要监听的目录')
    return null
  }

  const exts = getModuleType()
  const watcher = chokidar.watch(list, {
    atomic: true,
    awaitWriteFinish: true,
    ignoreInitial: true,
    ignored: (file, stats) => {
      if (!stats?.isFile()) {
        return true
      }
      return !exts.includes(path.extname(file))
    },
  })

  watcher.on('all', async (event, file) => {
    logger.debug(`watch: ${event}, file: ${file}`)

    if (event === 'add') {
      await register.loadApp(file)
      return logger.info(`add: ${formatPath(file, { type: 'rel' })}`)
    }

    if (event === 'unlink') {
      register.unregisterApp(file)
      return logger.info(`unlink: ${formatPath(file, { type: 'rel' })}`)
    }

    if (event === 'change') {
      register.unregisterApp(file)
      await register.loadApp(file, true)
      return logger.info(`change: ${formatPath(file, { type: 'rel' })}`)
    }
  })

  logger.info(`正在监听:\n${list.map(p => formatPath(p, { type: 'rel' })).join('\n')}`)
  return watcher
}
