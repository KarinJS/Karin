import ora from 'ora'
import fs from 'node:fs'
import path from 'node:path'
import { exec } from './utils/exec'
import { fileURLToPath } from 'node:url'
import { green, magenta, yellow } from 'kolorist'

/**
 * 创建生产环境项目
 * @param projectName - 项目名称
 * @param registrySuffix - 镜像源后缀
 * @param httpAuthKey - http鉴权秘钥
 * @param wsAuthKey - ws鉴权秘钥
 */
export const createProject = async (
  projectName: string,
  registrySuffix: string,
  httpAuthKey: string,
  wsAuthKey: string
) => {
  const spinner = ora('📦 正在创建项目目录...').start()
  const dir = path.join(process.cwd(), projectName)
  fs.mkdirSync(dir, { recursive: true })
  spinner.succeed(green('✨ 项目目录结构创建完成'))

  spinner.start('正在安装最新版本的node-karin...')
  await exec('pnpm init', { cwd: dir })
  const cmd = `pnpm install node-karin@latest${registrySuffix}`
  const { error, stderr } = await exec(cmd, { cwd: dir })
  if (error) throw error
  if (stderr) throw new Error(stderr)
  spinner.succeed(green('✨ node-karin 安装成功'))

  spinner.start('正在执行初始化...')
  await exec('npx karin init', { cwd: dir })
  setAuthKey(dir, httpAuthKey, wsAuthKey)
  spinner.succeed(green('✨ 初始化完成'))

  console.log([
    '--------------------------------',
    '✨ 项目创建成功！',
    yellow('👇 请执行以下命令:\n'),
    green(`  cd ${projectName}`),
    green('  pnpm app\n'),
    '  快捷指令(上下任选其一):\n',
    magenta(`  cd ${projectName} && pnpm app\n`),
    'docs: https://karin.fun',
    '点个star吧：https://github.com/Karinjs/Karin',
    '🚀 开始愉快的使用吧！',
  ].join('\n'))
}

/**
 * 创建karin-plugin项目
 * @param type - 项目类型
 * @param projectName - 项目名称
 * @param registrySuffix - 镜像源后缀
 * @param httpAuthKey - http鉴权秘钥
 * @param wsAuthKey - ws鉴权秘钥
 */
export const createPlugin = async (
  type: 'karin-plugin-ts' | 'karin-plugin-js',
  projectName: string,
  registrySuffix: string,
  httpAuthKey: string,
  wsAuthKey: string
) => {
  const spinner = ora('📦 正在创建项目目录...').start()
  const dir = path.join(process.cwd(), projectName)
  fs.mkdirSync(dir, { recursive: true })
  spinner.succeed(green('✨ 项目目录结构创建完成'))

  spinner.start('正在复制模板...')
  const templatePath = path.join(fileURLToPath(import.meta.url), '../templates', type)
  fs.cpSync(templatePath, dir, { recursive: true })
  const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf-8'))
  pkg.name = projectName
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2))
  spinner.succeed(green('✨ 模板复制完成'))

  spinner.start('正在安装依赖...')
  const cmd = `pnpm install${registrySuffix}`
  const { error, stderr } = await exec(cmd, { cwd: dir })
  if (error) throw error
  if (stderr) throw new Error(stderr)

  spinner.succeed(green('✨ 依赖安装完成'))

  spinner.start('正在执行初始化...')
  await exec('npx karin init', { cwd: dir })
  setAuthKey(dir, httpAuthKey, wsAuthKey)
  spinner.succeed(green('✨ 初始化完成'))

  console.log([
    '--------------------------------',
    '✨ 项目创建成功！',
    yellow('👇 请执行以下命令:\n'),
    green(`  cd ${projectName}`),
    green('  pnpm dev\n'),
    '  快捷指令(上下任选其一):\n',
    magenta(`  cd ${projectName} && pnpm dev\n`),
    'docs: https://karin.fun',
    '点个star吧：https://github.com/Karinjs/Karin',
    '🚀 开始愉快的开发吧！',
  ].join('\n'))
}

/**
 * 修改鉴权秘钥
 * @param dir - 项目目录
 * @param http - http_server鉴权秘钥
 * @param ws - ws_server鉴权秘钥
 */
const setAuthKey = async (
  dir: string,
  http: string,
  ws: string
) => {
  ws = typeof ws === 'string' ? ws : ''
  const envPath = path.join(dir, '.env')
  const envContent = fs.readFileSync(envPath, 'utf-8')
  const content = envContent
    .replace(/HTTP_AUTH_KEY=(.+)/, `HTTP_AUTH_KEY=${http}`)
    .replace(/WS_SERVER_AUTH_KEY=(.+)/, `WS_SERVER_AUTH_KEY=${ws}`)
  fs.writeFileSync(envPath, content)
}
