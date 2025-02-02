import { useMemo, useState, useEffect } from 'react'
import { useRequest } from 'ahooks'
import { request } from '@/lib/request'
import { Pagination } from '@heroui/pagination'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table'
import { Button } from '@heroui/button'
import { FaUser } from 'react-icons/fa6'
import { FaGithub, FaGitter, FaNpm } from 'react-icons/fa6'
import { TbApps } from 'react-icons/tb'
import { IoRefreshOutline, IoListOutline, IoCloudUploadOutline } from 'react-icons/io5'
import { Link } from '@heroui/link'
import { Spinner } from '@heroui/spinner'
import { Chip } from '@heroui/chip'
import { Tooltip } from '@heroui/tooltip'
import { toast } from 'react-hot-toast'
import type { KarinBase } from '@/types/plugins'
import { InstalledPluginButton } from '@/components/plugin/installed_plugin_button'
import { InstallPluginButton } from '@/components/plugin/install_plugin_button'
import { Task, TaskList } from '@/components/plugin/task_list'
import { TaskListModal } from '@/components/plugin/task_list_modal'
import { InstallLogModal } from '@/components/plugin/install_log_modal'

type TableColumnAlign = 'center' | 'start' | 'end'
type TableCellAlign = 'center' | 'left' | 'right' | 'justify' | 'char'

interface Column {
  key: string
  label: string
  width: number
  columnAlign?: TableColumnAlign
  cellAlign?: TableCellAlign
}

const columns: Column[] = [
  {
    key: 'name',
    label: '名称',
    width: 200,
  },
  {
    key: 'description',
    label: '插件描述',
    width: 300,
  },
  {
    key: 'version',
    label: '版本',
    width: 100,
  },
  {
    key: 'type',
    label: '类型',
    width: 60,
    columnAlign: 'center',
    cellAlign: 'center',
  },
  {
    key: 'author',
    label: '作者',
    width: 200,
  },
  {
    key: 'installed',
    label: '安装状态',
    width: 100,
  },
  {
    key: 'action',
    label: '操作',
    width: 100,
    columnAlign: 'center',
    cellAlign: 'center',
  },
]

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'npm':
      return {
        icon: <FaNpm className="text-base text-[#CB3837]" />,
        tooltip: 'NPM 插件'
      }
    case 'git':
      return {
        icon: <FaGithub className="text-base" />,
        tooltip: 'Git 插件'
      }
    case 'app':
      return {
        icon: <TbApps className="text-base text-primary-500" />,
        tooltip: '应用插件'
      }
    default:
      return {
        icon: null,
        tooltip: '未知类型'
      }
  }
}

const getRepoIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'github':
      return <FaGithub className="text-lg" />
    case 'gitee':
      return <FaGitter className="text-lg text-red-500" />
    case 'npm':
      return <FaNpm className="text-lg text-[#CB3837]" />
    default:
      return null
  }
}

