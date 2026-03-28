import { useEffect, useMemo, useRef, useState } from 'react'
import { Breadcrumbs, Button, Card, Checkbox, CheckboxGroup, Input, Pagination, Spinner, Tooltip } from '@heroui/react'
import { format } from 'date-fns'
import { gsap } from 'gsap'
import { FiChevronLeft, FiClipboard, FiCopy, FiFolderPlus, FiRefreshCcw, FiSearch, FiUploadCloud, FiX } from 'react-icons/fi'
import type { FileSystemItem } from '../types'
import { formatFileSize, splitPathSegments } from '../utils'
import { FilePreviewThumbnail } from './FilePreviewThumbnail'

/**
 * 文件列表面板属性
 */
interface FileListPanelProps {
  /** 当前目录 */
  currentDirectory: string
  /** 文件列表 */
  items: FileSystemItem[]
  /** 是否加载中 */
  loading: boolean
  /** 目录大小缓存 */
  directorySizeMap: Record<string, number>
  /** 返回上级 */
  onGoParent: () => void
  /** 面包屑跳转 */
  onNavigateBreadcrumb: (index: number) => void
  /** 切换目录 */
  onOpenDirectory: (item: FileSystemItem) => void
  /** 打开编辑器 */
  onOpenEditor: (item: FileSystemItem) => void
  /** 计算目录大小 */
  onComputeDirectorySize: (item: FileSystemItem) => void
  /** 已选中的文件路径 */
  selectedItemPaths: string[]
  /** 已选中路径变化 */
  onChangeSelectedItemPaths: (selectedItemPaths: string[]) => void
  /** 粘贴已复制项 */
  onPasteCopiedItems: () => void
  /** 清空已复制项 */
  onClearCopiedItems: () => void
  /** 复制当前路径 */
  onCopyCurrentPath: () => void
  /** 刷新文件列表 */
  onRefreshList: () => void
  /** 已复制项数量 */
  copiedItemCount: number
  /** 容器自定义类名 */
  className?: string
  /** 是否启用滚动列表 */
  scrollable?: boolean
}

/**
 * 可排序字段
 */
type SortField = 'name' | 'size' | 'modifiedTimestamp'

/**
 * 排序方向
 */
type SortDirection = 'asc' | 'desc'

/**
 * 列表排序状态
 */
interface FileListSortState {
  /** 当前排序字段 */
  field: SortField | null
  /** 当前排序方向 */
  direction: SortDirection | null
}

/**
 * 文件列表面板
 * @param props 面板属性
 * @returns 面板节点
 */
