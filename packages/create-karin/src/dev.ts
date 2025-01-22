import fs from 'node:fs'
import path from 'node:path'
import { green, magenta, red, yellow } from 'kolorist'
import { checkNetwork, installPuppeteer } from './project'
import { getStr } from './utils/tools'

/**
 * 创建开发环境项目
 * @param name - 项目名称
 * @param type - 项目类型
 */
export const copyTemplate = (name: string, type: 'ts' | 'js') => {
  console.log('📦 正在创建项目目录结构...')

  /** karin目录 */
  const dir = path.join(process.cwd(), name)
  /** ts模板路径 */
  const templatePath = path.join(__dirname, `../templates/${type}-plugin`)

  // 直接复制整个模板目录
  fs.cpSync(templatePath, dir, { recursive: true })

  // TODO: 后续改为远程api拉取 动态更新
  const list = [
    'node_sqlite3_binary_host_mirror=https://registry.npmmirror.com/-/binary/sqlite3',
    'better_sqlite3_binary_host_mirror=https://registry.npmmirror.com/-/binary/better-sqlite3',
    'sass_binary_site=https://registry.npmmirror.com/-/binary/node-sass',
    'sharp_binary_host=https://registry.npmmirror.com/-/binary/sharp',
    'sharp_libvips_binary_host=https://registry.npmmirror.com/-/binary/sharp-libvips',
    'canvas_binary_host_mirror=https://registry.npmmirror.com/-/binary/canvas',
    '# 19以下版本',
    'puppeteer_download_host=https://registry.npmmirror.com/mirrors',
    '# 20以上版本',
    'PUPPETEER_DOWNLOAD_BASE_URL = https://registry.npmmirror.com/binaries/chrome-for-testing',
  ]

  const npmrc = path.join(dir, '.npmrc')
  fs.writeFileSync(npmrc, list.join('\n'))

  /** 将.env文件的两个token随机生成 */
  const env = path.join(dir, '.env')
  const envContent = fs.readFileSync(env, 'utf-8')
  const token = getStr(5)
  const wsToken = getStr(5)

  fs.writeFileSync(
    env,
    envContent
      .replace('HTTP_AUTH_KEY=QtYTbI', `HTTP_AUTH_KEY=${token}`)
      .replace('WS_SERVER_AUTH_KEY=QOnAho', `WS_SERVER_AUTH_KEY=${wsToken}`),
  )

  console.log(green('✨ 项目目录结构创建完成'))
}

/**
 * 创建开发环境项目
 * @param name - 项目名称
 * @param type - 项目类型
 * @param puppeteer - 是否安装Puppeteer
 */
export const createDev = async (name: string, type: 'ts' | 'js', puppeteer: boolean) => {
  try {
    copyTemplate(name, type)

    if (puppeteer) {
      const isNpmMirror = await checkNetwork()
      installPuppeteer(name, isNpmMirror)
    }

    const list = [
      '\n\n--------------------------------',
      '\n✨ 项目创建成功！',
      yellow('👇 请执行以下命令：\n'),
      green(`  cd ${name}`),
      green('  pnpm install'),
      green('  pnpm dev\n'),
      '  快捷指令(上下任选其一):',
      magenta(`  cd ${name} && pnpm install && pnpm dev\n`),
      '🚀 开始愉快的开发吧！',
    ]

    if (puppeteer) {
      list.push(
        '--------------------------------',
        '  如需使用Puppeteer，请执行以下命令：',
        green(`  cd ${name}-puppeteer && node .`),
        '--------------------------------',
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
