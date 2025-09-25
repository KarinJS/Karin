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
  const cmd = `pnpm install node-karin@${karinVersion}${registrySuffix}`
  const { error, stderr } = await exec(cmd, { cwd: dir })

  if (error) throw error
  if (stderr) throw new Error(stderr)
  spinner.succeed(green(`✨ node-karin@${karinVersion} 安装成功`))

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
  const karinCmd = `pnpm install -D node-karin@${karinVersion}${registrySuffix}`
  const { error: karinError, stderr: karinStderr } = await exec(karinCmd, { cwd: dir })
  if (karinError) throw karinError
  if (karinStderr) throw new Error(karinStderr)
  spinner.succeed(green(`✨ node-karin@${karinVersion} 安装成功`))

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
    'docs: https://karinjs.com',
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
