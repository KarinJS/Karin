import fs from 'node:fs'
import dotenv from 'dotenv'
import { pathToFileURL } from 'node:url'
import { fork, spawn } from 'node:child_process'

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

  files.forEach((file) => {
    if (!fs.existsSync(`${dir}/${file}`)) {
      if (file === '.env') {
        console.error(`未找到${file}文件，请使用 pnpm init 进行初始化项目`)
      } else {
        console.error(`未找到${file}文件，请将其放置在项目根目录`)
      }
      process.exit(1)
    }
  })

  const paths = files.map((file) => `${dir}/${file}`)
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

  child.on('message', (message) => {
    if (message === 'restart') {
      child.kill()
      child.removeAllListeners()
      start(env)
    }
  })

  child.on('exit', (code) => process.exit(code))
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

/**
 * TypeScript 开发模式
 * @param env - 环境变量文件名称，可以是单个文件名或用逗号分隔的多个文件名
 */
export const tsStart = async (env?: string) => {
  loadEnv(env)
  process.env.NODE_ENV = 'development'

  const index = '../root.js'
  const { karinMain } = await import(index)

  const child = spawn('npx', ['tsx', karinMain], {
    env: {
      ...process.env,
      RUNTIME: 'tsx',
    },
    stdio: 'inherit',
    shell: true,
  })

  child.on('exit', (code) => process.exit(code ?? 0))
}

/**
 * TypeScript 监视模式
 * @param options - 配置选项
 * @param options.env - 环境变量文件名称，可以是单个文件名或用逗号分隔的多个文件名
 * @param options.include - 要监视的额外文件/目录，多个用逗号分隔
 * @param options.exclude - 要排除监视的文件/目录，多个用逗号分隔
 * @param options.clearScreen - 重新运行时是否清屏
 */
export const tsWatch = async (options: {
  env?: string
  include?: string
  exclude?: string
  clearScreen: boolean
}) => {
  loadEnv(options.env)
  process.env.NODE_ENV = 'development'

  const index = '../root.js'
  const { karinMain } = await import(index)

  const args = ['tsx', 'watch']

  if (options.include) {
    options.include.split(',').forEach(pattern => {
      args.push('--include', pattern.trim())
    })
  }

  if (options.exclude) {
    options.exclude.split(',').forEach(pattern => {
      args.push('--exclude', pattern.trim())
    })
  }

  if (!options.clearScreen) {
    args.push('--clear-screen=false')
  }

  args.push(karinMain)

  const child = spawn('npx', args, {
    env: {
      ...process.env,
      RUNTIME: 'tsx',
      TSX_WATCH: 'true',
    },
    stdio: 'inherit',
    shell: true,
  })

  child.on('exit', (code) => process.exit(code ?? 0))
}
