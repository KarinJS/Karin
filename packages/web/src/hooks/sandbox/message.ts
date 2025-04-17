// import { Message } from '@/model/message.model'
// import { useAppDispatch, useAppSelector } from '../store'
// import { setMessage, setEmptyIfNotExist } from '@/store/modules/messages'
// import type { SandboxEvent } from '@/types/sandbox'

const useMessages = () => {
  // const dispatch = useAppDispatch()

  // const useWatch = () => {
  //   const messages = useAppSelector(state => state.messages)
  //   return messages
  // }

  // const setMessageToStore = (user_id: string, message: SandboxEvent) => {
  //   dispatch(setMessage({ user_id, message }))
  // }

  // const sendMessage = async (user_id: string, message: SandboxEvent) => {
  //   // 确保消息对象是可序列化的
  //   const serializedMessage = {
  //     ...message,
  //     type: message.type,
  //     seq: message.seq,
  //     messageId: message.messageId,
  //     time: message.time,
  //     elements: message.elements,
  //     ...(message.type === 'group'
  //       ? {
  //           groupId: user_id,
  //           groupName: '群聊',
  //         }
  //       : {}),
  //   } as SandboxEvent

  //   dispatch(setMessage({ user_id, message: serializedMessage }))
  // }

  // const emptyIfNotExists = (user_id: string, type: 'friend' | 'group') => {
  //   dispatch(setEmptyIfNotExist({ id: user_id, type }))
  // }

  // return {
  //   useWatch,
  //   setMessage: setMessageToStore,
  //   sendMessage,
  //   emptyIfNotExists,
  // }
}

export default useMessages
