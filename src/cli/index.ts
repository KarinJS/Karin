import fs from 'fs'
import path from 'path'
import yaml from 'yaml'
import axios from 'axios'
import { fileURLToPath } from 'url'
import { getRegistry } from './pkg'
import { exec as execCmd, spawn, ChildProcess, ExecOptions } from 'child_process'

export const enum Runner {
  Node = 'node',
  Tsx = 'tsx',
  Pm2 = 'pm2',
}

export const enum Mode {
  Dev = 'dev',
  Prod = 'prod',
}

export const enum Lang {
  Js = 'js',
  Ts = 'ts',
}

export class KarinCli {
  child: ChildProcess
  filename: string
  karinDir: string
  file: string

  constructor () {
    process.env.karin_app_start_count = '0'
    process.env.karin_app_watch = 'no'
    /** 当前文件绝对路径 */
    this.filename = fileURLToPath(import.meta.url)
    /** karin目录 */
    this.karinDir = path.join(path.dirname(this.filename), '../..')
    /** 入口文件(注意后缀) */
    this.file = path.join(path.dirname(this.filename), '../index.js')
    this.child = null as unknown as ChildProcess
    process.env.karin_app_pkg = getRegistry()
    process.env.karin_app_version = this.pkg(true).version
  }

  /**
   * 获取pkg配置
   * @param isNpm - 是否是npm包
   */
  pkg (isNpm: boolean) {
    const filePath = isNpm ? path.join(this.karinDir, 'package.json') : path.join(process.cwd(), 'package.json')
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    return data
  }

  /**
   * 获取配置文件路径
   * @param name - 配置文件名
   */
  getConfigPath (name: 'pm2' | 'server') {
    const filePath = `./config/config/${name}.yaml`
    if (!fs.existsSync(filePath)) return `${this.karinDir}/config/config/${name}.yaml`
    return filePath
  }

  /**
   * 获取pm2配置
   * @param name - 配置文件名
   */
  getConfigData (name: 'pm2' | 'server') {
    const _path = this.getConfigPath(name)
    const data = yaml.parse(fs.readFileSync(_path, 'utf-8'))
    return data
  }

  /**
   * 启动
   * @param mode - 模式
   * @param lang - 语言环境
   * @param runner - 运行器
   */
  start (mode: Mode, lang: Lang, runner: Runner) {
    process.env.karin_app_mode = mode
    process.env.karin_app_lang = lang
    process.env.karin_app_runner = runner

    let cmd: string[]

    switch (runner) {
      case Runner.Node:
        cmd = [this.file]
        break
      case Runner.Tsx:
        cmd = [this.file]
        break
      case Runner.Pm2: {
        this.pm2()
        return
      }
    }

    /** 启动 */
    this.child = spawn(runner, cmd, { stdio: ['inherit', 'inherit', 'inherit', 'ipc'], cwd: process.cwd(), env: process.env, shell: runner === Runner.Tsx })
    /** 监听退出 */
    this.child.once('exit', (code) => process.exit(code))
    /** 监听子进程消息 */
    this.child.on('message', (data: {
      action: 'result'
      env: NodeJS.ProcessEnv
    }) => {
      /** pm2重启 */
      if (data.env.pm_id) return this.restart()

      try {
        /** 先结束进程 */
        this.child.kill('SIGINT')
        /** 停止监听 */
        this.child.removeAllListeners()
        /** 重启次数+1 */
        const count = Number(process.env.karin_app_start_count) || 0
        process.env.karin_app_start_count = String(count + 1)
      } catch { }
      return this.start(mode, lang, runner)
    })
  }

  /**
   * pm2重启
   */
  async restart () {
    const pm2Cfg = this.getConfigData('pm2')
    const serverCfg = this.getConfigData('server')

    /** 尝试获取pm2的进程id */
    const port = serverCfg?.http?.port || 7000
    const res = await this.Axios(`http://127.0.0.1:${port}/api/ping`, 1000)
    if (res) {
      await this.exec(`pm2 restart ${res.pm2_id}`)
    } else {
      await this.exec(`pm2 restart ${pm2Cfg?.apps[0]?.name || 'Karin'}`)
    }

    console.log('pm2服务已重启')
    process.exit(0)
  }

  /**
   * pm2启动
   */
  async pm2 () {
    console.log('pm2启动中...')
    const filePath = this.getConfigPath('pm2')
    const data = this.getConfigData('pm2')

    /** 修正入口文件路径 兼容0.6.28以前的版本 */
    if (!fs.existsSync('./src') && filePath === './config/config/pm2.yaml') {
      const script = './node_modules/node-karin/lib/index.js'
      if (data.apps[0].script !== script) {
        data.apps[0].script = script
        fs.writeFileSync(filePath, yaml.stringify(data))
      }
    }

    const cmd = `pm2 start ${filePath} --env ${JSON.stringify(process.env)}`
    await this.exec(cmd)

    console.log('pm2服务已启动 可执行 【npx karin log】 查看日志')
    process.exit(0)
  }

  /**
   * pm2结束进程
   */
  async stop () {
    console.log('pm2服务停止中...')
    const pm2Cfg = this.getConfigData('pm2')
    const serverCfg = this.getConfigData('server')
    const port = serverCfg?.http?.port || 7000
    const res = await this.Axios(`http://127.0.0.1:${port}/api/ping`, 1000)
    if (res) {
      await this.exec(`pm2 delete ${res.pm2_id}`)
    } else {
      await this.exec(`pm2 delete ${pm2Cfg?.apps[0]?.name || 'Karin'}`)
    }

    console.log('pm2服务已停止')
    process.exit(0)
  }

