/* eslint-disable @stylistic/indent */
import { useState, useCallback, ReactElement } from 'react'
import { useRequest } from 'ahooks'
import { Card } from '@heroui/card'
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from '@heroui/table'
import { Chip } from '@heroui/chip'
import { Button } from '@heroui/button'
import { Spinner } from '@heroui/spinner'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown'
import { FaNpm } from 'react-icons/fa6'
import { TbApps, TbBrandGit, TbCircleCheck, TbCircleDashed, TbArrowUp, TbRefresh, TbTrash, TbArrowsUp } from 'react-icons/tb'
import { IoSettingsOutline } from 'react-icons/io5'
import { MdOutlineExtension } from 'react-icons/md'
import { fetchPluginList, type PluginItem, type PluginType } from '@/mock/pluginManageData'
import StatCard from '@/components/card/StatCard'

/**
 * 获取更新状态配置
 * @param status - 更新状态
 * @param type - 插件类型
 * @returns 状态配置
 */
const getUpdateStatusConfig = (status: string) => {
  if (status === 'up-to-date') {
    return {
      text: '最新',
      color: 'success' as const,
      icon: <TbCircleCheck className='text-xs mr-1' />,
    }
  }

  if (status === 'outdated') {
    return {
      text: '可更新',
      color: 'warning' as const,
      icon: <TbArrowUp className='text-xs mr-1' />,
    }
  }

  if (status === 'pending') {
    return {
      text: '待处理',
      color: 'default' as const,
      icon: <TbCircleDashed className='text-xs mr-1' />,
    }
  }

  return {
    text: '未知',
    color: 'default' as const,
    icon: <TbCircleDashed className='text-xs mr-1' />,
  }
}

/**
 * 获取类型配置
 * @param type - 插件类型
 * @returns 类型配置信息
 */
const getTypeConfig = (type: PluginType) => {
  switch (type) {
    case 'npm':
      return {
        color: 'danger',
        text: 'Npm插件',
      }
    case 'git':
      return {
        color: 'warning',
        text: 'Git插件',
      }
    case 'app':
      return {
        color: 'primary',
        text: 'App插件',
      }
    case 'all':
    default:
      return {
        color: 'default',
        text: '全部',
      }
  }
}

/**
 * 渲染图标的帮助函数
 * @param size - 图标尺寸
 * @param Icon - 图标组件
 * @returns 渲染的图标组件
 */
const renderIcon = (size: number, Icon: React.ComponentType<{ size?: number }>) => {
  return <Icon size={size} />
}

/**
 * 插件管理页面组件
 * @returns 返回插件管理页面
 */
