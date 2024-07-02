#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { karinDir } from 'karin/core/dir'
import { execSync } from 'child_process'

const pathList = ['./plugins', './config/config', './lib']

// 创建目录
pathList.forEach(dir => mkdir(dir))

function mkdir (dirname: string): boolean {
  if (fs.existsSync(dirname)) return true
  if (mkdir(path.dirname(dirname))) fs.mkdirSync(dirname)
  return true
}

// 创建 lib 目录并导出 node-karin 模块
fs.writeFileSync('./lib/index.js', `export * from 'node-karin'`)

// 删除指定目录并重新创建
const delList = ['./config/defSet', './config/view']
delList.forEach(dir => {
  if (fs.existsSync(dir)) fs.rmdirSync(dir, { recursive: true })
  mkdir(dir)
  const root = path.join(karinDir, dir.replace('.', ''))
  const files = fs.readdirSync(root).filter(file => file.endsWith('.yaml'))
  files.forEach(file => {
    const destPath = path.join(dir, file)
    const srcPath = path.join(root, file)
    if (!fs.existsSync(destPath)) fs.copyFileSync(srcPath, destPath)
  })
})

// 修改 package.json 为 ESM 模块
const pack = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
const npmPack = JSON.parse(fs.readFileSync(path.join(karinDir, 'package.json'), 'utf-8'))
npmPack.main = './node_modules/node-karin/lib/index.js'
delete npmPack.bin
delete npmPack.types
npmPack.dependencies['node-karin'] = pack.dependencies['node-karin']
fs.writeFileSync('./package.json', JSON.stringify(npmPack, null, 2))

// 复制 pnpm-workspace.yaml 到根目录
fs.copyFileSync(path.join(karinDir, 'pnpm-workspace.yaml'), './pnpm-workspace.yaml')

// 检查是否安装 pnpm 并安装依赖
console.log('检查是否安装 pnpm...')
try {
  const isPnpm = execSync('pnpm -v', { env: process.env }).toString().trim()
  if (isPnpm) {
    console.log('检查到 pnpm，开始安装依赖...')
  } else {
    installPnpm()
  }
} catch {
  installPnpm()
}

// 安装依赖
try {
  execSync('pnpm install -P', { env: process.env, stdio: 'inherit' })
  console.log('依赖安装完成~')
} catch {
  console.log('安装依赖失败，请手动安装依赖！')
  console.log('可尝试手动执行 【 pnpm install -P 】 安装依赖~')
  console.log('如中国大陆用户安装失败，请尝试执行换源 【 npm config set registry https://registry.npmmirror.com 】后再安装依赖~')
}

console.log('初始化完成~，请通过 【 node . 】 启动程序~')

function installPnpm () {
  console.log('未检查到 pnpm，开始安装 pnpm...')
  execSync('npm --registry=https://registry.npmmirror.com install pnpm -g', { env: process.env, stdio: 'inherit' })
  console.log('pnpm 安装完成，开始安装依赖...')
}
