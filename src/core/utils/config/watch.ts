import util from 'node:util'
import chokidar from 'chokidar'
import { cache } from './cache'
import { clearRequireFile } from '../fs/require'
import { configPath } from '../fs/root'
import { listeners } from '@/internal/listeners'

/**
 * 监听文件变动
 * @param file 文件路径
 * @param fn 文件变动后调用的函数
 */
export const watch = (file: string, fn: Function) => {
  /** 检查此文件是否已有监听器 已有则先将原来的停止 */
  const isWatch = cache.watcher.get(file)
  if (isWatch) {
    isWatch.close()
    cache.watcher.delete(file)
  }

  /** 新的监听 */
  const watcher = chokidar.watch(file)
  /** 缓存监听器 */
  cache.watcher.set(file, watcher)
  /** 监听文件变动 */
  watcher.on('change', async () => {
    const result = fn(file)
    if (util.types.isPromise(result)) {
      const res = await result
      if (res === true) clearRequireFile(file)
      return
    }
    if (result === true) clearRequireFile(file)
    if (file === `${configPath}/config.yaml`) {
      listeners.emit('update:logger:level')
    }
  })

  /** 如果watcher被关闭 则当前实例移除全部监听器并清理watcherMap中的缓存 */
  watcher.once('close', () => {
    watcher.removeAllListeners()
    cache.watcher.delete(file)
  })
  return watcher
}
