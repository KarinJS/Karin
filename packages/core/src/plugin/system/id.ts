/**
 * 插件名称转ID
 * @param name 插件名称
 * @description 其实就是把`/`替换为`-`
 * @example
 * ```ts
 * const id = pluginNameToId('karin-plugin-example')
 * // id = 'karin-plugin-example'
 *
 * const id = pluginNameToId('@karinjs/adapter-qqbot')
 * // id = '@karinjs-adapter-qqbot'
 * ```
 */
export const pluginNameToId = (name: string) => {
  return name.replace(/\//g, '-')
}
