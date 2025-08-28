import fs from 'node:fs'
import path from 'node:path'
import { glob } from 'glob'

/** 目标路径 */
const targetPath = './src/module/locale'
/** 语言文件路径 */
const localePath = './node_modules/moment/locale'

if (!fs.existsSync(targetPath)) {
  fs.mkdirSync(targetPath, { recursive: true })
}

const files = glob.sync(`${localePath}/*.js`)

files.forEach(file => {
  const fileName = path.basename(file)
  fs.copyFileSync(file, path.join(targetPath, fileName))
})

console.log(`moment 语言文件已复制到 ${targetPath}，共 ${files.length} 个文件。`)
