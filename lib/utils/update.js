import fs from 'fs'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const { exec } = require('child_process')

export default class Update {
  /**
   * 获取框架、插件更新日志
   * @param {{
   *   name?: string,
   *   count?: number,
   *   output?: string,
   *   date?: string
   * }} options
   * @param {string} [options.name] - 插件名称 默认"karin"
   * @param {number} [options.count] - 获取日志条数 默认10条
   * @param {string} [options.output] - 日志输出格式 默认"[%ad]%s %n"
   * @param {string} [options.date] - 日志日期格式 默认"format:%m-%d %H:%M"
   * @returns {{
   *   ok: boolean,
   *   data: string
   * }}
   */
  async log ({
    name,
    count,
    output = '"[%ad]%s %n"',
    date = '"format:%m-%d %H:%M"'
  }) {
    if (!count) count = 10
    if (!name) name = 'karin'
    const path = name === 'karin' ? './' : `./plugins/karin-plugin-${name}`

    /** 检查一下路径是否存在 */
    if (!fs.existsSync(path)) {
      return { ok: false, data: '该插件路径不存在' }
    }

    /** 检查是否有.git文件夹 */
    if (!fs.existsSync(path + '/.git')) {
      return { ok: false, data: '该插件没有.git文件夹，无法获取更新日志' }
    }

    try {
      const cmd = `git log -${count} --format=${output} --date=${date}`
      const { data } = await this.cmd(cmd, path)
      return { ok: true, data }
    } catch (error) {
      const { data } = error
      return { ok: false, data }
    }
  }

  /**
   * 更新框架或插件
   * @param {string} [options.name] - 插件名称 默认"karin"
   * @param {string} [options.cmd] - 执行命令 默认"git pull"
   * @returns {{
   *   ok: boolean,
   *   data: string
   * }}
   */
  async update (name, cmd) {
    if (!name) name = 'karin'
    if (!cmd) cmd = 'git pull'
    const path = name === 'karin' ? './' : `./plugins/karin-plugin-${name}`

    /** 检查一下路径是否存在 */
    if (!fs.existsSync(path)) {
      return { ok: false, data: '该插件路径不存在' }
    }

    /** 检查是否有.git文件夹 */
    if (!fs.existsSync(`${path}/.git`)) {
      return { ok: false, data: '该插件没有.git文件夹，无法执行命令' }
    }

    let data
    let timer = setTimeout(() => {
      return this.errorMsg({ ok: false, data: new Error('执行超时') }, '执行超时', '执行 git pull 超时，请检查网络连接或稍后重试')
    }, 2 * 60 * 1000)

    try {
      data = await this.cmd(cmd, path)
      clearTimeout(timer)
    } catch (error) {
      clearTimeout(timer)
      return { ok: false, data: error.message }
    }

    if (data.ok) {
      if (/(Already up to date|已经是最新版本)/i.test(data.data)) {
        return { ok: true, data: '当前版本已是最新版本' }
      } else {
        return { ok: true, data: '更新成功' }
      }
    } else {
      const { data: errorData } = data
      switch (Number(errorData.status)) {
        case 1:
          if (errorData.stderr.includes('Permission denied')) {
            return this.errorMsg(errorData, '权限不足', '权限不足，请确保有足够的权限后重新执行命令')
          } else if (errorData.stderr.includes('be overwritten by merge')) {
            return this.errorMsg(errorData, '文件冲突', 'Git试图将远程分支上的文件合并到本地分支上时发现了冲突')
          } else if (errorData.stderr.includes('CONFLICT')) {
            return this.errorMsg(errorData, '文件冲突', 'Git检测到两个分支上的相同文件在相同位置产生了不同的修改，并且无法自动合并')
          } else {
            return this.errorMsg(errorData, '文件冲突', '文件冲突，请先解决文件冲突后重新执行命令')
          }
        case 2:
          return this.errorMsg(errorData, '无效参数', '无效的命令行参数或选项，请检查 git pull 命令的参数和选项是否正确')
        case 127:
          return this.errorMsg(errorData, 'Git命令不存在', 'Git命令不存在，请确保已安装Git并配置了正确的环境变量')
        case 128:
          if (errorData.stderr.includes('Operation timed out')) {
            return this.errorMsg(errorData, '连接超时', '连接超时，请检查网络连接后重新执行 git pull')
          } else if (errorData.stderr.includes('Could not resolve host')) {
            return this.errorMsg(errorData, '连接失败', '连接失败，无法解析主机名，请检查网络连接后重新执行 git pull')
          } else {
            return this.errorMsg(errorData, '连接失败', '连接失败，请检查网络连接后重新执行 git pull')
          }
        case 129:
          return this.errorMsg(errorData, '内部问题', '内部Git状态或操作相关问题，请检查Git的状态或尝试升级Git版本')
        case 130:
          return this.errorMsg(errorData, '用户中断', 'git pull 被中断，请确保执行完整的 git pull 操作')
        default:
          return this.errorMsg(errorData, '未知错误', '执行 git pull 出错：' + errorData.message)
      }
    }
  }

  /**
   * 执行Git命令
   * @param {string} cmd - 命令
   * @param {string} [cwd] - 执行路径 默认当前路径
   * @returns {{
   *   ok: boolean,
   *   data: string | Error
   * }}
   */
  async cmd (cmd, cwd = process.cwd()) {
    return new Promise((resolve, reject) => {
      exec(cmd, { cwd, stdio: 'pipe', encoding: 'utf-8', env: process.env }, (error, stdout) => {
        if (error) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({ ok: false, data: error })
        } else {
          resolve({ ok: true, data: stdout })
        }
      })
    })
  }

  errorMsg (error, message, stderr) {
    return {
      ok: false,
      data: {
        type: error.type,
        message,
        status: error.status,
        stderr: stderr.toString()
      }
    }
  }
}
