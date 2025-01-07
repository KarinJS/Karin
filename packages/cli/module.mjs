// 对编译出来的.d.ts文件进行处理，删除掉不必要的内容 删掉其中带import的行 tsup奇怪的问题。

import fs from 'node:fs'
import path from 'node:path'

const dir = path.resolve(process.cwd(), 'packages', 'module')

fs.readdirSync(dir).forEach((file) => {
  // 删除.d.cts文件
  if (file.endsWith('.d.cts')) {
    fs.unlinkSync(path.resolve(dir, file))
    return
  }

  if (file.endsWith('.d.ts')) {
    const filePath = path.resolve(dir, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    const newContent = content.replace(/import\s+.*/g, '').trim()
    fs.writeFileSync(filePath, newContent)
  }
})
