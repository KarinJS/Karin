import { ReactElement } from 'react'
import { TbCircleCheck, TbCircleDashed, TbArrowUp } from 'react-icons/tb'
import type { PluginPackageType } from 'node-karin'

/**
 * 插件类型定义
 */
export type PluginType = Omit<PluginPackageType, 'apps'> | 'app'

/**
 * 获取更新状态配置
 * @param type - 插件类型
 * @param version - 当前版本
 * @param latesHash - 最新版本哈希
 * @returns 状态配置
 */
export const getUpdateStatusConfig = (type: PluginType, version: string, latesHash: string) => {
  if (type === 'apps') {
    return {
      text: '-',
      color: 'default' as const,
      icon: <TbCircleDashed className='text-xs mr-1' />,
    }
  }

  if (version === latesHash) {
    return {
      text: '最新',
      color: 'success' as const,
      icon: <TbCircleCheck className='text-xs mr-1' />,
    }
  }

  if (version !== latesHash) {
    return {
      text: '可更新',
      color: 'warning' as const,
      icon: <TbArrowUp className='text-xs mr-1' />,
    }
  }

  return {
    text: '未知',
    color: 'default' as const,
    icon: <TbCircleDashed className='text-xs mr-1' />,
  }
}

/**
 * 获取类型配置
 * @param type - 插件类型
 * @returns 类型配置信息
 */
export const getTypeConfig = (type: PluginType) => {
  switch (type) {
    case 'git':
      return {
        color: 'warning',
        text: 'Git插件',
      }
    case 'apps':
      return {
        color: 'primary',
        text: 'Apps插件',
      }
    case 'npm':
      return {
        color: 'danger',
        text: 'NPM插件',
      }
    case 'all':
    default:
      return {
        color: 'default',
        text: '全部',
      }
  }
}

/**
 * 渲染图标的帮助函数
 * @param size - 图标尺寸
 * @param Icon - 图标组件
 * @returns 渲染的图标组件
 */
export const renderIcon = (size: number, Icon: React.ComponentType<{ size?: number }>): ReactElement => {
  return <Icon size={size} />
}

/**
 * 阻止事件冒泡
 * @param e - 事件对象
 */
export const stopPropagation = (e: React.MouseEvent | React.TouchEvent): void => {
  e.stopPropagation()
}
