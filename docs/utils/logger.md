# logger

```js
import { logger } from '#Karin'

/** 打印trace日志 */
logger.trace('这是一条trace日志')
/** 打印debug日志 */
logger.debug('这是一条debug日志')
/** 打印info日志 */
logger.info('这是一条info日志')
/** 打印warn日志 */
logger.warn('这是一条warn日志')
/** 打印mark日志 */
logger.mark('这是一条mark日志')
/** 打印error日志 */
logger.error('这是一条error日志')
/** 打印fatal日志 */
logger.fatal('这是一条fatal日志')

// 其中 logger还提供了打印不同颜色日志的方法

/** 打印红色日志 */
logger.info(logger.red('这是一条红色的info日志'))
/** 打印绿色日志 */
logger.info(logger.green('这是一条绿色的info日志'))
/** 打印黄色日志 */
logger.info(logger.yellow('这是一条黄色的info日志'))
/** 打印蓝色日志 */
logger.info(logger.blue('这是一条蓝色的info日志'))
/** 打印品红色日志 */
logger.info(logger.magenta('这是一条品红色的info日志'))
/** 打印青色日志 */
logger.info(logger.cyan('这是一条青色的info日志'))
/** 打印白色日志 */
logger.info(logger.white('这是一条白色的info日志'))
/** 打印灰色日志 */
logger.info(logger.chalk.gray('这是一条灰色的info日志'))
/** 打印淡紫色日志 */
logger.info(logger.violet('这是一条淡紫色的info日志'))

// 当以上方法无法满足你的需求时，你可以使用 chalk 库来自定义颜色
logger.info(logger.chalk.hex('#FF0000')('这是一条自定义颜色的info日志'))

```
