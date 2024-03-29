import Bot from './bot/bot.js'
import App from './plugins/app.js'
import Cfg from './config/config.js'
import logger from './config/log.js'
import redis from './config/redis.js'
import segment from './bot/segment.js'
import common from './common/common.js'
import plugin from './plugins/plugin.js'
import renderer from './puppeteer/puppeteer.js'

export { App, Bot, Cfg, common, logger, plugin, redis, segment, renderer }
export default { App, Bot, Cfg, common, logger, plugin, redis, segment, renderer }
