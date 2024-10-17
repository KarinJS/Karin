import path from 'path'

/** 当前文件的绝对路径 */
const filename = import.meta.filename
/** 以node-karin为根目录的绝对路径 */
export const karinDir = Object.freeze(path.join(filename, '../../../../..').replace(/\\/g, '/'))
/** 是否处于node_modules中 */
export const isPkg = Object.freeze(filename.includes('node_modules'))
/** 默认config路径 */
export const defaultConfig = Object.freeze(path.join(karinDir, 'default', 'config'))
/** 默认view路径 */
export const defaultView = Object.freeze(path.join(karinDir, 'default', 'view'))
/** 用户config路径 */
export const userConfig = Object.freeze(path.join(process.cwd(), 'data', '@config'))
