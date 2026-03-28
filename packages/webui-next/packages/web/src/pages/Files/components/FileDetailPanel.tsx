import { useEffect, useRef, useState } from 'react'
import { Button, Card } from '@heroui/react'
import { format } from 'date-fns'
import { gsap } from 'gsap'
import { FiCopy, FiDownload, FiEdit3, FiFileText, FiFolder, FiScissors, FiTrash2 } from 'react-icons/fi'
import type { FileSystemItem } from '../types'
import { formatFileSize, resolveFileTypeLabel } from '../utils'
import { FilePreviewThumbnail } from './FilePreviewThumbnail'

/**
 * 详情面板属性
 */
interface FileDetailPanelProps {
  /** 当前选中项 */
  selectedItems: FileSystemItem[]
  /** 目录大小缓存 */
  directorySizeMap: Record<string, number>
  /** 选中项总大小 */
  selectionTotalSize: number | null
  /** 选中项大小计算中 */
  selectionSizeLoading: boolean
  /** 在编辑器打开 */
  onOpenEditor: (item: FileSystemItem) => void
  /** 下载文件 */
  onDownload: (item: FileSystemItem) => void
  /** 请求删除选中项 */
  onDeleteSelection: () => void
  /** 打开目录 */
  onOpenDirectory: (item: FileSystemItem) => void
  /** 计算目录大小 */
  onComputeDirectorySize: (item: FileSystemItem) => void
  /** 计算选中项大小 */
  onComputeSelectionSize: () => void
  /** 复制选中项 */
  onCopySelection: () => void
  /** 移动选中项 */
  onMoveSelection: () => void
  /** 重命名单个选中项 */
  onRenameSingle: () => void
}

/**
 * 文件详情面板
 * @param props 面板属性
 * @returns 面板节点
 */
