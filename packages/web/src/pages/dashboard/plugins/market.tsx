import { useMemo, useState } from 'react'
import { useRequest } from 'ahooks'
import { request } from '@/lib/request'
import { Pagination } from '@heroui/pagination'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table'
import { DownloadPluginButton } from '@/components/plugin/download_plugin_button'
import { FaUser } from 'react-icons/fa6'
import { FaGithub, FaGitter, FaNpm } from 'react-icons/fa6'
import { TbApps } from 'react-icons/tb'
import { Link } from '@heroui/link'
import { Spinner } from '@heroui/spinner'
import { Chip } from '@heroui/chip'
import { Tooltip } from '@heroui/tooltip'
import type { KarinBase } from '@/types/plugins'
import { InstalledPluginButton } from '@/components/plugin/installed_plugin_button'

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
    key: 'repo',
    label: '仓库源',
    width: 60,
    columnAlign: 'center',
    cellAlign: 'center',
  },
  {
    key: 'license',
    label: '开源许可',
    width: 120,
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
    case 'repo':
      if (Array.isArray(item.repo) && item.repo.length > 0) {
        return (
          <div className="flex items-center gap-2 justify-center">
            {item.repo.map((repo, index) => (
              <Link
                key={repo.url + index}
                className="text-default-600 hover:text-default-900 transition-colors inline-flex"
                href={repo.url}
                isExternal
              >
                {getRepoIcon(repo.type)}
              </Link>
            ))}
          </div>
        )
      }
      return <div className="text-sm truncate text-default-600">-</div>
    case 'installed':
      console.log(item.installed)
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
            <DownloadPluginButton plugin={item} installed={item.installed} />
          )}
        </div>
      )
    case 'license':
      if (item.license.url) {
        return (
          <Link
            className="text-xs text-primary-500 hover:text-primary-600 inline-flex items-center"
            href={item.license.url}
            isExternal
            showAnchorIcon
          >
            {item.license.name}
          </Link>
        )
      }
      /** 返回空文本- */
      return <div className="text-sm truncate">-</div>
    case 'version':
      return (
        <div className="text-xs font-mono text-default-600 bg-default-50 px-1.5 py-0.5 rounded">
          {item.version}
        </div>
      )
    default:
      return <div className="text-xs truncate">{item[columnKey]}</div>
  }
}

export default function MarketPage () {
  const [page, setPage] = useState(1)

  // 获取在线插件列表
  const { data: plugins = [], error: onlineError, loading: onlineLoading } = useRequest<KarinBase<'all'>, [{ time: number }]>(
    () => request.serverPost('/api/v1/plugin/index', { time: 20 * 1000 }),
    { refreshDeps: [] }
  )

  const pageSize = 10
  const currentPagePlugins = useMemo(
    () => plugins?.slice((page - 1) * pageSize, page * pageSize) || [],
    [plugins, page],
  )

  if (onlineError) {
    return <div className="text-center">{onlineError.message}</div>
  }

  return (
    <div className="h-full flex flex-col">
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
    </div>
  )
}
