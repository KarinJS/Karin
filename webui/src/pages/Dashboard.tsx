import { useEffect, useState } from 'react'
import { fetchStats, fetchLogs } from '../api/client'
import { ArrowUp, ArrowDown, Activity, Users, Server, Cpu, MoreHorizontal } from 'lucide-react'
import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'

interface Stat {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
}

interface Log {
  id: number
  level: 'info' | 'warn' | 'error'
  message: string
  timestamp: string
}

export function Dashboard () {
  const [stats, setStats] = useState<Stat[]>([])
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, logsData] = await Promise.all([fetchStats(), fetchLogs()])
        setStats(statsData)
        setLogs(logsData)
      } catch (error) {
        console.error('Failed to load data', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const getIcon = (title: string) => {
    if (title.includes('Users')) return Users
    if (title.includes('Server')) return Server
    if (title.includes('Memory')) return Cpu
    return Activity
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-sky-100 border-t-sky-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{t('dashboard.title')}</h1>
          <p className="text-slate-500 mt-1 font-medium">{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wider">System Online</span>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = getIcon(stat.title)
          const isUp = stat.trend === 'up'
          return (
            <div
              key={index}
              className={clsx(
                "glass-card p-6 rounded-2xl relative overflow-hidden group",
                index === 0 && "md:col-span-2 bg-gradient-to-br from-sky-400 to-sky-500 text-white border-none shadow-lg shadow-sky-200"
              )}
            >
              {index === 0 && (
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
              )}

              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className={clsx(
                  "p-3 rounded-xl transition-transform duration-300 group-hover:scale-110",
                  index === 0 ? "bg-white/20 text-white" : "bg-sky-50 text-sky-500"
                )}>
                  <Icon size={24} />
                </div>
                <span className={clsx(
                  "flex items-center text-xs font-bold px-2.5 py-1.5 rounded-full backdrop-blur-sm",
                  index === 0
                    ? "bg-white/20 text-white"
                    : (isUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")
                )}>
                  {isUp ? <ArrowUp size={12} className="mr-1" /> : <ArrowDown size={12} className="mr-1" />}
                  {stat.change}
                </span>
              </div>

              <div className="relative z-10">
                <h3 className={clsx(
                  "text-sm font-medium mb-1",
                  index === 0 ? "text-sky-50" : "text-slate-500"
                )}>{stat.title}</h3>
                <p className={clsx(
                  "text-3xl font-bold tracking-tight",
                  index === 0 ? "text-white" : "text-slate-900"
                )}>{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Placeholder (Large Card) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg text-slate-800">Traffic Overview</h2>
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="flex-1 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-400/5 to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="text-center">
              <Activity size={48} className="mx-auto text-slate-300 mb-3" />
              <p className="text-slate-400 font-medium">Chart Visualization Area</p>
              <p className="text-slate-400 text-sm">Waiting for real data...</p>
            </div>
          </div>
        </div>

        {/* Recent Logs (Side Panel) */}
        <div className="glass-panel rounded-2xl overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100/50 flex items-center justify-between bg-white/40 backdrop-blur-sm">
            <h2 className="font-bold text-lg text-slate-800">{t('dashboard.logs.title')}</h2>
            <button className="text-xs font-bold text-sky-500 hover:text-sky-600 uppercase tracking-wide">{t('dashboard.logs.viewAll')}</button>
          </div>
          <div className="divide-y divide-slate-100/50 overflow-y-auto max-h-[400px]">
            {logs.map((log) => (
              <div key={log.id} className="px-6 py-4 hover:bg-white/60 transition-colors group cursor-default">
                <div className="flex items-start gap-3">
                  <div className={clsx(
                    "w-2 h-2 rounded-full mt-2 ring-4 ring-opacity-20",
                    log.level === 'info' && "bg-sky-400 ring-sky-400",
                    log.level === 'warn' && "bg-amber-400 ring-amber-400",
                    log.level === 'error' && "bg-rose-400 ring-rose-400"
                  )}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors truncate">{log.message}</p>
                    <p className="text-xs text-slate-400 mt-1 font-mono">{log.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
