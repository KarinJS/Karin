import { useState, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
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
} from 'lucide-react'
import type { Plugin } from '../types/plugin'
import { mockPlugins } from '../mocks/plugins'

/** 本地管理状态（模拟） */
interface PluginState {
  disabled: boolean
}

type FilterType = 'all' | 'enabled' | 'disabled' | 'npm' | 'url'
type SortType = 'name' | 'updateTime' | 'type'

const ROWS_PER_PAGE = 10

export function PluginManage () {
  const { t } = useTranslation()
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
  const [confirmAction, setConfirmAction] = useState<{
    pluginIds: string[]
    action: 'uninstall' | 'disable' | 'enable'
    title: string
    content: string
    danger?: boolean
  } | null>(null)
  const [isUpdatingAll, setIsUpdatingAll] = useState(false)
  const [updateProgress, setUpdateProgress] = useState(0)

  // 只展示已安装的插件
  const allInstalledPlugins = useMemo(() => {
    return mockPlugins.filter(p => p.installed)
  }, [])

  // Filter + Search + Sort
  const filteredPlugins = useMemo(() => {
    let list = allInstalledPlugins

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.authors.name.toLowerCase().includes(q)
      )
    }

    // Filter
    if (filterType === 'enabled') {
      list = list.filter(p => !(pluginStates[p.id]?.disabled))
    } else if (filterType === 'disabled') {
      list = list.filter(p => pluginStates[p.id]?.disabled)
    } else if (filterType === 'npm') {
      list = list.filter(p => p.type === 'npm')
    } else if (filterType === 'url') {
      list = list.filter(p => p.type === 'url')
    }

    // Sort
    list = [...list].sort((a, b) => {
      if (sortType === 'name') return a.name.localeCompare(b.name)
      if (sortType === 'updateTime') return new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime()
      if (sortType === 'type') return a.type.localeCompare(b.type)
      return 0
    })

    return list
  }, [searchQuery, filterType, sortType, allInstalledPlugins, pluginStates])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredPlugins.length / ROWS_PER_PAGE))
  const paginatedPlugins = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE
    return filteredPlugins.slice(start, start + ROWS_PER_PAGE)
  }, [page, filteredPlugins])

  // Batch selection
  const isAllSelected = paginatedPlugins.length > 0 && paginatedPlugins.every(p => selectedIds.has(p.id))
  const isSomeSelected = paginatedPlugins.some(p => selectedIds.has(p.id))

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

  // Actions
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
        // TODO: 对接真实更新逻辑
        break
      case 'config':
        // TODO: 跳转到配置页面或打开配置弹窗
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
          title: t('pluginManage.batchUninstall'),
          content: t('pluginManage.batchUninstallContent', { count }),
          danger: true,
        })
        break
      case 'disable':
        setConfirmAction({
          pluginIds: ids,
          action: 'disable',
          title: t('pluginManage.batchDisable'),
          content: t('pluginManage.batchDisableContent', { count }),
        })
        break
      case 'enable':
        setConfirmAction({
          pluginIds: ids,
          action: 'enable',
          title: t('pluginManage.batchEnable'),
          content: t('pluginManage.batchEnableContent', { count }),
        })
        break
    }
  }

  const executeAction = () => {
    if (!confirmAction) return
    const { pluginIds, action } = confirmAction
    if (action === 'uninstall') {
      console.log('Uninstall:', pluginIds)
    } else if (action === 'disable') {
      setPluginStates(prev => {
        const next = { ...prev }
        pluginIds.forEach(id => { next[id] = { ...next[id], disabled: true } })
        return next
      })
    } else if (action === 'enable') {
      setPluginStates(prev => {
        const next = { ...prev }
        pluginIds.forEach(id => { next[id] = { ...next[id], disabled: false } })
        return next
      })
    }
    setSelectedIds(prev => {
      const next = new Set(prev)
      pluginIds.forEach(id => next.delete(id))
      return next
    })
    setConfirmAction(null)
  }

  // One-click update all
  const handleUpdateAll = async () => {
    setIsUpdatingAll(true)
    setUpdateProgress(0)
    const total = allInstalledPlugins.length
    for (let i = 0; i < total; i++) {
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400))
      setUpdateProgress(Math.round(((i + 1) / total) * 100))
    }
    setTimeout(() => {
      setIsUpdatingAll(false)
      setUpdateProgress(0)
    }, 600)
  }

  // Stats
  const enabledCount = allInstalledPlugins.filter(p => !(pluginStates[p.id]?.disabled)).length
  const disabledCount = allInstalledPlugins.filter(p => pluginStates[p.id]?.disabled).length
  const npmCount = allInstalledPlugins.filter(p => p.type === 'npm').length
  const urlCount = allInstalledPlugins.filter(p => p.type === 'url').length

  const sortLabels: Record<SortType, string> = {
    name: t('pluginManage.sortName', '名称'),
    updateTime: t('pluginManage.sortUpdate', '更新时间'),
    type: t('pluginManage.sortType', '类型'),
  }

  return (
    <div className="h-full w-full p-4 flex gap-4 overflow-hidden font-sans">
      {/* 左侧导航卡片 */}
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
          {/* Filter Groups */}
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
          </div>

          <div className="h-px bg-slate-200/50 dark:bg-slate-700/50 mx-2" />

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

          {/* Sidebar Footer - Update All */}
          <div className="px-4 py-3 border-t border-slate-200/30 dark:border-slate-700/30 shrink-0">
            <Button
              color="primary"
              className="w-full font-semibold"
              size="sm"
              startContent={<RefreshCw size={14} className={isUpdatingAll ? 'animate-spin' : ''} />}
              onPress={handleUpdateAll}
              isDisabled={isUpdatingAll}
            >
              {isUpdatingAll
                ? t('pluginManage.updating', '更新中...')
                : t('pluginManage.updateAll', '一键获取更新')
              }
            </Button>
            {isUpdatingAll && (
              <Progress
                size="sm"
                value={updateProgress}
                color="primary"
                className="mt-2"
                aria-label="Update progress"
              />
            )}
          </div>
        </div>
      </Card>

      {/* 右侧内容卡片 */}
      <Card className="flex-1 h-full glass-panel shadow-none rounded-2xl overflow-hidden flex flex-col min-w-0">
        {/* Header Bar */}
        <div className="h-14 shrink-0 px-6 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-3 flex-1">
            {/* Search */}
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

            {/* Sort */}
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

          {/* Right side info */}
          <div className="flex items-center gap-2 ml-4">
            <Chip variant="flat" color="default" size="sm" className="text-xs">
              {filteredPlugins.length} / {allInstalledPlugins.length}
            </Chip>
          </div>
        </div>

        {/* Batch Action Bar */}
        <AnimatePresence>
          {selectedIds.size > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-b border-default-200 bg-primary-50/50 dark:bg-primary-900/10"
            >
              <div className="px-6 py-2.5 flex items-center justify-between">
                <span className="text-sm text-primary font-medium">
                  {t('pluginManage.selectedCount', { count: selectedIds.size })}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    color="success"
                    startContent={<Power size={14} />}
                    onPress={() => handleBatchAction('enable')}
                  >
                    {t('pluginManage.batchEnable', '批量启用')}
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    color="warning"
                    startContent={<PowerOff size={14} />}
                    onPress={() => handleBatchAction('disable')}
                  >
                    {t('pluginManage.batchDisable', '批量禁用')}
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    color="danger"
                    startContent={<Trash2 size={14} />}
                    onPress={() => handleBatchAction('uninstall')}
                  >
                    {t('pluginManage.batchUninstall', '批量卸载')}
                  </Button>
                  <Button
                    size="sm"
                    variant="light"
                    onPress={() => setSelectedIds(new Set())}
                  >
                    {t('pluginManage.clearSelection', '取消选择')}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Plugin List */}
        <ScrollShadow className="flex-1 px-6 py-4 scrollbar-hide">
          {/* Select All Row */}
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
                      flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all duration-300
                      ${isSelected
                        ? 'border-primary-500 bg-primary-50/80 dark:bg-primary-500/10 shadow-md shadow-primary/20'
                        : isDisabled
                          ? 'bg-default-100/50 border-default-200/60 opacity-60 grayscale-[0.8]'
                          : 'bg-content1 border-default-200 hover:border-primary-300/50 hover:shadow-lg hover:shadow-default-200/20 hover:-translate-y-0.5'
                      }
                    `}>
                      {/* Checkbox */}
                      <Checkbox
                        isSelected={isSelected}
                        onValueChange={() => toggleSelect(plugin.id)}
                        size="sm"
                        className="shrink-0"
                      />

                      {/* Icon */}
                      <Avatar
                        src={plugin.icon || plugin.authors.avatarUrl}
                        name={plugin.name.charAt(0)}
                        size="md"
                        className="bg-primary-50 text-primary shrink-0"
                        radius="lg"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className={`font-bold text-sm truncate ${isDisabled ? 'text-default-400' : 'text-foreground'}`}>
                            {plugin.name}
                          </h3>
                          <Chip size="sm" variant="flat" className="text-[10px] h-5" color={isDisabled ? 'default' : 'primary'}>
                            v{plugin.version}
                          </Chip>
                          <Chip size="sm" variant="dot" color={plugin.type === 'npm' ? 'danger' : 'secondary'} className="text-[10px] h-5">
                            {plugin.type === 'npm' ? 'NPM' : 'URL'}
                          </Chip>
                          {isDisabled && (
                            <Chip size="sm" variant="flat" color="warning" className="text-[10px] h-5">
                              {t('pluginManage.disabled', '已禁用')}
                            </Chip>
                          )}
                        </div>
                        <p className="text-xs text-default-400 truncate">{plugin.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-default-300">{plugin.authors.name}</span>
                          <span className="w-0.5 h-0.5 rounded-full bg-default-300" />
                          <span className="text-[10px] text-default-300">
                            {t('plugins.updated', '更新于')} {new Date(plugin.updateTime).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Actions - 保留原有按钮样式 */}
                      <div className="shrink-0 flex items-center gap-1.5">
                        <Tooltip content={t('pluginManage.config', '管理配置')} placement="top">
                          <Button
                            isIconOnly size="sm" variant="flat" color="default" radius="lg"
                            onPress={() => handleSingleAction(plugin, 'config')}
                          >
                            <Settings size={15} />
                          </Button>
                        </Tooltip>
                        <Tooltip content={t('plugins.update', '更新')} placement="top">
                          <Button
                            isIconOnly size="sm" variant="flat" color="primary" radius="lg"
                            onPress={() => handleSingleAction(plugin, 'update')}
                          >
                            <RefreshCw size={15} />
                          </Button>
                        </Tooltip>
                        <Tooltip content={isDisabled ? t('pluginManage.enable', '启用') : t('pluginManage.disable', '禁用')} placement="top">
                          <Button
                            isIconOnly size="sm" variant="flat"
                            color={isDisabled ? 'success' : 'warning'} radius="lg"
                            onPress={() => handleSingleAction(plugin, isDisabled ? 'enable' : 'disable')}
                          >
                            {isDisabled ? <Power size={15} /> : <PowerOff size={15} />}
                          </Button>
                        </Tooltip>
                        <Tooltip content={t('plugins.uninstall', '卸载')} placement="top">
                          <Button
                            isIconOnly size="sm" variant="flat" color="danger" radius="lg"
                            onPress={() => handleSingleAction(plugin, 'uninstall')}
                          >
                            <Trash2 size={15} />
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

        {/* Pagination */}
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

      {/* Confirm Modal */}
      <Modal
        isOpen={!!confirmAction}
        onOpenChange={() => setConfirmAction(null)}
        size="sm"
      >
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
