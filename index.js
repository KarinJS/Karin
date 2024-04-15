import Bot from './lib/config/index.js'
import logger from './lib/config/log.js'

/** 初始化Bot */
await Bot.start()
/** 全局变量logger */
global.logger = logger
