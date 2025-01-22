import OnlinePluginCard from '@/components/plugin/online_plugin_card'
import PluginCardSkeleton from '@/components/plugin/plugin_card_skeleton'
import { request } from '@/lib/request'
import type { OnlinePluginInfo } from '@/types/plugin'
import { useRequest } from 'ahooks'

export default function PluginMarketPage() {
  const { data, error, loading } = useRequest(
    () => request.serverGet<OnlinePluginInfo[]>('/api/v1/plugin/index'),
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
    <section>
      {data?.map(plugin => <OnlinePluginCard key={plugin.package_name} plugin={plugin} />)}
    </section>
  )
}
