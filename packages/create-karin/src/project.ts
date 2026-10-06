import ora from 'ora'
import fs from 'node:fs'
import path from 'node:path'
import { exec, getExecErrorMessage } from './utils/exec'
import { cleanPkgAfterPnpmInit, prepareWorkspace } from './utils/workspace'
import { detectPnpm } from './utils/pnpm'
import { fileURLToPath } from 'node:url'
import { green, magenta, yellow } from 'kolorist'
import type { Version } from '../../cli-Internal/src/workspace'

/**
 * 创建生产环境项目
 * @param projectName - 项目名称
 * @param registrySuffix - 镜像源后缀
 * @param httpAuthKey - http鉴权秘钥
 * @param wsAuthKey - ws鉴权秘钥
 * @param karinVersion - node-karin版本，可以是版本号或URL
 */
export const createProject = async (
  projectName: string,
  registrySuffix: string,
  httpAuthKey: string,
  wsAuthKey: string,
  karinVersion: string = 'latest'
) => {
  const spinner = ora('📦 正在创建项目目录...').start()
  const dir = path.join(process.cwd(), projectName)
  fs.mkdirSync(dir, { recursive: true })
  spinner.succeed(green('✨ 项目目录结构创建完成'))

  createGitignore(dir, spinner)

  spinner.start(`正在安装 node-karin@${karinVersion}...`)
  await exec('pnpm init', { cwd: dir })
  /** 移除 pnpm init 写入的 devEngines/packageManager (pnpm 10+) 避免pnpm托管node或pnpm版本 */
  cleanPkgAfterPnpmInit(dir)
  /** 预写入跨版本兼容配置 pnpm 11+ 默认阻止未声明构建脚本的依赖安装、拦截发布未满24h的版本 */
  prepareWorkspace(dir, (await detectPnpm()).parsed)
  /** pnpm-workspace.yaml 含 packages 字段 需要 -w 才能安装到根目录 */
  const cmd = `pnpm add node-karin@${karinVersion}${registrySuffix} -w`
  const { error, stderr } = await exec(cmd, { cwd: dir })

  if (error) throw error
  if (stderr) console.log(stderr)
  spinner.succeed(green(`✨ node-karin@${karinVersion} 安装成功`))

  spinner.start('正在执行初始化...')
  await runKarinInit(dir)
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
    'docs: https://karinjs.com',
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
 * @param karinVersion - node-karin版本，可以是版本号或URL
 */
export const createPlugin = async (
  type: 'karin-plugin-ts' | 'karin-plugin-js',
  projectName: string,
  registrySuffix: string,
  httpAuthKey: string,
  wsAuthKey: string,
  karinVersion: string = 'latest'
) => {
  const spinner = ora('📦 正在创建项目目录...').start()
  const dir = path.join(process.cwd(), projectName)
  fs.mkdirSync(dir, { recursive: true })
  spinner.succeed(green('✨ 项目目录结构创建完成'))

  spinner.start('正在复制模板...')
  const templatePath = path.join(fileURLToPath(import.meta.url), '../../templates', type)
  fs.cpSync(templatePath, dir, { recursive: true })
  const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf-8'))
  pkg.name = projectName
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2))
  spinner.succeed(green('✨ 模板复制完成'))

  createGitignore(dir, spinner)

  spinner.start(`正在安装 node-karin@${karinVersion}...`)
  /** 预写入跨版本兼容配置 pnpm 11+ 默认阻止未声明构建脚本的依赖安装、拦截发布未满24h的版本 */
  prepareWorkspace(dir, (await detectPnpm()).parsed, true)
  /** pnpm-workspace.yaml 含 packages 字段 需要 -w 才能安装到根目录 */
  const karinCmd = `pnpm add -D node-karin@${karinVersion}${registrySuffix} -w`
  const { error: karinError, stderr: karinStderr } = await exec(karinCmd, { cwd: dir })
  if (karinError) throw karinError
  if (karinStderr) console.log(karinStderr)
  spinner.succeed(green(`✨ node-karin@${karinVersion} 安装成功`))

  spinner.start('正在执行初始化...')
  await runKarinInit(dir)
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
    'docs: https://karinjs.com',
    '点个star吧：https://github.com/Karinjs/Karin',
    '🚀 开始愉快的开发吧！',
  ].join('\n'))
}