  /**
   * pm2查看日志
   */
  async log () {
    const pm2Cfg = this.getConfigData('pm2')
    const serverCfg = this.getConfigData('server')
    const port = serverCfg?.http?.port || 7000
    const res = await this.Axios(`http://127.0.0.1:${port}/api/ping`, 1000)
    const lines = pm2Cfg?.lines || 1000
    const cmd = process.platform === 'win32' ? 'pm2.cmd' : 'pm2'

    const type = res ? res.pm_id : pm2Cfg?.apps[0]?.name || 'Karin'

    spawn(cmd, ['logs', type, '--lines', lines], { stdio: 'inherit', shell: true, cwd: process.cwd() })
  }

  /**
   * 更新依赖
   */
  async update () {
    /** 屏蔽的依赖包列表 */
    const pkgdependencies = [
      'art-template',
      'axios',
      'chalk',
      'chokidar',
      'commander',
      'express',
      'level',
      'lodash',
      'log4js',
      'moment',
      'node-schedule',
      'redis',
      'ws',
      'yaml',
    ]

    const list = Object.keys(this.pkg(false).dependencies).filter(key => !pkgdependencies.includes(key))

    /** 获取包管理器 */
    const pkg = getRegistry()
    const cmd = pkg === 'yarn' ? 'yarn upgrade' : `${pkg} update`

    await Promise.all(list.map(async item => {
      try {
        /** 检查是否已经是最新版本 */
        const local = await this.getLocalVersion(item, pkg)
        const remote = await this.getRemoteVersion(item, pkg)
        if (local === remote) {
          console.log(`[依赖更新] ${item} 已经是最新~`)
          return
        }

        console.log(`[依赖更新] ${item} 当前版本: ${local} 最新版本: ${remote}`)

        await this.exec(`${cmd} ${item}@latest`)
        console.log(`[依赖更新] ${item} 更新完成~`)
      } catch (error: any) {
        console.error(`[依赖更新] ${item} 更新失败:`)
        console.error(error.stack || error.message || error)
      }
    }))

    console.log('[依赖更新] 所有npm依赖已更新完成~')
    console.log('[依赖更新] 开始更新git插件...')
    const gitList = this.getGitPlugins()
    if (!gitList.length) return console.log('[依赖更新] 没有git插件需要更新~')

    await Promise.all(gitList.map(async item => {
      const dir = path.resolve(process.cwd(), 'plugins', item)
      try {
        await this.exec('git pull', { cwd: dir })
        console.log(`[依赖更新] ${item} 更新完成~`)
      } catch (error: any) {
        console.error(`[依赖更新] ${item} 更新失败`)
        console.error(error.stack || error.message || error)
      }
    }))
    console.log('[依赖更新] 所有git插件已更新完成~')
  }

  /**
   * 获取指定包的本地版本
   * @param name - 包名
   * @param pkg - 包管理器
   * @returns - 版本号
   */
  async getLocalVersion (name: string, pkg: 'pnpm' | 'cnpm' | 'yarn' | 'npm') {
    const cmd = pkg === 'yarn' ? `yarn list --pattern ${name}` : `${pkg} list ${name} --depth=0`
    const text = await this.exec(cmd)

    /** pnpm特殊处理 */
    if (pkg === 'pnpm') {
      const reg = new RegExp(`${name}\\s+([\\d.]+)`, 'gm')
      const res = reg.exec(text)
      return res?.[1] || '0.0.0'
    }

    const reg = new RegExp(`${name}@(\\d+\\.\\d+\\.\\d+)`, 'gm')
    const res = reg.exec(text)
    return res?.[1] || '0.0.0'
  }

  /**
   * 获取指定包的最新版本
   * @param name - 包名
   * @param pkg - 包管理器
   */
  async getRemoteVersion (name: string, pkg: 'pnpm' | 'cnpm' | 'yarn' | 'npm') {
    const cmd = `${pkg} info ${name} version`
    const text = await this.exec(cmd)
    /** yarn特殊处理 */
    if (pkg === 'yarn') {
      const lines = text.split('\n').map(line => line.trim())
      const ver = lines.find(line => /^\d+\.\d+\.\d+$/.test(line))
      return ver || ''
    }

    return text.trim()
  }

  /**
   * 获取git插件列表
   */
  getGitPlugins (): Array<string> {
    const dir = path.resolve(process.cwd(), 'plugins')
    let list = fs.readdirSync(dir, { withFileTypes: true })
    /** 忽略非文件夹、非 karin-plugin-开头的文件夹 */
    list = list.filter(v => v.isDirectory() && v.name.startsWith('karin-plugin-'))
    list = list.filter(v => fs.existsSync(`${dir}/${v.name}/package.json`))
    const arr: string[] = []
    list.map(v => arr.push(v.name))
    return arr
  }

  /**
   * 封装exec
   * @param cmd - 命令
   */
  exec (cmd: string, options?: ExecOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      execCmd(cmd, options, (error, stdout, stderr) => {
        if (stdout) return resolve(stdout.toString().trim())
        if (error) return reject(error)
        return reject(stderr)
      })
    })
  }

  /**
   * 封装axios 超时返回false
   * @param url - 请求地址
   * @param timeout - 超时时间
   * @returns - 请求结果
   */
  async Axios (url: string, timeout: number) {
    try {
      const res = await axios.get(url, { timeout })
      return res.data
    } catch {
      return false
    }
  }
}
