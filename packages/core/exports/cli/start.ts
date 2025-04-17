import fs from 'node:fs'
import dotenv from 'dotenv'
import { pathToFileURL } from 'node:url'
import { fork } from 'node:child_process'

/**
 * 解析环境变量文件列表
 * @param env - 环境变量文件名称，可以是单个文件名或用逗号分隔的多个文件名
 * @returns 环境变量文件列表
 */
const parseEnvFiles = (env?: string): string[] => {
  if (!env) return ['.env']
  return env.split(',').map(file => file.trim())
}

/**
 * 加载环境变量
 * @param env - 环境变量文件名称，可以是单个文件名或用逗号分隔的多个文件名
 */
const loadEnv = (env?: string) => {
  const dir = process.cwd()
  const files = parseEnvFiles(env)

  // 确保.env文件始终存在
  if (!files.includes('.env')) {
    files.unshift('.env')
  }

  files.forEach(file => {
    if (!fs.existsSync(`${dir}/${file}`)) {
      if (file === '.env') {
        console.error(`未找到${file}文件，请使用 npx karin init 进行初始化项目`)
      } else {
        console.error(`未找到${file}文件，请将其放置在项目根目录`)
      }
      process.exit(1)
    }
  })

  const paths = files.map(file => `${dir}/${file}`)
  dotenv.config({ path: paths, override: true })
}

/**
 * 启动项目
 * @param env - 环境变量文件名称，可以是单个文件名或用逗号分隔的多个文件名
 */
export const start = async (env?: string) => {
  loadEnv(env)
  const index = '../root.js'
  const { karinMain } = await import(index)
  const child = fork(karinMain)

  child.on('message', message => {
    if (message === 'restart') {
      child.kill()
      child.removeAllListeners()
      start(env)
    }
  })

  child.on('exit', code => process.exit(code!))
}

/**
 * 开发模式
 * @param env - 环境变量文件名称，可以是单个文件名或用逗号分隔的多个文件名
 */
export const dev = async (env?: string) => {
  loadEnv(env)
  const index = '../root.js'
  process.env.NODE_ENV = 'development'
  const { karinMain } = await import(index)
  await import(pathToFileURL(karinMain).toString())
}
