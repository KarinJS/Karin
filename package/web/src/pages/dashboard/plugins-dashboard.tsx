import { LuPackage, LuDownload } from 'react-icons/lu'
import { LocalPluginList, PluginAdminCard } from '@/components/plugin/index'

/**
 * 插件管理概览页面
 */
const PluginsDashboard = () => {
  return (
    <div className='w-full p-4 sm:p-6 md:p-8'>
      {/* 页面标题和操作按钮 */}
      <div className='mb-6 md:mb-10'>
        <div className='flex flex-wrap items-start justify-between gap-3 md:gap-6'>
          <div className='flex flex-col'>
            <h1 className='text-2xl md:text-3xl font-light text-foreground/90 tracking-tight flex items-center gap-2'>
              <LuPackage size={24} className='text-primary-500' />
              插件索引
            </h1>
            <p className='text-sm md:text-base text-default-500 mt-0.5 md:mt-1'>
              ✨ 欢迎来到插件小屋～在这里轻松发现并管理你的所有插件！
            </p>
          </div>
        </div>

      </div>

      {/* 插件索引 头部卡片组件 */}
      <PluginAdminCard />

      {/* 插件列表 */}
      <h3 className='mt-10 text-2xl md:text-3xl font-light text-foreground/90 tracking-tight flex items-center gap-2'>
        <LuDownload size={24} className='text-primary-500' />
        已安装插件
      </h3>
      <div className='space-y-4 mt-4'>
        {/* 搜索和过滤区域可以在这里添加 */}
        <LocalPluginList />
      </div>
    </div>
  )
}

export default PluginsDashboard
