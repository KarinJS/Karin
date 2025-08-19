import fs from 'node:fs'
import path from 'node:path'
import 'moment/locale/zh-cn.js'

/** 生成语言包文件 */
const dir = './dist/module/locale'
const files = fs.readdirSync('./node_modules/moment/locale')
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true })
}

files.forEach(file => {
  /** 跳过非js文件 */
  if (!file.endsWith('.js')) return
  const content = `import 'moment/locale/${file}'`
  fs.writeFileSync(path.join(dir, file), content)
})
