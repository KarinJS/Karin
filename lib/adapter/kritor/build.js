import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'

console.log('开始编译 .proto 文件...')

/** 获取所有 .proto 文件的路径 */
const protoFiles = [
  ...getProtoFiles('kritor/protos', true)
]

console.log(`共找到 ${protoFiles.length} 个 .proto 文件`)

function getProtoFiles (directory, recursive = false) {
  const protoFiles = []
  const files = fs.readdirSync(directory)
  files.forEach(file => {
    const filePath = path.join(directory, file)
    const stats = fs.statSync(filePath)
    if (stats.isDirectory() && recursive) {
      protoFiles.push(...getProtoFiles(filePath, recursive))
    } else if (stats.isFile() && file.endsWith('.proto')) {
      protoFiles.push(filePath)
    }
  })
  return protoFiles
}

/** 清空proto下的所有文件 */
if (fs.existsSync('./protos')) { fs.rmSync('./protos', { recursive: true }) }
fs.mkdirSync('./protos')
const file = './protos/compiled.js'
const proto = protoFiles.join(' ')
const command = `pbjs -t static-module -w es6 --keep-case -p ./kritor/protos -o ${file} ${proto}`
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`编译 .proto 文件时出错：${error.message}`)
    console.error(stdout)
    return
  }
  /** 使用fs解析编译完成的文件 需要替换一些内容... */
  let content = fs.readFileSync(file, 'utf-8')
  content = content.replace('import * as $protobuf from "protobufjs/minimal";', 'import $protobuf from "protobufjs/minimal.js";')
  content = content.replace('const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});', 'const $root = $protobuf.roots || ($protobuf.roots = {})')
  /** 保存写入 */
  fs.writeFileSync(file, content)
  console.log('编译完成')
})
