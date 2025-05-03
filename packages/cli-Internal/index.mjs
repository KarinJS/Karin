import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dir = path.join(__dirname, 'src/git')
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true })
}

fs.cpSync(path.join(__dirname, '../core/src/utils/git'), dir, { recursive: true })
