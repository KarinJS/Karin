import lodash from 'lodash'
import { defaultConfig } from './default'
import type { ConfigFormatMap, ConfigGroupValue, ConfigMap, ConfigPrivateValue } from './types'

/**
 * 配置格式化工具类
 */
export class Formatter {
  /**
   * 传入一个数组 将数组中所有元素为字符串
   * @param data 数据
   */
  static formatArray (data: any[]) {
    try {
      return data.map((v: string) => String(v)) || []
    } catch {
      return []
    }
  }

  /**
   * 如果传入的值是数字则返回数字 否则返回默认值
   * @param taget 目标值
   * @param defaultValue 默认值
   * @returns 数字
   */
  static number (taget: unknown, defaultValue: number): number {
    if (typeof taget === 'number') return taget
    return defaultValue
  }

  /**
   * 传入一个对象 将对象中的嵌套数组中所有元素为字符串
   * @param data 数据
   * @returns 统一后的数据
   */
  static formatObject<T extends Record<string, any>> (data: T): T {
    const list = {} as Record<string, any>

    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        list[key] = Formatter.formatArray(value)
        return
      }

      if (typeof value === 'object') {
        list[key] = Formatter.formatObject(value)
        return
      }

      list[key] = value
    })
    return list as T
  }

  /**
   * 从数组中查找第一个数字，如果没有则返回默认值
   * @param arr 数组
   * @param defaultValue 默认值
   * @returns 找到的数字或默认值
   */
  static findFirstNumber<T = number> (arr: unknown[], defaultValue: number = 0): T {
    const num = lodash.first(lodash.filter(arr, item => typeof item === 'number'))
    return (num !== undefined ? num : defaultValue) as T
  }

  /**
   * 合并多个数组并去重
   * @param arrays 多个数组
   * @returns 合并后的数组
   */
  static mergeArrays<T> (...arrays: unknown[]): T[] {
    const validArrays = lodash.filter(arrays, Array.isArray)
    return lodash.uniq(lodash.flatten(validArrays)) as T[]
  }

  /**
   * 从数组中提取字符串数组
   * @param arrays 数组
   * @returns 字符串数组
   */
  static extractStringArray (arrays: unknown[]): string[] {
    for (const item of arrays) {
      if (!Array.isArray(item)) continue
      return lodash.filter<string>(item, value => typeof value === 'string' && value.length > 0)
    }
    return []
  }

  /**
   * 格式化文件配置
   */
  static format<T extends keyof ConfigFormatMap> (file: T, data: ConfigFormatMap[T]['params']): ConfigFormatMap[T]['result'] {
    if (file === 'adapter') {
      return Formatter.formatAdapter(data as ConfigMap['adapter']) as any
    }

    if (file === 'config') {
      return Formatter.formatConfig(data as ConfigMap['config']) as any
    }

    if (file === 'groups') {
      return Formatter.formatGroups(data as ConfigMap['groups']) as any
    }

    if (file === 'pm2') {
      return data as ConfigMap['pm2'] as any
    }

    if (file === 'privates') {
      return Formatter.formatPrivates(data as ConfigMap['privates']) as any
    }

    if (file === 'redis') {
      return data as ConfigMap['redis'] as any
    }

    if (file === 'render') {
      return Formatter.formatRender(data as ConfigMap['render']) as any
    }

    if (file === 'env') {
      return Formatter.envParse(String(data)) as any
    }

    return data as any
  }

  /**
   * 格式化适配器配置
   * @param data 适配器配置
   * @returns 格式化后的适配器配置
   */
  static formatAdapter (data: ConfigMap['adapter']): ConfigMap['adapter'] {
    return {
      console: {
        ...data.console,
        token: String(data.console.token),
      },
      onebot: {
        ws_server: {
          ...data.onebot.ws_server,
          timeout: Formatter.number(data.onebot.ws_server.timeout, 120),
        },
        ws_client: data.onebot.ws_client.map(v => ({
          ...v,
          reconnectTime: Formatter.number(v.reconnectTime, 5000),
          reconnectAttempts: Formatter.number(v.reconnectAttempts, 100),
          token: String(v.token),
        })),
        http_server: data.onebot.http_server.map(v => ({
          ...v,
          api_token: String(v?.api_token) || String(v.token),
          post_token: String(v.post_token),
          heartbeat: Formatter.number(v.heartbeat, 5000),
          timeout: Formatter.number(v.timeout, 5000),
        })),
      },
    }
  }

  /**
   * 格式化config配置
   * @param data config配置
   * @returns 格式化后的config配置
   */
  static formatConfig (data: ConfigMap['config']) {
    return Formatter.formatObject(data)
  }

  /**
   * 通用的配置合并逻辑，用于处理group和private配置
   * @param key 键
   * @param inherit 是否继承全局配置
   * @param data 当前配置
   * @param defaultData 默认配置
   * @param globalData 全局配置
   * @param includesMember 是否包含member相关字段
   */
  static mergeCommonConfigs<T extends ConfigGroupValue | ConfigPrivateValue> (
    key: string,
    inherit: boolean,
    data: T,
    defaultData: T,
    globalData?: T,
    includesMember: boolean = false
  ) {
    if (typeof inherit !== 'boolean') {
      inherit = true
    }

    // 通用的字段
    const cd = inherit ? [data.cd, defaultData.cd, globalData?.cd] : [data.cd, defaultData.cd]
    const mode = inherit ? [data.mode, defaultData.mode, globalData?.mode] : [data.mode, defaultData.mode]
    const alias = inherit
      ? Formatter.mergeArrays<string>(data.alias, defaultData.alias, globalData?.alias)
      : Formatter.mergeArrays<string>(data.alias, defaultData.alias)
    const enable = inherit
      ? Formatter.mergeArrays<string>(data.enable, defaultData.enable, globalData?.enable)
      : Formatter.mergeArrays<string>(data.enable, defaultData.enable)
    const disable = inherit
      ? Formatter.mergeArrays<string>(data.disable, defaultData.disable, globalData?.disable)
      : Formatter.mergeArrays<string>(data.disable, defaultData.disable)

    // 基本结构
    const result: any = {
      key,
      inherit,
      cd: Formatter.findFirstNumber(cd, 1),
      mode: Formatter.findFirstNumber(mode, 0),
      alias: Formatter.extractStringArray(alias),
      enable: Formatter.extractStringArray(enable),
      disable: Formatter.extractStringArray(disable),
    }

    // 针对群组配置添加额外字段
    if (includesMember) {
      const groupData = data as ConfigGroupValue
      const groupDefaultData = defaultData as ConfigGroupValue
      const groupGlobalData = globalData as ConfigGroupValue | undefined

      const userCD = inherit
        ? [groupData.userCD, groupDefaultData.userCD, groupGlobalData?.userCD]
        : [groupData.userCD, groupDefaultData.userCD]

      const memberEnable = inherit
        ? Formatter.mergeArrays<string>(groupData.member_enable, groupDefaultData.member_enable, groupGlobalData?.member_enable)
        : Formatter.mergeArrays<string>(groupData.member_enable, groupDefaultData.member_enable)

      const memberDisable = inherit
        ? Formatter.mergeArrays<string>(groupData.member_disable, groupDefaultData.member_disable, groupGlobalData?.member_disable)
        : Formatter.mergeArrays<string>(groupData.member_disable, groupDefaultData.member_disable)

      result.userCD = Formatter.findFirstNumber(userCD, 1)
      result.member_enable = Formatter.extractStringArray(memberEnable)
      result.member_disable = Formatter.extractStringArray(memberDisable)
    }

    return result as T
  }

  /**
   * 格式化`groups.json`配置文件
   * @param data 配置文件数据
   * @description 为保证配置的一致和可用性，每个字段会按照以下顺序进行合并
   * - 自定义 > 默认配置 > 全局配置
   */
  static formatGroups (data: ConfigMap['groups']) {
    /** 默认: 全局配置 */
    const defaultGlobal = defaultConfig.groups[1]
    /** 默认: 群聊默认配置 */
    const defaultGroup = defaultConfig.groups[0]

    /** 自定义: 全局配置 */
    const userGlobal = lodash.find(data, item => item.key === 'global') || defaultGlobal
    /** 自定义: 群聊默认配置 */
    const userGroup = lodash.find(data, item => item.key === 'default') || defaultGroup

    /** 合并后的全局配置 */
    const global = Formatter.mergeCommonConfigs<ConfigGroupValue>('global', true, userGlobal, defaultGlobal, undefined, true)
    /** 合并后的群聊默认配置 */
    const def = Formatter.mergeCommonConfigs<ConfigGroupValue>('default', true, userGroup, defaultGroup, undefined, true)

    /** 将缓存修改为kv格式 方便调用 */
    const kv: Record<string, ConfigGroupValue> = { global, default: def }

    data.forEach(item => {
      kv[item.key] = Formatter.mergeCommonConfigs(item.key, item.inherit, item, kv.global, kv.default, true)
    })

    return kv
  }

  /**
   * 格式化`privates.json`配置文件
   * @param data 配置文件数据
   * @description 为保证配置的一致和可用性，每个字段会按照以下顺序进行合并
   * - 自定义 > 默认配置 > 全局配置
   */
  static formatPrivates (data: ConfigMap['privates']) {
    /** 默认: 全局配置 */
    const defaultGlobal = defaultConfig.privates[1]
    /** 默认: 群聊默认配置 */
    const defaultGroup = defaultConfig.privates[0]

    /** 自定义: 全局配置 */
    const userGlobal = lodash.find(data, item => item.key === 'global') || defaultGlobal
    /** 自定义: 群聊默认配置 */
    const userGroup = lodash.find(data, item => item.key === 'default') || defaultGroup

    /** 合并后的全局配置 */
    const global = Formatter.mergeCommonConfigs<ConfigPrivateValue>('global', true, userGlobal, defaultGlobal)
    /** 合并后的群聊默认配置 */
    const def = Formatter.mergeCommonConfigs<ConfigPrivateValue>('default', true, userGroup, defaultGroup)

    /** 将缓存修改为kv格式 方便调用 */
    const kv: Record<string, ConfigPrivateValue> = { global, default: def }

    data.forEach(item => {
      kv[item.key] = Formatter.mergeCommonConfigs(item.key, item.inherit, item, kv.global, kv.default)
    })

    return kv
  }

  /**
   * 格式化渲染配置
   * @param data 渲染配置
   * @returns 格式化后的渲染配置
   */
  static formatRender (data: ConfigMap['render']) {
    return {
      ws_server: {
        enable: typeof data.ws_server.enable === 'boolean' ? data.ws_server.enable : false,
      },
      ws_client: Array.from(data.ws_client).map(v => ({
        enable: typeof v.enable === 'boolean' ? v.enable : false,
        url: String(v.url),
        isSnapka: typeof v.isSnapka === 'boolean' ? v.isSnapka : false,
        reconnectTime: Formatter.number(v.reconnectTime, 5000),
        heartbeatTime: Formatter.number(v.heartbeatTime, 30000),
        token: String(v.token),
      })),
      http_server: Array.from(data.http_server).map(v => ({
        enable: typeof v.enable === 'boolean' ? v.enable : false,
        url: String(v.url),
        isSnapka: typeof v.isSnapka === 'boolean' ? v.isSnapka : false,
        token: String(v.token),
      })),
    }
  }

  /**
   * 解析env文件
   * @param content 内容
   * @returns 解析后的对象
   */
  static envParse (content: string) {
    const lines = content.split('\n')
    const list: { key: string, value: string, comment: string }[] = []

    /** 反序成对象 */
    const obj: Record<string, string> = {}
    lines.forEach((line, index) => {
      obj[index] = line
    })

    lines.forEach((line, index) => {
      /** 跳过非kv元素 */
      if (!line.includes('=')) return

      let comment = ''
      let [key, value] = line.split('=').map((item) => item.trim())

      /**
       * 这里包含#的用2种情况
       * 1. 写在后续的注释
       * 2. 在value中 但是被包裹在""中
       */
      if (value.includes('#')) {
        /** 提取""中的内容 */
        const data = value.match(/^".*"$/)
        if (data) {
          /** 说明在一行之中同时包含value和 #注释 */
          value = data[0]
          comment = value.replace(value, '') || ''
        } else {
          /** 如果提取不到 则说明不包含""的value 但是包含注释 */
          const arr = value.split('#').map((item) => item.trim())
          comment = arr.length > 1 ? `# ${arr[1]}` : ''
          value = arr[0]
        }
      }

      /** 如果comment为空 尝试获取上一行的 */
      if (!comment) {
        const data = obj[index - 1]?.trim()
        if (data?.startsWith('#')) comment = data
      }

      value = value?.replace(/^"|"$/g, '') || ''
      list.push({ key, value, comment: comment.replace(/\\r|\\n/g, '').trim() })
    })

    /** 返回对象 */
    const result: Record<string, { value: string; comment: string }> = {}
    list.forEach((item) => {
      result[item.key] = {
        value: item.value,
        comment: item.comment,
      }
    })

    return result
  }
}
