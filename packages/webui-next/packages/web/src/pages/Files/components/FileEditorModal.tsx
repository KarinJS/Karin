import { useEffect, useMemo, useState } from 'react'
import { Button, Modal, Spinner, Tooltip, toast } from '@heroui/react'
import Editor from '@monaco-editor/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import { FiCopy, FiRotateCcw, FiRotateCw, FiZoomIn, FiZoomOut } from 'react-icons/fi'
import type { FileSystemItem } from '../types'
import {
  isImageFile,
  isMarkdownFile,
  isPdfFile,
  isTextEditableFile,
  isVideoFile,
  resolveEditorLanguage,
  resolveFileContentUrl
} from '../utils'
import 'katex/dist/katex.min.css'
import 'github-markdown-css/github-markdown.css'
import './markdown-preview.css'

interface FileEditorModalProps {
  isOpen: boolean
  loading: boolean
  selectedFile: FileSystemItem | null
  draftContent: string
  isDark: boolean
  onOpenChange: (open: boolean) => void
  onChangeDraft: (value: string) => void
  onSaveRequest: () => void
}

interface ImagePreviewPanelProps {
  fileName: string
  previewUrl: string
}

const ImagePreviewPanel = (props: ImagePreviewPanelProps) => {
  const [imageScale, setImageScale] = useState<number>(1)
  const [imageRotate, setImageRotate] = useState<number>(0)

  const adjustImageScale = (delta: number): void => {
    setImageScale((previousScale) => {
      const nextScale = previousScale + delta
      return Math.min(4, Math.max(0.25, Number(nextScale.toFixed(2))))
    })
  }

  const resetImageTransform = (): void => {
    setImageScale(1)
    setImageRotate(0)
  }

  return (
    <div className="h-full min-h-0 flex flex-col">
      <div className="flex-1 min-h-0 overflow-auto">
        <div className="h-full min-h-100 flex items-center justify-center p-5 bg-background/40">
          <img
            src={props.previewUrl}
            alt={props.fileName}
            className="max-h-full max-w-full object-contain"
            style={{
              transform: `scale(${imageScale}) rotate(${imageRotate}deg)`,
              transformOrigin: 'center center',
              transition: 'transform 180ms ease'
            }}
          />
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-background/70 px-4 py-3">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="h-10"
            onPress={() => adjustImageScale(-0.2)}
            isDisabled={imageScale <= 0.25}
          >
            <FiZoomOut size={15} />
            缩小
          </Button>
          <span className="min-w-14 text-center text-xs text-default-500">{Math.round(imageScale * 100)}%</span>
          <Button
            size="sm"
            variant="secondary"
            className="h-10"
            onPress={() => adjustImageScale(0.2)}
            isDisabled={imageScale >= 4}
          >
            <FiZoomIn size={15} />
            放大
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-10"
            onPress={() => setImageRotate((prevRotate) => prevRotate - 90)}
          >
            <FiRotateCcw size={15} />
            左旋
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-10"
            onPress={() => setImageRotate((prevRotate) => prevRotate + 90)}
          >
            <FiRotateCw size={15} />
            右旋
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-10"
            onPress={resetImageTransform}
          >
            重置
          </Button>
        </div>
      </div>
    </div>
  )
}

