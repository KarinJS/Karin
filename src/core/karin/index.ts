import * as fnc from './export'
import { other } from './other'

debug('debug: init karin')

export const karin = Object.assign(other, fnc)

/**
 * @deprecated 已废弃，请使用`karin`
 */
export const Bot = karin
