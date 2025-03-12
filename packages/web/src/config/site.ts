import { request } from '@/lib/request'
import { RiSettings2Fill } from 'react-icons/ri'
import { BsInfoCircleFill } from 'react-icons/bs'
import {
  MdSpaceDashboard,
  MdExtension,
  MdStore,
  MdOutlineArticle, // 系统日志
  MdOutlineTerminal, // 仿真终端
  MdOutlineWebhook // webui插件管理
} from 'react-icons/md'

import type { LocalApiResponse } from 'node-karin'

export interface NavItem {
  Icon: React.ComponentType
  label: string
  href: string
  children?: {
    id: string
    href: string
    icon?: {
      name?: string
      size?: number
      color?: string
    }
    type?: 'git' | 'npm' | 'app'
  }[]
}

export interface SiteConfigType {
  name: string
  description: string
  navItems: NavItem[]
}

/**
 * 获取已安装的插件列表
 */
const getInstalledPlugins = async () => {
  const list = await request.serverPost<LocalApiResponse[], null>('/api/v1/plugin/local') || []
  return list.map((item) => ({
    id: item.id,
    label: item.name,
    href: `/plugins/${item.id}`,
    icon: item.icon,
    type: item.type
  }))
}

export const defaultSiteConfig: SiteConfigType = {
  name: 'KarinJS WebUI',
  description: 'KarinJS WebUI.',
  navItems: [
    {
      Icon: MdSpaceDashboard,
      label: '基础信息',
      href: '/',
    },
    {
      Icon: RiSettings2Fill,
      label: '配置信息',
      href: '/config',
    },
    {
      Icon: MdExtension,
      label: '插件配置',
      href: '/plugins',
      children: [],
    },
    {
      Icon: MdStore,
      label: '插件市场',
      href: '/plugins/list',
    },
    // {
    //   Icon: FiCodesandbox,
    //   label: '沙箱调试',
    //   href: '/sandbox',
    // },
    {
      Icon: MdOutlineWebhook,
      label: 'WebUI插件',
      href: '/plugins/webui',
    },
    {
      Icon: MdOutlineTerminal,
      label: '仿真终端',
      href: '/terminal',
    },
    {
      Icon: MdOutlineArticle,
      label: '系统日志',
      href: '/log',
    },
    {
      Icon: BsInfoCircleFill,
      label: '关于我们',
      href: '/about',
    },
  ],
}

export const siteConfig: SiteConfigType = { ...defaultSiteConfig }

export const initSiteConfig = async () => {
  const plugins = await getInstalledPlugins()
  const pluginConfigIndex = siteConfig.navItems.findIndex(item => item.href === '/plugins')
  if (pluginConfigIndex !== -1) {
    siteConfig.navItems[pluginConfigIndex].children = plugins
  }
  return siteConfig
}
