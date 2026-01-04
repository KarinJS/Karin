/**
 * 展示类字段组件 - 用于展示信息而非输入
 */

import React from 'react'
import {
  Progress,
  Avatar,
  Chip,
  Link,
  User,
  Snippet,
  Image,
  Button,
  Spacer,
  Skeleton,
} from '@heroui/react'
import { Icon } from '../Icon'
import { resolveI18n } from '../i18n'
import type {
  ProgressFieldSchema,
  AvatarFieldSchema,
  ChipFieldSchema,
  LinkFieldSchema,
  UserCardFieldSchema,
  SnippetFieldSchema,
  ImageFieldSchema,
  ButtonFieldSchema,
  SpacerFieldSchema,
  SkeletonFieldSchema,
} from '../types'
import { useFormContext } from '../FormContext'

// Progress 进度条
export const ProgressField: React.FC<{ schema: ProgressFieldSchema }> = ({ schema }) => {
  const { getValue } = useFormContext()
  const value = (getValue(schema.key) as number) ?? (schema.defaultValue as number) ?? 0
  const { color = 'primary', size = 'md', showValueLabel = true } = schema.options ?? {}

  return (
    <div className="mb-4">
      <Progress
        label={resolveI18n(schema.label)}
        value={value}
        color={color}
        size={size}
        showValueLabel={showValueLabel}
        className="max-w-md"
      />
      {schema.description && (
        <p className="text-xs text-default-400 mt-1">
          {resolveI18n(schema.description)}
        </p>
      )}
    </div>
  )
}

// Avatar 头像
export const AvatarField: React.FC<{ schema: AvatarFieldSchema }> = ({ schema }) => {
  const { getValue } = useFormContext()
  const value = (getValue(schema.key) as string) ?? (schema.defaultValue as string) ?? ''
  const {
    size = 'md',
    radius = 'full',
    isBordered = false,
    color = 'default',
  } = schema.options ?? {}

  return (
    <div className="mb-4">
      {schema.label && (
        <label className="block text-sm font-medium text-default-700 mb-2">
          {resolveI18n(schema.label)}
        </label>
      )}
      <Avatar
        src={value}
        name={resolveI18n(schema.label)}
        size={size}
        radius={radius}
        isBordered={isBordered}
        color={color}
      />
      {schema.description && (
        <p className="text-xs text-default-400 mt-1">
          {resolveI18n(schema.description)}
        </p>
      )}
    </div>
  )
}

// Chip 标签
export const ChipField: React.FC<{ schema: ChipFieldSchema }> = ({ schema }) => {
  const { getValue } = useFormContext()
  const value = (getValue(schema.key) as string) ?? (schema.defaultValue as string) ?? ''
  const {
    color = 'default',
    size = 'md',
    variant = 'solid',
    radius = 'full',
  } = schema.options ?? {}

  return (
    <div className="mb-4">
      {schema.label && (
        <label className="block text-sm font-medium text-default-700 mb-2">
          {resolveI18n(schema.label)}
        </label>
      )}
      <Chip color={color} size={size} variant={variant} radius={radius}>
        {value || resolveI18n(schema.label)}
      </Chip>
    </div>
  )
}

// Link 链接
export const LinkField: React.FC<{ schema: LinkFieldSchema }> = ({ schema }) => {
  const {
    href,
    text,
    isExternal = false,
    showAnchorIcon = false,
    color = 'primary',
    underline = 'hover',
  } = schema.options

  return (
    <div className="mb-4">
      {schema.label && (
        <label className="block text-sm font-medium text-default-700 mb-2">
          {resolveI18n(schema.label)}
        </label>
      )}
      <Link
        href={href}
        isExternal={isExternal}
        showAnchorIcon={showAnchorIcon}
        color={color}
        underline={underline}
      >
        {resolveI18n(text)}
      </Link>
      {schema.description && (
        <p className="text-xs text-default-400 mt-1">
          {resolveI18n(schema.description)}
        </p>
      )}
    </div>
  )
}

// UserCard 用户卡片
export const UserCardField: React.FC<{ schema: UserCardFieldSchema }> = ({ schema }) => {
  const { getValue } = useFormContext()
  const { nameField, descriptionField, avatarField } = schema.options ?? {}

  const name = nameField ? (getValue(nameField) as string) : ''
  const description = descriptionField ? (getValue(descriptionField) as string) : undefined
  const avatar = avatarField ? (getValue(avatarField) as string) : undefined

  return (
    <div className="mb-4">
      {schema.label && (
        <label className="block text-sm font-medium text-default-700 mb-2">
          {resolveI18n(schema.label)}
        </label>
      )}
      <User
        name={name || resolveI18n(schema.label)}
        description={description}
        avatarProps={{ src: avatar }}
      />
    </div>
  )
}

