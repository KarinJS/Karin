import Bot from './bot/bot.js'
import App from './utils/app.js'
import level from './db/level.js'
import exec from './utils/exec.js'
import Cfg from './config/config.js'
import logger from './config/log.js'
import { kritor } from 'kritor-proto'
import ffmpeg from './utils/ffmpeg.js'
import Update from './utils/update.js'
import button from './utils/button.js'
import segment from './utils/segment.js'
import common from './common/common.js'
import plugin from './plugins/plugin.js'
import handler from './utils/handler.js'
import render from './renderer/App.js'
import RenderBase from './renderer/Base.js'
import YamlEditor from './utils/YamlEditor.js'
import * as protobuf from './utils/protobuf.js'
import { KarinMessage } from './bot/KarinMessage.js'
import { KarinAdapter as adapter } from './adapter/adapter.js'

/**
 * @type {import('../plugins/karin-driver-db/redis.js').RedisClientType}
 */
let redis = null
/**
 * @type {import('../plugins/karin-driver-db/sqlite3.js').default}
 */
let sqlite3 = null
/**
 * @type {import('../plugins/karin-driver-db/sequelize.js').default}
 */
let sequelize = null

async function importDB (name) {
  try {
    const db = await import(`../plugins/karin-driver-db/${name}.js`)
    return db.default
  } catch (error) {
    logger.debug(`加载数据库驱动失败：${logger.red(error)}`)
    return null
  }
}

redis = await importDB('redis') || null
sqlite3 = await importDB('sqlite3') || null
sequelize = await importDB('sequelize') || null

export {
  App,
  Bot,
  Cfg,
  common,
  logger,
  plugin,
  segment,
  render,
  render as Renderer,
  kritor,
  button,
  YamlEditor,
  Update,
  adapter,
  KarinMessage,
  exec,
  ffmpeg,
  handler,
  protobuf,
  RenderBase,
  level,
  redis,
  sqlite3,
  sequelize,
}
