import { useMemo, useState, useEffect, useRef } from 'react'
import { useRequest } from 'ahooks'
import { request } from '@/lib/request'
import { Pagination } from '@heroui/pagination'
import { Button } from '@heroui/button'
import { FaUser } from 'react-icons/fa6'
import { FaGithub, FaNpm } from 'react-icons/fa6'
import { TbApps } from 'react-icons/tb'
import { Link } from '@heroui/link'
import { Spinner } from '@heroui/spinner'
import { Chip } from '@heroui/chip'
import { Tooltip } from '@heroui/tooltip'
import { Card, CardBody, CardFooter } from '@heroui/card'
import { Input } from '@heroui/input'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown'
import { ScrollShadow } from '@heroui/scroll-shadow'
import { Avatar } from '@heroui/avatar'
import { InstalledPluginButton } from '@/components/plugin/installed_plugin_button'
import { InstallPluginButton } from '@/components/plugin/install_plugin_button'
import { Task, TaskList } from '@/components/plugin/task_list'
import { TaskListModal } from '@/components/plugin/task_list_modal'
import { InstallLogModal } from '@/components/plugin/install_log_modal'
import { formatTimeAgo, formatNumber } from '@/lib/utils'
import {
  IoRefreshOutline,
  IoListOutline,
  IoCloudUploadOutline,
  IoSearchOutline,
  IoDownloadOutline,
  IoCheckmarkCircleOutline,
  IoAppsOutline,
  IoChevronDownOutline,
  IoAlbumsOutline
} from 'react-icons/io5'
import { UpdateListModal } from '@/components/plugin/update_list_modal'
import type { PluginLists } from 'node-karin'

// 默认描述生成函数
const getDefaultDescription = (name: string) => {
  const descriptions = [
    `为您的工作流程带来更多可能性`,
    `提升您的开发效率的得力助手`,
    `简单易用，功能强大的插件`,
    `让开发更轻松，体验更流畅`,
    `为您的项目锦上添花`
  ]
  // 使用插件名称作为种子来选择固定的描述
  const seed = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return descriptions[seed % descriptions.length]
}

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'npm':
      return {
        icon: <FaNpm className="text-xl text-[#CB3837]" />,
        tooltip: 'NPM 插件',
        color: 'bg-red-50/50'
      }
    case 'git':
      return {
        icon: <FaGithub className="text-xl text-[#24292e]" />,
        tooltip: 'Git 插件',
        color: 'bg-purple-50/50'
      }
    case 'app':
      return {
        icon: <TbApps className="text-xl text-primary-500" />,
        tooltip: '应用插件',
        color: 'bg-primary-50/50'
      }
    default:
      return {
        icon: <IoAppsOutline className="text-xl text-default-500" />,
        tooltip: '未知类型',
        color: 'bg-default-50/50'
      }
  }
}

