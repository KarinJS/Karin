import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
export const karinDir = path.resolve(filename, '../../../').replace(/\\/g, '/').replace(/\/$/, '')