export const FileDetailPanel = (props: FileDetailPanelProps) => {
  /**
   * 解析多选标题
   * @param selectedItems 已选中项
   * @returns 标题文本
   */
  const resolveMultipleSelectionTitle = (selectedItems: FileSystemItem[]): string => {
    if (selectedItems.length === 0) {
      return '未选择文件'
    }
    if (selectedItems.every((item) => item.type === 'directory')) {
      return '多个文件夹'
    }
    return '多个文件'
  }
  const singleSelectedItem = props.selectedItems.length === 1 ? props.selectedItems[0] : null
  const multipleSelected = props.selectedItems.length > 1
  const directorySize = singleSelectedItem ? props.directorySizeMap[singleSelectedItem.relativePath] : undefined
  const titleText = multipleSelected ? resolveMultipleSelectionTitle(props.selectedItems) : singleSelectedItem?.name || '未选择文件'
  const subtitleText = multipleSelected
    ? `已选择 ${props.selectedItems.length} 项`
    : singleSelectedItem
      ? resolveFileTypeLabel(singleSelectedItem.name, singleSelectedItem.type)
      : '未选择文件'
  const detailPathText = multipleSelected
    ? props.selectedItems.map((item) => item.relativePath).join('、')
    : singleSelectedItem?.relativePath || '-'
  const shouldShowOpenDirectory = Boolean(singleSelectedItem && singleSelectedItem.type === 'directory')
  const [openDirectoryMounted, setOpenDirectoryMounted] = useState<boolean>(shouldShowOpenDirectory)
  const actionGroupRef = useRef<HTMLDivElement | null>(null)
  const openDirectoryActionRef = useRef<HTMLButtonElement | null>(null)

  /**
   * 管理操作区切换动画
   * @returns void
   */
  useEffect(() => {
    if (!actionGroupRef.current) {
      return
    }
    gsap.killTweensOf(actionGroupRef.current)
    gsap.fromTo(actionGroupRef.current, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.26, ease: 'power2.out' })
  }, [multipleSelected, singleSelectedItem?.type])

  /**
   * 管理打开目录按钮出入场动画
   * @returns void
   */
  useEffect(() => {
    if (shouldShowOpenDirectory) {
      setOpenDirectoryMounted(true)
      return
    }
    if (!openDirectoryMounted || !openDirectoryActionRef.current) {
      setOpenDirectoryMounted(false)
      return
    }
    gsap.killTweensOf(openDirectoryActionRef.current)
    gsap.to(openDirectoryActionRef.current, {
      autoAlpha: 0,
      y: -8,
      duration: 0.2,
      ease: 'power2.inOut',
      onComplete: () => setOpenDirectoryMounted(false)
    })
  }, [openDirectoryMounted, shouldShowOpenDirectory])

  /**
   * 打开目录按钮入场动画
   * @returns void
   */
  useEffect(() => {
    if (!openDirectoryMounted || !openDirectoryActionRef.current || !shouldShowOpenDirectory) {
      return
    }
    gsap.killTweensOf(openDirectoryActionRef.current)
    gsap.fromTo(openDirectoryActionRef.current, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.22, ease: 'power2.out' })
  }, [openDirectoryMounted, shouldShowOpenDirectory])

  return (
    <Card className="h-full bg-surface border border-border">
      <Card.Content className="p-5 h-full flex flex-col">
        <div className="rounded-2xl border border-border bg-surface-secondary h-56 flex items-center justify-center">
          {singleSelectedItem ? (
            <div className="h-full w-full p-3 flex items-center justify-center">
              <FilePreviewThumbnail
                item={singleSelectedItem}
                iconSize={52}
                imageClassName="max-h-full max-w-full object-contain rounded-xl"
              />
            </div>
          ) : multipleSelected ? (
            <div className="flex flex-col items-center gap-2 text-default-500">
              {props.selectedItems.every((item) => item.type === 'directory') ? <FiFolder size={46} /> : <FiFileText size={46} />}
              <span className="text-sm">{resolveMultipleSelectionTitle(props.selectedItems)}</span>
            </div>
          ) : (
            <span className="text-default-400 text-sm">未选择文件</span>
          )}
        </div>

        <div className="mt-4">
          <p className="text-3xl font-bold text-foreground break-all">{titleText}</p>
          <p className="text-sm text-default-500 mt-1">
            {subtitleText}
          </p>
          <p className="text-xs text-default-500 mt-2 break-all">详细名称：{detailPathText}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          {!multipleSelected && (
            <div className="rounded-xl border border-border px-3 py-2 bg-background/40">
              <p className="text-[10px] text-default-500">创建时间</p>
              <p className="text-sm font-semibold text-foreground">
                {singleSelectedItem ? format(new Date(singleSelectedItem.createdTimestamp), 'yyyy-MM-dd') : '--'}
              </p>
            </div>
          )}
          <div className="rounded-xl border border-border px-3 py-2 bg-background/40">
            <p className="text-[10px] text-default-500">大小</p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">
                {multipleSelected ? (
                  typeof props.selectionTotalSize === 'number' ? formatFileSize(props.selectionTotalSize) : '--'
                ) : singleSelectedItem ? (
                  singleSelectedItem.type === 'directory'
                    ? typeof directorySize === 'number'
                      ? formatFileSize(directorySize)
                      : '计算'
                    : formatFileSize(singleSelectedItem.size)
                ) : '--'}
              </p>
              {multipleSelected && (
                <Button size="sm" variant="ghost" onPress={props.onComputeSelectionSize} isDisabled={props.selectionSizeLoading}>
                  <span className="text-accent">{props.selectionSizeLoading ? '计算中' : '计算'}</span>
                </Button>
              )}
              {singleSelectedItem?.type === 'directory' && (
                <Button size="sm" variant="ghost" onPress={() => props.onComputeDirectorySize(singleSelectedItem)}>
                  计算
                </Button>
              )}
            </div>
          </div>
        </div>

        <div ref={actionGroupRef} className="mt-5 flex flex-col gap-3">
          {!multipleSelected && (
            <>
              <Button
                className="w-full h-12 text-base font-semibold"
                variant="primary"
                onPress={() => singleSelectedItem && props.onOpenEditor(singleSelectedItem)}
                isDisabled={!singleSelectedItem || singleSelectedItem.type !== 'file'}
              >
                <FiEdit3 size={16} />
                在编辑器中打开
              </Button>
              <Button
                className="w-full h-12 text-base font-semibold"
                variant="secondary"
                onPress={() => singleSelectedItem && props.onDownload(singleSelectedItem)}
                isDisabled={!singleSelectedItem || singleSelectedItem.type !== 'file'}
              >
                <FiDownload size={16} />
                下载文件
              </Button>
              {openDirectoryMounted && (
                <Button
                  ref={openDirectoryActionRef}
                  className="w-full h-12 text-base font-semibold"
                  variant="secondary"
                  onPress={() => singleSelectedItem && props.onOpenDirectory(singleSelectedItem)}
                  isDisabled={!singleSelectedItem || singleSelectedItem.type !== 'directory'}
                >
                  <FiFolder size={16} />
                  打开目录
                </Button>
              )}
              <Button
                className="w-full h-12 text-base font-semibold"
                variant="secondary"
                onPress={props.onRenameSingle}
                isDisabled={!singleSelectedItem}
              >
                <FiEdit3 size={16} />
                重命名
              </Button>
            </>
          )}
          <Button
            className="w-full h-12 text-base font-semibold"
            variant="secondary"
            onPress={props.onCopySelection}
            isDisabled={props.selectedItems.length === 0}
          >
            <FiCopy size={16} />
            复制选中
          </Button>
          <Button
            className="w-full h-12 text-base font-semibold"
            variant="secondary"
            onPress={props.onMoveSelection}
            isDisabled={props.selectedItems.length === 0}
          >
            <FiScissors size={16} />
            移动选中
          </Button>
          <Button
            className="w-full h-12 text-base font-semibold bg-danger text-danger-foreground hover:bg-danger/90"
            variant="primary"
            onPress={props.onDeleteSelection}
            isDisabled={props.selectedItems.length === 0}
          >
            <FiTrash2 size={16} />
            删除选中
          </Button>
        </div>
      </Card.Content>
    </Card>
  )
}
