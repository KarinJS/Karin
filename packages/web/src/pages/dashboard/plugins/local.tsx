import LocalPluginCard from '@/components/plugin/local_plugin_card'
import PluginCardSkeleton from '@/components/plugin/plugin_card_skeleton'
import { request } from '@/lib/request'
import { LocalPluginInfo } from '@/types/plugin'
import { useRequest } from 'ahooks'

export default function LocalPluginPage() {
  const { data, error, loading } = useRequest(
    () => request.serverGet<LocalPluginInfo[]>('/api/v1/plugin/list'),
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
  console.log(data, error)
  return (
    <section>{data?.map(plugin => <LocalPluginCard key={plugin.id} plugin={plugin} />)}</section>
  )
}
