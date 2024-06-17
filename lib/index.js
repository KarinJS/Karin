import Redis from './db/redis.js'
import LevelDB from './db/level.js'
import Logger from './core/logger.js'
import Config from './core/config.js'
import Server from './core/server.js'
import { exec } from './utils/exec.js'
import Common from './common/common.js'
import Process from './core/process.js'
import Listener from './core/listener.js'
import Puppeteer from './renderer/Server.js'
import Kritor from './adapter/kritor/index.js'
import RenderClient from './renderer/Client.js'
import onebot11, { OneBot11 } from './adapter/onebot/OneBot11.js'
import App from './utils/app.js'
import Button from './utils/button.js'
import Ffmpeg from './utils/ffmpeg.js'
import Handler from './utils/handler.js'
import { KarinMessage } from './bot/KarinMessage.js'
import { KarinAdapter as adapter } from './adapter/adapter.js'
import Update from './utils/update.js'
import YamlEditor from './utils/YamlEditor.js'
import { kritor } from 'kritor-proto'
import render from './renderer/App.js'
import RenderBase from './renderer/Base.js'
import * as protobuf from './utils/protobuf.js'
import plugin from './plugins/plugin.js'
import Segment from './utils/segment.js'
import Message from './event/message.js'
import Notice from './event/notice.js'
import Request from './event/request.js'
import Online from './core/online.js'

export const common = new Common()
export const config = new Config()
export const segment = new Segment()
export const button = new Button()
export const handler = new Handler()
export const update = new Update()

/**
 * @type {boolean} 是否为开发者模式
 */
process.env.KarinDev = !!process.argv[2]?.includes('dev')
const isDev = process.env.KarinMode === 'dev' ? '[开发模式]' : '[生产模式]'

/**
 * 日志模块初始化
 */
export const logger = new Logger().config(config).logger()

/**
 * 全局变量
 */
global.logger = logger
logger.debug(`[初始化]${isDev} 日志模块初始化完成 (1/10)`)

/**
 * 监听器初始化
 */
export const listener = new Listener(logger, common, config, segment)
export const Bot = listener
logger.debug(`[初始化]${isDev} 监听器初始化完成 (2/10)`)

/**
 * 进程初始化
 */
const Proces = await new Process(logger, common, config, listener).process().check()
logger.debug(`[初始化]${isDev} 进程初始化完成 (3/10)`)

/**
 * 适配器初始化
 */
listener.emit('adapter', onebot11)
listener.emit('adapter', Puppeteer)
listener.emit('adapter', { type: 'grpc', adapter: undefined, path: 'http://' + config.Server.grpc.host })
logger.debug(`[初始化]${isDev} 适配器初始化完成 (4/10)`)

/**
 * 服务器初始化
 */
new Kritor(logger, common, config, listener).init()
new Server(logger, common, config, listener, exec).init()
logger.debug(`[初始化]${isDev} 服务器初始化完成 (5/10)`)

/**
 * 主动适配器初始化
 */
const Onebot11 = config.Server.websocket.OneBot11Host
if (Array.isArray(Onebot11) && Onebot11.length) {
  for (const url of Onebot11) {
    new OneBot11(logger, common, listener, config).client(url)
  }
}
const renderCfg = config.Server.websocket.render
if (Array.isArray(renderCfg) && renderCfg.length) {
  for (const url of renderCfg) {
    new RenderClient(url).start()
  }
}
logger.debug(`[初始化]${isDev} 主动适配器初始化完成 (6/10)`)

/**
 * 数据库驱动器初始化
 */
export const level = new LevelDB()
export const redis = await new Redis(logger, config).start()
// eslint-disable-next-line no-unused-vars
let online = new Online(level, segment, listener)
setTimeout(() => { online = null }, 60000)
logger.debug(`[初始化]${isDev} 数据库驱动器初始化完成 (7/10)`)

/**
 * 辅助工具初始化
 */

export const ffmpeg = await Ffmpeg(logger, config)
export { kritor, plugin, protobuf, YamlEditor, RenderBase, exec, App, KarinMessage, adapter, render, render as Renderer, update as Update, config as Cfg, plugin as Plugin, Proces as Process }
logger.debug(`[初始化]${isDev} 辅助工具初始化完成 (8/10)`)

/**
 * 插件初始化
 */
listener.emit('plugin')
logger.debug(`[初始化]${isDev} 插件初始化完成 (9/10)`)

/**
 * 初始化完毕开始监听事件
 */
listener.on('message', data => new Message(data))
listener.on('notice', data => new Notice(data))
listener.on('request', data => new Request(data))
logger.debug(`[初始化]${isDev} 事件监听初始化完成 (10/10)`)
