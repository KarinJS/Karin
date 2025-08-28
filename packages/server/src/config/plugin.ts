import util from 'node:util'
import { core } from '@karinjs/plugin'
import { isDev } from '@karinjs/envs'

import type { PluginCacheKeyPkg, PluginPackageType } from '@karinjs/plugin'
import type { WebConfigAuthor, WebConfigIcon, DefineConfig, ComponentConfig } from '@karinjs/components'

/**
 * 获取插件 web.config 配置类型
 */
export type PluginWebConfig = {
  status: false
  /** 错误信息 */
  data: string
} | {
  status: true
  data: PluginWebConfigFormat
}

/**
 * @types web.config
 * 格式化之后的 web.config
 */
export interface PluginWebConfigFormat {
  component: ComponentConfig[]
  info: {
    id: string
    type: PluginPackageType
    name: string
    author: WebConfigAuthor[]
    version: string
    description: string
    icon: Required<WebConfigIcon>
  }
}

/**
 * 获取 web.config 状态
 * @param name 插件名称
 */
export const getWebConfigStatus = async (name: string): Promise<{
  status: false
  pkg: null
  data: string
} | {
  status: true
  pkg: PluginCacheKeyPkg,
  data: DefineConfig
}> => {
  const info = await core.promise.getPluginPackageDetail(name)
  if (!info?.webConfigPath) {
    return { status: false, pkg: null, data: '未提供 web.config 文件' }
  }

  const data = await info.loadWebConfig(isDev())
  if (!data) {
    return { status: false, pkg: null, data: '未找到 web.config 文件' }
  }

  return {
    status: true,
    pkg: info,
    data,
  }
}

/**
 * 获取插件的Web.config配置
 * @param name 插件名称
 * @returns 插件的Web配置信息
 */
export const getPluginWebConfig = async (name: string): Promise<PluginWebConfig> => {
  const { status, data, pkg } = await getWebConfigStatus(name)
  if (!status) {
    return { status, data }
  }

  if (typeof data.components !== 'function') {
    return { status: false, data: 'web.config 文件未提供 components 配置函数' }
  }

  const list: Record<string, any>[] = []
  let result = data.components()
  result = util.types.isPromise(result) ? await result : result

  result.forEach((item: any) => {
    if (typeof item?.toJSON === 'function') {
      list.push(item.toJSON())
    } else {
      if (typeof item === 'object' && item !== null) {
        list.push(item)
      }
    }
  })

  return {
    status: true,
    data: {
      component: list as PluginWebConfigFormat['component'],
      info: {
        id: pkg.data.name,
        type: pkg.type,
        name: data.info.name ?? pkg.data.name,
        author: normalizeAuthor(data.info.author),
        version: pkg.data.version,
        description: data.info.description || pkg.data.description,
        icon: {
          color: data.info.icon?.color || '',
          name: data.info.icon?.name || 'star',
          size: data.info.icon?.size || 16,
        },
      },
    },
  }
}

/**
 * 标准化插件作者字段
 * @param author 插件作者
 * @returns 标准化后的作者字段
 */
const normalizeAuthor = (author: DefineConfig['info']['author']) => {
  const list: DefineConfig['info']['author'] = []
  if (Array.isArray(author)) {
    list.push(...author)
  } else if (author) {
    list.push(author)
  }

  return list
}

/**
 * 设置插件的Web.config配置
 * @param name 插件名称
 * @param config 设置的值
 */
export const setPluginWebConfig = async (name: string, config: Record<string, any>) => {
  if (typeof config !== 'object') {
    return { status: false, data: '配置数据错误，不符合 object 类型要求' }
  }

  const { status, data } = await getWebConfigStatus(name)
  if (!status) {
    return { status, data }
  }

  if (typeof data.save !== 'function') {
    return { status: false, data: 'web.config 文件未提供 save 函数' }
  }

  let result = data.save(config)
  result = util.types.isPromise(result) ? await result : result
  return { status: result.success, data: result.message || '没有返回值哦 φ(>ω<*) ' }
}
