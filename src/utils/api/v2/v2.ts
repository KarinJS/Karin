import { execSync } from 'child_process'
import { pluginLoader } from 'karin/core/plugin/loader'
import { render } from 'karin/render'
import OSUtils from 'karin/utils/common/OSUtils'
import os from 'os'
import { Worker } from 'worker_threads'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface CachedInfo {
  redis: any;
  system: any;
  karin: any;
  cpu: any;
  plugins: any;
}

interface StaticInfo {
  redis: ReturnType<typeof apiV2.getRedisInfo>;
  system: ReturnType<typeof apiV2.getSystemInfo>;
  karin: ReturnType<typeof apiV2.getKarinInfo>;
  cpu: Awaited<ReturnType<typeof apiV2.getCPUInfo>>;
}

export class apiV2 {
  private static worker: Worker | null = null
  private static cachedInfo: CachedInfo = {} as CachedInfo
  private static cachedStaticInfo: StaticInfo | null = null
  private static isStarting: boolean = false

  public static async startInfoRefreshWorker (): Promise<void> {
    this.worker = new Worker(path.resolve(__dirname, './infoRefreshWorker.js'))

    this.worker.on('message', async (message) => {
      if (message === 'getStaticInfo') {
        const staticInfo = await this.getStaticInfo()
        this.cachedStaticInfo = staticInfo
        this.worker?.postMessage(staticInfo)
      }
    })

    this.worker.on('error', (error) => {
      console.error('Worker 错误:', error)
    })
    logger.info('API V2 infoRefreshWorker 启动成功')
  }

  public static getRedisInfo () {
    try {
      const infoBuffer = execSync('redis-server -v', { encoding: 'utf-8' })
      const infoString = infoBuffer.toString()
      const infoMatch = infoString.match(/v=(\d+\.\d+\.\d+).*malloc=([^\s]+).*bits=(\d+).*build=([^\s]+)/)
      return infoMatch
        ? {
            info_server: 'redis',
            info_status: 'running',
            info_version: infoMatch[1],
            info_malloc: infoMatch[2],
            info_bits: infoMatch[3],
            info_build: infoMatch[4],
          }
        : {
            info_server: 'error',
            info_status: 'error',
            info_version: 'x.x.x',
          }
    } catch (error) {
      return {
        info_server: 'error',
        info_status: 'error',
        info_version: 'x.x.x',
      }
    }
  }

  public static getSystemInfo () {
    // 内存
    const freeMem = os.freemem() / 1024 / 1024
    const totalMem = os.totalmem() / 1024 / 1024
    const memoryUsage = 100 - (freeMem / totalMem * 100)

    return {
      info_arch: process.arch,
      info_platform: process.platform,
      info_version: process.version,
      info_memory_usage: memoryUsage,
      info_memory_total: totalMem,
      info_memory_free: freeMem,
    }
  }

  public static getKarinInfo () {
    return {
      uptime: process.uptime(),
      info: {
        version: process.env.karin_app_version,
        lang: process.env.karin_app_lang,
        mode: process.env.karin_app_mode,
        runner: process.env.karin_app_runner,
      },
      counter: {
        karin_apps: render.Apps.length,
        karin_plugins: pluginLoader.plugin.size,
        karin_command: pluginLoader.command.length,
        karin_button: pluginLoader.button.length,
        karin_task: pluginLoader.task.length,
        karin_handler_key: Object.keys(pluginLoader.handler).length,
        karin_handler_fnc: pluginLoader.handlerCount,
      },
    }
  }

  public static async getCPUInfo () {
    const osUtils = new OSUtils()
    const usage = await osUtils.getCPUUsage()
    return {
      cpu_usage: usage,
      cpu_cpus: os.cpus().length,
    }
  }

  public static getPlugins () {
    const plugins = Array.from(pluginLoader.plugin.entries()).map(([key, value]) => {
      return {
        id: key,
        name: value.plugin,
        type: value.type,
        path: value.path,
        file: value.file,
        commands: pluginLoader.command.filter(cmd => cmd.key === key).length,
        tasks: pluginLoader.task.filter(task => task.key === key).length,
        buttons: pluginLoader.button.filter(btn => btn.key === key).length,
      }
    })

    return plugins
  }

  public static getPluginCommandsList (id: string) {
    const commands = pluginLoader.command.filter(cmd => cmd.key === Number(id))
    return commands.map(cmd => ({
      ...cmd,
      reg: new RegExp(cmd.reg).toString(),
    }))
  }

  public static getInfo () {
    return this.cachedInfo
  }

  private static async getStaticInfo (): Promise<StaticInfo> {
    return {
      redis: this.getRedisInfo(),
      system: this.getSystemInfo(),
      karin: this.getKarinInfo(),
      cpu: await this.getCPUInfo(),
    }
  }

  public static getCachedStaticInfo (): StaticInfo | null {
    return this.cachedStaticInfo
  }
}
