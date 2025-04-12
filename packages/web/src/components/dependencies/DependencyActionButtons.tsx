import { memo } from 'react'
import { Button } from '@heroui/button'
import { IoRefresh } from 'react-icons/io5'
import { LuDownload, LuTrash2, LuPlus } from 'react-icons/lu'
import type { FilterMode } from '@/pages/dashboard/dependencies/dependencies.utils'

interface DependencyActionButtonsProps {
  /** 是否正在加载 */
  isLoading: boolean
  /** 是否在操作中 */
  isOperating: boolean
  /** 过滤模式 */
  filterMode: FilterMode
  /** 已选依赖数量 */
  selectedCount: number
  /** 刷新依赖回调 */
  onRefresh: () => void
  /** 打开安装模态框回调 */
  onOpenInstallModal: () => void
  /** 更新依赖回调 */
  onUpdate: () => void
  /** 卸载依赖回调 */
  onUninstall: () => void
}

/**
 * 依赖管理操作按钮组
 */
const DependencyActionButtons = ({
  isLoading,
  isOperating,
  filterMode,
  selectedCount,
  onRefresh,
  onOpenInstallModal,
  onUpdate,
  onUninstall,
}: DependencyActionButtonsProps) => {
  return (
    <div className='flex flex-wrap items-center gap-2 md:gap-3'>
      <Button
        color='default'
        startContent={<IoRefresh size={14} className='text-default-500' />}
        isLoading={isLoading}
        onPress={onRefresh}
        size='sm'
        radius='full'
        variant='light'
        className='font-normal'
      >
        刷新
      </Button>

      <Button
        color='primary'
        startContent={<LuPlus size={14} />}
        onPress={onOpenInstallModal}
        size='sm'
        radius='full'
        variant='flat'
        className='font-normal'
      >
        新增依赖
      </Button>

      <Button
        color='success'
        startContent={<LuDownload size={14} />}
        onPress={onUpdate}
        size='sm'
        radius='full'
        variant='flat'
        className='font-normal'
        isLoading={isOperating || isLoading}
        isDisabled={(filterMode !== 'all' && selectedCount === 0) || isOperating}
      >
        {selectedCount > 0 ? '更新选中' : '更新全部'}
      </Button>

      <Button
        color='danger'
        startContent={<LuTrash2 size={14} />}
        onPress={onUninstall}
        size='sm'
        radius='full'
        variant='flat'
        className='font-normal'
        isDisabled={selectedCount === 0 || isOperating}
        isLoading={isOperating || isLoading}
      >
        卸载依赖
      </Button>
    </div>
  )
}

export default memo(DependencyActionButtons)
