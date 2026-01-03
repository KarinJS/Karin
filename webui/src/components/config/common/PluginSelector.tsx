import { useState, useEffect, useCallback, useMemo } from 'react'
import type { SharedSelection } from '@heroui/react'
import {
  Select,
  SelectItem,
  Chip,
  Spinner,
  Input,
} from '@heroui/react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Search, Package, X } from 'lucide-react'
import { getPluginPackages } from '../../../api'
import type { PluginPackageInfo, PluginPackageType } from '../../../api/modules/plugin'

export interface PluginSelectorProps {
  /** 已选中的插件包名列表 */
  value: string[]
  /** 选择变化回调 */
  onChange: (value: string[]) => void
  /** 是否多选 */
  multiple?: boolean
  /** 标签 */
  label?: string
  /** 描述 */
  description?: string
  /** 占位符 */
  placeholder?: string
  /** 是否禁用 */
  isDisabled?: boolean
  /** 过滤包类型 */
  filterTypes?: PluginPackageType[]
  /** 自定义类名 */
  className?: string
  /** 是否显示包类型标签 */
  showTypeChip?: boolean
  /** 是否显示搜索框 */
  showSearch?: boolean
}

/**
 * 插件选择器组件
 * 用于选择一个或多个插件包
 */
export function PluginSelector ({
  value,
  onChange,
  multiple = true,
  label,
  description,
  placeholder,
  isDisabled = false,
  filterTypes,
  className,
  showTypeChip = true,
  showSearch = true,
}: PluginSelectorProps) {
  const { t } = useTranslation()
  const [packages, setPackages] = useState<PluginPackageInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // 加载插件包列表
  useEffect(() => {
    const loadPackages = async () => {
      try {
        const res = await getPluginPackages()
        if (res.ok && res.data) {
          setPackages(res.data)
        }
      } catch (error) {
        console.error(error)
        toast.error(t('plugin.loadError', '加载插件列表失败'))
      } finally {
        setLoading(false)
      }
    }
    loadPackages()
  }, [t])

  // 过滤后的包列表
  const filteredPackages = useMemo(() => {
    let result = packages

    // 按类型过滤
    if (filterTypes && filterTypes.length > 0) {
      result = result.filter(pkg => filterTypes.includes(pkg.type))
    }

    // 按搜索词过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(pkg =>
        pkg.name.toLowerCase().includes(query) ||
        pkg.type.toLowerCase().includes(query)
      )
    }

    return result
  }, [packages, filterTypes, searchQuery])

  // 处理选择变化
  const handleSelectionChange = useCallback((keys: SharedSelection) => {
    if (keys === 'all') {
      onChange(filteredPackages.map(p => p.name))
    } else {
      onChange([...keys].map(String))
    }
  }, [onChange, filteredPackages])

  // 移除单个选中项
  const handleRemove = useCallback((name: string) => {
    onChange(value.filter(v => v !== name))
  }, [value, onChange])

  // 获取包类型对应的颜色
  const getTypeColor = (type: PluginPackageType): 'primary' | 'secondary' | 'success' => {
    switch (type) {
      case 'npm': return 'primary'
      case 'dev': return 'secondary'
      case 'apps': return 'success'
      default: return 'primary'
    }
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <Spinner size="sm" />
        <span className="ml-2 text-default-500">{t('plugin.loading', '加载中...')}</span>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* 搜索框 */}
      {showSearch && (
        <Input
          placeholder={t('plugin.searchPlaceholder', '搜索插件包...')}
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={<Search size={16} className="text-default-400" />}
          size="sm"
          className="mb-3"
          isClearable
          onClear={() => setSearchQuery('')}
        />
      )}

      {/* 选择器 */}
      <Select
        label={label || t('plugin.selectLabel', '选择插件包')}
        description={description}
        placeholder={placeholder || t('plugin.selectPlaceholder', '请选择插件包')}
        selectionMode={multiple ? 'multiple' : 'single'}
        selectedKeys={new Set(value)}
        onSelectionChange={handleSelectionChange}
        isDisabled={isDisabled}
        classNames={{
          trigger: 'min-h-12',
        }}
        renderValue={(items) => {
          if (items.length === 0) return null
          return (
            <div className="flex flex-wrap gap-1">
              {items.map(item => (
                <Chip
                  key={item.key}
                  size="sm"
                  variant="flat"
                  onClose={() => handleRemove(String(item.key))}
                >
                  {item.textValue}
                </Chip>
              ))}
            </div>
          )
        }}
      >
        {filteredPackages.map(pkg => (
          <SelectItem
            key={pkg.name}
            textValue={pkg.name}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Package size={16} className="text-default-400" />
                <span>{pkg.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {showTypeChip && (
                  <Chip size="sm" variant="flat" color={getTypeColor(pkg.type)}>
                    {pkg.type}
                  </Chip>
                )}
                <Chip size="sm" variant="flat" color="default">
                  {pkg.pluginCount} {t('plugin.pluginCount', '个')}
                </Chip>
              </div>
            </div>
          </SelectItem>
        ))}
      </Select>

      {/* 已选中的标签展示（用于非下拉场景） */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {value.map(name => {
            const pkg = packages.find(p => p.name === name)
            return (
              <Chip
                key={name}
                variant="flat"
                color={pkg ? getTypeColor(pkg.type) : 'default'}
                onClose={() => handleRemove(name)}
                endContent={<X size={12} />}
              >
                {name}
              </Chip>
            )
          })}
        </div>
      )}

      {/* 统计信息 */}
      <div className="flex items-center gap-4 mt-3 text-sm text-default-500">
        <span>{t('plugin.totalPackages', '共')} {filteredPackages.length} {t('plugin.packages', '个包')}</span>
        <span>{t('plugin.selected', '已选')} {value.length} {t('plugin.items', '项')}</span>
      </div>
    </div>
  )
}

export default PluginSelector
