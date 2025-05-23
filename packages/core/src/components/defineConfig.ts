import type { DefineConfig } from '@/types'

/**
 * webui 配置
 * @param config 配置
 * @returns 配置
 */
export const defineConfig = <T> (
  config: DefineConfig<T>
): DefineConfig<T> => {
  return config
}
