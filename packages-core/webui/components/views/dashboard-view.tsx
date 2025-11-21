import { Card } from '@/components/ui/card'
import { Bot, Users, Activity, Zap, TrendingUp, AlertCircle } from 'lucide-react'

export function DashboardView () {
  const stats = [
    { label: '活跃 Bots', value: '12', icon: Bot, trend: '+2', color: 'text-blue-500' },
    { label: '在线用户', value: '1,234', icon: Users, trend: '+15%', color: 'text-green-500' },
    { label: '今日消息', value: '8,456', icon: Activity, trend: '+23%', color: 'text-purple-500' },
    { label: '系统负载', value: '45%', icon: Zap, trend: '-5%', color: 'text-orange-500' },
  ]

  return (
    <div className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold text-foreground mb-2'>仪表盘</h2>
        <p className='text-muted-foreground'>欢迎回来，这是您的 Bot 框架概览</p>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.label}
              className='glass border border-border/50 bg-card/40 p-6 hover:bg-card/60 transition-all duration-300 hover:shadow-lg hover:scale-105'
            >
              <div className='flex items-start justify-between mb-4'>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} from-current/10 to-current/5 flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className='text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full'>
                  {stat.trend}
                </span>
              </div>
              <div>
                <p className='text-2xl font-bold text-foreground mb-1'>{stat.value}</p>
                <p className='text-sm text-muted-foreground'>{stat.label}</p>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Activity Chart Placeholder */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <Card className='lg:col-span-2 glass border border-border/50 bg-card/40 p-6'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h3 className='text-lg font-semibold text-foreground'>活动趋势</h3>
              <p className='text-sm text-muted-foreground'>最近 7 天的消息统计</p>
            </div>
            <TrendingUp className='w-5 h-5 text-primary' />
          </div>
          <div className='h-64 flex items-center justify-center text-muted-foreground'>图表数据可视化区域</div>
        </Card>

        <Card className='glass border border-border/50 bg-card/40 p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-lg font-semibold text-foreground'>系统通知</h3>
            <AlertCircle className='w-5 h-5 text-orange-500' />
          </div>
          <div className='space-y-4'>
            {[
              { title: '系统更新可用', time: '2 小时前', type: 'info' },
              { title: 'Bot #3 离线', time: '5 小时前', type: 'warning' },
              { title: '数据库备份完成', time: '1 天前', type: 'success' },
            ].map((notif, i) => (
              <div key={i} className='flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors'>
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    notif.type === 'warning'
                      ? 'bg-orange-500'
                      : notif.type === 'success'
                        ? 'bg-green-500'
                        : 'bg-blue-500'
                  }`}
                />
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium text-foreground'>{notif.title}</p>
                  <p className='text-xs text-muted-foreground'>{notif.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
