import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'

class Uninstall {
  constructor () {
    this.dir = process.cwd()
  }

  /**
   * 循环删除依赖文件夹
   */
  async init () {
    const list = this.getPluginsPath()
    console.log(`[uninstall][数量:${list.length}] 开始删除依赖文件夹`)
    const cmd = process.platform === 'win32' ? 'rd/s/q node_modules' : 'rm -rf node_modules'
    if (fs.existsSync(this.dir + '/node_modules')) {
      console.log('[uninstall] 删除node_modules文件夹')
      await this.execPromise(cmd, this.dir)
    }
    for (const plugin of list) {
      if (fs.existsSync(plugin + '/node_modules')) {
        console.log(`[uninstall][${path.basename(plugin)}] 删除node_modules文件夹`)
        await this.execPromise(cmd, plugin)
      }
    }
    console.log('[uninstall] 依赖文件夹删除完成')
  }

  /**
   * 获取所有插件绝对路径
   */
  getPluginsPath () {
    const files = fs.readdirSync(this.dir + '/plugins', { withFileTypes: true })
    // 过滤掉非karin-plugin-开头或karin-adapter-开头的文件夹
    let plugins = files.filter(file => file.isDirectory() && (file.name.startsWith('karin-plugin-') || file.name.startsWith('karin-adapter-'))).map(dir => dir.name)
    // 排除没有package.json的插件
    plugins = plugins.filter(plugin => fs.existsSync(this.dir + '/plugins/' + plugin + '/package.json'))
    // 排除没有node_modules的插件
    plugins = plugins.filter(plugin => fs.existsSync(this.dir + '/plugins/' + plugin + '/node_modules'))
    return plugins.map(plugin => this.dir + '/plugins/' + plugin)
  }

  /**
 * 执行命令
 * @param {string} command - 命令
 * @param {string} cwd - 执行路径
 * @returns {Promise<string>}
 */
  async execPromise (command, cwd) {
    return new Promise((resolve, reject) => {
      exec(command, { env: process.env, cwd, silent: true }, (error, stdout) => {
        if (error) {
          reject(error)
        } else {
          resolve(stdout)
        }
      })
    })
  }
}

const uninstall = new Uninstall()
uninstall.init()