/**
 * 修复当前目录的生产环境：合并 pnpm-workspace.yaml 兼容配置 → 安装 node-karin → karin init
 * @param cwd - 项目目录
 * @param karinVersion - node-karin版本，可以是版本号或URL
 * @param registrySuffix - 镜像源后缀
 * @param version - 当前pnpm版本 未知时传null
 * @returns 是否修复成功
 */
export const fixProject = async (
  cwd: string,
  karinVersion: string,
  registrySuffix: string,
  version: Version | null
) => {
  const spinner = ora()

  /** 移除 pnpm init 写入的 devEngines/packageManager (pnpm 10+) 并合并跨版本兼容配置 已存在的 pnpm-workspace.yaml 同样需要补全 */
  cleanPkgAfterPnpmInit(cwd)
  prepareWorkspace(cwd, version)

  spinner.start(`正在安装 node-karin@${karinVersion}...`)
  /** pnpm-workspace.yaml 含 packages 字段 需要 -w 才能安装到根目录 */
  const install = await exec(`pnpm add node-karin@${karinVersion}${registrySuffix} -w`, { cwd })
  if (install.error) {
    spinner.fail('node-karin安装失败: ' + getExecErrorMessage(install))
    return false
  }
  spinner.succeed(`node-karin@${karinVersion} 安装成功`)

  spinner.start('正在初始化Karin环境...')
  try {
    await runKarinInit(cwd)
  } catch (error) {
    spinner.fail('Karin初始化失败: ' + (error as Error).message)
    return false
  }
  spinner.succeed('Karin环境初始化完成')
  return true
}

/**
 * 执行 karin init
 * @param cwd - 项目目录
 * @throws 执行失败时抛出错误 (exec 本身不会抛出)
 */
const runKarinInit = async (cwd: string) => {
  const result = await exec('npx karin init', { cwd })
  if (result.error) throw new Error(getExecErrorMessage(result))
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

/**
 * 创建 .gitignore 文件
 * @param dir - 项目目录
 * @param spinner - ora spinner 实例
 */
const createGitignore = (dir: string, spinner: ReturnType<typeof ora>) => {
  const gitignorePath = path.join(dir, '.gitignore')
  if (!fs.existsSync(gitignorePath)) {
    const gitignoreContent = `
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Diagnostic reports (https://nodejs.org/api/report.html)
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage
*.lcov

# nyc test coverage
.nyc_output

# Grunt intermediate storage (https://gruntjs.com/creating-plugins#storing-task-files)
.grunt

# Bower dependency directory (https://bower.io/)
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons (https://nodejs.org/api/addons.html)
build/Release

# Dependency directories
node_modules/
jspm_packages/

# Snowpack dependency directory (https://snowpack.dev/)
web_modules/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional stylelint cache
.stylelintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarnclean

# dotenv environment variables file
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# parcel-bundler cache files
.cache
.parcel-cache

# Next.js build output
.next
out

# Nuxt.js build output
.nuxt
dist

# Gatsby files
.cache/
# Add history to Gatsby .gitignore by default (https://github.com/gatsbyjs/gatsby/pull/14967)
public

# vuepress build output
.vuepress/dist

# SvelteKit build output
.svelte-kit

# Docusaurus build output
.docusaurus

# Remix build files
.cache/
build/
public/build/

# Hexo build output
public

# Strapi build output
build

# Temporary files created by Verdaccio
.verdaccio-storage.json

# Optional VS Code files
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
*.code-workspace

# Optional JetBrains Rider files
.idea
*.sln
*.suo
`
    fs.writeFileSync(gitignorePath, gitignoreContent.trim())
    spinner.succeed(green('✨ .gitignore 文件创建成功'))
  } else {
    spinner.info(yellow('ℹ️ .gitignore 文件已存在，跳过创建'))
  }
}
