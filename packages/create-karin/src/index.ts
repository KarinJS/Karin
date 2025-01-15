#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import prompts from 'prompts'
import { getStr } from './tools'
import { green, red, yellow, magenta } from 'kolorist'
import { pingUrls, checkPnpm, installPnpm } from './tasks'

/**
 * 创建新项目
 */
const createProject = async () => {
  const validateProjectName = (value: string) => {
    const dir = path.join(process.cwd(), value)
    if (existsSync(dir)) {
      return `目录 ${value} 已存在，推荐使用 ${value}-${getStr(5)}`
    }
    return true
  }

  const response = await prompts([
    {
      type: 'text',
      name: 'projectName',
      message: '项目名称:',
      initial: 'karin-project',
      validate: validateProjectName,
    },
    {
      type: 'select',
      name: 'template',
      message: '选择项目模板:',
      initial: 0,
      choices: [
        {
          title: `${yellow('生产环境')} ${green('(推荐)')}`,
          value: 'production',
          description: '适用于大多数用户的标准环境',
        },
        {
          title: 'TypeScript 开发环境',
          value: 'ts-plugin',
          description: '用于开发 TypeScript 插件',
        },
        {
          title: 'JavaScript 开发环境',
          value: 'js-plugin',
          description: '用于开发 JavaScript 插件',
        },
      ],
    },
  ])

  if (!response.projectName || !response.template) {
    throw new Error('操作已取消')
  }

  const template = response.template
  const targetDir = path.join(process.cwd(), response.projectName)

  // 检查网络环境
  console.log('检查网络环境...')
  const networkResult = await pingUrls()
  if (networkResult.ping) {
    console.log(green('网络环境极佳 ^_^'))
  } else {
    console.log(red('网络环境较差~'))
  }

  // 检查并安装 pnpm
  console.log('检查 pnpm...')
  const pnpm = await checkPnpm()
  if (!pnpm) {
    console.log('正在安装 pnpm...')
    await installPnpm(networkResult.suffix)
    console.log('pnpm 安装成功')
  }

  // 创建项目
  console.log('正在创建项目...')
  const templateDir = path.join(
    fileURLToPath(import.meta.url),
    '../../templates',
    template
  )

  await fs.promises.mkdir(targetDir, { recursive: true })
  await fs.promises.cp(templateDir, targetDir, { recursive: true })

  const projectName = response.projectName
  const main = template === 'production' ? 'pnpm app' : 'pnpm dev'

  // 询问是否自动安装依赖
  const { autoInstall } = await prompts({
    type: 'confirm',
    name: 'autoInstall',
    message: '是否自动安装依赖并启动项目？',
    initial: true,
  })

  if (autoInstall) {
    console.log('\n📦 正在安装依赖...')
    process.chdir(targetDir)
    const { execSync } = await import('node:child_process')
    try {
      execSync('pnpm install -P', { stdio: 'inherit' })
      console.log(green('\n✨ 依赖安装完成！'))

      console.log('\n🚀 正在启动项目...')
      execSync(main, { stdio: 'inherit' })
    } catch (error) {
      console.log(red('\n❌ 自动安装失败，请手动执行以下命令：'))
    }
  }

  console.log([
    '\n✨ 项目创建成功！',
    yellow('👇 请执行以下命令：\n'),
    green(`  cd ${projectName}`),
    !autoInstall ? green('  pnpm install -P') : '',
    green(`  ${main}\n`),
    '  快捷指令(上下任选其一):',
    magenta(`  cd ${projectName} &&${!autoInstall ? 'pnpm install -P &&' : ''} ${main}\n`),
    template === 'production'
      ? '🚀 开始愉快的使用吧！'
      : '🚀 开始愉快的开发吧！',
  ].map(Boolean).join('\n'))
}

/**
 * 入口函数
 */
const main = async () => {
  try {
    await createProject()
    process.exit(0)
  } catch (err) {
    console.log(red('✖ ') + (err as Error).message)
    process.exit(1)
  }
}

main()
