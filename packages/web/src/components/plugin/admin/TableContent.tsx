import { FC, useRef } from 'react'
import { Card } from '@heroui/card'
import { Spinner } from '@heroui/spinner'
import { Button } from '@heroui/button'
import { Checkbox } from '@heroui/checkbox'
import { Progress } from '@heroui/progress'
import { TbRefresh } from 'react-icons/tb'
import LazyPluginLoader from '@/components/plugins/LazyPluginLoader'
import PluginRow from './PluginRow'
import type { PluginAdminListResponse } from 'node-karin'

/**
 * 表格内容组件属性接口
 */
export interface TableContentProps {
  /** 插件列表数据 */
  plugins: PluginAdminListResponse[]
  /** 加载状态 */
  loading: boolean
  /** 选中的插件ID映射表 */
  selectedMap: Map<string, boolean>
  /** 行高 */
  rowHeight: number
  /** 容器高度 */
  containerHeight: number
  /** 是否全选 */
  isAllSelected: boolean
  /** 是否处于部分选中状态 */
  isIndeterminate?: boolean
  /** 处理全选/取消全选 */
  handleSelectAll: () => void
  /** 处理选择插件 */
  handleSelectPlugin: (id: string, isSelected: boolean) => void
  /** 打开插件设置 */
  openSettings: (pluginId: string) => void
  /** 刷新插件列表 */
  fetchPlugins: () => void
  /** 是否跳过分片加载（当插件数量少时） */
  skipLazyLoading?: boolean
  /** 更新单个插件回调 */
  onUpdatePlugin?: (plugin: PluginAdminListResponse) => void
  /** 强制更新单个插件回调 */
  onForceUpdatePlugin?: (plugin: PluginAdminListResponse) => void
  /** 卸载单个插件回调 */
  onUninstallPlugin?: (plugin: PluginAdminListResponse) => void
}

/**
 * 表格内容组件
 */
