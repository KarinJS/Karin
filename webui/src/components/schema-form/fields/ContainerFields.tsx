/**
 * 容器类和交互类字段组件
 */

import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Tooltip,
  ScrollShadow,
  Listbox,
  ListboxItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Breadcrumbs,
  BreadcrumbItem,
  Pagination,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Chip,
  useDisclosure,
} from '@heroui/react'
import { Icon } from '../Icon'
import { resolveI18n } from '../i18n'
import { useFieldRenderer } from '../FieldRendererContext'
import { useFormContext } from '../FormContext'
import type {
  ConditionExpression,
  CardFieldSchema,
  PopoverTriggerFieldSchema,
  TooltipFieldSchema,
  ModalTriggerFieldSchema,
  DrawerTriggerFieldSchema,
  ScrollAreaFieldSchema,
  ListboxFieldSchema,
  DropdownFieldSchema,
  BreadcrumbsFieldSchema,
  PaginationFieldSchema,
  TableFieldSchema,
} from '../types'

// Helper: 处理 disabled 可能是布尔值或条件表达式的情况
const getDisabled = (disabled: boolean | ConditionExpression | undefined): boolean => {
  return typeof disabled === 'boolean' ? disabled : false
}

// Card 卡片容器
export const CardField: React.FC<{ schema: CardFieldSchema }> = ({ schema }) => {
  const FieldRenderer = useFieldRenderer()
  const {
    title,
    subtitle,
    headerIcon,
    shadow = 'sm',
    radius = 'lg',
    isPressable = false,
  } = schema.options ?? {}

  return (
    <Card
      className="mb-4"
      shadow={shadow}
      radius={radius}
      isPressable={isPressable}
    >
      {(title || subtitle) && (
        <CardHeader className="flex gap-3">
          {headerIcon && <Icon name={headerIcon} size={24} />}
          <div className="flex flex-col">
            {title && <p className="text-md font-semibold">{resolveI18n(title)}</p>}
            {subtitle && <p className="text-small text-default-500">{resolveI18n(subtitle)}</p>}
          </div>
        </CardHeader>
      )}
      <CardBody>
        {schema.fields?.map((field) => (
          <FieldRenderer key={field.key} schema={field} />
        ))}
      </CardBody>
    </Card>
  )
}

