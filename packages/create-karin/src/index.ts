#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import prompts from 'prompts'
import { green, red, yellow } from 'kolorist'

import { production } from './project'
import { getStr } from './utils/tools'
import { createDev } from './dev'

/**
 * 验证项目名称
 */
export const validateProjectName = (value: string) => {
  const dir = path.join(process.cwd(), value)
  /** 不允许中文 */
  if (/[\u4e00-\u9fa5]/.test(value)) {
    return '项目名称不允许包含中文'
  }
  if (fs.existsSync(dir)) {
    return `目录 ${value} 已存在，推荐使用 ${value}-${getStr(5)}`
  }
  return true
}

/**
 * 创建新项目
 */
const createProject = async () => {
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
          value: 'ts',
          description: '用于开发 TypeScript 插件',
        },
        {
          title: 'JavaScript 开发环境',
          value: 'js',
          description: '用于开发 JavaScript 插件',
        },
      ],
    },
    {
      type: 'select',
      name: 'installPuppeteer',
      message: '是否安装 Puppeteer?(已有无需安装)',
      initial: 0,
      choices: [
        {
          title: `${green('是')} ${yellow('(推荐)')}`,
          value: true,
          description: '安装 Puppeteer 以支持浏览器自动化',
        },
        {
          title: '否',
          value: false,
          description: '不安装 Puppeteer',
        },
      ],
    },
  ])

  if (!response.projectName || !response.template) {
    throw new Error('操作已取消')
  }

  /** 生产环境 */
  if (response.template === 'production') {
    await production(response.projectName, response.installPuppeteer)
    return
  }

  /** 开发环境 */
  await createDev(response.projectName, response.template, response.installPuppeteer)
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