const TableContent: FC<TableContentProps> = ({
  plugins,
  loading,
  selectedMap,
  rowHeight,
  containerHeight,
  isAllSelected,
  isIndeterminate = false,
  handleSelectAll,
  handleSelectPlugin,
  openSettings,
  fetchPlugins,
  skipLazyLoading = false, // 默认不跳过分片加载
  onUpdatePlugin,
  onForceUpdatePlugin,
  onUninstallPlugin,
}) => {
  /** 表格容器引用 */
  const tableContainerRef = useRef<HTMLDivElement>(null)

  if (loading) {
    return (
      <div className='flex items-center justify-center h-60 bg-default-100/30 dark:bg-default-200/10 backdrop-blur-sm rounded-xl shadow-sm'>
        <Spinner size='lg' color='primary' />
      </div>
    )
  }

  if (!plugins || plugins.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center h-60 bg-default-100/30 dark:bg-default-200/10 backdrop-blur-sm rounded-xl shadow-sm'>
        <p className='text-default-500 mb-4'>没有找到符合条件的插件</p>
        <Button
          color='primary'
          variant='flat'
          size='sm'
          startContent={<TbRefresh />}
          onPress={fetchPlugins}
        >
          刷新列表
        </Button>
      </div>
    )
  }

  // 如果插件数量少，跳过分片加载过程，直接渲染全部内容
  if (skipLazyLoading) {
    return (
      <Card className='overflow-hidden shadow-sm border-none bg-default-50/70 dark:bg-default-100/10 backdrop-blur-sm'>
        <div className='min-w-full flex flex-col'>
          {/* 表头 */}
          <div className='bg-default-50/50 sticky top-0 z-10 w-full'>
            <div className='grid grid-cols-12 w-full border-b border-default-100/70 -ml-[3px]'>
              {/* 选择框列 */}
              <div className='text-default-500 font-normal text-xs uppercase tracking-wider py-2 md:py-4 px-2 md:px-4 flex items-center justify-center col-span-1'>
                <div className='pl-1 sm:pl-0'>
                  <Checkbox
                    isSelected={isAllSelected}
                    isIndeterminate={isIndeterminate}
                    onValueChange={handleSelectAll}
                    size='sm'
                    aria-label='全选'
                    classNames={{
                      base: 'w-4 h-4',
                      wrapper: 'rounded-full w-4 h-4 border-1 border-default-300 data-[selected=true]:border-blue-500 data-[selected=true]:bg-blue-500 data-[indeterminate=true]:bg-blue-500 data-[indeterminate=true]:border-blue-500 data-[hover=true]:border-blue-400 data-[hover=true]:bg-blue-400/20 transition-all',
                      icon: 'text-white text-[10px]',
                    }}
                  />
                </div>
              </div>

              {/* 其他表头列（与原始实现相同）... */}
              {/* 插件名称列 */}
              <div className='text-default-500 font-normal text-xs uppercase tracking-wider py-3 md:py-4 pl-7 sm:pl-2 pr-2 md:px-4 col-span-6 sm:col-span-4'>
                插件名称
              </div>

              {/* 当前版本列 */}
              <div className='hidden sm:block text-default-500 font-normal text-xs uppercase tracking-wider py-3 md:py-4 px-1 sm:px-2 md:px-4 text-center col-span-3 sm:col-span-2'>
                当前版本
              </div>

              {/* 最新版本列 */}
              <div className='hidden sm:block text-default-500 font-normal text-xs uppercase tracking-wider py-3 md:py-4 px-1 sm:px-2 md:px-4 text-center col-span-3 sm:col-span-2'>
                最新版本
              </div>
            </div>
          </div>

          {/* 表格内容 - 直接渲染所有插件 */}
          <div className='w-full'>
            {plugins.map((plugin) => (
              <PluginRow
                key={plugin.name}
                plugin={plugin}
                isSelected={selectedMap.get(plugin.name) || false}
                onSelect={handleSelectPlugin}
                openSettings={openSettings}
                onUpdate={onUpdatePlugin}
                onForceUpdate={onForceUpdatePlugin}
                onUninstall={onUninstallPlugin}
              />
            ))}
          </div>
        </div>
      </Card>
    )
  }

  // 使用分片加载处理大量插件
  // 根据插件数量动态设置批量加载大小
  const isSmallPluginSet = plugins.length <= 10

  return (
    <LazyPluginLoader
      plugins={plugins}
      initialBatchSize={isSmallPluginSet ? plugins.length : 2} // 当插件数量少时，一次性加载全部
      batchSize={isSmallPluginSet ? plugins.length : 3}        // 当插件数量少时，批处理大小设为全部
    >
      {({ processedPlugins, progress }) => (
        <>
          {/* 只有在插件数量较多时，才显示加载进度 */}
          {!isSmallPluginSet && progress < 100 && (
            <div className='mb-4'>
              <Progress
                value={progress}
                color='primary'
                size='sm'
                radius='sm'
                classNames={{
                  base: 'max-w-md',
                  track: 'drop-shadow-sm border border-default-100/50',
                  indicator: 'bg-gradient-to-r from-primary-500 to-primary-400',
                }}
                aria-label='加载插件进度'
              />
              <div className='text-xs text-default-500 mt-1'>
                正在加载插件 ({progress}%)... 总计:{plugins.length}个插件
              </div>
            </div>
          )}

          <Card className='overflow-hidden shadow-sm border-none bg-default-50/70 dark:bg-default-100/10 backdrop-blur-sm'>
            <div className='min-w-full flex flex-col'>
              {/* 表头 */}
              <div className='bg-default-50/50 sticky top-0 z-10 w-full'>
                <div className='grid grid-cols-12 w-full border-b border-default-100/70 -ml-[3px]'>
                  {/* 选择框列 */}
                  <div className='text-default-500 font-normal text-xs uppercase tracking-wider py-2 md:py-4 px-2 md:px-4 flex items-center justify-center col-span-1'>
                    <div className='pl-1 sm:pl-0'>
                      <Checkbox
                        isSelected={isAllSelected}
                        isIndeterminate={isIndeterminate}
                        onValueChange={handleSelectAll}
                        size='sm'
                        aria-label='全选'
                        classNames={{
                          base: 'w-4 h-4',
                          wrapper: 'rounded-full w-4 h-4 border-1 border-default-300 data-[selected=true]:border-blue-500 data-[selected=true]:bg-blue-500 data-[indeterminate=true]:bg-blue-500 data-[indeterminate=true]:border-blue-500 data-[hover=true]:border-blue-400 data-[hover=true]:bg-blue-400/20 transition-all',
                          icon: 'text-white text-[10px]',
                        }}
                      />
                    </div>
                  </div>

                  {/* 插件名称列 */}
                  <div className='text-default-500 font-normal text-xs uppercase tracking-wider py-3 md:py-4 pl-7 sm:pl-2 pr-2 md:px-4 col-span-6 sm:col-span-4'>
                    插件名称
                  </div>

                  {/* 当前版本列 */}
                  <div className='hidden sm:block text-default-500 font-normal text-xs uppercase tracking-wider py-3 md:py-4 px-1 sm:px-2 md:px-4 text-center col-span-3 sm:col-span-2'>
                    当前版本
                  </div>

                  {/* 最新版本列 */}
                  <div className='hidden sm:block text-default-500 font-normal text-xs uppercase tracking-wider py-3 md:py-4 px-1 sm:px-2 md:px-4 text-center col-span-3 sm:col-span-2'>
                    最新版本
                  </div>

                  {/* 插件类型列 */}
                  <div className='hidden sm:block text-default-500 font-normal text-xs uppercase tracking-wider py-3 md:py-4 px-2 md:px-4 text-center col-span-1'>
                    插件类型
                  </div>

                  {/* 状态列 */}
                  <div className='text-default-500 font-normal text-xs uppercase tracking-wider py-3 md:py-4 px-0 md:px-4 text-center col-span-3 sm:col-span-1'>
                    <div className='flex justify-end sm:justify-center pr-8 sm:pr-0'>状态</div>
                  </div>

                  {/* 操作列 */}
                  <div className='text-default-500 font-normal text-xs uppercase tracking-wider py-3 md:py-4 pl-0 pr-0 sm:px-2 md:px-4 text-center col-span-2 sm:col-span-1'>
                    <div className='flex justify-end sm:justify-center pr-4 sm:pr-0'>操作</div>
                  </div>
                </div>
              </div>

              {/* 虚拟滚动容器 */}
              <div
                ref={tableContainerRef}
                className='overflow-auto'
                style={{ height: `${containerHeight}px` }}
              >
                {/* 内容容器 */}
                <div
                  style={{
                    height: `${processedPlugins.length * rowHeight}px`,
                    width: '100%',
                    position: 'relative',
                  }}
                >
                  {/* 渲染插件行 */}
                  {processedPlugins.map((plugin, index) => {
                    const isSelected = selectedMap.has(plugin.name)

                    return (
                      <div
                        key={plugin.name}
                        style={{
                          position: 'absolute',
                          top: `${index * rowHeight}px`,
                          left: 0,
                          width: '100%',
                          height: `${rowHeight}px`,
                        }}
                      >
                        <PluginRow
                          plugin={plugin}
                          isSelected={isSelected}
                          onSelect={handleSelectPlugin}
                          openSettings={openSettings}
                          onUpdate={onUpdatePlugin}
                          onForceUpdate={onForceUpdatePlugin}
                          onUninstall={onUninstallPlugin}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </LazyPluginLoader>
  )
}

export default TableContent