const renderCell = (
  item: KarinBase<'all'>[number],
  columnKey: keyof KarinBase<'all'>[number] | 'action',
) => {
  switch (columnKey) {
    case 'name':
      return (
        <div className="flex items-center">
          {item.home && item.home !== '-' ? (
            <Link
              href={item.home}
              isExternal
              showAnchorIcon
              className="text-xs text-primary-500 hover:text-primary-600 font-mono bg-default-100 px-1.5 py-0.5 rounded"
            >
              {item.name}
            </Link>
          ) : (
            <div className="text-xs text-default-600 font-mono bg-default-100 px-1.5 py-0.5 rounded">
              {item.name}
            </div>
          )}
        </div>
      )
    case 'type':
      const typeInfo = getTypeIcon(item.type)
      return (
        <Tooltip content={typeInfo.tooltip}>
          <div className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-default-100 transition-colors">
            {typeInfo.icon}
          </div>
        </Tooltip>
      )
    case 'author':
      return (
        <div className="flex items-center gap-1 max-w-[200px]">
          <FaUser className="text-default-400 shrink-0 text-xs" />
          <span className="text-xs truncate">
            {item.author.length > 0 ? (
              item.author.map((author, index) => (
                <span key={author.name + index}>
                  {author.name === '-' ? (
                    <span className="text-default-600">{author.name}</span>
                  ) : (
                    author.home ? (
                      <Link
                        href={author.home}
                        isExternal
                        className="text-primary-500 hover:text-primary-600"
                        showAnchorIcon
                      >
                        {author.name}
                      </Link>
                    ) : (
                      <span className="text-default-600">{author.name}</span>
                    )
                  )}
                  {index !== item.author.length - 1 && <span className="text-default-400">, </span>}
                </span>
              ))
            ) : (
              <span className="text-default-600">-</span>
            )}
          </span>
        </div>
      )
    case 'description':
      return (
        <div className="max-w-[300px]">
          <p className="text-xs text-default-600 truncate" title={item.description}>
            {item.description}
          </p>
        </div>
      )
    case 'installed':
      return (
        <Chip
          color={item.installed ? "success" : "default"}
          size="sm"
          variant={item.installed ? "flat" : "light"}
          className={`h-[20px] min-h-[20px] text-xs ${item.installed ? "bg-success-50" : ""}`}
        >
          {item.installed ? "已安装" : "未安装"}
        </Chip>
      )
    case 'action':
      return (
        <div className="flex justify-center">
          {item.installed ? (
            <InstalledPluginButton plugin={item} />
          ) : (
            <InstallPluginButton plugin={item} />
          )}
        </div>
      )
    case 'version':
      return (
        <div className="text-xs font-mono text-default-600 bg-default-50 px-1.5 py-0.5 rounded">
          {item.version}
        </div>
      )
    default:
      if (typeof item[columnKey] === 'string') {
        return <div className="text-xs truncate">{item[columnKey]}</div>
      }
      return <div className="text-xs truncate">-</div>
  }
}

