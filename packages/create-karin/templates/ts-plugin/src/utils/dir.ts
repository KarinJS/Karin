import path from 'path'
import { fileURLToPath } from 'url'

/** 当前文件的绝对路径 */
const filePath = fileURLToPath(import.meta.url).replace(/\\/g, '/')
/** 插件包绝对路径 */
const dirPath = path.resolve(filePath, '../../../')
/** 插件包的名称 */
const basename = path.basename(dirPath)

export { dirPath, basename }
