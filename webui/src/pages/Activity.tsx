import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardBody, Chip, Button, Input, Select, SelectItem } from '@heroui/react'
import { useTranslation } from 'react-i18next'
import {
  Activity as ActivityIcon,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  Info,
  AlertTriangle,
  CheckCircle,
  UserPlus,
  Settings,
  Plug,
  Server,
  MessageSquare,
  Clock,
} from 'lucide-react'

/** 事件类型 - 可扩展 */
export type ActivityType =
  | 'system'       // 系统事件：启动、关闭、重启
  | 'plugin'       // 插件事件：安装、卸载、启用、禁用
  | 'user'         // 用户事件：加群、退群、好友请求
  | 'config'       // 配置变更
  | 'server'       // 服务器事件：连接、断开
  | 'message'      // 消息事件：收发消息统计
  | 'custom'       // 自定义事件（预留给开发者扩展）

/** 事件级别 */
export type ActivityLevel = 'info' | 'success' | 'warning' | 'error'

/** 单条活动记录 */
export interface ActivityItem {
  id: string
  type: ActivityType
  level: ActivityLevel
  title: string
  description: string
  timestamp: number
  /** 附加元数据，方便扩展展示 */
  meta?: Record<string, unknown>
}

/** 类型对应的图标映射 */
const TYPE_ICON_MAP: Record<ActivityType, typeof ActivityIcon> = {
  system: Server,
  plugin: Plug,
  user: UserPlus,
  config: Settings,
  server: Server,
  message: MessageSquare,
  custom: ActivityIcon,
}

/** 级别对应的颜色配置 */
const LEVEL_CONFIG: Record<ActivityLevel, { color: 'default' | 'success' | 'warning' | 'danger', icon: typeof Info }> = {
  info: { color: 'default', icon: Info },
  success: { color: 'success', icon: CheckCircle },
  warning: { color: 'warning', icon: AlertTriangle },
  error: { color: 'danger', icon: AlertCircle },
}

/** 生成模拟活动数据 - 后续替换为真实 API */
function generateMockActivities (): ActivityItem[] {
  const now = Date.now()
  return [
    {
      id: '1', type: 'system', level: 'success', title: '系统启动',
      description: 'Karin 核心服务启动成功，所有模块加载完毕。',
      timestamp: now - 1000 * 60 * 2,
      meta: { version: '1.0.0', modules: 12 },
    },
    {
      id: '2', type: 'plugin', level: 'info', title: '插件加载',
      description: '已加载 karin-plugin-test v1.2.0',
      timestamp: now - 1000 * 60 * 5,
      meta: { plugin: 'karin-plugin-test', version: '1.2.0' },
    },
    {
      id: '3', type: 'server', level: 'success', title: 'HTTP 服务就绪',
      description: 'HTTP 服务已在 0.0.0.0:7777 启动，等待连接。',
      timestamp: now - 1000 * 60 * 5,
      meta: { host: '0.0.0.0', port: 7777 },
    },
    {
      id: '4', type: 'user', level: 'info', title: '新成员加入群聊',
      description: '用户 10086 加入了群 123456。',
      timestamp: now - 1000 * 60 * 15,
      meta: { userId: '10086', groupId: '123456' },
    },
    {
      id: '5', type: 'config', level: 'warning', title: '配置变更',
      description: '服务器端口从 7777 修改为 8888，需要重启生效。',
      timestamp: now - 1000 * 60 * 30,
      meta: { field: 'http.port', oldValue: 7777, newValue: 8888 },
    },
    {
      id: '6', type: 'plugin', level: 'error', title: '插件异常',
      description: 'karin-plugin-example 加载失败: 缺少依赖 lodash',
      timestamp: now - 1000 * 60 * 45,
      meta: { plugin: 'karin-plugin-example', error: 'Missing dependency: lodash' },
    },
    {
      id: '7', type: 'message', level: 'info', title: '消息统计',
      description: '过去一小时内收到 128 条消息，发送 45 条。',
      timestamp: now - 1000 * 60 * 60,
      meta: { received: 128, sent: 45 },
    },
    {
      id: '8', type: 'user', level: 'info', title: '好友请求',
      description: '收到来自用户 20086 的好友请求，附言：你好！',
      timestamp: now - 1000 * 60 * 90,
      meta: { userId: '20086', comment: '你好！' },
    },
    {
      id: '9', type: 'system', level: 'warning', title: '内存告警',
      description: '当前内存使用率已达 85%，请注意系统负载。',
      timestamp: now - 1000 * 60 * 120,
      meta: { usage: 85, total: '2GB' },
    },
    {
      id: '10', type: 'server', level: 'info', title: 'WebSocket 连接',
      description: '适配器 OneBot 已通过 WebSocket 连接成功。',
      timestamp: now - 1000 * 60 * 150,
      meta: { adapter: 'OneBot', protocol: 'ws' },
    },
  ]
}

