/* eslint-disable @stylistic/indent */
import toast from 'react-hot-toast'
import { Input } from '@heroui/input'
import { Button } from '@heroui/button'
import { Spinner } from '@heroui/spinner'
import { IoSearch } from 'react-icons/io5'
import { Checkbox } from '@heroui/checkbox'
import { Modal, ModalContent, ModalHeader } from '@heroui/modal'
import { useState, useEffect, useRef, useCallback, ReactElement } from 'react'
import { getLoadedCommandPluginCacheList } from '@/request/plugins'
import { hideRocket, showRocket } from '@/components/common/ScrollToTop.utils'
import { Puzzle, FileText, Terminal, ChevronRight, ChevronDown, CheckCircle } from 'lucide-react'

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
  /** 节点ID */
  id: string
  /** 节点类型 */
  type: 'package' | 'file' | 'command'
  /** 节点值 */
  value: string
  /** 节点名称 */
  name: {
    /** 插件名称 */
    pluginName: string
    /** 方法名称，对于package和file类型，与pluginName相同 */
    method: string
  }
  /** 是否选中 */
  selected: boolean
  /** 是否展开 */
  expanded: boolean
  /** 子节点 */
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
  const [isAllExpanded, setIsAllExpanded] = useState(false)

  /**
   * 检查节点是否已被选中
   * @param value 节点值
   * @returns 是否选中
   */
  const isNodeSelected = useCallback((value: string) => {
    return currentSelected.some(selected => selected === value)
  }, [currentSelected])

  /**
   * 加载数据
   */
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

      /** 构建简化的树结构，所有节点默认折叠 */
      const tree: TreeNode[] = []

      data.forEach(plugin => {
        const packageNode: TreeNode = {
          id: `pkg-${plugin.name}`,
          type: 'package',
          value: plugin.name,
          name: {
            pluginName: plugin.name,
            method: plugin.name,
          },
          selected: isNodeSelected(plugin.name),
          expanded: false, /** 默认折叠 */
          children: [],
        }

        plugin.files.forEach(file => {
          const fileNode: TreeNode = {
            id: `file-${plugin.name}-${file.fileName}`,
            type: 'file',
            value: `${plugin.name}:${file.fileName}`,
            name: {
              pluginName: plugin.name,
              method: file.fileName,
            },
            selected: isNodeSelected(`${plugin.name}:${file.fileName}`),
            expanded: false, /** 默认折叠 */
            children: [],
          }

          file.command.forEach(cmd => {
            const cmdValue = `${plugin.name}:${cmd.method}`
            /** 使用完整路径生成唯一ID，包含插件名、文件名和方法名 */
            const cmdId = `cmd-${plugin.name}-${file.fileName}-${cmd.method}`

            fileNode.children?.push({
              id: cmdId,
              type: 'command',
              value: cmdValue,
              name: cmd,
              selected: isNodeSelected(cmdValue),
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
  }, [currentSelected, isOpen, loading, isNodeSelected])

  /**
   * 重置状态
   */
  const resetState = useCallback(() => {
    setKeyword('')
    initialized.current = false
    if (abortController.current) {
      abortController.current.abort()
      abortController.current = null
    }
  }, [])

  /**
   * 处理节点选择
   * @param nodeId 节点ID
   * @param checked 是否选中
   */
  const handleNodeSelect = useCallback((nodeId: string, checked: boolean) => {
    setTreeData(prev => {
      /** 更新节点及其子节点的函数 */
      const updateNode = (node: TreeNode): TreeNode => {
        /** 如果是目标节点 */
        if (node.id === nodeId) {
          /** 如果是选中操作，则将自身选中，并确保子节点都不选中 */
          if (checked) {
            return {
              ...node,
              selected: true,
              children: node.children?.map(child => ({
                ...child,
                selected: false,
                children: child.children?.map(grandChild => ({
                  ...grandChild,
                  selected: false,
                })),
              })),
            }
            /** 如果是取消选中操作，则仅取消自身选中 */
          } else {
            return {
              ...node,
              selected: false,
            }
          }
        }

        /** 如果不是目标节点，但有子节点，递归处理子节点 */
        if (node.children?.length) {
          return {
            ...node,
            children: node.children.map(updateNode),
          }
        }

        /** 如果都不是，保持不变 */
        return node
      }

      /** 对每个根节点应用更新 */
      return prev.map(updateNode)
    })
  }, [])

  /**
   * 处理节点展开/折叠
   * @param nodeId 节点ID
   */
  const handleNodeToggle = useCallback((nodeId: string) => {
    setTreeData(prev =>
      updateNodeInTree(prev, nodeId, node => ({
        ...node,
        expanded: !node.expanded,
      }))
    )
  }, [])

  /**
   * 更新树中的节点
   * @param nodes 树节点数组
   * @param nodeId 目标节点ID
   * @param updater 节点更新函数
   * @returns 更新后的树节点数组
   */
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

  /**
   * 全选/全不选
   * @param checked 是否全选
   */
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

  /**
   * 一键折叠/展开全部
   */
  const handleExpandAll = useCallback(() => {
    /** 切换展开状态 */
    const newExpandedState = !isAllExpanded
    setIsAllExpanded(newExpandedState)

    /** 更新树节点 */
    setTreeData(prev => {
      const updateExpanded = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map(node => ({
          ...node,
          expanded: newExpandedState,
          children: node.children ? updateExpanded(node.children) : undefined,
        }))
      }
      return updateExpanded(prev)
    })
  }, [isAllExpanded])

  /**
   * 确认选择
   */
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

    const selectedValues = getSelectedValues(treeData)
    onConfirm(selectedValues)
  }, [onConfirm, treeData])

  /**
   * 过滤节点
   * @param nodes 树节点数组
   * @returns 过滤后的树节点数组
   */
  const filterNodes = useCallback((nodes: TreeNode[]): TreeNode[] => {
    if (!keyword) return nodes

    return nodes.map(node => {
      /** 节点自身匹配 */
      const selfMatches =
        node.name.method.toLowerCase().includes(keyword.toLowerCase()) ||
        node.name.pluginName.toLowerCase().includes(keyword.toLowerCase()) ||
        node.value.toLowerCase().includes(keyword.toLowerCase())

      /** 处理子节点 */
      const filteredChildren = node.children?.length
        ? filterNodes(node.children)
        : []

      /** 子节点有匹配 */
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

  /**
   * 渲染单个树节点
   * @param node 节点数据
   * @param depth 节点深度
   * @param nodeKey 节点唯一键
   */
  const renderTreeNode = useCallback((node: TreeNode, depth = 0, nodeKey: string) => {
    const hasChildren = !!node.children?.length

    return (
      <div
        key={nodeKey}
        className={`flex items-center py-2 px-3 rounded-2xl mb-1 transition-colors border ${node.selected
          ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 shadow'
          : 'hover:bg-gray-100 dark:hover:bg-gray-700 border-transparent'}
        `}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
      >
        {/** 展开/折叠按钮 */}
        <div className='w-8 flex justify-center mr-2'>
          {hasChildren
            ? (
              <button
                type='button'
                className='text-gray-500 hover:text-blue-600 transition-colors rounded-full p-1.5 w-8 h-8 hover:bg-gray-100 dark:hover:bg-gray-700'
                onClick={() => handleNodeToggle(node.id)}
                aria-label={node.expanded ? '折叠' : '展开'}
              >
                {node.expanded
                  ? <ChevronDown size={16} />
                  : <ChevronRight size={16} />}
              </button>
            )
            : <span className='w-8' />}
        </div>

        {/** 复选框 */}
        <Checkbox
          checked={node.selected}
          isSelected={node.selected}
          defaultSelected={node.selected}
          onChange={(e) => handleNodeSelect(node.id, e.target.checked)}
          color='primary'
          aria-checked={node.selected}
        />

        {/** 图标和名称 */}
        <div className='ml-2 flex items-center'>
          {node.type === 'package' && <Puzzle className='text-blue-500' size={16} />}
          {node.type === 'file' && <FileText className='text-gray-500' size={16} />}
          {node.type === 'command' && <Terminal className='text-gray-500' size={16} />}
          <span className='ml-1.5 text-sm'>
            {node.type === 'command'
              ? `${node.name.method}(${node.name.pluginName})`
              : node.name.method}
          </span>
        </div>

        {/** 选中标记 */}
        {node.selected && (
          <span className='ml-auto text-green-600'>
            <CheckCircle size={18} />
          </span>
        )}
      </div>
    )
  }, [handleNodeSelect, handleNodeToggle])

  /**
   * 渲染整棵树
   * @param nodes 树节点数组
   */
  const renderTree = useCallback((nodes: TreeNode[]) => {
    /** 记录渲染的所有元素 */
    const renderedItems: ReactElement[] = []

    /** 递归渲染树节点函数 */
    const renderNodes = (nodeList: TreeNode[], depth = 0, parentPath = '') => {
      nodeList.forEach((node, index) => {
        /** 为每个节点生成稳定且唯一的键 */
        const nodePath = `${parentPath}-${index}`
        /** 渲染当前节点 */
        renderedItems.push(renderTreeNode(node, depth, nodePath))

        /** 如果节点展开且有子节点，递归渲染子节点 */
        if (node.expanded && node.children?.length) {
          renderNodes(node.children, depth + 1, nodePath)
        }
      })
    }

    /** 从根节点开始渲染整棵树 */
    renderNodes(nodes)

    return renderedItems
  }, [renderTreeNode])

  /**
   * 计算选中数量
   */
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

  /**
   * 初始化和清理
   */
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

  /** 过滤树节点 */
  const filteredTree = keyword ? filterNodes(treeData) : treeData
  const selectedCount = getSelectedCount()
  const totalCount = treeData.length

  /** Dialog打开时隐藏小火箭，关闭时显示小火箭 */
  useEffect(() => {
    if (isOpen) {
      hideRocket()
    } else {
      showRocket()
    }
  }, [isOpen])

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
            <Puzzle className='mr-2 text-blue-500' size={20} />
            {title}
          </h2>
        </ModalHeader>

        {/** 节点类型说明 */}
        <div className='px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'>
          <div className='text-xs text-gray-500 dark:text-gray-400'>
            <div className='font-medium mb-1'>节点类型说明：</div>
            <div className='flex flex-col gap-1'>
              <div className='flex items-center'>
                <Puzzle className='text-blue-500 mr-1.5' size={14} />
                <span>插件包：根节点，选中后对整个插件包生效</span>
              </div>
              <div className='flex items-center'>
                <FileText className='text-gray-500 mr-1.5' size={14} />
                <span>文件：选中后对文件中的所有命令生效</span>
              </div>
              <div className='flex items-center'>
                <Terminal className='text-gray-500 mr-1.5' size={14} />
                <span>命令：选中后对插件包中的具体函数生效</span>
              </div>
            </div>
          </div>
        </div>

        {/** 使用flex-1替代固定高度，确保自适应 */}
        <div className='flex flex-col flex-1 max-h-[calc(100vh-13rem)] sm:max-h-[70vh]'>
          {/** 搜索和控制 */}
          <div className='p-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700'>
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
              <div className='flex gap-2'>
                <Button
                  size='sm'
                  variant='flat'
                  color='primary'
                  onPress={handleExpandAll}
                >
                  {isAllExpanded ? '折叠全部' : '展开全部'}
                </Button>
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
          </div>

          {/** 内容区域 - 允许滚动 */}
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
                : renderTree(filteredTree)}
          </div>

          {/** 底部操作栏 */}
          <div className='p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex justify-between items-center'>
            <div className='text-sm text-gray-500'>
              已选择 <span className='font-medium text-blue-600'>{selectedCount}</span> 项
            </div>
            <div className='flex space-x-2'>
              <Button
                variant='flat'
                onPress={onClose}
                className='px-3'
                size='sm'
              >
                取消
              </Button>
              <Button
                color='primary'
                onPress={handleConfirm}
                className='px-3'
                size='sm'
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