export const FileEditorModal = (props: FileEditorModalProps) => {
  const {
    isOpen,
    loading,
    selectedFile,
    draftContent,
    isDark,
    onOpenChange,
    onChangeDraft,
    onSaveRequest
  } = props

  const selectedFileName = selectedFile?.name || ''
  const selectedRelativePath = selectedFile?.relativePath || ''
  const editableFile = Boolean(selectedFile && isTextEditableFile(selectedFileName))
  const markdownFile = Boolean(selectedFile && isMarkdownFile(selectedFileName))
  const imageFile = Boolean(selectedFile && isImageFile(selectedFileName))
  const videoFile = Boolean(selectedFile && isVideoFile(selectedFileName))
  const pdfFile = Boolean(selectedFile && isPdfFile(selectedFileName))
  const previewUrl = useMemo<string>(() => {
    if (!selectedRelativePath) {
      return ''
    }
    return resolveFileContentUrl(selectedRelativePath)
  }, [selectedRelativePath])

  useEffect(() => {
    if (!isOpen || !editableFile) {
      return
    }
    const onKeydown = (event: KeyboardEvent): void => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
        event.preventDefault()
        onSaveRequest()
      }
    }
    window.addEventListener('keydown', onKeydown)
    return () => {
      window.removeEventListener('keydown', onKeydown)
    }
  }, [editableFile, isOpen, onSaveRequest])

  const copyCurrentPath = async (): Promise<void> => {
    if (!selectedRelativePath) {
      return
    }
    try {
      await navigator.clipboard.writeText(selectedRelativePath)
      toast('路径已复制', {
        description: selectedRelativePath,
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

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Backdrop variant="blur">
        <Modal.Container size="full">
          <Modal.Dialog className="h-dvh w-screen max-w-none rounded-none m-0 flex flex-col">
            <Modal.Header className="shrink-0 px-6 py-4 border-b border-border">
              <div className="w-full min-w-0 flex items-center justify-between gap-3">
                <Modal.Heading>{selectedFile?.name || '文件预览'}</Modal.Heading>
                <Tooltip delay={0}>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="ghost"
                    className="size-8 min-w-8"
                    onPress={copyCurrentPath}
                    isDisabled={!selectedFile}
                  >
                    <FiCopy size={15} />
                  </Button>
                  <Tooltip.Content><p>复制路径</p></Tooltip.Content>
                </Tooltip>
              </div>
            </Modal.Header>

            <Modal.Body className="p-0 min-h-0 flex-1 overflow-hidden">
              {loading ? (
                <div className="h-full flex items-center justify-center"><Spinner color="accent" /></div>
              ) : imageFile ? (
                <ImagePreviewPanel
                  key={selectedRelativePath || 'image-preview'}
                  previewUrl={previewUrl}
                  fileName={selectedFile?.name || 'image-preview'}
                />
              ) : videoFile ? (
                <div className="h-full w-full bg-black/95 flex items-center justify-center p-5">
                  <video
                    src={previewUrl}
                    controls
                    className="max-h-full max-w-full rounded-xl bg-black"
                  />
                </div>
              ) : pdfFile ? (
                <iframe
                  src={previewUrl}
                  title={selectedFile?.name || 'pdf-preview'}
                  className="h-full w-full"
                />
              ) : selectedFile && editableFile && markdownFile ? (
                <div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-2">
                  <div className="min-h-0 border-b border-border lg:border-b-0 lg:border-r">
                    <Editor
                      value={draftContent}
                      height="100%"
                      language={resolveEditorLanguage(selectedFile.name)}
                      theme={isDark ? 'vs-dark' : 'vs'}
                      onChange={(value) => onChangeDraft(value || '')}
                      options={{
                        readOnly: false,
                        minimap: { enabled: false },
                        smoothScrolling: true,
                        fontSize: 16,
                        lineNumbers: 'on',
                        wordWrap: 'on',
                        automaticLayout: true,
                        scrollBeyondLastLine: false
                      }}
                    />
                  </div>
                  <div className="h-full overflow-y-auto px-6 py-5">
                    <article className="markdown-body markdown-theme-adaptive">
                      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeRaw, rehypeKatex]}>
                        {draftContent}
                      </ReactMarkdown>
                    </article>
                  </div>
                </div>
              ) : selectedFile && editableFile ? (
                <Editor
                  value={draftContent}
                  height="100%"
                  language={resolveEditorLanguage(selectedFile.name)}
                  theme={isDark ? 'vs-dark' : 'vs'}
                  onChange={(value) => onChangeDraft(value || '')}
                  options={{
                    readOnly: false,
                    minimap: { enabled: false },
                    smoothScrolling: true,
                    fontSize: 16,
                    lineNumbers: 'on',
                    wordWrap: 'on',
                    automaticLayout: true,
                    scrollBeyondLastLine: false
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center px-6 text-default-500">
                  暂不支持该文件类型的预览
                </div>
              )}
            </Modal.Body>

            <Modal.Footer className="shrink-0 justify-end gap-3 border-t border-border px-6 py-4">
              <Button className="h-11 px-6 text-base" variant="ghost" onPress={() => onOpenChange(false)}>关闭</Button>
              {editableFile && (
                <Button className="h-11 px-6 text-base" variant="primary" onPress={onSaveRequest}>保存</Button>
              )}
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}
