import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Slice } from '@reduxjs/toolkit'

import type { RootState } from '@/store'
import { OB11Message } from '@/types/onebot'

export interface UserMessage {
  user_id: number
  messages: OB11Message[]
}

const initialState: UserMessage[] = [
  {
    user_id: 1,
    messages: [],
  },
]

export const messagesSlice: Slice<UserMessage[]> = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<OB11Message>) => {
      const index = state.findIndex(item => item.user_id === action.payload.sender.user_id)
      if (index !== -1) {
        state[index].messages.push(action.payload)
      } else {
        state.push({
          user_id: action.payload.sender.user_id,
          messages: [action.payload],
        })
      }
    },
    setEmptyIfNotExist: (state, action: PayloadAction<number>) => {
      const index = state.findIndex(item => item.user_id === action.payload)
      if (index === -1) {
        state.push({
          user_id: action.payload,
          messages: [],
        })
      }
    },
  },
})

export const { setMessage, setEmptyIfNotExist } = messagesSlice.actions

export const messages = (state: RootState) => state.messages

export default messagesSlice.reducer
