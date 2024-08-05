import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
/**
 * - 获取当前npm包的根目录
 */
export const karinDir = path.resolve(filename, '../../../../').replace(/\\/g, '/').replace(/\/$/, '')
