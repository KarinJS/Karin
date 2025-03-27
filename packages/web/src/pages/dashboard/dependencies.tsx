import { useState, useEffect } from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { Input } from '@heroui/input'
import { Select, SelectItem } from '@heroui/select'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import { Link } from '@heroui/link'
import { Tooltip } from '@heroui/tooltip'
import { Divider } from '@heroui/divider'
import {
  IoSearch,
  IoRefresh,
  IoSave,
} from 'react-icons/io5'
import { LuSettings, LuPackage, LuDownload } from 'react-icons/lu'

// 定义依赖项类型
interface Dependency {
  name: string
  currentVersion: string
  packageJsonVersion: string
  availableVersions: string[]
  isKarinPlugin: boolean
}

// 模拟数据
const mockDependencies: Dependency[] = [
  {
    name: '@heroui/table',
    currentVersion: '2.2.9',
    packageJsonVersion: '^2.2.9',
    availableVersions: ['2.2.9', '2.2.8', '2.2.7', '2.2.6', '2.2.5', '2.2.4', '2.2.3', '2.2.2', '2.2.1', '2.2.0'],
    isKarinPlugin: false,
  },
  {
    name: '@heroui/button',
    currentVersion: '2.2.9',
    packageJsonVersion: '2.2.9',
    availableVersions: ['2.2.9', '2.2.8', '2.2.7', '2.2.6', '2.2.5'],
    isKarinPlugin: false,
  },
  {
    name: 'karin-plugin-weather',
    currentVersion: '1.2.0',
    packageJsonVersion: '^1.2.0',
    availableVersions: ['1.2.0', '1.1.5', '1.1.0', '1.0.0'],
    isKarinPlugin: true,
  },
  {
    name: 'karin-plugin-translator',
    currentVersion: '0.9.5',
    packageJsonVersion: '~0.9.0',
    availableVersions: ['1.0.0', '0.9.5', '0.9.0', '0.8.0'],
    isKarinPlugin: true,
  },
  {
    name: 'react',
    currentVersion: '19.0.0',
    packageJsonVersion: '^19.0.0',
    availableVersions: ['19.0.0', '18.2.0', '18.1.0', '18.0.0', '17.0.2'],
    isKarinPlugin: false,
  },
  {
    name: 'tailwindcss',
    currentVersion: '3.4.17',
    packageJsonVersion: '^3.4.17',
    availableVersions: ['3.4.17', '3.4.0', '3.3.0', '3.2.0', '3.1.0', '3.0.0'],
    isKarinPlugin: false,
  },
]

// 获取npmjs链接
const getNpmLink = (packageName: string): string => {
  // 如果是@开头的作用域包，需要特殊处理
  if (packageName.startsWith('@')) {
    const [scope, name] = packageName.split('/')
    return `https://www.npmjs.com/package/${scope}%2F${name}`
  }
  return `https://www.npmjs.com/package/${packageName}`
}

