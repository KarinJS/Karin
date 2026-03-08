import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { removeByFile } from '@karin/core'
import type { PluginEntry, PluginInstance } from '@karin/types'

// ════ 加载 apps 插件 ════

export async function loadApps (dir: string): Promise<void> {
  if (!fs.existsSync(dir)) return
  const files = collectFiles(dir)
  for (const file of files) {
    await importFile(file)
  }
}

function collectFiles (dir: string): string[] {
  const result: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile() && /\.[tj]s$/.test(entry.name)) {
      result.push(path.join(dir, entry.name))
    }
  }
  return result
}

async function importFile (file: string): Promise<void> {
  try {
    await import(`${pathToFileURL(file)}?t=${Date.now()}`)
  } catch (err) {
    console.error(`[loader] ${path.basename(file)}:`, err)
  }
}

// ════ 加载 npm 插件 ════

let currentLoading: { name: string; options: Record<string, unknown> } | null = null

export async function loadNpmPlugins (
  entries: PluginEntry[],
): Promise<PluginInstance[]> {
  const instances: PluginInstance[] = []
  for (const entry of entries) {
    const [name, options] = Array.isArray(entry) ? entry : [entry, undefined]
    try {
      currentLoading = { name, options: options ?? {} }
      const mod = await import(name) as { default?: (opts: Record<string, unknown>) => PluginInstance }
      if (typeof mod.default === 'function' && options !== undefined) {
        const inst = mod.default(options)
        if (inst && typeof inst === 'object') instances.push({ ...inst, name })
      }
    } catch (err) {
      console.error(`[loader] ${name}:`, err)
    } finally {
      currentLoading = null
    }
  }
  return instances
}

// ════ 插件配置上下文 ════

/**
 * npm 插件在顶层调用此函数读取传入的配置。
 * 内部通过加载上下文获取，无需 export 任何东西。
 */
export function pluginConfig<T = Record<string, unknown>> (): T {
  return (currentLoading?.options ?? {}) as T
}

/**
 * 读取当前正在加载的插件名称
 */
export function pluginName (): string {
  return currentLoading?.name ?? 'unknown'
}

// ════ HMR（仅 apps） ════

export function watchApps (dir: string): void {
  if (!fs.existsSync(dir)) return
  fs.watch(dir, { recursive: false }, (_, filename) => {
    if (!filename || !/\.[tj]s$/.test(filename)) return
    const file = path.join(dir, filename)
    if (!fs.existsSync(file)) return

    removeByFile(file.replaceAll('\\', '/'))
    void importFile(file)
    console.log(`[hmr] ${filename}`)
  })
}
