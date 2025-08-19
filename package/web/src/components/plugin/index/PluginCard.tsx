import {
  LuPackage,
  LuPlug,
  LuGlobe,
  LuDownload,
} from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'
import { BasicCard } from '@/components/card'
import { useState } from 'react'

/**
 * 渲染图标
 */
const renderIcon = (size: number, largeSize: number, Icon: typeof LuPackage) => (
  <>
    <Icon size={size} className='md:hidden' />
    <Icon size={largeSize} className='hidden md:block' />
  </>
)

const useSmartNavigate = () => {
  const navigate = useNavigate()
  const [isNavigating, setIsNavigating] = useState<Record<string, boolean>>({})

  const handleNavigation = (path: string) => {
    if (isNavigating[path]) return
    /** 设置导航状态 */
    setIsNavigating(prev => ({ ...prev, [path]: true }))

    /** 增加小延迟提供更好的视觉反馈 */
    setTimeout(() => {
      navigate(path)
      setIsNavigating(prev => ({ ...prev, [path]: false }))
    }, 150)
  }

  return { handleNavigation, isNavigating }
}

/**
 * 插件索引 头部卡片组件
 */
const PluginAdminCard = () => {
  const { handleNavigation, isNavigating } = useSmartNavigate()

  return (
    <>
      {/* 信息统计卡片 */}
      <div className='grid grid-cols-1 sm:grid-cols-4 gap-2 md:gap-4 mt-4 md:mt-6'>
        {/* 插件市场卡片 */}
        <BasicCard
          title='插件市场'
          description='浏览和安装新插件'
          icon={renderIcon(16, 20, LuPlug)}
          gradient='bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20'
          border='border border-green-200/50 dark:border-green-800/30'
          iconBg='bg-green-100 dark:bg-green-700/30'
          textColor='text-green-600 dark:text-green-400'
          ringColor='ring-green-400 dark:ring-green-500'
          isActive={isNavigating['/plugins/list']}
          onClick={() => handleNavigation('/plugins/list')}
          tooltip='访问插件市场，浏览和安装新插件'
        />

        {/* 依赖管理卡片 */}
        <BasicCard
          title='依赖管理'
          description='管理系统依赖'
          icon={renderIcon(16, 20, LuPackage)}
          gradient='bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20'
          border='border border-blue-200/50 dark:border-blue-800/30'
          iconBg='bg-blue-100 dark:bg-blue-700/30'
          textColor='text-blue-600 dark:text-blue-400'
          ringColor='ring-blue-400 dark:ring-blue-500'
          isActive={isNavigating['/dependencies']}
          onClick={() => handleNavigation('/dependencies')}
          tooltip='管理系统依赖和npm库'
        />

        {/* 已安装卡片 */}
        <BasicCard
          title='已安装'
          description='管理已安装插件'
          icon={renderIcon(16, 20, LuDownload)}
          gradient='bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20'
          border='border border-amber-200/50 dark:border-amber-800/30'
          iconBg='bg-amber-100 dark:bg-amber-700/30'
          textColor='text-amber-600 dark:text-amber-400'
          ringColor='ring-amber-400 dark:ring-amber-500'
          isActive={isNavigating['/plugins/manage']}
          onClick={() => handleNavigation('/plugins/manage')}
          tooltip='查看和管理已安装的插件'
        />

        {/* WebUI插件卡片 */}
        <BasicCard
          title='WebUI插件'
          description='管理WebUI插件'
          icon={renderIcon(16, 20, LuGlobe)}
          gradient='bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20'
          border='border border-purple-200/50 dark:border-purple-800/30'
          iconBg='bg-purple-100 dark:bg-purple-700/30'
          textColor='text-purple-600 dark:text-purple-400'
          ringColor='ring-purple-400 dark:ring-purple-500'
          isActive={isNavigating['/plugins/webui']}
          onClick={() => handleNavigation('/plugins/webui')}
          tooltip='管理网页控制台相关插件'
        />

      </div>
    </>
  )
}

export default PluginAdminCard
