import { useMemo, useState } from 'react'
import { useRequest } from 'ahooks'
import { request } from '@/lib/request'
import { Pagination } from '@heroui/pagination'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/table'
import { DownloadPluginButton } from '@/components/plugin/download_plugin_button'
import type { OnlinePluginInfo } from '@/types/plugins'
import { FaUser } from 'react-icons/fa6'
import { FaGithub, FaGitter, FaNpm } from 'react-icons/fa6'
import { Link } from '@heroui/link'
import { Spinner } from '@heroui/spinner'
import { Chip } from '@heroui/chip'

const columns = [
  { key: 'name', label: '名称' },
  { key: 'type', label: '类型' },
  { key: 'author', label: '作者' },
  { key: 'description', label: '插件描述' },
  { key: 'repo', label: '仓库源' },
  { key: 'license', label: '开源许可' },
  { key: 'version', label: '版本' },
  { key: 'action', label: '操作' },
]
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
  item: OnlinePluginInfo<'all'>,
  columnKey: keyof OnlinePluginInfo<'all'> | 'action',
) => {
  switch (columnKey) {
    case 'name':
      return (
        <div className="text-xs text-default-500 font-mono bg-default-100 px-2 py-1 rounded w-fit">
          {item.name}
        </div>
      )
    case 'type':
      return (
        <Chip color="primary" size="sm" variant="flat">
          {item.type.toUpperCase()}
        </Chip>
      )
    case 'author':
      return (
        <div className="flex items-center gap-1.5">
          <FaUser className="text-default-400 shrink-0 text-sm" />
          <span className="text-sm truncate">
            {item.author.map((author, index) => (
              <span key={author.home}>
                <a href={author.home} target="_blank" rel="noreferrer" className="text-primary-500">
                  {author.name}
                </a>
                {index !== item.author.length - 1 && <span>, </span>}
              </span>
            ))}
          </span>
        </div>
      )
    case 'repo':
      if (Array.isArray(item.repo) && item.repo.length > 0) {
        return (
          <Link className="text-default-900" href={item.repo[0].url} rel="noreferrer" isExternal>
            {getRepoIcon(item.repo[0].type)}
          </Link>
        )
      }
      /** 返回空文本- */
      return <div className="text-sm truncate">-</div>
    case 'action':
      return (
        <div className="flex justify-center">
          <DownloadPluginButton plugin={item} />
        </div>
      )
    case 'license':
      return (
        <Link className="text-sm" href={item.license.url} isExternal>
          {item.license.name}
        </Link>
      )
    default:
      return <div className="text-sm truncate">{item[columnKey]}</div>
  }
}
export default function MarketPage () {
  const [page, setPage] = useState(1)
  const { data, error, loading } = useRequest(
    () =>
      request.serverPost<OnlinePluginInfo<'all'>[], { time: number }>('/api/v1/plugin/index', {
        time: 20 * 1000,
      }),
    {
      refreshDeps: [],
    },
  )
  const pageSize = 10
  const plugins = useMemo(
    () => data?.slice((page - 1) * pageSize, page * pageSize) || [],
    [data, page],
  )

  if (error) {
    return <div className="text-center">{error.message}</div>
  }

  return (
    <Table
      aria-label="Plugin List"
      shadow="none"
      className="h-full"
      classNames={{
        wrapper: 'h-full',
      }}
      bottomContentPlacement="outside"
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={page}
            total={Math.ceil(plugins!.length / pageSize)}
            onChange={page => setPage(page)}
          />
        </div>
      }
    >
      <TableHeader columns={columns}>
        {column => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody
        items={plugins}
        isLoading={loading}
        loadingContent={<Spinner size="lg" color="primary" className="m-auto" />}
      >
        {item => (
          <TableRow key={item.name + item.time}>
            {columnKey => (
              <TableCell>
                {renderCell(item, columnKey as keyof OnlinePluginInfo<'all'> | 'action')}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
