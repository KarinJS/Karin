import LocalPluginCard from '@/components/plugin/local_plugin_card'
import PluginCardSkeleton from '@/components/plugin/plugin_card_skeleton'
import { request } from '@/lib/request'
import { LocalPluginInfo } from '@/types/plugins/plugin'
import { useRequest } from 'ahooks'

export default function LocalPluginPage () {
  const { data, error, loading } = useRequest(
    () => request.serverPost<LocalPluginInfo[], { time: number }>('/api/v1/plugin/list', { time: 20 * 1000 }),
    {
      refreshDeps: [],
    },
  )
  if (loading) {
    return (
      <section>
        <PluginCardSkeleton />
      </section>
    )
  }
  return (
    <section>{data?.map(plugin => <LocalPluginCard key={plugin.id} plugin={plugin} />)}</section>
  )
}
