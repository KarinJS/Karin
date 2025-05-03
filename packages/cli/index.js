#!/usr/bin/env node

import { join } from 'path'
import { existsSync, readFileSync } from 'fs'

/**
 * 检查当前目录是否为有效的 package 目录
 */
const checkPackageDir = () => {
  const pkgPath = join(process.cwd(), 'package.json')
  return existsSync(pkgPath)
}

/**
 * 检查是否安装了 node-karin
 */
const checkKarinDependency = () => {
  const pkgPath = join(process.cwd(), 'package.json')
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
  return !!(pkg.dependencies?.['node-karin'] || pkg.devDependencies?.['node-karin'])
}

/**
 * 检查 CLI 入口文件是否存在
 */
const checkCliExists = () => {
  const cliPath = join(process.cwd(), 'index.mjs')
  return existsSync(cliPath)
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
  const cliPath = join(process.cwd(), 'index.mjs')
  import(`file://${cliPath}`)
} catch (error) {
  console.error('执行出错:', error)
  process.exit(1)
}
