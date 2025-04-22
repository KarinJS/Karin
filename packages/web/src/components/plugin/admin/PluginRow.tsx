/* eslint-disable @stylistic/indent */
import { memo, useCallback } from 'react'
import { Checkbox } from '@heroui/checkbox'
import { Chip } from '@heroui/chip'
import { Button } from '@heroui/button'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown'
import { TbArrowUp, TbTrash, TbArrowsUp, TbCircleDashed } from 'react-icons/tb'
import { IoSettingsOutline } from 'react-icons/io5'
import { getUpdateStatusConfig, getTypeConfig, stopPropagation } from './utils'

/**
 * 插件项目接口定义
 */
export interface PluginItem {
  id: string
  name: string
  version: string
  latestHash: string
  type: 'git' | 'app'
  description?: string
}

/**
 * 插件行组件属性接口
 */
export interface PluginRowProps {
  /** 插件数据 */
  plugin: PluginItem
  /** 是否被选中 */
  isSelected: boolean
  /** 选择回调函数 */
  onSelect: (id: string, isSelected: boolean) => void
  /** 打开设置回调函数 */
  openSettings: (pluginId: string) => void
}

/**
 * 插件行组件，使用memo优化渲染
 */
const PluginRow = memo(({
  plugin,
  isSelected,
  onSelect,
  openSettings,
}: PluginRowProps) => {
  /** 插件更新状态 */
  const statusConfig = getUpdateStatusConfig(plugin.type, plugin.version, plugin.latestHash)
  /** 插件类型配置 */
  const typeConfig = getTypeConfig(plugin.type)

  /** 处理选择状态变更 */
  const handleSelectionChange = useCallback(() => {
    onSelect(plugin.id, !isSelected)
  }, [plugin.id, isSelected, onSelect])

  /** 处理下拉菜单操作 */
  const handleDropdownAction = useCallback((key: React.Key) => {
    console.log(`对插件 ${plugin.id} 执行操作: ${key}`)
    // 根据key类型处理不同的操作
    switch (key) {
      case 'settings':
        openSettings(plugin.id)
        break
      case 'update':
        // TODO:  处理更新操作
        break
      case 'forceUpdate':
        // TODO: 处理强制更新操作
        break
      case 'uninstall':
        // TODO: 处理卸载操作
        break
      default:
        break
    }
  }, [plugin.id, openSettings])

  return (
    <div className='grid grid-cols-12 w-full border-b border-default-100/40 hover:bg-default-50/70 transition-colors' onClick={() => onSelect(plugin.id, !isSelected)}>
      {/* 选择框 */}
      <div className='py-3 md:py-4 px-2 md:px-4 text-sm flex items-center justify-center col-span-1' onClick={stopPropagation}>
        <div className='flex items-center justify-center w-full'>
          <Checkbox
            isSelected={isSelected}
            onValueChange={handleSelectionChange}
            size='sm'
            aria-label={`选择 ${plugin.name}`}
            classNames={{
              base: 'w-4 h-4',
              wrapper: 'rounded-full w-4 h-4 border-1 border-default-300 data-[selected=true]:border-blue-500 data-[selected=true]:bg-blue-500 data-[hover=true]:border-blue-400 data-[hover=true]:bg-blue-400/20 transition-all',
              icon: 'text-white text-[10px]',
            }}
          />
        </div>
      </div>

      {/* 插件名称 */}
      <div className='py-3 md:py-4 px-2 md:px-4 text-sm col-span-6 sm:col-span-4 flex items-center'>
        <div className='flex items-center w-full'>
          <div className='flex-shrink-0'>
            <div
              className='w-2 md:w-2.5 h-2 md:h-2.5 rounded-full mr-1.5 md:mr-2.5 flex-shrink-0 translate-y-[0.5px] sm:translate-y-0'
              style={{
                backgroundColor: plugin.type === 'app' ? '#10b981' : '#f59e0b',
                boxShadow: plugin.type === 'app' ? '0 0 6px rgba(16, 185, 129, 0.3)' : '0 0 6px rgba(245, 158, 11, 0.3)',
              }}
            />
          </div>
          <div className='font-medium text-default-700 dark:text-default-300 w-full break-words whitespace-normal'>
            {window.innerWidth <= 640
              ? (
                <span className='text-xs'>
                  {
                    plugin.type === 'app'
                      ? plugin.name.replace('karin-plugin-', '')
                      : plugin.name
                  }
                </span>
              )
              : plugin.name}
          </div>
        </div>
      </div>

      {/* 当前版本 */}
      <div className='hidden sm:block py-3 md:py-4 px-1 sm:px-2 md:px-4 text-sm col-span-3 sm:col-span-2 text-center'>
        {plugin.type === 'app'
          ? (
            <span className='text-xs text-default-500'>-</span>
          )
          : (
            <Chip size='sm' variant='flat' color='primary' className='bg-primary-100/50'>
              {plugin.version}
            </Chip>
          )}
      </div>

      {/* 最新版本 */}
      <div className='hidden sm:block py-3 md:py-4 px-1 sm:px-2 md:px-4 text-sm col-span-3 sm:col-span-2 text-center'>
        {plugin.type === 'app'
          ? (
            <span className='text-xs text-default-500'>-</span>
          )
          : (
            plugin.latestHash !== plugin.version
              ? (
                <Chip size='sm' variant='flat' color='warning' className='bg-warning-100/50'>
                  {plugin.latestHash}
                </Chip>
              )
              : (
                <Chip size='sm' variant='flat' color='success' className='bg-success-100/50'>
                  {plugin.version}
                </Chip>
              )
          )}
      </div>

      {/* 插件类型 */}
      <div className='hidden sm:block py-3 md:py-4 px-2 md:px-4 text-sm text-center col-span-1'>
        <div
          className='w-20 mx-auto h-6 flex items-center justify-center rounded-full border text-xs'
          style={{
            backgroundColor: typeConfig.color === 'primary'
              ? 'rgba(59, 130, 246, 0.1)'
              : typeConfig.color === 'danger'
                ? 'rgba(239, 68, 68, 0.1)'
                : typeConfig.color === 'warning'
                  ? 'rgba(234, 179, 8, 0.1)'
                  : 'rgba(161, 161, 170, 0.1)',
            color: typeConfig.color === 'primary'
              ? 'rgb(37, 99, 235)'
              : typeConfig.color === 'danger'
                ? 'rgb(220, 38, 38)'
                : typeConfig.color === 'warning'
                  ? 'rgb(202, 138, 4)'
                  : 'rgb(113, 113, 122)',
            borderColor: typeConfig.color === 'primary'
              ? 'rgba(59, 130, 246, 0.2)'
              : typeConfig.color === 'danger'
                ? 'rgba(239, 68, 68, 0.2)'
                : typeConfig.color === 'warning'
                  ? 'rgba(234, 179, 8, 0.2)'
                  : 'rgba(161, 161, 170, 0.2)',
          }}
        >
          {typeConfig.text}
        </div>
      </div>

      {/* 状态 */}
      <div className='py-3 md:py-4 px-0 md:px-4 text-sm text-center col-span-3 sm:col-span-1 pl-1'>
        <div className='flex justify-end sm:justify-center items-center pr-0 sm:pr-0'>
          {plugin.type === 'app'
            ? (
              <div
                className='inline-flex items-center justify-center w-20 h-6 text-xs rounded-md border'
                style={{
                  backgroundColor: 'rgba(107, 114, 128, 0.08)', /** 灰色背景 */
                  color: 'rgb(75, 85, 99)', /** 灰色文字 */
                  borderColor: 'rgba(107, 114, 128, 0.2)', /** 灰色边框 */
                }}
              >
                <TbCircleDashed className='text-xs mr-1' />
              </div>
            )
            : (
              <div
                className='inline-flex items-center justify-center w-20 h-6 text-xs rounded-md border'
                style={{
                  backgroundColor: statusConfig.color === 'success'
                    ? 'rgba(34, 197, 94, 0.08)'
                    : statusConfig.color === 'warning'
                      ? 'rgba(234, 179, 8, 0.08)'
                      : 'rgba(161, 161, 170, 0.08)',
                  color: statusConfig.color === 'success'
                    ? 'rgb(22, 163, 74)'
                    : statusConfig.color === 'warning'
                      ? 'rgb(202, 138, 4)'
                      : 'rgb(113, 113, 122)',
                  borderColor: statusConfig.color === 'success'
                    ? 'rgba(34, 197, 94, 0.2)'
                    : statusConfig.color === 'warning'
                      ? 'rgba(234, 179, 8, 0.2)'
                      : 'rgba(161, 161, 170, 0.2)',
                }}
              >
                {statusConfig.icon}
                <span className='font-normal'>{statusConfig.text}</span>
              </div>
            )}
        </div>
      </div>

      {/* 操作 */}
      <div className='py-3 md:py-4 pl-0 pr-0 sm:px-2 md:px-4 text-sm text-center col-span-2 sm:col-span-1' onClick={stopPropagation}>
        <div className='flex justify-end sm:justify-center pr-2 sm:pr-0'>
          <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                size='sm'
                variant='light'
                color='primary'
                className='opacity-70 hover:opacity-100 transition-opacity'
              >
                <IoSettingsOutline className='text-lg' />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label='插件操作' onAction={handleDropdownAction}>
              {/* 配置选项 - 只有git类型才显示 */}
              {plugin.type === 'git'
                ? (
                  <DropdownItem key='settings' description='调整插件配置'>
                    <div className='flex items-center gap-2'>
                      <IoSettingsOutline />
                      <span>插件配置</span>
                    </div>
                  </DropdownItem>
                )
                : null}

              {/* 更新按钮 - 对app类型不显示且必须是可更新状态 */}
              {plugin.type !== 'app' && plugin.version !== plugin.latestHash
                ? (
                  <DropdownItem key='update' description='更新到最新版本' className='text-success'>
                    <div className='flex items-center gap-2'>
                      <TbArrowUp />
                      <span>更新插件</span>
                    </div>
                  </DropdownItem>
                )
                : null}

              {/* Git类型特有的强制更新按钮 */}
              {plugin.type === 'git'
                ? (
                  <DropdownItem key='forceUpdate' description='强制拉取最新代码' className='text-warning'>
                    <div className='flex items-center gap-2'>
                      <TbArrowsUp />
                      <span>强制更新</span>
                    </div>
                  </DropdownItem>
                )
                : null}

              {/* 卸载按钮 - 所有类型都显示 */}
              <DropdownItem key='uninstall' description='从系统移除此插件' className='text-danger'>
                <div className='flex items-center gap-2'>
                  <TbTrash />
                  <span>卸载插件</span>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  )
})

PluginRow.displayName = 'PluginRow'

export default PluginRow
