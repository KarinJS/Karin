import { MdSpaceDashboard, MdExtension, MdStore } from 'react-icons/md'
import { RiSettings2Fill } from 'react-icons/ri'
// import { FiCodesandbox } from 'react-icons/fi'
import { BsWindowSidebar } from 'react-icons/bs'
import { request } from '@/lib/request'

import type { LocalApiResponse } from 'node-karin'
export type SiteConfig = typeof siteConfig

/**
 * 获取已安装的插件列表
 */
const getInstalledPlugins = async () => {
  const list = await request.serverPost<LocalApiResponse[], null>('/api/v1/plugin/local') || []
  return list.map((item) => ({
    label: item.name,
    href: `/plugins/${item.id}`,
    icon: item.icon,
    type: item.type
  }))
}

export const siteConfig = {
  name: 'KarinJS WebUI',
  description: 'KarinJS WebUI.',
  navItems: [
    {
      Icon: MdSpaceDashboard,
      label: '总览',
      href: '/',
    },
    {
      Icon: RiSettings2Fill,
      label: '配置',
      href: '/config',
    },
    {
      Icon: MdStore,
      label: '插件市场',
      href: '/plugins/list',
    },
    {
      Icon: MdExtension,
      label: '插件配置',
      href: '/plugins',
      children: await getInstalledPlugins(),
    },
    // {
    //   Icon: FiCodesandbox,
    //   label: '沙箱',
    //   href: '/sandbox',
    // },
    {
      Icon: BsWindowSidebar,
      label: '关于',
      href: '/about',
    },
  ],
}
