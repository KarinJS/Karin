#!/usr/bin/env node

import fs from 'fs'

/**
 * @description 获取package.json路径
 */
const getPkgPath = () => process.cwd() + '/package.json'

/**
 * @description 读取package.json
 */
const readPkg = () => JSON.parse(fs.readFileSync(getPkgPath(), 'utf-8'))

/**
 * @description 写入package.json
 * @param pkg package.json
 */
const writePkg = (pkg) => fs.writeFileSync(getPkgPath(), JSON.stringify(pkg, null, 2))

/**
 * @description 构建pr版本号 <主版本号>.<次版本号>.<修订号>.<PR标识>.<PR编号>.<当前提交唯一短哈希>
 * @example 1.0.0.pr.184.a1b2c3d
 * @param pkg package.json
 */
const updateVersion = (pkg) => {
  const list = pkg.version.split('.')
  const shortHash = process.env.GITHUB_SHA?.substring(0, 7) || 'unknown'
  list[2] = `${Number(list[2]) + 1}`
  pkg.version = `${list.join('.')}.pr.${process.env.PR_NUMBER}.${shortHash}`
}

/**
 * @description 设置环境变量
 * @param pkg package.json
 */
const setEnvVariables = (pkg) => {
  fs.appendFileSync(process.env.GITHUB_ENV, `PKG_NAME=${pkg.name}\nPKG_VERSION=${pkg.version}\n`)
}

/**
 * @description 更新版本号并设置环境变量
 */
const version = () => {
  console.log('开始执行版本更新...')
  const pkg = readPkg()
  console.log(`当前版本: ${pkg.version}`)
  updateVersion(pkg)
  console.log(`更新后版本: ${pkg.version}`)
  writePkg(pkg)
  console.log('package.json 写入成功')
  setEnvVariables(pkg)
  console.log('环境变量设置完成')
}

/**
 * @description 删除devDependencies和peerDependencies
 */
const clean = () => {
  console.log('开始清理依赖...')
  const pkg = readPkg()
  console.log('正在删除 devDependencies 和 peerDependencies')
  delete pkg.devDependencies
  delete pkg.peerDependencies
  writePkg(pkg)
  console.log('依赖清理完成')
}

/**
 * @description 执行所有操作
 */
const all = () => {
  console.log('开始执行所有操作...')
  const pkg = readPkg()
  console.log(`当前版本: ${pkg.version}`)
  updateVersion(pkg)
  console.log(`更新后版本: ${pkg.version}`)
  console.log('正在删除 devDependencies 和 peerDependencies')
  delete pkg.devDependencies
  delete pkg.peerDependencies
  writePkg(pkg)
  console.log('package.json 写入成功')
  setEnvVariables(pkg)
  console.log('环境变量设置完成')
  console.log('所有操作执行完毕')
}

const cmd = process.argv[2]
console.log(`执行命令: ${cmd}`)
if (cmd.includes('version')) {
  version()
} else if (cmd.includes('clean')) {
  clean()
} else if (cmd.includes('all')) {
  all()
} else {
  console.log('未知命令，可用命令: version, clean, all')
}
