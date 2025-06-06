import { FC } from 'react'
import { FaNpm } from 'react-icons/fa6'
import { IoSettingsOutline } from 'react-icons/io5'
import { TbBrandGit, TbApps } from 'react-icons/tb'
import StatCard from '@/components/card/StatCard'
import { renderIcon, type PluginType } from './utils'

/**
 * 插件数量统计接口
 */
export interface PluginCounts {
  all: number
  git: number
  app: number
  npm: number
  [key: string]: number
}

/**
 * 筛选卡片组件属性接口
 */
export interface FilterCardsProps {
  /** 插件数量统计 */
  counts: PluginCounts
  /** 当前选中的插件类型 */
  selectedType: PluginType
  /** 类型变更回调函数 */
  onTypeChange: (type: PluginType) => void
}

/**
 * 渲染筛选卡片组件
 */
const FilterCards: FC<FilterCardsProps> = ({ counts, selectedType, onTypeChange }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
      <StatCard
        title='全部'
        count={counts.all}
        description='全部插件'
        icon={renderIcon(24, IoSettingsOutline)}
        gradient='bg-gradient-to-br from-indigo-400/10 to-indigo-500/20 dark:from-indigo-600/10 dark:to-indigo-700/20'
        border='border border-indigo-200/30 dark:border-indigo-800/20'
        iconBg='bg-indigo-400/20 dark:bg-indigo-700/30'
        textColor='text-indigo-700 dark:text-indigo-300'
        ringColor='ring-indigo-400 dark:ring-indigo-500'
        isActive={selectedType === 'all'}
        onClick={() => onTypeChange('all')}
      />

      <StatCard
        title='Git插件'
        count={counts.git}
        description='Git 插件'
        icon={renderIcon(24, TbBrandGit)}
        gradient='bg-gradient-to-br from-amber-400/10 to-amber-500/20 dark:from-amber-600/10 dark:to-amber-700/20'
        border='border border-amber-200/30 dark:border-amber-800/20'
        iconBg='bg-amber-400/20 dark:bg-amber-700/30'
        textColor='text-amber-700 dark:text-amber-300'
        ringColor='ring-amber-400 dark:ring-amber-500'
        isActive={selectedType === 'git'}
        onClick={() => onTypeChange('git')}
      />

      <StatCard
        title='App插件'
        count={counts.app}
        description={window.innerWidth <= 640 ? 'App插件 (插件名称省略了前缀)' : 'App插件'}
        icon={renderIcon(24, TbApps)}
        gradient='bg-gradient-to-br from-teal-400/10 to-teal-500/20 dark:from-teal-600/10 dark:to-teal-700/20'
        border='border border-teal-200/30 dark:border-teal-800/20'
        iconBg='bg-teal-400/20 dark:bg-teal-700/30'
        textColor='text-teal-700 dark:text-teal-300'
        ringColor='ring-teal-400 dark:ring-teal-500'
        isActive={selectedType === 'app'}
        onClick={() => onTypeChange('app')}
      />

      <StatCard
        title='NPM插件'
        count={counts.npm}
        description='Npm包插件'
        icon={renderIcon(24, FaNpm)}
        gradient='bg-gradient-to-br from-rose-400/10 to-rose-500/20 dark:from-rose-600/10 dark:to-rose-700/20'
        border='border border-rose-200/30 dark:border-rose-800/20'
        iconBg='bg-rose-400/20 dark:bg-rose-700/30'
        textColor='text-rose-700 dark:text-rose-300'
        ringColor='ring-rose-400 dark:ring-rose-500'
        isActive={selectedType === 'npm'}
        onClick={() => onTypeChange('npm')}
      />
    </div>
  )
}

export default FilterCards
