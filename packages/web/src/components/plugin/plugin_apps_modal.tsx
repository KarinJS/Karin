import { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/modal'
import { Button } from '@heroui/button'
import { useRequest } from 'ahooks'
import { request } from '@/lib/request'
import { FaEye, FaTrash } from 'react-icons/fa6'
import { toast } from 'react-hot-toast'
import Editor from '@monaco-editor/react'
import { useTheme } from '@/hooks/use-theme'
import { MdOutlineSaveAlt } from 'react-icons/md'

interface Props {
  isOpen: boolean
  onClose: () => void
  pluginName: string
}

export function PluginAppsModal ({ isOpen, onClose, pluginName }: Props) {
  const [fileContent, setFileContent] = useState<string | undefined>(undefined)
  const [editedContent, setEditedContent] = useState<string | undefined>(undefined)

  // 处理文件操作
  const { loading: fileOpLoading, run: handleFileOperation } = useRequest(
    async (fileName: string, operation: 'read' | 'delete') => {
      return request.serverPost<string, { pluginName: string; fileName: string; operation: string }>('/api/v1/plugin/file', {
        pluginName,
        fileName,
        operation,
      })
    },
    {
      manual: true,
      onSuccess: (result, [_, operation]) => {
        if (operation === 'read') {
          setFileContent(result || '')
          setEditedContent(result || '')
        } else if (operation === 'delete') {
          toast.success('文件删除成功')
          // 刷新文件列表
          fetchApps()
        }
      },
      onError: (error) => {
        toast.error(error.message || '操作失败')
      },
    }
  )

  // TODO:保存文件
  const { loading: saveLoading, run: saveFile } = useRequest(
    async (fileName: string, content: string) => {
      console.log(fileName, content)
      toast.success(fileName + '保存操作已触发，等待后端适配')
      return Promise.resolve()
    },
    {
      manual: true
    }
  )

  // 获取应用列表
  const { data: response, loading, run: fetchApps } = useRequest(
    async () => {
      return request.serverPost<string[], { name: string }>('/api/v1/plugin/apps', { name: pluginName })
    },
    {
      manual: true,
    }
  )

  // 当模态框打开时获取应用列表
  useEffect(() => {
    if (isOpen && pluginName) {
      fetchApps()
    }
  }, [isOpen, pluginName])

  const apps = response || []
  const { isDark } = useTheme()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size='3xl'
      scrollBehavior='inside'
    >
      <ModalContent>
        <ModalHeader>
          <h3 className='text-lg font-semibold'>应用列表</h3>
        </ModalHeader>
        <ModalBody className='py-6'>
          {loading ? (
            <div className='text-center py-4'>加载中...</div>
          ) : (
            <div className='space-y-4'>
              {apps.map((app) => (
                <div
                  key={app}
                  className='flex items-center justify-between p-3 bg-default-50 rounded-lg'
                >
                  <div className='flex-1 mr-4'>
                    <h4 className='text-sm font-medium'>{app}</h4>
                  </div>
                  <div className='flex gap-2'>
                    <Button
                      isIconOnly
                      size='sm'
                      variant='light'
                      color='primary'
                      isLoading={fileOpLoading}
                      onPress={() => handleFileOperation(app, 'read')}
                    >
                      <FaEye className='text-base' />
                    </Button>
                    <Button
                      isIconOnly
                      size='sm'
                      variant='light'
                      color='danger'
                      isLoading={fileOpLoading}
                      onPress={() => handleFileOperation(app, 'delete')}
                    >
                      <FaTrash className='text-base' />
                    </Button>
                  </div>
                </div>
              ))}

              {/* 文件内容预览模态框 */}
              {editedContent !== undefined && (
                <Modal
                  isOpen={editedContent !== undefined}
                  onClose={() => {
                    setFileContent(undefined)
                    setEditedContent(undefined)
                  }}
                  size='full'
                  scrollBehavior='inside'
                >
                  <ModalContent>
                    <ModalHeader>
                      <h3 className='text-lg font-semibold mr-4'>文件内容</h3>
                      <Button
                        className='w-20 h-7 text-xs font-bold'
                        isIconOnly
                        size='md'
                        variant='flat'
                        color='primary'
                        isLoading={saveLoading}
                        startContent={<MdOutlineSaveAlt className='mr-1' />}
                        onPress={() => {
                          if (fileContent && editedContent) {
                            // 这里可以获取当前文件名，假设文件名在 fileContent 读取时已经保存
                            // 这里简单假设文件名是之前读取的最后一个文件名，可根据实际情况修改
                            const currentFileName = apps[apps.length - 1]
                            saveFile(currentFileName, editedContent)
                          }
                        }}
                      >
                        保存
                      </Button>
                    </ModalHeader>
                    <ModalBody>
                      <Editor
                        language='javascript'
                        theme={isDark ? 'vs-dark' : 'vs'}
                        value={editedContent || ''}
                        options={{
                          readOnly: false
                        }}
                        onChange={(newValue) => setEditedContent(newValue)}
                      />
                    </ModalBody>
                  </ModalContent>
                </Modal>
              )}
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