export default function MarketPage () {
  const [page, setPage] = useState(1)
  const [activeTask, setActiveTask] = useState<string | null>(null)
  const [isTaskListOpen, setIsTaskListOpen] = useState(false)
  const [isUninstalling, setIsUninstalling] = useState(false)

  // 获取在线插件列表
  const { data: plugins = [], error: onlineError, loading: onlineLoading, refresh: refreshPlugins } = useRequest<KarinBase<'all'>, any>(
    async () => {
      console.log('🔄 正在刷新插件列表...')
      return request.serverPost<KarinBase<'all'>, { time: number }>('/api/v1/plugin/index', { time: 20 * 1000 }).then(res => {
        console.log('✅ 插件列表刷新成功:', res)
        return res
      }).catch(err => {
        console.error('❌ 插件列表刷新失败:', err)
        throw err
      })
    },
    {
      refreshDeps: [],
      onSuccess: (data) => {
        console.log('📦 新的插件列表数据:', data)
      }
    }
  )

  // 获取任务列表
  const { data: tasks = [], refresh: refreshTasks } = useRequest<Task[], any>(
    () => request.serverPost<Task[], null>('/api/v1/plugin/task/list'),
    {
      pollingInterval: 1000,
      pollingWhenHidden: false,
      onSuccess: (data) => {
        // 移除自动刷新逻辑,只保留最小化状态的设置
        data.forEach(task => {
          const existingTask = tasks.find(t => t.id === task.id)
          if (!existingTask) {
            task.minimized = activeTask !== task.id
          }
        })
      }
    }
  )

  const pageSize = 10
  const currentPagePlugins = useMemo(
    () => plugins?.slice((page - 1) * pageSize, page * pageSize) || [],
    [plugins, page],
  )

  const handleMaximize = (taskId: string) => {
    setActiveTask(taskId)
  }

  const handleCloseTaskLog = () => {
    console.log('🔍 触发关闭任务日志窗口')
    setActiveTask(null)
    console.log('⏳ 准备延迟刷新...')
    setTimeout(() => {
      console.log('🚀 执行刷新操作')
      refreshPlugins()
    }, 500)
  }

  const handleCloseInstallLog = () => {
    console.log('🔍 触发关闭安装日志窗口')
    setActiveTask(null)
    setIsUninstalling(false)
    console.log('⏳ 准备延迟刷新...')
    setTimeout(() => {
      console.log('🚀 执行刷新操作')
      refreshPlugins()
    }, 500)
  }

  // 添加一个 useEffect 来监听 activeTask 的变化
  useEffect(() => {
    console.log('🎯 activeTask 发生变化:', activeTask)
  }, [activeTask])

  // 获取当前活动任务
  const activeTaskData = activeTask ? tasks.find(t => t.id === activeTask) : undefined
  const activeTaskPlugin = activeTaskData ? plugins.find(p => p.name === activeTaskData.name) : undefined

  // 在组件顶部添加事件监听
  useEffect(() => {
    const handlePluginUpdate = () => {
      console.log('🔄 收到插件更新事件，准备刷新列表...')
      refreshPlugins()
    }

    window.addEventListener('plugin-list-update', handlePluginUpdate)
    return () => {
      window.removeEventListener('plugin-list-update', handlePluginUpdate)
    }
  }, [refreshPlugins])

  if (onlineError) {
    return <div className="text-center">{onlineError.message}</div>
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 flex justify-end gap-2 pt-2">
        <Button
          variant="bordered"
          size="sm"
          onPress={() => setIsTaskListOpen(true)}
          className="min-w-[88px] font-medium border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          startContent={<IoListOutline className="text-lg" />}
        >
          任务列表 {tasks.length > 0 && `(${tasks.length})`}
        </Button>
        <Button
          variant="bordered"
          size="sm"
          onPress={() => toast.error('更新管理功能暂不支持')}
          className="min-w-[88px] font-medium border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          startContent={<IoCloudUploadOutline className="text-lg" />}
        >
          更新管理
        </Button>
        <Button
          variant="bordered"
          size="sm"
          onPress={() => refreshPlugins()}
          className="min-w-[88px] font-medium border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          startContent={<IoRefreshOutline className="text-lg" />}
        >
          刷新
        </Button>
      </div>
      <Table
        aria-label="Plugin List"
        shadow="none"
        className="flex-1 min-h-0"
        classNames={{
          wrapper: 'h-full !min-h-0',
          table: 'min-h-0',
          thead: 'bg-default-50',
          th: [
            'bg-default-50',
            'text-default-600',
            'border-b',
            'border-divider',
            'h-[32px]',
            'py-0',
          ],
          tr: [
            'border-b',
            'border-divider',
            'hover:bg-default-50',
            'transition-colors',
          ],
          td: [
            'py-1',
            'h-[44px]'
          ],
        }}
        bottomContentPlacement="outside"
        bottomContent={
          <div className="flex w-full justify-center py-4 bg-white border-t border-divider">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={Math.ceil(plugins.length / pageSize)}
              onChange={page => setPage(page)}
            />
          </div>
        }
      >
        <TableHeader columns={columns}>
          {column => (
            <TableColumn
              key={column.key}
              align={column.columnAlign || 'start'}
              className="uppercase text-xs"
              width={column.width}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={currentPagePlugins}
          isLoading={onlineLoading}
          loadingContent={<Spinner size="lg" color="primary" className="m-auto" />}
          emptyContent={
            <div className="text-center py-6 text-default-400">
              暂无插件数据
            </div>
          }
        >
          {item => (
            <TableRow key={item.name + item.time}>
              {columnKey => {
                const column = columns.find(col => col.key === columnKey)
                return (
                  <TableCell align={column?.cellAlign}>
                    {renderCell(item, columnKey as keyof KarinBase<'all'>[number] | 'action')}
                  </TableCell>
                )
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
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
      {activeTaskData && activeTaskPlugin && activeTask && (
        <InstallLogModal
          isOpen={true}
          onClose={() => {
            console.log('📢 InstallLogModal onClose 被调用')
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