const PluginCard = ({ plugin }: { plugin: PluginLists }) => {
  // const typeInfo = getTypeIcon(plugin.type)

  return (
    <Card
      className="group w-full h-[140px] flex flex-col overflow-hidden cursor-pointer relative bg-default-50/50 dark:bg-default-100/5 hover:-translate-y-[2px] hover:shadow-md hover:bg-default-100/80 dark:hover:bg-default-100/10 transition-all duration-300 rounded-xl"
      isPressable
      radius="lg"
    >
      {/* 添加边框动画效果 */}
      <div className="absolute inset-0 border border-default-200 dark:border-default-100/20 group-hover:border-primary-500/50 dark:group-hover:border-primary-500/30 group-hover:border-2 transition-all duration-300 rounded-xl" />

      <CardBody className="p-4 flex flex-col h-full relative">
        {/* 顶部区域 */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {plugin.home && plugin.home !== '-' ? (
                <Tooltip content="点击访问插件主页">
                  <Link
                    href={plugin.home}
                    isExternal
                    className="text-sm font-semibold text-default-900 hover:text-primary-500 transition-colors truncate"
                  >
                    {plugin.name}
                  </Link>
                </Tooltip>
              ) : (
                <span className="text-sm font-semibold text-default-900 truncate">
                  {plugin.name}
                </span>
              )}
              {plugin.installed && (
                <Tooltip content="已安装">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <IoCheckmarkCircleOutline className="text-success-500 text-lg" />
                  </div>
                </Tooltip>
              )}
            </div>
            <p className="text-xs text-default-500 line-clamp-2" title={plugin.description}>
              {plugin.description === '-' ? getDefaultDescription(plugin.name) : plugin.description}
            </p>
          </div>

          {/* 作者头像组 */}
          <div className="flex -space-x-2 shrink-0">
            {plugin.author.length > 0 ? (
              plugin.author.map((author, index) => (
                <Tooltip
                  key={author.name + index}
                  content={
                    <div className="text-center">
                      <p className="font-semibold">{author.name}</p>
                      {author.home && author.home !== '-' && (
                        <p className="text-xs text-default-400">点击访问主页</p>
                      )}
                    </div>
                  }
                >
                  {author.home && author.home !== '-' ? (
                    <Link href={author.home} isExternal>
                      <Avatar
                        isBordered
                        size="sm"
                        src={author.avatar || `https://avatar.vercel.sh/${author.name}`}
                        className="bg-default-100 border-white dark:border-default-800"
                      />
                    </Link>
                  ) : (
                    <Avatar
                      isBordered
                      size="sm"
                      src={author.avatar || `https://avatar.vercel.sh/ikenxuan`}
                      className="bg-default-100 border-white dark:border-default-800"
                    />

                  )}
                </Tooltip>
              ))
            ) : (
              <Avatar
                isBordered
                size="sm"
                icon={<FaUser />}
                className="bg-default-100 border-white dark:border-default-800"
              />
            )}
          </div>
        </div>

        {/* 底部区域 */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <Chip
              variant="flat"
              size="sm"
              className="h-5 px-2 bg-default-100/80 border-small border-default-200/50"
            >
              <span className="text-xs font-mono">
                {plugin.version === '-' ? '未知版本' : `v${plugin.version}`}
              </span>
            </Chip>
            <div className="flex items-center gap-2 text-xs text-default-400">
              <div className="flex items-center gap-1">
                <IoDownloadOutline className="text-base" />
                <span>{formatNumber(plugin.downloads || 0)}</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1">
                <IoRefreshOutline className="text-base" />
                <span>{formatTimeAgo(plugin.updated)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {plugin.installed ? (
              <InstalledPluginButton plugin={plugin} />
            ) : (
              <InstallPluginButton plugin={plugin} />
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default function MarketPage () {
  const [page, setPage] = useState(1)
  const [activeTask, setActiveTask] = useState<string | null>(null)
  const [isTaskListOpen, setIsTaskListOpen] = useState(false)
  const [isUpdateListOpen, setIsUpdateListOpen] = useState(false)
  const [, setIsUninstalling] = useState(false)
  const [filterType, setFilterType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 获取在线插件列表
  let { data: plugins, error: onlineError, loading: onlineLoading, refresh: refreshPlugins } = useRequest<PluginLists[], any>(
    async () => {
      setIsRefreshing(true)
      return request.serverPost<PluginLists[], { time: number }>('/api/v1/plugin/index', { time: 20 * 1000 }).then(res => {
        return res
      }).catch(err => {
        console.error('❌ 插件列表刷新失败:', err)
        throw err
      }).finally(() => {
        setIsRefreshing(false)
      })
    },
    {
      refreshDeps: [],
      onSuccess: (data, oldData) => {
        // 比较新旧数据是否有实质性变化
        const hasChanged = !oldData || JSON.stringify(data) !== JSON.stringify(oldData)

        if (hasChanged) {
        } else {
          return oldData // 返回旧数据，避免触发重渲染
        }
      }
    }
  )

  if (!plugins) plugins = []

  // 获取任务列表
  const { data: tasks = [] } = useRequest<Task[], any>(
    () => request.serverPost<Task[], null>('/api/v1/plugin/task/list'),
    {
      pollingInterval: 2000,
      pollingWhenHidden: false,
      onSuccess: (data, oldData) => {
        // 比较新旧数据是否有实质性变化
        const hasChanged = !oldData || JSON.stringify(data) !== JSON.stringify(oldData)

        if (hasChanged) {
          data.forEach(task => {
            const existingTask = tasks.find(t => t.id === task.id)
            if (!existingTask) {
              task.minimized = activeTask !== task.id
            }
          })
        } else {
          return oldData // 返回旧数据，避免触发重渲染
        }
      }
    }
  )

  const pageSize = 12
  const filteredPlugins = useMemo(() => {
    let filtered = plugins || []

    // 类型筛选
    if (filterType !== 'all') {
      filtered = filtered.filter(plugin => plugin.type.toLowerCase() === filterType.toLowerCase())
    }

    // 搜索筛选
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(plugin => {
        return (
          // 搜索名称
          plugin.name.toLowerCase().includes(query) ||
          // 搜索描述
          (plugin.description && plugin.description !== '-' &&
            plugin.description.toLowerCase().includes(query)) ||
          // 搜索作者
          plugin.author.some(author =>
            author.name.toLowerCase().includes(query)) ||
          // 搜索类型
          plugin.type.toLowerCase().includes(query)
        )
      })
    }

    return filtered
  }, [plugins, filterType, searchQuery])

  // 重置页码当筛选条件改变时
  useEffect(() => {
    setPage(1)
  }, [filterType, searchQuery])

  const currentPagePlugins = useMemo(
    () => filteredPlugins?.slice((page - 1) * pageSize, page * pageSize) || [],
    [filteredPlugins, page],
  )

  const handleMaximize = (taskId: string) => {
    setActiveTask(taskId)
  }

  const handleCloseTaskLog = () => {
    setActiveTask(null)
    refreshPlugins()
  }

  const handleCloseInstallLog = () => {
    setActiveTask(null)
    setIsUninstalling(false)
    refreshPlugins()
  }

  useEffect(() => {
  }, [activeTask])

  const activeTaskData = activeTask ? tasks.find(t => t.id === activeTask) : undefined
  const activeTaskPlugin = activeTaskData ? plugins.find(p => p.name === activeTaskData.name) : undefined

  useEffect(() => {
    const handlePluginUpdate = () => {
      refreshPlugins()
    }

    window.addEventListener('plugin-list-update', handlePluginUpdate)
    return () => {
      window.removeEventListener('plugin-list-update', handlePluginUpdate)
    }
  }, [refreshPlugins])

  const handleRefresh = () => {
    if (isRefreshing) return
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current)
    }
    refreshTimeoutRef.current = setTimeout(() => {
      refreshPlugins()
    }, 300)
  }

  if (onlineError) {
    return (
      <div className="h-full flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardBody className="flex flex-col items-center gap-4 py-8">
            <div className="text-xl font-medium text-danger">加载失败</div>
            <p className="text-center text-default-600">{onlineError.message}</p>
            <Button
              color="primary"
              variant="flat"
              onPress={() => refreshPlugins()}
              startContent={<IoRefreshOutline />}
            >
              重试
            </Button>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-none mx-0">
        <CardBody className="p-3">
          {/* 页面标题区 */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex flex-col gap-0.5">
              <h1 className="text-xl font-semibold text-default-900">插件市场</h1>
              <p className="text-xs text-default-600">发现、安装和管理您的插件</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="flat"
                size="sm"
                onPress={() => setIsTaskListOpen(true)}
                className="h-7 px-2 min-w-[76px] font-medium"
                startContent={<IoListOutline className="text-base" />}
              >
                任务列表 {tasks.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-primary-500/10 text-primary-500">
                    {tasks.length}
                  </span>
                )}
              </Button>
              <Button
                variant="flat"
                size="sm"
                onPress={() => setIsUpdateListOpen(true)}
                className="h-7 px-2 min-w-[76px] font-medium"
                startContent={<IoCloudUploadOutline className="text-base" />}
              >
                更新管理
              </Button>
            </div>
          </div>

          {/* 搜索和筛选区 */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1">
              <Input
                classNames={{
                  base: "max-w-[240px]",
                  input: "text-xs",
                  inputWrapper: "h-7 border-gray-200 dark:border-gray-700"
                }}
                placeholder="搜索插件..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                startContent={<IoSearchOutline className="text-default-400 text-base" />}
                size="sm"
                isClearable
                onClear={() => setSearchQuery('')}
              />
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    variant="flat"
                    size="sm"
                    className="h-7 px-2 min-w-[100px] bg-default-100/50 dark:bg-default-100/20"
                    startContent={
                      <div className="w-5 h-5 flex items-center justify-center">
                        {filterType === 'all' ? (
                          <IoAlbumsOutline className="text-base text-default-500" />
                        ) : (
                          getTypeIcon(filterType).icon
                        )}
                      </div>
                    }
                    endContent={<IoChevronDownOutline className="text-base text-default-400" />}
                  >
                    {filterType === 'all' ? '全部类型' : getTypeIcon(filterType).tooltip}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="插件类型筛选"
                  selectedKeys={[filterType]}
                  selectionMode="single"
                  onSelectionChange={(keys) => setFilterType(Array.from(keys)[0] as string)}
                >
                  <DropdownItem key="all" startContent={<IoAlbumsOutline className="text-base text-default-500" />}>全部类型</DropdownItem>
                  <DropdownItem key="npm" startContent={<FaNpm className="text-lg text-[#CB3837]" />}>NPM 插件</DropdownItem>
                  <DropdownItem key="git" startContent={<FaGithub className="text-lg text-[#24292e]" />}>Git 插件</DropdownItem>
                  <DropdownItem key="app" startContent={<TbApps className="text-lg text-primary-500" />}>应用插件</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>

            <Button
              variant="flat"
              size="sm"
              onPress={handleRefresh}
              className="h-7 px-2 min-w-[76px] font-medium"
              startContent={<IoRefreshOutline className="text-base" />}
              disabled={isRefreshing}
            >
              刷新
            </Button>
          </div>
        </CardBody>
      </Card>

      <div className="flex-1 min-h-0 mt-1">
        <Card className="h-full">
          <CardBody className="p-0 overflow-hidden">
            <ScrollShadow className="h-full" hideScrollBar>
              {onlineLoading ? (
                <div className="h-full flex items-center justify-center">
                  <Spinner size="lg" color="primary" />
                </div>
              ) : currentPagePlugins.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 p-3">
                  {currentPagePlugins.map(plugin => (
                    <PluginCard key={plugin.name + plugin.time} plugin={plugin} />
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-lg font-medium text-default-900 mb-1">暂无插件</p>
                    <p className="text-xs text-default-600">
                      {filterType === 'all' ? '当前没有任何插件' : '没有找到符合条件的插件'}
                    </p>
                  </div>
                </div>
              )}
            </ScrollShadow>
          </CardBody>

          {filteredPlugins.length > 0 && (
            <CardFooter className="flex justify-center py-2 px-3">
              <Pagination
                showControls
                showShadow
                color="primary"
                size="sm"
                page={page}
                total={Math.ceil(filteredPlugins.length / pageSize)}
                onChange={page => setPage(page)}
              />
            </CardFooter>
          )}
        </Card>
      </div>

      <TaskList
        onMaximize={handleMaximize}
        tasks={tasks.filter(task => task.minimized)}
      />
      <TaskListModal
        isOpen={isTaskListOpen}
        onClose={() => setIsTaskListOpen(false)}
        tasks={tasks}
        onMaximize={handleMaximize}
      />
      <UpdateListModal
        isOpen={isUpdateListOpen}
        onClose={() => setIsUpdateListOpen(false)}
      />
      {activeTaskData && activeTaskPlugin && activeTask && (
        <InstallLogModal
          isOpen={true}
          onClose={() => {
            if (activeTaskData.type === 'uninstall') {
              handleCloseTaskLog()
            } else {
              handleCloseInstallLog()
            }
          }}
          taskId={activeTask}
          plugin={activeTaskPlugin}
          task={{
            ...activeTaskData,
            logs: activeTaskData.logs || []
          }}
        />
      )}
    </div>
  )
}
