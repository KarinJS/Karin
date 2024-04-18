import axios from 'axios'
import { exec } from 'child_process'
import { promisify } from 'util'

class Submodule {
  constructor (logger) {
    this.cmd = 'git submodule update --init --recursive lib/adapter/kritor'
    this.name = {
      github: 'kritor',
      gitee: 'gitee_kritor'
    }
    this.log = (type, log) => logger[type](log)
  }

  async main () {
    /** 未指定，自动判断网络环境，选择拉取哪个子模块 */
    const { status } = await axios.get('https://github.com')
    let name = status === 200 ? 'kritor' : 'gitee_kritor'
    try {
      await this.update(name)
    } catch (e) {
      /** 如果是github拉取错误，则尝试拉取gitee */
      if (name === 'kritor') {
        this.log('info', '[submodule] Gihub拉取失败，尝试拉取gitee')
        name = 'gitee_kritor'
        await this.update(name)
      }
    }
    return name
  }

  async Command (cmd) {
    try {
      const { stdout, stderr } = await promisify(exec)(cmd)
      if (stderr) throw new Error(stderr)
      return stdout || '已经是最新版本'
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async update (name) {
    try {
      this.log('info', `[submodule] 正在拉取子模块 ${name}，请耐心等待。`)
      const result = await this.Command(`${this.cmd}/${name}`)
      this.log('info', `[submodule] 子模块 ${name} 拉取成功: ${result.trim()}`)
    } catch (error) {
      this.log('error', `[submodule] 子模块 ${name} 拉取失败: ${error.message}`)
      throw new Error(`[submodule] 子模块 ${name} 拉取失败，请检查网络连接或手动拉取子模块。`, error)
    }
  }
}

export default Submodule
