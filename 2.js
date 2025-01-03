#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

/**
 * @description 递归删除指定目录下的文件
 * @param dir 目录路径
 * @param extensions 要删除的文件扩展名数组
 */
function deleteFiles (dir, extensions) {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      deleteFiles(filePath, extensions)
    } else {
      // 修复.d.ts文件匹配问题
      if (file.endsWith('.d.ts') && extensions.includes('.d.ts')) {
        fs.unlinkSync(filePath)
        console.log(`已删除: ${filePath}`)
      } else {
        const ext = path.extname(file)
        if (extensions.includes(ext)) {
          fs.unlinkSync(filePath)
          console.log(`已删除: ${filePath}`)
        }
      }
    }
  }
}

// 删除src目录下的.d.ts和.js文件
const srcDir = path.resolve(process.cwd(), 'src')
const extensions = ['.d.ts', '.js']

if (fs.existsSync(srcDir)) {
  console.log('开始清理src目录...')
  deleteFiles(srcDir, extensions)
  console.log('清理完成!')
} else {
  console.log('src目录不存在!')
}
