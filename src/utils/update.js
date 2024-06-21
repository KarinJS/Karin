import fs from 'fs'
import exec from './exec'

export default class Update {
  constructor () {
    this.dir = './plugins'
  }

  /**
   * 获取插件列表 拥有packageon才会被识别
   * @returns {string[]}
   */
  getPlugins () {
    const list = []
    const files = fs.readdirSync(this.dir, { withFileTypes: true })
    /** 忽略非文件夹、非karin-plugin-开头的文件夹或/karin-adapter-开头的文件夹 */
    files.forEach(file => {
      if (!file.isDirectory()) return
      if (!file.name.startsWith('karin-plugin-') && !file.name.startsWith('karin-adapter-')) return
      if (!fs.existsSync(`${this.dir}/${file.name}/packageon`)) return
      list.push(file.name)
    })
    return list
  }

  /**
   * 更新框架或插件
   * @param {string} path - 插件相对路径
   * @param {string} cmd - 执行命令
   * @param {number} time - 超时时间 默认120s
   * @returns {promise<{status: 'ok'|'failed', data: string}>}
   */
  async update (path, cmd = 'git pull', time = 120) {
    /** 检查一下路径是否存在 */
    if (!fs.existsSync(path)) return { status: 'failed', data: '路径不存在' }
    /** 检查是否有.git文件夹 */
    if (!fs.existsSync(`${path}/.git`)) return { status: 'failed', data: '该路径不是一个git仓库' }

    /** 设置超时时间 */
    const timer = setTimeout(() => { return { status: 'failed', data: '执行超时' } }, time * 1000)

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
          data: [
            '\n当前版本已是最新版本',
            `Hash: ${hash}`,
            `最后更新：${await this.getCommit({ path, count: 1 })}`,
            `最后提交时间：${time}`,
          ].join('\n'),
        }
      }
      const Commit = await this.getCommit({ path, hash })
      return {
        status: 'ok',
        data: [
          '\n更新成功',
          `当前Hash: ${newHash}`,
          `更新日志：\n${Commit}`,
        ].join('\n'),
      }
    }

    const msg = [
      '\n更新失败',
      `当前Hash: ${hash}`,
      `错误信息：${error?.message?.toString() || error?.stack?.toString() || error?.toString()}`,
      '请解决错误后重试或执行【#强制更新】',
    ]
    return { status: 'failed', data: msg.join('\n') }
  }

  /**
   * 获取指定仓库最后一次提交时间日期
   * @param {string} path - 插件相对路径
   * @returns {Promise<string>}
   */
  async getTime (path) {
    const cmd = 'git log -1 --format=%cd --date=format:"%Y-%m-%d %H:%M:%S"'
    const data = await exec(cmd, false, { env: process.env, cwd: path, encoding: 'utf-8' })
    if (data.status === 'failed') return '获取时间失败，请重试或更新Git~'
    return data.stdout.trim()
  }

  /**
   * 获取指定仓库最后一次提交哈希值
   * @param {string} path - 插件相对路径
   * @param {boolean} [short] - 是否获取短哈希 默认true
   * @returns {Promise<string>}
   */
  async getHash (path, short = true) {
    const cmd = short ? 'git rev-parse --short HEAD' : 'git rev-parse HEAD'
    const data = await exec(cmd, false, { env: process.env, cwd: path, encoding: 'utf-8' })
    if (data.status === 'failed') throw new Error(data.error)
    return data.stdout.trim()
  }

  /**
   * 获取指定仓库的提交记录
   * @param {{
   *  path: string,
   *  count?: number,
   *  hash?: string
   * }} options - 参数
   * @param {string} options.path - 插件相对路径
   * @param {number} [options.count] - 获取日志条数 默认1条
   * @param {string} [options.hash] - 指定HEAD
   * @returns {Promise<string>}
   */
  async getCommit (options) {
    const { path, count = 1, hash, branch } = options
    let cmd = `git log -${count} --format="[%ad]%s %n" --date="format:%m-%d %H:%M"`
    /** 键入HEAD */
    if (hash) cmd = `git log ${hash}..HEAD --format="[%ad] %s %n" --date="format:%m-%d %H:%M"`
    /** 指定分支 */
    if (branch) cmd = `git log -${count} ${branch} --format="[%ad] %s %n" --date="format:%m-%d %H:%M"`
    const data = await exec(cmd, false, { env: process.env, cwd: path, encoding: 'utf-8' })
    if (data.status === 'failed') throw new Error(data.error)
    return data.stdout.trim()
  }

  /**
   * 检查插件是否有更新
   * @param {string} path - 插件相对路径
   * @param {number} [time] - 超时时间 默认120s
   * @returns {Promise<{status: 'ok'|'failed', data: string|boolean}>}
   */
  async checkUpdate (path, time = 120) {
    /** 检查一下路径是否存在 */
    if (!fs.existsSync(path)) return { status: 'failed', data: '路径不存在' }
    /** 检查是否有.git文件夹 */
    if (!fs.existsSync(`${path}/.git`)) return { status: 'failed', data: '该路径不是一个git仓库' }

    /** 设置超时时间 */
    const timer = setTimeout(() => { return { status: 'failed', data: '执行超时' } }, time * 1000)

    const options = { env: process.env, cwd: path, encoding: 'utf-8' }
    /** git fetch origin */
    const { status, error } = await exec('git fetch origin', false, options)
    if (status === 'failed') return { status: 'failed', data: error.message }
    /** git status -uno */
    const { stdout } = await exec('git status -uno', false, options)
    clearTimeout(timer)
    /** 检查是否有更新 没更新直接返回 */
    if (stdout.includes('Your branch is up to date with')) return { status: 'ok', data: false }
    /** 获取落后几次更新 */
    const count = stdout.match(/Your branch is behind '.*' by (\d+) commits/)?.[1] || 1
    const data = await this.getCommit({ path, count, branch: 'origin' })
    return { status: 'ok', data, count }
  }
}
