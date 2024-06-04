import fs from 'fs'
import { exec } from 'child_process'

export default class Version {
  constructor (path) {
    this.path = path
    this.packageDir = './package.json'
    this.packageJson = JSON.parse(fs.readFileSync(this.packageDir, 'utf-8'))
    this.version = this.packageJson.version

    this.commitsMap = {
      release: ['### Releases'],
      feat: ['### 新增功能'],
      fix: ['### Bug修复'],
      docs: ['### 文档更新'],
      style: ['### 代码样式修改'],
      refactor: ['### 代码重构'],
      perf: ['### 性能优化'],
      chore: ['### 构建工具相关'],
      revert: ['### 回滚'],
      others: ['### 其他提交']
    }
  }

  async init () {
    /** 获取仓库地址 */
    await this.gitUrl()

    /** 取tag对应的head */
    await this.gitTag()
    const HEAD = this.HEAD ? `${this.HEAD}..HEAD ` : ''
    this.cmd = `git log ${HEAD}--pretty=format:"HEAD: %H=分割=sha: %h=分割=log: %s"`

    this.stdout = await this.exce(this.cmd)
    if (!this.stdout) throw new Error('commit为空...')
    this.stdout = this.stdout.trim().split('\n')

    const reg = /(fix|feat|docs|style|refactor|perf|release|chore|revert)(:|：)/i

    for (const commit of this.stdout) {
      /** 拆分 */
      const [HEAD, sha, log] = commit.split('=分割=').map(item => item.trim().replace(/^(HEAD|sha|log): /, ''))
      /** 排除此项 */
      if (log.startsWith('Merge branch')) continue

      const match = log.match(reg)
      const type = match ? match[1].toLowerCase() : 'others'
      /** 拼接commit */
      const info = `- ${log} ([${sha}](${this.url}/commit/${HEAD}))`
      this.commitsMap[type].push(info)
    }

    /** 更新版本号 */
    await this.updateVersion()

    /** YYYY-MM-DD */
    const date = new Date().toLocaleDateString().replace(/\//g, '-')

    const text = [`## ${this.version} (${date})`]

    for (const key in this.commitsMap) {
      /** 排除空 */
      if (this.commitsMap[key].length === 1) {
        delete this.commitsMap[key]
        continue
      }

      text.push(this.commitsMap[key].join('\n'))
    }

    /** 判断是否有CHANGELOG.md文件 */
    if (fs.existsSync('CHANGELOG.md')) {
      const oldText = fs.readFileSync('CHANGELOG.md', 'utf-8')
      text.push(oldText)
    }

    fs.writeFileSync('CHANGELOG.md', text.join('\n\n'))
    console.log('更新成功~')
  }

  /**
   * 获取当前仓库最新的一个标签的HEAD
   */
  async gitTag () {
    const cmd = 'git tag'
    const stdout = await this.exce(cmd)
    if (!stdout) return false
    const tags = stdout.trim().split('\n')
    const lastTag = tags[tags.length - 1]
    const cmd2 = `git rev-list -n 1 ${lastTag}`
    const HEAD = await this.exce(cmd2)
    this.HEAD = HEAD.trim()
  }

  /**
   * 获取当前仓库的远程地址
   */
  async gitUrl () {
    const cmd = 'git remote -v'
    const stdout = await this.exce(cmd)
    let [url] = stdout.split('\n').map(item => item.split('\t')[1])
    url = url.trim().split(' ')[0]
    this.url = url
  }

  /**
   * 更新版本号 tag
   */
  async updateVersion () {
    /** 10进1 */
    const versionArr = this.version.split('.').map(item => parseInt(item))
    if (versionArr[2] === 9) {
      versionArr[1]++
      versionArr[2] = 0
    } else {
      versionArr[2]++
    }
    this.version = versionArr.join('.')
    this.packageJson.version = this.version
    fs.writeFileSync(this.packageDir, JSON.stringify(this.packageJson, null, 2))

    /** tag */
    try {
      await this.exce(`git tag v${this.version}`)
    } catch (e) {
      console.log('tag已存在')
    }
  }

  /**
   * 封装exce方法
   * @param {string} cmd 执行的命令
   */
  exce (cmd) {
    return new Promise((resolve, reject) => {
      exec(cmd, { cwd: this.path }, (error, stdout) => {
        if (error) {
          reject(error)
          return
        }
        resolve(stdout)
      })
    })
  }
}
