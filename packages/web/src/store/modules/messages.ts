import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import type { RootState } from '@/store'
// import type { SandboxEvent } from '@/types/sandbox'

interface MessagesState {
  user_id: string
  type: 'friend' | 'group'
  messages: any[]
}

const initialState: MessagesState[] = []

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<{ user_id: string; message: any }>) => {
      const { user_id: userId, message } = action.payload
      const userMessages = state.find(item => item.user_id === userId)
      if (userMessages) {
        userMessages.messages.push(message)
      } else {
        state.push({
          type: message.type,
          user_id: userId,
          messages: [message],
        })
      }
    },
    setEmptyIfNotExist: (state, action: PayloadAction<{ id: string, type: 'friend' | 'group' }>) => {
      const { id, type } = action.payload
      if (!state.find(item => item.user_id === id)) {
        state.push({
          type,
          user_id: id,
          messages: [],
        })
      }
    },
  },
})

export const { setMessage, setEmptyIfNotExist } = messagesSlice.actions

export const selectMessages = (state: any) => state.messages

export default messagesSlice.reducer
