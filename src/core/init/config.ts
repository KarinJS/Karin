import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
/** 必须详细指向根文件 否则会导致模块乱导入 */
import { karinDir } from 'karin/core/init/dir'

export class KarinCfgInit {
  /**
   * 基础目录
   */
  baseDir: string[]
  constructor () {
    this.baseDir = [
      './config/config',
      './config/view',
      './config/plugin',
      './temp/input',
      './temp/html',
      './plugins/karin-plugin-example',
    ]
  }

  init () {
    this.baseDir.forEach(dir => this.mkdir(dir))
    /** 非src源代码环境才创建 */
    if (!fs.existsSync('./src')) {
      this.copyFile()
      this.modifyPackage()
    }
  }

  /**
   * 递归创建目录
   * @param dirname - 路径
   */
  mkdir (dirname: string): boolean {
    if (fs.existsSync(dirname)) return true
    if (this.mkdir(path.dirname(dirname))) fs.mkdirSync(dirname)
    return true
  }

  /**
   * 解析json
   */
  readJson (file: string): any {
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
  }

  /**
   * 获取插件列表
   */
  getPlugins (): string[] {
    const pluginsDir = './plugins' as './plugins'
    const plugins = fs.readdirSync(pluginsDir)
    return plugins.filter(dir => dir.startsWith('karin-plugin-'))
  }

  /**
   * 从npm包内复制默认配置出来
   */
  copyFile () {
    /** 配置 */
    const list = ['config/view']
    list.forEach(dir => {
      const pkgDir = path.join(karinDir, dir)
      const projDir = path.join(process.cwd(), dir)
      /** 清空projDir目录下的文件 保留目录 */
      if (fs.existsSync(projDir)) fs.rmSync(projDir, { recursive: true })
      this.mkdir(projDir)
      /** 读取pkgDir目录下的所有文件 复制到projDir下 */
      const files = fs.readdirSync(pkgDir).filter(file => file.endsWith('.yaml'))
      files.forEach(file => {
        const destPath = path.join(projDir, file)
        const srcPath = path.join(pkgDir, file)
        fs.copyFileSync(srcPath, destPath)
      })
    })

    /** 创建pnpm工作区配置 */
    fs.writeFileSync('./pnpm-workspace.yaml', `packages:\n  - 'plugins/**'\n`)

    /** 为每个插件包创建统一存储的文件夹 */
    const plugins = this.getPlugins()
    const DataList = [
      'data',
      'temp',
      'resources',
      'temp/html',
      'config/plugin',
    ]

    DataList.forEach(_path => {
      _path = path.join(process.cwd(), _path)
      plugins.forEach(plugin => this.mkdir(path.join(_path, plugin)))
    })
  }

  /**
   * 修改package.json以支持运行
   */
  modifyPackage () {
    const pkg = this.readJson(path.join(karinDir, 'package.json'))
    const projPkg = this.readJson('./package.json')

    const main = 'node_modules/node-karin/lib/index.js'

    delete pkg.bin
    pkg.main = `./${main}`
    pkg.types = `./${main.replace('.js', '.d.ts')}`
    pkg.dependencies = { ...projPkg.dependencies, ...pkg.dependencies }
    pkg.devDependencies = { ...projPkg.devDependencies, ...pkg.devDependencies }

    projPkg.type = 'module'
    projPkg.private = true
    projPkg.main = `./${main}`
    projPkg.dependencies = { ...projPkg.dependencies, ...pkg.dependencies }
    projPkg.dependencies['node-karin'] = 'latest'
    projPkg.dependencies['kritor-proto'] = 'latest'

    if (!projPkg.scripts) projPkg.scripts = {}
    if (!projPkg.devDependencies) projPkg.devDependencies = {}

    projPkg.scripts.debug = `node --watch ${main}`
    projPkg.scripts.dev = `tsx --watch ${main}`

    fs.writeFileSync('./package.json', JSON.stringify(projPkg, null, 2))
  }

  /**
   * 更换镜像源为淘宝源
   */
  async changeRegistry (host: string) {
    const cmd = `npm config set registry ${host}`
    // 检查当前镜像源是否为淘宝源
    const registry = await this.shell('npm config get registry')
    if (registry === host) {
      console.log(`当前npm源已经是 ${host} ~`)
      return
    }

    if (!await this.shell(cmd)) {
      console.log('更换npm源失败，请手动更换npm源！')
      console.log(`可尝试手动执行 【 npm config set registry ${host} 】 更换镜像源~`)
    } else {
      console.log('更换npm源成功~')
    }
  }

  /**
   * 安装pnpm或者yarn
   * @param type - 包管理器名称
   */
  async install (type: 'pnpm' | 'yarn' | 'cnpm' | 'npm') {
    /** 检查是否已经安装对应的包管理器 */
    if (!(await this.shell(`${type} -v`))) {
      console.log(`检测到未安装${type}，开始安装...`)
      if (!await this.shell(`npm install -g ${type}`)) {
        console.log(`${type}安装失败，请手动安装${type}！`)
        console.log(`可尝试手动执行 【 npm install -g ${type} 】 安装${type}~`)
        return
      } else {
        console.log(`${type}安装完成~`)
      }
    } else {
      console.log('检测到已安装pnpm，开始安装依赖...')
    }

    /** 安装依赖 */
    if (!(await this.shell(`${type} -P --force`))) {
      console.log('安装依赖失败，请手动安装依赖！')
      console.log(`可尝试手动执行 【 ${type} install -P 】 安装依赖~`)
      console.log('如中国大陆用户安装失败，请尝试执行换源 【 npm config set registry https://registry.npmmirror.com 】后再安装依赖~')
    } else {
      console.log('依赖安装完成~')
    }

    /** 检查安装pm2 */
    if (!(await this.shell('pm2 -v'))) {
      console.log('检测到未安装pm2，开始安装pm2...')
      if (!(await this.shell(`${type} install -g pm2`))) {
        console.log('安装pm2失败，请手动安装pm2！')
        console.log('可尝试手动执行 【 npm install -g pm2 】 安装pm2~')
      } else {
        console.log('pm2安装完成~')
      }
    } else {
      console.log('检测到已安装pm2~')
    }

    console.log('依赖环境初始化完成~')
  }

  /**
   * 执行命令
   * @param cmd - 命令
   */
  shell (cmd: string) {
    return new Promise(resolve => {
      exec(cmd, { env: process.env, cwd: process.cwd() }, (err, stdout, stderr) => {
        if (stdout) return resolve(stdout.trim())
        if (err) {
          console.error(err)
          return resolve(false)
        }
        if (stderr) {
          console.error(stderr)
          return resolve(false)
        }
      })
    })
  }

  /**
   * 获取当前的包管理器 根据锁文件判断
   */
  getRegistry (): 'pnpm' | 'cnpm' | 'yarn' | 'npm' {
    if (fs.existsSync('./pnpm-lock.yaml')) return 'pnpm'
    if (fs.existsSync('./yarn.lock')) return 'yarn'
    if (fs.existsSync('./package-lock.json')) return 'npm'
    // cnpm 没有锁文件
    return 'cnpm'
  }
}
