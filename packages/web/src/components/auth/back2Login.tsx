import key from '@/consts/key.ts'
import { Toast, toast } from 'react-hot-toast'

const FINAL_REQUEST = 'FINAL_REQUEST'
/** 3小时 */
const REQUEST_TIMEOUT = 3 * 60 * 60 * 1000
// const REQUEST_TIMEOUT = 10000

type ExtendedToastOptions = Partial<Toast> & {
  onDismiss?: () => void
}

/**
 * 检查登录状态，如果请求超时则跳转到登录页面
 */
export const checkRequestTimeout = (navigate: (to: string) => void) => {
  const requestLogStr = localStorage.getItem(FINAL_REQUEST)
  if (requestLogStr) {
    const lastRequestTimestamp = JSON.parse(requestLogStr)
    const currentTimestamp = Date.now()
    if (currentTimestamp - lastRequestTimestamp > REQUEST_TIMEOUT) {
      // 超时，清空 token
      localStorage.removeItem(key.accessToken)

      // 显示提示信息
      const toastOptions: ExtendedToastOptions = {
        duration: 5000, // 提示显示的时长，单位为毫秒
      }
      toast.error('登录会话过期，5秒后跳转登录界面', toastOptions)
      setTimeout(() => {
        navigate('/login')
      }, 5000)
    }
  }
}
