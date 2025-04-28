/* eslint-disable @stylistic/indent */
import { useState, useEffect, useRef, useCallback } from 'react'
import { Modal, ModalContent, ModalHeader } from '@heroui/modal'
import { Button } from '@heroui/button'
import { Checkbox } from '@heroui/checkbox'
import { Spinner } from '@heroui/spinner'
import { Input } from '@heroui/input'
import { IoSearch, IoCheckmark } from 'react-icons/io5'
import { FaList, FaChevronRight, FaChevronDown, FaCode } from 'react-icons/fa'
import { getLoadedCommandPluginCacheList } from '@/request/plugins'
import toast from 'react-hot-toast'

/**
 * 插件选择对话框属性
 */
interface PluginSelectorDialogProps {
  /** 对话框是否打开 */
  isOpen: boolean
  /** 关闭对话框回调 */
  onClose: () => void
  /** 确认选择回调 */
  onConfirm: (selectedItems: string[]) => void
  /** 当前已选择的项目 */
  currentSelected?: string[]
  /** 对话框标题 */
  title?: string
}

/**
 * 简化的树节点类型
 */
interface TreeNode {
  id: string
  type: 'package' | 'file' | 'command'
  value: string
  name: string
  selected: boolean
  expanded: boolean
  children?: TreeNode[]
}

/**
 * 精简版插件选择对话框
 */
