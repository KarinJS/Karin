import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '@/model/user.model'
import type { Slice } from '@reduxjs/toolkit'
import type { RootState } from '@/store'

const initialState: User = new User('')

export const userSlice: Slice<User> = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setInfo: (state, action: PayloadAction<string>) => {
      state = new User(action.payload)
      return state
    },
  },

})

export const { setInfo } = userSlice.actions

export const messages = (state: RootState) => state.user

export default userSlice.reducer
