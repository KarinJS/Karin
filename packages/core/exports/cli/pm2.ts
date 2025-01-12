import fs from 'node:fs'
import path from 'node:path'
import { execSync } from './exec'
import { spawn } from 'node:child_process'

const pm2Dir = path.join(process.cwd(), './@karinjs/config/pm2.json')

/**
 * pm2 启动
 */
const start = () => {
  if (!fs.existsSync(pm2Dir)) {
    console.log(`[pm2] 配置文件不存在 请检查 ${pm2Dir} 是否存在`)
    console.log('[pm2] 如果是新项目，请先前台启动生成配置文件: pnpm app')
    process.exit(1)
  }

  console.log('[pm2] 启动中...')
  const { error } = execSync(`pm2 start ${pm2Dir}`, { cwd: process.cwd() })
  if (error) {
    console.log('[pm2] 启动失败')
    console.log(error)
    process.exit(1)
  }

  console.log('[pm2] 启动成功')
  console.log('[pm2] 重启服务: pnpm rs')
  console.log('[pm2] 查看日志: pnpm log')
  console.log('[pm2] 停止服务: pnpm stop')
  console.log('[pm2] 查看监控: pm2 monit')
  console.log('[pm2] 查看列表: pm2 list')
  process.exit(0)
}

/**
 * pm2 log
 */
const log = () => {
  if (!fs.existsSync(pm2Dir)) {
    console.log(`[pm2] 配置文件不存在 请检查 ${pm2Dir} 是否存在`)
    console.log('[pm2] 如果是新项目，请先前台启动生成配置文件: pnpm app')
    process.exit(1)
  }

  const data = JSON.parse(fs.readFileSync(pm2Dir, 'utf-8'))
  try {
    /** 前缀 */
    const prefix = process.platform === 'win32' ? 'pm2.cmd' : 'pm2'
    spawn(prefix, ['logs', data.name, '--lines', data.lines || 1000], { stdio: 'inherit', shell: true })
  } catch (error) {
    console.error('[pm2] 发生未知错误: 请检查pm2是否安装 【npm install -g pm2】')
    console.error(error)
    process.exit(1)
  }
}

/**
 * pm2 stop
 */
const stop = () => {
  if (!fs.existsSync(pm2Dir)) {
    console.log(`[pm2] 配置文件不存在 请检查 ${pm2Dir} 是否存在`)
    console.log('[pm2] 如果是新项目，请先前台启动生成配置文件: pnpm app')
    process.exit(1)
  }

  const data = JSON.parse(fs.readFileSync(pm2Dir, 'utf-8'))
  execSync(`pm2 stop ${data.name}`, { cwd: process.cwd() })
  console.log('[pm2] 停止成功')
  process.exit(0)
}

/**
 * pm2 restart
 */
const restart = () => {
  if (!fs.existsSync(pm2Dir)) {
    console.log(`[pm2] 配置文件不存在 请检查 ${pm2Dir} 是否存在`)
    console.log('[pm2] 如果是新项目，请先前台启动生成配置文件: pnpm app')
    process.exit(1)
  }
}

export const pm2 = {
  start,
  log,
  stop,
  restart,
}