// Snippet 代码片段
export const SnippetField: React.FC<{ schema: SnippetFieldSchema }> = ({ schema }) => {
  const { getValue } = useFormContext()
  const value = (getValue(schema.key) as string) ?? (schema.defaultValue as string) ?? ''
  const {
    symbol = '$',
    color = 'default',
    size = 'md',
    hideCopyButton = false,
    hideSymbol = false,
  } = schema.options ?? {}

  return (
    <div className="mb-4">
      {schema.label && (
        <label className="block text-sm font-medium text-default-700 mb-2">
          {resolveI18n(schema.label)}
        </label>
      )}
      <Snippet
        symbol={hideSymbol ? '' : symbol}
        color={color}
        size={size}
        hideCopyButton={hideCopyButton}
      >
        {value}
      </Snippet>
      {schema.description && (
        <p className="text-xs text-default-400 mt-1">
          {resolveI18n(schema.description)}
        </p>
      )}
    </div>
  )
}

// Image 图片
export const ImageField: React.FC<{ schema: ImageFieldSchema }> = ({ schema }) => {
  const {
    src,
    alt,
    width,
    height,
    radius = 'lg',
    isBlurred = false,
    isZoomed = false,
    fallbackSrc,
  } = schema.options ?? { src: '' }

  return (
    <div className="mb-4">
      {schema.label && (
        <label className="block text-sm font-medium text-default-700 mb-2">
          {resolveI18n(schema.label)}
        </label>
      )}
      <Image
        src={src}
        alt={alt ? resolveI18n(alt) : undefined}
        width={width}
        height={height}
        radius={radius}
        isBlurred={isBlurred}
        isZoomed={isZoomed}
        fallbackSrc={fallbackSrc}
      />
      {schema.description && (
        <p className="text-xs text-default-400 mt-1">
          {resolveI18n(schema.description)}
        </p>
      )}
    </div>
  )
}

// Button 按钮
export const ButtonField: React.FC<{ schema: ButtonFieldSchema }> = ({ schema }) => {
  const { values } = useFormContext()
  const {
    text,
    color = 'primary',
    variant = 'solid',
    size = 'md',
    icon,
    iconPosition = 'start',
    action,
    isLoading = false,
    fullWidth = false,
  } = schema.options

  const handleClick = () => {
    if (!action) return

    switch (action.type) {
      case 'submit':
        console.log('Form submitted:', values)
        break
      case 'reset':
        console.log('Form reset requested')
        break
      case 'link':
        if (action.href) {
          window.open(action.href, '_blank')
        }
        break
      case 'custom':
        if (action.customAction) {
          console.log('Custom action:', action.customAction)
        }
        break
    }
  }

  const iconElement = icon ? <Icon name={icon} size={16} /> : undefined

  // 处理 disabled 可能是条件表达式的情况
  const isDisabled = typeof schema.disabled === 'boolean' ? schema.disabled : false

  return (
    <div className="mb-4">
      <Button
        color={color}
        variant={variant}
        size={size}
        isLoading={isLoading}
        isDisabled={isDisabled}
        fullWidth={fullWidth}
        startContent={iconPosition === 'start' ? iconElement : undefined}
        endContent={iconPosition === 'end' ? iconElement : undefined}
        onPress={handleClick}
      >
        {resolveI18n(text)}
      </Button>
    </div>
  )
}

// Spacer 间距
export const SpacerField: React.FC<{ schema: SpacerFieldSchema }> = ({ schema }) => {
  const { x = 1, y = 4 } = schema.options ?? {}

  return <Spacer x={x as 1} y={y as 4} />
}

// Skeleton 骨架屏
export const SkeletonField: React.FC<{ schema: SkeletonFieldSchema }> = ({ schema }) => {
  const { variant = 'text', width, height, lines = 3 } = schema.options ?? {}

  if (variant === 'text') {
    return (
      <div className="mb-4 space-y-2">
        {schema.label && (
          <label className="block text-sm font-medium text-default-700 mb-2">
            {resolveI18n(schema.label)}
          </label>
        )}
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (variant === 'circular') {
    return (
      <div className="mb-4">
        {schema.label && (
          <label className="block text-sm font-medium text-default-700 mb-2">
            {resolveI18n(schema.label)}
          </label>
        )}
        <Skeleton className="rounded-full" style={{ width: width ?? 48, height: height ?? 48 }} />
      </div>
    )
  }

  if (variant === 'rectangular') {
    return (
      <div className="mb-4">
        {schema.label && (
          <label className="block text-sm font-medium text-default-700 mb-2">
            {resolveI18n(schema.label)}
          </label>
        )}
        <Skeleton className="rounded-none" style={{ width: width ?? '100%', height: height ?? 100 }} />
      </div>
    )
  }

  // rounded variant
  return (
    <div className="mb-4">
      {schema.label && (
        <label className="block text-sm font-medium text-default-700 mb-2">
          {resolveI18n(schema.label)}
        </label>
      )}
      <Skeleton className="rounded-lg" style={{ width: width ?? '100%', height: height ?? 100 }} />
    </div>
  )
}
