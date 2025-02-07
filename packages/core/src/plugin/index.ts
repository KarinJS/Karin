import { LoaderPlugin } from './loader'

export * from './list'

/**
 * @internal
 * @description 初始化插件
 */
export const initPlugin = () => new LoaderPlugin().init()
