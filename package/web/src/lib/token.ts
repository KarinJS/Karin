import key from '@/consts/key'

/**
 * 获取访问令牌
 */
export const getAccessToken = () => {
  return localStorage.getItem(key.accessToken)
}

/**
 * 获取刷新令牌
 */
export const getRefreshToken = () => {
  return localStorage.getItem(key.refreshToken)
}

/**
 * 获取用户ID
 */
export const getUserId = () => {
  return localStorage.getItem(key.userId)
}

/**
 * 设置访问令牌
 */
export const setAccessToken = (token: string) => {
  localStorage.setItem(key.accessToken, token)
}

/**
 * 设置刷新令牌
 */
export const setRefreshToken = (token: string) => {
  localStorage.setItem(key.refreshToken, token)
}

/**
 * 设置用户ID
 */
export const setUserId = (id: string) => {
  localStorage.setItem(key.userId, id)
}

/**
 * 清除访问令牌
 */
export const clearAccessToken = () => {
  localStorage.removeItem(key.accessToken)
}

/**
 * 清除刷新令牌
 */
export const clearRefreshToken = () => {
  localStorage.removeItem(key.refreshToken)
}

/**
 * 清除用户ID
 */
export const clearUserId = () => {
  localStorage.removeItem(key.userId)
}
