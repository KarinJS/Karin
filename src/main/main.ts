import { promisify } from 'util'
import { fork, exec as execCallback } from 'child_process'
import { setLang, setMode, setWatch } from '@/env/env'

const exec = promisify(execCallback)

/**
 * @description 运行子进程
 * @returns 返回子进程
 */
export const runFork = () => {
  const child = fork(process.cwd() + '/index.js')
  child.on('message', (message) => {
    if (message === 'restart') {
      child.kill()
      child.removeAllListeners()
      runFork()
    }
  })

  child.on('exit', (code) => process.exit(code))
}

/**
 * @description dev模式启动 `js`热更新
 * @param isWatch 是否监听文件变化并重启
 * @returns 返回子进程
 */
export const runDev = (isWatch = false) => {
  setMode('dev')
  setWatch(isWatch)
  runFork()
}

/**
 * @description `tsx` 启动
 * @param isWatch 是否监听文件变化并重启
 */
export const runTsx = async (isWatch = false) => {
  setMode('dev')
  setLang('ts')
  const cmd = 'watch --exclude "./@karinjs/**/*" --exclude "./lib/**/*" index.js'
  const { spawn } = await import('child_process')
  setWatch(isWatch)
  spawn('tsx', isWatch ? cmd.split(' ') : ['index.js'], { stdio: 'inherit', shell: true })
}

/**
 * @description 执行命令
 * @param command 命令
 */
export const command = async (command: string) => {
  try {
    const { stderr } = await exec(command)
    if (stderr) return false
    return true
  } catch {
    return false
  }
}

/**
 * @description 检查是否安装了 `pm2`
 */
export const checkPM2 = async () => command('pm2 -v')

/**
 * @description `pm2` 启动成功打印信息
 */
export const printPM2 = async () => {
  const { pm2Path } = await import('@/utils/fs/root')
  await command(`pm2 start ${pm2Path}`)
  console.log('[pm2] 启动成功')
  console.log('[pm2] 重启服务: npx karin rs')
  console.log('[pm2] 查看日志: npx karin log')
  console.log('[pm2] 停止服务: npx karin stop')
  console.log('[pm2] 查看监控: pm2 monit')
  console.log('[pm2] 查看列表: pm2 list')
}

/**
 * @description 初始化`pm2`守护进程 后台启动
 */
export const runPM2 = async () => {
  if (await checkPM2()) return printPM2()

  console.log('[pm2] 未安装pm2 开始安装...')
  const result = await command('npm install -g pm2')
  if (result) return printPM2()

  console.log('[pm2] 安装失败 请手动安装pm2后再次运行: npm install -g pm2')
}

/**
 * @description 动态读取配置文件
 */
const readConfig = async (configFile: string) => {
  const fs = await import('fs').then((res) => res.default)
  const yaml = await import('yaml').then((res) => res.default)
  const { configPath } = await import('@/utils/fs/root')

  return yaml.parse(fs.readFileSync(`${configPath}/${configFile}`, 'utf-8'))
}

/**
 * @description 动态请求 PM2 状态
 */
const getPM2Status = async () => {
  const axios = await import('axios').then((res) => res.default)
  const { prot } = await readConfig('server.yaml')
  try {
    const result = await axios.get(`http://127.0.0.1:${prot}/ping`, { timeout: 2000 })
    return result
  } catch {
    return false
  }
}

/**
 * @description 停止或重启 PM2 进程
 * @param action 操作类型，"stop" 或 "restart"
 */
const managePM2 = async (action: 'stop' | 'restart') => {
  const result = await getPM2Status()

  if (typeof result !== 'boolean') {
    if (!result.data?.pm2_id) {
      return console.log('[pm2] 未找到pm2进程')
    }

    await command(`pm2 ${action} ${result.data.pm2_id}`)
    return console.log(`[pm2] ${action === 'stop' ? '停止' : '重启'}成功`)
  }

  const { apps } = await readConfig('pm2.yaml')
  for (const app of apps) {
    await command(`pm2 ${action} ${app.name || 'karin'}`)
  }
  console.log(`[pm2] ${action === 'stop' ? '停止' : '重启'}成功`)
}

/**
 * @description 停止 PM2 守护进程
 */
export const stopPM2 = async () => {
  await managePM2('stop')
}

/**
 * @description 重启 PM2 守护进程
 */
export const restartPM2 = async () => {
  await managePM2('restart')
}

/**
 * @description 查看 PM2 日志
 */
export const logPM2 = async () => {
  const result = await getPM2Status()
  const { apps, lines } = await readConfig('pm2.yaml')
  /** 前缀 */
  const prefix = process.platform === 'win32' ? 'pm2.cmd' : 'pm2'

  if (typeof result !== 'boolean') {
    if (!result.data?.pm2_id) {
      return console.log('[pm2] 未找到pm2进程')
    }

    const id = result.data.pm2_id
    const { spawn } = await import('child_process')
    spawn(prefix, ['logs', id, '--lines', lines], { stdio: 'inherit', shell: true })
  }

  const { spawn } = await import('child_process')
  for (const app of apps) {
    const id = app.name || 'karin'
    spawn(prefix, ['logs', id, '--lines', lines], { stdio: 'inherit', shell: true })
  }
}
