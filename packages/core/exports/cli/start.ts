import fs from 'node:fs'
import dotenv from 'dotenv'
import { fork } from 'node:child_process'

/**
 * 启动项目
 * @param env
 */
export const start = async (env: string = '.env') => {
  const dir = process.cwd()
  const list = env === '.env' ? ['.env'] : ['.env', env]

  list.forEach((item) => {
    if (!fs.existsSync(`${dir}/${item}`)) {
      if (env === '.env') {
        console.error(`未找到${item}文件，请使用 pnpm init 进行初始化项目`)
      } else {
        console.error(`未找到${item}文件，请将其放置在项目根目录`)
      }

      process.exit(1)
    }
  })

  const path = list.map((item) => `${dir}/${item}`)
  dotenv.config({ path, override: true })
  const index = '../root.js'
  const { karinMain } = await import(index)
  const child = fork(karinMain)

  child.on('message', (message) => {
    if (message === 'restart') {
      child.kill()
      child.removeAllListeners()
      start(env)
    }
  })

  child.on('exit', (code) => process.exit(code))
}
