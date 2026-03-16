import { useState, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Button,
  Chip,
  Avatar,
  ScrollShadow,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip,
  Checkbox,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Progress,
  Card,
} from '@heroui/react'
import {
  Search,
  Trash2,
  RefreshCw,
  Power,
  PowerOff,
  Settings,
  Package,
  AlertTriangle,
  ChevronDown,
  Download,
  ArrowUpCircle,
  CheckCircle2,
  Construction,
} from 'lucide-react'
import { toast } from 'sonner'
import type { Plugin } from '../types/plugin'
import { mockPlugins } from '../mocks/plugins'
import { pluginConfigSchemas } from '../mocks/pluginConfigs'

/* ─── 模拟更新数据 (mock) ─── */
const SIMULATED_UPDATES: Record<string, {
  latestVersion: string
  versions: { version: string; channel: 'release' | 'rc' | 'beta' | 'dev' }[]
}> = {
  'karin-plugin-example': {
    latestVersion: '1.2.0',
    versions: [
      { version: '1.2.0', channel: 'release' },
      { version: '1.2.0-rc.1', channel: 'rc' },
      { version: '1.2.0-beta.3', channel: 'beta' },
      { version: '1.2.0-dev.5', channel: 'dev' },
      { version: '1.1.0', channel: 'release' },
    ],
  },
}

const CHANNEL_INFO: Record<string, { label: string; color: 'success' | 'primary' | 'warning' | 'default'; icon: string }> = {
  release: { label: '正式版本 (Release)', color: 'success', icon: '📦' },
  rc: { label: '发布候选 (RC)', color: 'primary', icon: '🚀' },
  beta: { label: '测试版本 (Beta)', color: 'warning', icon: '🧪' },
  dev: { label: '开发版本 (Dev)', color: 'default', icon: '🔧' },
}

const CHANNEL_ORDER: ('release' | 'rc' | 'beta' | 'dev')[] = ['release', 'rc', 'beta', 'dev']

/** 本地管理状态（模拟） */
interface PluginState {
  disabled: boolean
}

type FilterType = 'all' | 'enabled' | 'disabled' | 'npm' | 'url' | 'updatable'
type SortType = 'name' | 'updateTime' | 'type'

const ROWS_PER_PAGE = 10

