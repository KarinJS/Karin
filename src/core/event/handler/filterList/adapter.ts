import { AdapterProtocol } from '@/adapter/adapter'
import type { PluginTypes } from '@/event/handler/filterList/types'
/**
 * 检查触发事件的适配器是否收到限制
 * @param plugin 插件缓存对象
 * @param protocol 适配器协议实现名称
 * @returns `true` 表示通过
 */
export const disableViaAdapter = (
  plugin: PluginTypes,
  protocol: `${AdapterProtocol}`
): boolean => {
  if (plugin.adapter.length && !plugin.adapter.includes(protocol)) {
    return false
  }

  if (plugin.dsbAdapter.length && plugin.dsbAdapter.includes(protocol)) {
    return false
  }

  return true
}
