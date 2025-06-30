import { request } from '@/lib/request'
import { RiSettings2Fill } from 'react-icons/ri'
import { BsInfoCircleFill } from 'react-icons/bs'
import {
  MdSpaceDashboard,
  MdExtension,
  MdOutlineArticle, // 系统日志
  MdOutlineTerminal, // 仿真终端
} from 'react-icons/md'
import { TbDatabase } from 'react-icons/tb'

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
      Icon: MdExtension,
      label: '插件管理',
      href: '/plugins-dashboard',
    },
    {
      Icon: MdOutlineTerminal,
      label: '仿真终端',
      href: '/terminal',
    },
    {
      Icon: TbDatabase,
      label: 'SQLite管理',
      href: '/sqlite',
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
 * 初始化插件配置
 */
export const initSiteConfig = async () => {
  // 插件列表现在将直接在插件概览页面中使用，不再添加到侧边栏
  await getInstalledPlugins()
}