// Popover 弹出框
export const PopoverTriggerField: React.FC<{ schema: PopoverTriggerFieldSchema }> = ({ schema }) => {
  const FieldRenderer = useFieldRenderer()
  const {
    triggerText,
    triggerVariant = 'flat',
    triggerColor = 'default',
    placement = 'bottom',
    title,
    showArrow = true,
  } = schema.options

  return (
    <div className="mb-4">
      {schema.label && (
        <label className="block text-sm font-medium text-default-700 mb-2">
          {resolveI18n(schema.label)}
        </label>
      )}
      <Popover placement={placement} showArrow={showArrow}>
        <PopoverTrigger>
          <Button variant={triggerVariant} color={triggerColor}>
            {resolveI18n(triggerText)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-4">
          {title && (
            <h4 className="font-semibold mb-2">{resolveI18n(title)}</h4>
          )}
          <div className="max-w-sm">
            {schema.fields?.map((field) => (
              <FieldRenderer key={field.key} schema={field} />
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

// Tooltip 工具提示
export const TooltipWrapperField: React.FC<{ schema: TooltipFieldSchema }> = ({ schema }) => {
  const FieldRenderer = useFieldRenderer()
  const {
    content,
    placement = 'top',
    color = 'default',
    delay = 0,
    closeDelay = 0,
  } = schema.options

  return (
    <Tooltip
      content={resolveI18n(content)}
      placement={placement}
      color={color}
      delay={delay}
      closeDelay={closeDelay}
    >
      <div className="inline-block">
        {schema.fields?.map((field) => (
          <FieldRenderer key={field.key} schema={field} />
        ))}
      </div>
    </Tooltip>
  )
}

// Modal 模态框
export const ModalTriggerField: React.FC<{ schema: ModalTriggerFieldSchema }> = ({ schema }) => {
  const FieldRenderer = useFieldRenderer()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    triggerText,
    triggerVariant = 'solid',
    triggerColor = 'primary',
    title,
    size = 'md',
    scrollBehavior = 'inside',
    hideCloseButton = false,
    isDismissable = true,
  } = schema.options

  return (
    <div className="mb-4">
      {schema.label && (
        <label className="block text-sm font-medium text-default-700 mb-2">
          {resolveI18n(schema.label)}
        </label>
      )}
      <Button
        variant={triggerVariant}
        color={triggerColor}
        onPress={onOpen}
        isDisabled={getDisabled(schema.disabled)}
      >
        {resolveI18n(triggerText)}
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={size}
        scrollBehavior={scrollBehavior}
        hideCloseButton={hideCloseButton}
        isDismissable={isDismissable}
      >
        <ModalContent>
          <ModalHeader>
            {title ? resolveI18n(title) : resolveI18n(triggerText)}
          </ModalHeader>
          <ModalBody>
            {schema.fields?.map((field) => (
              <FieldRenderer key={field.key} schema={field} />
            ))}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              关闭
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

// Drawer 抽屉
export const DrawerTriggerField: React.FC<{ schema: DrawerTriggerFieldSchema }> = ({ schema }) => {
  const FieldRenderer = useFieldRenderer()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    triggerText,
    triggerVariant = 'solid',
    triggerColor = 'primary',
    title,
    placement = 'right',
    size = 'md',
  } = schema.options

  return (
    <div className="mb-4">
      {schema.label && (
        <label className="block text-sm font-medium text-default-700 mb-2">
          {resolveI18n(schema.label)}
        </label>
      )}
      <Button
        variant={triggerVariant}
        color={triggerColor}
        onPress={onOpen}
        isDisabled={getDisabled(schema.disabled)}
      >
        {resolveI18n(triggerText)}
      </Button>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement={placement}
        size={size}
      >
        <DrawerContent>
          <DrawerHeader>
            {title ? resolveI18n(title) : resolveI18n(triggerText)}
          </DrawerHeader>
          <DrawerBody>
            {schema.fields?.map((field) => (
              <FieldRenderer key={field.key} schema={field} />
            ))}
          </DrawerBody>
          <DrawerFooter>
            <Button variant="light" onPress={onClose}>
              关闭
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

// ScrollArea 滚动区域
export const ScrollAreaField: React.FC<{ schema: ScrollAreaFieldSchema }> = ({ schema }) => {
  const FieldRenderer = useFieldRenderer()
  const {
    maxHeight = 300,
    hideScrollBar = false,
    orientation = 'vertical',
    size = 'md',
  } = schema.options ?? {}

  return (
    <div className="mb-4">
      {schema.label && (
        <label className="block text-sm font-medium text-default-700 mb-2">
          {resolveI18n(schema.label)}
        </label>
      )}
      <ScrollShadow
        style={{ maxHeight }}
        hideScrollBar={hideScrollBar}
        orientation={orientation}
        size={size === 'sm' ? 20 : 40}
        className="p-2 border border-default-200 rounded-lg"
      >
        {schema.fields?.map((field) => (
          <FieldRenderer key={field.key} schema={field} />
        ))}
      </ScrollShadow>
    </div>
  )
}

// Listbox 列表框
export const ListboxField: React.FC<{ schema: ListboxFieldSchema }> = ({ schema }) => {
  const { getValue, setValue } = useFormContext()
  const value = getValue(schema.key)
  const {
    items,
    selectionMode = 'single',
    variant = 'flat',
    color = 'default',
    emptyContent,
  } = schema.options

  const handleSelectionChange = (keys: Set<string> | 'all') => {
    if (keys === 'all') {
      setValue(schema.key, items.map((i) => String(i.value)))
    } else {
      const selected = Array.from(keys)
      setValue(schema.key, selectionMode === 'single' ? selected[0] : selected)
    }
  }

  const selectedKeys = new Set<string>(
    selectionMode === 'multiple'
      ? ((value as string[]) ?? [])
      : value ? [String(value)] : []
  )

  return (
    <div className="mb-4">
      {schema.label && (
        <label className="block text-sm font-medium text-default-700 mb-2">
          {resolveI18n(schema.label)}
        </label>
      )}
      <Listbox
        aria-label={resolveI18n(schema.label)}
        selectionMode={selectionMode}
        selectedKeys={selectedKeys}
        onSelectionChange={handleSelectionChange as (keys: 'all' | Set<React.Key>) => void}
        variant={variant}
        color={color}
        emptyContent={emptyContent ? resolveI18n(emptyContent) : undefined}
        className="border border-default-200 rounded-lg max-h-50 overflow-auto"
      >
        {items.map((item) => (
          <ListboxItem
            key={String(item.value)}
            description={item.description ? resolveI18n(item.description) : undefined}
            startContent={item.icon ? <Icon name={item.icon} size={16} /> : undefined}
            isDisabled={item.disabled}
          >
            {resolveI18n(item.label)}
          </ListboxItem>
        ))}
      </Listbox>
      {schema.description && (
        <p className="text-xs text-default-400 mt-1">
          {resolveI18n(schema.description)}
        </p>
      )}
    </div>
  )
}

// Dropdown 下拉菜单
export const DropdownField: React.FC<{ schema: DropdownFieldSchema }> = ({ schema }) => {
  const { getValue, setValue } = useFormContext()
  const value = getValue(schema.key)
  const {
    triggerText,
    triggerVariant = 'flat',
    triggerColor = 'default',
    items,
    selectionMode = 'none',
  } = schema.options

  const handleAction = (key: React.Key) => {
    if (selectionMode !== 'none') {
      setValue(schema.key, key)
    }
    console.log('Dropdown action:', key)
  }

  const selectedKeys = new Set<string>(value ? [String(value)] : [])

  return (
    <div className="mb-4">
      {schema.label && (
        <label className="block text-sm font-medium text-default-700 mb-2">
          {resolveI18n(schema.label)}
        </label>
      )}
      <Dropdown>
        <DropdownTrigger>
          <Button
            variant={triggerVariant}
            color={triggerColor}
            isDisabled={getDisabled(schema.disabled)}
          >
            {resolveI18n(triggerText)}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label={resolveI18n(schema.label)}
          onAction={handleAction}
          selectionMode={selectionMode}
          selectedKeys={selectedKeys}
        >
          {items.map((item) =>
            item.isDivider ? (
              <DropdownItem key={item.key} className="h-px bg-default-200" textValue="divider" />
            ) : (
              <DropdownItem
                key={item.key}
                description={item.description ? resolveI18n(item.description) : undefined}
                startContent={item.icon ? <Icon name={item.icon} size={16} /> : undefined}
                color={item.color}
                isDisabled={item.isDisabled}
              >
                {resolveI18n(item.label)}
              </DropdownItem>
            )
          )}
        </DropdownMenu>
      </Dropdown>
      {schema.description && (
        <p className="text-xs text-default-400 mt-1">
          {resolveI18n(schema.description)}
        </p>
      )}
    </div>
  )
}

// Breadcrumbs 面包屑
export const BreadcrumbsField: React.FC<{ schema: BreadcrumbsFieldSchema }> = ({ schema }) => {
  const {
    items,
    separator,
    size = 'md',
    underline = 'hover',
    color = 'foreground',
  } = schema.options

  return (
    <div className="mb-4">
      {schema.label && (
        <label className="block text-sm font-medium text-default-700 mb-2">
          {resolveI18n(schema.label)}
        </label>
      )}
      <Breadcrumbs
        separator={separator}
        size={size}
        underline={underline}
        color={color}
      >
        {items.map((item, index) => (
          <BreadcrumbItem
            key={index}
            href={item.href}
            isCurrent={item.isCurrent}
            startContent={item.icon ? <Icon name={item.icon} size={14} /> : undefined}
          >
            {resolveI18n(item.label)}
          </BreadcrumbItem>
        ))}
      </Breadcrumbs>
    </div>
  )
}

// Pagination 分页
export const PaginationField: React.FC<{ schema: PaginationFieldSchema }> = ({ schema }) => {
  const { getValue, setValue } = useFormContext()
  const value = (getValue(schema.key) as number) ?? 1
  const {
    total,
    pageSize = 10,
    showControls = true,
    color = 'primary',
    variant = 'flat',
    size = 'md',
  } = schema.options ?? { total: 1 }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="mb-4">
      {schema.label && (
        <label className="block text-sm font-medium text-default-700 mb-2">
          {resolveI18n(schema.label)}
        </label>
      )}
      <Pagination
        total={totalPages}
        page={value}
        onChange={(page) => setValue(schema.key, page)}
        showControls={showControls}
        color={color}
        variant={variant}
        size={size}
        isDisabled={getDisabled(schema.disabled)}
      />
      {schema.description && (
        <p className="text-xs text-default-400 mt-1">
          {resolveI18n(schema.description)}
        </p>
      )}
    </div>
  )
}

// Table 表格
export const TableField: React.FC<{ schema: TableFieldSchema }> = ({ schema }) => {
  const { getValue } = useFormContext()
  const {
    columns,
    dataKey,
    selectionMode = 'none',
    isStriped = false,
    isCompact = false,
    showPagination = false,
    pageSize = 10,
    emptyContent,
  } = schema.options

  const data = (getValue(dataKey) as Record<string, unknown>[]) ?? []
  const [page, setPage] = useState(1)

  const paginatedData = showPagination
    ? data.slice((page - 1) * pageSize, page * pageSize)
    : data

  const renderCell = (row: Record<string, unknown>, column: typeof columns[0]) => {
    const value = row[column.field]

    if (column.format === 'boolean') {
      return (
        <Chip color={value ? 'success' : 'danger'} size="sm" variant="flat">
          {value ? '是' : '否'}
        </Chip>
      )
    }

    if (column.format === 'date' && value) {
      return new Date(value as string).toLocaleDateString()
    }

    if (column.format === 'badge') {
      return (
        <Chip size="sm" variant="flat">
          {String(value ?? '')}
        </Chip>
      )
    }

    return String(value ?? '')
  }

  return (
    <div className="mb-4">
      {schema.label && (
        <label className="block text-sm font-medium text-default-700 mb-2">
          {resolveI18n(schema.label)}
        </label>
      )}
      <Table
        aria-label={resolveI18n(schema.label)}
        selectionMode={selectionMode}
        isStriped={isStriped}
        isCompact={isCompact}
      >
        <TableHeader>
          {columns.map((col) => (
            <TableColumn
              key={col.field}
              width={typeof col.width === 'number' ? col.width : undefined}
              allowsSorting={col.sortable}
            >
              {resolveI18n(col.title)}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody emptyContent={emptyContent ? resolveI18n(emptyContent) : '暂无数据'}>
          {paginatedData.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((col) => (
                <TableCell key={col.field}>
                  {renderCell(row, col)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {showPagination && data.length > pageSize && (
        <div className="flex justify-center mt-4">
          <Pagination
            total={Math.ceil(data.length / pageSize)}
            page={page}
            onChange={setPage}
          />
        </div>
      )}
      {schema.description && (
        <p className="text-xs text-default-400 mt-1">
          {resolveI18n(schema.description)}
        </p>
      )}
    </div>
  )
}
