// 基本模块
export * from 'kritor-proto'
export * from 'karin/core/index'
export * from 'karin/event/index'
export * from 'karin/db/index'
export * from 'karin/renderer/index'
export * from 'karin/utils/index'
export * from 'karin/types/index'

import { config, update } from 'karin/utils/index'
import { render } from 'karin/renderer/index'
import { RenderServer } from 'karin/renderer/index'
import OneBot11 from 'karin/adapter/onebot/onebot11'
import { server, Karin, PluginLoader, listener, Plugin } from 'karin/core/index'

// 初始化
server.init()
PluginLoader.load()
listener.emit('adapter', RenderServer)
listener.emit('adapter', OneBot11)

/**
 * @description 即将废弃，请使用 `Plugin`
*/
export const plugin = Plugin
/**
 * @description 即将废弃，请使用 `render`
*/
export const Renderer = render

export const Cfg = config
export const Bot = listener
export const Update = update

export const karin = new Karin()
export default karin
