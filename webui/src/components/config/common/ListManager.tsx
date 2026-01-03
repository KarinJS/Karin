import { useState } from 'react'
import {
  Input,
  Button,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  useDisclosure
} from "@heroui/react"
import { Plus, Upload, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ListManagerProps {
  /** 列表标题 */
  title: string
  /** 列表描述 */
  description?: string
  /** 当前列表数据 */
  items: string[]
  /** 列表更新回调 */
  onChange: (items: string[]) => void
  /** 输入框占位符 */
  placeholder?: string
  /** Chip 颜色 */
  chipColor?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  /** 是否允许批量导入 */
  allowBulkImport?: boolean
  /** 是否显示清空按钮 */
  showClearAll?: boolean
}

/**
 * 通用列表管理组件
 * 用于管理 master/admin 列表、黑白名单等
 */
export function ListManager ({
  title,
  description,
  items,
  onChange,
  placeholder = '输入ID后回车添加',
  chipColor = 'primary',
  allowBulkImport = true,
  showClearAll = true
}: ListManagerProps) {
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [bulkText, setBulkText] = useState('')

  const addItem = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return
    if (items.includes(trimmed)) return
    onChange([...items, trimmed])
    setInputValue('')
  }

  const removeItem = (value: string) => {
    onChange(items.filter(item => item !== value))
  }

  const clearAll = () => {
    onChange([])
  }

  const handleBulkImport = () => {
    const lines = bulkText
      .split(/[\n,;，；]/)
      .map(s => s.trim())
      .filter(s => s && !items.includes(s))
    if (lines.length > 0) {
      onChange([...items, ...lines])
    }
    setBulkText('')
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addItem(inputValue)
    }
  }

  return (
    <div className="p-4 rounded-xl bg-default-50 border border-default-200">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-medium">{title}</h3>
          {description && (
            <p className="text-sm text-default-500 mt-0.5">{description}</p>
          )}
        </div>
        <div className="flex gap-2">
          {allowBulkImport && (
            <Button
              size="sm"
              variant="flat"
              startContent={<Upload size={16} />}
              onPress={onOpen}
            >
              {t('common.bulkImport', '批量导入')}
            </Button>
          )}
          {showClearAll && items.length > 0 && (
            <Button
              size="sm"
              variant="flat"
              color="danger"
              startContent={<Trash2 size={16} />}
              onPress={clearAll}
            >
              {t('common.clearAll', '清空')}
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-3">
        <Input
          placeholder={placeholder}
          value={inputValue}
          onValueChange={setInputValue}
          onKeyDown={handleKeyDown}
          size="sm"
          className="flex-1"
        />
        <Button
          isIconOnly
          size="sm"
          color="primary"
          onPress={() => addItem(inputValue)}
        >
          <Plus size={18} />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 min-h-8">
        {items.map((item) => (
          <Chip
            key={item}
            onClose={() => removeItem(item)}
            variant="flat"
            color={chipColor}
          >
            {item}
          </Chip>
        ))}
        {items.length === 0 && (
          <p className="text-default-400 text-sm italic">
            {t('common.noItems', '暂无数据')}
          </p>
        )}
      </div>

      {/* 批量导入弹窗 */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          <ModalHeader>{t('common.bulkImport', '批量导入')}</ModalHeader>
          <ModalBody>
            <p className="text-sm text-default-500 mb-2">
              {t('common.bulkImportHint', '每行一个，或使用逗号、分号分隔')}
            </p>
            <Textarea
              placeholder="123456789&#10;987654321&#10;..."
              value={bulkText}
              onValueChange={setBulkText}
              minRows={6}
              maxRows={12}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              {t('common.cancel', '取消')}
            </Button>
            <Button color="primary" onPress={handleBulkImport}>
              {t('common.import', '导入')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
