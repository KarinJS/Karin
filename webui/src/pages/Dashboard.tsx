import { useEffect, useState } from 'react'
import { fetchStats, fetchLogs } from '../api'
import type { StatItem, LogEntry } from '../api'
import { ArrowUp, ArrowDown, Activity, Users, Server, Cpu, MoreHorizontal, Settings, Box, RefreshCw, Terminal, Zap, Quote } from 'lucide-react'
import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'
import { Card, CardBody, CardHeader, Button, Chip, ScrollShadow, Spinner } from "@heroui/react"
import { useNavigate } from 'react-router-dom'

interface Hitokoto {
  id: number
  hitokoto: string
  from: string
  from_who: string | null
  creator: string
}

export function Dashboard () {
  const [stats, setStats] = useState<StatItem[]>([])
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [hitokoto, setHitokoto] = useState<Hitokoto | null>(null)
  const { t } = useTranslation()
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
    fetchHitokoto()
  }, [])

  const loadData = async () => {
    setLoading(true)
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

  const fetchHitokoto = async () => {
    try {
      const res = await fetch('https://v1.hitokoto.cn/')
      const data = await res.json()
      setHitokoto(data)
    } catch (e) {
      console.error('Failed to fetch hitokoto', e)
    }
  }

  const getIcon = (title: string) => {
    if (title.includes('Users')) return Users
    if (title.includes('Server')) return Server
    if (title.includes('Memory')) return Cpu
    return Activity
  }


  const getLocalizedTitle = (title: string) => {
    if (title.includes('Users')) return t('dashboard.stats.users')
    if (title.includes('Active')) return t('dashboard.stats.active')
    if (title.includes('Uptime')) return t('dashboard.stats.uptime')
    if (title.includes('Memory')) return t('dashboard.stats.memory')
    return title
  }

  const QuickActions = [
    { icon: Settings, label: t('sidebar.basicConfig'), path: '/basic-config' },
    { icon: Box, label: t('sidebar.plugins'), path: '/plugins' },
    { icon: Zap, label: t('sidebar.schemaDemo'), path: '/schema-demo' },
  ]

  if (loading && stats.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" color="primary" />
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8 custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              {t('dashboard.welcome')}
              <span className="text-2xl">👋</span>
            </h1>
            <p className="text-slate-500 mt-1 font-medium">{t('dashboard.subtitle')}</p>
          </div>
          <div className="flex gap-3">
             <Button 
              size="sm" 
              variant="flat" 
              color="primary" 
              startContent={<RefreshCw size={16} />}
              onPress={loadData}
              isLoading={loading}
            >
              {t('dashboard.refresh')}
            </Button>
            <Chip color="success" variant="dot" className="pl-1 border-none bg-success-50 text-success-700 font-medium">
              {t('dashboard.systemOnline')}
            </Chip>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = getIcon(stat.title)
            const isUp = stat.trend === 'up'
            return (
              <Card
                key={index}
                className="border-none shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <CardBody className="p-5 overflow-hidden relative">
                  <div className="flex items-start justify-between relative z-10">
                    <div>
                      <p className="text-sm font-medium text-slate-500 mb-1">{getLocalizedTitle(stat.title)}</p>
                      <h4 className="text-2xl font-bold text-slate-800">{stat.value}</h4>
                    </div>
                    <div className={clsx(
                      "p-2 rounded-lg",
                      index === 0 ? "bg-violet-100 text-violet-600" :
                      index === 1 ? "bg-blue-100 text-blue-600" :
                      index === 2 ? "bg-emerald-100 text-emerald-600" :
                      "bg-amber-100 text-amber-600"
                    )}>
                      <Icon size={20} />
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-2 text-xs font-medium">
                    <Chip
                      size="sm"
                      variant="flat"
                      color={isUp ? "success" : "danger"}
                      classNames={{ content: "font-semibold px-1" }}
                      startContent={isUp ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                    >
                      {stat.change}
                    </Chip>
                    <span className="text-slate-400">vs last month</span>
                  </div>
                </CardBody>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content: Traffic & Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
             {/* Quick Actions */}
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
               {QuickActions.map((action, i) => (
                 <Card 
                  key={i} 
                  isPressable 
                  onPress={() => navigate(action.path)}
                  className="bg-gradient-to-br from-white to-slate-50 border-none shadow-sm hover:shadow-md hover:scale-[1.02] transition-all"
                >
                   <CardBody className="flex flex-row items-center gap-4 p-4">
                      <div className="p-3 bg-primary/10 rounded-xl text-primary">
                        <action.icon size={20} />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-slate-700 text-sm">{action.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Click to configure</p>
                      </div>
                   </CardBody>
                 </Card>
               ))}
             </div>

            {/* Chart Area */}
            <Card className="min-h-[300px] border-none shadow-sm flex flex-col">
              <CardHeader className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Activity size={18} className="text-primary" />
                  <h2 className="font-bold text-lg text-slate-800">{t('dashboard.trafficOverview')}</h2>
                </div>
                <Button isIconOnly variant="light" size="sm" className="text-slate-400">
                  <MoreHorizontal size={18} />
                </Button>
              </CardHeader>
              <CardBody className="flex-1 flex items-center justify-center p-8 bg-slate-50/50">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <Activity size={32} className="text-slate-300" />
                  </div>
                  <h3 className="text-slate-600 font-medium mb-1">{t('dashboard.chartVisualization')}</h3>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto">{t('dashboard.waitingData')}</p>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Right Panel: Logs */}
          <Card className="h-full border-none shadow-sm flex flex-col">
            <CardHeader className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal size={18} className="text-slate-500" />
                <h2 className="font-bold text-lg text-slate-800">{t('dashboard.logs.title')}</h2>
              </div>
              <Button size="sm" variant="light" className="text-primary font-medium text-xs">
                {t('dashboard.logs.viewAll')}
              </Button>
            </CardHeader>
            <CardBody className="p-0">
              <ScrollShadow className="h-[400px] w-full">
                <div className="divide-y divide-slate-50">
                  {logs.map((log) => (
                    <div key={log.id} className="px-6 py-4 hover:bg-slate-50 transition-colors cursor-default">
                      <div className="flex gap-3">
                        <div className={clsx(
                          "w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0",
                          log.level === 'info' && "bg-sky-500",
                          log.level === 'warn' && "bg-amber-500",
                          log.level === 'error' && "bg-rose-500"
                        )} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-700 font-medium truncate">{log.message}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={clsx(
                              "text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider",
                              log.level === 'info' && "bg-sky-50 text-sky-600",
                              log.level === 'warn' && "bg-amber-50 text-amber-600",
                              log.level === 'error' && "bg-rose-50 text-rose-600"
                            )}>
                              {log.level}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">{log.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollShadow>
            </CardBody>
          </Card>
        </div>
      </div>
      
      {hitokoto && (
        <div className="fixed bottom-6 right-8 max-w-md text-right z-50 pointer-events-none select-none hidden md:block opacity-70 hover:opacity-100 transition-opacity duration-700">
          <p className="text-sm font-medium text-slate-500 leading-relaxed italic drop-shadow-sm font-serif">
            "{hitokoto.hitokoto}"
          </p>
          <div className="flex justify-end items-center gap-2 mt-1.5">
            <div className="h-px w-6 bg-slate-300/50"></div>
            <p className="text-[10px] text-slate-400 font-light tracking-wide uppercase">
              {hitokoto.from_who || hitokoto.creator} 
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