function formatTime (timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp

  if (diff < 60_000) return '刚刚'
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)} 分钟前`
  if (diff < 86400_000) return `${Math.floor(diff / 3600_000)} 小时前`

  const d = new Date(timestamp)
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

export function Activity () {
  const { t } = useTranslation()
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [filterType, setFilterType] = useState<'all' | ActivityType>('all')
  const [filterLevel, setFilterLevel] = useState<'all' | ActivityLevel>('all')
  const scrollRef = useRef<HTMLDivElement>(null)

  const loadActivities = useCallback(async () => {
    setLoading(true)
    try {
      // TODO: 替换为真实 API 调用，如 getActivities() / getSystemLogs()
      await new Promise(r => setTimeout(r, 300))
      setActivities(generateMockActivities())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadActivities()
  }, [loadActivities])

  const filtered = activities.filter(item => {
    if (filterType !== 'all' && item.type !== filterType) return false
    if (filterLevel !== 'all' && item.level !== filterLevel) return false
    if (searchText) {
      const lower = searchText.toLowerCase()
      return item.title.toLowerCase().includes(lower) || item.description.toLowerCase().includes(lower)
    }
    return true
  })

  const typeOptions: { key: 'all' | ActivityType, label: string }[] = [
    { key: 'all', label: t('activity.filter.all') },
    { key: 'system', label: t('activity.types.system') },
    { key: 'plugin', label: t('activity.types.plugin') },
    { key: 'user', label: t('activity.types.user') },
    { key: 'config', label: t('activity.types.config') },
    { key: 'server', label: t('activity.types.server') },
    { key: 'message', label: t('activity.types.message') },
  ]

  const levelOptions: { key: 'all' | ActivityLevel, label: string }[] = [
    { key: 'all', label: t('activity.filter.all') },
    { key: 'info', label: t('activity.levels.info') },
    { key: 'success', label: t('activity.levels.success') },
    { key: 'warning', label: t('activity.levels.warning') },
    { key: 'error', label: t('activity.levels.error') },
  ]

  return (
    <div className="h-full overflow-y-auto p-6 sm:p-8 scrollbar-hide" ref={scrollRef}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {t('activity.title')}
            </h1>
            <p className="text-slate-500 dark:text-zinc-400 mt-1">
              {t('activity.subtitle')}
            </p>
          </div>
          <Button
            isLoading={loading}
            startContent={!loading && <RefreshCw size={16} />}
            onPress={loadActivities}
            variant="flat"
            className="bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200"
          >
            {t('activity.refresh')}
          </Button>
        </div>

        {/* Filters */}
        <Card shadow="none" className="glass-card">
          <CardBody className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder={t('activity.search')}
                startContent={<Search size={16} className="text-slate-400" />}
                variant="bordered"
                value={searchText}
                onValueChange={setSearchText}
                className="flex-1"
                classNames={{
                  inputWrapper: "bg-white/50 dark:bg-zinc-800/50 border-slate-200/60 dark:border-zinc-700",
                  input: "text-slate-800 dark:text-zinc-100",
                }}
              />
              <Select
                selectedKeys={[filterType]}
                onSelectionChange={(keys) => {
                  const v = Array.from(keys)[0] as string
                  if (v) setFilterType(v as 'all' | ActivityType)
                }}
                variant="bordered"
                className="w-full sm:w-40"
                classNames={{
                  trigger: "bg-white/50 dark:bg-zinc-800/50 border-slate-200/60 dark:border-zinc-700",
                  value: "text-slate-800 dark:text-zinc-100",
                }}
                startContent={<Filter size={14} className="text-slate-400" />}
              >
                {typeOptions.map(opt => <SelectItem key={opt.key}>{opt.label}</SelectItem>)}
              </Select>
              <Select
                selectedKeys={[filterLevel]}
                onSelectionChange={(keys) => {
                  const v = Array.from(keys)[0] as string
                  if (v) setFilterLevel(v as 'all' | ActivityLevel)
                }}
                variant="bordered"
                className="w-full sm:w-40"
                classNames={{
                  trigger: "bg-white/50 dark:bg-zinc-800/50 border-slate-200/60 dark:border-zinc-700",
                  value: "text-slate-800 dark:text-zinc-100",
                }}
              >
                {levelOptions.map(opt => <SelectItem key={opt.key}>{opt.label}</SelectItem>)}
              </Select>
            </div>
          </CardBody>
        </Card>

        {/* Statistics Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {([
            { level: 'info' as const, count: activities.filter(a => a.level === 'info').length },
            { level: 'success' as const, count: activities.filter(a => a.level === 'success').length },
            { level: 'warning' as const, count: activities.filter(a => a.level === 'warning').length },
            { level: 'error' as const, count: activities.filter(a => a.level === 'error').length },
          ]).map(({ level, count }) => {
            const cfg = LEVEL_CONFIG[level]
            return (
              <Card key={level} shadow="none" className="glass-card" isPressable
                onPress={() => setFilterLevel(filterLevel === level ? 'all' : level)}>
                <CardBody className="p-3 flex flex-row items-center gap-3">
                  <div className={`p-2 rounded-lg ${level === 'info' ? 'bg-blue-50 dark:bg-blue-900/20' :
                      level === 'success' ? 'bg-green-50 dark:bg-green-900/20' :
                        level === 'warning' ? 'bg-amber-50 dark:bg-amber-900/20' :
                          'bg-red-50 dark:bg-red-900/20'
                    }`}>
                    <cfg.icon size={18} className={
                      level === 'info' ? 'text-blue-500' :
                        level === 'success' ? 'text-green-500' :
                          level === 'warning' ? 'text-amber-500' :
                            'text-red-500'
                    } />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{count}</p>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">{t(`activity.levels.${level}`)}</p>
                  </div>
                </CardBody>
              </Card>
            )
          })}
        </div>

        {/* Timeline */}
        <Card shadow="none" className="glass-card">
          <CardBody className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-4 border-slate-800 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-zinc-500">
                <ActivityIcon size={48} strokeWidth={1} />
                <p className="mt-4 text-sm">{t('activity.empty')}</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                {filtered.map((item) => {
                  const TypeIcon = TYPE_ICON_MAP[item.type] || ActivityIcon
                  const levelCfg = LEVEL_CONFIG[item.level]
                  return (
                    <div key={item.id} className="flex gap-4 p-4 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                      {/* Icon */}
                      <div className={`shrink-0 mt-0.5 p-2 rounded-xl ${item.level === 'info' ? 'bg-blue-50 dark:bg-blue-900/20' :
                          item.level === 'success' ? 'bg-green-50 dark:bg-green-900/20' :
                            item.level === 'warning' ? 'bg-amber-50 dark:bg-amber-900/20' :
                              'bg-red-50 dark:bg-red-900/20'
                        }`}>
                        <TypeIcon size={18} className={
                          item.level === 'info' ? 'text-blue-500' :
                            item.level === 'success' ? 'text-green-500' :
                              item.level === 'warning' ? 'text-amber-500' :
                                'text-red-500'
                        } />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-slate-800 dark:text-slate-100 text-sm">
                            {item.title}
                          </span>
                          <Chip size="sm" variant="flat" color={levelCfg.color} className="text-[10px] h-5">
                            {t(`activity.types.${item.type}`)}
                          </Chip>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                          {item.description}
                        </p>
                        {/* Meta data preview */}
                        {item.meta && Object.keys(item.meta).length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {Object.entries(item.meta).map(([key, value]) => (
                              <span
                                key={key}
                                className="inline-flex items-center text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 font-mono"
                              >
                                {key}: {String(value)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Time */}
                      <div className="shrink-0 flex items-start">
                        <span className="text-xs text-slate-400 dark:text-zinc-500 whitespace-nowrap flex items-center gap-1">
                          <Clock size={12} />
                          {formatTime(item.timestamp)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Footer hint */}
        <p className="text-center text-xs text-slate-400 dark:text-zinc-500 pb-4">
          {t('activity.footer', { count: filtered.length })}
        </p>
      </div>
    </div>
  )
}
