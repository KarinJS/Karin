import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from '@heroui/react'
import { gsap } from 'gsap'
import type { ApiResponse } from '@karinjs/types'
import request from '@/api/request'
import { useTheme } from '@/hooks/useTheme'
import { DeleteConfirmModal, SaveDecisionModal } from './components/FileConfirmModals'
import { FileDetailPanel } from './components/FileDetailPanel'
import { FileEditorModal } from './components/FileEditorModal'
import { FileListPanel } from './components/FileListPanel'
import { FilesMarkdownPreview } from './components/FilesMarkdownPreview'
import type {
  DirectorySizePayload,
  FileBatchDeletePayload,
  FileCopyPayload,
  FileContentPayload,
  FileListPayload,
  FilePastePayload,
  FileRenamePayload,
  FileSavePayload,
  FileSystemItem,
  SelectionSizePayload
} from './types'
import { isTextEditableFile, resolveFileContentUrl, splitPathSegments } from './utils'

/**
 * Markdown 预览项
 */
interface MarkdownPreviewItem {
  /** 文件信息 */
  file: FileSystemItem
  /** 文件内容 */
  content: string
}

/**
 * 文件管理页面
 * @returns 页面节点
 */
export default function FilesPage () {
  const { isDark } = useTheme()
  const [currentDirectory, setCurrentDirectory] = useState<string>('')
  const [items, setItems] = useState<FileSystemItem[]>([])
  const [loadingList, setLoadingList] = useState<boolean>(true)
  const [loadingContent, setLoadingContent] = useState<boolean>(false)
  const [selectedFile, setSelectedFile] = useState<FileSystemItem | null>(null)
  const [selectedFileContent, setSelectedFileContent] = useState<string>('')
  const [draftContent, setDraftContent] = useState<string>('')
  const [detailPanelVisible, setDetailPanelVisible] = useState<boolean>(false)
  const [editorModalVisible, setEditorModalVisible] = useState<boolean>(false)
  const [saveDecisionModalVisible, setSaveDecisionModalVisible] = useState<boolean>(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false)
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)
  const [saveLoading, setSaveLoading] = useState<boolean>(false)
  const [selectionSizeLoading, setSelectionSizeLoading] = useState<boolean>(false)
  const [selectionTotalSize, setSelectionTotalSize] = useState<number | null>(null)
  const [directorySizeMap, setDirectorySizeMap] = useState<Record<string, number>>({})
  const [selectedItemPaths, setSelectedItemPaths] = useState<string[]>([])
  const [clipboardPaths, setClipboardPaths] = useState<string[]>([])
  const [clipboardMode, setClipboardMode] = useState<'copy' | 'move'>('copy')
  const [pendingDeletePaths, setPendingDeletePaths] = useState<string[]>([])
  const [markdownPreviews, setMarkdownPreviews] = useState<MarkdownPreviewItem[]>([])
  const panelRef = useRef<HTMLDivElement>(null)
  const leftAreaRef = useRef<HTMLDivElement>(null)

  /**
   * 读取目录列表
   * @param directory 目录
   * @returns void
   */
  const fetchDirectoryItems = async (directory: string): Promise<void> => {
    setLoadingList(true)
    try {
      const response: ApiResponse<FileListPayload> = await request.get('/files/list', {
        params: { directory }
      })
      if (response.code === 0) {
        setCurrentDirectory(response.data.currentDirectory)
        setItems(response.data.items)
      }
    } finally {
      setLoadingList(false)
    }
  }

  /**
   * 读取文件内容
   * @param file 文件项
   * @returns 文件内容
   */
  const fetchFileContent = async (file: FileSystemItem): Promise<string> => {
    if (file.type !== 'file') {
      return ''
    }
    setLoadingContent(true)
    try {
      const response: ApiResponse<FileContentPayload> = await request.get('/files/content', {
        params: { path: file.relativePath }
      })
      if (response.code === 0) {
        setSelectedFile(file)
        setSelectedFileContent(response.data.content)
        setDraftContent(response.data.content)
        return response.data.content
      }
      return ''
    } finally {
      setLoadingContent(false)
    }
  }

  /**
   * 计算目录大小
   * @param item 目录项
   * @returns void
   */
  const computeDirectorySize = async (item: FileSystemItem): Promise<void> => {
    if (item.type !== 'directory') {
      return
    }
    const response: ApiResponse<DirectorySizePayload> = await request.get('/files/directory-size', {
      params: { path: item.relativePath }
    })
    if (response.code === 0) {
      setDirectorySizeMap((previousMap) => ({
        ...previousMap,
        [response.data.relativePath]: response.data.totalSize
      }))
    }
  }

  /**
   * 面包屑跳转
   * @param index 目录索引
   * @returns void
   */
  const navigateByBreadcrumb = (index: number): void => {
    const segments = splitPathSegments(currentDirectory)
    if (index < 0) {
      fetchDirectoryItems('')
      return
    }
    fetchDirectoryItems(segments.slice(0, index + 1).join('/'))
  }

  /**
   * 返回上级目录
   * @returns void
   */
  const goToParentDirectory = (): void => {
    const segments = splitPathSegments(currentDirectory)
    if (segments.length === 0) {
      return
    }
    fetchDirectoryItems(segments.slice(0, -1).join('/'))
  }

  /**
   * 刷新当前目录列表
   * @returns void
   */
  const refreshCurrentDirectoryItems = (): void => {
    fetchDirectoryItems(currentDirectory)
  }

  /**
   * 打开目录
   * @param item 目录项
   * @returns void
   */
  const openDirectory = (item: FileSystemItem): void => {
    if (item.type !== 'directory') {
      return
    }
    fetchDirectoryItems(item.relativePath)
    setSelectedItemPaths([])
  }

  /**
   * 打开编辑器模态框
   * @param item 文件项
   * @returns void
   */
  const openEditor = async (item: FileSystemItem): Promise<void> => {
    if (item.type !== 'file') {
      return
    }
    setSelectedFile(item)
    setEditorModalVisible(true)
    if (isTextEditableFile(item.name)) {
      await fetchFileContent(item)
      return
    }
    setSelectedFileContent('')
    setDraftContent('')
    setLoadingContent(false)
  }

  /**
   * 下载文件
   * @param item 文件项
   * @returns void
   */
  const downloadFile = (item: FileSystemItem): void => {
    if (item.type !== 'file') {
      return
    }
    const downloadURL = resolveFileContentUrl(item.relativePath)
    const anchor = document.createElement('a')
    anchor.href = downloadURL
    anchor.download = item.name
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
  }

  /**
   * 计算选中项总大小
   * @param relativePaths 选中路径
   * @returns void
   */
  const computeSelectionSize = async (relativePaths: string[]): Promise<void> => {
    if (relativePaths.length <= 1) {
      setSelectionTotalSize(null)
      return
    }
    setSelectionSizeLoading(true)
    try {
      const response: ApiResponse<SelectionSizePayload> = await request.post('/files/selection-size', {
        paths: relativePaths
      })
      if (response.code === 0) {
        setSelectionTotalSize(response.data.totalSize)
      }
    } finally {
      setSelectionSizeLoading(false)
    }
  }

  /**
   * 请求删除选中项
   * @returns void
   */
  const requestDeleteSelection = (): void => {
    if (selectedItemPaths.length === 0) {
      return
    }
    setPendingDeletePaths(selectedItemPaths)
    setDeleteModalVisible(true)
  }

  /**
   * 删除选中项
   * @returns void
   */
  const deleteSelectedItems = async (): Promise<void> => {
    if (pendingDeletePaths.length === 0) {
      return
    }
    setDeleteLoading(true)
    try {
      await request.post<ApiResponse<FileBatchDeletePayload>>('/files/delete-selection', {
        paths: pendingDeletePaths
      })
      setDeleteModalVisible(false)
      setSelectedItemPaths([])
      setPendingDeletePaths([])
      toast('删除成功', {
        description: `已删除 ${pendingDeletePaths.length} 项（模拟）`,
        actionProps: {
          children: '关闭',
          onPress: () => toast.clear(),
          variant: 'tertiary',
          className: 'h-9 px-4 text-sm'
        },
        variant: 'success'
      })
      await fetchDirectoryItems(currentDirectory)
    } finally {
      setDeleteLoading(false)
    }
  }

  /**
   * 复制选中项
   * @returns void
   */
  const copySelection = async (): Promise<void> => {
    if (selectedItemPaths.length === 0) {
      return
    }
    const response: ApiResponse<FileCopyPayload> = await request.post('/files/copy', {
      paths: selectedItemPaths
    })
    if (response.code === 0) {
      setClipboardMode('copy')
      setClipboardPaths(response.data.copiedPaths)
      toast('复制成功', {
        description: `已复制 ${response.data.copiedPaths.length} 项`,
        actionProps: {
          children: '关闭',
          onPress: () => toast.clear(),
          variant: 'tertiary',
          className: 'h-9 px-4 text-sm'
        },
        variant: 'default'
      })
    }
  }

  /**
   * 标记移动选中项
   * @returns void
   */
  const moveSelection = async (): Promise<void> => {
    if (selectedItemPaths.length === 0) {
      return
    }
    const response: ApiResponse<FileCopyPayload> = await request.post('/files/copy', {
      paths: selectedItemPaths
    })
    if (response.code === 0) {
      setClipboardMode('move')
      setClipboardPaths(response.data.copiedPaths)
      toast('移动已就绪', {
        description: `已标记 ${response.data.copiedPaths.length} 项，进入目标目录后点击粘贴`,
        actionProps: {
          children: '关闭',
          onPress: () => toast.clear(),
          variant: 'tertiary',
          className: 'h-9 px-4 text-sm'
        },
        variant: 'default'
      })
    }
  }

  /**
   * 粘贴复制项到当前目录
   * @returns void
   */
  const pasteCopiedItems = async (): Promise<void> => {
    if (clipboardPaths.length === 0) {
      return
    }
    const response: ApiResponse<FilePastePayload> = await request.post('/files/paste', {
      targetDirectory: currentDirectory,
      sourcePaths: clipboardPaths
    })
    if (response.code === 0) {
      toast('粘贴成功', {
        description: `${clipboardMode === 'move' ? '已移动' : '已粘贴'} ${response.data.pastedPaths.length} 项到当前目录（模拟）`,
        actionProps: {
          children: '关闭',
          onPress: () => toast.clear(),
          variant: 'tertiary',
          className: 'h-9 px-4 text-sm'
        },
        variant: 'default'
      })
      if (clipboardMode === 'move') {
        setClipboardPaths([])
      }
      await fetchDirectoryItems(currentDirectory)
    }
  }

  /**
   * 清空复制缓存
   * @returns void
   */
  const clearCopiedItems = (): void => {
    setClipboardPaths([])
    setClipboardMode('copy')
  }

  /**
   * 复制当前目录路径
   * @returns void
   */
  const copyCurrentDirectoryPath = async (): Promise<void> => {
    const copiedPath = currentDirectory || '/'
    try {
      await navigator.clipboard.writeText(copiedPath)
      toast('路径已复制', {
        description: copiedPath,
        actionProps: {
          children: '关闭',
          onPress: () => toast.clear(),
          variant: 'tertiary',
          className: 'h-9 px-4 text-sm'
        },
        variant: 'default'
      })
    } catch {
      toast('复制失败', {
        description: '当前环境不支持剪贴板写入',
        actionProps: {
          children: '关闭',
          onPress: () => toast.clear(),
          variant: 'tertiary',
          className: 'h-9 px-4 text-sm'
        },
        variant: 'default'
      })
    }
  }

  /**
   * 重命名单个选中项
   * @returns void
   */
  const renameSingleSelection = async (): Promise<void> => {
    if (selectedItemPaths.length !== 1) {
      return
    }
    const currentItem = items.find((item) => item.relativePath === selectedItemPaths[0])
    if (!currentItem) {
      return
    }
    const nextName = window.prompt('请输入新名称', currentItem.name)?.trim()
    if (!nextName || nextName === currentItem.name) {
      return
    }
    const response: ApiResponse<FileRenamePayload> = await request.post('/files/rename', {
      path: currentItem.relativePath,
      newName: nextName
    })
    if (response.code === 0) {
      toast('重命名成功', {
        description: `${currentItem.name} -> ${nextName}（模拟）`,
        actionProps: {
          children: '关闭',
          onPress: () => toast.clear(),
          variant: 'tertiary',
          className: 'h-9 px-4 text-sm'
        },
        variant: 'default'
      })
      await fetchDirectoryItems(currentDirectory)
    }
  }

  /**
   * 保存文件
   * @returns void
   */
  const saveCurrentFile = async (): Promise<void> => {
    if (!selectedFile) {
      return
    }
    setSaveLoading(true)
    try {
      await request.post<ApiResponse<FileSavePayload>>('/files/save', {
        path: selectedFile.relativePath,
        content: draftContent
      })
      setSelectedFileContent(draftContent)
      setSaveDecisionModalVisible(false)
      setEditorModalVisible(false)
      toast('保存成功', {
        description: `${selectedFile.name} 已保存（模拟）`,
        actionProps: {
          children: '关闭',
          onPress: () => toast.clear(),
          variant: 'tertiary',
          className: 'h-9 px-4 text-sm'
        },
        variant: 'default'
      })
    } finally {
      setSaveLoading(false)
    }
  }

  /**
   * 保存按钮点击事件
   * @returns void
   */
  const requestSaveDecision = (): void => {
    if (!selectedFile) {
      return
    }
    if (draftContent === selectedFileContent) {
      toast('未检测到修改', {
        description: '当前内容与原文件一致',
        actionProps: {
          children: '关闭',
          onPress: () => toast.clear(),
          variant: 'tertiary',
          className: 'h-9 px-4 text-sm'
        },
        variant: 'default'
      })
      return
    }
    setSaveDecisionModalVisible(true)
  }

  /**
   * 不保存并关闭
   * @returns void
   */
  const discardAndCloseEditor = (): void => {
    setSaveDecisionModalVisible(false)
    setEditorModalVisible(false)
  }

  /**
   * 当前选中项数组
   */
  const selectedItems = useMemo<FileSystemItem[]>(() => {
    const selectedPathSet = new Set<string>(selectedItemPaths)
    return items.filter((item) => selectedPathSet.has(item.relativePath))
  }, [items, selectedItemPaths])

  /**
   * 是否允许显示详情面板
   */
  const showDetailPanel = useMemo<boolean>(() => {
    return detailPanelVisible
  }, [detailPanelVisible])

  useEffect(() => {
    fetchDirectoryItems('')
  }, [])

  useEffect(() => {
    const validPathSet = new Set<string>(items.map((item) => item.relativePath))
    setSelectedItemPaths((previousPaths) => {
      const filteredPaths = previousPaths.filter((path) => validPathSet.has(path))
      return filteredPaths.length === previousPaths.length ? previousPaths : filteredPaths
    })
  }, [items])

  useEffect(() => {
    setDetailPanelVisible(selectedItems.length > 0)
    setSelectionTotalSize(null)
  }, [selectedItems.length])

  useEffect(() => {
    /**
     * 判断是否为 README 文件名
     * @param fileName 文件名
     * @returns 是否为 README.md
     */
    const isReadmeName = (fileName: string): boolean => {
      return /^readme\.md$/i.test(fileName)
    }
    const markdownFiles = items
      .filter((item) => item.type === 'file' && item.name.toLowerCase().endsWith('.md'))
      .sort((firstItem, secondItem) => {
        const firstIsReadme = isReadmeName(firstItem.name)
        const secondIsReadme = isReadmeName(secondItem.name)
        if (firstIsReadme === secondIsReadme) {
          return firstItem.name.localeCompare(secondItem.name)
        }
        return firstIsReadme ? 1 : -1
      })
    if (markdownFiles.length === 0) {
      setMarkdownPreviews([])
      return
    }
    let cancelled = false
    const fetchMarkdownPreviews = async (): Promise<void> => {
      const previews = await Promise.all(
        markdownFiles.map(async (file) => {
          const response: ApiResponse<FileContentPayload> = await request.get('/files/content', {
            params: { path: file.relativePath }
          })
          return {
            file,
            content: response.code === 0 ? response.data.content : ''
          }
        })
      )
      if (cancelled) {
        return
      }
      setMarkdownPreviews(previews.filter((preview) => preview.content.trim().length > 0))
    }
    fetchMarkdownPreviews()
    return () => {
      cancelled = true
    }
  }, [items])

  useEffect(() => {
    if (!panelRef.current || !leftAreaRef.current) {
      return
    }
    gsap.killTweensOf(panelRef.current)
    gsap.killTweensOf(leftAreaRef.current)
    if (showDetailPanel) {
      gsap.to(panelRef.current, { width: 380, autoAlpha: 1, duration: 0.32, ease: 'power2.out' })
      gsap.to(leftAreaRef.current, { width: 'calc(100% - 396px)', duration: 0.32, ease: 'power2.out' })
      return
    }
    gsap.to(panelRef.current, { width: 0, autoAlpha: 0, duration: 0.24, ease: 'power2.inOut' })
    gsap.to(leftAreaRef.current, { width: '100%', duration: 0.24, ease: 'power2.inOut' })
  }, [showDetailPanel])

  return (
    <div className="h-full w-full flex gap-4 min-h-0 overflow-y-auto">
      <div ref={leftAreaRef} className="w-full min-w-0 flex flex-col gap-4 pr-1">
        <FileListPanel
          currentDirectory={currentDirectory}
          items={items}
          loading={loadingList}
          directorySizeMap={directorySizeMap}
          className="shrink-0"
          scrollable
          onGoParent={goToParentDirectory}
          onNavigateBreadcrumb={navigateByBreadcrumb}
          onOpenDirectory={openDirectory}
          onOpenEditor={openEditor}
          onComputeDirectorySize={computeDirectorySize}
          selectedItemPaths={selectedItemPaths}
          onChangeSelectedItemPaths={setSelectedItemPaths}
          onPasteCopiedItems={pasteCopiedItems}
          onClearCopiedItems={clearCopiedItems}
          onCopyCurrentPath={copyCurrentDirectoryPath}
          onRefreshList={refreshCurrentDirectoryItems}
          copiedItemCount={clipboardPaths.length}
        />
        <FilesMarkdownPreview previews={markdownPreviews} />
      </div>

      <div ref={panelRef} className="w-0 opacity-0 overflow-hidden shrink-0">
        <FileDetailPanel
          selectedItems={selectedItems}
          directorySizeMap={directorySizeMap}
          selectionTotalSize={selectionTotalSize}
          selectionSizeLoading={selectionSizeLoading}
          onOpenEditor={openEditor}
          onDownload={downloadFile}
          onDeleteSelection={requestDeleteSelection}
          onOpenDirectory={openDirectory}
          onComputeDirectorySize={computeDirectorySize}
          onComputeSelectionSize={() => computeSelectionSize(selectedItemPaths)}
          onCopySelection={copySelection}
          onMoveSelection={moveSelection}
          onRenameSingle={renameSingleSelection}
        />
      </div>

      <FileEditorModal
        isOpen={editorModalVisible}
        loading={loadingContent}
        selectedFile={selectedFile}
        draftContent={draftContent}
        isDark={isDark}
        onOpenChange={setEditorModalVisible}
        onChangeDraft={setDraftContent}
        onSaveRequest={requestSaveDecision}
      />

      <SaveDecisionModal
        isOpen={saveDecisionModalVisible}
        saving={saveLoading}
        onOpenChange={setSaveDecisionModalVisible}
        onSave={saveCurrentFile}
        onDiscard={discardAndCloseEditor}
      />

      <DeleteConfirmModal
        isOpen={deleteModalVisible}
        deleting={deleteLoading}
        onOpenChange={setDeleteModalVisible}
        onDelete={deleteSelectedItems}
      />
    </div>
  )
}
