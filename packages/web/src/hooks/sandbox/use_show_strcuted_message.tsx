import { createElement } from 'react'

import ShowStructedMessage from '@/components/sandbox/chat_input/components/show_structed_message'
import type { Elements } from '@/types/segment'

import useDialog from '../use-dialog'

const useShowStructuredMessage = () => {
  const dialog = useDialog()

  const showStructuredMessage = (messages: Elements[]) => {
    dialog.alert({
      title: '消息内容',
      size: '3xl',
      content: createElement(ShowStructedMessage, {
        messages,
      }),
    })
  }

  return showStructuredMessage
}

export default useShowStructuredMessage
