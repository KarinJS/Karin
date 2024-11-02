import type { AdapterProtocol } from '@/adapter/adapter'
import type { CommandClass, CommandFnc } from '@plugin/cache/types'

/**
 * 检查触发事件的适配器是否收到限制
 * @param plugin 插件缓存对象
 * @param protocol 适配器协议实现名称
 */
export const isAdapter = (plugin: CommandClass | CommandFnc, protocol: AdapterProtocol): boolean => {
  if (plugin.adapter.length && !plugin.adapter.includes(protocol)) {
    return true
  }

  if (plugin.dsbAdapter.length && plugin.dsbAdapter.includes(protocol)) {
    return true
  }

  return false
}
