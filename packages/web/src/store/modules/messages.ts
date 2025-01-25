import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store'
import type { SandboxEvent } from '@/types/sandbox'

interface MessagesState {
  user_id: string
  messages: SandboxEvent[]
}

const initialState: MessagesState[] = []

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<{ user_id: string; message: SandboxEvent }>) => {
      const { user_id, message } = action.payload
      const userMessages = state.find(item => item.user_id === user_id)
      if (userMessages) {
        userMessages.messages.push(message)
      } else {
        state.push({
          user_id,
          messages: [message]
        })
      }
    },
    setEmptyIfNotExist: (state, action: PayloadAction<string>) => {
      const user_id = action.payload
      if (!state.find(item => item.user_id === user_id)) {
        state.push({
          user_id,
          messages: []
        })
      }
    }
  }
})

export const { setMessage, setEmptyIfNotExist } = messagesSlice.actions

export const selectMessages = (state: RootState) => state.messages

export default messagesSlice.reducer
