import { Input } from '@heroui/input'
import { IoSearch } from 'react-icons/io5'
import { FilterMode } from '../../pages/dashboard/dependencies.utils'

interface DependencyFilterProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  filterMode: FilterMode
  count: number
}

const DependencyFilter = ({ searchTerm, setSearchTerm, filterMode, count }: DependencyFilterProps) => {
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

      <div className='flex items-center gap-2 text-default-600 ml-0 sm:ml-1'>
        <div className='px-2 py-1 text-xs rounded-full bg-default-100 dark:bg-default-200/10'>
          {filterMode === 'all' && '全部依赖'}
          {filterMode === 'plugins' && 'Karin 插件'}
          {filterMode === 'updatable' && '可更新依赖'}
        </div>

        <div className='text-xs md:text-sm text-default-400 ml-1 md:ml-2'>
          共 {count} 个依赖
        </div>
      </div>
    </div>
  )
}

export default DependencyFilter
