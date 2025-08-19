// Dialog Context
import React from 'react'

import type { ModalProps } from '@/components/modal'
import Modal from '@/components/modal'

export interface AlertProps {
  title?: React.ReactNode
  content: React.ReactNode
  size?: ModalProps['size']
  dismissible?: boolean
  onConfirm?: () => void
}

export interface ConfirmProps {
  title?: React.ReactNode
  content: React.ReactNode
  size?: ModalProps['size']
  dismissible?: boolean
  confirmDisabled?: boolean
  onConfirm?: () => void
  onCancel?: () => void
}

export interface ModalItem extends ModalProps {
  id: number
}

export interface DialogContextProps {
  alert: (config: AlertProps) => void
  confirm: (config: ConfirmProps) => number
  updateDialog: (id: number, updates: Partial<ModalItem>) => void
}

export const DialogContext = React.createContext<DialogContextProps>({
  alert: () => { },
  confirm: () => 0,
  updateDialog: () => { },
})

const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dialogs, setDialogs] = React.useState<ModalItem[]>([])

  const alert = (config: AlertProps) => {
    const { title, content, dismissible, onConfirm, size = 'md' } = config

    setDialogs(before => {
      const id = before[before.length - 1]?.id + 1 || 0

      return [
        ...before,
        {
          id,
          content,
          size,
          title,
          backdrop: 'blur',
          showCancel: false,
          dismissible,
          onConfirm: () => {
            onConfirm?.()
            setTimeout(() => {
              setDialogs(before => before.filter(item => item.id !== id))
            }, 300)
          },
        },
      ]
    })
  }

  /** 更新指定dialog的属性 */
  const updateDialog = (id: number, updates: Partial<ModalItem>) => {
    setDialogs(prevDialogs =>
      prevDialogs.map(dialog =>
        dialog.id === id ? { ...dialog, ...updates } : dialog
      )
    )
  }

  const confirm = (config: ConfirmProps): number => {
    const { title, content, dismissible, confirmDisabled, onConfirm, onCancel, size = 'md' } = config
    let newId: number

    setDialogs(prevDialogs => {
      newId = prevDialogs[prevDialogs.length - 1]?.id + 1 || 0

      return [
        ...prevDialogs,
        {
          id: newId,
          content,
          size,
          title,
          backdrop: 'blur',
          showCancel: true,
          dismissible,
          confirmDisabled,
          onConfirm: () => {
            onConfirm?.()
            setTimeout(() => {
              setDialogs(prevDialogs => prevDialogs.filter(item => item.id !== newId))
            }, 300)
          },
          onCancel: () => {
            onCancel?.()
            setTimeout(() => {
              setDialogs(prevDialogs => prevDialogs.filter(item => item.id !== newId))
            }, 300)
          },
        },
      ]
    })

    return newId!
  }

  return (
    <DialogContext.Provider
      value={{
        alert,
        confirm,
        updateDialog,
      }}
    >
      {children}
      {dialogs?.map(({ id, ...props }) => <Modal key={id} {...props} />)}
    </DialogContext.Provider>
  )
}

export default DialogProvider
