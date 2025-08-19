import { errorHandler } from '../event/error'
import { getPluginLoader } from '../load'

/**
 * 初始化插件
 */
export const initPlugins = async () => {
  logger.info(logger.green('-----------'))
  logger.info('加载插件中...')

  await getPluginLoader().run()
  logger.info('插件加载完成')
  // /** 收集所有插件加载的Promise */
  // const allPromises: Promise<void>[] = []
  // /** 并发加载所有插件 */
  // const list = await getPlugins('all', true, false, true)
  // await Promise.all(list.map(async (pkg) => pkgLoads(pkg, allPromises)))

  // /** 等待所有Promise完成 */
  // await Promise.allSettled(allPromises)
  // /** 回收缓存 */
  // allPromises.length = 0

  // /** 排序 */
  // pkgSort()
  // /** 打印加载错误的插件 */
  errorHandler.printMissing()
  // logger.info('插件加载完成')

  // logger.info(`${logger.chalk.magentaBright('plugin')}: ${Object.keys(cache.index).length}`)
  // Object.keys(cache.count).forEach((v) => {
  //   if (v === 'handler') {
  //     const { key, fnc } = cache.count.handler
  //     logger.info(`${logger.chalk.magentaBright(v + '.key')} ${key}`)
  //     logger.info(`${logger.chalk.magentaBright(v + '.fnc')} ${fnc}`)
  //     return
  //   }
  //   logger.info(`${logger.chalk.magentaBright(v)}: ${cache.count[v as keyof typeof cache.count]}`)
  // })

  // logger.info(logger.green('-----------'))

  // setTimeout(() => {
  //   initPluginHmr()
  // }, 3 * 1000)
}