export default function DependenciesPage () {
  const [dependencies, setDependencies] = useState<Dependency[]>(mockDependencies)
  const [filteredDependencies, setFilteredDependencies] = useState<Dependency[]>(mockDependencies)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [showOnlyPlugins, setShowOnlyPlugins] = useState<boolean>(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)
  const [selectedDependency, setSelectedDependency] = useState<Dependency | null>(null)
  const [selectedVersion, setSelectedVersion] = useState<string>('')
  const [pendingChanges, setPendingChanges] = useState<{ [key: string]: string }>({})

  // 筛选依赖
  useEffect(() => {
    let filtered = dependencies

    if (searchTerm) {
      filtered = filtered.filter(dep =>
        dep.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (showOnlyPlugins) {
      filtered = filtered.filter(dep => dep.isKarinPlugin)
    }

    setFilteredDependencies(filtered)
  }, [dependencies, searchTerm, showOnlyPlugins])

  // 模拟刷新依赖
  const refreshDependencies = () => {
    setLoading(true)
    // 模拟API请求延迟
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  // 打开设置模态框
  const openSettings = (dependency: Dependency) => {
    setSelectedDependency(dependency)
    setSelectedVersion(dependency.currentVersion)
    setIsSettingsOpen(true)
  }

  // 保存依赖版本变更
  const saveDependencyVersion = () => {
    if (selectedDependency) {
      const newPendingChanges = { ...pendingChanges }
      newPendingChanges[selectedDependency.name] = selectedVersion
      setPendingChanges(newPendingChanges)
      setIsSettingsOpen(false)
    }
  }

  // 更新依赖版本
  const updateDependencyVersion = (dependencyName: string, version: string) => {
    const newPendingChanges = { ...pendingChanges }
    newPendingChanges[dependencyName] = version
    setPendingChanges(newPendingChanges)
  }

  // 保存所有更改
  const saveChanges = () => {
    // 更新依赖版本
    const newDependencies = [...dependencies]
    Object.keys(pendingChanges).forEach(name => {
      const index = newDependencies.findIndex(d => d.name === name)
      if (index !== -1) {
        newDependencies[index].currentVersion = pendingChanges[name]
      }
    })

    setDependencies(newDependencies)
    setPendingChanges({})
    // 模拟保存操作
    alert('更改已保存')
  }

  // 版本是否有更新
  const hasUpdate = (dependency: Dependency): boolean => {
    if (!dependency.availableVersions.length) return false
    const latest = dependency.availableVersions[0]
    return latest !== dependency.currentVersion
  }

  // 获取统计信息
  const getStats = () => {
    const total = dependencies.length
    const plugins = dependencies.filter(d => d.isKarinPlugin).length
    const updatable = dependencies.filter(d => hasUpdate(d)).length
    return { total, plugins, updatable }
  }

  const stats = getStats()

  return (
    <div className='w-full p-4 sm:p-6 md:p-8 bg-background'>
      {/* 页面标题和信息卡片 */}
      <div className='mb-6 md:mb-10'>
        <div className='flex flex-wrap items-start justify-between gap-3 md:gap-6'>
          <div className='flex flex-col'>
            <h1 className='text-2xl md:text-3xl font-light text-foreground/90 tracking-tight'>依赖管理</h1>
            <p className='text-sm md:text-base text-default-500 mt-0.5 md:mt-1'>管理项目依赖包和Karin插件</p>
          </div>

          <div className='flex flex-wrap items-center gap-2 md:gap-3'>
            <Button
              color='default'
              startContent={<IoRefresh size={14} className='text-default-500' />}
              isLoading={loading}
              onPress={refreshDependencies}
              size='sm'
              md='md'
              radius='full'
              variant='light'
              className='font-normal'
            >
              刷新
            </Button>

            {Object.keys(pendingChanges).length > 0 && (
              <Button
                color='primary'
                startContent={<IoSave size={14} />}
                onPress={saveChanges}
                size='sm'
                md='md'
                radius='full'
                className='font-normal bg-gradient-to-r from-blue-400 to-blue-500 shadow-sm'
              >
                保存 {Object.keys(pendingChanges).length} 项更改
              </Button>
            )}
          </div>
        </div>

        {/* 信息统计卡片 */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4 mt-4 md:mt-6'>
          <div className='bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl md:rounded-2xl p-3 md:p-5 shadow-sm border border-blue-200/50 dark:border-blue-800/30'>
            <div className='flex items-center gap-2 md:gap-3'>
              <div className='w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 dark:bg-blue-700/30 flex items-center justify-center text-blue-600 dark:text-blue-400'>
                <LuPackage size={16} className='md:hidden' />
                <LuPackage size={20} className='hidden md:block' />
              </div>
              <div>
                <div className='text-xl md:text-2xl font-light'>{stats.total}</div>
                <div className='text-xs md:text-sm text-default-500'>总依赖数</div>
              </div>
            </div>
          </div>

          <div className='bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl md:rounded-2xl p-3 md:p-5 shadow-sm border border-green-200/50 dark:border-green-800/30'>
            <div className='flex items-center gap-2 md:gap-3'>
              <div className='w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-100 dark:bg-green-700/30 flex items-center justify-center text-green-600 dark:text-green-400'>
                <div className='relative'>
                  <LuPackage size={16} className='md:hidden' />
                  <LuPackage size={20} className='hidden md:block' />
                  <div className='absolute -top-1 -right-1 w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-green-500' />
                </div>
              </div>
              <div>
                <div className='text-xl md:text-2xl font-light'>{stats.plugins}</div>
                <div className='text-xs md:text-sm text-default-500'>Karin 插件</div>
              </div>
            </div>
          </div>

          <div className='bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-xl md:rounded-2xl p-3 md:p-5 shadow-sm border border-amber-200/50 dark:border-amber-800/30'>
            <div className='flex items-center gap-2 md:gap-3'>
              <div className='w-8 h-8 md:w-10 md:h-10 rounded-full bg-amber-100 dark:bg-amber-700/30 flex items-center justify-center text-amber-600 dark:text-amber-400'>
                <LuDownload size={16} className='md:hidden' />
                <LuDownload size={20} className='hidden md:block' />
              </div>
              <div>
                <div className='text-xl md:text-2xl font-light'>{stats.updatable}</div>
                <div className='text-xs md:text-sm text-default-500'>可更新</div>
              </div>
            </div>
          </div>
        </div>

        {/* 提示信息区域 */}
        <div className='bg-default-50 rounded-lg md:rounded-xl p-3 md:p-4 mt-3 md:mt-5 border border-default-200/50 text-xs md:text-sm text-default-600'>
          <div className='flex items-start gap-2 md:gap-3'>
            <div className='text-blue-500 mt-0.5 flex-shrink-0'>
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className='md:hidden'>
                <path d='M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M12 16V12' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M12 8H12.01' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
              </svg>
              <svg width='20' height='20' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className='hidden md:block'>
                <path d='M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M12 16V12' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M12 8H12.01' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
              </svg>
            </div>
            <div>
              <div className='font-medium mb-1'>依赖管理使用指南</div>
              <ul className='list-disc pl-3 md:pl-5 space-y-0.5 md:space-y-1'>
                <li>使用选择器可直接更改依赖版本</li>
                <li>绿色圆点表示 Karin 插件，灰色圆点表示普通 npm 包</li>
                <li>点击设置图标可查看更多版本选项和详细信息</li>
                <li>所有修改会先暂存，点击"保存更改"后才会真正应用</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 搜索和过滤 */}
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
          <Button
            size='sm'
            variant={showOnlyPlugins ? 'solid' : 'bordered'}
            color={showOnlyPlugins ? 'success' : 'default'}
            radius='full'
            onPress={() => setShowOnlyPlugins(!showOnlyPlugins)}
            startContent={<LuPackage size={14} />}
            className='font-normal text-xs'
          >
            仅显示插件
          </Button>

          <div className='text-xs md:text-sm text-default-400 ml-1 md:ml-2'>
            共 {filteredDependencies.length} 个依赖
          </div>
        </div>
      </div>

      {/* 依赖表格 */}
      <div className='rounded-xl md:rounded-2xl bg-white dark:bg-content1 shadow-sm border border-default-100 overflow-hidden'>
        <Table
          aria-label='依赖列表'
          removeWrapper
          classNames={{
            base: 'min-w-full',
            thead: 'bg-default-50/50',
            th: 'text-default-500 font-normal text-xs uppercase tracking-wider py-3 md:py-4 px-2 md:px-4',
            td: 'py-3 md:py-5 px-2 md:px-4 text-sm',
            tr: 'hover:bg-default-50/80 transition-colors',
          }}
        >
          <TableHeader>
            <TableColumn>包名称</TableColumn>
            <TableColumn>当前版本</TableColumn>
            <TableColumn>package.json</TableColumn>
            <TableColumn width={180} className='hidden md:table-cell'>可用版本</TableColumn>
            <TableColumn width={64} className='text-center'>操作</TableColumn>
          </TableHeader>
          <TableBody emptyContent='没有找到依赖包'>
            {filteredDependencies.map((dependency) => (
              <TableRow key={dependency.name}>
                <TableCell>
                  <div className='flex items-center'>
                    <Tooltip content={dependency.isKarinPlugin ? 'Karin 插件' : 'npm 包'}>
                      <div
                        className='w-2 md:w-2.5 h-2 md:h-2.5 rounded-full mr-1.5 md:mr-2.5 flex-shrink-0'
                        style={{
                          backgroundColor: dependency.isKarinPlugin ? '#10b981' : '#9ca3af',
                          boxShadow: dependency.isKarinPlugin ? '0 0 6px rgba(16, 185, 129, 0.3)' : 'none',
                        }}
                      />
                    </Tooltip>
                    <Link
                      href={getNpmLink(dependency.name)}
                      isExternal
                      showAnchorIcon
                      className='font-medium text-blue-500 hover:text-blue-600 transition-colors text-xs md:text-sm'
                    >
                      {dependency.name}
                    </Link>

                    {hasUpdate(dependency) && (
                      <Tooltip content='有新版本可用'>
                        <div className='ml-1.5 md:ml-2 text-amber-500'>
                          <LuDownload size={12} className='md:hidden' />
                          <LuDownload size={14} className='hidden md:block' />
                        </div>
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    color={pendingChanges[dependency.name] ? 'warning' : 'primary'}
                    variant='flat'
                    size='sm'
                    className='font-mono bg-opacity-20 text-xs'
                    radius='sm'
                  >
                    {pendingChanges[dependency.name] || dependency.currentVersion}
                  </Chip>
                </TableCell>
                <TableCell>
                  <code className='text-xs text-default-500 bg-default-50 px-1.5 md:px-2 py-0.5 md:py-1 rounded'>
                    {dependency.packageJsonVersion}
                  </code>
                </TableCell>
                <TableCell className='hidden md:table-cell'>
                  <Select
                    selectedKeys={[pendingChanges[dependency.name] || dependency.currentVersion]}
                    onSelectionChange={(keys) => {
                      const selectedKey = keys as string
                      if (selectedKey) {
                        updateDependencyVersion(dependency.name, selectedKey)
                      }
                    }}
                    size='sm'
                    radius='full'
                    classNames={{
                      trigger: 'bg-default-50 border-none shadow-sm h-8 md:h-9 min-h-0',
                      value: 'font-mono text-xs md:text-sm',
                      listbox: 'text-xs',
                    }}
                  >
                    {dependency.availableVersions.map((version) => (
                      <SelectItem key={version} textValue={version}>
                        <span className='font-mono text-xs md:text-sm'>{version}</span>
                      </SelectItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell className='text-center'>
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
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 设置模态框 */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        backdrop='blur'
        radius='lg'
        classNames={{
          base: 'border border-default-100 mx-2',
          header: 'border-b border-default-100 p-4',
          body: 'p-4',
          footer: 'border-t border-default-100 p-4',
          closeButton: 'hover:bg-default-100',
        }}
        size='md'
      >
        <ModalContent>
          {selectedDependency && (
            <>
              <ModalHeader className='flex flex-col gap-1 pb-3 md:pb-6'>
                <div className='flex items-center gap-2'>
                  <div
                    className='w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0'
                    style={{
                      backgroundColor: selectedDependency.isKarinPlugin ? '#10b981' : '#9ca3af',
                      boxShadow: selectedDependency.isKarinPlugin ? '0 0 6px rgba(16, 185, 129, 0.3)' : 'none',
                    }}
                  />
                  <div className='text-lg md:text-xl font-light tracking-tight'>{selectedDependency.name}</div>
                </div>
                <Link
                  href={getNpmLink(selectedDependency.name)}
                  isExternal
                  showAnchorIcon
                  className='text-xs md:text-sm text-default-500 ml-4 md:ml-5 pl-0.5'
                >
                  在 npmjs.com 上查看
                </Link>
              </ModalHeader>

              <Divider className='opacity-50' />

              <ModalBody className='py-3 md:py-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
                  <div>
                    <div className='text-xs md:text-sm text-default-500 mb-2'>当前信息</div>
                    <div className='space-y-2 md:space-y-3'>
                      <div>
                        <div className='text-xs text-default-400'>当前版本</div>
                        <div className='font-mono text-xs md:text-sm'>{selectedDependency.currentVersion}</div>
                      </div>
                      <div>
                        <div className='text-xs text-default-400'>package.json 中的值</div>
                        <div className='font-mono text-xs md:text-sm'>{selectedDependency.packageJsonVersion}</div>
                      </div>
                      <div>
                        <div className='text-xs text-default-400'>类型</div>
                        <div className='text-xs md:text-sm'>{selectedDependency.isKarinPlugin ? 'Karin 插件' : 'npm 包'}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className='text-xs md:text-sm text-default-500 mb-2 md:mb-3'>选择要安装的版本</div>
                    <div className='grid grid-cols-2 gap-1.5 md:gap-2 max-h-32 md:max-h-40 overflow-y-auto pr-1 md:pr-2'>
                      {selectedDependency.availableVersions.map(version => (
                        <Button
                          key={version}
                          variant={selectedVersion === version ? 'solid' : 'flat'}
                          color={selectedVersion === version ? 'primary' : 'default'}
                          className='font-mono text-xs md:text-sm justify-start px-2 md:px-3 h-7 md:h-8 min-h-0'
                          size='sm'
                          radius='lg'
                          onPress={() => setSelectedVersion(version)}
                        >
                          {version}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedVersion !== selectedDependency.currentVersion && (
                  <div className='mt-4 md:mt-6 p-2 md:p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-xs md:text-sm'>
                    <div className='font-medium'>即将更新版本</div>
                    <div className='text-default-600 mt-1 flex items-center gap-2'>
                      <code className='font-mono text-xs'>{selectedDependency.currentVersion}</code>
                      <span>→</span>
                      <code className='font-mono text-xs text-primary'>{selectedVersion}</code>
                    </div>
                  </div>
                )}
              </ModalBody>

              <Divider className='opacity-50' />

              <ModalFooter>
                <Button
                  color='default'
                  variant='light'
                  onPress={() => setIsSettingsOpen(false)}
                  radius='full'
                  className='font-normal text-xs md:text-sm'
                  size='sm'
                >
                  取消
                </Button>
                <Button
                  color='primary'
                  onPress={saveDependencyVersion}
                  isDisabled={selectedVersion === selectedDependency.currentVersion}
                  radius='full'
                  className='font-normal text-xs md:text-sm'
                  size='sm'
                >
                  应用更改
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
