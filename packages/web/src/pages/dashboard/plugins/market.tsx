import { useState } from 'react'
import { useRequest } from 'ahooks'
import { request } from '@/lib/request'
import { Pagination } from '@heroui/pagination'
import { PluginListItem } from '@/components/plugin/online_plugin_card'
import type { OnlinePluginInfo } from '@/types/plugins'

export default function MarketPage () {
  const [page, setPage] = useState(1)
  const { data: plugins, error, loading } = useRequest(
    () => request.serverPost<OnlinePluginInfo<'all'>, { time: number }>('/api/v1/plugin/index', { time: 20 * 1000 }),
    {
      refreshDeps: [],
    },
  )
  console.log(plugins)
  const pageSize = 10

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-12 mb-4">
          <div className="animate-spin w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full" />
          <span className="ml-2 text-sm text-default-600">加载中...</span>
        </div>
        <div className="flex-1 min-h-0">
          <table className="w-full border border-default-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-default-50 border-b border-default-200 text-sm text-default-600">
                <th className="w-52 py-3 px-4 font-medium text-left">名称</th>
                <th className="w-24 py-3 px-4 font-medium text-center">类型</th>
                <th className="w-40 py-3 px-4 font-medium text-left">作者</th>
                <th className="py-3 px-4 font-medium text-left">插件描述</th>
                <th className="w-28 py-3 px-4 font-medium text-center">仓库源</th>
                <th className="w-28 py-3 px-4 font-medium text-center">开源许可</th>
                <th className="w-20 py-3 px-4 font-medium text-center">版本</th>
                <th className="w-20 py-3 px-4 font-medium text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-default-200">
              {Array.from({ length: pageSize }).map((_, index) => (
                <tr key={index}>
                  <td className="py-2.5 px-4">
                    <div className="animate-pulse h-6 bg-default-200 rounded w-32"></div>
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="animate-pulse h-5 bg-default-200 rounded-full w-16 mx-auto"></div>
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="animate-pulse h-5 bg-default-200 rounded w-24"></div>
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="animate-pulse h-5 bg-default-200 rounded w-full"></div>
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="animate-pulse h-5 bg-default-200 rounded w-16 mx-auto"></div>
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="animate-pulse h-5 bg-default-200 rounded w-16 mx-auto"></div>
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="animate-pulse h-5 bg-default-200 rounded w-12 mx-auto"></div>
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="animate-pulse h-8 w-8 bg-default-200 rounded-lg mx-auto"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0">
        <table className="w-full border border-default-200 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-default-50 border-b border-default-200 text-sm text-default-600">
              <th className="w-52 py-3 px-4 font-medium text-left">名称</th>
              <th className="w-24 py-3 px-4 font-medium text-center">类型</th>
              <th className="w-40 py-3 px-4 font-medium text-left">作者</th>
              <th className="py-3 px-4 font-medium text-left">插件描述</th>
              <th className="w-28 py-3 px-4 font-medium text-center">仓库源</th>
              <th className="w-28 py-3 px-4 font-medium text-center">开源许可</th>
              <th className="w-20 py-3 px-4 font-medium text-center">版本</th>
              <th className="w-20 py-3 px-4 font-medium text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-default-200">
            {plugins?.map(plugin => (
              <PluginListItem key={plugin.name} {...plugin} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center py-4 mt-auto">
        <Pagination
          total={Math.ceil(plugins!.length / pageSize)}
          page={page}
          onChange={setPage}
        />
      </div>
    </div>
  )
}
