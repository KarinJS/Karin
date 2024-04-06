import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'

console.log('开始编译 .proto 文件...')

/** 检查proto文件夹是否存在 */
if (!fs.existsSync('./proto')) fs.mkdirSync('./proto')
/** 清空proto下的所有文件 */
fs.rmdirSync('./proto', { recursive: true })

/** 获取所有 .proto 文件的路径 */
const protoFiles = [
  ...getProtoFiles('kritor/protos'),
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

const file = './protos/compiled.js'
const proto = protoFiles.join(' ')
const command = `pbjs -t static-module -w es6 -p ./kritor/protos -o ${file} ${proto}`
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

// /** 遍历每个 .proto 文件 */
// protoFiles.forEach((protoFile, index) => {
//   const file = './proto/' + protoFile.replace(/\\/g, '/').replace('kritor/protos/', '').replace('.proto', '.js')

//   /** 去除最后的文件路径，保留文件夹路径，检查是否存在，不存在则创建文件夹 */
//   const path = file.split('/').slice(0, -1).join('/')
//   // 判断是否存在，不存在则创建文件夹
//   if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true })

//   /** 构建 pbjs 命令 */
//   const command = `pbjs -t static-module -w es6 -p ./kritor/protos -o ${file} ${protoFile}`
//   /** 执行命令 */
//   exec(command, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`编译 ${protoFile} 时出错：${error.message}`)
//       console.error(stdout)
//       return
//     }
//     /** 使用fs解析编译完成的文件 需要替换一些内容... */
//     let content = fs.readFileSync(file, 'utf-8')
//     content = content.replace('import * as $protobuf from "protobufjs/minimal";', 'import $protobuf from "protobufjs/minimal.js";')
//     content = content.replace('const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});', 'const $root = $protobuf.roots || ($protobuf.roots = {})')
//     /** 保存写入 */
//     fs.writeFileSync(file, content)
//     console.log(`编译完成(${(index + 1).toString().padStart(2, '0')}/${protoFiles.length})：${protoFile}`)
//   })
// })
