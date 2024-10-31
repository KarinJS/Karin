import path from 'node:path'
import { isExists } from './exists'
import { createRequire } from 'module'
import { cache } from '@plugin/cache/cache'
import { requireFileSync } from './require'
import { PackageJson } from '@plugin/list/types'

/**
 * 输入包名 返回包根目录的绝对路径 仅简单查找
 * @param name - 包名
 * @param rootPath - 导入包的路径 此项适用于在插件中读取插件的依赖包
 * @returns - 包根目录的绝对路径
 * @example
 * pkgRoot('axios')
 * pkgRoot('axios', import.meta.url)
 */
export const pkgRoot = (name: string, rootPath?: string) => {
  const require = createRequire(rootPath || import.meta.url)
  let dir = require.resolve(name)

  try {
    if (isExists(path.join(dir, 'package.json'))) {
      return path.resolve(dir)
    }

    /** 递归查找 如果跳过了node_modules 则返回null */
    while (true) {
      /** 向上 */
      dir = path.dirname(dir)

      if (isExists(path.join(dir, 'package.json'))) {
        return path.resolve(dir)
      }
      /** 加个处理 防止无线递归 */
      if (dir === path.dirname(dir)) {
        throw new Error(`[common] 未找到包${name}的根目录`)
      }
    }
  } finally {
    delete require.cache[require.resolve(name)]
  }
}

/**
 * 传入插件名称 返回插件根目录、路径、package.json等信息
 * @param name - 插件名称
 */
export const getPluginInfo = (name: string) => {
  const list = Object.values(cache.index)
  const plugin = list.find(item => item.name === name)
  if (!plugin) return null

  const info = {
    get pkg () {
      if (!plugin.pkgPath) return null
      return requireFileSync(plugin.pkgPath) as PackageJson
    },
  }

  return Object.assign(plugin, info)
}

/**
 * 传入一个名称 判断是否为插件
 * @param name - 插件名称
 */
export const isPlugin = (name: string) => {
  return !!getPluginInfo(name)
}
