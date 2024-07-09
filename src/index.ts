/// <reference types="@types/express" />
/// <reference types="@types/lodash" />
/// <reference types="@types/node" />
/// <reference types="@types/node-schedule" />
/// <reference types="@types/ws" />

// 基本模块
export * from 'kritor-proto'
export * from 'karin/core'
export * from 'karin/event'
export * from 'karin/db'
export * from 'karin/render'
export * from 'karin/utils'
export * from 'karin/types'
export * from 'karin/adapter'

import { config, update } from 'karin/utils'
import { render } from 'karin/render'
import { RenderServer } from 'karin/render'
import OneBot11 from 'karin/adapter/onebot/11/index'
import { server, Karin, listener, Plugin } from 'karin/core'

// 初始化
server.init()
listener.emit('load.plugin')
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
export const Update = update

export const karin = new Karin()
export default karin
