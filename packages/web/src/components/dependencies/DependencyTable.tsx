import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { Select, SelectItem } from '@heroui/select'
import { Link } from '@heroui/link'
import { Tooltip } from '@heroui/tooltip'
import { Checkbox } from '@heroui/checkbox'
import { LuSettings, LuDownload, LuCheck } from 'react-icons/lu'
import { getNpmLink, hasUpdate } from '../../pages/dashboard/dependencies/dependencies.utils'
import { useRef, memo, useCallback, useMemo } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { Dependency } from 'node-karin'

interface DependencyTableProps {
  dependencies: Dependency[]
  pendingChanges: Record<string, string>
  selectedDependencies: string[]
  updateDependencyVersion: (name: string, version: string) => void
  openSettings: (dependency: Dependency) => void
  onSelectDependency: (name: string, isSelected: boolean) => void
  onSelectAll: (isSelected: boolean) => void
}

/**
 * 将依赖类型转换为中文显示
 * @param type - 依赖类型
 * @returns 中文依赖类型
 */
const getDependencyTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    dependencies: '生产依赖',
    devDependencies: '开发依赖',
    unsavedDependencies: '临时依赖',
    peerDependencies: '对等依赖',
    optionalDependencies: '可选依赖',
  }

  return typeMap[type] || '未知类型'
}

/**
 * 获取依赖类型对应的颜色
 * @param type - 依赖类型
 * @returns 颜色类型
 */
const getDependencyTypeColor = (type: string): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' => {
  const colorMap: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'danger'> = {
    dependencies: 'success',    // 生产依赖：绿色
    devDependencies: 'secondary', // 开发依赖：紫色
    unsavedDependencies: 'danger',  // 临时依赖：红色
    peerDependencies: 'primary',   // 对等依赖：蓝色
    optionalDependencies: 'warning',  // 可选依赖：黄色
  }

  return colorMap[type] || 'primary'
}

/**
 * 阻止事件冒泡
 * @param e - 事件对象
 */
const stopPropagation = (e: React.MouseEvent | React.TouchEvent) => {
  e.stopPropagation()
}

/**
 * 依赖项行组件，使用memo优化渲染
 */
