import * as fn from './export'
import { Emitter } from './other'

/**
 * @core
 */
export const karin = Object.assign(new Emitter(), fn)

/**
 * @deprecated 已废弃，请使用`karin`
 */
export const Bot = karin
