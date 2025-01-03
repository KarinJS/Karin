import * as fnc from './export'
import { other } from './other'

export const karin = Object.assign(fnc, other)

/**
 * @deprecated 已废弃，请使用`karin`
 */
export const Bot = karin