export function PluginManage () {
  const { t } = useTranslation()
  const navigate = useNavigate()
  // ... (local states remain same)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [sortType, setSortType] = useState<SortType>('name')
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [pluginStates, setPluginStates] = useState<Record<string, PluginState>>(() => {
    const initial: Record<string, PluginState> = {}
    mockPlugins.filter(p => p.installed).forEach(p => {
      initial[p.id] = { disabled: false }
    })
    return initial
  })

  /* 确认弹窗 */
  const [confirmAction, setConfirmAction] = useState<{
    pluginIds: string[]
    action: 'uninstall' | 'disable' | 'enable'
    title: string
    content: string
    danger?: boolean
  } | null>(null)

  /* 更新检查 */
  const [updateInfo, setUpdateInfo] = useState<Record<string, {
    latestVersion: string
    versions: { version: string; channel: 'release' | 'rc' | 'beta' | 'dev' }[]
  }>>({})
  const [isCheckingUpdates, setIsCheckingUpdates] = useState(false)
  const [checkUpdateProgress, setCheckUpdateProgress] = useState(0)
  const [showUpdateResult, setShowUpdateResult] = useState(false)

  /* 单个更新弹窗 (仅 npm) */
  const [updateModal, setUpdateModal] = useState<{
    plugin: Plugin
    selectedVersion: string
  } | null>(null)

  /* URL 更新施工中弹窗 */
  const [showUrlWipModal, setShowUrlWipModal] = useState(false)

  /* 配置确认弹窗 */
  const [configConfirm, setConfigConfirm] = useState<Plugin | null>(null)

  /* ─── 计算属性 ─── */
  const allInstalledPlugins = useMemo(() => {
    return mockPlugins.filter(p => p.installed)
  }, [])

  const updatablePlugins = useMemo(() => {
    return allInstalledPlugins.filter(p => {
      const info = updateInfo[p.id]
      return info && info.latestVersion !== p.version
    })
  }, [allInstalledPlugins, updateInfo])

  const filteredPlugins = useMemo(() => {
    let list = allInstalledPlugins

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.authors.name.toLowerCase().includes(q)
      )
    }

    switch (filterType) {
      case 'enabled':
        list = list.filter(p => !(pluginStates[p.id]?.disabled))
        break
      case 'disabled':
        list = list.filter(p => pluginStates[p.id]?.disabled)
        break
      case 'npm':
        list = list.filter(p => p.type === 'npm')
        break
      case 'url':
        list = list.filter(p => p.type === 'url')
        break
      case 'updatable':
        list = list.filter(p => {
          const info = updateInfo[p.id]
          return info && info.latestVersion !== p.version
        })
        break
    }

    list = [...list].sort((a, b) => {
      if (sortType === 'name') return a.name.localeCompare(b.name)
      if (sortType === 'updateTime') return new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime()
      if (sortType === 'type') return a.type.localeCompare(b.type)
      return 0
    })

    return list
  }, [searchQuery, filterType, sortType, allInstalledPlugins, pluginStates, updateInfo])

  const totalPages = Math.max(1, Math.ceil(filteredPlugins.length / ROWS_PER_PAGE))
  const paginatedPlugins = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE
    return filteredPlugins.slice(start, start + ROWS_PER_PAGE)
  }, [page, filteredPlugins])

  const isAllSelected = paginatedPlugins.length > 0 && paginatedPlugins.every(p => selectedIds.has(p.id))
  const isSomeSelected = paginatedPlugins.some(p => selectedIds.has(p.id))

  /* ─── 事件处理 ─── */
  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedIds(prev => {
        const next = new Set(prev)
        paginatedPlugins.forEach(p => next.delete(p.id))
        return next
      })
    } else {
      setSelectedIds(prev => {
        const next = new Set(prev)
        paginatedPlugins.forEach(p => next.add(p.id))
        return next
      })
    }
  }, [isAllSelected, paginatedPlugins])

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleSingleAction = (plugin: Plugin, action: 'uninstall' | 'disable' | 'enable' | 'update' | 'config') => {
    switch (action) {
      case 'uninstall':
        setConfirmAction({
          pluginIds: [plugin.id],
          action: 'uninstall',
          title: t('pluginManage.confirmUninstall', '确认卸载'),
          content: t('pluginManage.confirmUninstallContent', '确定要卸载该插件吗？此操作不可撤销。'),
          danger: true,
        })
        break
      case 'disable':
        setConfirmAction({
          pluginIds: [plugin.id],
          action: 'disable',
          title: t('pluginManage.confirmDisable', '确认禁用'),
          content: t('pluginManage.confirmDisableContent', '确定要禁用该插件吗？'),
        })
        break
      case 'enable':
        setConfirmAction({
          pluginIds: [plugin.id],
          action: 'enable',
          title: t('pluginManage.confirmEnable', '确认启用'),
          content: t('pluginManage.confirmEnableContent', '确定要启用该插件吗？'),
        })
        break
      case 'update':
        if (plugin.type === 'url') {
          setShowUrlWipModal(true)
        } else {
          const info = updateInfo[plugin.id] || SIMULATED_UPDATES[plugin.id]
          const latestVer = info?.latestVersion || plugin.version
          setUpdateModal({ plugin, selectedVersion: latestVer })
        }
        break
      case 'config':
        if (pluginConfigSchemas[plugin.id]) {
          setConfigConfirm(plugin)
        } else {
          toast.info(t('pluginManage.noConfig', '该插件暂无可配置项'))
        }
        break
    }
  }

  const handleBatchAction = (action: 'uninstall' | 'disable' | 'enable') => {
    const ids = Array.from(selectedIds)
    if (ids.length === 0) return

    const count = ids.length
    switch (action) {
      case 'uninstall':
        setConfirmAction({
          pluginIds: ids,
          action: 'uninstall',
          title: t('pluginManage.batchUninstall', '批量卸载'),
          content: t('pluginManage.batchUninstallContent', { count }),
          danger: true,
        })
        break
      case 'disable':
        setConfirmAction({
          pluginIds: ids,
          action: 'disable',
          title: t('pluginManage.batchDisable', '批量禁用'),
          content: t('pluginManage.batchDisableContent', { count }),
        })
        break
      case 'enable':
        setConfirmAction({
          pluginIds: ids,
          action: 'enable',
          title: t('pluginManage.batchEnable', '批量启用'),
          content: t('pluginManage.batchEnableContent', { count }),
        })
        break
    }
  }

  const executeAction = () => {
    if (!confirmAction) return
    const { pluginIds, action } = confirmAction
    if (action === 'uninstall') {
      toast.success(t('pluginManage.uninstallSuccess', '卸载成功'))
    } else if (action === 'disable') {
      setPluginStates(prev => {
        const next = { ...prev }
        pluginIds.forEach(id => { next[id] = { ...next[id], disabled: true } })
        return next
      })
      toast.success(t('pluginManage.disableSuccess', '已禁用'))
    } else if (action === 'enable') {
      setPluginStates(prev => {
        const next = { ...prev }
        pluginIds.forEach(id => { next[id] = { ...next[id], disabled: false } })
        return next
      })
      toast.success(t('pluginManage.enableSuccess', '已启用'))
    }
    setSelectedIds(prev => {
      const next = new Set(prev)
      pluginIds.forEach(id => next.delete(id))
      return next
    })
    setConfirmAction(null)
  }

  /* 一键获取更新 */
  const handleCheckUpdates = async () => {
    setIsCheckingUpdates(true)
    setCheckUpdateProgress(0)
    const total = allInstalledPlugins.length
    for (let i = 0; i < total; i++) {
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300))
      setCheckUpdateProgress(Math.round(((i + 1) / total) * 100))
    }
    setUpdateInfo(SIMULATED_UPDATES)
    setTimeout(() => {
      setIsCheckingUpdates(false)
      setCheckUpdateProgress(0)
      setShowUpdateResult(true)
    }, 400)
  }

  /* 执行更新 */
  const handleExecuteUpdate = () => {
    if (!updateModal) return
    toast.success(t('pluginManage.updateSuccess', '{{name}} 已更新到 v{{version}}', {
      name: updateModal.plugin.name,
      version: updateModal.selectedVersion,
    }))
    setUpdateModal(null)
  }

  /* 跳转配置页 */
  const handleNavigateConfig = () => {
    if (!configConfirm) return
    navigate(`/plugin-config?plugin=${encodeURIComponent(configConfirm.id)}`)
    setConfigConfirm(null)
  }

  /* 统计 */
  const enabledCount = allInstalledPlugins.filter(p => !(pluginStates[p.id]?.disabled)).length
  const disabledCount = allInstalledPlugins.filter(p => pluginStates[p.id]?.disabled).length
  const npmCount = allInstalledPlugins.filter(p => p.type === 'npm').length
  const urlCount = allInstalledPlugins.filter(p => p.type === 'url').length

  const sortLabels: Record<SortType, string> = {
    name: t('pluginManage.sortName', '名称'),
    updateTime: t('pluginManage.sortUpdate', '更新时间'),
    type: t('pluginManage.sortType', '类型'),
  }

  /* 获取可用版本列表（按 channel 分组） */
  const getUpdateVersions = (pluginId: string) => {
    const info = updateInfo[pluginId] || SIMULATED_UPDATES[pluginId]
    if (!info) return {}
    const grouped: Record<string, { version: string; channel: string }[]> = {}
    for (const v of info.versions) {
      if (!grouped[v.channel]) grouped[v.channel] = []
      grouped[v.channel].push(v)
    }
    return grouped
  }

  return (
    <div className="h-full w-full p-4 flex gap-4 overflow-hidden font-sans">
      {/* ─── 左侧导航卡片 ─── */}
      <Card className="w-64 h-full shrink-0 glass-panel shadow-none rounded-2xl z-20">
        <div className="h-full flex flex-col">
          <div className="p-4 pb-2 shrink-0">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 px-2 mb-1">
              {t('pluginManage.title', '插件管理')}
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 px-2 mb-1">
              {t('pluginManage.subtitle', '管理已安装的插件')}
            </p>
          </div>

          <ScrollShadow className="flex-1 px-3 py-2 space-y-4 scrollbar-hide">
            {/* 状态筛选 */}
            <div className="space-y-1">
              <SidebarFilterItem
                label={t('pluginManage.filterAll', '全部')}
                icon={<Package size={16} />}
                count={allInstalledPlugins.length}
                active={filterType === 'all'}
                onClick={() => { setFilterType('all'); setPage(1) }}
              />
              <SidebarFilterItem
                label={t('pluginManage.filterEnabled', '已启用')}
                icon={<Power size={16} />}
                count={enabledCount}
                active={filterType === 'enabled'}
                onClick={() => { setFilterType('enabled'); setPage(1) }}
              />
              <SidebarFilterItem
                label={t('pluginManage.filterDisabled', '已禁用')}
                icon={<PowerOff size={16} />}
                count={disabledCount}
                active={filterType === 'disabled'}
                onClick={() => { setFilterType('disabled'); setPage(1) }}
              />
              {updatablePlugins.length > 0 && (
                <SidebarFilterItem
                  label={t('pluginManage.updatable', '可更新')}
                  icon={<ArrowUpCircle size={16} />}
                  count={updatablePlugins.length}
                  active={filterType === 'updatable'}
                  onClick={() => { setFilterType('updatable'); setPage(1) }}
                />
              )}
            </div>

            <div className="h-px bg-slate-200/50 dark:bg-slate-700/50 mx-2" />

            {/* 来源筛选 */}
            <div className="space-y-1">
              <div className="px-3 pb-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t('plugins.sources', '来源')}
              </div>
              <SidebarFilterItem
                label="NPM"
                icon={<Package size={16} />}
                count={npmCount}
                active={filterType === 'npm'}
                onClick={() => { setFilterType('npm'); setPage(1) }}
              />
              <SidebarFilterItem
                label={t('pluginManage.filterUrl', '直链')}
                icon={<Download size={16} />}
                count={urlCount}
                active={filterType === 'url'}
                onClick={() => { setFilterType('url'); setPage(1) }}
              />
            </div>
          </ScrollShadow>

          {/* 底部：一键获取更新 */}
          <div className="px-4 py-3 border-t border-slate-200/30 dark:border-slate-700/30 shrink-0">
            <Button
              color="primary"
              className="w-full font-semibold"
              size="sm"
              startContent={<RefreshCw size={14} className={isCheckingUpdates ? 'animate-spin' : ''} />}
              onPress={handleCheckUpdates}
              isDisabled={isCheckingUpdates}
            >
              {isCheckingUpdates
                ? t('pluginManage.checkingUpdates', '检查中...')
                : t('pluginManage.updateAll', '一键获取更新')
              }
            </Button>
            {isCheckingUpdates && (
              <Progress
                size="sm"
                value={checkUpdateProgress}
                color="primary"
                className="mt-2"
                aria-label="Check progress"
              />
            )}
            {updatablePlugins.length > 0 && !isCheckingUpdates && (
              <p className="text-[10px] text-center mt-1.5 text-success-600 dark:text-success-400 font-medium">
                {t('pluginManage.updatableCount', '{{count}} 个插件可更新', { count: updatablePlugins.length })}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* ─── 右侧内容卡片 ─── */}
      <Card className="flex-1 h-full glass-panel shadow-none rounded-2xl overflow-hidden flex flex-col min-w-0">
        {/* 顶部栏：搜索 + 排序 + 批量操作 */}
        <div className="h-14 shrink-0 px-6 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-700/50">
          {/* 左侧：批量操作 或 数量显示 */}
          <div className="flex items-center gap-2 mr-4 shrink-0">
            <AnimatePresence mode="wait">
              {selectedIds.size > 0 ? (
                <motion.div
                  key="batch-actions"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <Chip variant="flat" color="primary" size="sm" className="text-xs font-medium">
                    {t('pluginManage.selectedCount', '已选择 {{count}} 个插件', { count: selectedIds.size })}
                  </Chip>
                  <div className="w-px h-5 bg-default-200" />
                  <Tooltip content={t('pluginManage.batchEnable', '批量启用')}>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      color="success"
                      onPress={() => handleBatchAction('enable')}
                    >
                      <Power size={14} />
                    </Button>
                  </Tooltip>
                  <Tooltip content={t('pluginManage.batchDisable', '批量禁用')}>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      color="warning"
                      onPress={() => handleBatchAction('disable')}
                    >
                      <PowerOff size={14} />
                    </Button>
                  </Tooltip>
                  <Tooltip content={t('pluginManage.batchUninstall', '批量卸载')}>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      color="danger"
                      onPress={() => handleBatchAction('uninstall')}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </Tooltip>
                  <Button
                    size="sm"
                    variant="light"
                    onPress={() => setSelectedIds(new Set())}
                    className="text-xs text-default-500"
                  >
                    {t('pluginManage.clearSelection', '取消选择')}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="count-chip"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Chip variant="flat" color="default" size="sm" className="text-xs">
                    {filteredPlugins.length} / {allInstalledPlugins.length}
                  </Chip>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
            {/* 搜索框 */}
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-default-400" size={16} />
              <input
                type="text"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
                className="w-full h-9 pl-9 pr-4 rounded-xl bg-default-100 border border-default-200 focus:outline-none focus:border-primary text-sm transition-all placeholder:text-default-400"
                placeholder={t('pluginManage.search', '搜索已安装的插件...')}
              />
            </div>

            {/* 排序 */}
            <Dropdown>
              <DropdownTrigger>
                <Button size="sm" variant="flat" endContent={<ChevronDown size={14} />} className="shrink-0">
                  {sortLabels[sortType]}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Sort"
                selectionMode="single"
                selectedKeys={new Set([sortType])}
                onSelectionChange={(keys) => {
                  const key = Array.from(keys)[0] as SortType
                  if (key) setSortType(key)
                }}
              >
                <DropdownItem key="name">{sortLabels.name}</DropdownItem>
                <DropdownItem key="updateTime">{sortLabels.updateTime}</DropdownItem>
                <DropdownItem key="type">{sortLabels.type}</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        {/* 插件列表 */}
        <ScrollShadow className="flex-1 px-6 py-4 scrollbar-hide">
          {/* 全选行 */}
          {paginatedPlugins.length > 0 && (
            <div className="flex items-center gap-3 px-4 py-2 mb-2">
              <Checkbox
                isSelected={isAllSelected}
                isIndeterminate={isSomeSelected && !isAllSelected}
                onValueChange={toggleSelectAll}
                size="sm"
              />
              <span className="text-xs text-default-400 font-medium">
                {isAllSelected
                  ? t('pluginManage.deselectAll', '取消全选')
                  : t('pluginManage.selectAll', '全选当前页')
                }
              </span>
            </div>
          )}

          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {paginatedPlugins.map((plugin, index) => {
                const state = pluginStates[plugin.id]
                const isDisabled = state?.disabled ?? false
                const isSelected = selectedIds.has(plugin.id)
                const pluginUpdate = updateInfo[plugin.id]
                const hasUpdate = !!(pluginUpdate && pluginUpdate.latestVersion !== plugin.version)
                const hasConfig = !!pluginConfigSchemas[plugin.id]

                return (
                  <motion.div
                    key={plugin.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ delay: index * 0.03, type: 'spring', stiffness: 350, damping: 28 }}
                    layout
                  >
                    <div className={`
                      group relative flex items-center gap-5 p-4 rounded-3xl border transition-all duration-300
                      ${isSelected
                        ? 'bg-primary-50/90 dark:bg-primary-500/10 border-primary-200 dark:border-primary-500/30 shadow-md shadow-primary/5'
                        : isDisabled
                          ? 'bg-slate-50/50 dark:bg-zinc-900/20 border-transparent opacity-70 grayscale-[0.5]'
                          : 'bg-white/80 dark:bg-zinc-800/40 hover:bg-white dark:hover:bg-zinc-800 border-transparent hover:border-slate-200 dark:hover:border-zinc-700 hover:shadow-lg hover:shadow-slate-200/20 dark:hover:shadow-black/20 hover:-translate-y-0.5'
                      }
                    `}>
                      {/* 选择框 - Positioned absolutely or nicely aligned */}
                      <Checkbox
                        isSelected={isSelected}
                        onValueChange={() => toggleSelect(plugin.id)}
                        size="md"
                        color="primary"
                        radius="full"
                        className={`shrink-0 transition-opacity duration-200 ${isSomeSelected || isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} focus:opacity-100`}
                      />

                      {/* 图标 - Elegant with ring */}
                      <div className="relative shrink-0">
                        <Avatar
                          src={plugin.icon || plugin.authors.avatarUrl}
                          name={plugin.name.charAt(0)}
                          size="lg"
                          className={`shrink-0 transition-transform duration-300 group-hover:scale-105 ${isDisabled ? 'grayscale' : ''}`}
                          isBordered={false}
                          radius="full"
                        />
                         {/* Status Indicator Dot */}
                        <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-zinc-800 flex items-center justify-center ${
                          isDisabled ? 'bg-default-300' : hasUpdate ? 'bg-orange-400' : 'bg-green-500'
                        }`}>
                          {hasUpdate && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                        </div>
                        {/* Pink Ring Effect (External) */}
                        {!isDisabled && (
                          <div className="absolute -inset-1 rounded-full border border-pink-500/20 scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-spin-slow" style={{ borderStyle: 'dashed' }} />
                        )}
                      </div>

                      {/* 信息区域 (Elegant Layout) */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5 ml-1">
                        {/* Title Row */}
                        <div className="flex items-center gap-3">
                          <h3 className={`font-bold text-base tracking-tight truncate max-w-md ${isDisabled ? 'text-slate-500' : 'text-slate-800 dark:text-slate-100'}`}>
                            {plugin.name}
                          </h3>
                          <div className="flex items-center gap-2">
                             <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                               plugin.type === 'npm' 
                               ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                               : 'bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400'
                             }`}>
                                {plugin.type === 'npm' ? 'NPM' : 'URL'}
                             </span>
                             <span className="text-slate-300 dark:text-zinc-600">|</span>
                             <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
                               v{plugin.version}
                               {hasUpdate && (
                                 <span className="flex items-center gap-1 text-orange-500 font-bold ml-1 animate-pulse">
                                   → v{pluginUpdate!.latestVersion}
                                 </span>
                               )}
                             </span>
                          </div>
                        </div>

                        {/* Description & Meta Row */}
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                           <p className="truncate flex-1 max-w-lg font-medium opacity-80">{plugin.description}</p>
                           <div className="hidden sm:flex items-center gap-1.5 shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                             <div className="w-5 h-px bg-slate-300 dark:bg-zinc-700"></div>
                             <span className="text-[10px] font-semibold uppercase tracking-wider">By {plugin.authors.name}</span>
                           </div>
                        </div>
                      </div>

                      {/* 操作按钮 (Clean & Minimal) */}
                      <div className={`shrink-0 flex items-center gap-1 transition-all duration-300 ${isSelected ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'}`}>
                        <Tooltip content={hasConfig ? t('pluginManage.config', '配置') : t('pluginManage.noConfig', '无配置')} placement="top" delay={0} closeDelay={0}>
                          <Button
                            isIconOnly size="sm" variant="light" radius="full"
                            className={hasConfig ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800' : 'opacity-30 text-slate-400'}
                            onPress={() => handleSingleAction(plugin, 'config')}
                          >
                            <Settings size={18} strokeWidth={2} />
                          </Button>
                        </Tooltip>
                        
                        <Tooltip content={t('plugins.update', '更新')} placement="top" isDisabled={!hasUpdate && plugin.type !== 'url'}>
                           <Button
                            isIconOnly size="sm" variant="light" radius="full"
                            className={hasUpdate ? 'text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20' : 'text-slate-400 hover:text-primary hover:bg-primary-50'}
                             onPress={() => handleSingleAction(plugin, 'update')}
                           >
                              <RefreshCw size={18} strokeWidth={2} className={hasUpdate ? 'animate-spin-once' : ''} />
                           </Button>
                        </Tooltip>

                         <div className="w-px h-4 bg-slate-200 dark:bg-zinc-700 mx-1"></div>

                        <Tooltip content={isDisabled ? t('pluginManage.enable', '启用') : t('pluginManage.disable', '禁用')} placement="top">
                          <Button
                            isIconOnly size="sm" variant={isDisabled ? "flat" : "light"} 
                            color={isDisabled ? "success" : "default"}
                            radius="full"
                            className={isDisabled ? '' : 'text-slate-400 hover:text-warning hover:bg-warning-50'}
                            onPress={() => handleSingleAction(plugin, isDisabled ? 'enable' : 'disable')}
                          >
                            {isDisabled ? <Power size={18} strokeWidth={2.5} /> : <PowerOff size={18} strokeWidth={2} />}
                          </Button>
                        </Tooltip>
                        
                        <Tooltip content={t('plugins.uninstall', '卸载')} placement="top" color="danger">
                          <Button
                            isIconOnly size="sm" variant="light" color="danger" radius="full"
                            className="text-slate-400 hover:text-danger hover:bg-danger-50"
                            onPress={() => handleSingleAction(plugin, 'uninstall')}
                          >
                            <Trash2 size={18} strokeWidth={2} />
                          </Button>
                        </Tooltip>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {filteredPlugins.length === 0 && (
              <div className="text-center py-20 text-default-400">
                <Package size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-sm">{t('pluginManage.noPlugins', '暂无已安装的插件')}</p>
              </div>
            )}
          </div>
        </ScrollShadow>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="shrink-0 px-6 py-3 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center">
            <Pagination
              total={totalPages}
              page={page}
              onChange={setPage}
              color="primary"
              size="sm"
              showControls
            />
          </div>
        )}
      </Card>

      {/* ─── 确认操作弹窗 ─── */}
      <Modal isOpen={!!confirmAction} onOpenChange={() => setConfirmAction(null)} size="sm">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                {confirmAction?.danger && <AlertTriangle size={18} className="text-danger" />}
                {confirmAction?.title}
              </ModalHeader>
              <ModalBody>
                <p className="text-sm text-default-600">{confirmAction?.content}</p>
                {confirmAction && confirmAction.pluginIds.length > 1 && (
                  <div className="mt-2 p-3 bg-default-100 rounded-xl">
                    <p className="text-xs text-default-500 mb-2">{t('pluginManage.affectedPlugins', '涉及的插件：')}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {confirmAction.pluginIds.map(id => {
                        const p = allInstalledPlugins.find(pp => pp.id === id)
                        return p ? (
                          <Chip key={id} size="sm" variant="flat" className="text-[10px]">
                            {p.name}
                          </Chip>
                        ) : null
                      })}
                    </div>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  {t('common.cancel', '取消')}
                </Button>
                <Button
                  color={confirmAction?.danger ? 'danger' : 'primary'}
                  onPress={() => {
                    executeAction()
                    onClose()
                  }}
                >
                  {t('common.confirm', '确认')}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* ─── 检查更新结果弹窗 ─── */}
      <Modal isOpen={showUpdateResult} onOpenChange={() => setShowUpdateResult(false)} size="md">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                {updatablePlugins.length > 0
                  ? <ArrowUpCircle size={18} className="text-success" />
                  : <CheckCircle2 size={18} className="text-success" />
                }
                {t('pluginManage.checkResult', '检查更新结果')}
              </ModalHeader>
              <ModalBody>
                {updatablePlugins.length > 0 ? (
                  <>
                    <p className="text-sm text-default-600 mb-3">
                      {t('pluginManage.updatesFound', '发现 {{count}} 个可更新插件', { count: updatablePlugins.length })}
                    </p>
                    <div className="space-y-2">
                      {updatablePlugins.map(p => {
                        const info = updateInfo[p.id]
                        return (
                          <div key={p.id} className="flex items-center justify-between p-3 bg-success-50/50 dark:bg-success-900/10 rounded-xl border border-success-200/30">
                            <div className="flex items-center gap-3">
                              <Avatar
                                src={p.icon || p.authors.avatarUrl}
                                name={p.name.charAt(0)}
                                size="sm"
                                radius="lg"
                                className="bg-primary-50 text-primary"
                              />
                              <div>
                                <p className="text-sm font-semibold">{p.name}</p>
                                <p className="text-[10px] text-default-400">
                                  v{p.version} → v{info?.latestVersion}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              color="success"
                              variant="flat"
                              onPress={() => {
                                onClose()
                                handleSingleAction(p, 'update')
                              }}
                            >
                              {t('plugins.update', '更新')}
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <CheckCircle2 size={48} className="mx-auto mb-3 text-success opacity-60" />
                    <p className="text-sm text-default-600 font-medium">
                      {t('pluginManage.noUpdates', '当前所有插件均已达到最新版本')}
                    </p>
                    <p className="text-xs text-default-400 mt-1">
                      {t('pluginManage.noUpdatesDesc', '没有找到可更新的插件')}
                    </p>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  {t('common.confirm', '确认')}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* ─── 单个更新版本选择弹窗 (仅 NPM) ─── */}
      <Modal isOpen={!!updateModal} onOpenChange={() => setUpdateModal(null)} size="lg">
        <ModalContent>
          {(onClose) => {
            const versions = updateModal ? getUpdateVersions(updateModal.plugin.id) : {}
            return (
              <>
                <ModalHeader className="flex items-center gap-2">
                  <RefreshCw size={18} className="text-primary" />
                  {t('pluginManage.updatePlugin', '更新插件')} - {updateModal?.plugin.name}
                </ModalHeader>
                <ModalBody>
                  {/* 当前版本 → 目标版本 */}
                  <div className="flex items-center gap-4 p-3 bg-default-100 rounded-xl mb-4">
                    <div className="text-sm">
                      <span className="text-default-500">{t('pluginManage.currentVersion', '当前版本')}：</span>
                      <Chip size="sm" variant="flat" color="default" className="ml-1">
                        v{updateModal?.plugin.version}
                      </Chip>
                    </div>
                    <span className="text-default-300">→</span>
                    <div className="text-sm">
                      <span className="text-default-500">{t('pluginManage.targetVersion', '目标版本')}：</span>
                      <Chip size="sm" variant="flat" color="success" className="ml-1">
                        v{updateModal?.selectedVersion}
                      </Chip>
                    </div>
                  </div>

                  <p className="text-xs text-default-500 mb-3">
                    {t('pluginManage.selectVersion', '选择目标版本')}
                  </p>

                  {/* 版本列表（按 channel 分组） */}
                  <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-1 scrollbar-hide">
                    {CHANNEL_ORDER.map(channel => {
                      const channelVersions = versions[channel]
                      if (!channelVersions || channelVersions.length === 0) return null
                      const cInfo = CHANNEL_INFO[channel]
                      return (
                        <div key={channel}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm">{cInfo.icon}</span>
                            <span className="text-xs font-semibold text-default-600">{cInfo.label}</span>
                          </div>
                          <div className="space-y-1 pl-6">
                            {channelVersions.map(v => {
                              const info = updateInfo[updateModal?.plugin.id || ''] || SIMULATED_UPDATES[updateModal?.plugin.id || '']
                              const isLatest = v.version === info?.latestVersion
                              const isCurrent = v.version === updateModal?.plugin.version
                              const isCurrentSelection = v.version === updateModal?.selectedVersion

                              return (
                                <button
                                  key={v.version}
                                  onClick={() =>
                                    setUpdateModal(prev => prev ? { ...prev, selectedVersion: v.version } : null)
                                  }
                                  className={`
                                    w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all
                                    ${isCurrentSelection
                                      ? 'bg-primary-100 dark:bg-primary-900/20 border border-primary-300 dark:border-primary-700 text-primary font-medium'
                                      : 'bg-default-50 hover:bg-default-100 border border-transparent text-default-600'
                                    }
                                  `}
                                >
                                  <span>v{v.version}</span>
                                  <div className="flex items-center gap-2">
                                    {isLatest && (
                                      <Chip size="sm" variant="flat" color="success" className="text-[10px] h-4">
                                        {t('pluginManage.latest', '最新')}
                                      </Chip>
                                    )}
                                    {isCurrent && (
                                      <Chip size="sm" variant="flat" color="default" className="text-[10px] h-4">
                                        {t('pluginManage.current', '当前')}
                                      </Chip>
                                    )}
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={onClose}>
                    {t('common.cancel', '取消')}
                  </Button>
                  <Button
                    color="primary"
                    onPress={handleExecuteUpdate}
                    isDisabled={updateModal?.selectedVersion === updateModal?.plugin.version}
                  >
                    {t('pluginManage.updateTo', '更新到')} v{updateModal?.selectedVersion}
                  </Button>
                </ModalFooter>
              </>
            )
          }}
        </ModalContent>
      </Modal>

      {/* ─── URL 更新施工中弹窗 ─── */}
      <Modal isOpen={showUrlWipModal} onOpenChange={() => setShowUrlWipModal(false)} size="sm">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <Construction size={18} className="text-warning" />
                {t('pluginManage.urlUpdateWip', 'URL 插件版本管理')}
              </ModalHeader>
              <ModalBody>
                <div className="text-center py-4">
                  <Construction size={48} className="mx-auto mb-3 text-warning opacity-60" />
                  <p className="text-sm text-default-600">
                    {t('pluginManage.urlUpdateWipDesc', 'URL 插件的版本管理功能正在开发中，敬请期待...')}
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  {t('common.confirm', '确认')}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* ─── 配置跳转确认弹窗 ─── */}
      <Modal isOpen={!!configConfirm} onOpenChange={() => setConfigConfirm(null)} size="sm">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <Settings size={18} className="text-primary" />
                {t('pluginManage.jumpToConfig', '跳转配置')}
              </ModalHeader>
              <ModalBody>
                <p className="text-sm text-default-600">
                  {t('pluginManage.confirmJumpConfig', '是否跳转到 {{name}} 的配置页面？', { name: configConfirm?.name })}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  {t('common.cancel', '取消')}
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleNavigateConfig()
                    onClose()
                  }}
                >
                  {t('common.confirm', '确认')}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

/** Sidebar filter item component */
function SidebarFilterItem ({ label, icon, count, active, onClick }: {
  label: string
  icon: React.ReactNode
  count?: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group text-left
        ${active
          ? 'bg-white dark:bg-white/10 shadow-sm text-slate-800 dark:text-slate-100 border border-white/50 dark:border-white/20'
          : 'text-slate-500 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-white/5 border border-transparent'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <span className={active ? 'text-primary' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400'}>
          {icon}
        </span>
        <span>{label}</span>
      </div>
      {count !== undefined && (
        <span className={`
          text-[10px] px-1.5 py-0.5 rounded-md font-bold transition-colors
          ${active
            ? 'bg-primary-100 dark:bg-primary-800/30 text-primary'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'
          }
        `}>
          {count}
        </span>
      )}
    </button>
  )
}
