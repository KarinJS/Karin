import { useEffect, useState } from 'react'
import { fetchStats, fetchLogs } from '../api'
import type { StatItem, LogEntry } from '../api'
import { ArrowUp, ArrowDown, Activity, Users, Server, Cpu, MoreHorizontal } from 'lucide-react'
import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'
import { Card, CardBody, CardHeader, Button, Spinner, Chip } from "@heroui/react"

export function Dashboard () {
  const [stats, setStats] = useState<StatItem[]>([])
  const [logs, setLogs] = useState<LogEntry[]>([])
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
        <Spinner size="lg" color="primary" />
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-7xl mx-auto space-y-8 pb-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{t('dashboard.title')}</h1>
            <p className="text-slate-500 mt-1 font-medium">{t('dashboard.subtitle')}</p>
          </div>
          <div className="flex gap-2">
            <Chip color="success" variant="flat" className="font-bold uppercase tracking-wider">System Online</Chip>
          </div>
        </div>

        {/* Bento Grid Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = getIcon(stat.title)
            const isUp = stat.trend === 'up'
            return (
              <Card
                key={index}
                className={clsx(
                  "relative overflow-hidden group",
                  index === 0 && "md:col-span-2 bg-gradient-to-br from-sky-400 to-sky-500 text-white border-none shadow-lg shadow-sky-200"
                )}
                shadow="sm"
              >
                <CardBody className="p-6 overflow-visible">
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
                    <Chip
                      size="sm"
                      variant="flat"
                      color={index === 0 ? "default" : (isUp ? "success" : "danger")}
                      className={clsx(
                        "font-bold",
                        index === 0 && "bg-white/20 text-white"
                      )}
                      startContent={isUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                    >
                      {stat.change}
                    </Chip>
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
                </CardBody>
              </Card>
            )
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Placeholder (Large Card) */}
          <Card className="lg:col-span-2 min-h-[400px]" shadow="sm">
            <CardHeader className="flex items-center justify-between px-6 py-5">
              <h2 className="font-bold text-lg text-slate-800">Traffic Overview</h2>
              <Button isIconOnly variant="light" radius="lg" className="text-slate-400">
                <MoreHorizontal size={20} />
              </Button>
            </CardHeader>
            <CardBody className="px-6 pb-6 pt-0">
              <div className="h-full bg-slate-50/50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-sky-400/5 to-purple-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="text-center">
                  <Activity size={48} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-400 font-medium">Chart Visualization Area</p>
                  <p className="text-slate-400 text-sm">Waiting for real data...</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Recent Logs (Side Panel) */}
          <Card className="flex flex-col" shadow="sm">
            <CardHeader className="px-6 py-5 border-b border-slate-100/50 flex items-center justify-between bg-white/40 backdrop-blur-sm">
              <h2 className="font-bold text-lg text-slate-800">{t('dashboard.logs.title')}</h2>
              <Button size="sm" variant="light" color="primary" className="font-bold uppercase tracking-wide">
                {t('dashboard.logs.viewAll')}
              </Button>
            </CardHeader>
            <CardBody className="p-0 overflow-hidden">
              <div className="divide-y divide-slate-100/50 overflow-y-auto max-h-[400px]">
                {logs.map((log) => (
                  <div key={log.id} className="px-6 py-4 hover:bg-slate-50/50 transition-colors group cursor-default">
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
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
