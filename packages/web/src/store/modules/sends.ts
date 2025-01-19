import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Slice } from '@reduxjs/toolkit'

import type { RootState } from '@/store'
import { OB11Message } from '@/types/onebot'

export interface SendMessage {
  user_id: number
  messages: OB11Message[]
}

const initialState: SendMessage[] = []

export const sendsSlice: Slice<SendMessage[]> = createSlice({
  name: 'sends',
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<{ user_id: number; message: OB11Message }>) => {
      const index = state.findIndex(item => item.user_id === action.payload.user_id)
      if (index === -1) {
        state.push({ user_id: action.payload.user_id, messages: [action.payload.message] })
      } else {
        state[index].messages.push(action.payload.message)
      }
    },
  },
})

export const { setMessage } = sendsSlice.actions

export const messages = (state: RootState) => state.sends

export default sendsSlice.reducer
