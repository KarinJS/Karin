import { configureStore } from '@reduxjs/toolkit'
// 模块
import messagesReducer from './modules/messages'
import userReducer from './modules/user'
import sendsReducer from './modules/sends'
// 创建store
const store = configureStore({
  reducer: {
    messages: messagesReducer,
    user: userReducer,
    sends: sendsReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store
