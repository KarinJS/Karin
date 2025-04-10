import { Input } from '@heroui/input'
import { Chip } from '@heroui/chip'
import { IoSearch } from 'react-icons/io5'
import { LuPackage, LuDownload } from 'react-icons/lu'
import { FilterMode } from '../../pages/dashboard/dependencies/dependencies.utils'

interface DependencyFilterProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  filterMode: FilterMode
  count: number
}

const DependencyFilter = ({ searchTerm, setSearchTerm, filterMode, count }: DependencyFilterProps) => {
  /**
   * 获取过滤标签的颜色和图标
   */
  const getFilterConfig = (mode: FilterMode) => {
    switch (mode) {
      case 'all':
        return {
          color: 'primary' as const,
          icon: <LuPackage size={14} />,
          text: '全部依赖',
        }
      case 'plugins':
        return {
          color: 'success' as const,
          icon: <LuPackage size={14} />,
          text: 'Karin 插件',
        }
      case 'updatable':
        return {
          color: 'warning' as const,
          icon: <LuDownload size={14} />,
          text: '可更新依赖',
        }
      default:
        return {
          color: 'default' as const,
          icon: <LuPackage size={14} />,
          text: '未知类型',
        }
    }
  }

  const filterConfig = getFilterConfig(filterMode)

  return (
    <div className='flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4 mb-4 md:mb-6 pb-4 md:pb-6 border-b border-default-100'>
      <Input
        placeholder='搜索依赖包...'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        startContent={<IoSearch className='text-default-400' />}
        radius='full'
        size='sm'
        classNames={{
          inputWrapper: 'border border-default-200 shadow-sm h-9',
          input: 'font-light text-sm',
          base: 'min-w-0',
        }}
        className='max-w-md'
      />

      <div className='flex items-center gap-2 ml-0 sm:ml-1'>
        <Chip
          color={filterConfig.color}
          variant='flat'
          startContent={filterConfig.icon}
          className='font-normal text-xs px-2 h-6'
          radius='full'
        >
          {filterConfig.text}
        </Chip>

        <div className='text-xs md:text-sm text-default-400 ml-1 md:ml-2'>
          共 {count} 个依赖
        </div>
      </div>
    </div>
  )
}

export default DependencyFilter
