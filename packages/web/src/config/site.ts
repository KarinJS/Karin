import { request } from '@/lib/request'
import { RiSettings2Fill } from 'react-icons/ri'
import { BsInfoCircleFill } from 'react-icons/bs'
import {
  MdSpaceDashboard,
  MdExtension,
  MdStore,
  MdOutlineArticle, // 系统日志
  MdOutlineTerminal, // 仿真终端
  MdSystemUpdate, // 插件/卸载
  MdWeb, // 插件管理
} from 'react-icons/md'
import { TbPackages } from 'react-icons/tb' // 依赖管理图标

import type { LocalApiResponse } from 'node-karin'

export interface NavItem {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  href: string
  children?: {
    id: string
    href: string
    label?: string
    Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
    children?: {
      id: string
      href: string
      label?: string
      icon?: {
        name?: string
        size?: number
        color?: string
      }
      type?: 'git' | 'npm' | 'app'
    }[]
  }[]
}

export interface SiteConfigType {
  name: string
  description: string
  navItems: NavItem[]
}

export const defaultSiteConfig: SiteConfigType = {
  name: 'Karin WebUI',
  description: 'Karin WebUI.',
  navItems: [
    {
      Icon: MdSpaceDashboard,
      label: '基础信息',
      href: '/',
    },
    {
      Icon: RiSettings2Fill,
      label: '系统配置',
      href: '/config',
    },
    {
      Icon: MdExtension, // 改为插件图标
      label: '插件管理',
      href: '/plugins-management',
      children: [
        {
          id: 'plugin-config',
          href: '/plugins',
          label: '配置',
          Icon: RiSettings2Fill, // 保持设置图标
          children: [],
        },
        {
          id: 'plugin-market',
          href: '/plugins/list',
          label: '市场',
          Icon: MdStore, // 保持商店图标
        },
        {
          id: 'plugin-manage',
          href: '/plugins/manage',
          label: '更新/卸载',
          Icon: MdSystemUpdate, // 改为系统更新图标
        },
        {
          id: 'dependencies',
          href: '/dependencies',
          label: '依赖管理',
          Icon: TbPackages, // 保持包管理图标
        },
        {
          id: 'webui-plugins',
          href: '/plugins/webui',
          label: 'WebUI',
          Icon: MdWeb, // 改为网页图标
        },
      ],
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

/**
 * 获取已安装的插件列表
 */
const getInstalledPlugins = async () => {
  const list = (await request.serverPost<LocalApiResponse[], null>('/api/v1/plugin/local')) || []
  return list.map((item) => ({
    id: item.id,
    label: item.name,
    href: `/plugins/${item.id}`,
    icon: item.icon,
    type: item.type,
  }))
}

/**
 * 初始化插件配置的三级菜单
 */
export const initSiteConfig = async () => {
  const plugins = await getInstalledPlugins()
  const pluginManagementIndex = siteConfig.navItems.findIndex(item => item.href === '/plugins-management')
  if (pluginManagementIndex !== -1) {
    const pluginConfigIndex = siteConfig.navItems[pluginManagementIndex].children?.findIndex(item => item.id === 'plugin-config')
    if (pluginConfigIndex !== undefined && pluginConfigIndex !== -1 && siteConfig.navItems[pluginManagementIndex].children) {
      // 将插件列表添加到"配置"的子菜单中
      siteConfig.navItems[pluginManagementIndex].children[pluginConfigIndex].children = plugins
    }
  }
}
