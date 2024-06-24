// 基本模块
import '../src/core/init'
import config from '../src/utils/config'
import logger from '../src/utils/logger'

// 核心模块
import listener from '../src/core/listener'
import server from '../src/core/server'
import Plugin from '../src/core/plugin'
import PluginLoader from '../src/core/plugin.loader'

// 工具类
import common from '../src/utils/common'
import segment from '../src/utils/segment'
import handler from '../src/utils/handler'
import ffmpeg from './utils/ffmpeg'
import exec from './utils/exec'
import button from './utils/button'
import update from './utils/update'
import YamlEditor from './utils/YamlEditor'
import render from './renderer/app'

// 适配器
import Puppeteer from '../src/renderer/server'
import OneBot11 from '../src/adapter/onebot/onebot11'

// 数据库
import level from './db/level'
import Redis from './db/redis'

// proto
import { kritor } from 'kritor-proto'

// 初始化
server.init()
const redis = await new Redis().start()
PluginLoader.load()
listener.emit('adapter', Puppeteer)
listener.emit('adapter', OneBot11)

// Exporting Modules
export {
  // 基本模块
  config,
  config as Cfg,
  common,
  listener,
  logger,
  Plugin,
  PluginLoader,
  server,
  Plugin as plugin,
  listener as Bot,
  segment,
  handler,
  ffmpeg,
  exec,
  button,
  level,
  redis,
  update,
  render,
  kritor,
  YamlEditor,
  render as Renderer,
  update as Update,
}