export const PluginSelectorDialog = ({
  isOpen,
  onClose,
  onConfirm,
  currentSelected = [],
  title = '选择插件',
}: PluginSelectorDialogProps) => {
  const unmounted = useRef(false)
  const [loading, setLoading] = useState(false)
  const [treeData, setTreeData] = useState<TreeNode[]>([])
  const [keyword, setKeyword] = useState('')
  const initialized = useRef(false)
  const abortController = useRef<AbortController | null>(null)

  // 加载数据
  const loadData = useCallback(async () => {
    if (loading || !isOpen) return

    try {
      if (abortController.current) {
        abortController.current.abort()
      }

      abortController.current = new AbortController()
      setLoading(true)

      const data = await getLoadedCommandPluginCacheList()
      if (unmounted.current) return

      // 构建简化的树结构
      const tree: TreeNode[] = []

      data.forEach(plugin => {
        // 包节点
        const packageNode: TreeNode = {
          id: `pkg-${plugin.name}`,
          type: 'package',
          value: plugin.name,
          name: plugin.name,
          selected: currentSelected.includes(plugin.name),
          expanded: true,
          children: [],
        }

        // 文件和命令节点
        plugin.files.forEach(file => {
          const fileNode: TreeNode = {
            id: `file-${plugin.name}-${file.fileName}`,
            type: 'file',
            value: `${plugin.name}:${file.fileName}`,
            name: file.fileName,
            selected: currentSelected.includes(`${plugin.name}:${file.fileName}`),
            expanded: true,
            children: [],
          }

          // 命令节点
          file.command.forEach(cmd => {
            fileNode.children?.push({
              id: `cmd-${plugin.name}-${cmd}`,
              type: 'command',
              value: `${plugin.name}:${cmd}`,
              name: cmd,
              selected: currentSelected.includes(`${plugin.name}:${cmd}`),
              expanded: false,
            })
          })

          packageNode.children?.push(fileNode)
        })

        tree.push(packageNode)
      })

      setTreeData(tree)
      initialized.current = true
    } catch (error) {
      if (!unmounted.current) {
        if (error instanceof DOMException && error.name === 'AbortError') return
        console.error('加载插件数据失败:', error)
        toast.error('加载插件数据失败')
      }
    } finally {
      if (!unmounted.current) {
        setLoading(false)
      }
    }
  }, [currentSelected, isOpen, loading])

  // 重置状态
  const resetState = useCallback(() => {
    setKeyword('')
    initialized.current = false
    if (abortController.current) {
      abortController.current.abort()
      abortController.current = null
    }
  }, [])

  // 处理节点选择
  const handleNodeSelect = useCallback((nodeId: string, checked: boolean) => {
    setTreeData(prev =>
      updateNodeInTree(prev, nodeId, node => ({
        ...node,
        selected: checked,
      }))
    )
  }, [])

  // 处理节点展开/折叠
  const handleNodeToggle = useCallback((nodeId: string) => {
    setTreeData(prev =>
      updateNodeInTree(prev, nodeId, node => ({
        ...node,
        expanded: !node.expanded,
      }))
    )
  }, [])

  // 更新树中的节点
  const updateNodeInTree = (nodes: TreeNode[], nodeId: string, updater: (node: TreeNode) => TreeNode): TreeNode[] => {
    return nodes.map(node => {
      if (node.id === nodeId) {
        return updater(node)
      }

      if (node.children?.length) {
        return {
          ...node,
          children: updateNodeInTree(node.children, nodeId, updater),
        }
      }

      return node
    })
  }

  // 全选/全不选
  const handleSelectAll = useCallback((checked: boolean) => {
    setTreeData(prev => {
      const updateAll = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map(node => ({
          ...node,
          selected: checked,
          children: node.children ? updateAll(node.children) : undefined,
        }))
      }
      return updateAll(prev)
    })
  }, [])

  // 确认选择
  const handleConfirm = useCallback(() => {
    const getSelectedValues = (nodes: TreeNode[]): string[] => {
      let values: string[] = []

      nodes.forEach(node => {
        if (node.selected) {
          values.push(node.value)
        }

        if (node.children?.length) {
          values = values.concat(getSelectedValues(node.children))
        }
      })

      return values
    }

    onConfirm(getSelectedValues(treeData))
  }, [onConfirm, treeData])

  // 过滤节点
  const filterNodes = useCallback((nodes: TreeNode[]): TreeNode[] => {
    if (!keyword) return nodes

    return nodes.map(node => {
      // 节点自身匹配
      const selfMatches = node.name.toLowerCase().includes(keyword.toLowerCase()) ||
        node.value.toLowerCase().includes(keyword.toLowerCase())

      // 处理子节点
      const filteredChildren = node.children?.length
        ? filterNodes(node.children)
        : []

      // 子节点有匹配
      const hasMatchingChildren = !!filteredChildren.length

      if (selfMatches || hasMatchingChildren) {
        return {
          ...node,
          children: filteredChildren,
          expanded: hasMatchingChildren ? true : node.expanded,
        }
      }

      return null
    }).filter(Boolean) as TreeNode[]
  }, [keyword])

  // 渲染树节点
  const renderTreeNode = useCallback((node: TreeNode, depth = 0) => {
    const hasChildren = !!node.children?.length

    return (
      <div
        key={node.id}
        className={`flex items-center py-2 px-3 rounded-lg mb-1 ${node.selected
          ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700'
          : 'hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent'
          }`}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
      >
        {/* 展开/折叠按钮 */}
        <div className='w-6 flex justify-center'>
          {hasChildren
            ? (
              <button
                type='button'
                className='text-gray-500 hover:text-blue-600 transition-colors'
                onClick={() => handleNodeToggle(node.id)}
              >
                {node.expanded
                  ? <FaChevronDown size={14} />
                  : <FaChevronRight size={14} />}
              </button>
            )
            : <span className='w-5' />}
        </div>

        {/* 复选框 */}
        <Checkbox
          checked={node.selected}
          onChange={(e) => handleNodeSelect(node.id, e.target.checked)}
          color='primary'
        />

        {/* 图标和名称 */}
        <div className='ml-2 flex items-center'>
          {node.type === 'command'
            ? <FaCode className='text-gray-500' />
            : <FaList className='text-gray-500' />}
          <span className='ml-1.5 text-sm'>{node.name}</span>
        </div>

        {/* 选中标记 */}
        {node.selected && (
          <span className='ml-auto text-green-600'>
            <IoCheckmark />
          </span>
        )}
      </div>
    )
  }, [handleNodeSelect, handleNodeToggle])

  // 渲染树
  const renderTree = useCallback((nodes: TreeNode[]) => {
    return nodes.map(node => {
      const result = [renderTreeNode(node, 0)]

      if (node.expanded && node.children?.length) {
        node.children.forEach(child => {
          result.push(renderTreeNode(child, 1))

          if (child.expanded && child.children?.length) {
            child.children.forEach(grandChild => {
              result.push(renderTreeNode(grandChild, 2))
            })
          }
        })
      }

      return result
    }).flat()
  }, [renderTreeNode])

  // 计算选中数量
  const getSelectedCount = useCallback(() => {
    let count = 0

    const countSelected = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        if (node.selected) count++
        if (node.children?.length) countSelected(node.children)
      })
    }

    countSelected(treeData)
    return count
  }, [treeData])

  // 初始化和清理
  useEffect(() => {
    if (isOpen && !initialized.current) {
      loadData()
    } else if (!isOpen && initialized.current) {
      resetState()
    }
  }, [isOpen, loadData, resetState])

  useEffect(() => {
    return () => {
      unmounted.current = true
      if (abortController.current) {
        abortController.current.abort()
      }
    }
  }, [])

  // 过滤树节点
  const filteredTree = keyword ? filterNodes(treeData) : treeData
  const selectedCount = getSelectedCount()
  const totalCount = treeData.length

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      classNames={{ backdrop: 'bg-black/60 backdrop-blur-sm' }}
      size='2xl'
    >
      <ModalContent className='p-0 rounded-xl bg-white dark:bg-gray-900 overflow-hidden border border-gray-200 dark:border-gray-700 shadow-xl'>
        <ModalHeader className='sticky top-0 z-10 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'>
          <h2 className='text-lg font-semibold flex items-center'>
            <FaList className='mr-2 text-gray-500' />
            {title}
          </h2>
        </ModalHeader>

        <div className='flex flex-col h-[80vh] max-h-[80vh]'>
          {/* 搜索和控制 */}
          <div className='p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700'>
            <div className='flex items-center justify-between gap-2'>
              <Input
                startContent={<IoSearch className='text-gray-400' />}
                placeholder='搜索插件、文件或命令...'
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className='flex-1 shadow-sm'
                size='sm'
                color='primary'
                autoFocus
              />
              <Button
                size='sm'
                variant='flat'
                color='primary'
                onPress={() => handleSelectAll(selectedCount < totalCount)}
              >
                {selectedCount < totalCount ? '全选' : '取消全选'}
              </Button>
            </div>
          </div>

          {/* 内容区域 */}
          <div className='flex-1 overflow-auto p-2'>
            {loading
              ? (
                <div className='flex justify-center items-center py-8'>
                  <Spinner color='primary' size='lg' />
                  <span className='ml-2'>加载中...</span>
                </div>
              )
              : filteredTree.length === 0
                ? (
                  <div className='text-center py-8 text-gray-500'>
                    没有找到匹配的插件
                  </div>
                )
                : (
                  renderTree(filteredTree)
                )}
          </div>

          {/* 底部操作栏 */}
          <div className='p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex justify-between items-center'>
            <div className='text-sm text-gray-500'>
              已选择 <span className='font-medium text-blue-600'>{selectedCount}</span> 项
            </div>
            <div className='flex space-x-2'>
              <Button
                variant='flat'
                onPress={onClose}
                className='px-4'
              >
                取消
              </Button>
              <Button
                color='primary'
                onPress={handleConfirm}
                className='px-4'
                isDisabled={selectedCount === 0}
              >
                确认选择
              </Button>
            </div>
          </div>
        </div>
      </ModalContent>
    </Modal>
  )
}