export const PluginManagePage = (): ReactElement => {
  // 选中的插件类型
  const [selectedType, setSelectedType] = useState<PluginType>('all')

  // 选中的插件ID列表
  const [selectedPlugins, setSelectedPlugins] = useState<string[]>([])

  /**
   * 获取插件列表的请求
   */
  const { data: plugins, loading, run: fetchPlugins } = useRequest(
    () => fetchPluginList(selectedType),
    {
      refreshDeps: [selectedType],
      onSuccess: () => {
        // 重置选中的插件
        setSelectedPlugins([])
      },
    }
  )

  /**
   * 处理类型变更
   * @param type - 新的筛选类型
   */
  const handleTypeChange = useCallback((type: PluginType) => {
    setSelectedType(type)
  }, [])

  /**
   * 处理表格选择变更
   * @param keys - 新的选中行的集合
   */
  const handleSelectionChange = useCallback((keys: any) => {
    setSelectedPlugins(Array.from(keys as Set<string>))
  }, [])

  /**
   * 计算每种类型的插件数量
   */
  const getPluginCounts = useCallback(() => {
    if (!plugins) return { all: 0, npm: 0, git: 0, app: 0 }

    const counts = { all: plugins.length, npm: 0, git: 0, app: 0 }

    plugins.forEach(plugin => {
      if (plugin.type in counts) {
        counts[plugin.type as keyof typeof counts]++
      }
    })

    return counts
  }, [plugins])

  /**
   * 渲染筛选卡片
   */
  const renderFilterCards = () => {
    const counts = getPluginCounts()

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
          onClick={() => handleTypeChange('all')}
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
          onClick={() => handleTypeChange('npm')}
        />

        <StatCard
          title='Git插件'
          count={counts.git}
          description='Git  插件'
          icon={renderIcon(24, TbBrandGit)}
          gradient='bg-gradient-to-br from-amber-400/10 to-amber-500/20 dark:from-amber-600/10 dark:to-amber-700/20'
          border='border border-amber-200/30 dark:border-amber-800/20'
          iconBg='bg-amber-400/20 dark:bg-amber-700/30'
          textColor='text-amber-700 dark:text-amber-300'
          ringColor='ring-amber-400 dark:ring-amber-500'
          isActive={selectedType === 'git'}
          onClick={() => handleTypeChange('git')}
        />

        <StatCard
          title='App插件'
          count={counts.app}
          description='App插件'
          icon={renderIcon(24, TbApps)}
          gradient='bg-gradient-to-br from-teal-400/10 to-teal-500/20 dark:from-teal-600/10 dark:to-teal-700/20'
          border='border border-teal-200/30 dark:border-teal-800/20'
          iconBg='bg-teal-400/20 dark:bg-teal-700/30'
          textColor='text-teal-700 dark:text-teal-300'
          ringColor='ring-teal-400 dark:ring-teal-500'
          isActive={selectedType === 'app'}
          onClick={() => handleTypeChange('app')}
        />
      </div>
    )
  }

  /**
   * 渲染表格
   * @returns 返回表格组件
   */
  const renderTable = () => {
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

    return (
      <Card className='overflow-hidden shadow-sm border-none bg-default-50/70 dark:bg-default-100/10 backdrop-blur-sm'>
        <Table
          hideHeader={false}
          removeWrapper
          aria-label='插件管理表格'
          selectionMode='multiple'
          selectedKeys={new Set(selectedPlugins)}
          onSelectionChange={handleSelectionChange}
          disallowEmptySelection={false}
          classNames={{
            wrapper: 'shadow-none',
            th: 'text-default-600 text-xs uppercase tracking-wider',
            td: 'py-3',
            tr: 'cursor-pointer hover:bg-default-100/50 dark:hover:bg-default-100/10',
          }}
          checkboxesProps={{
            size: 'sm',
            classNames: {
              wrapper: 'rounded-full w-4 h-4 border-1 border-default-300 data-[selected=true]:border-blue-500 data-[selected=true]:bg-blue-500 data-[indeterminate=true]:bg-blue-500 data-[indeterminate=true]:border-blue-500 data-[hover=true]:border-blue-400 data-[hover=true]:bg-blue-400/20 transition-all',
              icon: 'text-white text-[10px]',
              base: 'w-4 h-4',
            },
          }}
        >
          <TableHeader>
            <TableColumn className='w-[60%] sm:w-[40%]'>插件名称</TableColumn>
            <TableColumn className='hidden sm:table-cell w-[12%] text-center'>当前版本</TableColumn>
            <TableColumn className='hidden sm:table-cell w-[12%] text-center'>最新版本</TableColumn>
            <TableColumn className='hidden sm:table-cell w-[12%] text-center'>类型</TableColumn>
            <TableColumn className='w-[20%] sm:w-[12%] text-center'>状态</TableColumn>
            <TableColumn className='w-[20%] sm:w-[8%] text-center'>操作</TableColumn>
          </TableHeader>
          <TableBody>
            {plugins.map((plugin: PluginItem) => {
              const statusConfig = getUpdateStatusConfig(plugin.updateStatus)
              const typeConfig = getTypeConfig(plugin.type)

              return (
                <TableRow key={plugin.id}>
                  <TableCell>
                    <div className='flex items-center pl-0'>
                      <div className='font-medium text-default-700 dark:text-default-300 w-full break-words whitespace-normal pl-3 pr-1 sm:pr-2 sm:pl-4'>
                        {plugin.name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='hidden sm:table-cell text-center'>
                    <Chip size='sm' variant='flat' color='primary' className='bg-primary-100/50'>
                      {plugin.version}
                    </Chip>
                  </TableCell>
                  <TableCell className='hidden sm:table-cell text-center'>
                    {plugin.availableVersion
                      ? (
                        <Chip size='sm' variant='flat' color='warning' className='bg-warning-100/50'>
                          {plugin.availableVersion}
                        </Chip>
                      )
                      : (
                        <Chip size='sm' variant='flat' color='success' className='bg-success-100/50'>
                          {plugin.version}
                        </Chip>
                      )}
                  </TableCell>
                  <TableCell className='hidden sm:table-cell text-center'>
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
                  </TableCell>
                  <TableCell className='text-center'>
                    <div className='flex justify-center items-center'>
                      <div
                        className='inline-flex items-center justify-center w-20 h-6 text-xs rounded-md border' style={{
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
                    </div>
                  </TableCell>
                  <TableCell className='text-center'>
                    <div className='flex justify-center'>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button size='sm' isIconOnly variant='light' color='primary' onClick={(e) => e.stopPropagation()}>
                            <IoSettingsOutline className='text-lg' />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label='插件操作' onAction={(key) => console.log(key)} onClick={(e) => e.stopPropagation()}>
                          {/* 配置选项 - 只有git和npm类型才显示 */}
                          {(plugin.type === 'git' || plugin.type === 'npm')
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
                          {plugin.type !== 'app' && plugin.updateStatus === 'outdated'
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
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>
    )
  }

  return (
    <div className='w-full p-5'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8'>
        <div className='flex items-center gap-2 mb-4 sm:mb-0'>
          <MdOutlineExtension className='text-2xl text-default-600' />
          <h1 className='text-2xl font-semibold text-default-700'>插件管理</h1>
        </div>
        <div className='flex gap-3 justify-center w-full sm:w-auto sm:self-auto'>
          <Button
            color='success'
            size='sm'
            variant='flat'
            className='bg-success-100/60 text-success-700 dark:bg-success-900/30 dark:text-success-400'
            startContent={<TbArrowsUp className='text-lg' />}
            isDisabled={selectedPlugins.length === 0}
          >
            更新选中 {selectedPlugins.length > 0 && `(${selectedPlugins.length})`}
          </Button>
          <Button
            color='danger'
            size='sm'
            variant='flat'
            className='bg-danger-100/60 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400'
            startContent={<TbTrash className='text-lg' />}
            isDisabled={selectedPlugins.length === 0}
          >
            卸载选中 {selectedPlugins.length > 0 && `(${selectedPlugins.length})`}
          </Button>
          <Button
            color='primary'
            size='sm'
            variant='flat'
            className='bg-primary-100/60 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
            startContent={<TbRefresh className='text-lg' />}
            isLoading={loading}
            onPress={fetchPlugins}
          >
            刷新
          </Button>
        </div>
      </div>

      {renderFilterCards()}

      {renderTable()}
    </div>
  )
}

export default PluginManagePage
