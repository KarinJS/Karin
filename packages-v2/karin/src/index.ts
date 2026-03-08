// re-export 全部 API（用户只需 import { xxx } from 'karin'）
export { dispatch, registerBot, unregisterBot, getBot, getBots, pipe } from '@karin/core'
export { command, accept, handler, task, button } from '@karin/dsl'
export { pluginConfig, pluginName } from '@karin/loader'
export { logger, getLogger, createLogger } from '@karin/logger'
export type * from '@karin/types'

// ════ 框架入口 ════

import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { commands, bots } from '@karin/core'
import { loadApps, loadNpmPlugins, watchApps } from '@karin/loader'
import { logger } from '@karin/logger'
import type { KarinConfig, PluginInstance } from '@karin/types'

let config: KarinConfig = {}
let npmInstances: PluginInstance[] = []

// 加载配置
const CONFIG_NAMES = ['karin.config.ts', 'karin.config.js', 'karin.config.mjs']

async function loadConfig (): Promise<KarinConfig> {
  for (const name of CONFIG_NAMES) {
    try {
      const file = resolve(process.cwd(), name)
      const mod = await import(pathToFileURL(file).href) as { default?: KarinConfig }
      return mod.default ?? {} as KarinConfig
    } catch {
      continue
    }
  }
  return {}
}

export async function start (): Promise<void> {
  config = await loadConfig()

  // 加载 npm 插件
  if (config.plugins?.length) {
    npmInstances = await loadNpmPlugins(config.plugins)
    for (const inst of npmInstances) {
      await inst.start?.()
    }
  }

  // 加载 apps 插件
  const pluginsDir = resolve(process.cwd(), 'plugins')
  await loadApps(pluginsDir)
  watchApps(pluginsDir)

  logger.info(`[karin] ready · ${commands.length} commands · ${bots.size} bots`)
}

export async function shutdown (): Promise<void> {
  for (const inst of npmInstances) {
    await inst.stop?.()
  }
}

export function useConfig (): Readonly<KarinConfig> {
  return config
}

export function defineConfig (cfg: KarinConfig): KarinConfig {
  return cfg
}
