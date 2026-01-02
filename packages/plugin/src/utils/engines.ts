/**
 * 引擎版本检查器
 * @description 使用新的 store API 重构
 */
import { engineSettings } from '../store'

/**
 * 引擎检查器
 */
export const engines = {
  /**
   * 检查插件的 engines 配置是否符合要求
   * @param packageName - 插件包名称
   * @param enginesVersion - package.json 中的 engines 配置
   * @param ignoreEngines - 是否忽略引擎版本检查
   * @returns 是否符合要求
   */
  check: (
    packageName: string,
    enginesVersion?: string,
    ignoreEngines: boolean = false
  ): boolean => {
    return engineSettings.check(packageName, enginesVersion, ignoreEngines)
  },

  /**
   * 打印不符合 engines 要求的插件包提示信息
   */
  print: (): void => {
    engineSettings.print()
  },
}