export const FileListPanel = (props: FileListPanelProps) => {
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [createMenuOpen, setCreateMenuOpen] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [sortState, setSortState] = useState<FileListSortState>({ field: null, direction: null })
  const [panelMaxHeight, setPanelMaxHeight] = useState<number>(560)
  const [chromeHeight, setChromeHeight] = useState<number>(300)
  const createMenuCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const topSectionRef = useRef<HTMLDivElement | null>(null)
  const tableHeaderRef = useRef<HTMLDivElement | null>(null)
  const paginationSlotRef = useRef<HTMLDivElement | null>(null)
  const clipboardActionsRef = useRef<HTMLDivElement | null>(null)

  /**
   * 同步布局尺寸
   * @returns void
   */
  const syncLayoutMetrics = (): void => {
    if (!panelRef.current) {
      return
    }
    const panelTop = panelRef.current.getBoundingClientRect().top
    const parentBottom = panelRef.current.parentElement?.getBoundingClientRect().bottom ?? window.innerHeight
    const availableBottom = Math.min(window.innerHeight, parentBottom)
    const nextHeight = Math.max(360, Math.floor(availableBottom - panelTop))
    setPanelMaxHeight(nextHeight)
    const topHeight = Math.ceil(topSectionRef.current?.getBoundingClientRect().height || 0)
    const headerHeight = Math.ceil(tableHeaderRef.current?.getBoundingClientRect().height || 0)
    const paginationHeight = Math.ceil(paginationSlotRef.current?.getBoundingClientRect().height || 64)
    setChromeHeight(topHeight + headerHeight + paginationHeight)
  }

  /**
   * 监听窗口变化并同步卡片高度
   * @returns void
   */
  useEffect(() => {
    syncLayoutMetrics()
    window.addEventListener('resize', syncLayoutMetrics)
    return () => {
      window.removeEventListener('resize', syncLayoutMetrics)
    }
  }, [])

  /**
   * 列表结构变化时同步布局尺寸
   * @returns void
   */
  useEffect(() => {
    syncLayoutMetrics()
  }, [props.currentDirectory, props.items.length])

  /**
   * 管理顶部粘贴操作动画
   * @returns void
   */
  useEffect(() => {
    if (!clipboardActionsRef.current) {
      return
    }
    gsap.killTweensOf(clipboardActionsRef.current)
    if (props.copiedItemCount > 0) {
      gsap.to(clipboardActionsRef.current, { width: 'auto', autoAlpha: 1, duration: 0.24, ease: 'power2.out' })
      return
    }
    gsap.to(clipboardActionsRef.current, { width: 0, autoAlpha: 0, duration: 0.2, ease: 'power2.inOut' })
  }, [props.copiedItemCount])

  /**
   * 取消下拉菜单延时关闭
   * @returns void
   */
  const cancelCreateMenuClose = (): void => {
    if (!createMenuCloseTimerRef.current) {
      return
    }
    clearTimeout(createMenuCloseTimerRef.current)
    createMenuCloseTimerRef.current = null
  }

  /**
   * 延迟关闭新建菜单
   * @returns void
   */
  const scheduleCreateMenuClose = (): void => {
    cancelCreateMenuClose()
    createMenuCloseTimerRef.current = setTimeout(() => {
      setCreateMenuOpen(false)
    }, 180)
  }

  /**
   * 过滤后的文件列表
   */
  const filteredItems = useMemo<FileSystemItem[]>(() => {
    const normalized = searchKeyword.trim().toLowerCase()
    if (!normalized) {
      return props.items
    }
    return props.items.filter((item) => item.name.toLowerCase().includes(normalized))
  }, [props.items, searchKeyword])

  /**
   * 计算指定字段的下一步排序状态（三态：正序 -> 倒序 -> 复原）
   * @param targetField 目标排序字段
   * @returns 下一步排序状态
   */
  const resolveNextSortState = (targetField: SortField): FileListSortState => {
    if (sortState.field !== targetField || !sortState.direction) {
      return {
        field: targetField,
        direction: 'asc'
      }
    }
    if (sortState.direction === 'asc') {
      return {
        field: targetField,
        direction: 'desc'
      }
    }
    return {
      field: null,
      direction: null
    }
  }

  /**
   * 切换指定字段排序状态
   * @param targetField 目标排序字段
   * @returns void
   */
  const toggleSortByField = (targetField: SortField): void => {
    setSortState(resolveNextSortState(targetField))
  }

  /**
   * 获取排序字段文案
   * @param field 排序字段
   * @returns 字段文案
   */
  const resolveSortFieldLabel = (field: SortField): string => {
    const fieldLabelMap: Record<SortField, string> = {
      name: '名称',
      size: '大小',
      modifiedTimestamp: '修改时间'
    }
    return fieldLabelMap[field]
  }

  /**
   * 获取排序按钮提示文案（描述下一步动作）
   * @param targetField 目标排序字段
   * @returns 提示文案
   */
  const resolveSortTooltipText = (targetField: SortField): string => {
    const nextSortState = resolveNextSortState(targetField)
    const label = resolveSortFieldLabel(targetField)
    if (!nextSortState.field || !nextSortState.direction) {
      return `取消${label}排序`
    }
    return nextSortState.direction === 'asc' ? `${label}按正序排序` : `${label}按倒序排序`
  }

  /**
   * 获取排序按钮显示文案（展示当前状态）
   * @param targetField 目标排序字段
   * @returns 显示文案
   */
  const resolveSortButtonLabel = (targetField: SortField): string => {
    const label = resolveSortFieldLabel(targetField)
    if (sortState.field !== targetField || !sortState.direction) {
      return label
    }
    return sortState.direction === 'asc' ? `${label} ↑` : `${label} ↓`
  }

  /**
   * 应用排序后的文件列表
   */
  const sortedItems = useMemo<FileSystemItem[]>(() => {
    if (!sortState.field || !sortState.direction) {
      return filteredItems
    }
    const sorted = [...filteredItems]
    const factor = sortState.direction === 'asc' ? 1 : -1
    sorted.sort((leftItem, rightItem) => {
      if (sortState.field === 'name') {
        return leftItem.name.localeCompare(rightItem.name, 'zh-Hans-CN', { numeric: true, sensitivity: 'base' }) * factor
      }
      if (sortState.field === 'size') {
        return (leftItem.size - rightItem.size) * factor
      }
      return (leftItem.modifiedTimestamp - rightItem.modifiedTimestamp) * factor
    })
    return sorted
  }, [filteredItems, sortState.direction, sortState.field])

  /**
   * 按动态高度推导每页条数
   */
  const pageSize = useMemo<number>(() => {
    const rowHeight = 64
    const availableListHeight = Math.max(120, panelMaxHeight - chromeHeight)
    const clippingSafetyBuffer = 32
    return Math.max(1, Math.floor((availableListHeight - clippingSafetyBuffer) / rowHeight))
  }, [panelMaxHeight, chromeHeight])

  /**
   * 总页数
   */
  const totalPages = useMemo<number>(() => {
    return Math.max(1, Math.ceil(filteredItems.length / pageSize))
  }, [filteredItems.length, pageSize])

  /**
   * 是否显示分页
   */
  const shouldShowPagination = useMemo<boolean>(() => {
    return totalPages > 1
  }, [totalPages])

  /**
   * 当前页数据
   */
  const pagedItems = useMemo<FileSystemItem[]>(() => {
    const start = (currentPage - 1) * pageSize
    return sortedItems.slice(start, start + pageSize)
  }, [currentPage, pageSize, sortedItems])
  const selectedPathSet = useMemo<Set<string>>(() => {
    return new Set(props.selectedItemPaths)
  }, [props.selectedItemPaths])
  const filteredItemPaths = useMemo<string[]>(() => {
    return filteredItems.map((item) => item.relativePath)
  }, [filteredItems])
  const selectedFilteredCount = useMemo<number>(() => {
    return filteredItemPaths.filter((path) => selectedPathSet.has(path)).length
  }, [filteredItemPaths, selectedPathSet])
  const allFilteredSelected = useMemo<boolean>(() => {
    return filteredItemPaths.length > 0 && selectedFilteredCount === filteredItemPaths.length
  }, [filteredItemPaths.length, selectedFilteredCount])
  const indeterminateSelectAll = useMemo<boolean>(() => {
    return selectedFilteredCount > 0 && !allFilteredSelected
  }, [allFilteredSelected, selectedFilteredCount])

  /**
   * 分页变化时校正当前页
   * @returns void
   */
  useEffect(() => {
    if (currentPage <= totalPages) {
      return
    }
    setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  /**
   * 过滤条件变化时重置分页
   * @returns void
   */
  useEffect(() => {
    setCurrentPage(1)
  }, [searchKeyword, props.currentDirectory, props.items, pageSize])

  /**
   * 生成页码序列（含省略号）
   * @param page 当前页
   * @param maxPage 总页数
   * @returns 页码与省略号序列
   */
  const buildPaginationTokens = (page: number, maxPage: number): Array<number | 'ellipsis'> => {
    if (maxPage <= 7) {
      return Array.from({ length: maxPage }, (_value, index) => index + 1)
    }
    const tokens: Array<number | 'ellipsis'> = [1]
    if (page > 3) {
      tokens.push('ellipsis')
    }
    const start = Math.max(2, page - 1)
    const end = Math.min(maxPage - 1, page + 1)
    for (let cursor = start; cursor <= end; cursor += 1) {
      tokens.push(cursor)
    }
    if (page < maxPage - 2) {
      tokens.push('ellipsis')
    }
    tokens.push(maxPage)
    return tokens
  }

  /**
   * 面包屑数组
   */
  const breadcrumbSegments = useMemo<string[]>(() => {
    return splitPathSegments(props.currentDirectory)
  }, [props.currentDirectory])
  const syncSelectedPaths = (nextSelectedPaths: string[]): void => {
    props.onChangeSelectedItemPaths(nextSelectedPaths)
  }

  /**
   * 切换某个条目的选中状态
   * @param item 条目
   * @returns void
   */
  const toggleItemSelection = (item: FileSystemItem): void => {
    if (selectedPathSet.has(item.relativePath)) {
      syncSelectedPaths(props.selectedItemPaths.filter((path) => path !== item.relativePath))
      return
    }
    syncSelectedPaths([...props.selectedItemPaths, item.relativePath])
  }

  const toggleSelectAll = (isSelected: boolean): void => {
    if (isSelected) {
      const mergedPathSet = new Set<string>([...props.selectedItemPaths, ...filteredItemPaths])
      syncSelectedPaths(Array.from(mergedPathSet))
      return
    }
    const filteredPathSet = new Set<string>(filteredItemPaths)
    syncSelectedPaths(props.selectedItemPaths.filter((path) => !filteredPathSet.has(path)))
  }
  return (
    <Card
      ref={panelRef}
      style={{ height: shouldShowPagination ? `${panelMaxHeight}px` : 'auto', maxHeight: `${panelMaxHeight}px` }}
      className={`bg-surface overflow-hidden rounded-2xl ${props.className || ''}`}
    >
      <Card.Content className={`p-0 flex flex-col gap-0 ${props.scrollable ? 'h-full min-h-0' : ''}`}>
        <div ref={topSectionRef} className="px-6 py-4 bg-background/90 space-y-3 rounded-t-xl">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 rounded-xl bg-surface-secondary px-2 py-1.5">
              <Tooltip delay={0}>
                <Button isIconOnly variant="ghost" size="sm" onPress={props.onGoParent} isDisabled={!props.currentDirectory}>
                  <FiChevronLeft size={16} />
                </Button>
                <Tooltip.Content><p>返回上级</p></Tooltip.Content>
              </Tooltip>

              <Tooltip delay={0}>
                <Button isIconOnly variant="ghost" size="sm">
                  <FiUploadCloud size={16} />
                </Button>
                <Tooltip.Content><p>上传文件</p></Tooltip.Content>
              </Tooltip>

              <Tooltip delay={0}>
                <Button isIconOnly variant="ghost" size="sm" onPress={props.onRefreshList}>
                  <FiRefreshCcw size={15} />
                </Button>
                <Tooltip.Content><p>刷新列表</p></Tooltip.Content>
              </Tooltip>

              <div
                className="relative"
                onMouseEnter={() => {
                  cancelCreateMenuClose()
                  setCreateMenuOpen(true)
                }}
                onMouseLeave={scheduleCreateMenuClose}
              >
                <Button size="sm" variant="secondary">
                  <FiFolderPlus size={14} />
                  新建
                </Button>
                {createMenuOpen && (
                  <div
                    className="absolute top-full mt-1 left-0 z-30 w-40 rounded-xl border border-border bg-surface shadow-lg p-1"
                    onMouseEnter={cancelCreateMenuClose}
                    onMouseLeave={scheduleCreateMenuClose}
                  >
                    <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-secondary text-sm">新建文件夹</button>
                    <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-secondary text-sm">新建文件</button>
                  </div>
                )}
              </div>

              <div ref={clipboardActionsRef} className="overflow-hidden w-0 opacity-0 flex items-center gap-1 whitespace-nowrap">
                <>
                  <Button size="sm" variant="secondary" onPress={props.onPasteCopiedItems}>
                    <FiClipboard size={14} />
                    粘贴
                  </Button>
                  <Tooltip delay={0}>
                    <Button isIconOnly size="sm" variant="ghost" className="size-8 min-w-8" onPress={props.onClearCopiedItems}>
                      <FiX size={14} />
                    </Button>
                    <Tooltip.Content><p>取消粘贴</p></Tooltip.Content>
                  </Tooltip>
                </>
              </div>
            </div>

            <div className="w-96 h-11 rounded-xl border border-border bg-surface-secondary flex items-center px-3 gap-2">
              <FiSearch className="text-default-400 shrink-0" />
              <Input value={searchKeyword} onChange={(event) => setSearchKeyword(event.target.value)} className="w-full" placeholder="搜索文件..." />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-default-500 overflow-x-auto hide-scrollbar">
            <Breadcrumbs>
              <Breadcrumbs.Item onPress={() => props.onNavigateBreadcrumb(-1)}>
                karin
              </Breadcrumbs.Item>
              {breadcrumbSegments.map((segment, index) => (
                <Breadcrumbs.Item key={`${segment}-${index}`} onPress={() => props.onNavigateBreadcrumb(index)}>
                  {segment}
                </Breadcrumbs.Item>
              ))}
            </Breadcrumbs>
            <Tooltip delay={0}>
              <Button size="sm" isIconOnly variant="ghost" onPress={props.onCopyCurrentPath}>
                <FiCopy size={14} />
              </Button>
              <Tooltip.Content><p>复制路径</p></Tooltip.Content>
            </Tooltip>
          </div>
        </div>

        <div ref={tableHeaderRef} className="grid grid-cols-[44px_32px_minmax(0,1fr)_160px_190px] px-6 py-3 border-b border-border text-sm text-foreground font-semibold bg-background/90">
          <div className="flex items-center justify-center">
            <Checkbox
              isSelected={allFilteredSelected}
              isIndeterminate={indeterminateSelectAll}
              onChange={toggleSelectAll}
              aria-label="全选当前列表"
              className="m-0 p-0 gap-0 items-center justify-center leading-none"
            >
              <Checkbox.Control className="size-5" onClick={(event) => event.stopPropagation()}>
                <Checkbox.Indicator />
              </Checkbox.Control>
            </Checkbox>
          </div>
          <span />
          <div className="min-w-0">
            <Tooltip delay={0}>
              <Button
                size="sm"
                variant="ghost"
                className="h-auto min-w-0 px-0 py-0 text-sm font-semibold text-foreground hover:text-accent"
                onPress={() => toggleSortByField('name')}
              >
                {resolveSortButtonLabel('name')}
              </Button>
              <Tooltip.Content>
                <p>{resolveSortTooltipText('name')}</p>
              </Tooltip.Content>
            </Tooltip>
          </div>
          <div className="flex justify-center">
            <Tooltip delay={0}>
              <Button
                size="sm"
                variant="ghost"
                className="h-auto min-w-0 px-0 py-0 text-sm font-semibold text-foreground hover:text-accent"
                onPress={() => toggleSortByField('size')}
              >
                {resolveSortButtonLabel('size')}
              </Button>
              <Tooltip.Content>
                <p>{resolveSortTooltipText('size')}</p>
              </Tooltip.Content>
            </Tooltip>
          </div>
          <div className="flex justify-center">
            <Tooltip delay={0}>
              <Button
                size="sm"
                variant="ghost"
                className="h-auto min-w-0 px-0 py-0 text-sm font-semibold text-foreground hover:text-accent"
                onPress={() => toggleSortByField('modifiedTimestamp')}
              >
                {resolveSortButtonLabel('modifiedTimestamp')}
              </Button>
              <Tooltip.Content>
                <p>{resolveSortTooltipText('modifiedTimestamp')}</p>
              </Tooltip.Content>
            </Tooltip>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
          {props.loading ? (
            <div className="h-full flex items-center justify-center"><Spinner color="accent" /></div>
          ) : filteredItems.length > 0 ? (
            <CheckboxGroup value={props.selectedItemPaths} onChange={syncSelectedPaths} className="gap-0">
              {pagedItems.map((item) => {
                const directorySize = props.directorySizeMap[item.relativePath]
                const rowSelected = selectedPathSet.has(item.relativePath)
                return (
                  <div
                    key={item.relativePath}
                    className={`grid h-16 grid-cols-[44px_32px_minmax(0,1fr)_160px_190px] items-center px-6 border-b border-border/70 cursor-pointer transition-colors ${rowSelected ? 'bg-accent/10' : 'hover:bg-surface-secondary'}`}
                    onClick={() => {
                      toggleItemSelection(item)
                    }}
                  >
                    <div className="flex items-center justify-center h-full" onClick={(event) => event.stopPropagation()}>
                      <Checkbox value={item.relativePath} aria-label={`选择${item.name}`} className="m-0 p-0 gap-0 items-center justify-center leading-none">
                        <Checkbox.Control className="size-5">
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                      </Checkbox>
                    </div>
                    <div className="flex items-center justify-center">
                      <FilePreviewThumbnail item={item} iconSize={26} iconClassName="shrink-0" imageClassName="size-7 object-cover rounded-md" />
                    </div>
                    <div className="min-w-0 flex items-center h-full">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="px-3 py-1 rounded-lg border border-transparent hover:border-border hover:bg-background/60 transition-colors text-lg text-foreground truncate max-w-full leading-none"
                        onClick={(event) => {
                          event.stopPropagation()
                        }}
                        onPress={() => {
                          if (item.type === 'directory') {
                            props.onOpenDirectory(item)
                            return
                          }
                          props.onOpenEditor(item)
                        }}
                      >
                        {item.name}
                      </Button>
                    </div>
                    <div className="text-sm text-default-500 text-center">
                      {item.type === 'directory' ? (
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-accent"
                            onPress={() => props.onComputeDirectorySize(item)}
                            onClick={(event) => event.stopPropagation()}
                          >
                            {typeof directorySize === 'number' ? formatFileSize(directorySize) : '计算'}
                          </Button>
                        </div>
                      ) : formatFileSize(item.size)}
                    </div>
                    <span className="text-sm text-default-500 text-center">{format(new Date(item.modifiedTimestamp), 'yyyy-MM-dd HH:mm')}</span>
                  </div>
                )
              })}
            </CheckboxGroup>
          ) : (
            <div className="h-35 flex items-center justify-center text-default-500 text-sm">
              当前目录暂无可显示文件
            </div>
          )}
        </div>
        <div
          ref={paginationSlotRef}
          className={`${shouldShowPagination ? 'h-16 px-6 border-t border-border bg-surface-secondary/20 flex items-center' : 'h-0 px-0 border-0 overflow-hidden'}`}
        >
          {shouldShowPagination && (
            <div className="w-full max-w-full overflow-x-auto">
              <Pagination className="justify-center">
                <Pagination.Content>
                  <Pagination.Item>
                    <Pagination.Previous isDisabled={currentPage === 1} onPress={() => setCurrentPage((previousPage) => Math.max(1, previousPage - 1))}>
                      <Pagination.PreviousIcon />
                      <span>上一页</span>
                    </Pagination.Previous>
                  </Pagination.Item>
                  {buildPaginationTokens(currentPage, totalPages).map((token, index) => (
                    token === 'ellipsis' ? (
                      <Pagination.Item key={`ellipsis-${index}`}>
                        <Pagination.Ellipsis />
                      </Pagination.Item>
                    ) : (
                      <Pagination.Item key={token}>
                        <Pagination.Link isActive={token === currentPage} onPress={() => setCurrentPage(token)}>
                          {token}
                        </Pagination.Link>
                      </Pagination.Item>
                    )
                  ))}
                  <Pagination.Item>
                    <Pagination.Next isDisabled={currentPage === totalPages} onPress={() => setCurrentPage((previousPage) => Math.min(totalPages, previousPage + 1))}>
                      <span>下一页</span>
                      <Pagination.NextIcon />
                    </Pagination.Next>
                  </Pagination.Item>
                </Pagination.Content>
              </Pagination>
            </div>
          )}
        </div>
      </Card.Content>
    </Card>
  )
}
