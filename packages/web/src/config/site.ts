export type SiteConfig = typeof siteConfig
import { MdSpaceDashboard,MdExtension} from 'react-icons/md'
import { RiSettings2Fill  } from 'react-icons/ri'
import { FiCodesandbox } from "react-icons/fi";
import { BsWindowSidebar } from "react-icons/bs";

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
      Icon: MdExtension,
      label: '插件',
      href: '/plugins',
    },
    {
      Icon: FiCodesandbox,
      label: '沙箱',
      href: '/sandbox',
    },
    {
      Icon: BsWindowSidebar,
      label: '关于',
      href: '/about',
    },
  ],
}
