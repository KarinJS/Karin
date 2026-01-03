import { useState } from 'react'
import {
  Card,
  Tabs,
  Tab,
  Breadcrumbs,
  BreadcrumbItem
} from "@heroui/react"
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield, Filter, Users, User, MessageSquare, Hash,
  Server, FileText, Database, Cpu, Settings
} from 'lucide-react'

// 导入配置组件
import {
  PermissionsConfig,
  FilterConfig,
  GroupConfig,
  FriendConfig,
  GuildConfig,
  DirectConfig,
  ServerConfig,
  LoggerConfig,
  RedisConfig,
  Pm2Config
} from '../components/config'

/**
 * 基础配置页面
 * 完整的配置管理界面
 */
export function BasicConfig () {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<string>("permissions")

  // 配置标签页定义
  const tabs = [
    {
      id: "permissions",
      label: t('tabs.permissions', '权限管理'),
      icon: Shield,
      component: PermissionsConfig,
      description: t('tabs.permissionsDesc', '管理主人和管理员列表')
    },
    {
      id: "filter",
      label: t('tabs.filter', '过滤器'),
      icon: Filter,
      component: FilterConfig,
      description: t('tabs.filterDesc', '事件过滤和黑白名单')
    },
    {
      id: "group",
      label: t('tabs.group', '群聊场景'),
      icon: Users,
      component: GroupConfig,
      description: t('tabs.groupDesc', '群聊消息处理规则')
    },
    {
      id: "friend",
      label: t('tabs.friend', '好友场景'),
      icon: User,
      component: FriendConfig,
      description: t('tabs.friendDesc', '私聊消息处理规则')
    },
    {
      id: "guild",
      label: t('tabs.guild', '频道场景'),
      icon: Hash,
      component: GuildConfig,
      description: t('tabs.guildDesc', '频道消息处理规则')
    },
    {
      id: "direct",
      label: t('tabs.direct', '私信场景'),
      icon: MessageSquare,
      component: DirectConfig,
      description: t('tabs.directDesc', '频道私信处理规则')
    },
    {
      id: "server",
      label: t('tabs.server', '服务器'),
      icon: Server,
      component: ServerConfig,
      description: t('tabs.serverDesc', 'HTTP/WS服务配置')
    },
    {
      id: "logger",
      label: t('tabs.logger', '日志'),
      icon: FileText,
      component: LoggerConfig,
      description: t('tabs.loggerDesc', '日志级别和存储')
    },
    {
      id: "redis",
      label: t('tabs.redis', 'Redis'),
      icon: Database,
      component: RedisConfig,
      description: t('tabs.redisDesc', '缓存数据库配置')
    },
    {
      id: "pm2",
      label: t('tabs.pm2', 'PM2'),
      icon: Cpu,
      component: Pm2Config,
      description: t('tabs.pm2Desc', '进程管理配置')
    },
  ]

  // 获取当前选中的标签页
  const currentTab = tabs.find(tab => tab.id === selected)

  return (
    <div className="w-full h-full p-2 flex gap-6">
      {/* 左侧导航卡片 - 悬浮独立 */}
      <Card className="w-64 h-full shrink-0 bg-content1/80 backdrop-blur-xl shadow-sm">
        <div className="h-full flex flex-col">
          <div className="p-2 pb-2 shrink-0">
            <h2 className="text-lg font-bold text-default-900 px-2 mb-4">
              {t('basicConfig.title', '系统配置')}
            </h2>
          </div>
          <div className="px-4 flex-1 overflow-y-auto scrollbar-hide">
            <Tabs
              aria-label={t('basicConfig.tabsAriaLabel', '配置选项')}
              selectedKey={selected}
              onSelectionChange={(key) => setSelected(key as string)}
              color="primary"
              variant="light"
              isVertical={true}
              classNames={{
                tabList: "gap-2 w-full relative p-0",
                cursor: "w-full bg-primary/10 rounded-lg",
                tab: "w-full justify-start h-10 px-3 data-[selected=true]:text-primary transition-colors",
                tabContent: "text-default-500 group-data-[selected=true]:text-primary group-data-[selected=true]:font-medium"
              }}
            >
              {tabs.map((item) => (
                <Tab
                  key={item.id}
                  title={
                    <div className="flex items-center gap-3">
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </div>
                  }
                />
              ))}
            </Tabs>
          </div>
        </div>
      </Card>

      {/* 右侧内容卡片 - 悬浮独立 */}
      <Card className="flex-1 h-full bg-content1/80 backdrop-blur-xl shadow-sm overflow-hidden">
        <div className="flex flex-col h-full">
          {/* 顶部面包屑和标题区域 */}
          <div className="shrink-0 px-8 py-6 border-b border-divider/50">
            <Breadcrumbs size="sm" className="mb-2">
              <BreadcrumbItem>Karin</BreadcrumbItem>
              <BreadcrumbItem>设置</BreadcrumbItem>
              <BreadcrumbItem>系统配置</BreadcrumbItem>
            </Breadcrumbs>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Settings size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-default-900">
                  {currentTab?.label}
                </h1>
                <p className="text-sm text-default-500">
                  {currentTab?.description}
                </p>
              </div>
            </div>
          </div>

          {/* 滚动内容区域 */}
          <div className="flex-1 overflow-y-auto scrollbar-hide p-8">
            <AnimatePresence mode="wait">
              {currentTab && (
                <motion.div
                  key={currentTab.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <currentTab.component />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Card>
    </div>
  )
}
