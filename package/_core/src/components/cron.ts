import type { CronProps } from '@/types/components'

/**
 * 创建 cron 配置
 * @param key 唯一标识符
 * @param config cron 配置（可选）
 */
const createCron = (
  key: string,
  config: Partial<Omit<CronProps, 'key' | 'componentType'>> = {}
): CronProps => ({
  componentType: 'cron',
  ...config,
  key,
})

/**
 * cron编辑器组件
 */
export const cron = {
  /**
   * 创建基础分隔线
   * @param key 唯一标识符
   * @param options 分隔线配置
   */
  create: (key: string, options: Omit<CronProps, 'key' | 'componentType'> = {}) => createCron(key, options),
}
