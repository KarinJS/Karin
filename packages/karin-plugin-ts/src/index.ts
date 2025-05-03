import { dir } from './dir'
import { logger } from 'node-karin'

/** 请不要在这编写插件 不会有任何效果~ */
logger.info(`${logger.violet(`[插件:${dir.version}]`)} ${logger.green(dir.name)} 初始化完成~`)
