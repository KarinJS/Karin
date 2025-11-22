/**
 * 测试多种情况下 pnpm10 在工作区的判断表现
 *
 * 结论: 无论是否在工作区内执行, 只要存在 pnpm-workspace.yaml 文件, pnpm10 都会被识别为工作区
 *
 * 并且里面不需要存在packages字段, 只要文件存在即可
 */
import fs from 'node:fs'
import { execSync } from 'node:child_process'

const name = 'pnpm-workspace.yaml'

/**
 * 没有 pnpm-workspace.yaml 文件
 * @description 预期应该判断为非工作区
 */
const testNoWorkspaceFile = () => {
  console.log('=== 测试: 没有 pnpm-workspace.yaml 文件 ===')

  if (fs.existsSync(name)) {
    console.log(`删除已有的 ${name}`)
    fs.rmSync(name)
  } else {
    console.log(`${name} 不存在，继续`)
  }

  try {
    console.log('执行: pnpm i empty-npm-package')
    execSync('pnpm i empty-npm-package', { stdio: 'inherit' })
    console.log('✅ 成功执行，无误判为工作区')
  } catch (error) {
    console.error('❌ 测试失败：没有 pnpm-workspace.yaml 文件时，pnpm10 被误判为工作区')
    console.error(error)
    process.exit(1)
  }

  // 创建workspace文件后执行
  try {
    console.log(`创建 ${name} 文件`)
    fs.writeFileSync(name, '')
    console.log('执行: pnpm i empty-npm-package')
    execSync('pnpm i empty-npm-package', { stdio: 'inherit' })
    console.error('❌ 测试失败：pnpm10 误判为工作区，预期报错但未报错')
    process.exit(1)
  } catch (error) {
    console.log('✅ 捕获预期错误，pnpm10 正确识别工作区存在')
    console.log((error as Error).message)
  } finally {
    if (fs.existsSync(name)) {
      console.log(`删除 ${name}`)
      fs.rmSync(name)
    }
  }
}

/**
 * 存在 pnpm-workspace.yaml 文件
 * @description 预期应该判断为工作区
 */
const testWithWorkspaceFile = () => {
  console.log('=== 测试: 存在 pnpm-workspace.yaml 文件 ===')

  console.log(`创建 ${name} 文件`)
  fs.writeFileSync(name, 'packages:\n  - "packages/*"\n')

  try {
    console.log('执行: pnpm i empty-npm-package -w')
    execSync('pnpm i empty-npm-package -w', { stdio: 'inherit' })
    console.log('✅ 成功执行，正确识别为工作区')
  } catch (error) {
    console.error('❌ 测试失败：存在 pnpm-workspace.yaml 文件时，pnpm10 未被识别为工作区')
    console.error(error)
    process.exit(1)
  }

  console.log(`删除 ${name}`)
  fs.rmSync(name)

  try {
    console.log('执行: pnpm i empty-npm-package -w（删除workspace文件后）')
    execSync('pnpm i empty-npm-package -w', { stdio: 'inherit' })
    console.error('❌ 测试失败：pnpm10 误判为工作区，预期报错但未报错')
    // 但是当前在工作区模式下执行，pnpm 会自动向上查找 workspace 文件，导致无法触发错误。。。
    process.exit(1)
  } catch (error) {
    console.log('✅ 捕获预期错误，pnpm10 正确识别为非工作区')
    console.log((error as Error).message)
  }
}

/** 执行测试 */
testNoWorkspaceFile()
testWithWorkspaceFile()
