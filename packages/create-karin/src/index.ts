#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import task from 'tasuku'
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

  const { result } = await task('检查网络环境', async ({ setTitle }) => {
    const result = await pingUrls()
    if (result.ping) {
      setTitle(green('网络环境极佳 ^_^'))
    } else {
      setTitle(red('网络环境较差~'))
    }
    return result
  })

  await task.group(task => [
    task('检查 pnpm', async ({ setTitle }) => {
      const pnpm = await checkPnpm()
      if (pnpm) return setTitle('pnpm 已安装')
      await installPnpm(result.suffix)
      setTitle('pnpm 安装成功')
    }),

    task('正在创建项目', async ({ setTitle }) => {
      setTitle('正在创建项目')
      const templateDir = path.join(
        fileURLToPath(import.meta.url),
        '../../templates',
        template
      )

      await fs.promises.mkdir(targetDir, { recursive: true })
      await fs.promises.cp(templateDir, targetDir, { recursive: true })

      const projectName = response.projectName
      const main = template === 'production' ? 'pnpm app' : 'pnpm dev'

      setTitle([
        '\n✨ 项目创建成功！',
        yellow('👇 请执行以下命令：\n'),
        green(`  cd ${projectName}`),
        green('  pnpm install -P'),
        green(`  ${main}\n`),
        '  快捷指令(上下任选其一):',
        magenta(`  cd ${projectName} && pnpm install -P && ${main}\n`),
        template === 'production'
          ? '🚀 开始愉快的使用吧！'
          : '🚀 开始愉快的开发吧！',
      ].join('\n'))
    }),
  ])
}

/**
 * 重新初始化当前目录
 */
const reinitProject = async () => {
  const response = await prompts([
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
    {
      type: 'confirm',
      name: 'confirm',
      message: '此操作将覆盖当前目录下的文件，是否继续？',
      initial: false,
    },
  ])

  // 如果用户取消操作，则抛出错误
  if (!response.template || !response.confirm) {
    throw new Error('操作已取消')
  }

  /** 删掉依赖 */
  const files = ['node_modules', 'package-lock.json', 'pnpm-lock.yaml', 'pnpm-lock.yaml', 'pnpm-lock.yaml', 'pnpm-lock.yaml']
  await Promise.all(files.map(file => fs.promises.rm(path.join(process.cwd(), file), { recursive: true, force: true })))

  /** 重新复制 如果遇到冲突则直接覆盖 */
  const templateDir = path.join(
    fileURLToPath(import.meta.url),
    '../../templates',
    response.template
  )
  await fs.promises.cp(templateDir, process.cwd(), { recursive: true, force: true })

  const main = response.template === 'production' ? 'pnpm app' : 'pnpm dev'
  console.log([
    '\n✨ 项目重新初始化成功！',
    yellow('👇 请重新执行以下命令：\n'),
    green('  pnpm install -P'),
    green(`  ${main}\n`),
    '  快捷指令(上下任选其一):',
    magenta(`  pnpm install -P && ${main}\n`),
    response.template === 'production'
      ? '🚀 开始愉快的使用吧！'
      : '🚀 开始愉快的开发吧！',
  ].join('\n'))
}

/**
 * 入口函数
 */
const main = async () => {
  try {
    const { mode } = await prompts({
      type: 'select',
      name: 'mode',
      message: '选择操作模式:',
      initial: 0,
      choices: [
        {
          title: `${green('新建项目')} ${green('(推荐)')}`,
          value: 'new',
          description: '在当前目录创建新的项目',
        },
        {
          title: `${yellow('重新初始化')}`,
          value: 'reinit',
          description: '强制重新初始化当前目录',
        },
      ],
    }, {
      onCancel: () => {
        process.exit(1)
      },
    })

    if (!mode) {
      throw new Error('操作已取消')
    }

    if (mode === 'new') {
      await createProject()
    } else {
      await reinitProject()
    }

    process.exit(0)
  } catch (err) {
    console.log(red('✖ ') + (err as Error).message)
    process.exit(1)
  }
}

main()
