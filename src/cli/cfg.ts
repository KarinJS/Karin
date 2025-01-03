#!/usr/bin/env node

/**
 * @description 初始化入口文件
 */
export const initIndex = async () => {
  const fs = await import('fs').then((res) => res.default)
  const root = process.env.INIT_CWD || process.cwd()
  const indexPath = `${root}/index.js`

  /** 创建入口 */
  if (!fs.existsSync(indexPath)) {
    fs.writeFileSync(indexPath, 'import(\'node-karin\').then(karin => karin.run())\n')
  }
}

/**
 * @description 初始化基本配置
 */
export const init = async () => {
  try {
    const fs = await import('fs').then((res) => res.default)

    const root = process.env.INIT_CWD || process.cwd()
    const pnpmPath = `${root}/pnpm-workspace.yaml`
    const npmrcPath = `${root}/.npmrc`

    /** 创建入口 */
    initIndex()

    const { init } = await import('@/utils/config/index')
    init()

    const list = [
      '.vscode',
      '.idea',
      '.github',
      'src',
      'tsconfig.json',
      'jsconfig.json',
      'LICENSE',
      'README.md',
      '.gitignore',
      'CHANGELOG.md',
    ]

    /** 创建.pnpmfile.cjs */
    const pnpmfile = `${root}/.pnpmfile.cjs`
    if (!fs.existsSync(pnpmfile)) {
      const data = `
// 清空对等依赖中的node-karin
function readPackage (pkg, context) {
  if (pkg?.['peerDependencies']?.['node-karin'] && pkg['peerDependencies']['node-karin'] !== 'file:./lib') {
    delete pkg['peerDependencies']['node-karin']
  }
  return pkg
}

module.exports = {
  hooks: {
    readPackage,
  },
}
`
      fs.writeFileSync(pnpmfile, data.trim())
    }

    /** 只要有任何一项文件存在 则代表是插件开发环境 不作为正式环境 */
    if (!list.some((item) => fs.existsSync(`${root}/${item}`))) {
      /** 创建pnpm工作区配置 */
      if (!fs.existsSync(pnpmPath)) {
        fs.writeFileSync(pnpmPath, 'packages:\n  - \'plugins/**\'\n')
      }

      /** 创建plugins文件夹 */
      const pluginsFolder = `${root}/plugins/karin-plugin-example`
      if (!fs.existsSync(pluginsFolder)) {
        fs.mkdirSync(pluginsFolder, { recursive: true })
      }
    }

    /** 修改当前环境为esm */
    const packagePath = `${root}/package.json`
    if (fs.existsSync(packagePath)) {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
      if (!packageJson.type || packageJson.type !== 'module') {
        packageJson.type = 'module'
        fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2))
      }
    }

    /** 根据当前npm源来决定是否设置镜像源 */
    if (!fs.existsSync(npmrcPath)) {
      const { exec } = await import('@/utils/system/exec')
      const { stdout } = await exec('npm config get registry')
      if (!stdout || stdout.includes('registry.npmjs.org')) return

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

      fs.writeFileSync(`${process.cwd()}/.npmrc`, list.join('\n'))
    }

    /** 检查是否安装pm2 */
    const { promisify } = await import('util')
    const { exec } = await import('child_process')
    const execAsync = promisify(exec)
    const { stderr } = await execAsync('pm2 -v')
    if (stderr) {
      console.log('[pm2] 未安装pm2 开始安装...')
      const result = await execAsync('npm install -g pm2')
      if (result.stderr) {
        console.log('[pm2] 安装失败 请手动安装pm2后再次运行: npm install -g pm2')
      } else {
        console.log('[pm2] 安装成功')
      }
    }
  } finally {
    process.exit()
  }
}
