import { MdSpaceDashboard, MdExtension, MdStore } from 'react-icons/md'
import { RiSettings2Fill } from 'react-icons/ri'
// import { FiCodesandbox } from 'react-icons/fi'
import { BsWindowSidebar } from 'react-icons/bs'
export type SiteConfig = typeof siteConfig

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
      children: [
        {
          label: '插件1',
          href: '/plugins/plugin1',
        },
        {
          label: '插件2',
          href: '/plugins/plugin2',
        },
        {
          label: '插件3',
          href: '/plugins/plugin3',
        }
      ]
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
