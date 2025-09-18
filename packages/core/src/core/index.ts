import * as core from './core'
import { emitter } from '@karinjs/events'

export * from './types'
export * from '@karinjs/events'
/**
 * @abstraction Karin 核心模块
 */
export const karin = Object.assign(emitter, core)
