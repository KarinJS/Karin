import fs from 'node:fs'
import { URL } from 'node:url'
import { setVersion, setRuntime } from '@/env'
import { pkg } from '@/utils/config/pkg'
import { defaultConfig } from './default'
import { execSync } from 'node:child_process'

import type root from '@/root'
import { initConfigCache } from './file'

const env = () => {
  /** `.env`同步新版本 */
  const list = [
    {
      key: 'LOG_MAX_CONNECTIONS',
      value: '5',
      comment: '日志实时Api最多支持同时连接数',
    },
  ]

  const file = `${process.cwd()}/${process.env.EBV_FILE!}`
  if (!fs.existsSync(file)) {
    /** 这里只需要考虑生产环境即可 */
    logger.error(logger.yellow('检查到项目配置文件缺失，正在初始化...'))
    const cwd = new URL('./cli/index.mjs', import.meta.url).toString()
    execSync(`node ${cwd} init`, {
      cwd: process.cwd(),
      stdio: 'inherit',
    })
    logger.info(logger.green('初始化成功~'))
  }

  const content = fs.readFileSync(file, 'utf-8')

  list.forEach(v => {
    if (!content.includes(v.key)) {
      fs.appendFileSync(file, `\n${v.comment}\n${v.key}=${v.value}`)
      /** tips: 记得str格式化 */
      process.env[v.key] = v.value
    }
  })
}

/**
 * @description 初始化配置
 * @param dir 根目录
 */
export const initConfig = async (dir: typeof root) => {
  const files = [
    dir.basePath,
    dir.configPath,
    dir.dataPath,
    dir.tempPath,
    dir.htmlPath,
    dir.consolePath,
    dir.resourcePath,
    dir.sandboxDataPath,
    dir.sandboxTempPath,
    `${dir.sandboxDataPath}/avatar`,
  ]

  await Promise.all(files.map(v => {
    if (!fs.existsSync(v)) fs.mkdirSync(v, { recursive: true })
    return Promise.resolve()
  }))

  setVersion(pkg().version)
  env()
  if (process.env.pm_id) setRuntime('pm2')

  /** 清空dir.consolePath目录 保留目录 */
  const list = await fs.promises.readdir(dir.consolePath)
  await Promise.all(list.map(v => {
    if (fs.statSync(`${dir.consolePath}/${v}`).isDirectory()) {
      fs.rmdirSync(`${dir.consolePath}/${v}`, { recursive: true })
    } else {
      fs.unlinkSync(`${dir.consolePath}/${v}`)
    }
    return Promise.resolve()
  }))

  /** 生成配置文件给予用户编辑 */
  await Promise.all(Object.keys(defaultConfig).map(async (key) => {
    const file = `${dir.configPath}/${key}.json`
    if (fs.existsSync(file)) return
    const data = JSON.stringify(defaultConfig[key as keyof typeof defaultConfig], null, 2)
    await fs.promises.writeFile(file, data, 'utf-8')
    return true
  }))

  /** 初始化配置文件缓存 */
  initConfigCache(dir.configPath)
}
