#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { karinDir } from 'karin/core/dir'

const pathList = ['./plugins', './config/config']

for (const dir of pathList) mkdir(dir)

function mkdir (dirname: string) {
  if (fs.existsSync(dirname)) return true
  /** 递归自调用 */
  if (mkdir(path.dirname(dirname))) fs.mkdirSync(dirname)
  return true
}

// 删除这两个文件夹
const delList = ['./config/defSet', './config/view']
for (const dir of delList) {
  if (fs.existsSync(dir)) fs.rmdirSync(dir, { recursive: true })
  mkdir(dir)
  const root = `${karinDir}${dir.replace('.', '')}`
  const files = fs.readdirSync(root).filter(file => file.endsWith('.yaml'))
  for (const file of files) {
    const path = `${dir}/${file}`
    const pathDef = `${root}/${file}`
    if (!fs.existsSync(path)) fs.copyFileSync(pathDef, path)
  }
}

// 修改package.json为esm模块
const pack = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
// 解析包内的package.json文件
const npmPack = JSON.parse(fs.readFileSync(`${karinDir}/package.json`, 'utf-8'))
npmPack.main = './node_modules/node-karin/lib/index.js'
delete npmPack.bin
delete npmPack.types
npmPack.dependencies = pack.dependencies
fs.writeFileSync('./package.json', JSON.stringify(npmPack, null, 2))

console.log('初始化完成~，请通过 【 node . 】 启动程序~')