const DependencyRow = memo(({
  dependency,
  pendingChanges,
  isSelected,
  updateDependencyVersion,
  openSettings,
  onSelectDependency,
}: {
  dependency: Dependency
  pendingChanges: Record<string, string>
  isSelected: boolean
  updateDependencyVersion: (name: string, version: string) => void
  openSettings: (dependency: Dependency) => void
  onSelectDependency: (name: string, isSelected: boolean) => void
}) => {
  // 查找当前版本是否在latest列表中
  const currentVersionExists = dependency.latest.includes(dependency.current)
  // 如果不存在，默认选择最新版本（列表的最后一项）
  const defaultVersion = currentVersionExists
    ? dependency.current
    : dependency.latest[dependency.latest.length - 1]

  // 获取待显示的版本：优先使用pendingChanges中的值，否则使用defaultVersion
  const displayedVersion = pendingChanges[dependency.name] || defaultVersion

  // 构建package.json值的tooltip提示内容
  const packageTooltip = dependency.packageValue
    ? `package.json 中的值: ${dependency.packageValue}`
    : '未在 package.json 中定义'

  // 处理选择状态变更，但不传递事件对象
  const handleSelectionChange = useCallback(() => {
    onSelectDependency(dependency.name, !isSelected)
  }, [dependency.name, isSelected, onSelectDependency])

  // 处理设置按钮点击，但不传递事件对象
  const handleOpenSettings = useCallback(() => {
    openSettings(dependency)
  }, [dependency, openSettings])

  // 处理版本选择变更
  const handleVersionChange = useCallback((keys: any) => {
    const selectedKey = Array.from(keys as Set<string>)[0] as string
    if (selectedKey) {
      updateDependencyVersion(dependency.name, selectedKey)
      // 当切换版本时自动选中
      if (!isSelected) {
        onSelectDependency(dependency.name, true)
      }
    }
  }, [dependency.name, isSelected, onSelectDependency, updateDependencyVersion])

  return (
    <div className='grid grid-cols-12 w-full border-b border-default-100/40 hover:bg-default-50/70 transition-colors'>
      {/* 选择框 */}
      <div className='py-3 md:py-4 px-2 md:px-4 text-sm flex items-center justify-center col-span-1' onClick={stopPropagation}>
        <div className="flex items-center justify-center w-full">
          <Checkbox
            isSelected={isSelected}
            onValueChange={handleSelectionChange}
            size='sm'
            aria-label={`选择 ${dependency.name}`}
            classNames={{
              base: 'w-4 h-4',
              wrapper: 'rounded-full w-4 h-4 border-1 border-default-300 data-[selected=true]:border-blue-500 data-[selected=true]:bg-blue-500 data-[hover=true]:border-blue-400 data-[hover=true]:bg-blue-400/20 transition-all',
              icon: 'text-white text-[10px]',
            }}
          />
        </div>
      </div>

      {/* 包名称 */}
      <div className='py-3 md:py-4 px-2 md:px-4 text-sm col-span-4 sm:col-span-4 flex items-center'>
        <div className='flex items-center w-full'>
          <div className='flex-shrink-0'>
            <Tooltip content={dependency.name === 'node-karin' ? '当然是我啦 φ(>ω<*)' : (dependency.isKarinPlugin ? 'karin 插件' : 'npm 依赖')}>
              <div
                className='w-2 md:w-2.5 h-2 md:h-2.5 rounded-full mr-1.5 md:mr-2.5 flex-shrink-0 translate-y-[0.5px] sm:translate-y-0'
                style={{
                  backgroundColor: dependency.name === 'node-karin' ? '#8b5cf6' : (dependency.isKarinPlugin ? '#10b981' : '#9ca3af'),
                  boxShadow: dependency.name === 'node-karin' ? '0 0 6px rgba(139, 92, 246, 0.3)' : (dependency.isKarinPlugin ? '0 0 6px rgba(16, 185, 129, 0.3)' : 'none'),
                }}
              />
            </Tooltip>
          </div>
          <div onClick={stopPropagation} className='w-full'>
            <Link
              href={getNpmLink(dependency.name)}
              isExternal
              showAnchorIcon={false}
              className='font-medium text-blue-500 hover:text-blue-600 transition-colors text-xs md:text-sm break-all sm:break-normal'
            >
              {dependency.name}
            </Link>
          </div>
        </div>
      </div>

      {/* 当前版本 */}
      <div className='py-3 md:py-4 px-1 sm:px-2 md:px-4 text-sm col-span-3 sm:col-span-2 text-center'>
        <Tooltip content={packageTooltip} delay={100} placement='top'>
          <Chip
            color={pendingChanges[dependency.name] ? 'warning' : 'primary'}
            variant='flat'
            size='sm'
            className='font-mono bg-opacity-20 text-xs cursor-help whitespace-nowrap max-w-full'
            radius='sm'
          >
            {pendingChanges[dependency.name] || dependency.current}
          </Chip>
        </Tooltip>
      </div>

      {/* 更新状态 */}
      <div className='hidden sm:block py-3 md:py-4 px-2 md:px-4 text-sm text-center col-span-1'>
        {hasUpdate(dependency)
          ? (
            <Chip
              color='warning'
              variant='flat'
              size='sm'
              startContent={<LuDownload size={12} />}
              className='text-xs px-2'
            >
              可更新
            </Chip>)
          : (
            <Chip
              color='success'
              variant='flat'
              size='sm'
              startContent={<LuCheck size={12} />}
              className='text-xs px-2'
            >
              最新
            </Chip>)}
      </div>

      {/* 依赖类型 */}
      <div className='hidden sm:block py-3 md:py-4 px-2 md:px-4 text-sm text-center col-span-1'>
        <Chip
          color={getDependencyTypeColor(dependency.type)}
          variant='flat'
          size='sm'
          className='text-xs px-2'
        >
          {getDependencyTypeText(dependency.type)}
        </Chip>
      </div>

      {/* 可用版本 */}
      <div className='hidden md:block py-3 md:py-4 px-2 md:px-4 text-sm col-span-2' onClick={stopPropagation}>
        <Select
          selectedKeys={[displayedVersion]}
          onSelectionChange={handleVersionChange}
          size='sm'
          radius='full'
          classNames={{
            trigger: 'bg-default-50 border border-default-200 shadow-sm h-8 md:h-9 min-h-0 w-full',
            value: 'font-mono text-xs md:text-sm',
            listbox: 'text-xs',
            base: 'w-full',
          }}
          aria-label={`选择${dependency.name}版本`}
        >
          {dependency.latest.map((version) => (
            <SelectItem key={version} textValue={version}>
              <span className='font-mono text-xs md:text-sm'>{version}</span>
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* 操作 */}
      <div className='py-3 md:py-4 px-0 sm:px-2 md:px-4 text-sm text-center col-span-3 sm:col-span-1' onClick={stopPropagation}>
        <Button
          isIconOnly
          size='sm'
          variant='light'
          color='default'
          onPress={handleOpenSettings}
          className='opacity-70 hover:opacity-100 transition-opacity w-8 h-8 min-w-0 p-0'
        >
          <LuSettings size={14} className='md:hidden' />
          <LuSettings size={16} className='hidden md:block' />
        </Button>
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  // 深度比较props，仅在以下情况重新渲染：
  // 1. 选中状态改变
  // 2. 待处理的版本变更影响当前依赖
  // 3. 依赖对象本身变化（比较name和current属性足够）
  const isSelectedChanged = prevProps.isSelected !== nextProps.isSelected

  const prevPending = prevProps.pendingChanges[prevProps.dependency.name]
  const nextPending = nextProps.pendingChanges[nextProps.dependency.name]
  const isPendingChanged = prevPending !== nextPending

  const isDependencyChanged =
    prevProps.dependency.name !== nextProps.dependency.name ||
    prevProps.dependency.current !== nextProps.dependency.current

  return !(isSelectedChanged || isPendingChanged || isDependencyChanged)
})

DependencyRow.displayName = 'DependencyRow'

/**
 * 使用虚拟滚动的依赖表格组件
 */
const DependencyTable = memo(({
  dependencies,
  pendingChanges,
  selectedDependencies,
  updateDependencyVersion,
  openSettings,
  onSelectDependency,
  onSelectAll,
}: DependencyTableProps) => {
  // 使用useMemo优化计算，避免每次重渲染都重新计算
  const allSelected = useMemo(
    () => dependencies.length > 0 && dependencies.every(d => selectedDependencies.includes(d.name)),
    [dependencies, selectedDependencies]
  )

  const someSelected = useMemo(
    () => dependencies.length > 0 && !allSelected && dependencies.some(d => selectedDependencies.includes(d.name)),
    [dependencies, selectedDependencies, allSelected]
  )

  // 表格容器引用
  const tableContainerRef = useRef<HTMLDivElement>(null)

  // 定义行高 - 根据不同屏幕尺寸优化行高
  const rowHeight = useMemo(() => {
    // 我们可以根据窗口宽度调整行高，使移动设备上显示更紧凑
    return window.innerWidth < 768 ? 48 : 54
  }, [])

  // 动态调整预渲染行数 - 在性能和平滑滚动间取得平衡
  const overscanCount = useMemo(() => {
    // 在低端设备上可以降低预渲染行数以提高性能
    return window.innerWidth < 768 ? 3 : 5
  }, [])

  // 为选中状态创建映射表以加速查找
  const selectedMap = useMemo(() => {
    const map = new Map<string, boolean>()
    selectedDependencies.forEach(name => map.set(name, true))
    return map
  }, [selectedDependencies])

  // 优化版本的虚拟滚动配置
  const rowVirtualizer = useVirtualizer({
    count: dependencies.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: useCallback(() => rowHeight, [rowHeight]),
    overscan: overscanCount,
    // 添加键控制，帮助React更好地复用组件
    getItemKey: useCallback((index: number) => dependencies[index]?.name || index, [dependencies]),
  })

  // 获取虚拟化列表项 - 使用useMemo避免不必要的列表重建
  const virtualItems = rowVirtualizer.getVirtualItems()

  // 处理全选变更
  const handleSelectAll = useCallback((isSelected: boolean) => {
    onSelectAll(isSelected)
  }, [onSelectAll])

  // 计算容器高度 - 动态适应内容和可用空间
  const containerHeight = useMemo(() => {
    // 根据内容量和可用屏幕空间调整高度
    const availableHeight = window.innerHeight * 0.6 // 屏幕高度的60%
    const contentHeight = dependencies.length * rowHeight
    // 设置最小和最大高度限制，确保即使没有数据也至少有一定高度
    return Math.min(Math.max(contentHeight || 300, 300), availableHeight)
  }, [dependencies.length, rowHeight])

  // 渲染表格
  return (
    <div className='rounded-xl md:rounded-2xl bg-white dark:bg-content1 shadow-sm border border-default-100/50 overflow-hidden'>
      {/* 表格容器 */}
      <div className='min-w-full flex flex-col'>
        {/* 表头 - 固定在顶部 */}
        <div className='bg-default-50/50 sticky top-0 z-10 w-full'>
          <div className='grid grid-cols-12 w-full border-b border-default-100/70 -ml-[3px]'>
            {/* 选择框列 */}
            <div className='text-default-500 font-normal text-xs uppercase tracking-wider py-3 md:py-4 px-2 md:px-4 flex items-center justify-center col-span-1'>
              <Checkbox
                isSelected={allSelected}
                isIndeterminate={someSelected}
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

            {/* 包名称列 */}
            <div className='text-default-500 font-normal text-xs uppercase tracking-wider py-3 md:py-4 px-2 md:px-4 col-span-4 sm:col-span-4'>
              包名称
            </div>

            {/* 当前版本列 */}
            <div className='text-default-500 font-normal text-xs uppercase tracking-wider py-3 md:py-4 px-1 sm:px-2 md:px-4 text-center col-span-3 sm:col-span-2'>
              当前版本
            </div>

            {/* 更新状态列 */}
            <div className='hidden sm:block text-default-500 font-normal text-xs uppercase tracking-wider py-3 md:py-4 px-2 md:px-4 text-center col-span-1'>
              更新状态
            </div>

            {/* 依赖类型列 */}
            <div className='hidden sm:block text-default-500 font-normal text-xs uppercase tracking-wider py-3 md:py-4 px-2 md:px-4 text-center col-span-1'>
              依赖类型
            </div>

            {/* 可用版本列 */}
            <div className='hidden md:block text-default-500 font-normal text-xs uppercase tracking-wider py-3 md:py-4 px-2 md:px-4 text-center col-span-2'>
              可用版本
            </div>

            {/* 操作列 */}
            <div className='text-default-500 font-normal text-xs uppercase tracking-wider py-3 md:py-4 px-0 sm:px-2 md:px-4 text-center col-span-4 sm:col-span-1'>
              操作
            </div>
          </div>
        </div>

        {/* 虚拟滚动容器 */}
        <div
          ref={tableContainerRef}
          className='overflow-auto'
          style={{ height: `${containerHeight}px` }}
        >
          {dependencies.length === 0
            ? (
              <div className='flex items-center justify-center h-32'>
                <p className='text-default-500'>没有找到依赖包</p>
              </div>
            )
            : (
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {/* 根据虚拟化列表渲染可见行 */}
                {virtualItems.map((virtualItem) => {
                  const dependency = dependencies[virtualItem.index]
                  if (!dependency) return null

                  const isSelected = selectedMap.has(dependency.name)

                  return (
                    <div
                      key={virtualItem.key}
                      data-index={virtualItem.index}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${rowHeight}px`,
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      <DependencyRow
                        dependency={dependency}
                        pendingChanges={pendingChanges}
                        isSelected={isSelected}
                        updateDependencyVersion={updateDependencyVersion}
                        openSettings={openSettings}
                        onSelectDependency={onSelectDependency}
                      />
                    </div>
                  )
                })}
              </div>
            )}
        </div>
      </div>
    </div>
  )
})

DependencyTable.displayName = 'DependencyTable'

export default DependencyTable
