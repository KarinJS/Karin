import { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import { Button } from '@heroui/button'
import { useRequest } from 'ahooks'
import { request } from '@/lib/request'
import { FaEye, FaTrash } from 'react-icons/fa6'
import { toast } from 'react-hot-toast'
import CodeEditor from '@/components/code_editor'
import { Code } from '@heroui/code'
import { Tooltip } from '@heroui/tooltip'

interface Props {
  isOpen: boolean
  onClose: () => void
  pluginName: string
}

export function PluginAppsModal ({ isOpen, onClose, pluginName }: Props) {
  const [fileContent, setFileContent] = useState<string | undefined>(undefined)
  const [editedContent, setEditedContent] = useState<string | undefined>(undefined)
  const [showUninstallConfirm, setShowUninstallConfirm] = useState(false)
  const [uninstallFileName, setUninstallFileName] = useState<string | undefined>(undefined)

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

  const handleUninstall = () => {
    if (uninstallFileName) {
      handleFileOperation(uninstallFileName, 'delete')
      setUninstallFileName(undefined)
    }
  }

  return (
    <>
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
                        <Tooltip content='查看/编辑' showArrow offset={15}>
                          <FaEye className='text-base' />
                        </Tooltip>
                      </Button>
                      <Button
                        isIconOnly
                        size='sm'
                        variant='light'
                        color='danger'
                        isLoading={fileOpLoading}
                        onPress={() => {
                          setUninstallFileName(app)
                          setShowUninstallConfirm(true)
                        }}
                      >
                        <Tooltip content='删除' showArrow offset={15}>
                          <FaTrash className='text-base' />
                        </Tooltip>
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
                        <div className='flex items-center'>
                          <h3 className='text-lg font-semibold mr-4'>编辑文件</h3>
                          <Code className='ml-2 text-xl'>{apps[apps.length - 1]}</Code>
                        </div>
                      </ModalHeader>
                      <ModalBody className='p-0'>
                        <CodeEditor
                          language='javascript'
                          height='100%'
                          options={{ wordWrap: 'on' }}
                          value={editedContent || ''}
                          onChange={(newValue) => setEditedContent(newValue)}
                        />
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          size='md'
                          variant='flat'
                          color='primary'
                          onPress={() => {
                            setFileContent(undefined)
                            setEditedContent(undefined)
                          }}
                        >
                          取消
                        </Button>
                        <Button
                          size='md'
                          variant='shadow'
                          color='primary'
                          isLoading={saveLoading}
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
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                )}
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* 删除确认弹窗 */}
      <Modal
        isOpen={showUninstallConfirm}
        onOpenChange={() => setShowUninstallConfirm(false)}
        size='sm'
      >
        <ModalContent>
          <ModalHeader>
            <h3 className='text-lg font-semibold'>确认删除</h3>
          </ModalHeader>
          <ModalBody>
            <p className='text-sm text-default-600'>
              您确定要删除文件 <Code className='text-[#F55081] font-bold'>{uninstallFileName}</Code> 吗？
              <br />
              此操作不可逆，请谨慎操作。
            </p>
          </ModalBody>
          <ModalFooter>
            <div className='flex gap-2'>
              <Button
                color='default'
                variant='light'
                onPress={() => setShowUninstallConfirm(false)}
              >
                取消
              </Button>
              <Button
                color='danger'
                onPress={() => {
                  setShowUninstallConfirm(false)
                  handleUninstall()
                }}
                isLoading={fileOpLoading}
              >
                确认删除
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
