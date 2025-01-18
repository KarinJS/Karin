export type SiteConfig = typeof siteConfig
import { MdSpaceDashboard } from 'react-icons/md'
import { RiSettings2Fill } from 'react-icons/ri'

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
  ],
}
