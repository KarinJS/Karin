// 基本模块
import './core/init'
import config from './utils/config'
import logger from './utils/logger'

// 核心模块
import listener from './core/listener'
import server from './core/server'
import Plugin from './core/plugin'
import PluginLoader from './core/plugin.loader'

// 工具类
import common from './utils/common'
import segment from './utils/segment'
import handler from './utils/handler'
import ffmpeg from './utils/ffmpeg'
import exec from './utils/exec'
import button from './utils/button'
import update from './utils/update'
import YamlEditor from './utils/YamlEditor'
import render from './renderer/app'
import { KarinMessage } from './event/message'

// 适配器
import Puppeteer from './renderer/server'
import OneBot11 from './adapter/onebot/onebot11'

// 数据库
import level from './db/level'
import Redis from './db/redis'
import { RedisClientType } from 'redis'

// proto
import { kritor } from 'kritor-proto'

// 初始化
server.init()
const redis: RedisClientType = (await new Redis().start()) as RedisClientType
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
  KarinMessage,
}
