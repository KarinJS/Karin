import '../src/core/init'
import listener from '../src/core/listener'
import logger from '../src/utils/logger'
import common from '../src/utils/common'
import config from '../src/utils/config'
import server from '../src/core/server'
import Plugin from '../src/core/plugin'
import PluginLoader from '../src/core/plugin.loader'
import segment from '../src/utils/segment'
import render from '../src/renderer/app'
import Puppeteer from '../src/renderer/server'
import OneBot11 from '../src/adapter/onebot/onebot11'

server.init()
PluginLoader.load()
const redis = {}
logger.error('KarinBot v' + JSON.stringify(config.package) + ' 启动中...')
listener.emit('adapter', Puppeteer)
listener.emit('adapter', OneBot11)

export {
  common,
  listener,
  logger,
  Plugin,
  PluginLoader,
  server,
  Plugin as plugin,
  listener as Bot,
  segment,
  render,
  render as Renderer,
  redis,
}
