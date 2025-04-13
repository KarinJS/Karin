import { memo } from 'react'
import { Button } from '@heroui/button'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown'
import { LuDownload, LuTrash2, LuSettings, LuRefreshCw, LuPackagePlus, LuGlobe, LuSettings2 } from 'react-icons/lu'
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
  /** 打开npm配置模态框回调 */
  onOpenNpmConfigModal: () => void
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
  onOpenNpmConfigModal,
}: DependencyActionButtonsProps) => {
  return (
    <div className='flex flex-wrap items-center gap-2 md:gap-3'>
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

      <Dropdown>
        <DropdownTrigger>
          <Button
            color='secondary'
            startContent={<LuSettings size={14} className='text-secondary-500' />}
            size='sm'
            radius='full'
            variant='flat'
            className='font-normal'
          >
            选项
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label='依赖管理选项' variant='flat'>
          <DropdownItem
            key='refresh'
            startContent={<LuRefreshCw size={14} className='text-blue-500' />}
            onPress={onRefresh}
            isDisabled={isLoading || isOperating}
          >
            刷新依赖
          </DropdownItem>
          <DropdownItem
            key='install'
            startContent={<LuPackagePlus size={14} className='text-primary-500' />}
            onPress={onOpenInstallModal}
          >
            新增依赖
          </DropdownItem>
          <DropdownItem
            key='config'
            startContent={<LuSettings2 size={14} className='text-warning-500' />}
            onPress={onOpenNpmConfigModal}
          >
            npm配置管理
          </DropdownItem>
          <DropdownItem
            key='global'
            startContent={<LuGlobe size={14} className='text-success-500' />}
            isDisabled
            description='即将到来...'
          >
            全局依赖管理
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  )
}

export default memo(DependencyActionButtons)
