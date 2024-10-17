import fs from 'node:fs'
import exec from './exec'
import { KarinCli } from 'karin/cli/index'
import { getRegistry } from 'karin/cli/pkg'

export class Updates {
  dir: string
  constructor () {
    this.dir = './plugins'
  }

  /**
   * 更新npm包
   * @param name - 包名
   * @param timeout - 超时时间 默认120s
   */
  async updatePkg (name: string, timeout: number = 120) {
    const pkg = getRegistry()
    const cmd = (pkg === 'yarn' ? 'yarn upgrade' : `${pkg} update`) + `${name}@latest`

    /** 检查是否已经是最新版本 */
    const tools = new KarinCli()
    const local = await tools.getLocalVersion(name, pkg)
    const remote = await tools.getRemoteVersion(name, pkg)
    logger.info(`[依赖更新] ${name} 当前版本: ${local} 最新版本: ${remote}`)

    if (local === remote) return { status: true, data: `${name} 已经是最新版本~` }

    const npm = await exec(cmd, true, { cwd: process.cwd(), timeout: timeout * 1000 })

    if (npm.status === 'ok') return { status: true, data: `${name} 更新完成~` }
    return { status: false, data: `${name} 更新失败: ${npm.error?.message}` }
  }

  /**
   * 更新框架或插件
   * @param path - 插件相对路径
   * @param cmd - 更新命令 默认git pull
   * @param timeout - 超时时间 默认120s
   */
  async update (path: string, cmd = 'git pull', timeout = 120) {
    /** 检查一下路径是否存在 */
    if (!fs.existsSync(path)) return { status: 'failed', data: '路径不存在' }
    /** 检查是否有.git文件夹 */
    if (!fs.existsSync(`${path}/.git`)) return { status: 'failed', data: '该路径不是一个git仓库' }

    /** 设置超时时间 */
    const timer = setTimeout(() => {
      return { status: 'failed', data: '执行超时' }
    }, timeout * 1000)

    const options = { env: process.env, cwd: path, encoding: 'utf-8' }
    /** 记录当前短哈希 */
    const hash = await this.getHash(path)

    /** 执行更新 */
    const { status, error } = await exec(cmd, true, options)

    /** 执行成功 */
    if (status === 'ok') {
      clearTimeout(timer)
      /** 再次获取短哈希 查看是否有更新 */
      const newHash = await this.getHash(path)
      if (hash === newHash) {
        const time = await this.getTime(path)
        return {
          status: 'ok',
          data: `\n当前版本已是最新版本\n最后更新时间：${time}\n更新详情：${await this.getCommit({ path, count: 1 })}`,
        }
      }
      const Commit = await this.getCommit({ path, hash })
      return {
        status: 'ok',
        data: `\n更新成功\n更新日志：\n${Commit}`,
      }
    }

    const data = `\n更新失败\n错误信息：${error?.stack?.toString() || error?.message?.toString() || error?.toString() || error}\n请解决错误后重试或执行【#强制更新】`
    return { status: 'failed', data }
  }

  /**
   * 获取指定仓库最后一次提交时间日期
   * @param path - 插件相对路径
   */
  async getTime (path: string) {
    const cmd = 'git log -1 --format=%cd --date=format:"%Y-%m-%d %H:%M:%S"'
    const data = await exec(cmd, false, { cwd: path })
    if (data.status === 'failed') return '获取时间失败，请重试或更新Git~'
    return data.stdout.trim()
  }

  /**
   * 获取指定仓库最后一次提交哈希值
   * @param path - 插件相对路径
   * @param short - 是否获取短哈希 默认true
   */
  async getHash (path: string, short = true) {
    const cmd = short ? 'git rev-parse --short HEAD' : 'git rev-parse HEAD'
    const data = await exec(cmd, false, { cwd: path })
    if (data.status === 'failed') {
      const text = data.error as unknown as string
      throw new Error(text)
    }
    return data.stdout.trim()
  }

  /**
   * 获取指定仓库的提交记录
   */
  async getCommit (options: {
    /** 指令命令路径 */
    path: string
    /** 获取几次提交 默认1次 */
    count?: number
    /** 指定哈希 */
    hash?: string
    /** 指定分支 */
    branch?: string
  }) {
    const { path, count = 1, hash, branch } = options
    let cmd = `git log -${count} --format="[%ad]%s %n" --date="format:%m-%d %H:%M"`
    /** 键入HEAD */
    if (hash) cmd = `git log ${hash}..HEAD --format="[%ad] %s %n" --date="format:%m-%d %H:%M"`
    /** 指定分支 */
    if (branch) cmd = `git log -${count} ${branch} --format="[%ad] %s %n" --date="format:%m-%d %H:%M"`
    const data = await exec(cmd, false, { cwd: path })
    if (data.status === 'failed') {
      const text = data.error as unknown as string
      throw new Error(text)
    }
    return data.stdout.trim()
  }

  /**
   * 检查插件是否有更新
   * @param path - 插件相对路径
   * @param time - 超时时间 默认120s
   */
  async checkUpdate (path: string, time = 120) {
    /** 检查一下路径是否存在 */
    if (!fs.existsSync(path)) return { status: 'failed', data: '路径不存在' }
    /** 检查是否有.git文件夹 */
    if (!fs.existsSync(`${path}/.git`)) return { status: 'failed', data: '该路径不是一个git仓库' }

    /** 设置超时时间 */
    const timer = setTimeout(() => {
      return { status: 'failed', data: '执行超时' }
    }, time * 1000)

    const options = { env: process.env, cwd: path as string, encoding: 'utf-8' }
    /** git fetch origin */
    const { status, error } = await exec('git fetch origin', false, options)
    if (status === 'failed') return { status: 'failed', data: error?.message }
    /** git status -uno */
    const { stdout } = await exec('git status -uno', false, options)
    clearTimeout(timer)
    /** 检查是否有更新 没更新直接返回 */
    if (stdout.includes('Your branch is up to date with')) return { status: 'ok', data: false }
    /** 获取落后几次更新 */
    const count = Number(stdout.match(/Your branch is behind '.*' by (\d+) commits/)?.[1]) || 1
    const data = await this.getCommit({ path, count, branch: 'origin' })
    return { status: 'ok', data, count }
  }
}
export const update = new Updates()
export const Update = update
