#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

/**
 * 检查当前目录是否为有效的 package 目录
 */
const checkPackageDir = () => {
  const pkgPath = path.join(process.cwd(), 'package.json')
  return fs.existsSync(pkgPath)
}

/**
 * 检查是否安装了 node-karin
 */
const checkKarinDependency = () => {
  const pkgPath = path.join(process.cwd(), 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  return !!(pkg.dependencies?.['node-karin'] || pkg.devDependencies?.['node-karin'])
}

/**
 * 检查 CLI 入口文件是否存在
 */
const checkCliExists = () => {
  const cliPath = path.join(process.cwd(), 'node_modules/node-karin/dist/cli/index.cjs')
  return fs.existsSync(cliPath)
}

try {
  // 检查是否在包目录下
  const isPkgDir = checkPackageDir()
  if (!isPkgDir) {
    console.error('错误: 请在 karin 项目目录下运行此命令')
    process.exit(1)
  }

  // 检查是否安装了 node-karin
  const hasKarin = checkKarinDependency()
  if (!hasKarin) {
    console.error('错误: 请先安装 node-karin 依赖')
    process.exit(1)
  }

  // 检查 CLI 文件是否存在
  const cliExists = checkCliExists()
  if (!cliExists) {
    console.error('错误: node-karin CLI 文件不存在，请升级 node-karin 依赖版本')
    process.exit(1)
  }

  // 执行 node-karin CLI
  const cliPath = path.join(process.cwd(), 'node_modules/node-karin/dist/cli/index.cjs')
  require(cliPath)
} catch (error) {
  console.error('执行出错:', error)
  process.exit(1)
}
