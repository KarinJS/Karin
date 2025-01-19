import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '@/model/user.model'
import type { Slice } from '@reduxjs/toolkit'

import type { RootState } from '@/store'
import type { UserInfo } from '@/types/onebot'

const initialState: UserInfo = new User(0).toJSON()

export const userSlice: Slice<UserInfo> = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setInfo: (state, action: PayloadAction<number>) => {
      state = new User(action.payload).toJSON()
      return state
    },
  },
})

export const { setInfo } = userSlice.actions

export const messages = (state: RootState) => state.user

export default userSlice.reducer
