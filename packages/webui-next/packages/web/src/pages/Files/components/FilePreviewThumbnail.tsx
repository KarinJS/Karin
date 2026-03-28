import { useMemo, useState } from 'react'
import { Icon } from '@iconify/react'
import { useTheme } from '@/hooks/useTheme'
import type { FileSystemItem } from '../types'
import { isImageFile, resolveFileContentUrl, resolveFileIcon } from '../utils'

interface FilePreviewThumbnailProps {
  item: FileSystemItem
  imageClassName?: string
  iconClassName?: string
  iconSize?: number
}

export const FilePreviewThumbnail = (props: FilePreviewThumbnailProps) => {
  const { isDark } = useTheme()
  const imageItem = props.item.type === 'file' && isImageFile(props.item.name)
  const [erroredPath, setErroredPath] = useState<string | null>(null)
  const iconMeta = resolveFileIcon(props.item, isDark)
  const previewUrl = useMemo<string>(() => {
    if (!imageItem) {
      return ''
    }
    return resolveFileContentUrl(props.item.relativePath)
  }, [imageItem, props.item.relativePath])
  const loadFailed = erroredPath === props.item.relativePath

  if (!imageItem || loadFailed) {
    return (
      <Icon
        icon={iconMeta.icon}
        width={props.iconSize || 24}
        height={props.iconSize || 24}
        className={`${iconMeta.className} ${props.iconClassName || ''}`.trim()}
      />
    )
  }

  return (
    <img
      src={previewUrl}
      alt={props.item.name}
      loading="lazy"
      className={props.imageClassName || 'h-full w-full object-cover'}
      onError={() => setErroredPath(props.item.relativePath)}
    />
  )
}
