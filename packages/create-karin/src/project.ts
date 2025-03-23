import fs from 'node:fs'
import path from 'node:path'
import { execSync } from './utils/exec'
import { pingUrls } from './utils/tasks'
import { green, magenta, red, yellow } from 'kolorist'

/**
 * 创建生产环境项目配置
 */
export const createProductionConfig = (projectName: string) => ({
  name: projectName,
  version: '1.0.0',
  description: 'Karin Bot',
  type: 'module',
  main: './node_modules/node-karin/dist/index.js',
})

/**
 * 获取后缀
 * @param isNpmMirror - 是否使用镜像源
 */
export const getSuffix = (isNpmMirror: boolean) => {
  return isNpmMirror ? ' --registry=https://registry.npmmirror.com' : ''
}

/**
 * 创建项目目录结构
 * @param name - 项目名称
 * @param isNpmMirror - 是否使用镜像源
 */
export const createProjectStructure = async (name: string, isNpmMirror: boolean) => {
  console.log('📦 正在创建项目目录结构...')

  /** karin目录 */
  const dir = path.join(process.cwd(), name)
  fs.mkdirSync(dir, { recursive: true })

  const pkg = createProductionConfig(name)
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2))
  console.log(green('✨ 项目目录结构创建完成'))

  console.log('📦 正在安装最新版本的node-karin...')
  const cmd = `pnpm install node-karin@latest${getSuffix(isNpmMirror)}`
  execSync(cmd, { cwd: dir, stdio: 'inherit' })
  console.log(green('✨ node-karin 安装成功'))

  console.log('📦 正在执行初始化...')
  execSync('npx karin init', { cwd: dir, stdio: 'inherit' })
  console.log(green('✨ 初始化完成'))
}

/**
 * 安装puppeteer
 * @param dir - 项目名称
 * @param isNpmMirror - 是否使用镜像源
 */
export const installPuppeteer = async (name: string, isNpmMirror: boolean) => {
  /** karin目录 */
  const karinDir = path.join(process.cwd(), name)
  /** puppeteer目录 */
  const puppeteerDir = path.join(process.cwd(), `${name}-puppeteer`)

  const envContent = fs.readFileSync(path.join(karinDir, '.env'), 'utf-8')
  /** ws server token */
  const wsAuthKey = envContent.match(/WS_SERVER_AUTH_KEY=(.+)/)?.[1] || '123456'
  /** http port */
  const httpPort = envContent.match(/HTTP_PORT=(.+)/)?.[1] || '7777'

  const puppeteerConfig = {
    logLevel: 'info',
    headless: true,
    debug: false,
    browser: 'chrome',
    maxPages: 15,
    http: {
      host: '0.0.0.0',
      port: 7005,
      token: '123456',
    },
    ws: {
      enable: true,
      token: '123456',
      path: '/ws',
      list: [
        {
          url: `ws://127.0.0.1:${httpPort}/puppeteer`,
          token: wsAuthKey,
        },
      ],
    },
    browserCount: 1,
    args: [
      '--enable-gpu',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--no-zygote',
      '--disable-extensions',
      '--disable-dev-shm-usage',
    ],
  }

  fs.mkdirSync(puppeteerDir, { recursive: true })
  fs.writeFileSync(path.join(puppeteerDir, 'config.json'), JSON.stringify(puppeteerConfig, null, 2))

  console.log('📦 正在安装puppeteer...')
  const cmd = `pnpm init && pnpm install @karinjs/puppeteer@1.6.1${getSuffix(isNpmMirror)} && npx init`
  execSync(cmd, {
    cwd: puppeteerDir,
    stdio: 'inherit',
  })

  /** 写入app启动命令 */
  const pkg = fs.readFileSync(path.join(puppeteerDir, 'package.json'), 'utf-8')
  const data = JSON.parse(pkg)
  data.scripts.app = 'node index.js'
  data.scripts.pm2 = 'k pm2'
  data.scripts.stop = 'k stop'
  data.scripts.rs = 'k rs'
  data.scripts.log = 'k log'
  fs.writeFileSync(path.join(puppeteerDir, 'package.json'), JSON.stringify(data, null, 2))
  console.log(green('✨ puppeteer 安装成功'))
}

/**
 * 检查网络环境
 */
export const checkNetwork = async () => {
  const networkResult = await pingUrls()
  if (networkResult.ping) {
    console.log(green('网络环境极佳 ^_^'))
    return false
  } else {
    console.log(red('网络环境较差 将使用镜像源安装依赖~'))
    return true
  }
}

/**
 * 安装生产环境模板
 * @param name - 项目名称
 * @param puppeteer - 是否安装Puppeteer
 */
export const production = async (name: string, puppeteer: boolean) => {
  try {
    const isNpmMirror = await checkNetwork()
    await createProjectStructure(name, isNpmMirror)
    if (puppeteer) {
      await installPuppeteer(name, isNpmMirror)
    }

    const list = [
      '\n\n--------------------------------',
      '\n✨ 项目创建成功！',
      yellow('👇 请执行以下命令：\n'),
      green(`  cd ${name}`),
      green('  pnpm app\n'),
      '  快捷指令(上下任选其一):',
      magenta(`  cd ${name} && pnpm app\n`),
      '🚀 开始愉快的使用吧！',
    ]

    if (puppeteer) {
      list.push(
        '--------------------------------',
        '  如需使用Puppeteer，请执行以下命令：',
        green(`  cd ${name}-puppeteer && pnpm app`),
        '--------------------------------'
      )
    }

    console.log(list.join('\n'))
  } catch (error) {
    console.log(magenta('Github: https://github.com/Karinjs/Karin/issues'))
    console.log(red('发生错误，请将以下信息反馈给开发者：'))
    console.log(green('--------------------------------'))
    console.log(error)
    console.log(green('--------------------------------'))
  }
}
