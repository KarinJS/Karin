import * as core from './core'
import { emitter } from '../event'

export * from './types'
export * from '../event'
/**
 * @abstraction Karin 核心模块
 */
export const karin = Object.assign(emitter, core)
