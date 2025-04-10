import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { Select, SelectItem } from '@heroui/select'
import { Link } from '@heroui/link'
import { Tooltip } from '@heroui/tooltip'
import { Checkbox } from '@heroui/checkbox'
import { LuSettings, LuDownload, LuCheck } from 'react-icons/lu'
import { getNpmLink, hasUpdate } from '../../pages/dashboard/dependencies/dependencies.utils'
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
 * @param type 依赖类型
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
 * @param type 依赖类型
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
 * @param e 事件对象
 */
const stopPropagation = (e: React.MouseEvent | React.TouchEvent) => {
  e.stopPropagation()
}

/**
 * 依赖表格组件
 */
const DependencyTable = ({
  dependencies,
  pendingChanges,
  selectedDependencies,
  updateDependencyVersion,
  openSettings,
  onSelectDependency,
  onSelectAll,
}: DependencyTableProps) => {
  const allSelected = dependencies.length > 0 && dependencies.every(d => selectedDependencies.includes(d.name))
  const someSelected = dependencies.length > 0 && !allSelected && dependencies.some(d => selectedDependencies.includes(d.name))

  return (
    <div className='rounded-xl md:rounded-2xl bg-white dark:bg-content1 shadow-sm border border-default-100/50 overflow-hidden'>
      <Table
        aria-label='依赖列表'
        removeWrapper
        classNames={{
          base: 'min-w-full',
          thead: 'bg-default-50/50',
          th: 'text-default-500 font-normal text-xs uppercase tracking-wider py-3 md:py-4 px-2 md:px-4 border-b border-default-100/70',
          td: 'py-3 md:py-4 px-2 md:px-4 text-sm border-b border-default-100/40',
          tr: 'hover:bg-default-50/70 transition-colors',
        }}
      >
        <TableHeader>
          <TableColumn width={50} className='text-center min-w-[30px]'>
            <Checkbox
              isSelected={allSelected}
              isIndeterminate={someSelected}
              onValueChange={onSelectAll}
              size='sm'
              aria-label='全选'
              classNames={{
                base: 'w-4 h-4',
                wrapper: 'rounded-full w-4 h-4 border-1 border-default-300 data-[selected=true]:border-blue-500 data-[selected=true]:bg-blue-500 data-[indeterminate=true]:bg-blue-500 data-[indeterminate=true]:border-blue-500 data-[hover=true]:border-blue-400 data-[hover=true]:bg-blue-400/20 transition-all',
                icon: 'text-white text-[10px]',
              }}
            />
          </TableColumn>
          <TableColumn>包名称</TableColumn>
          <TableColumn width={110}>当前版本</TableColumn>
          <TableColumn className='hidden sm:table-cell text-center'>更新状态</TableColumn>
          <TableColumn className='hidden sm:table-cell text-center'>依赖类型</TableColumn>
          <TableColumn width={180} className='hidden md:table-cell'>可用版本</TableColumn>
          <TableColumn width={64} className='text-center'>操作</TableColumn>
        </TableHeader>
        <TableBody emptyContent='没有找到依赖包'>
          {dependencies.map((dependency) => {
            // 查找当前版本是否在latest列表中
            const currentVersionExists = dependency.latest.includes(dependency.current)
            // 如果不存在，默认选择最新版本（列表的最后一项）
            const defaultVersion = currentVersionExists
              ? dependency.current
              : dependency.latest[dependency.latest.length - 1]

            // 获取待显示的版本：优先使用pendingChanges中的值，否则使用defaultVersion
            const displayedVersion = pendingChanges[dependency.name] || defaultVersion

            // 检查是否被选中
            const isSelected = selectedDependencies.includes(dependency.name)

            // 构建package.json值的tooltip提示内容
            const packageTooltip = dependency.packageValue
              ? `package.json 中的值: ${dependency.packageValue}`
              : '未在 package.json 中定义'

            return (
              <TableRow key={dependency.name}>
                <TableCell className='text-center px-1 md:px-2' onClick={stopPropagation}>
                  <Checkbox
                    isSelected={isSelected}
                    onValueChange={(checked) => onSelectDependency(dependency.name, checked)}
                    size='sm'
                    aria-label={`选择 ${dependency.name}`}
                    classNames={{
                      base: 'w-4 h-4',
                      wrapper: 'rounded-full w-4 h-4 border-1 border-default-300 data-[selected=true]:border-blue-500 data-[selected=true]:bg-blue-500 data-[hover=true]:border-blue-400 data-[hover=true]:bg-blue-400/20 transition-all',
                      icon: 'text-white text-[10px]',
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div className='flex items-center'>
                    <Tooltip content={dependency.name === 'node-karin' ? '当然是我啦 φ(>ω<*)' : (dependency.isKarinPlugin ? 'karin 插件' : 'npm 依赖')}>
                      <div
                        className='w-2 md:w-2.5 h-2 md:h-2.5 rounded-full mr-1.5 md:mr-2.5 flex-shrink-0'
                        style={{
                          backgroundColor: dependency.name === 'node-karin' ? '#8b5cf6' : (dependency.isKarinPlugin ? '#10b981' : '#9ca3af'),
                          boxShadow: dependency.name === 'node-karin' ? '0 0 6px rgba(139, 92, 246, 0.3)' : (dependency.isKarinPlugin ? '0 0 6px rgba(16, 185, 129, 0.3)' : 'none'),
                        }}
                      />
                    </Tooltip>
                    <div onClick={stopPropagation} className='inline-block'>
                      <Link
                        href={getNpmLink(dependency.name)}
                        isExternal
                        showAnchorIcon={false}
                        className='font-medium text-blue-500 hover:text-blue-600 transition-colors text-xs md:text-sm'
                      >
                        {dependency.name}
                      </Link>
                    </div>
                  </div>
                </TableCell>
                <TableCell className='px-3 md:px-4'>
                  <Tooltip content={packageTooltip} delay={100} placement='top'>
                    <Chip
                      color={pendingChanges[dependency.name] ? 'warning' : 'primary'}
                      variant='flat'
                      size='sm'
                      className='font-mono bg-opacity-20 text-xs cursor-help'
                      radius='sm'
                    >
                      {pendingChanges[dependency.name] || dependency.current}
                    </Chip>
                  </Tooltip>
                </TableCell>
                <TableCell className='hidden sm:table-cell'>
                  <div className='flex items-center justify-center'>
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
                </TableCell>
                <TableCell className='hidden sm:table-cell'>
                  <div className='flex items-center justify-center'>
                    <Chip
                      color={getDependencyTypeColor(dependency.type)}
                      variant='flat'
                      size='sm'
                      className='text-xs px-2'
                    >
                      {getDependencyTypeText(dependency.type)}
                    </Chip>
                  </div>
                </TableCell>
                <TableCell className='hidden md:table-cell' onClick={stopPropagation}>
                  <div className='w-full h-full flex items-center'>
                    <Select
                      selectedKeys={[displayedVersion]}
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0] as string
                        if (selectedKey) {
                          updateDependencyVersion(dependency.name, selectedKey)
                          // 当切换版本时自动选中
                          if (!isSelected) {
                            onSelectDependency(dependency.name, true)
                          }
                        }
                      }}
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
                </TableCell>
                <TableCell className='text-center' onClick={stopPropagation}>
                  <Button
                    isIconOnly
                    size='sm'
                    variant='light'
                    color='default'
                    onPress={() => openSettings(dependency)}
                    className='opacity-70 hover:opacity-100 transition-opacity w-8 h-8 min-w-0 p-0'
                  >
                    <LuSettings size={14} className='md:hidden' />
                    <LuSettings size={16} className='hidden md:block' />
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export default DependencyTable
