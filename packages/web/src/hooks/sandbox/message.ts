// import { Message } from '@/model/message.model'
import { useAppDispatch, useAppSelector } from '../store'
import {
  setMessage as storeSetMessage,
  setEmptyIfNotExist as storeSetEmptyIfNotExist,
} from '@/store/modules/messages'
import { setMessage as storeSendMessage } from '@/store/modules/sends'

import store from '@/store'
import { OB11Message } from '@/types/onebot'

const useMessages = () => {
  const dispatch = useAppDispatch()

  const useWatch = () => {
    const messages = useAppSelector(state => state.messages)
    return messages
  }

  const setMessage = (user_id: number, messages: OB11Message) => {
    dispatch(storeSetMessage({ user_id, messages }))
  }

  const setMessages = (user_id: number, messages: OB11Message[]) => {
    messages.forEach(message => {
      setMessage(user_id, message)
    })
  }

  const sendMessage = async (user_id: number, message: OB11Message) => {
    // const current_user_id = store.getState().user.user_id

    dispatch(storeSendMessage({ user_id, message: message }))
  }

  const emptyIfNotExists = (user_id: number) => {
    if (!store.getState().messages.find(message => message.user_id === user_id)) {
      dispatch(storeSetEmptyIfNotExist(user_id))
    }
  }

  return {
    useWatch,
    setMessage,
    setMessages,
    sendMessage,
    emptyIfNotExists,
  }
}

export default useMessages
