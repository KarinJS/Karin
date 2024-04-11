import Bot from './bot/bot.js'
import App from './plugins/app.js'
import Cfg from './config/config.js'
import logger from './config/log.js'
import redis from './config/redis.js'
import segment from './bot/segment.js'
import common from './common/common.js'
import plugin from './plugins/plugin.js'
import Renderer from './Renderer/Renderer.js'
import { kritor } from './adapter/kritor/protos/compiled.js'

export { App, Bot, Cfg, common, logger, plugin, redis, segment, Renderer, kritor }
export default { App, Bot, Cfg, common, logger, plugin, redis, segment, Renderer, kritor }
