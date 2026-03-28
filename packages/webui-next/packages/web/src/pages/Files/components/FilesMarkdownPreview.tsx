import { useEffect, useMemo, useState } from 'react'
import { Button, Tooltip } from '@heroui/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import type { FileSystemItem } from '../types'
import 'katex/dist/katex.min.css'
import 'github-markdown-css/github-markdown.css'
import './markdown-preview.css'

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
 * 底部 Markdown 预览属性
 */
interface FilesMarkdownPreviewProps {
  /** 预览项 */
  previews: MarkdownPreviewItem[]
}

/**
 * 文件列表底部 Markdown 预览
 * @param props 预览属性
 * @returns 预览节点
 */
export const FilesMarkdownPreview = (props: FilesMarkdownPreviewProps) => {
  const [collapsedPreviewPathSet, setCollapsedPreviewPathSet] = useState<Set<string>>(new Set())

  /**
   * 判断是否为 README 文件
   * @param file 文件项
   * @returns 是否是 README
   */
  const isReadmePreviewItem = (file: FileSystemItem): boolean => {
    return /^readme\.md$/i.test(file.name)
  }

  /**
   * 默认收起路径集合（README 除外）
   */
  const defaultCollapsedPathSet = useMemo<Set<string>>(() => {
    return new Set(
      props.previews
        .filter((previewItem) => !isReadmePreviewItem(previewItem.file))
        .map((previewItem) => previewItem.file.relativePath)
    )
  }, [props.previews])

  /**
   * 同步默认收起状态
   * @returns void
   */
  useEffect(() => {
    setCollapsedPreviewPathSet(defaultCollapsedPathSet)
  }, [defaultCollapsedPathSet])

  /**
   * 切换预览展开状态
   * @param relativePath 相对路径
   * @returns void
   */
  const togglePreview = (relativePath: string): void => {
    setCollapsedPreviewPathSet((previousSet) => {
      const nextSet = new Set(previousSet)
      if (nextSet.has(relativePath)) {
        nextSet.delete(relativePath)
      } else {
        nextSet.add(relativePath)
      }
      return nextSet
    })
  }

  /**
   * 获取预览切换文案
   * @param relativePath 相对路径
   * @returns 切换文案
   */
  const resolvePreviewToggleText = (relativePath: string): string => {
    return collapsedPreviewPathSet.has(relativePath) ? '展开' : '收起'
  }

  if (props.previews.length === 0) {
    return null
  }
  return (
    <div className="mt-3 px-2 pb-4 space-y-4">
      {props.previews.map((previewItem) => (
        <section key={previewItem.file.relativePath} className="space-y-3 group/preview">
          <div className="flex items-center justify-between gap-3">
            <Tooltip delay={0}>
              <Tooltip.Trigger>
                <h3 className="text-lg font-semibold text-foreground">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-auto min-w-0 justify-start rounded-sm px-0 py-0 text-lg font-semibold text-foreground hover:text-accent"
                    onPress={() => togglePreview(previewItem.file.relativePath)}
                  >
                    {previewItem.file.name}
                  </Button>
                </h3>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>
                  点击以
                  <span className="font-bold">
                    {resolvePreviewToggleText(previewItem.file.relativePath)}
                  </span>
                  预览
                </p>
              </Tooltip.Content>
            </Tooltip>
            <div className="min-w-22 flex justify-end opacity-0 pointer-events-none transition-opacity group-hover/preview:opacity-100 group-hover/preview:pointer-events-auto">
              <Tooltip delay={0}>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-accent hover:text-accent-hover"
                  onPress={() => togglePreview(previewItem.file.relativePath)}
                >
                  {resolvePreviewToggleText(previewItem.file.relativePath)}
                </Button>
                <Tooltip.Content><p>{resolvePreviewToggleText(previewItem.file.relativePath)}</p></Tooltip.Content>
              </Tooltip>
            </div>
          </div>
          {!collapsedPreviewPathSet.has(previewItem.file.relativePath) && (
            <div className={`${isReadmePreviewItem(previewItem.file) ? '' : 'max-h-[42vh] overflow-y-auto custom-scrollbar'} rounded-xl border border-border bg-background px-5 py-4`}>
              <article className="markdown-body markdown-theme-adaptive">
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeRaw, rehypeKatex]}>
                  {previewItem.content}
                </ReactMarkdown>
              </article>
            </div>
          )}
        </section>
      ))}
    </div>
  )
}
