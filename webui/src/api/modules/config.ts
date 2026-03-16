import api from '../client'
import type {
  ApiResponse,
  ConfigPermissions,
  ConfigServer,
  ConfigLogger,
  ConfigRedis,
  ConfigPm2,
  ConfigFilter,
  ConfigGroup,
  ConfigFriend,
  ConfigDirect,
  ConfigGuild
} from '../types'

/**
 * 获取权限配置
 */
export const getPermissions = () => {
  return api.get<ApiResponse<ConfigPermissions>>('/v2/config/permissions').then(res => res.data)
}

/**
 * 更新权限配置
 */
export const updatePermissions = (data: ConfigPermissions) => {
  return api.post<ApiResponse<null>>('/v2/config/permissions', data).then(res => res.data)
}

/**
 * 获取服务器配置
 */
export const getServerConfig = () => {
  return api.get<ApiResponse<ConfigServer>>('/v2/config/server').then(res => res.data)
}

/**
 * 更新服务器配置
 */
export const updateServerConfig = (data: ConfigServer) => {
  return api.post<ApiResponse<null>>('/v2/config/server', data).then(res => res.data)
}

/**
 * 获取日志配置
 */
export const getLoggerConfig = () => {
  return api.get<ApiResponse<ConfigLogger>>('/v2/config/logger').then(res => res.data)
}

/**
 * 更新日志配置
 */
export const updateLoggerConfig = (data: ConfigLogger) => {
  return api.post<ApiResponse<null>>('/v2/config/logger', data).then(res => res.data)
}

/**
 * 获取 Redis 配置
 */
export const getRedisConfig = () => {
  return api.get<ApiResponse<ConfigRedis>>('/v2/config/redis').then(res => res.data)
}

/**
 * 更新 Redis 配置
 */
export const updateRedisConfig = (data: ConfigRedis) => {
  return api.post<ApiResponse<null>>('/v2/config/redis', data).then(res => res.data)
}

/**
 * 获取 PM2 配置
 */
export const getPm2Config = () => {
  return api.get<ApiResponse<ConfigPm2>>('/v2/config/pm2').then(res => res.data)
}

/**
 * 更新 PM2 配置
 */
export const updatePm2Config = (data: ConfigPm2) => {
  return api.post<ApiResponse<null>>('/v2/config/pm2', data).then(res => res.data)
}

/**
 * 获取过滤配置
 */
export const getFilterConfig = () => {
  return api.get<ApiResponse<ConfigFilter>>('/v2/config/filter').then(res => res.data)
}

/**
 * 更新过滤配置
 */
export const updateFilterConfig = (data: ConfigFilter) => {
  return api.post<ApiResponse<null>>('/v2/config/filter', data).then(res => res.data)
}

/**
 * 获取群聊场景配置
 */
export const getGroupConfig = () => {
  return api.get<ApiResponse<ConfigGroup>>('/v2/config/group').then(res => res.data)
}

/**
 * 更新群聊场景配置
 */
export const updateGroupConfig = (data: ConfigGroup) => {
  return api.post<ApiResponse<null>>('/v2/config/group', data).then(res => res.data)
}

/**
 * 获取好友场景配置
 */
export const getFriendConfig = () => {
  return api.get<ApiResponse<ConfigFriend>>('/v2/config/friend').then(res => res.data)
}

/**
 * 更新好友场景配置
 */
export const updateFriendConfig = (data: ConfigFriend) => {
  return api.post<ApiResponse<null>>('/v2/config/friend', data).then(res => res.data)
}

/**
 * 获取频道私信场景配置
 */
export const getDirectConfig = () => {
  return api.get<ApiResponse<ConfigDirect>>('/v2/config/direct').then(res => res.data)
}

/**
 * 更新频道私信场景配置
 */
export const updateDirectConfig = (data: ConfigDirect) => {
  return api.post<ApiResponse<null>>('/v2/config/direct', data).then(res => res.data)
}

/**
 * 获取频道场景配置
 */
export const getGuildConfig = () => {
  return api.get<ApiResponse<ConfigGuild>>('/v2/config/guild').then(res => res.data)
}

/**
 * 更新频道场景配置
 */
export const updateGuildConfig = (data: ConfigGuild) => {
  return api.post<ApiResponse<null>>('/v2/config/guild', data).then(res => res.data)
}
